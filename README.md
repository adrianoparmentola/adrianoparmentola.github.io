# Portfolio — Adriano Parmentola

Sito statico costruito con [Astro](https://astro.build), trilingue
(EN/IT/ES — EN è la lingua di default), pensato per GitHub Pages.

Per il contesto delle scelte fatte (stack, contenuti, cosa è bozza e cosa è
definitivo, rischio licenza font) vedi [NOTES.md](./NOTES.md).

## Sviluppo locale

```bash
npm install
npm run dev
```

Per rigenerare gli asset ottimizzati dalla cartella sorgente
`Desktop/wbsite assets` (script idempotente, sicuro da rilanciare):

```bash
npm run optimize-assets
```

Per validare tipi e content collections prima di committare:

```bash
npm run build   # esegue "astro check" e poi la build
```

## Pubblicare su GitHub Pages

Il workflow `.github/workflows/deploy.yml` builda e pubblica automaticamente
ad ogni push su `main`, usando GitHub Actions (non serve gestire a mano un
branch `gh-pages`).

**Step manuali da fare tu su GitHub, una sola volta:**

1. Crea il repository su GitHub e fai il primo push di questo progetto su
   `main`.
2. Nel repository: **Settings → Pages → Build and deployment → Source**,
   seleziona **GitHub Actions** (non "Deploy from a branch").
3. Apri `astro.config.mjs` e correggi:
   - `site`: l'URL finale del sito. Se usi il dominio di default GitHub,
     è `https://<tuo-username>.github.io`.
   - `base`: `'/'` se il repo si chiama `<tuo-username>.github.io`
     (site personale), oppure `'/<nome-repo>/'` se pubblichi come progetto
     (es. `/portfolio-website/'`).
4. Se vuoi un **dominio custom**: aggiungi un file `public/CNAME` con dentro
   solo il dominio (es. `adrianoparmentola.com`), configura i DNS del
   dominio a puntare a GitHub Pages, e aggiungilo anche in
   **Settings → Pages → Custom domain**.
5. Fai un push su `main`: la Action parte da sola, il sito è online in
   qualche minuto (controlla la tab **Actions** del repo per lo stato).

## Prima di rendere il repository pubblico

⚠️ I font Helvetica in `public/fonts/` non hanno una licenza confermata per
uso web — leggi `public/fonts/README.md` e la sezione dedicata in
[NOTES.md](./NOTES.md) prima di pubblicare.

## Struttura

```
src/
  content/
    projects/{slug}/meta.json      # dati di progetto, lingua-indipendenti
    projects/{slug}/{lang}.md      # copy del case study, per lingua
    testimonials/*.json            # recensioni con link LinkedIn
  components/                      # componenti riusabili (card, viewer 3D, ecc.)
  sections/                        # blocchi di pagina (Home, Method, ProjectDetail, ecc.)
  pages/{lang}/                    # route per lingua (en/it/es)
  styles/tokens.css                # sistema di design (colore, tipografia, spaziatura)
scripts/
  optimize-assets.mjs              # immagini raster da "wbsite assets" a src/content
  extract-pdfs.mjs                 # rasterizza i PDF di progetto (poster, tavole) in WebP
  compress-videos.mjs              # comprime i video sorgente in MP4 web (public/videos)
  stl-to-glb.py                    # Blender headless: STL/FBX -> GLB (menù, on the corner)
  cluster-decimate-stl.mjs         # decimatore streaming per STL giganti (>2GB)
public/
  fonts/                           # font Helvetica (placeholder dev, vedi sopra)
  models/                          # modelli 3D (.glb/.stl)
  videos/                          # video web-friendly (hero, card, pagine progetto)
  cv/                              # CV scaricabile (PDF)
```

Nota: gli script di asset (immagini/PDF/video/3D) sono one-off e leggono da
`Desktop/wbsite assets` — servono solo per rigenerare i contenuti, non per il
deploy. Su GitHub Actions gira solo `npm ci && npm run build`.
