import { getCollection, type CollectionEntry } from 'astro:content';

export type Guide = CollectionEntry<'guides'>['data'];
export type GuideEntry = CollectionEntry<'guides'>;

/**
 * Get all guide index entries (main guide files)
 */
export async function getGuides() {
  const allGuides = await getCollection('guides');
  // Index files have just the folder name as the slug
  return allGuides.filter(guide => !guide.slug.includes('/'));
}

/**
 * Get a specific guide by slug
 */
export async function getGuide(slug: string) {
  const allGuides = await getCollection('guides');
  // Index files have just the folder name as the slug
  return allGuides.find(guide => guide.slug === slug);
}

/**
 * Get all sections for a specific guide
 */
export async function getGuideSections(guideSlug: string) {
  const allGuides = await getCollection('guides');
  const sections = allGuides.filter(guide => 
    guide.slug.startsWith(`${guideSlug}/sections/`) && guide.data.section
  );
  
  return sections.sort((a, b) => 
    (a.data.order || 0) - (b.data.order || 0)
  );
}

/**
 * Get a specific section by guide slug and section slug
 */
export async function getGuideSection(guideSlug: string, sectionSlug: string) {
  const sections = await getGuideSections(guideSlug);
  return sections.find(section => section.data.section === sectionSlug);
}

/**
 * Get unique guide slugs (folder names)
 */
export async function getGuideSlugs() {
  const allGuides = await getCollection('guides');
  const slugs = new Set(allGuides.map(g => g.slug.split('/')[0]));
  return Array.from(slugs);
}

/**
 * Format guide data for display
 */
export function formatGuideData(guide: Guide) {
  return {
    ...guide,
    lessonCount: typeof guide.lessons === 'number' 
      ? guide.lessons 
      : Array.isArray(guide.lessons) 
        ? guide.lessons.length 
        : 0,
    updatedDate: guide.updatedDate 
      ? new Date(guide.updatedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Recently updated'
  };
}