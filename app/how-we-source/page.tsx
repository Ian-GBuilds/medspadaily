import Link from "next/link";
import type { Metadata } from "next";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_TIER_RULE, TIER_META } from "@/lib/site";

export const metadata: Metadata = {
  title: "How we source",
  description:
    "How MedSpa Daily tiers evidence, what each story category requires, and what corrections look like.",
  alternates: { canonical: "/how-we-source" },
};

// ---------------------------------------------------------------------------
// /how-we-source — the load-bearing trust page.
//
// The publication's promise ("we show our sources and rate them") depends
// on this page existing, being findable from every story, and reading as an
// explicit standards document rather than a marketing FAQ. The tier table
// is generated from TIER_META in lib/site.ts, so the visible rules and the
// enforced rules stay in sync automatically.
// ---------------------------------------------------------------------------

export default function HowWeSourcePage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          Editorial standards
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          How we source
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Every claim in a MedSpa Daily story is tied to a source, and every
          source is tiered so you can see how strong the evidence is at a
          glance.
        </p>
      </div>

      {/* Tier table — hairline-only, no card borders */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          The tier system
        </h2>
        <dl className="mt-6 divide-y divide-line">
          {([1, 2] as const).map((k) => {
            const tier = TIER_META[k];
            return (
              <div key={k} className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 py-5">
                <dt className="font-serif text-lg text-ink">
                  {tier.label}
                  <span className="ml-3 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-accent">
                    T{k}
                  </span>
                </dt>
                <dd className="leading-relaxed text-ink-muted">
                  <p className="text-ink italic">{tier.short}</p>
                  <p className="mt-1">{tier.long}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* Per-category rule */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What each section requires
        </h2>
        <dl className="mt-6 divide-y divide-line">
          {CATEGORIES.map((c) => {
            const rule = CATEGORY_TIER_RULE[c];
            const meta = TIER_META[rule];
            return (
              <div key={c} className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 py-4">
                <dt className="font-serif text-lg text-ink">
                  {CATEGORY_LABELS[c]}
                </dt>
                <dd className="leading-relaxed text-ink-muted">
                  {rule === 1 ? "Requires " : "Accepts "} {meta.label} · {meta.short}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* Corrections */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          Corrections
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          If we got something wrong, tell us:{" "}
          <a
            href="mailto:corrections@medspadaily.com"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            corrections@medspadaily.com
          </a>
          . Corrections are noted on the story itself and in the{" "}
          <Link
            href="/corrections"
            className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            standing log
          </Link>
          .
        </p>
      </section>

      {/* What we never do */}
      <section className="py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What we never do
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>No story is auto-published — a human editor approves every piece.</li>
          <li>No sponsored content is presented as reporting.</li>
          <li>No affiliate links, referral fees, or paid inclusion in the treatment guide.</li>
        </ul>
      </section>

      <MedicalDisclaimer />

      <p className="mt-16 border-t border-line pt-6 text-center">
        <Link
          href="/"
          className="small-caps font-sans text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Return to today's edition
        </Link>
      </p>
    </div>
  );
}
