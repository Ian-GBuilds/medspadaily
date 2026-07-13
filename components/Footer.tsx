import Link from "next/link";
import { SITE } from "@/lib/site";
import NewsletterForm from "@/components/NewsletterForm";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/how-we-source", label: "How we source" },
];

const utilityLinkClass =
  "font-sans text-xs uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h2 className="font-sans text-xs uppercase tracking-[0.12em] text-ink-muted">
              MedSpa Daily
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {SITE.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              MedSpa Daily is an editorial publication. Its reporting is for general
              information and is not medical advice.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-xs uppercase tracking-[0.12em] text-ink-muted">
              Read
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.map((link) => (
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

          <div>
            <h2 className="font-sans text-xs uppercase tracking-[0.12em] text-ink-muted">
              The Daily
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              One considered, sourced story each morning.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} {SITE.name}. {SITE.byline}.
          </p>
          <nav aria-label="Legal and feeds" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/feed.xml" className={utilityLinkClass}>
              RSS
            </a>
            <Link href="/privacy" className={utilityLinkClass}>
              Privacy
            </Link>
            <Link href="/terms" className={utilityLinkClass}>
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
