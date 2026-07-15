import Link from "next/link";
import type { Metadata } from "next";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  SITE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedSpa Daily is an independent editorial publication covering the medical-spa world for patients — calm, sourced reporting, reviewed by a human editor.",
  alternates: { canonical: "/about" },
};

// ---------------------------------------------------------------------------
// /about — the publication's masthead-in-prose.
//
// Kept short. Three blocks: what the paper is, what we cover (pulled from
// the same CATEGORY_DESCRIPTIONS the section pages use), and how to reach
// us. The "How to reach us" block is where the tip and correction lines get
// surfaced — same addresses as the footer, but as explicit paths rather
// than a link soup.
// ---------------------------------------------------------------------------

const CONTACT_PATHS: { label: string; email: string; note: string }[] = [
  {
    label: "Editorial",
    email: SITE.contact.editorial,
    note: "General questions and feedback.",
  },
  {
    label: "Tips",
    email: SITE.contact.tips,
    note: "A study, a policy change, an opening or closing worth writing about.",
  },
  {
    label: "Corrections",
    email: SITE.contact.corrections,
    note: "If we got something wrong. Corrections are noted on the story, dated.",
  },
  {
    label: "Press",
    email: SITE.contact.press,
    note: "Launches, approvals, and clinical results — include the paper.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          About the publication
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          About
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          MedSpa Daily is an independent editorial publication covering the
          medical-spa world for patients. One considered, sourced story each
          morning, reviewed by a human editor, filed under a category with a
          published evidence rule.
        </p>
      </div>

      {/* What we cover */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What we cover
        </h2>
        <dl className="mt-6 divide-y divide-line">
          {CATEGORIES.map((c) => (
            <div key={c} className="py-4">
              <dt className="font-serif text-lg text-ink">
                {CATEGORY_LABELS[c]}
              </dt>
              <dd className="mt-1.5 leading-relaxed text-ink-muted">
                {CATEGORY_DESCRIPTIONS[c]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What being independent means */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What independent means
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>
            No story is auto-published — a human editor approves every piece.
          </li>
          <li>No sponsored content is presented as reporting.</li>
          <li>
            We do not sell, refer for, or take commissions on the treatments
            we cover.
          </li>
          <li>
            Every claim is tied to a source, and every source is tiered.{" "}
            <Link
              href="/how-we-source"
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              How we tier evidence →
            </Link>
          </li>
        </ul>
      </section>

      {/* How to reach us */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          How to reach us
        </h2>
        <dl className="mt-6 divide-y divide-line">
          {CONTACT_PATHS.map((p) => (
            <div key={p.email} className="py-4">
              <dt className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-serif text-lg text-ink">{p.label}</span>
                <a
                  href={`mailto:${p.email}`}
                  className="font-sans text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {p.email}
                </a>
              </dt>
              <dd className="mt-1.5 leading-relaxed text-ink-muted">
                {p.note}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 leading-relaxed text-ink-muted">
          Clinicians and clinics — see{" "}
          <Link
            href="/for-clinics"
            className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            For clinics
          </Link>{" "}
          for the four paths into the publication.
        </p>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}
