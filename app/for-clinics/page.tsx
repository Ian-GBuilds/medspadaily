import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For clinics",
  description:
    "How MedSpa Daily works with clinics and clinicians: submissions, expert sources, and the future clinic directory. Editorial invitation, not a media kit.",
  alternates: { canonical: "/for-clinics" },
};

// ---------------------------------------------------------------------------
// /for-clinics — the industry-facing entry point.
//
// A publication clinics want to be *in* has to have a page that tells them
// how to get in. This page is deliberately editorial in voice — no rate
// card, no "advertise with us," no engagement-bait pitch. It sets out four
// straight paths: submit a tip, be quoted as an expert source, be listed on
// the treatment guide (when the directory ships), and reach the press desk.
//
// Every path terminates in a mailto: link with a subject line, so the
// receiving inbox can be filtered from day one.
// ---------------------------------------------------------------------------

type Path = {
  kicker: string;
  heading: string;
  body: string;
  action: {
    label: string;
    email: string;
    subject: string;
  };
};

const PATHS: Path[] = [
  {
    kicker: "One",
    heading: "Send us a tip",
    body:
      "New study you think we've missed. A regulatory letter that changes what a treatment costs. A closure or opening that says something about the industry. Tips run through a human editor and are read the same day. If we use it, we credit the source unless you ask us not to.",
    action: {
      label: "Send a tip",
      email: SITE.contact.tips,
      subject: "Tip for MedSpa Daily",
    },
  },
  {
    kicker: "Two",
    heading: "Be quoted as an expert",
    body:
      "We keep a small, working roster of clinicians and researchers we trust to talk on the record about their sub-specialty. Board-certified physicians, PAs, and NPs with a clinical practice can add themselves. Being on the list means you may be contacted, on background or on the record, when a story falls in your area. It does not mean you are endorsed by the publication.",
    action: {
      label: "Add yourself to the roster",
      email: SITE.contact.clinics,
      subject: "Expert source — [your specialty]",
    },
  },
  {
    kicker: "Three",
    heading: "Be listed on the treatment guide",
    body:
      "The treatment guide is being built as the calm, evidence-first reference index for the medspa world. A curated \"Available at\" section will appear on each entry, drawn from clinics that meet the editorial standard: board-certified medical director, published prices or a first-visit quote policy, and no press-release-as-fact claims on the clinic's own site. The listing is editorial, not paid; there is no sponsored slot.",
    action: {
      label: "Ask about the directory",
      email: SITE.contact.clinics,
      subject: "Directory — [clinic name]",
    },
  },
  {
    kicker: "Four",
    heading: "Reach the press desk",
    body:
      "Product launches, device approvals, meaningful clinical results. We do not run press releases as reporting, but we do read them; if the underlying material is strong, a story may follow. Please include the paper or FDA document; a press release alone is not enough.",
    action: {
      label: "Press desk",
      email: SITE.contact.press,
      subject: "Press — [subject]",
    },
  },
];

export default function ForClinicsPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          Editorial invitation
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          For clinics
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          MedSpa Daily is written for patients, but it depends on clinicians.
          The paths below are how a clinic, a physician, or a manufacturer
          engages with the publication — without the transaction feeling like
          marketing.
        </p>
      </div>

      {/* What being in means */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What being in means
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>
            <span className="text-ink">Editorial only.</span> We do not sell
            treatments, take affiliate commissions, or run sponsored content
            styled as reporting.
          </li>
          <li>
            <span className="text-ink">Sources over speakers.</span> A quote
            supports a piece; it does not substitute for a peer-reviewed
            paper or an FDA document.
          </li>
          <li>
            <span className="text-ink">Corrections in daylight.</span> If we
            get something wrong, we say so on the story itself, dated.
          </li>
          <li>
            <span className="text-ink">One story a day.</span> The publication
            runs at a considered pace. That is the product, not a bug.
          </li>
        </ul>
      </section>

      {/* Four paths */}
      <div className="divide-y divide-line">
        {PATHS.map((p) => (
          <section key={p.heading} className="py-10">
            <div className="flex items-baseline gap-4">
              <span
                className="font-serif text-3xl leading-none text-accent"
                aria-hidden
              >
                {p.kicker}
              </span>
              <h2 className="font-serif text-2xl text-ink">{p.heading}</h2>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
              {p.body}
            </p>
            <p className="mt-4">
              <a
                href={`mailto:${p.action.email}?subject=${encodeURIComponent(
                  p.action.subject,
                )}`}
                className="small-caps font-sans text-xs text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {p.action.label} → {p.action.email}
              </a>
            </p>
          </section>
        ))}
      </div>

      {/* What we don't do */}
      <section className="border-t border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          What we don't do
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>Sponsored placements, native advertising, or paid inclusion in the treatment guide.</li>
          <li>Referral fees, affiliate links, or lead-gen for clinics.</li>
          <li>Pay-to-play expert quotes.</li>
          <li>Guaranteed positive coverage in exchange for access.</li>
        </ul>
      </section>

      {/* Return to today */}
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
