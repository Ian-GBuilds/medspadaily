import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corrections",
  description:
    "Every correction MedSpa Daily has made, dated, with a link to the story it changed. Silent edits are not corrections; if it materially changes what a story says, it appears here.",
  alternates: { canonical: "/corrections" },
};

// ---------------------------------------------------------------------------
// /corrections — the standing corrections desk.
//
// Content is empty for now (no corrections table in the database). The page
// exists as a URL a story can link to, and as a statement about how the
// publication handles being wrong. When corrections start being written,
// they should be normalized into a small `corrections` table with columns
// { story_id, corrected_at, note } and rendered here as a reverse-chron
// list. The story page's "Report an error" link already points at this URL.
// ---------------------------------------------------------------------------

export default function CorrectionsPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="border-b border-line pb-10">
        <p className="small-caps font-sans text-xs text-ink-muted">
          Standing desk
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
          Corrections
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Every material change to a MedSpa Daily story is noted here, dated,
          with a link to the piece it altered. A silent edit is not a
          correction; if the substance of a story changes, it appears in this
          list.
        </p>
      </div>

      {/* How we correct */}
      <section className="border-b border-line py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          How we correct
        </h2>
        <ol className="mt-6 space-y-4">
          <li className="flex gap-4">
            <span className="font-serif text-2xl leading-none text-accent" aria-hidden>
              01
            </span>
            <p className="leading-relaxed text-ink-muted">
              <span className="text-ink">Report.</span> Send the story URL and
              what you believe is wrong to{" "}
              <a
                href={`mailto:${SITE.contact.corrections}`}
                className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
              >
                {SITE.contact.corrections}
              </a>
              .
            </p>
          </li>
          <li className="flex gap-4">
            <span className="font-serif text-2xl leading-none text-accent" aria-hidden>
              02
            </span>
            <p className="leading-relaxed text-ink-muted">
              <span className="text-ink">Verify.</span> A human editor reads
              the report against the original sources cited in the piece. If
              the sources back the report, the story is amended.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="font-serif text-2xl leading-none text-accent" aria-hidden>
              03
            </span>
            <p className="leading-relaxed text-ink-muted">
              <span className="text-ink">Note.</span> The correction appears
              on the story itself, dated, and in the reverse-chronological
              log below.
            </p>
          </li>
        </ol>
      </section>

      {/* The log */}
      <section className="py-10">
        <h2 className="small-caps font-sans text-xs text-ink-muted">
          The log
        </h2>
        <p className="mt-6 text-center text-ink-muted italic">
          No corrections to date.
        </p>
      </section>

      <p className="mt-8 border-t border-line pt-6 text-center">
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
