// Copia gli asset "pronti all'uso" (individuati in fase di analisi) da
// "Desktop/wbsite assets" dentro src/content/projects/{slug}/assets/,
// ridimensionandoli e convertendoli in WebP con sharp.
//
// Non tocca gli asset "da rifare" (video pesanti, PDF poster environment di
// Hum.us, sorgenti .blend/.stl) - quelli restano TODO manuali, vedi NOTES.md.
//
// Uso: npm run optimize-assets

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(
  PROJECT_ROOT,
  '..',
  'wbsite assets'
);
const DEST_ROOT = path.join(PROJECT_ROOT, 'src', 'content', 'projects');

const MAX_WIDTH = 2200;
const WEBP_QUALITY = 82;

// slug -> elenco { from (relativo a SOURCE_ROOT), to (nome file destinazione) }
const MANIFEST = {
  contatto: [
    ['(con)tatto/Copertina.png', 'hero.webp'],
    ['(con)tatto/STAMPA A0.png', 'detail-print.webp'],
    ['(con)tatto/mockup flyer.png', 'mockup-flyer.webp'],
    ['(con)tatto/mockup stand.png', 'mockup-stand.webp'],
    ['(con)tatto/Posters_on_Fence_Mockup_2 1.png', 'mockup-fence.webp'],
    ['(con)tatto/foto/Immagine WhatsApp 2025-11-26 ore 19.17.53_82960d1c.jpg', 'field-01.webp'],
    ['(con)tatto/foto/Immagine WhatsApp 2025-11-26 ore 19.17.55_6406d85f.jpg', 'field-02.webp'],
    ['(con)tatto/foto/Immagine WhatsApp 2025-11-26 ore 19.17.56_9005968c.jpg', 'field-03.webp'],
    ['(con)tatto/foto/Immagine WhatsApp 2025-11-26 ore 19.32.30_0b530e6a.jpg', 'field-04.webp'],
  ],
  'linea-dotta': [
    ['linea dotta/render-Parmen-2 2.png', 'hero.webp'],
    ['linea dotta/map.png', 'map.webp'],
    ['linea dotta/schetches/rivers map.png', 'rivers-map.webp'],
    ['linea dotta/schetches/sketch treno.png', 'sketch-train.webp'],
    ['linea dotta/schetches/system work skethces.png', 'sketch-system.webp'],
    ['linea dotta/schetches/train cad.png', 'cad-train.webp'],
    ['linea dotta/schetches/tunnel cad.png', 'cad-tunnel.webp'],
    ['linea dotta/schetches/train render.png', 'render-train.webp'],
    ['linea dotta/schetches/train work tunnel.png', 'render-tunnel.webp'],
    ['linea dotta/schetches/tunnel mag-lev sistem.png', 'scheme-maglev.webp'],
  ],
  talea: [
    ['punti di vista- TALEA/poster/poster front.png', 'hero.webp'],
    ['punti di vista- TALEA/poster/COPERTINA.png', 'cover.webp'],
    ['punti di vista- TALEA/poster/componenti ui.png', 'ui-components.webp'],
    ['punti di vista- TALEA/poster/struttura totem.png', 'totem-structure.webp'],
    ['punti di vista- TALEA/poster/configurazioni totem.png', 'totem-configs.webp'],
    ['punti di vista- TALEA/poster/SYSTEM MAP.png', 'system-map.webp'],
    ['punti di vista- TALEA/poster/pdv 50.png', 'poster-50.webp'],
    ['punti di vista- TALEA/identity/BRAND IDENTITY-1.png', 'identity-forms.webp'],
  ],
  autonomia: [
    ['autonomia/frontale mockup realistico.png', 'hero.webp'],
    ['autonomia/primo mockup realistico.png', 'angle-02.webp'],
    ['autonomia/PADELLAINTERA  senzaschermo frontale.png', 'angle-03.webp'],
    ['autonomia/product.png', 'product.webp'],
    ['autonomia/functions analysis.png', 'functions-analysis.webp'],
  ],
  cartesio: [
    ['cartesio/render coffee table.png', 'hero.webp'],
    ['cartesio/render cartesio tavola.png', 'detail.webp'],
    ['cartesio/render orizzontale.png', 'landscape.webp'],
    ['cartesio/render verticale .png', 'portrait.webp'],
  ],
  vaee: [
    ['vaee/Billboards.png', 'hero.webp'],
  ],
  valverde: [
    ['Valverde intern design don tonino/Image-1.jpg', 'event-01.webp'],
    ['Valverde intern design don tonino/Image-2.jpg', 'event-02.webp'],
    ['Valverde intern design don tonino/Image.jpg', 'event-03.webp'],
  ],
  'rendering-automatico': [
    ['Rendering automatico/def1- no back.png', 'render-01.webp'],
    ['Rendering automatico/def2- verticale.png', 'render-02.webp'],
    ['Rendering automatico/prova3- orizzontale.png', 'render-03.webp'],
    ['Rendering automatico/mockup gopro.png', 'mockup.webp'],
  ],
  humus: [
    ['Hum.us campaign/meal box/BOXES SHOWCASE.png', 'boxes-showcase.webp'],
    ['Hum.us campaign/meal box/BOX top SHOWCASE.png', 'box-top.webp'],
    ['Hum.us campaign/meal box/BOX top 2 SHOWCASE.png', 'box-top-2.webp'],
    ['Hum.us campaign/meal box/bags and boxes.png', 'bags-and-boxes.webp'],
    ['Hum.us campaign/meal box/bag for presentation.png', 'bag.webp'],
    ['Hum.us campaign/meal box/side Humus.box meal.png', 'box-side.webp'],
    // NB: sorgente JPG con trasparenza "bruciata" in scacchiera grigia - va
    // richiesta la versione con alpha channel reale, questo è un placeholder.
    ['Hum.us campaign/piatti/tutti i piatti.jpg', 'all-plates.webp'],
    ['Hum.us campaign/piatti/piatto giallo.jpg', 'plate-yellow.webp'],
    ['Hum.us campaign/piatti/piatto ross.jpg', 'plate-red.webp'],
    ['Hum.us campaign/piatti/piatto verd.jpg', 'plate-green.webp'],
    ['Hum.us campaign/cartello/mockup cartello.png', 'poster-mockup.webp'],
    ['Hum.us campaign/cartello/design expl cartello.png', 'poster-explained.webp'],
    ['Hum.us campaign/voucher/mockup libretto voucher.png', 'voucher-mockup.webp'],
    ['Hum.us campaign/voucher/graphics/front voucher.png', 'voucher-front.webp'],
    ['Hum.us campaign/voucher/graphics/retro voucher.png', 'voucher-back.webp'],
    ['Hum.us campaign/content/camplus- hu.mus catering.jpg', 'catering-story.webp'],
  ],
  'safe-to-work': [
    ['safe to work/mockup/Billboards.png', 'hero.webp'],
    ['safe to work/sticker/Label Tag.png', 'label-tag.webp'],
    ['safe to work/mockup/App_Icon 1.png', 'app-icon.webp'],
  ],
  'on-the-corner': [
    ['on the corner/rendere corner lamp green marble .png', 'hero-marble.webp'],
    ['on the corner/Untitled.png', 'concept-plywood.webp'],
    ['on the corner/Rectangle 133.png', 'detail.webp'],
    ['on the corner/Image.png', 'thumb.webp'],
  ],
  'visione-dai-fondi': [
    ['visione dai fondi/renders/Disposizione autunno.jpg', 'season-autumn.webp'],
    ['visione dai fondi/renders/Disposizione inverno.jpg', 'season-winter.webp'],
    ['visione dai fondi/renders/Disposizione primavera.jpg', 'season-spring.webp'],
    ['visione dai fondi/renders/Disposizione estate.jpg', 'season-summer.webp'],
    ['visione dai fondi/renders/Disposizione ingresso.jpg', 'season-entrance.webp'],
    ['visione dai fondi/mostra poster.png', 'poster.webp'],
    ['visione dai fondi/renders/Borsa di tela.jpg', 'tote-bag.webp'],
    ['visione dai fondi/renders/Gadget vari.jpg', 'gadgets.webp'],
  ],
};

