import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { profilePageJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.author.name} — About the author`,
  description:
    "Ian Gauntt, RN, BSN writes and clinically reviews MedSpa Daily. A registered nurse with nearly a decade in ICU critical care, he reads the primary literature behind every story.",
  alternates: { canonical: SITE.author.path },
};

// ---------------------------------------------------------------------------
// /about-the-author — the byline behind every story.
//
// This page exists for readers and for YMYL trust evaluation alike: who
// writes the paper, what their clinical background is, and how to verify
// it. Structure mirrors /about: header block, prose sections, an at-a-glance
// <dl>, then the standing disclaimer.
// ---------------------------------------------------------------------------

export default function AboutTheAuthorPage() {
  return (
    <div className="py-12">
      <JsonLd data={profilePageJsonLd()} />

      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          The masthead · Author &amp; clinical reviewer
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          {SITE.author.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Every story on {SITE.name} is written and clinically reviewed by Ian
          Gauntt, a registered nurse who spent nearly a decade at the bedside
          in ICU critical care before turning to health journalism.
        </p>
      </div>

      {/* The clinical background */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          The clinical background
        </h2>
        <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
          <p>
            Ian&apos;s nursing career was spent in intensive care — close to a
            decade of critical care practice, managing patients on vasoactive
            infusions, ventilators, and complex medication regimens where the
            margin for error is measured in micrograms. ICU nursing is a
            discipline of verification: checking the order against the
            evidence, the dose against the weight, the claim against the
            monitor. That habit is the founding editorial instinct of this
            publication.
          </p>
          <p>
            Critical care also teaches a working respect for what injectable
            and device-based medicine actually is. Neurotoxins, dermal
            fillers, and prescription weight-loss drugs are medical
            interventions with real pharmacology and real failure modes — not
            spa amenities. {SITE.name} covers them accordingly.
          </p>
        </div>
      </section>

      {/* The editorial role */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          The editorial role
        </h2>
        <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
          <p>
            As author and clinical reviewer, Ian reads the primary source
            behind every story — the peer-reviewed paper, the FDA document,
            the state statute — before it is filed, and holds each piece to
            the publication&apos;s{" "}
            <Link
              href="/how-we-source"
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              evidence-tier rules
            </Link>
            . No story is published without that review.
          </p>
        </div>
      </section>

      {/* At-a-glance */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          At a glance
        </h2>
        <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-muted">
          <dt>Credentials</dt>
          <dd className="text-ink">Registered Nurse (RN), BSN</dd>

          <dt>Clinical practice</dt>
          <dd className="text-ink">Nearly a decade in ICU critical care</dd>

          <dt>Role</dt>
          <dd className="text-ink">{SITE.author.jobTitle}</dd>

          <dt>Profile</dt>
          <dd className="text-ink">
            <a
              href={SITE.author.sameAs[0]}
              rel="me noopener"
              target="_blank"
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              LinkedIn
            </a>
          </dd>

          <dt>Contact</dt>
          <dd className="text-ink">
            <a
              href={`mailto:${SITE.contact.editorial}`}
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {SITE.contact.editorial}
            </a>
          </dd>
        </dl>
      </section>

      <MedicalDisclaimer />

      <p className="mt-16 border-t border-line pt-6 text-center">
        <Link
          href="/about"
          className="small-caps font-sans text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← About the publication
        </Link>
      </p>
    </div>
  );
}
