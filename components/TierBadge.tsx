import { TIER_META } from "@/lib/site";

// ---------------------------------------------------------------------------
// TierBadge — the design system's load-bearing tier mark.
//
// The publication's promise ("we show our sources and rate them") depends on
// this being a first-class, visible element — not a footnote at the bottom
// of the sources block. It renders in three sizes to fit different contexts:
//
//   size="sm"  → next to a category kicker in a story-card list.
//   size="md"  → next to the eyebrow on the story page hero.
//   size="lg"  → inside the standfirst band, where it's the visual anchor.
//
// Style: a sage hairline square with the tier number in the number column,
// followed by a small-caps label. Sage is the one house accent — used here
// because tiering IS the identity, so this is exactly the "one moment per
// view" the design system reserves the color for.
// ---------------------------------------------------------------------------

type Tier = 1 | 2;
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, {
  wrapper: string;
  mark: string;
  markText: string;
  label: string;
}> = {
  sm: {
    wrapper: "gap-1.5",
    mark: "h-4 w-4 text-[0.5rem]",
    markText: "leading-none",
    label: "text-[0.625rem] tracking-[0.14em]",
  },
  md: {
    wrapper: "gap-2",
    mark: "h-5 w-5 text-[0.625rem]",
    markText: "leading-none",
    label: "text-[0.6875rem] tracking-[0.18em]",
  },
  lg: {
    wrapper: "gap-2.5",
    mark: "h-7 w-7 text-[0.8125rem]",
    markText: "leading-none",
    label: "text-xs tracking-[0.2em]",
  },
};

export default function TierBadge({
  tier,
  size = "md",
  withLabel = true,
}: {
  tier: Tier;
  size?: Size;
  withLabel?: boolean;
}) {
  const meta = TIER_META[tier];
  const s = SIZES[size];
  return (
    <span
      className={`inline-flex items-center align-baseline ${s.wrapper}`}
      title={`${meta.label} — ${meta.short}`}
      aria-label={`Evidence ${meta.label}: ${meta.short}`}
    >
      <span
        className={`inline-flex shrink-0 items-center justify-center border border-accent font-sans font-medium text-accent ${s.mark}`}
        aria-hidden
      >
        <span className={s.markText}>T{tier}</span>
      </span>
      {withLabel && (
        <span
          className={`font-sans uppercase text-ink-muted ${s.label}`}
        >
          {meta.short}
        </span>
      )}
    </span>
  );
}
