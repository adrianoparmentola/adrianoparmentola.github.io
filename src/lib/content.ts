import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export async function getPublishedProjects() {
  const metas = await getCollection('projectMeta', ({ data }) => data.status !== 'pending');
  return metas.sort((a, b) => Number(b.data.featured) - Number(a.data.featured));
}

// Copy nella lingua richiesta, con fallback alla lingua di default se la
// traduzione non esiste ancora (molti progetti hanno solo l'EN per ora).
export async function getProjectCopy(
  slug: string,
  lang: Lang
): Promise<CollectionEntry<'projects'> | undefined> {
  return (
    (await getEntry('projects', `${slug}/${lang}`)) ??
    (await getEntry('projects', `${slug}/${defaultLang}`))
  );
}
