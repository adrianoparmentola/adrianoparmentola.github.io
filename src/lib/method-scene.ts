// Ristorante isometrico della sezione "Lo que se subestima".
// Sezione tagliata: pareti dietro (sinistra e fondo) e facciata bassa davanti,
// così l'interno si vede. Porta, vetrina e insegna sono sulla facciata.
// Ogni volume è una scatola 3D proiettata in isometrico; le zone (con id)
// si illuminano al passaggio. Gli elementi senza zona sono solo arredo.
export type ZoneId = 'management' | 'journey' | 'work' | 'roles' | 'strengths' | 'brand' | 'menu';

type Tone = 'wall' | 'glass' | 'dark' | 'person' | 'wood' | 'chair' | 'plant' | 'food' | 'light' | 'board';

interface Box {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z1: number;
  z2: number;
  zone?: ZoneId;
  tone?: Tone;
}

const S = 30; // scala
const OX = 240; // offset per tenere la scena nel viewBox
const OY = 110;

export const SCENE_W = 520;
export const SCENE_H = 400;

const WALL_H = 3;
const T = 0.25; // spessore pareti

const BOXES: Box[] = [
  // --- pareti dietro: fondo (y = 0) e sinistra (x = 0), altezza piena
  { x1: 0, x2: 10, y1: 0, y2: T, z1: 0, z2: WALL_H, tone: 'wall' },
  { x1: 0, x2: T, y1: 0, y2: 8, z1: 0, z2: WALL_H, tone: 'wall' },
  // --- facciata bassa davanti e lato destro (cordolo)
  { x1: 0, x2: 10, y1: 7.8, y2: 8, z1: 0, z2: 0.4, tone: 'wall' },
  { x1: 9.8, x2: 10, y1: 0, y2: 8, z1: 0, z2: 0.4, tone: 'wall' },

  // --- facciata: porta (zona recorrido) con architrave
  { x1: 1.8, x2: 3.0, y1: 7.7, y2: 8, z1: 0.4, z2: 2.4, zone: 'journey', tone: 'glass' },
  { x1: 1.7, x2: 3.1, y1: 7.7, y2: 8, z1: 2.4, z2: 2.55, tone: 'dark' },
  // --- vetrina con poster (marca e campagne)
  { x1: 4.5, x2: 7.2, y1: 7.7, y2: 8, z1: 0.4, z2: 2.3, zone: 'brand', tone: 'glass' },
  // --- insegna (cosa funziona e cosa costa)
  { x1: 0.9, x2: 7.4, y1: 7.6, y2: 8, z1: 2.6, z2: 3.15, zone: 'strengths', tone: 'dark' },

  // --- tappeto della porta (recorrido)
  { x1: 0.6, x2: 3.4, y1: 6.6, y2: 7.6, z1: 0, z2: 0.04, zone: 'journey', tone: 'dark' },

  // --- lavagna del menù sul fondo (carta)
  { x1: 3.2, x2: 6.8, y1: T, y2: T + 0.05, z1: 1.5, z2: 2.6, tone: 'board' },

  // --- banco: vetrina con cibo e bancone (lavoro e spese)
  { x1: 3.0, x2: 7.5, y1: 1.0, y2: 1.9, z1: 0, z2: 1.1, zone: 'work', tone: 'wood' },
  { x1: 3.2, x2: 7.3, y1: 1.1, y2: 1.7, z1: 1.1, z2: 1.45, tone: 'glass' },
  { x1: 3.5, x2: 4.4, y1: 1.2, y2: 1.6, z1: 1.14, z2: 1.24, tone: 'food' },
  { x1: 4.6, x2: 5.6, y1: 1.2, y2: 1.6, z1: 1.14, z2: 1.24, tone: 'food' },
  { x1: 5.8, x2: 6.9, y1: 1.2, y2: 1.6, z1: 1.14, z2: 1.24, tone: 'food' },

  // --- personale dietro il banco (ruoli)
  { x1: 5.2, x2: 5.6, y1: 0.4, y2: 0.7, z1: 0, z2: 1.7, zone: 'roles', tone: 'person' },
  { x1: 5.25, x2: 5.55, y1: 0.45, y2: 0.65, z1: 1.7, z2: 2.0, zone: 'roles', tone: 'person' },

  // --- ufficio di gestione (lato destro, fondo)
  { x1: 8.2, x2: 9.8, y1: T, y2: 2.6, z1: 0, z2: 2.6, zone: 'management', tone: 'glass' },

  // --- sala: tappeto clienti (carta per cliente)
  { x1: 3.5, x2: 8.1, y1: 3.6, y2: 7.4, z1: 0, z2: 0.04, zone: 'menu', tone: 'dark' },
  // --- piante agli angoli
  { x1: 0.3, x2: 0.8, y1: 0.4, y2: 0.9, z1: 0, z2: 0.5, tone: 'wood' },
  { x1: 0.15, x2: 0.95, y1: 0.25, y2: 1.05, z1: 0.5, z2: 1.3, tone: 'plant' },
  { x1: 9.0, x2: 9.6, y1: 6.7, y2: 7.3, z1: 0, z2: 0.5, tone: 'wood' },
  { x1: 8.85, x2: 9.75, y1: 6.55, y2: 7.45, z1: 0.5, z2: 1.3, tone: 'plant' },
];

