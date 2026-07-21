// One-off: crea i file it.md per tutti i progetti con i dek ufficiali dal
// "menù portfolio" (verbatim) e corpi brevi in italiano dai fatti già
// verificati. draft:true dove il copy è bozza da far correggere ad Adriano.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'projects');

fs.mkdirSync(path.join(ROOT, 'araldica'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'araldica', 'meta.json'),
  JSON.stringify(
    {
      name: 'Araldica',
      year: '2021',
      type: 'prodotto',
      category: 'prodotti',
      status: 'pending',
      featured: false,
      methodTags: ['VisualCom', 'PhysicalAd', 'Installation'],
      assets: [],
    },
    null,
    2
  ) + '\n'
);

const files = {
  'araldica/it.md': [
    'Araldica',
    'Stendardo pubblicitario in vetro per spazi storici.',
    true,
    `<!-- Materiali di progetto non ancora presenti nella cartella assets - pagina in attesa. -->`,
  ],
  'contatto/it.md': [
    '(con)tatto / (n)o',
    'Un servizio ideato sui principi delle Blue Zones per la comunità di Pianoro.',
    false,
    `(con)tatto è un servizio di comunità che aiuta gli over-75 di Pianoro a
invecchiare meglio, combinando prevenzione, connessione sociale, reti di
prossimità e sistemi di supporto leggeri.

Pianoro ha 17.866 residenti; gli over-75 sono circa 2.703 (15,13%) e il
presidio di emergenza più vicino è a ~17,5 minuti. Molti anziani vivono soli
o con reti familiari deboli. La domanda progettuale: come può il design
sostenere prevenzione, autonomia e connessione sociale riducendo
l'isolamento — senza sostituirsi alla sanità?

## Tre livelli

**Connessione** — il Centro Giusti come *Terzo Luogo della Longevità*: spesa
condivisa, ginnastica dolce, giornalino mensile di comunità, scambio di
saperi, coordinati da una bacheca analogica accessibile anche a chi non usa
il digitale.

**Tocco** — i *Cerchi di Prossimità*: micro-comunità di massimo ~20
residenti a distanza pedonale, per creare legami deboli e mutua
consapevolezza. Pilota: Cerchio 0, attorno al Bar Valentina.

**Delicatezza** — il livello più discreto: *Linea Delicata*, una linea
telefonica gestita da volontari collegata al Centro Giusti: compagnia,
ascolto, informazioni, attivazione della rete di volontariato.

## Team

Martina Guerrini, Adriano Parmentola, Camilla Scalise, Bianca Wang.`,
  ],
  'linea-dotta/it.md': [
    'Linea Dotta',
    'Mobilità Invisibile a Bologna, alternativa al trasporto su gomma.',
    false,
    `Linea Dotta propone un'alternativa alla logistica su gomma: le merci
viaggiano in una rete sotterranea modulare collegata a hub logistici di
superficie, per ridurre congestione, emissioni e rischi dei mezzi pesanti
nel centro storico.

Il sistema: canali sotterranei, tubi modulari, vagoni sensorizzati, rotaie a
levitazione magnetica, propulsione elettrica, recupero di energia, hub
urbani — sul tracciato dei canali storici di Bologna.

## Metodo

Il progetto segue la logica **Design for Six Sigma (DFSS)** nella sequenza
**DMADV**, con **QFD**, **analisi di Kano** e **TRIZ**: benchmark degli
operatori, matrice Cosa/Come per tradurre i bisogni in requisiti
(affidabilità, manutenzione, sicurezza, impatto, velocità, costo),
classificazione Kano, e TRIZ per sciogliere le contraddizioni — velocità vs
consumi, accessibilità vs complessità costruttiva, affidabilità vs
riparabilità — in principi di progetto: modularità, segmentazione,
levitazione magnetica, recupero energetico, manutenzione predittiva.
Verifica con SWOT, analisi di stile e visualizzazione 3D.

## Team

Gruppo 27.`,
  ],
  'talea/it.md': [
    'Punti di Vista — TALEA',
    'Dove la città racconta.',
    true,
    `<!-- BOZZA: descrizione del concept da scrivere con Adriano. -->

Un totem in legno, prototipato fisicamente e installato sul posto: una
micro-architettura urbana modulare e autosufficiente che accompagna la
rigenerazione dei luoghi, unendo natura, informazione e partecipazione.

Il video racconta il Parco del Cavaticcio a Bologna: nel progetto europeo
TALEA il parco si evolve come "Green Cell", rifugio climatico per la
comunità.

## Team

Gruppo 4: Alice Fedriga, Francesco Giacomelli, Adriano Parmentola, Camilla
Scalise. CdLM Advanced Design, AA 2025/2026.`,
  ],
  'autonomia/it.md': [
    'AutonoMIA',
    'Sistema di pentole a induzione con manici ergonomici schermati.',
    true,
    `<!-- BOZZA: descrizione del concept da scrivere con Adriano. -->

Un set di pentole per piani a induzione con manici staccabili e schermati
dal calore.

## Team

Gianluca Lordi, Jacopo Lorenzi, Adriano Parmentola, Irene Santana Acosta,
Lorenzo Zanoni. Laboratorio di Sintesi Finale, Design del Prodotto
Industriale, AA 2024–2025.`,
  ],
  'cartesio/it.md': [
    'Cartesio',
    'Coffee table modulare in compensato.',
    true,
    `<!-- BOZZA: nessun testo esplicativo nei materiali sorgente, solo render.
Copy da scrivere con Adriano. -->`,
  ],
  'vaee/it.md': [
    'Vaee',
    'Wearable utility gadget per la cura personale.',
    true,
    `<!-- Fatti dal documento GRUPPO20vaee.docx. Copy definitivo da scrivere. -->

Bracciale riutilizzabile da viaggio con contenitore rigido in alluminio,
plastica riciclata e silicone medicale: sistema di erogazione a pressione
per creme, sieri e lozioni, design flessibile, chiusura magnetica.

## Team

Chiara Bussi, Elisa Chen, Salvatore Granata, Simona Hu, Adriano Parmentola.
Corso: Metodi di Progetto del Prodotto Industriale. Docenti: G. Olmi,
S. Milli.`,
  ],
  'valverde/it.md': [
    'Murale — Residenza Valverde',
    'Illustrazione murale dedicata a Don Tonino Bello.',
    true,
    `<!-- BOZZA: contesto raccontato da Adriano; il concept dell'illustrazione
è da scrivere. -->

Un'illustrazione murale per la residenza universitaria dedicata a Don Tonino
Bello, dove Adriano viveva. L'opera è stata presentata pubblicamente davanti
al Cardinale di Bologna, ai familiari di Don Tonino e al Ministro
dell'Università.`,
  ],
  'safe-to-work/it.md': [
    'SAFE2WORK',
    'La prima rete di mobilità aziendale data-driven. Per una transizione conveniente.',
    true,
    `<!-- BOZZA: dek ufficiale dal menù portfolio; il resto del materiale è
nelle tavole PDF non ancora estratte. -->

## Team

Gruppo 01.`,
  ],
  'on-the-corner/it.md': [
    'On the Corner',
    'Lampada flat-pack, in cartone riciclato.',
    true,
    `<!-- BOZZA: dek ufficiale dal menù portfolio. Concept esteso da scrivere. -->

Ruota e ispeziona il pezzo direttamente — il modello 3D qui sotto è la
geometria reale, esportata dal file sorgente.`,
  ],
  'rendering-automatico/it.md': [
    'Rendering Automatico',
    'Esame di rendering in VRED e Blender — esercizio tecnico, non un prodotto originale.',
    true,
    `## Team

Gruppo 30: Pace, Adriano Parmentola, Stagi, Tabayoyong.`,
  ],
  'visione-dai-fondi/it.md': [
    'Visione dai Fondi',
    'Sistema espositivo modulare a rotazione stagionale.',
    true,
    `<!-- BOZZA: nessun testo nei materiali sorgente. Copy da scrivere con
Adriano. -->`,
  ],
};

for (const [rel, [title, dek, draft, body]] of Object.entries(files)) {
  const fm = `---\ntitle: ${JSON.stringify(title)}\ndek: ${JSON.stringify(dek)}\ndraft: ${draft}\n---\n\n`;
  fs.writeFileSync(path.join(ROOT, rel), fm + body + '\n');
  console.log('ok', rel);
}

// aggiorna solo il dek del file EN di humus con la one-liner ufficiale
const humusEn = path.join(ROOT, 'humus', 'en.md');
let md = fs.readFileSync(humusEn, 'utf8');
md = md.replace(/^dek: .*$/m, 'dek: "Service design techniques as project support for the restaurant industry."');
fs.writeFileSync(humusEn, md);
console.log('ok humus/en.md (dek)');
