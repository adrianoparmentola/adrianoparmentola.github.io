// Genera l'icona del sito e la scheda di anteprima dei link (Open Graph).
//
//   node scripts/social-card.mjs
//
//   public/favicon.svg            icona della scheda: il punto lime della barra
//   public/favicon-32.png         ripiego per i browser senza icone SVG
//   public/apple-touch-icon.png   icona "aggiungi a Home" su iPhone
//   public/og.jpg                 1200×630, quello che WhatsApp, LinkedIn e
//                                 iMessage mostrano quando si incolla il link
//
// La scheda è impaginata in HTML con i font del sito e fotografata con Edge
// headless, come il portfolio PDF: stessa identità, nessuna dipendenza.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const PROJECTS = path.join(ROOT, 'src/content/projects');
// Edge non scrive in percorsi con spazi o accenti: si lavora in una cartella
// temporanea ASCII e si copia il risultato
const WORK = path.join(os.tmpdir(), 'social-card-build');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const INK = '#141414';
const PAPER = '#f6f5f1';
const LIME = '#c6ff3d';

fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');

// ---------------------------------------------------------------- icona
// Il punto lime che "respira" accanto al nome nella barra, su fondo carbone.
// Regge anche a 16px, dove un monogramma diventerebbe una macchia.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  <circle cx="32" cy="32" r="13" fill="${LIME}"/>
</svg>
`;
fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), favicon);
await sharp(Buffer.from(favicon), { density: 300 }).resize(32, 32).png().toFile(path.join(PUBLIC, 'favicon-32.png'));
// iOS arrotonda da sé l'icona: qui il fondo è pieno, senza angoli trasparenti
const touch = favicon.replace('rx="14"', 'rx="0"');
await sharp(Buffer.from(touch), { density: 300 }).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

// ---------------------------------------------------------------- scheda
const STRIP = [
  ['sabor-de-espana', 'serata.webp'],
  ['talea', 'hero-clean.webp'],
  ['humus', 'boxes-showcase.webp'],
  // il poster ha una riga di crediti in basso: se ne taglia il 14%
  ['contatto', 'hero.webp', 0.14],
  ['autonomia', 'hero.webp'],
];
const thumbs = [];
for (const [slug, file, trimBottom = 0] of STRIP) {
  const out = path.join(WORK, `${slug}.jpg`);
  const src = path.join(PROJECTS, slug, 'assets', file);
  const meta = await sharp(src).metadata();
  await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * (1 - trimBottom)) })
    .flatten({ background: PAPER })
    .resize(480, 320, { fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(out);
  thumbs.push(fileUrl(out));
}

const font = (f) => fileUrl(path.join(PUBLIC, 'fonts', f));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: H; src: url('${font('Helvetica-Bold.ttf')}'); font-weight: 700; }
@font-face { font-family: H; src: url('${font('Helvetica-Regular.ttf')}'); font-weight: 400; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  background: ${INK}; color: ${PAPER};
  font-family: H, Helvetica, Arial, sans-serif;
  display: flex; flex-direction: column;
}
.top { display: flex; justify-content: space-between; align-items: center; padding: 52px 64px 0; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 21px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.dot { width: 15px; height: 15px; border-radius: 50%; background: ${LIME}; }
.url { font-size: 19px; color: rgba(246,245,241,0.55); }
/* la frase si "accende" a metà, come i testi del sito durante lo scroll */
h1 { padding: 0 64px; margin-top: auto; margin-bottom: 44px; font-size: 73px; font-weight: 700; line-height: 1.02; letter-spacing: -0.035em; max-width: 1080px; }
h1 span { color: #77766f; }
.strip { display: grid; grid-template-columns: repeat(5, 1fr); height: 168px; }
.strip img { width: 100%; height: 168px; object-fit: cover; display: block; }
</style></head><body>
<div class="top">
  <div class="brand"><span class="dot"></span>Adriano Parmentola</div>
  <div class="url">adrianoparmentola.github.io</div>
</div>
<h1>Designer of services, spaces and installations. <span>Heading towards events.</span></h1>
<div class="strip">${thumbs.map((t) => `<img src="${t}">`).join('')}</div>
</body></html>`;

const htmlPath = path.join(WORK, 'card.html');
const rawPng = path.join(WORK, 'card.png');
fs.writeFileSync(htmlPath, html);

execFileSync(
  EDGE,
  [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${path.join(WORK, 'profile')}`,
    // un po' più alta del necessario: la vecchia headless ruba qualche pixel
    '--window-size=1200,760',
    `--screenshot=${rawPng}`,
    htmlPath,
  ],
  { stdio: 'ignore', timeout: 90000 }
);
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
for (let i = 0; i < 40 && !fs.existsSync(rawPng); i++) sleep(500);
if (!fs.existsSync(rawPng)) {
  console.error('Edge non ha prodotto la scheda. HTML in:', htmlPath);
  process.exit(1);
}

await sharp(rawPng)
  .extract({ left: 0, top: 0, width: 1200, height: 630 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(PUBLIC, 'og.jpg'));

for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'og.jpg'])
  console.log(f.padEnd(22), (fs.statSync(path.join(PUBLIC, f)).size / 1024).toFixed(1) + ' KB');
