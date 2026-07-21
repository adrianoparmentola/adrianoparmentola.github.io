// Comprime i video di progetto in MP4 web-friendly (H.264, max 1080p,
// faststart) dentro public/videos/, usando il binario di ffmpeg-static.
//
// Esclusi deliberatamente (troppo grandi anche compressi, vanno su hosting
// esterno - vedi NOTES.md): "Video Punti di Vista 02.mp4" (528MB, lungo),
// "UI Punti di Vista.mov" (1GB).
//
// Uso: npm run compress-videos

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(PROJECT_ROOT, '..', 'wbsite assets');
const DEST_DIR = path.join(PROJECT_ROOT, 'public', 'videos');

// [sorgente relativo, output, {audio: mantieni traccia audio, fps: cap}]
const MANIFEST = [
  [
    'linea dotta/Video render linea Dotta Modellazione virtuale.mp4',
    'linea-dotta-model.mp4',
    { audio: false },
  ],
  ['punti di vista- TALEA/Render (1).mp4', 'talea-render.mp4', { audio: false }],
  [
    'punti di vista- TALEA/identity/WhatsApp Video 2026-06-12 at 20.42.12.mp4',
    'talea-identity.mp4',
    { audio: true },
  ],
  ['Hum.us campaign/content/catering content.mp4', 'humus-catering.mp4', { audio: false, fps: 30 }],
  [
    'Hum.us campaign/content/catering content bar.mp4',
    'humus-catering-bar.mp4',
    { audio: true, fps: 30 },
  ],
];

async function main() {
  await fs.mkdir(DEST_DIR, { recursive: true });

  for (const [srcRel, outName, opts] of MANIFEST) {
    const srcAbs = path.join(SOURCE_ROOT, srcRel);
    const outAbs = path.join(DEST_DIR, outName);

    const args = [
      '-y',
      '-i', srcAbs,
      // scala al massimo a 1080p di altezza mantenendo proporzioni (mai ingrandire)
      '-vf', `scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2${opts.fps ? `,fps=${opts.fps}` : ''}`,
      '-c:v', 'libx264',
      '-crf', '26',
      '-preset', 'medium',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
    ];
    if (opts.audio) {
      args.push('-c:a', 'aac', '-b:a', '96k');
    } else {
      args.push('-an');
    }
    args.push(outAbs);

    try {
      execFileSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
      const [srcStat, outStat] = await Promise.all([fs.stat(srcAbs), fs.stat(outAbs)]);
      console.log(
        `ok  ${outName}: ${Math.round(srcStat.size / 1024 / 1024)}MB -> ${(outStat.size / 1024 / 1024).toFixed(1)}MB`
      );
    } catch (err) {
      console.log(`ERR ${outName}: ${err.message}`);
    }
  }
}

main();
