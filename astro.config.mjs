import { defineConfig } from 'astro/config';

// Sito statico su GitHub Pages, scelta "repo utente" (<username>.github.io).
// base '/' è corretto per questo tipo di repo.
// ⚠️ SOSTITUISCI "adrianoparmentola" con il tuo vero username GitHub qui sotto:
// serve solo per URL assoluti (canonical/OG), gli asset funzionano comunque.
export default defineConfig({
  site: 'https://adrianoparmentola.github.io',
  base: '/',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'it', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  image: {
    // I sorgenti in "wbsite assets" arrivano fino a 65MB: forziamo un limite
    // di qualità/servizio ragionevole invece di servire i pesi originali.
    remotePatterns: [],
  },
});
