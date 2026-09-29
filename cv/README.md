# CV

```bash
npm run cv
```

Genera due file dallo stesso contenuto:

| File | A cosa serve |
|---|---|
| `cv/Adriano-Parmentola-CV.docx` | il documento modificabile in Word |
| `public/cv/Adriano-Parmentola-CV.pdf` | quello che il sito fa scaricare |

Il PDF esce da Word (serve Word installato). Deve restare di **una pagina**:
lo script lo dice a ogni esecuzione.

## Cambiare i testi

Si tocca solo `cv/content.json`: esperienze, studi, colonne in fondo.
Aggiungere una voce significa aggiungere un oggetto alla lista, con
`role`, `org`, `date`, `note` (facoltativa) e `bullets`.

Se dopo una modifica lo script segnala più di una pagina, si accorcia un
testo oppure si stringono un po' le spaziature in `build-cv.mjs`
(`sectionTitle`, `entryHead`, `bullet`).

## Perché il documento è generato

Il file di partenza veniva da una conversione e conteneva **98 caselle di
testo**, con le lettere dei titoli una per casella. Da lì arrivavano il
tracking dei titoli, le tre colonne disallineate e le liste che andavano a
capo sotto il trattino. Qui il documento è scritto direttamente in OOXML,
quindi ogni misura è esplicita e ripetibile.

## Regole tipografiche

- nessun tracking sui titoli e sul nome
- liste con rientro sporgente: la riga che continua si allinea alla prima
  parola, non al trattino
- interlinea fissa e corta, con più spazio fra un blocco e l'altro
- tre colonne in fondo larghe uguali e alla stessa distanza
- niente trattini lunghi nel testo (restano negli intervalli di date)
- email e indirizzo del sito cliccabili nel PDF

## QR

`cv/qr.jpg` contiene `https://adrianoparmentola.github.io/en/` (verificato
decodificandolo). È versione 3, 29×29 moduli: stampato a 18 mm ogni modulo
resta 0,62 mm, ben sopra la soglia di lettura di un telefono. Se cambia
l'indirizzo va rifatto, altrimenti punta ancora al vecchio.
