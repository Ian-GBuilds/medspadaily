import Link from "next/link";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
  SITE,
} from "@/lib/site";
import { getPublishedStoryCount } from "@/lib/db/queries";

// ---------------------------------------------------------------------------
// Masthead — the top of the paper.
//
// Explicit publication chrome, not a blog header:
//   - Line 1 (small): today's date, left; edition number, right.
//   - Line 2 (huge): the nameplate, centered, at real display scale.
//   - Line 3 (small italic): the motto, centered under the nameplate.
//   - Hairline rule.
//   - Line 4: the section nav, small caps, wrapped inline, centered.
//
// The whole block is a server component: it fetches the edition count from
// the database once per page render (which is cached at the story page's
// `revalidate` interval, so this is effectively free on the hot path). If
// the count query returns 0 (e.g. Supabase unreachable during build), the
// edition line degrades to just the date.
// ---------------------------------------------------------------------------

// Nav labels intentionally diverge from CATEGORY_LABELS in one place:
// the `treatments` news desk shows as "Treatment News" in the nav, so the
// reference index at /treatments can keep the plain "Treatments" label.
// Elsewhere (story eyebrows, section H1s, footer sections) CATEGORY_LABELS
// stays canonical — the news desk is still "The Treatments desk" there.
const NAV_LABEL_OVERRIDES: Partial<Record<string, string>> = {
  treatments: "Treatment News",
};

const navLinks: { href: string; label: string }[] = [
  ...CATEGORIES.map((category) => ({
    href: `/${CATEGORY_ROUTES[category]}`,
    label: NAV_LABEL_OVERRIDES[category] ?? CATEGORY_LABELS[category],
  })),
  { href: "/treatments", label: "Treatments" },
  { href: "/about", label: "About" },
];

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Simple roman-numeral formatter — publications count volumes in roman, and
// this is small enough that pulling a library isn't worth it. We only need
// numbers up to ~1–100 for the volume; edition numbers stay in arabic.
function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out || "I";
}

export default async function Header() {
  const editionCount = await getPublishedStoryCount();
  // The first published story is Vol. I, No. 1. We roll to a new volume
  // every 100 editions — arbitrary but a recognizable broadsheet convention.
  const volume = toRoman(Math.floor(editionCount / 100) + 1);
  const editionNo = editionCount > 0 ? editionCount : 1;

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-3xl px-6 pb-6 pt-8">
        {/* Row 1: dateline + edition number */}
        <div className="flex items-baseline justify-between font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
          <time dateTime={new Date().toISOString().slice(0, 10)}>
            {formatToday()}
          </time>
          <span>
            Vol. {volume} · No. {editionNo}
          </span>
        </div>

        {/* Row 2: nameplate at scale */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-block font-serif text-4xl tracking-[0.06em] text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-5xl"
          >
            {SITE.name}
          </Link>
        </div>

        {/* Row 3: motto */}
        <p className="mt-2 text-center font-serif text-sm italic text-ink-muted">
          {SITE.motto}
        </p>
      </div>

      {/* Row 4: section nav, sits below its own hairline for print feel */}
      <nav
        aria-label="Sections"
        className="border-t border-line"
      >
        <ul className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
