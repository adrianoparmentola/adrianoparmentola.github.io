# Design system — post Instagram (InDesign)

Sistema unico per tutti i post, derivato dai token del sito
(`src/styles/tokens.css`). Stessa identità: un solo font (Helvetica),
gerarchia solo per peso e dimensione, lime col contagocce.

---

## 1. Formati

| Uso | Dimensione | Note |
|---|---|---|
| Feed verticale (consigliato) | **1080 × 1350 px** | occupa più schermo, default per i contenuti forti |
| Feed quadrato | **1080 × 1080 px** | caroselli, griglia profilo coerente |
| Story / Reel cover | **1080 × 1920 px** | vedi safe area sotto |

Documento InDesign: **RGB**, 72 ppi, pagine affiancate **OFF**.
(Menu: File → Nuovo → Web/Mobile, così l'unità è già in pixel.)

**Safe area story**: lascia liberi **250 px in alto** e **320 px in basso**
(li copre l'interfaccia di Instagram).

---

## 2. Griglia (uguale su tutti i formati)

- **Margini**: 80 px su tutti i lati
- **Colonne**: 4
- **Gutter (spazio colonna)**: 40 px
- **Larghezza colonna risultante**: 200 px
- **Griglia baseline**: ogni 8 px — tutte le distanze sono multipli di 8

Verifica: 80 + (4×200) + (3×40) + 80 = 1080 ✔

**Come impostarla**: Layout → Margini e colonne (80 / 4 / 40).
Baseline: Preferenze → Griglie → Incrementi ogni 8 px, inizio 80 px.

### Spaziature standard
| Nome | px | Uso |
|---|---|---|
| xs | 8 | tra occhiello e titolo |
| s | 16 | tra righe di metadati |
| m | 32 | tra titolo e corpo |
| l | 64 | tra blocchi |
| xl | 120 | respiro sopra/sotto un blocco isolato |

---

## 3. Colori (campioni da creare in InDesign, modo RGB)

| Nome campione | HEX | RGB | Uso |
|---|---|---|---|
| `BG/Off-white` | **#F6F5F1** | 246 245 241 | fondo principale |
| `Ink/Carbone` | **#141414** | 20 20 20 | testo e fondo scuro |
| `Ink/Muted` | **#5C5B57** | 92 91 87 | metadati, didascalie |
| `Accent/Lime` | **#C6FF3D** | 198 255 61 | accento — vedi regola |
| `Line/Border` | **#DEDAD2** | 222 218 210 | filetti, separatori |

### Regola dell'accento lime (importante)
- **Massimo un elemento lime per post.**
- Usi ammessi: un numero, una sottolineatura, un badge piccolo, una parola
  chiave evidenziata.
- **Mai** come fondo di un post intero o campitura larga.
- Su fondo carbone il lime può fare da testo; su off-white meglio come
  evidenziazione dietro al testo nero.

### Fondi alternati (ritmo del feed)
Alterna **off-white** (default) e **carbone** (manifesto, citazioni, dati).
Regola pratica: 1 post scuro ogni 3-4 chiari.

---

## 4. Tipografia — solo Helvetica

Pesi: **Bold** (principale), Regular (corpo lungo), Light (numeri grandi).
Mai un secondo font.

| Stile paragrafo | Corpo | Interlinea | Peso | Tracking | Uso |
|---|---|---|---|---|---|
| `Display` | 132 px | 126 px | Bold | −20 | copertina, una frase corta |
| `H1` | 96 px | 100 px | Bold | −15 | titolo principale |
| `H2` | 64 px | 70 px | Bold | −10 | titolo di slide interna |
| `Lead` | 44 px | 56 px | Regular | 0 | frase di apertura |
| `Body` | 32 px | 46 px | Regular | 0 | testo corrente |
| `Meta` | 22 px | 28 px | Bold | **+80** | occhiello, MAIUSCOLO, data, handle |
| `Numero` | 200 px | 190 px | Bold o Light | −30 | dato singolo (spesso lime) |

**Lunghezza riga**: max ~30 caratteri per il Display, ~45 per il Body.
Testo allineato a **sinistra**, mai giustificato.

**Come impostarli**: crea questi 7 **stili di paragrafo** una volta sola nel
template — poi non toccare mai i valori a mano sul singolo post.

---

## 5. Componenti (i tipi di post ricorrenti)

1. **Cover / manifesto** — fondo carbone, `Display` bianco, una parola in
   lime. Occhiello `Meta` in alto. Nessuna immagine, o immagine di sfondo
   scurita al 60%.
2. **Progetto** — immagine a tutta pagina fino al margine inferiore,
   `H1` sopra su fondo off-white nella metà alta.
3. **Dato / risultato** — `Numero` gigante lime su carbone + `Body` che
   spiega in una riga.
4. **Testo + immagine** (slide interna carosello) — immagine in alto per
   2/3, `H2` + `Body` sotto.
5. **Chiusura carosello** — off-white, `H2` con la call to action +
   handle in `Meta`.

**Firma costante**: handle `@adriano_parmentola` in `Meta`, sempre nello
stesso punto (in basso a sinistra, sul margine di 80 px).

---

## 6. Come renderlo davvero "comune" (la parte che conta)

1. **Crea il template**: imposta documento, griglia, campioni e stili →
   File → Salva con nome → formato **Template InDesign (.indt)**.
   Nome: `social-template.indt`. Da lì parte ogni nuovo post.
2. **Pagine mastro**: metti su una mastro i margini, la firma e gli
   elementi fissi. Così sono uguali ovunque e li cambi in un punto solo.
3. **Libreria CC** (Finestra → Librerie CC): trascina dentro i 5 campioni
   colore e gli stili. Ti seguono su ogni documento e su altri dispositivi.
4. **Un solo file, più pagine**: fai un documento per campagna con una
   pagina per post — non un file per post. Mantiene tutto coerente e veloce.
5. **Esportazione**: File → Esporta → **JPEG**, Qualità *Massima*,
   Risoluzione **72 ppi**, spazio colore **RGB**.
   (PNG solo se ci sono grafiche piatte/testo su fondo tinta unita.)

---

## 7. Checklist prima di pubblicare

- [ ] Tutto il testo dentro i margini di 80 px (e safe area se story)
- [ ] Un solo elemento lime
- [ ] Solo Helvetica, solo gli stili del template
- [ ] Testo allineato a sinistra
- [ ] Handle presente e nella posizione standard
- [ ] Export JPEG max quality, RGB, 72 ppi

---

*Se cambi un colore o una dimensione, cambialo prima qui e poi nel
template: questo file è la fonte, non il singolo post.*
