import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import StoryCard from "@/components/StoryCard";
import TierBadge from "@/components/TierBadge";
import { getPublishedStories } from "@/lib/db/queries";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
} from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = { alternates: { canonical: "/" } };

// ---------------------------------------------------------------------------
// Front page — a considered broadsheet, not a feed.
//
// Hierarchy:
//
//   Lead (1 story):     full-bleed image, kicker + tier badge + dateline,
//                       display headline, dek.
//   Second tier (2):    two-column band at sm+, each with image + tier +
//                       normal headline + dek.
//   Digest (up to 5):   "Also today" — hairline-divided list, no images,
//                       eyebrow + tier + headline + one-line dek.
//   Archive (up to 4):  "From the archive" — one-liners at meta size.
//
// The page fetches up to 13 stories; anything past that would fall off the
// front page anyway. The counts (1 / 2 / 5 / 4 = 12) leave one slot of
// slack for a future editor's-note module.
// ---------------------------------------------------------------------------

const LEAD_COUNT = 1;
const MEDIUM_COUNT = 2;
const DIGEST_COUNT = 5;
const ARCHIVE_COUNT = 4;
const TOTAL = LEAD_COUNT + MEDIUM_COUNT + DIGEST_COUNT + ARCHIVE_COUNT;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function HomePage() {
  const stories = await getPublishedStories({ limit: TOTAL });

  const lead = stories[0];
  const medium = stories.slice(LEAD_COUNT, LEAD_COUNT + MEDIUM_COUNT);
  const digest = stories.slice(
    LEAD_COUNT + MEDIUM_COUNT,
    LEAD_COUNT + MEDIUM_COUNT + DIGEST_COUNT,
  );
  const archive = stories.slice(LEAD_COUNT + MEDIUM_COUNT + DIGEST_COUNT);

  return (
    <div className="py-12">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      {/* Lead */}
      {lead ? (
        <article className="border-b border-line pb-12">
          {lead.hero_image_url && (
            <Link
              href={`/stories/${lead.slug}`}
              aria-hidden
              tabIndex={-1}
              className="mb-8 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Image
                src={lead.hero_image_url}
                alt={lead.hero_image_alt ?? ""}
                width={1536}
                height={1024}
                priority
                sizes="(min-width: 768px) 42rem, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
            </Link>
          )}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link
              href={`/${CATEGORY_ROUTES[lead.category]}`}
              className="small-caps font-sans text-xs text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {CATEGORY_LABELS[lead.category]}
            </Link>
            <TierBadge tier={lead.evidence_tier} size="md" />
            {lead.published_at && (
              <time
                dateTime={lead.published_at}
                className="font-sans text-xs uppercase tracking-[0.16em] text-ink-muted"
              >
                {formatDate(lead.published_at)}
              </time>
            )}
          </div>
          <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
            <Link
              href={`/stories/${lead.slug}`}
              className="text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {lead.title}
            </Link>
          </h1>
          {lead.dek && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {lead.dek}
            </p>
          )}
        </article>
      ) : (
        <p className="py-24 text-center text-ink-muted">
          First edition arriving shortly.
        </p>
      )}

      {/* Second tier — two-column medium */}
      {medium.length > 0 && (
        <section
          aria-label="Also in this edition"
          className="grid gap-10 border-b border-line py-12 sm:grid-cols-2 sm:gap-8"
        >
          {medium.map((s) => (
            <StoryCard key={s.id} story={s} variant="medium" />
          ))}
        </section>
      )}

      {/* Digest strip */}
      {digest.length > 0 && (
        <section aria-label="Also today" className="border-b border-line py-12">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="small-caps font-sans text-xs text-ink-muted">
              Also today
            </h2>
            <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
              {digest.length} {digest.length === 1 ? "brief" : "briefs"}
            </span>
          </div>
          <div className="divide-y divide-line">
            {digest.map((s) => (
              <StoryCard key={s.id} story={s} variant="digest" />
            ))}
          </div>
        </section>
      )}

      {/* Archive strip */}
      {archive.length > 0 && (
        <section aria-label="From the archive" className="py-12">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="small-caps font-sans text-xs text-ink-muted">
              From the archive
            </h2>
            <Link
              href="/research"
              className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Browse all →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {archive.map((s) => (
              <StoryCard key={s.id} story={s} variant="archive" />
            ))}
          </div>
        </section>
      )}

      {/* Sections index — a standing table of contents. Gives the front page a
       * substantial, citable text body even on a light news day (it no longer
       * bottoms out at a few hundred characters), and hands crawlers a clean
       * set of internal links into every desk plus the treatment guide. */}
      <section aria-label="Browse the paper" className="border-t border-line py-12">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            The sections
          </h2>
        </div>
        <ul className="divide-y divide-line">
          {CATEGORIES.map((c) => (
            <li key={c} className="py-5">
              <Link
                href={`/${CATEGORY_ROUTES[c]}`}
                className="font-serif text-xl text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {c === "treatments" ? "Treatment News" : CATEGORY_LABELS[c]}
              </Link>
              <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-muted">
                {CATEGORY_DESCRIPTIONS[c]}
              </p>
            </li>
          ))}
          <li className="py-5">
            <Link
              href="/treatments"
              className="font-serif text-xl text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Treatment guide
            </Link>
            <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-muted">
              A plain-language reference to what each treatment is, what to
              expect, and what the evidence supports.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
