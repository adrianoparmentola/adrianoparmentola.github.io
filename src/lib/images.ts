// Risolve gli asset immagine referenziati per nome file in meta.json (es.
// "hero.webp") nel modulo importato da astro:assets, per src/content/projects/{slug}/assets/.

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/projects/*/assets/*.{webp,png,jpg,jpeg}',
  { eager: true }
);

export function getProjectAsset(slug: string, filename: string): ImageMetadata | undefined {
  const key = `/src/content/projects/${slug}/assets/${filename}`;
  return imageModules[key]?.default;
}
