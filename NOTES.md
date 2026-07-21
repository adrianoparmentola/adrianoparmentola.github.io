# Note e decisioni

Log delle scelte fatte durante la costruzione del sito, con il perché. Non è
un changelog di codice (quello sta nei commit) — è il posto dove ritrovare
*perché* qualcosa è fatto in un certo modo.

## Il "menù portfolio" come fonte ufficiale

In `Desktop/01_PORTFOLIO/portfolio2026/Menu portfolio/` vivono i PDF
trilingue (IT/EN/ES, 2 pagine) del portfolio in formato menù da ristorante.
Sono la **fonte canonica** per: one-liner dei progetti (usate verbatim come
dek), anni, hashtag (methodTags), contatti, posizionamento ("Service
Designer — specializzato in hospitality, experience and events"), speed
tasks (Interiors 7gg / Identità e campagne 12gg), lingue e certificazione
Gallup (Input, Positivity, Includer). Non riscrivere questi testi senza
l'utente. L'FBX `menù portfolio.fbx` + texture è il modello 3D del menù
(GLB texturizzato in `public/models/home/menu.glb`).

**Araldica** (2021, "stendardo pubblicitario in vetro per spazi storici") è
nel menù ma non ha materiali nella cartella assets → meta creato con
`status: pending`, non pubblicato finché non arrivano le immagini.

## Navigazione e pagina Metodo

"Metodo" è stato **rimosso dalla top bar** (decisione utente): la pagina
`/{lang}/method/` esiste ancora e resta raggiungibile dalla CTA "Guarda il
metodo" della home e dai link nelle pagine progetto — semplicemente non è
più una voce di menu. La voce "Casi & Referenze" è stata rinominata in
"Referenze" (chiave `nav.cases`, tutte e 3 le lingue).

## Menù 3D (biglietto da visita)

Il modello viene dall'FBX `menù portfolio.fbx` (texture in
`Desktop/01_PORTFOLIO/portfolio2026/Menu portfolio/`). L'FBX ha 2 mesh: il
foglio piegato con la grafica (`Plane`, texturizzato) e un secondo foglio
piatto senza materiale (`Plane.001`). Su richiesta utente l'export tiene
**solo il foglio piegato texturizzato** e scarta quello piatto. Se si
rigenera, usare l'export con `use_selection=True` sulla mesh che ha un
TEX_IMAGE node (vedi comando in cronologia sessione).

Il pannello "curriculum" (speed tasks, lingue, Gallup) ha una **superficie
lime-tinta** (`color-mix` accent 14%) con bordo e badge giorni lime pieni,
per staccarlo cromaticamente dal biglietto da visita 3D che resta su
off-white pulito.

## Home — struttura houseplant.com (decisa con l'utente)

