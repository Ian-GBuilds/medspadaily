import type { Metadata } from "next";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

export const metadata: Metadata = {
  title: "How We Source",
  description:
    "How MedSpa Daily tiers evidence, what each story category requires, and what corrections look like.",
  alternates: { canonical: "/how-we-source" },
};

export default function HowWeSourcePage() {
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">How We Source</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Every claim in a MedSpa Daily story is tied to a source, and every source is tiered
        so you can see how strong the evidence is.
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          The tier system
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border border-line text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="border-r border-line p-4 align-top font-sans text-xs uppercase tracking-widest text-ink-muted"
                >
                  Tier
                </th>
                <th
                  scope="col"
                  className="border-r border-line p-4 align-top font-sans text-xs uppercase tracking-widest text-ink-muted"
                >
                  Sources
                </th>
                <th
                  scope="col"
                  className="p-4 align-top font-sans text-xs uppercase tracking-widest text-ink-muted"
                >
                  Required or acceptable for
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <th
                  scope="row"
                  className="border-r border-line p-4 align-top text-left font-normal italic"
                >
                  Tier 1
                </th>
                <td className="border-r border-line p-4 align-top leading-relaxed text-ink-muted">
                  Peer-reviewed journals, randomized controlled trials, meta-analyses, FDA
                  documents, clinicaltrials.gov.
                </td>
                <td className="p-4 align-top leading-relaxed text-ink-muted">
                  Required for: Research, Longevity (no Tier 1 source, no story).
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="border-r border-line p-4 align-top text-left font-normal italic"
                >
                  Tier 2
                </th>
                <td className="border-r border-line p-4 align-top leading-relaxed text-ink-muted">
                  Professional societies (e.g. ASPS, AmSpa), reputable trade press, official
                  state legislature pages, manufacturer announcements.
                </td>
                <td className="p-4 align-top leading-relaxed text-ink-muted">
                  Acceptable for: Treatments, Legislation, Industry.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          What each category requires
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>Research and Longevity stories require at least one Tier 1 source.</li>
          <li>
            Treatments, Legislation, and Industry stories may rely on Tier 2 sources.
          </li>
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
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
          . Corrections are noted on the story.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          What we never do
        </h2>
        <ul className="mt-5 space-y-3 leading-relaxed text-ink-muted">
          <li>No story is auto-published — a human editor approves every piece.</li>
          <li>No sponsored content is presented as reporting.</li>
        </ul>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}
