import Link from "next/link";
import type { Source } from "@/lib/db/types";

// ---------------------------------------------------------------------------
// SourcesBlock — the numbered bibliography at the foot of a story.
//
// Rendered as a two-column grid (`.bibliography` in globals.css): the number
// column carries the citation index AND the tier mark inline, so the tier
// system is visible at every citation rather than hidden inside a badge on
// the source line. Publication + link + tier read as one line of ledger,
// same rhythm as a printed reference list.
//
// The section closes with a link to /how-we-source so a reader who wants to
// understand the rating system has one click to the definition.
// ---------------------------------------------------------------------------

export default function SourcesBlock({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <section className="mt-16 border-t border-line pt-8">
      <h2 className="small-caps font-sans text-xs text-ink-muted">
        Sources
      </h2>

      <ol className="bibliography mt-6" role="list">
        {sources.map((source, index) => (
          <li
            key={source.url}
            className="contents"
            aria-label={`Source ${index + 1}, Tier ${source.tier}`}
          >
            <span className="bibliography-num text-sm">
              <span aria-hidden>{index + 1}.</span>
              <span
                className="ml-1 font-sans text-[0.625rem] uppercase tracking-[0.14em] text-accent"
                title={`Tier ${source.tier}`}
                aria-label={`Tier ${source.tier}`}
              >
                T{source.tier}
              </span>
            </span>
            <div className="text-[0.9375rem] leading-relaxed">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {source.title}
              </a>
              <span className="text-ink-muted"> — {source.publication}</span>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6">
        <Link
          href="/how-we-source"
          className="small-caps font-sans text-xs text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          How we tier evidence →
        </Link>
      </p>
    </section>
  );
}
