import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ROUTES } from "@/lib/site";

const navLinks = [
  ...CATEGORIES.map((category) => ({
    href: `/${CATEGORY_ROUTES[category]}`,
    label: CATEGORY_LABELS[category],
  })),
  { href: "/treatments", label: "Treatment Guide" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-3xl px-6 pb-5 pt-8">
        <Link
          href="/"
          className="inline-block font-serif text-2xl tracking-[0.12em] text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          MedSpa Daily
        </Link>
        <nav aria-label="Sections" className="mt-5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-xs uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
