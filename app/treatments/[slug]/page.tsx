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

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTreatmentBySlug(slug);
  if (!t) notFound();
  const relatedStories = await getRelatedStoriesForTreatment(t.slug);

  const sections = [
    { heading: `What is ${t.name}?`, body: t.what_it_is },
    { heading: "What should I expect?", body: t.what_to_expect },
    { heading: "What does the evidence say?", body: t.evidence_summary },
    { heading: "What are the risks?", body: t.risks },
    { heading: "What does it cost?", body: t.typical_cost_range },
  ];

  return (
    <article className="py-12">
      <JsonLd data={medicalWebPageJsonLd(t)} />
      <JsonLd data={faqPageJsonLd(t.faq)} />
      <h1 className="text-4xl leading-tight">{t.name}</h1>
      <p className="mt-4 text-lg text-ink-muted">{t.summary}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-2xl italic">{section.heading}</h2>
          <div className="mt-4">
            <Prose markdown={section.body} />
          </div>
        </section>
      ))}

      {t.faq.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
            Questions
          </h2>
          {t.faq.map((f) => (
            <div key={f.question} className="mt-6">
              <h3 className="text-lg italic">{f.question}</h3>
              <p className="mt-2 text-ink-muted">{f.answer}</p>
            </div>
          ))}
        </section>
      )}

      {relatedStories.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
            Related reading
          </h2>
          <div className="mt-4 divide-y divide-line">
            {relatedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      <MedicalDisclaimer />
    </article>
  );
}
