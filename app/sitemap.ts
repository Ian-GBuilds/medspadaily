import type { MetadataRoute } from "next";
import { getPublishedStories, getTreatments } from "@/lib/db/queries";
import { CATEGORY_ROUTES, SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, treatments] = await Promise.all([
    getPublishedStories(), getTreatments(),
  ]);
  const staticPages = ["", "/about", "/how-we-source", "/treatments", "/subscribe",
    "/privacy", "/terms",
    ...Object.values(CATEGORY_ROUTES).map((r) => `/${r}`),
  ].map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "daily" as const }));
  return [
    ...staticPages,
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