async function processOne(slug, [fromRel, toName]) {
  const fromAbs = path.join(SOURCE_ROOT, fromRel);
  const destDir = path.join(DEST_ROOT, slug, 'assets');
  const toAbs = path.join(destDir, toName);

  await fs.mkdir(destDir, { recursive: true });

  const srcStat = await fs.stat(fromAbs).catch(() => null);
  if (!srcStat) {
    return { slug, fromRel, toName, status: 'MISSING SOURCE' };
  }

  const image = sharp(fromAbs);
  const meta = await image.metadata();
  const shouldResize = (meta.width ?? 0) > MAX_WIDTH;

  await image
    .resize(shouldResize ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
    .webp({ quality: WEBP_QUALITY })
    .toFile(toAbs);

  const destStat = await fs.stat(toAbs);
  return {
    slug,
    fromRel,
    toName,
    status: 'ok',
    fromKB: Math.round(srcStat.size / 1024),
    toKB: Math.round(destStat.size / 1024),
  };
}

async function main() {
  const results = [];
  for (const [slug, files] of Object.entries(MANIFEST)) {
    for (const entry of files) {
      try {
        results.push(await processOne(slug, entry));
      } catch (err) {
        results.push({ slug, fromRel: entry[0], toName: entry[1], status: `ERROR: ${err.message}` });
      }
    }
  }

  const missing = results.filter((r) => r.status !== 'ok');
  const ok = results.filter((r) => r.status === 'ok');
  const totalFromKB = ok.reduce((s, r) => s + r.fromKB, 0);
  const totalToKB = ok.reduce((s, r) => s + r.toKB, 0);

  console.log(`\nOttimizzati ${ok.length}/${results.length} asset.`);
  console.log(`Peso totale: ${totalFromKB}KB -> ${totalToKB}KB (${Math.round((1 - totalToKB / totalFromKB) * 100)}% riduzione)\n`);

  if (missing.length) {
    console.log('Da controllare:');
    for (const m of missing) {
      console.log(`  [${m.status}] ${m.slug}: ${m.fromRel}`);
    }
  }
}

main();
