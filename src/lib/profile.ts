// Dati di profilo verificati dal "menù portfolio" (fonte ufficiale).
// Il telefono resta volutamente fuori dal sito (decisione utente):
// è presente solo nel CV/menù scaricabili.
export const profile = {
  name: 'Adriano Parmentola',
  email: 'adrianoparmentola03@gmail.com',
  instagram: { handle: '@adriano_parmentola', url: 'https://www.instagram.com/adriano_parmentola/' },
  linkedin: { handle: '@adrianoparmentola', url: 'https://www.linkedin.com/in/adrianoparmentola/' },
  cvPath: '/cv/Adriano-Parmentola-CV.pdf',
  languages: [
    'Inglese (C1) — ESOL Certification',
    'Francese (A2) — Certificazione statale',
    'Spagnolo (A2)',
    'Italiano — madrelingua',
  ],
  gallupTop: ['Input', 'Positivity', 'Includer'],
  speedTasks: [
    { key: 'interiors', days: 7 },
    { key: 'identity', days: 12 },
  ],
} as const;
