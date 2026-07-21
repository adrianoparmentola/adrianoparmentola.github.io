import { defineConfig } from 'astro/config';

// Sito statico su GitHub Pages, scelta "repo utente" (adrianoparmentola.github.io).
// base '/' è corretto per questo tipo di repo.
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
