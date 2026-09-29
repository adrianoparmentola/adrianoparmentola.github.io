// Costruisce il CV: un .docx pulito (modificabile in Word) e il PDF che il
// sito mette in download. I testi stanno in cv/content.json.
//
//   node cv/build-cv.mjs
//
// Il documento è scritto a mano in OOXML: quello originale era il risultato
// di una conversione e conteneva 98 caselle di testo, con le lettere dei
// titoli una per casella. Da lì venivano il tracking dei titoli, le colonne
// disallineate e le liste che andavano a capo sotto il trattino.
//
// Regole tipografiche applicate:
//  - nessun tracking sui titoli e sul nome
//  - liste con rientro sporgente: la riga che continua si allinea alla prima
//    parola, non al trattino
//  - interlinea fissa e corta, spazio maggiore fra un blocco e l'altro:
//    experience ed education si leggono come gruppi
//  - tre colonne in fondo, larghe uguali e con la stessa distanza
//  - niente trattini lunghi nel testo (restano gli intervalli di date)

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const c = JSON.parse(fs.readFileSync(path.join(HERE, 'content.json'), 'utf8'));

const DOCX = path.join(HERE, 'Adriano-Parmentola-CV.docx');
const PDF_OUT = path.join(ROOT, 'public/cv/Adriano-Parmentola-CV.pdf');

// ---------------------------------------------------------------- misure
// A4, in ventesimi di punto (twip). 1 mm = 56,7 twip.
const PAGE_W = 11906;
const MARGIN_X = 850; // 15 mm
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const BULLET_IND = 175; // rientro della lista: dove inizia il testo
const COL_W = Math.floor(CONTENT_W / 3);
const COL_GUTTER = 420;

const FONT = 'Arial';
const INK = '111111';
const MUTED = '595959';
const RULE = 'BFBFBF';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Un run di testo. size in punti, non in mezzi punti. */
function run(text, { size = 8.5, bold = false, italic = false, color = INK, caps = false } = {}) {
  return (
    `<w:r><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/>` +
    (bold ? '<w:b/>' : '') +
    (italic ? '<w:i/>' : '') +
    (caps ? '<w:caps/>' : '') +
    `<w:color w:val="${color}"/><w:sz w:val="${Math.round(size * 2)}"/><w:szCs w:val="${Math.round(size * 2)}"/>` +
    // tracking sempre a zero: niente lettere distanziate nei titoli
    `<w:spacing w:val="0"/></w:rPr>` +
    `<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`
  );
}

const tab = () => '<w:r><w:tab/></w:r>';

// Collegamenti cliccabili nel PDF (email e sito): stesso aspetto del testo,
// nessun blu sottolineato che spezzerebbe la pagina.
const LINKS = { mail: { id: 'rId6', url: 'mailto:' + c.contact[2] }, site: { id: 'rId7', url: 'https://adrianoparmentola.github.io/en/' } };
const link = (text, which, opts) => `<w:hyperlink r:id="${LINKS[which].id}">${run(text, opts)}</w:hyperlink>`;

/** Un paragrafo. line = interlinea fissa in punti. */
function para(runs, { before = 0, after = 0, line = 10, ind = 0, hanging = 0, rightTab = 0, border = false, justify = false } = {}) {
  const tabs = [];
  if (hanging) tabs.push(`<w:tab w:val="left" w:pos="${ind}"/>`);
  if (rightTab) tabs.push(`<w:tab w:val="right" w:pos="${rightTab}"/>`);
  return (
    '<w:p><w:pPr>' +
    (tabs.length ? `<w:tabs>${tabs.join('')}</w:tabs>` : '') +
    (ind ? `<w:ind w:left="${ind}"${hanging ? ` w:hanging="${hanging}"` : ''}/>` : '') +
    (border ? `<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="3" w:color="${RULE}"/></w:pBdr>` : '') +
    (justify ? '<w:jc w:val="both"/>' : '') +
    `<w:spacing w:before="${Math.round(before * 20)}" w:after="${Math.round(after * 20)}" w:line="${Math.round(line * 20)}" w:lineRule="exact"/>` +
    '</w:pPr>' +
    runs.join('') +
    '</w:p>'
  );
}

