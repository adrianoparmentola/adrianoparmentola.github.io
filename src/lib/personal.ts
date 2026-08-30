// Foto personali per il blocco "chi sono" in home. Stesso approccio di
// images.ts: glob eager, così passano dall'ottimizzazione di astro:assets.
// La cartella può essere vuota - in quel caso il blocco mostra solo il testo.

const personalModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/personal/*.{webp,png,jpg,jpeg}',
  { eager: true }
);

export function getPersonalPhotos(): ImageMetadata[] {
  return Object.keys(personalModules)
    .sort()
    .map((k) => personalModules[k]!.default);
}
