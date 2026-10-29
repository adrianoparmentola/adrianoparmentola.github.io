// Configuratore per l'esperto: formato, livello di prezzo, location e target.
// Non chiede numeri: dalle scelte qualitative ricava coerenza e cifre
// orientative (coperti, rotazioni, scontrino, fatturato). Le regole sono
// ipotesi di progetto, tranne quelle del caso Hum.us (tavola calda, linea
// guidata, ritiro veloce), che vengono dalla tesi. Da calibrare con dati reali.

export type FormatId = 'osteria' | 'fine_dining' | 'tavola_calda' | 'pizzeria_taglio' | 'pizzeria_servizio' | 'mensa';
export type PriceId = 1 | 2 | 3;
export type LocationId = 'centro' | 'campus' | 'uffici' | 'periferia' | 'turistica';
export type TargetId = 'studenti' | 'turisti' | 'lavoro' | 'famiglie';

export interface Choice {
  format: FormatId;
  price: PriceId;
  location: LocationId;
  target: TargetId;
}

// Valori di partenza per formato (ipotesi, da calibrare)
const FORMAT: Record<FormatId, { covers: number; turns: number; factor: number }> = {
  osteria: { covers: 70, turns: 2.2, factor: 1 },
  fine_dining: { covers: 35, turns: 1.2, factor: 1.3 },
  tavola_calda: { covers: 180, turns: 4.5, factor: 0.7 },
  pizzeria_taglio: { covers: 150, turns: 5, factor: 0.6 },
  pizzeria_servizio: { covers: 90, turns: 2.4, factor: 1 },
  mensa: { covers: 320, turns: 2.8, factor: 0.5 },
};

const PRICE_TICKET: Record<PriceId, number> = { 1: 11, 2: 24, 3: 48 };

const LOCATION_FACTOR: Record<LocationId, number> = {
  centro: 1.1,
  campus: 1.25,
  uffici: 1,
  periferia: 0.75,
  turistica: 1.2,
};

export type RuleId =
  | 'tc_premium'
  | 'fine_low'
  | 'taglio_premium'
  | 'campus_premium'
  | 'periferia_premium'
  | 'uffici_students'
  | 'periferia_tourists'
  | 'fine_students'
  | 'tc_tourists'
  | 'price1_turistica'
  | 'campus_students'
  | 'uffici_lunch'
  | 'centro_tourists'
  | 'taglio_lunch';

interface Rule {
  id: RuleId;
  level: 'ok' | 'warn';
  test: (c: Choice) => boolean;
}

export const RULES: Rule[] = [
  { id: 'tc_premium', level: 'warn', test: (c) => c.format === 'tavola_calda' && c.price === 3 },
  { id: 'fine_low', level: 'warn', test: (c) => c.format === 'fine_dining' && c.price === 1 },
  { id: 'taglio_premium', level: 'warn', test: (c) => c.format === 'pizzeria_taglio' && c.price === 3 },
  { id: 'campus_premium', level: 'warn', test: (c) => c.location === 'campus' && c.price === 3 },
  { id: 'periferia_premium', level: 'warn', test: (c) => c.location === 'periferia' && c.price === 3 },
  { id: 'uffici_students', level: 'warn', test: (c) => c.location === 'uffici' && c.target === 'studenti' },
  { id: 'periferia_tourists', level: 'warn', test: (c) => c.location === 'periferia' && c.target === 'turisti' },
  { id: 'fine_students', level: 'warn', test: (c) => c.format === 'fine_dining' && c.target === 'studenti' },
  { id: 'tc_tourists', level: 'warn', test: (c) => c.format === 'tavola_calda' && c.target === 'turisti' },
  { id: 'price1_turistica', level: 'warn', test: (c) => c.price === 1 && c.location === 'turistica' },
  { id: 'campus_students', level: 'ok', test: (c) => c.location === 'campus' && c.target === 'studenti' },
  { id: 'uffici_lunch', level: 'ok', test: (c) => c.location === 'uffici' && c.target === 'lavoro' },
  { id: 'centro_tourists', level: 'ok', test: (c) => (c.location === 'centro' || c.location === 'turistica') && c.target === 'turisti' },
  { id: 'taglio_lunch', level: 'ok', test: (c) => c.format === 'pizzeria_taglio' && c.target === 'lavoro' },
];

export interface Result {
  score: number;
  matched: { id: RuleId; level: 'ok' | 'warn' }[];
  covers: number;
  turns: number;
  ticket: number;
  monthly: number;
}

export function evaluate(c: Choice): Result {
  const matched = RULES.filter((r) => r.test(c)).map((r) => ({ id: r.id, level: r.level }));
  const delta = matched.reduce((acc, m) => acc + (m.level === 'ok' ? 10 : -15), 0);
  const score = Math.max(25, Math.min(100, 70 + delta));
  const f = FORMAT[c.format];
  const covers = Math.round(f.covers * LOCATION_FACTOR[c.location] * (0.6 + score / 250));
  const turns = Math.round(f.turns * (0.8 + score / 500) * 10) / 10;
  const ticket = Math.round(PRICE_TICKET[c.price] * f.factor);
  const monthly = Math.round(covers * ticket * 26);
  return { score, matched, covers, turns, ticket, monthly };
}

export const FORMAT_IDS = Object.keys(FORMAT) as FormatId[];
export const LOCATION_IDS = Object.keys(LOCATION_FACTOR) as LocationId[];
export const TARGET_IDS: TargetId[] = ['studenti', 'turisti', 'lavoro', 'famiglie'];
export const PRICE_IDS: PriceId[] = [1, 2, 3];
