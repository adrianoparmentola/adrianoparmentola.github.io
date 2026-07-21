// Rasterizza i PDF di progetto (poster, tavole, identità visive) in WebP
// dentro src/content/projects/{slug}/assets/, usando mupdf (WASM, nessuna
// dipendenza nativa) + sharp.
//
// Complementare a optimize-assets.mjs (che copia le immagini già raster).
// Uso: npm run extract-pdfs

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import * as mupdf from 'mupdf';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(PROJECT_ROOT, '..', 'wbsite assets');
const DEST_ROOT = path.join(PROJECT_ROOT, 'src', 'content', 'projects');

const TARGET_WIDTH = 2000; // px del lato lungo dopo il resize
const WEBP_QUALITY = 82;

// slug -> [pdf sorgente (relativo a SOURCE_ROOT), basename output, pagine ('all' o [indici 0-based])]
const MANIFEST = {
  contatto: [
    ['(con)tatto/POSTER A2 - (CON)TATTO_1FINALE.pdf', 'poster-a2-01', [0]],
    ['(con)tatto/POSTER A2 - (CON)TATTO_2FINALE.pdf', 'poster-a2-02', [0]],
    ['(con)tatto/POSTER A2 - (CON)TATTO_3FINALE.pdf', 'poster-a2-03', [0]],
    ['(con)tatto/single sheets presentaizione/identità visiva.pdf', 'identity-01', [0]],
    ['(con)tatto/single sheets presentaizione/identità visiva-1.pdf', 'identity-02', [0]],
    ['(con)tatto/single sheets presentaizione/touchpoint.pdf', 'touchpoint-01', [0]],
    ['(con)tatto/single sheets presentaizione/touchpoint-1.pdf', 'touchpoint-02', [0]],
    ['(con)tatto/single sheets presentaizione/touchpoint-2.pdf', 'touchpoint-03', [0]],
  ],
  humus: [
    ['Hum.us campaign/content/A3 aperitivio.pdf', 'poster-aperitivo', [0]],
    ['Hum.us campaign/content/A4 (300 DPI).pdf', 'poster-a4-01', [0]],
    ['Hum.us campaign/content/A4 (300 DPI)-1.pdf', 'poster-a4-02', [0]],
    ['Hum.us campaign/content/HUm.us bar.pdf', 'poster-bar', [0]],
    ['Hum.us campaign/targhette mensa/Frame 109.pdf', 'canteen-tags', [0]],
  ],
  talea: [
    ['punti di vista- TALEA/identity/BRAND IDENTITY.pdf', 'brand-identity', [0]],
  ],
  autonomia: [
    ['autonomia/Gruppo_4_Tavole_Esame.pdf', 'tavola', 'all'],
  ],
  'rendering-automatico': [
    ['Rendering automatico/Presentazione_Gruppo_30_Pace_Parmentola_Stagi_Tabayoyong.pdf', 'slide', 'all'],
  ],
  'visione-dai-fondi': [
    ['visione dai fondi/Gruppo03_EsercitazioneFinale_layout_mature.pdf', 'layout', 'all'],
  ],
};

async function extractPdf(slug, [pdfRel, baseName, pages]) {
  const pdfAbs = path.join(SOURCE_ROOT, pdfRel);
  const destDir = path.join(DEST_ROOT, slug, 'assets');
  await fs.mkdir(destDir, { recursive: true });

  const data = await fs.readFile(pdfAbs);
  const doc = mupdf.Document.openDocument(data, 'application/pdf');
  const pageCount = doc.countPages();
  const pageList = pages === 'all' ? [...Array(pageCount).keys()] : pages;

  const results = [];
  for (const i of pageList) {
    if (i >= pageCount) continue;
    const page = doc.loadPage(i);
    const [x0, y0, x1, y1] = page.getBounds();
    const longSidePt = Math.max(x1 - x0, y1 - y0);
    // Non ingrandire mai oltre 2x il 72dpi nativo se il PDF è già enorme in pt
    const scale = Math.min(TARGET_WIDTH / longSidePt, 2);
    const pixmap = page.toPixmap(
      mupdf.Matrix.scale(scale, scale),
      mupdf.ColorSpace.DeviceRGB,
      false,
      true
    );
    const png = pixmap.asPNG();

    const suffix = pageList.length > 1 ? `-${String(i + 1).padStart(2, '0')}` : '';
    const outName = `${baseName}${suffix}.webp`;
    const outAbs = path.join(destDir, outName);

    await sharp(Buffer.from(png))
      .resize({ width: TARGET_WIDTH, height: TARGET_WIDTH, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outAbs);

    const stat = await fs.stat(outAbs);
    results.push({ outName, kb: Math.round(stat.size / 1024) });
  }
  return results;
}

async function main() {
  for (const [slug, entries] of Object.entries(MANIFEST)) {
    for (const entry of entries) {
      try {
        const results = await extractPdf(slug, entry);
        for (const r of results) console.log(`ok  ${slug}/${r.outName} (${r.kb}KB)`);
      } catch (err) {
        console.log(`ERR ${slug}/${entry[1]}: ${err.message}`);
      }
    }
  }
}

main();