Hero = loop muto 18s da "Video Punti di Vista 02" con il claim di TALEA
"Dove la città racconta" → 3 colonne-categoria full-bleed (Servizi=ciclisti
SAFE2WORK, Prodotti=Cartesio, Spazi=totem TALEA) che linkano alle ancore
della pagina Progetti → marquee tecnologie → Referenze & background
(recensioni, menù 3D, CV, lingue, Gallup, speed tasks) → CTA contatto.
Le vecchie sezioni "dichiarazione+artefatto" e la banda numeri sono state
rimosse su richiesta; il vecchio claim ("Non ti porto 30 anni di
intuito...") è accantonato in attesa di uno nuovo.

Tassonomia progetti: `category: servizi|prodotti|spazi` nello schema
(dal menù: Prodotti/Servizi + "Spazi" aggiunta dall'utente); i demo senza
categoria (Rendering automatico) chiudono la pagina Progetti.

**Contatti pubblicati**: email, Instagram, LinkedIn — **niente telefono**
sul sito (decisione esplicita: resta solo dentro CV/menù scaricabili).

Didascalie asset: in italiano (decisione utente), traduzioni EN/ES quando
si farà il giro completo di copy trilingue (i dek EN/ES ufficiali sono nei
PDF del menù, già estratti in immagini temporanee).

Pagina progetto pilota col pattern "frase + media": `humus/it.md`
(sezioni h2 = frasi-bozza da far correggere, figure tesi embedded nel
markdown). Da replicare sugli altri progetti dopo la correzione delle bozze.

## Tesi come fonte del caso studio Hum.us

La tesi ("Applicazione del metodo Six Sigma e del design dei servizi nella
ristorazione collettiva: il caso studio Hum.us space", 61 pagine, in
`wbsite assets/Hum.us campaign/`) è la fonte primaria del caso studio
principale. Ne sono state ritagliate 8 figure metodo (DMAIC, KPI,
questionario, baseline/target, benchmark, QFD, Kano, TRIZ) usate sia nella
pagina Hum.us sia nella pagina Metodo. I numeri della StatBand in home
(48→55 pasti/ora, 8→5 min, CSAT 2,9→4,2, 65% materie fresche) vengono dalla
Tabella 5 "Benchmark Diretto" della tesi — non inventarne altri.

## Storytelling della home (reference houseplant.com + rideany)

Struttura a scroll lungo: hero con menù 3D (da `menù portfolio.stl` — è
letteralmente un menù da ristorante piegato, coerente col posizionamento
hospitality) → marquee sigle → sezioni "dichiarazione + artefatto reale"
alternate (misura/benchmark, prototipo/TALEA, servizio/(con)tatto,
sistema/video Linea Dotta) → banda numeri → progetti → referenze → CTA.
Le dichiarazioni sono stringhe i18n volutamente corte e fattuali; l'utente
può riscriverle in `src/i18n/ui.ts` (chiavi `story.*`).

## Modelli 3D

- `scripts/stl-to-glb.py` (Blender headless): STL → GLB con materiale PBR
  parametrico. On the corner (marmo verde), menù home (carta).
- `scripts/cluster-decimate-stl.mjs`: il hub Hum.us arrivava come STL da
  **2.5GB / 52,7M triangoli** — Blender crashava in decimazione (OOM).
  Decimatore streaming custom: vertex clustering su griglia + filtro
  componenti connesse (rimuove i pannelli-fondale della scena di rendering)
  → 38K triangoli, 0,9MB. Parametri: griglia 800, min 60 tri/componente.
- Nota test: il pane browser integrato può risultare `visibilityState:
  hidden` (rAF sospeso) → model-viewer non carica lì; verificare in un tab
  reale. Il fix `height:auto` su model-viewer serve a battere l'altezza host
  di default (150px) che altrimenti ignora aspect-ratio.

## Video

Pipeline `scripts/compress-videos.mjs` (ffmpeg-static, 1080p, crf 26):
tutti i sorgenti brevi sono nel repo (`public/videos/`), inclusi
Valverde murales (36MB→3,7MB) e Hum.us bar (123MB→9,4MB). Restano fuori
solo i 2 video lunghi TALEA (528MB/1GB) → hosting esterno, embed quando
l'utente fornisce l'URL.

## Posizionamento e brief

Il sito è passato da un'idea iniziale "portfolio + spazio personale stile
MySpace" a un posizionamento più mirato: portfolio da service designer con
gancio verso consulenza hospitality/ristorazione, doppio pubblico (clienti +
visitatori generici), visual-first, sigle metodologiche (Six Sigma, DMAIC,
QFD, Kano, TRIZ) mostrate come marchi di garanzia mai spiegati. Niente
blog/login/area risorse — deciso esplicitamente dall'utente.

## Stack

**Astro**, statico, deploy GitHub Pages via GitHub Actions
(`withastro/action` + `actions/deploy-pages`). Motivazione: zero-JS di
default, `astro:assets`/Sharp integrato (risolve i PNG da 10-65MB della
cartella sorgente), content collections con schema Zod, i18n nativo.

`npm create astro` non è riuscito a scaricare il template completo in questo
ambiente (probabile problema di fetch remoto: copiava solo AGENTS.md/CLAUDE.md,
non i file veri del progetto) — lo scaffold è stato scritto a mano file per
file, non è un problema del progetto in sé.

## Tipografia — rischio licenza Helvetica

I font in `public/fonts/` vengono da
`Desktop/03_MAGISTRALE_ADVANCED_DESIGN/design_sostenibilita/helvetica-255-cufonfonts/`,
senza alcun file di licenza/EULA accanto. "cufonfonts" è un sito noto per
distribuire font senza chiara licenza commerciale/web.

**Prima di rendere il repository pubblico o pubblicare il sito**, serve una
di queste due cose:
1. Licenziare Helvetica Neue/Now per il web (Monotype/Linotype/Adobe Fonts).
2. Sostituire con un font regolarmente licenziato dallo stesso disegno.

Fino ad allora questi file restano solo per sviluppo locale. Vedi anche
`public/fonts/README.md`.

Peso Bold come principale su indicazione esplicita dell'utente; il brief
vieta un secondo font — la skill `frontend-design` (che raccomanda di
accoppiare un display font distintivo con un body font raffinato ed evitare
font "generici") è stata deliberatamente disattesa su questo punto, per
scelta esplicita dell'utente.

## Contenuti — cosa è reale, cosa è bozza

Solo **(con)tatto** e **Linea Dotta** hanno case study completi, presi
verbatim dai file `*_project_explanation.txt` originali (in inglese —
`defaultLocale` è quindi `en`, non `it`, per restare fedeli alla lingua del
materiale sorgente reale).

Tutti gli altri progetti (`talea`, `autonomia`, `cartesio`, `valverde`,
`rendering-automatico`, `humus`, `on-the-corner`, `visione-dai-fondi`) hanno
`draft: true` nel frontmatter e testo ridotto ai soli fatti confermati
(nomi, team, corso, materiali) — **nessun copy narrativo/marketing è stato
inventato**. Vanno scritti insieme all'utente.

`vaee`: descrizione presa dal documento `vaee/GRUPPO20vaee.docx` trovato
tramite ricerca sul Desktop (bracciale skincare da viaggio).

`safe-to-work`: `status: "pending"` nel meta — non compare in "Progetti"
finché l'utente non conferma se includerlo (poco materiale sciolto rispetto
al peso della cartella sorgente).

`Eclissi`: cartella vuota, esclusa del tutto.

`cartesio/contenuti da non pubblicare`: esclusa per esplicita indicazione
dell'utente, non è mai stata copiata nel progetto.

## Hum.us — caso studio principale, ancora da curare

I 55 PDF in `Hum.us campaign/poster environment/` (confermati dall'utente
come serie organizzate per stile comune) non sono stati selezionati/importati
— serve una sessione dedicata con l'utente per scegliere quali sono
definitivi. Il componente `PosterSeries.astro` è pronto per riceverli (è un
crossfade generico), ma oggi nessuna pagina lo usa ancora con dati reali.

`Hum.us campaign/piatti/tutti i piatti.jpg` ha la trasparenza "bruciata" in
scacchiera grigia (probabile export JPG di un PNG con alpha) — serve la
versione sorgente con vero alpha channel.

## On the corner — modello 3D

L'utente ha caricato anche il file `.stl`, pensando fosse "visualizzabile
senza programmi esterni" — ma `<model-viewer>` (il web component usato per
il viewer interattivo) non supporta `.stl` nativamente, e comunque l'STL non
porta materiali/colore (avremmo perso l'effetto marmo verde/legno visto nei
render).

