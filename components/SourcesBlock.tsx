import Link from "next/link";
import type { Source } from "@/lib/db/types";

export default function SourcesBlock({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
        Sources
      </h2>
      <ul className="mt-5 space-y-4">
        {sources.map((source) => (
          <li key={source.url} className="leading-relaxed">
            <span className="text-ink-muted">{source.publication}</span>
            {" — "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {source.title}
            </a>{" "}
            <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
              Tier {source.tier}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Link
          href="/how-we-source"
          className="font-sans text-xs uppercase tracking-widest text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          How we tier evidence →
        </Link>
      </p>
    </section>
  );
}
