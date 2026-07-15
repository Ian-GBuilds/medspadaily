import Link from "next/link";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
  SITE,
} from "@/lib/site";
import { getPublishedStoryCount } from "@/lib/db/queries";
import NewsletterForm from "@/components/NewsletterForm";

// ---------------------------------------------------------------------------
// Footer — the paper's colophon.
//
// Three columns above a hairline: about + medical disclaimer, sections
// (linked), and the newsletter subscribe block. A colophon strip at the
// bottom carries the typefaces + edition number + copyright + legal /
// feed links.
//
// Async because the colophon line reports the edition count. If the count
// query fails we fall back to just the year — the footer never blocks the
// render.
// ---------------------------------------------------------------------------

const READ_LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-we-source", label: "How we source" },
  { href: "/for-clinics", label: "For clinics" },
  { href: "/corrections", label: "Corrections" },
];

const utilityLinkClass =
  "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default async function Footer() {
  const editionCount = await getPublishedStoryCount();
  const editionLine =
    editionCount > 0
      ? `Edition No. ${editionCount}`
      : "First edition arriving shortly";

  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        {/* Three columns */}
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Column 1: nameplate + mission + disclaimer */}
          <div>
            <p className="font-serif text-lg text-ink tracking-[0.04em]">
              {SITE.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {SITE.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              An editorial publication. Reporting is for general information
              and is not medical advice.
            </p>
          </div>

          {/* Column 2: sections */}
          <nav aria-label="Sections">
            <h2 className="small-caps font-sans text-xs text-ink-muted">
              Sections
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/${CATEGORY_ROUTES[c]}`}
                    className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {CATEGORY_LABELS[c]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/treatments"
                  className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Treatment guide
                </Link>
              </li>
            </ul>

            <h2 className="small-caps mt-8 font-sans text-xs text-ink-muted">
              About
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {READ_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: subscribe */}
          <div>
            <h2 className="small-caps font-sans text-xs text-ink-muted">
              The Daily
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              One considered, sourced story each morning.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Colophon strip */}
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-sans">
            © {new Date().getFullYear()} {SITE.name}
            <span className="mx-2 text-line">·</span>
            <span>{editionLine}</span>
            <span className="mx-2 text-line">·</span>
            <span className="normal-case tracking-normal text-ink-muted">
              {SITE.typefaces}
            </span>
          </p>
          <nav aria-label="Legal and feeds" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/feed.xml" className={utilityLinkClass}>RSS</a>
            <Link href="/privacy" className={utilityLinkClass}>Privacy</Link>
            <Link href="/terms" className={utilityLinkClass}>Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
