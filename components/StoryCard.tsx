import Image from "next/image";
import Link from "next/link";
import type { StoryRow } from "@/lib/db/types";
import { CATEGORY_LABELS, CATEGORY_ROUTES } from "@/lib/site";
import TierBadge from "./TierBadge";

// ---------------------------------------------------------------------------
// StoryCard — a story row in a list, in three editorial sizes.
//
//   variant="medium"  → mid-page tier: image up top, then eyebrow + tier
//     badge, headline (~2xl), dek. Sits in a 2-column band below the lead.
//   variant="digest"  → the "Also today" strip: no image, eyebrow + tier
//     badge, headline (~xl), one-line dek. Sits in a hairline-divided list.
//   variant="archive" → the "From the archive" strip: no image, eyebrow +
//     date, small headline, no dek. Utility-dense.
//
// The card is one link (headline), consistent with the design doc's
// "text is the interface" rule — the whole row is not a link, so keyboard
// users get exactly one landing target. The image is decoratively linked
// (`aria-hidden`, `tabIndex={-1}`) for pointer users only.
// ---------------------------------------------------------------------------

type Variant = "medium" | "digest" | "archive";

function DateLine({ iso }: { iso: string }) {
  return (
    <time
      dateTime={iso}
      className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted"
    >
      {new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </time>
  );
}

export default function StoryCard({
  story,
  variant = "medium",
}: {
  story: StoryRow;
  variant?: Variant;
}) {
  const href = `/stories/${story.slug}`;

  if (variant === "archive") {
    return (
      <article className="py-4">
        <div className="flex items-baseline justify-between gap-4">
          {story.published_at && <DateLine iso={story.published_at} />}
          <TierBadge tier={story.evidence_tier} size="sm" withLabel={false} />
        </div>
        <h3 className="mt-1.5 text-base leading-snug">
          <Link
            href={href}
            className="text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {story.title}
          </Link>
        </h3>
      </article>
    );
  }

  if (variant === "digest") {
    return (
      <article className="py-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            href={`/${CATEGORY_ROUTES[story.category]}`}
            className="small-caps font-sans text-[0.6875rem] text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {CATEGORY_LABELS[story.category]}
          </Link>
          <TierBadge tier={story.evidence_tier} size="sm" />
          {story.published_at && <DateLine iso={story.published_at} />}
        </div>
        <h3 className="mt-2 text-xl leading-snug">
          <Link
            href={href}
            className="text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {story.title}
          </Link>
        </h3>
        {story.dek && (
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
            {story.dek}
          </p>
        )}
      </article>
    );
  }

  // medium — the default, used for stories 2–3 below the lead
  return (
    <article>
      {story.hero_image_url && (
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="mb-5 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image
            src={story.hero_image_url}
            alt=""
            width={1536}
            height={1024}
            sizes="(min-width: 640px) 22rem, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        </Link>
      )}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link
          href={`/${CATEGORY_ROUTES[story.category]}`}
          className="small-caps font-sans text-[0.6875rem] text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {CATEGORY_LABELS[story.category]}
        </Link>
        <TierBadge tier={story.evidence_tier} size="sm" />
      </div>
      <h2 className="mt-2 text-2xl leading-snug">
        <Link
          href={href}
          className="text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {story.title}
        </Link>
      </h2>
      {story.dek && (
        <p className="mt-2 text-ink-muted">{story.dek}</p>
      )}
      {story.published_at && (
        <p className="mt-3">
          <DateLine iso={story.published_at} />
        </p>
      )}
    </article>
  );
}