// ---------------------------------------------------------------- blocchi

const sectionTitle = (text) => para([run(text, { size: 8, bold: true })], { before: 13.5, after: 4, line: 10, border: true });

/** Riga di intestazione di una voce: ruolo in nero, ente in grigio, data a destra. */
const entryHead = (e) =>
  para(
    [
      run(e.role, { size: 9, bold: true }),
      ...(e.org ? [run(', ', { size: 9 }), run(e.org, { size: 9, color: MUTED })] : []),
      tab(),
      run(e.date, { size: 8, color: MUTED }),
    ],
    { before: 7.6, line: 10.7, rightTab: CONTENT_W }
  );

const noteLine = (text) => para([run(text, { size: 8.7, italic: true, color: MUTED })], { before: 1.2, line: 10.2 });

// la riga che continua si allinea alla prima parola, non al trattino
const bullet = (text) =>
  para([run('–', { size: 8.7, color: MUTED }), tab(), run(text, { size: 8.7 })], {
    before: 1.5,
    line: 10.1,
    ind: BULLET_IND,
    hanging: BULLET_IND,
  });

function entry(e) {
  return [entryHead(e), ...(e.note ? [noteLine(e.note)] : []), ...(e.bullets ?? []).map(bullet)].join('');
}

/** Le tre colonne in fondo: stessa larghezza, stessa distanza. */
function columnsTable(qrRelId) {
  const cell = (col, i) => {
    const body = [
      para([run(col.title, { size: 7.5, bold: true })], { after: 3, line: 9 }),
      ...col.lines.map((l) =>
        para([l.startsWith('adrianoparmentola') ? link(l, 'site', { size: 8.2 }) : run(l, { size: 8.2 })], {
          line: 10.4,
          before: 0.8,
        })
      ),
    ];
    if (i === 2) {
      body.push(
        '<w:p><w:pPr><w:spacing w:before="90" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>' +
          `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
          // 18 mm: leggibile dal telefono senza rubare la pagina
          `<wp:extent cx="648000" cy="648000"/><wp:docPr id="7" name="QR"/>` +
          `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
          `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="7" name="QR"/><pic:cNvPicPr/></pic:nvPicPr>` +
          `<pic:blipFill><a:blip r:embed="${qrRelId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
          `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="648000" cy="648000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
          `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`
      );
    }
    const marRight = i < 2 ? COL_GUTTER : 0;
    return (
      `<w:tc><w:tcPr><w:tcW w:w="${COL_W}" w:type="dxa"/>` +
      `<w:tcMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="${marRight}" w:type="dxa"/></w:tcMar>` +
      `</w:tcPr>${body.join('')}</w:tc>`
    );
  };
  return (
    `<w:tbl><w:tblPr><w:tblW w:w="${CONTENT_W}" w:type="dxa"/><w:tblLayout w:type="fixed"/>` +
    '<w:tblBorders><w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/></w:tblBorders>' +
    '<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr>' +
    `<w:tblGrid>${[0, 1, 2].map(() => `<w:gridCol w:w="${COL_W}"/>`).join('')}</w:tblGrid>` +
    `<w:tr>${c.columns.map(cell).join('')}</w:tr></w:tbl>`
  );
}

// ---------------------------------------------------------------- documento

