import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Dati di progetto indipendenti dalla lingua: un file meta.json per progetto.
const projectMeta = defineCollection({
  loader: glob({
    pattern: '*/meta.json',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\/meta\.json$/, ''),
  }),
  schema: z.object({
    name: z.string(),
    year: z.string().optional(),
    type: z.enum(['prodotto', 'servizio', 'installazione', 'campagna', 'skill-demo']),
    // include: pubblicato in Progetti
    // pending: materiale insufficiente/da confermare, non ancora pubblicato
    // demo: pubblicato ma etichettato come esercizio tecnico, non case study
    status: z.enum(['include', 'pending', 'demo']),
    // Tassonomia ufficiale dal "menù portfolio" (Prodotti/Servizi) + Spazi
    // aggiunta dall'utente. I demo/senza categoria finiscono in coda alla
    // pagina Progetti.
    category: z.enum(['servizi', 'prodotti', 'spazi']).optional(),
    featured: z.boolean().default(false),
    methodTags: z.array(z.string()).default([]),
    assets: z
      .array(
        z.object({
          src: z.string(), // path relativo alla cartella assets/ del progetto (o assoluto /public per video/model)
          kind: z.enum(['image', 'video', 'model']).default('image'),
          // thumb: usata solo come immagine della card nella griglia progetti
          role: z.enum(['hero', 'gallery', 'thumb']).default('gallery'),
          // Didascalia fattuale (per ora una sola lingua, EN - vedi NOTES.md).
          caption: z.string().optional(),
          // true = occupa tutta la larghezza del flusso, per panoramiche/tavole
          wide: z.boolean().default(false),
        })
      )
      .default([]),
  }),
});

// Copy per lingua: un file {lang}.md per progetto, corpo = case study.
const projects = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    dek: z.string().optional(),
    // bozza = testo derivato solo da fatti confermati, in attesa del copy definitivo dell'utente
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    linkedin: z.string().url(),
    quote: z.string(),
    rating: z.number().min(0).max(5).optional(),
  }),
});

export const collections = { projectMeta, projects, testimonials };
