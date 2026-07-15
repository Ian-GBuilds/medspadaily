import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InlineNewsletterCTA from "@/components/InlineNewsletterCTA";
import JsonLd from "@/components/JsonLd";
import KeyTakeaways from "@/components/KeyTakeaways";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Prose from "@/components/Prose";
import SourcesBlock from "@/components/SourcesBlock";
import TierBadge from "@/components/TierBadge";
import { getStoryBySlug, getTreatmentBySlug } from "@/lib/db/queries";
import { faqPageJsonLd, newsArticleJsonLd } from "@/lib/seo/jsonld";
import {
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
  SITE,
  TIER_META,
} from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.meta_description,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      title: story.title,
      description: story.meta_description,
      type: "article",
      publishedTime: story.published_at ?? undefined,
      images: story.hero_image_url ? [story.hero_image_url] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

// ---------------------------------------------------------------------------
// Story page — a considered article page.
//
// Structure (top to bottom):
//
//   1. Eyebrow row — category + tier badge + dateline. First glimpse of the
//      evidence-tier promise.
//   2. Headline (roman serif, display size, text-wrap: balance).
//   3. Dek (larger ink-muted).
//   4. Byline block <dl> — By / Filed under / Published / Sources cited /
//      Evidence tier. This is the biohacking-authority signal: metadata is
//      surfaced as first-class data, not hidden in metadata tags.
//   5. Hero image.
//   6. Standfirst band (KeyTakeaways) — carries the tier badge again in
//      case the reader landed mid-scroll.
//   7. Prose (with drop cap on first paragraph via .prose-msd).
//   8. FAQ, if any.
//   9. Numbered bibliography (SourcesBlock).
//  10. Related treatments.
//  11. Newsletter CTA + Medical disclaimer + return-to-today.
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();
  const related = (
    await Promise.all(story.related_treatments.map((t) => getTreatmentBySlug(t)))
  ).filter((t) => t !== null);

  const tierMeta = TIER_META[story.evidence_tier];

  return (
    <article className="py-12">
      <JsonLd data={newsArticleJsonLd(story)} />
      {story.faq && story.faq.length > 0 && (
        <JsonLd data={faqPageJsonLd(story.faq)} />
      )}

      {/* 1. Eyebrow — category, tier, date */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link
          href={`/${CATEGORY_ROUTES[story.category]}`}
          className="small-caps font-sans text-xs text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {CATEGORY_LABELS[story.category]}
        </Link>
        <TierBadge tier={story.evidence_tier} size="md" />
        {story.published_at && (
          <time
            dateTime={story.published_at}
            className="font-sans text-xs uppercase tracking-[0.16em] text-ink-muted"
          >
            {formatDate(story.published_at)}
          </time>
        )}
      </div>

      {/* 2. Headline */}
      <h1 className="mt-4 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
        {story.title}
      </h1>

      {/* 3. Dek */}
      {story.dek && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {story.dek}
        </p>
      )}

      {/* 4. Byline block — a printed masthead credit line */}
      <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 border-y border-line py-5 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-muted">
        <dt>By</dt>
        <dd className="text-ink">{SITE.byline}</dd>

        <dt>Filed under</dt>
        <dd className="text-ink">
          <Link
            href={`/${CATEGORY_ROUTES[story.category]}`}
            className="underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {CATEGORY_LABELS[story.category]}
          </Link>
        </dd>

        {story.published_at && (
          <>
            <dt>Published</dt>
            <dd className="text-ink">{formatDate(story.published_at)}</dd>
          </>
        )}

        <dt>Sources cited</dt>
        <dd className="text-ink">{story.sources.length}</dd>

        <dt>Evidence</dt>
        <dd className="text-ink">
          <Link
            href="/how-we-source"
            className="underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {tierMeta.label} · {tierMeta.short}
          </Link>
        </dd>
      </dl>

      {/* 5. Hero image */}
      {story.hero_image_url && (
        <Image
          src={story.hero_image_url}
          alt={story.hero_image_alt ?? ""}
          width={1536}
          height={1024}
          priority
          sizes="(min-width: 768px) 42rem, 100vw"
          className="my-10 aspect-[3/2] w-full object-cover"
        />
      )}

      {/* 6. Standfirst */}
      <KeyTakeaways items={story.key_takeaways} tier={story.evidence_tier} />

      {/* 7. Prose */}
      <Prose markdown={story.body} />

      {/* 8. FAQ */}
      {story.faq && story.faq.length > 0 && (
        <section className="mt-16 border-t border-line pt-8">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            Questions
          </h2>
          <dl className="mt-6 space-y-6">
            {story.faq.map((f) => (
              <div key={f.question}>
                <dt className="font-serif text-lg text-ink">{f.question}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink-muted">
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 9. Bibliography */}
      <SourcesBlock sources={story.sources} />

      {/* 10. Related treatments */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-8">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            Related treatments
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {related.map((t) => (
              <li key={t.slug} className="py-3">
                <Link
                  href={`/treatments/${t.slug}`}
                  className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 11. Corrections + newsletter + disclaimer + return-to-today */}
      <p className="mt-12 border-t border-line pt-4 font-sans text-xs uppercase tracking-[0.14em] text-ink-muted">
        No corrections to date ·{" "}
        <Link
          href="/corrections"
          className="underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent"
        >
          Report an error
        </Link>
      </p>

      <InlineNewsletterCTA source="article" />

      <MedicalDisclaimer />

      <p className="mt-16 border-t border-line pt-6 text-center">
        <Link
          href="/"
          className="small-caps font-sans text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Return to today's edition
        </Link>
      </p>
    </article>
  );
}