Soluzione: esportato un `.glb` dal file sorgente
`on the corner render file .blend` (Blender 4.4, headless via
`scripts/blender_export_glb.py`), che conserva i materiali. Il `.glb`
(5.3MB) è il motore del viewer in `public/models/on-the-corner/lamp.glb`;
l'STL originale (34MB) resta scaricabile come extra
(`public/models/on-the-corner/lamp.stl`) ma non fa nulla nel viewer.

## Video

Sondati con ffmpeg: quasi tutti i video sorgente sono clip brevissimi (4-34s)
in 4K, quindi comprimibili a 1080p in pochi MB. Pipeline
`scripts/compress-videos.mjs` (ffmpeg-static, H.264 crf 26, faststart, audio
solo dove serve) → `public/videos/`:

- `linea-dotta-model.mp4` 8MB → 1.7MB (muto)
- `talea-render.mp4` 83MB → 6.6MB (muto)
- `talea-identity.mp4` 1MB → 0.6MB (con audio)
- `humus-catering.mp4` 27MB → 0.6MB (muto)
- `humus-catering-bar.mp4` 123MB → 9.4MB (con audio)

Restano esclusi dal repo e in attesa di hosting esterno (troppo grandi/lunghi
anche compressi): `UI Punti di Vista.mov` (~1GB) e
`Video Punti di Vista 02.mp4` (~528MB). Quando l'utente avrà un URL
pubblicato, va incollato in un embed nelle pagine progetto.