// Sei tavoli, ognuno con quattro sedie (seduta + schienale) e una lampada sopra.
const TABLE_XY: [number, number][] = [4.2, 5.8, 7.4].flatMap((x) => [4.5, 6.4].map((y): [number, number] => [x, y]));
for (const [cx, cy] of TABLE_XY) {
  BOXES.push({ x1: cx - 0.4, x2: cx + 0.4, y1: cy - 0.4, y2: cy + 0.4, z1: 0, z2: 0.75, zone: 'menu', tone: 'wood' });
  BOXES.push({ x1: cx - 0.02, x2: cx + 0.02, y1: cy - 0.02, y2: cy + 0.02, z1: 0.75, z2: 2.2, tone: 'dark' });
  BOXES.push({ x1: cx - 0.3, x2: cx + 0.3, y1: cy - 0.3, y2: cy + 0.3, z1: 2.2, z2: 2.32, tone: 'light' });
  const seats: [number, number][] = [
    [cx - 0.6, cy],
    [cx + 0.6, cy],
    [cx, cy - 0.6],
    [cx, cy + 0.6],
  ];
  for (const [sx, sy] of seats) {
    BOXES.push({ x1: sx - 0.15, x2: sx + 0.15, y1: sy - 0.15, y2: sy + 0.15, z1: 0, z2: 0.45, zone: 'menu', tone: 'chair' });
    // schienale dal lato lontano dal tavolo
    const back = sx < cx ? [sx - 0.14, sx - 0.06] : sx > cx ? [sx + 0.06, sx + 0.14] : null;
    if (back) {
      BOXES.push({ x1: back[0], x2: back[1], y1: sy - 0.15, y2: sy + 0.15, z1: 0.45, z2: 0.95, zone: 'menu', tone: 'chair' });
    } else {
      const back2 = sy < cy ? [sy - 0.14, sy - 0.06] : [sy + 0.06, sy + 0.14];
      BOXES.push({ x1: sx - 0.15, x2: sx + 0.15, y1: back2[0], y2: back2[1], z1: 0.45, z2: 0.95, zone: 'menu', tone: 'chair' });
    }
  }
}

function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * 0.866 * S + OX, (x + y) * 0.5 * S - z * S + OY];
}

const pts = (list: [number, number][]) => list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');

export interface ScenePart {
  zone?: ZoneId;
  tone: Tone;
  faces: { kind: 'top' | 'x' | 'y'; points: string }[];
}

// Trasformazione SVG per scrivere testo su un piano verticale del locale.
// piano y = costante: l'asse x del testo segue la direzione del piano isometrico.
function textOnPlaneY(x: number, y: number, z: number): string {
  const [X, Y] = iso(x, y, z);
  return `matrix(0.866 0.5 0 1 ${X.toFixed(1)} ${Y.toFixed(1)})`;
}

export function buildScene(labels: { sign: string; menu: string }) {
  const floor = pts([iso(0, 0, 0), iso(10, 0, 0), iso(10, 8, 0), iso(0, 8, 0)]);
  const parts = BOXES.map((b) => {
    const top = [iso(b.x1, b.y1, b.z2), iso(b.x2, b.y1, b.z2), iso(b.x2, b.y2, b.z2), iso(b.x1, b.y2, b.z2)];
    const xFace = [iso(b.x2, b.y1, b.z1), iso(b.x2, b.y2, b.z1), iso(b.x2, b.y2, b.z2), iso(b.x2, b.y1, b.z2)];
    const yFace = [iso(b.x1, b.y2, b.z1), iso(b.x2, b.y2, b.z1), iso(b.x2, b.y2, b.z2), iso(b.x1, b.y2, b.z2)];
    return {
      zone: b.zone,
      tone: b.tone ?? ('wall' as Tone),
      order: (b.x2 + b.y2) / 2 + b.z2 / 10,
      faces: [
        { kind: 'x' as const, points: pts(xFace) },
        { kind: 'y' as const, points: pts(yFace) },
        { kind: 'top' as const, points: pts(top) },
      ],
    };
  });
  // dal più lontano al più vicino, così le facce si coprono nel verso giusto
  parts.sort((a, b) => a.order - b.order);
  return {
    floor,
    parts: parts.map(({ order, ...rest }) => rest),
    signTransform: textOnPlaneY(1.1, 8.02, 2.82),
    menuTransform: textOnPlaneY(3.5, T + 0.07, 2.35),
    labels,
  };
}

// Ordine dei gruppi nel menu di selezione (stesso ordine dei pulsanti)
export const ZONE_IDS: ZoneId[] = ['journey', 'management', 'work', 'roles', 'strengths', 'brand', 'menu'];
