import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import type { ContentOverrides } from '@/i18n/editable';

export const CONTENT_TAG = 'site-content';
export const TEXT_PREFIX = 'text.';

/** Text overrides saved from the admin "Textos do Site" page (uncached). */
export async function readContentOverrides(): Promise<ContentOverrides> {
  const rows = await prisma.settings.findMany({ where: { key: { startsWith: TEXT_PREFIX } } });
  const overrides: ContentOverrides = { pt: {}, en: {} };
  for (const { key, value } of rows) {
    const [, locale, ...path] = key.split('.');
    if (locale === 'pt' || locale === 'en') overrides[locale][path.join('.')] = value;
  }
  return overrides;
}

// Failures are cached too (for a few minutes) so an unreachable DB doesn't stall every render
export const getContentOverrides = unstable_cache(
  async (): Promise<ContentOverrides> => {
    try {
      return await readContentOverrides();
    } catch (error) {
      console.error('Content overrides unavailable:', error);
      return { pt: {}, en: {} };
    }
  },
  ['site-content-overrides'],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

export const getSeoSettings = unstable_cache(
  async (): Promise<{ title?: string; description?: string }> => {
    try {
      const rows = await prisma.settings.findMany({
        where: { key: { in: ['site_title', 'site_description'] } },
      });
      const map = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value.trim()]));
      return { title: map.site_title || undefined, description: map.site_description || undefined };
    } catch (error) {
      console.error('SEO settings unavailable:', error);
      return {};
    }
  },
  ['site-seo-settings'],
  { tags: [CONTENT_TAG], revalidate: 300 }
);
