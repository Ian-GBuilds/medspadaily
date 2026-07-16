import StoryCard from "@/components/StoryCard";
import { getPublishedStories } from "@/lib/db/queries";
import type { StoryCategory } from "@/lib/db/types";
import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_TIER_RULE,
  TIER_META,
} from "@/lib/site";

// ---------------------------------------------------------------------------
// CategoryArchive — a section, not just an archive list.
//
// The header block wears the section's identity:
//
//   Kicker:     "Section n · The [x] desk" — locates the category in the
//               masthead's implicit table of contents.
//   Headline:   the category name, roman serif at scale.
//   Standing:   the CATEGORY_DESCRIPTIONS mission line.
//   Rule line:  "Requires Tier 1 sources" or "Accepts Tier 2 sources" —
//               pulled from CATEGORY_TIER_RULE. This is the moment the
//               tier system is contextually explained, so a reader who
//               lands here from search knows the standard.
//
// Below that, a two-up magazine-index grid of story cards (hero image +
// tier badge + headline + dek + date), collapsing to one column on
// mobile. The tier badge on each card lets the reader scan a section by
// strength of evidence.
// ---------------------------------------------------------------------------

// Section numbering — order-based, roman numerals. Kept small so we don't
// pull in a numeral library for two-digit output.
function toRoman(n: number): string {
  const seq: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of seq) {
    while (n >= v) { out += s; n -= v; }
  }
  return out || "I";
}

export default async function CategoryArchive({
  category,
}: {
  category: StoryCategory;
}) {
  const stories = await getPublishedStories({ category });
  const rule = CATEGORY_TIER_RULE[category];
  const ruleMeta = TIER_META[rule];
  const sectionNo = toRoman(CATEGORIES.indexOf(category) + 1);
  const ruleLine =
    rule === 1
      ? `Requires ${ruleMeta.label} sources · ${ruleMeta.short}`
      : `Accepts ${ruleMeta.label} sources · ${ruleMeta.short}`;

  return (
    <div className="py-12">
      {/* Header block */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          Section {sectionNo} · The {CATEGORY_LABELS[category]} desk
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
        <p className="mt-6 font-sans text-xs uppercase tracking-[0.16em] text-accent">
          {ruleLine}
        </p>
      </div>

      {/* Story list — magazine-index grid.
       *
       * We use `variant="medium"` (the homepage 2nd-tier style: hero image
       * on top, then eyebrow + tier + headline + dek + date) so the hero
       * image we already generate per story shows up in the section index.
       * Homepage MEDIUM uses `sm:grid-cols-2`; we match that here so a
       * category page reads like a two-up magazine index on tablet and up,
       * one-column on mobile. Gap and rhythm are tuned to sit slightly
       * looser than the homepage band because sections can be much longer.
       */}
      <section aria-label={`${CATEGORY_LABELS[category]} stories`}>
        <div className="flex items-baseline justify-between border-b border-line py-3">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            {stories.length === 0
              ? "No stories yet"
              : stories.length === 1
                ? "One story"
                : `${stories.length} stories`}
          </h2>
        </div>
        {stories.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 py-10 sm:grid-cols-2">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} variant="medium" />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-ink-muted">
            The first story in this section is on its way.
          </p>
        )}
      </section>
    </div>
  );
}
