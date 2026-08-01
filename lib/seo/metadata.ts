import type { Metadata } from "next";
import { getPublishedStories } from "@/lib/db/queries";
import type { StoryCategory } from "@/lib/db/types";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
} from "@/lib/site";

// ---------------------------------------------------------------------------
// categoryMetadata — metadata for a section (category) archive page.
//
// A section with zero published stories renders "No stories yet…" as its whole
// body — a textbook thin/empty indexable shell. We keep it reachable (so it
// fills in the moment a story lands and stays in the nav) but tell search
// engines not to index it until it has content. Self-healing: because the page
// uses ISR (`revalidate = 300`), the noindex lifts automatically on the next
// revalidate once the section has ≥1 published story — no redeploy needed.
//
// On a DB error we default to indexable: never hide a real section just because
// Supabase blipped when metadata was generated.
// ---------------------------------------------------------------------------
export async function categoryMetadata(
  category: StoryCategory,
  title: string = CATEGORY_LABELS[category],
): Promise<Metadata> {
  let hasStories = true;
  try {
    const stories = await getPublishedStories({ category, limit: 1 });
    hasStories = stories.length > 0;
  } catch {
    hasStories = true;
  }
  return {
    title,
    description: CATEGORY_DESCRIPTIONS[category],
    alternates: { canonical: `/${CATEGORY_ROUTES[category]}` },
    robots: hasStories ? undefined : { index: false, follow: true },
  };
}
