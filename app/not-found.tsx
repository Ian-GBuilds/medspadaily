import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// An explicit not-found route. Without it, the App Router's default 404 shares
// the root layout's title metadata and emits a duplicate <title> (invalid
// HTML5 — and a risk of the wrong social-share title). `title.absolute` opts
// out of the layout's `%s — MedSpa Daily` template so exactly one title ships.
export const metadata: Metadata = {
  title: { absolute: `Page not found — ${SITE.name}` },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl leading-[1.1] text-wrap-balance sm:text-5xl">
        This page has gone to press elsewhere.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
        The page you are after has moved or never existed. The latest edition is
        a good place to start.
      </p>
      <p className="mt-10">
        <Link
          href="/"
          className="small-caps font-sans text-xs text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← Return to the latest edition
        </Link>
      </p>
    </div>
  );
}