function documentXml(qrRelId) {
  const parts = [];
  parts.push(para([run(c.name, { size: 19, bold: true })], { line: 21 }));
  parts.push(para([run(c.role, { size: 8, bold: true })], { before: 2, line: 9.5 }));
  // più aria fra città, telefono e email
  parts.push(
    para(
      [
        run(c.contact[0] + '      ·      ', { size: 8, color: MUTED }),
        run(c.contact[1] + '      ·      ', { size: 8, color: MUTED }),
        link(c.contact[2], 'mail', { size: 8, color: MUTED }),
      ],
      { before: 3.5, after: 2, line: 9.5 }
    )
  );

  parts.push(sectionTitle(c.profileTitle));
  parts.push(para([run(c.profile, { size: 8.7 })], { line: 10.7, justify: true }));

  parts.push(sectionTitle(c.experienceTitle));
  parts.push(...c.experience.map(entry));

  parts.push(sectionTitle(c.educationTitle));
  parts.push(...c.education.map(entry));

  parts.push(para([], { before: 13, after: 5, line: 2, border: true }));
  parts.push(columnsTable(qrRelId));

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
    'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
    `<w:body>${parts.join('')}` +
    `<w:sectPr><w:pgSz w:w="${PAGE_W}" w:h="16838"/>` +
    `<w:pgMar w:top="624" w:right="${MARGIN_X}" w:bottom="454" w:left="${MARGIN_X}" w:header="0" w:footer="0" w:gutter="0"/>` +
    '</w:sectPr></w:body></w:document>'
  );
}

// ---------------------------------------------------------------- zip

function crc32(buf) {
  let c;
  const table = crc32.table ?? (crc32.table = Array.from({ length: 256 }, (_, n) => {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  }));
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const [name, content] of files) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    chunks.push(local, nameBuf, deflated);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(deflated.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += local.length + nameBuf.length + deflated.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, centralBuf, end]);
}

// ---------------------------------------------------------------- build

const qr = fs.readFileSync(path.join(HERE, 'qr.jpg'));
const QR_REL = 'rId5';

const files = [
  [
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Default Extension="jpg" ContentType="image/jpeg"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '</Types>',
  ],
  [
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>',
  ],
  [
    'word/_rels/document.xml.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      `<Relationship Id="${QR_REL}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/qr.jpg"/>` +
      `<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="mailto:${c.contact[2]}" TargetMode="External"/>` +
      '<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://adrianoparmentola.github.io/en/" TargetMode="External"/>' +
      '<Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>',
  ],
  [
    'word/styles.xml',
    // Arial anche come predefinito: senza, Word usa il suo font (Aptos) per i
    // segni di paragrafo e se ne trova traccia nel PDF
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults>' +
      `<w:rPrDefault><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}" w:eastAsia="${FONT}"/><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr></w:rPrDefault>` +
      '<w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
      '</w:docDefaults>' +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
      '</w:styles>',
  ],
  ['word/document.xml', documentXml(QR_REL)],
  ['word/media/qr.jpg', qr],
];

fs.writeFileSync(DOCX, zip(files));
console.log('docx:', DOCX, (fs.statSync(DOCX).size / 1024).toFixed(0) + ' KB');

if (process.argv.includes('--docx')) process.exit(0);

// Esportazione in PDF con Word (COM), poi copia in public/cv/
const ps = `
$ErrorActionPreference = 'Stop'
$app = New-Object -ComObject Word.Application
$app.Visible = $false
$doc = $app.Documents.Open('${DOCX.replace(/'/g, "''")}', $false, $true)
$pages = $doc.ComputeStatistics(2)
$doc.SaveAs([ref]'${PDF_OUT.replace(/'/g, "''")}', [ref]17)
$doc.Close($false)
$app.Quit()
Write-Output "pagine=$pages"
`;
fs.mkdirSync(path.dirname(PDF_OUT), { recursive: true });
const out = execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { encoding: 'utf8' });
const pages = (out.match(/pagine=(\d+)/) || [])[1];
console.log('pdf: ', PDF_OUT, (fs.statSync(PDF_OUT).size / 1024).toFixed(0) + ' KB');
console.log('pagine:', pages, Number(pages) === 1 ? '(una sola, come deve essere)' : '*** PIÙ DI UNA ***');
