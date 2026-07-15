import Link from "next/link";
import type { Metadata } from "next";
import { getTreatments } from "@/lib/db/queries";
import {
  FAMILY_LABELS,
  groupTreatments,
  pickStartWith,
} from "@/lib/treatments";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "The reference index. Calm, evidence-first guides to the treatments medspas offer — grouped by family, so a first-time visitor can find their way in.",
  alternates: { canonical: "/treatments" },
};

// ---------------------------------------------------------------------------
// /treatments — the reference index (as opposed to /treatments-news, which
// is the story archive for the treatments category).
//
// Structure:
//
//   Header:        the section title + a standing description and a
//                  reference-not-editorial note.
//   Start with these: a small horizontal list of the canonical patient-first
//                  entries, so a visitor who doesn't know what they're
//                  looking for has a clear path in.
//   Grouped index: for each family (Injectables, Resurfacing, Body, Hair,
//                  Longevity, Wellness, Other), a hairline-topped block
//                  with the family label as a small-caps kicker and the
//                  treatments below.
// ---------------------------------------------------------------------------

export default async function TreatmentsPage() {
  const treatments = await getTreatments();
  const start = pickStartWith(treatments);
  const groups = groupTreatments(treatments);

  return (
    <div className="py-12">
      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          Reference · The treatment guide
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          Treatments
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          A calm, evidence-first index of what medspas offer. Each entry
          explains what the treatment is, what to expect in the chair, and
          what the research actually supports — no promotional language, no
          promises.
        </p>
      </div>

      {/* Start with these */}
      {start.length > 0 && (
        <section aria-label="Start with these" className="border-b border-line py-10">
          <h2 className="small-caps font-sans text-xs text-ink-muted">
            Start with these
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {start.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/treatments/${t.slug}`}
                  className="font-serif text-lg text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Grouped index */}
      {groups.length > 0 ? (
        <div className="divide-y divide-line">
          {groups.map(({ family, items }) => (
            <section key={family} className="py-10" aria-label={FAMILY_LABELS[family]}>
              <div className="flex items-baseline justify-between">
                <h2 className="small-caps font-sans text-xs text-ink-muted">
                  {FAMILY_LABELS[family]}
                </h2>
                <span className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
                  {items.length}
                </span>
              </div>
              <dl className="mt-5 divide-y divide-line">
                {items.map((t) => (
                  <div key={t.slug} className="py-4">
                    <dt className="text-xl leading-snug">
                      <Link
                        href={`/treatments/${t.slug}`}
                        className="text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {t.name}
                      </Link>
                    </dt>
                    <dd className="mt-1 leading-relaxed text-ink-muted">
                      {t.summary}
                    </dd>
                    {t.typical_cost_range && (
                      <dd className="mt-2 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
                        Typical cost · {t.typical_cost_range}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <p className="py-24 text-center text-ink-muted">
          Treatment guides arriving shortly.
        </p>
      )}
    </div>
  );
}
