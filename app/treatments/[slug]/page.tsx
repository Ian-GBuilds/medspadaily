import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Prose from "@/components/Prose";
import StoryCard from "@/components/StoryCard";
import {
  getRelatedStoriesForTreatment,
  getTreatmentBySlug,
} from "@/lib/db/queries";
import { faqPageJsonLd, medicalWebPageJsonLd } from "@/lib/seo/jsonld";
import { classifyTreatment, FAMILY_LABELS } from "@/lib/treatments";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description: treatment.summary,
    alternates: { canonical: `/treatments/${treatment.slug}` },
    openGraph: {
      title: treatment.name,
      description: treatment.summary,
      type: "article",
      url: `/treatments/${treatment.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// /treatments/[slug] — a reference-index entry.
//
// Presented as a printed reference page rather than a blog post: the family
// label sits in the eyebrow, the treatment name is the display headline,
// and the five body sections are numbered like sections in a printed
// monograph. Sections are the same five slots the pipeline generates for
// every treatment (what_it_is / what_to_expect / evidence_summary / risks /
// typical_cost_range) so the layout is uniform across the catalogue.
// ---------------------------------------------------------------------------

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTreatmentBySlug(slug);
  if (!t) notFound();
  const relatedStories = await getRelatedStoriesForTreatment(t.slug);
  const family = classifyTreatment(t);

  const sections: { heading: string; body: string }[] = [
    { heading: `What is ${t.name}?`, body: t.what_it_is },
    { heading: "What to expect", body: t.what_to_expect },
    { heading: "What the evidence says", body: t.evidence_summary },
    { heading: "Risks & who should avoid it", body: t.risks },
  ];

  return (
    <article className="py-12">
      <JsonLd data={medicalWebPageJsonLd(t)} />
      <JsonLd data={faqPageJsonLd(t.faq)} />

      {/* Eyebrow — family + reference-entry marker */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link
          href="/treatments"
          className="small-caps font-sans text-xs text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {FAMILY_LABELS[family]}
        </Link>
        <span className="font-sans text-xs uppercase tracking-[0.16em] text-ink-muted">
          Reference entry
        </span>
      </div>

      <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
        {t.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
        {t.summary}
      </p>

      {/* At-a-glance dl — printed reference feel */}
      <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 border-y border-line py-5 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-muted">
        <dt>Family</dt>
        <dd className="text-ink">{FAMILY_LABELS[family]}</dd>

        <dt>Typical cost</dt>
        <dd className="text-ink">{t.typical_cost_range}</dd>

        <dt>Updated</dt>
        <dd className="text-ink">
          {new Date(t.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </dd>
      </dl>

      {/* Numbered sections */}
      {sections.map((section, i) => (
        <section key={section.heading} className="mt-12">
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif text-3xl leading-none text-accent"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="small-caps font-sans text-lg text-ink">
              {section.heading}
            </h2>
          </div>
          <div className="mt-4">
            <Prose markdown={section.body} />
          </div>
        </section>
      ))}

      {/* FAQ */}
      {t.faq.length > 0 && (
        <section className="mt-16 border-t border-line pt-8">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            Questions
          </h2>
          <dl className="mt-6 space-y-6">
            {t.faq.map((f) => (
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

      {/* Available at — placeholder for the future clinic directory. Present
          as a signal (both to readers and to clinics) that this is where
          location listings will appear when the directory ships. */}
      <section className="mt-16 border-t border-line pt-8">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          Available at
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          A curated list of clinics offering {t.name} is in the works.
          Clinicians —{" "}
          <Link
            href="/for-clinics"
            className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            here's how to be included
          </Link>
          .
        </p>
      </section>

      {/* Related reading */}
      {relatedStories.length > 0 && (
        <section className="mt-16 border-t border-line pt-8">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            Related reading
          </h2>
          <div className="mt-4 divide-y divide-line">
            {relatedStories.map((story) => (
              <StoryCard key={story.id} story={story} variant="digest" />
            ))}
          </div>
        </section>
      )}

      <MedicalDisclaimer />

      <p className="mt-16 border-t border-line pt-6 text-center">
        <Link
          href="/treatments"
          className="small-caps font-sans text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Back to the treatment guide
        </Link>
      </p>

      <p className="mt-4 text-center font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
        Editorial only · {SITE.name} does not sell or refer for treatments.
      </p>
    </article>
  );
}
