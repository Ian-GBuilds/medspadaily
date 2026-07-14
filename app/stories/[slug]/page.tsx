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
import { getStoryBySlug, getTreatmentBySlug } from "@/lib/db/queries";
import { faqPageJsonLd, newsArticleJsonLd } from "@/lib/seo/jsonld";
import { CATEGORY_LABELS, CATEGORY_ROUTES, SITE } from "@/lib/site";

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

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();
  const related = (
    await Promise.all(story.related_treatments.map((t) => getTreatmentBySlug(t)))
  ).filter((t) => t !== null);

  return (
    <article className="py-12">
      <JsonLd data={newsArticleJsonLd(story)} />
      {story.faq && story.faq.length > 0 && <JsonLd data={faqPageJsonLd(story.faq)} />}
      <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
        <Link href={`/${CATEGORY_ROUTES[story.category]}`}>{CATEGORY_LABELS[story.category]}</Link>
        {" · "}
        {story.published_at && (
          <time dateTime={story.published_at ?? undefined}>
            {new Date(story.published_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </time>
        )}
      </p>
      <h1 className="mt-4 text-4xl leading-tight">{story.title}</h1>
      <p className="mt-4 text-lg text-ink-muted">{story.dek}</p>
      <p className="mt-6 font-sans text-xs uppercase tracking-widest text-ink-muted">
        By {SITE.byline}
      </p>
      {story.hero_image_url && (
        <Image
          src={story.hero_image_url} alt={story.hero_image_alt ?? ""}
          width={1536} height={1024} priority className="my-10 w-full"
        />
      )}
      <KeyTakeaways items={story.key_takeaways} />
      <div className="mt-10"><Prose markdown={story.body} /></div>
      {story.faq && story.faq.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">Questions</h2>
          {story.faq.map((f) => (
            <div key={f.question} className="mt-6">
              <h3 className="text-lg italic">{f.question}</h3>
              <p className="mt-2 text-ink-muted">{f.answer}</p>
            </div>
          ))}
        </section>
      )}
      <SourcesBlock sources={story.sources} />
      <InlineNewsletterCTA source="article" />
      {related.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">Related treatments</h2>
          <ul className="mt-4 space-y-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link className="underline underline-offset-4" href={`/treatments/${t.slug}`}>{t.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <MedicalDisclaimer />
    </article>
  );
}
