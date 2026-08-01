import type { MetadataRoute } from "next";
import { getPublishedStories, getTreatments } from "@/lib/db/queries";
import { CATEGORY_ROUTES, LEGAL_LAST_REVISED, SITE } from "@/lib/site";
import type { StoryCategory } from "@/lib/db/types";

// ---------------------------------------------------------------------------
// Sitemap. Two prior bugs, both fixed here:
//   1. Blanket `changeFrequency: "daily"` on 15 static pages — a hint Google
//      openly ignores and treats as noise. Dropped entirely.
//   2. `lastModified` was deploy-stamped (every URL within a 3-min window),
//      not content-stamped. Now every URL carries a *real* last-modified:
//        - stories        → published_at
//        - treatments     → updated_at
//        - homepage       → newest story date (the front page changes when
//                           content lands)
//        - category index → newest story date *within that category*
//        - /treatments    → newest treatment updated_at
//        - legal/about    → LEGAL_LAST_REVISED (bumped when the copy is edited)
// A page with no content yet simply omits lastModified rather than faking one.
// ---------------------------------------------------------------------------

function newest(dates: (string | null | undefined)[]): string | undefined {
  const valid = dates.filter((d): d is string => !!d);
  if (valid.length === 0) return undefined;
  return valid.reduce((a, b) => (a > b ? a : b));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, treatments] = await Promise.all([
    getPublishedStories(),
    getTreatments(),
  ]);

  const newestStory = newest(stories.map((s) => s.published_at));
  const newestTreatment = newest(treatments.map((t) => t.updated_at));

  // Category index pages — lastmod is the newest story in that category.
  const categoryEntries = (
    Object.entries(CATEGORY_ROUTES) as [StoryCategory, string][]
  ).map(([category, route]) => ({
    url: `${SITE.url}/${route}`,
    lastModified:
      newest(
        stories
          .filter((s) => s.category === category)
          .map((s) => s.published_at),
      ) ?? undefined,
  }));

  // Genuinely static informational/legal pages — a maintained review date.
  const legalPages = [
    "/about",
    SITE.author.path,
    "/how-we-source",
    "/subscribe",
    "/for-clinics",
    "/corrections",
    "/privacy",
    "/terms",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: LEGAL_LAST_REVISED,
  }));

  return [
    { url: SITE.url, lastModified: newestStory ?? LEGAL_LAST_REVISED },
    { url: `${SITE.url}/treatments`, lastModified: newestTreatment ?? LEGAL_LAST_REVISED },
    ...categoryEntries,
    ...legalPages,
    ...stories.map((s) => ({
      url: `${SITE.url}/stories/${s.slug}`,
      lastModified: s.published_at ?? undefined,
    })),
    ...treatments.map((t) => ({
      url: `${SITE.url}/treatments/${t.slug}`,
      lastModified: t.updated_at,
    })),
  ];
}