## PDF — estrazione contenuti

`scripts/extract-pdfs.mjs` (mupdf WASM + sharp, nessuna dipendenza nativa:
sulla macchina non ci sono ffmpeg/poppler/ImageMagick di sistema e Python è
solo lo stub dello Store) rasterizza i PDF di progetto in WebP:

- (con)tatto: 3 poster A2, 2 tavole identità visiva, 3 tavole touchpoint
- Hum.us: poster A3 aperitivo, 2 poster A4, poster bar, targhette mensa
- TALEA: tavola brand identity
- autonomia: tutte le 7 tavole d'esame
- Rendering automatico: tutte le 10 slide della presentazione
- visione dai fondi: tutte le 12 tavole layout

I 55 PDF "poster environment" di Hum.us restano fuori in attesa di curatela.

Le **didascalie** degli asset vivono in `meta.json` (campo `caption`) e per
ora sono in una sola lingua (EN) e puramente fattuali (dedotte da nomi
file/contenuti verificati, niente narrativa inventata — es. i 3 poster A2 di
(con)tatto sono numerati "1 of 3" e non mappati ai livelli del servizio,
perché la corrispondenza non è verificabile dai file). Se serviranno
didascalie tradotte, andranno spostate nei file copy per lingua.

## Asset — pipeline di ottimizzazione

`scripts/optimize-assets.mjs` copia un manifest curato di asset "pronti
all'uso" (individuati manualmente in fase di analisi) da
`../wbsite assets/*` dentro `src/content/projects/{slug}/assets/`,
convertendo in WebP a un massimo di 2200px di larghezza. Risultato:
240MB → 6.3MB di sorgenti (97% di riduzione) prima ancora del resize
responsivo aggiuntivo che fa `astro:assets` in build.

Non è uno script generico "ottimizza tutto" — il manifest è scelto a mano,
perché molte cartelle sorgente contengono materiale non pubblicabile o
duplicati da scartare (vedi sopra Hum.us, cartesio).

## Palette — valori provvisori

`--color-bg`, `--color-text`, `--color-accent` in `src/styles/tokens.css`
sono **placeholder**, non presi da reference reali: nessuna immagine nella
cartella sorgente definisce l'esatta palette del sito (quella dei singoli
progetti, es. TALEA blu/giallo/verde, è interna al progetto stesso, non va
confusa col sistema del sito). Da correggere quando arrivano le reference
visive promesse dall'utente (link mai arrivati in chat finora).

## Cosa manca ancora (aperto)

1. Reference visive del sito (hex/spaziature/mood esatti).
2. Copy trilingue per quasi tutti i progetti (solo (con)tatto/Linea
   Dotta/vaee hanno testo, e solo in EN).
3. Curatela Hum.us (selezione poster tra i 55 PDF).
4. Conferma inclusione `safe-to-work`.
5. URL dei video pubblicati esternamente.
6. Decisione licenza font Helvetica.
7. Canali di contatto reali per la pagina Contatto (email/social) — oggi è
   solo un placeholder "contenuto in lavorazione".
8. Dominio/repo GitHub definitivo (`astro.config.mjs` ha `site` e `base`
   segnaposto, vedi README).
