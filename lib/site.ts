import type { StoryCategory } from "./db/types";

// ---------------------------------------------------------------------------
// SITE — the single source of truth for house identity strings.
//
// These values are consumed by the masthead, footer, story page, category
// pages, JSON-LD, feeds, and metadata. If a string reads like it belongs on
// letterhead ("motto", "colophon", "byline"), it lives here.
// ---------------------------------------------------------------------------

// Last substantive edit to the static informational/legal pages (About, How
// we source, Subscribe, For clinics, Corrections, Privacy, Terms). Used as
// their sitemap lastmod so it reflects real content — bump this when that copy
// is edited, not on every deploy.
export const LEGAL_LAST_REVISED = "2026-08-01";

export const SITE = {
  name: "MedSpa Daily",
  // Short tagline used in <title> and og:description contexts. Kept flat so
  // it doesn't fight the masthead motto below.
  tagline: "The calm, evidence-first read on the medspa world.",
  // Motto is the full editorial line, printed on the masthead, right of the
  // dateline. It's slightly warmer than the tagline so the masthead has voice.
  motto: "The considered read on the medspa world",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // House byline — the publication is the author.
  byline: "MedSpa Daily Editorial",
  description:
    "Daily, source-tiered reporting on medspa studies, treatments, legislation, and longevity — written for patients.",
  // Colophon fields, printed at the foot of the page.
  typefaces: "Set in Newsreader & Work Sans.",
  // Contact addresses — surfaced in the footer and About / For clinics pages.
  contact: {
    editorial: "hello@medspadaily.com",
    tips: "tips@medspadaily.com",
    corrections: "corrections@medspadaily.com",
    press: "press@medspadaily.com",
    clinics: "clinics@medspadaily.com",
  },
  // Official social profiles — surfaced in the footer colophon and as
  // Organization sameAs in JSON-LD.
  social: {
    youtube: "https://www.youtube.com/@MedSpaDaily",
    instagram: "https://www.instagram.com/medspadaily/",
    tiktok: "https://www.tiktok.com/@medspadaily",
  },
  // Publisher logo — must stay ≥112×112 and on-domain; required for
  // NewsArticle rich-result / Top Stories eligibility.
  logo: { path: "/logo.png", width: 512, height: 512 },
  // Named author & clinical reviewer — every story carries this byline
  // (Person, not Organization) for YMYL E-E-A-T.
  author: {
    name: "Ian Gauntt, RN, BSN",
    jobTitle: "Author & Clinical Reviewer",
    path: "/about-the-author",
    // Stable, unique handle for the profile author. Emitted as Person.identifier
    // — Google's ProfilePage rich result requires a unique id for the profiled
    // person; without it the profile result won't build.
    identifier: "ian-gauntt",
    image: { path: "/ian-gauntt.jpg", width: 600, height: 600 },
    sameAs: ["https://www.linkedin.com/in/ian-gauntt-53018241a/"],
  },
} as const;

// ---------------------------------------------------------------------------
// CATEGORY_LABELS — display names.
// CATEGORY_ROUTES — URL segments (kept distinct from labels because
// "treatments" the section lives at /treatments-news to leave /treatments
// free for the reference index).
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<StoryCategory, string> = {
  research: "Research",
  treatments: "Treatments",
  legislation: "Legislation",
  longevity: "Longevity",
  industry: "Industry",
};

export const CATEGORY_ROUTES: Record<StoryCategory, string> = {
  research: "research",
  treatments: "treatments-news",
  legislation: "legislation",
  longevity: "longevity",
  industry: "industry",
};

// Category order for the section list — reflects editorial priority, not
// alphabetical. Research first because the evidence promise starts there.
export const CATEGORIES: StoryCategory[] = [
  "research",
  "treatments",
  "legislation",
  "longevity",
  "industry",
];

// ---------------------------------------------------------------------------
// CATEGORY_DESCRIPTIONS — standing description for each section, used on
// the category archive page and the About page. Written as a single-sentence
// mission line, not a summary of what's inside; it's the section's *stance*.
// ---------------------------------------------------------------------------

export const CATEGORY_DESCRIPTIONS: Record<StoryCategory, string> = {
  research:
    "New studies on injectables, devices, and skin science, read against the original paper rather than the press release.",
  treatments:
    "Plain guides to what a treatment is, what to expect, and what the evidence actually supports.",
  legislation:
    "The state and federal rules that shape who can offer a treatment, and how.",
  longevity:
    "Claims about aging and longevity, weighed against what peer-reviewed research can and can't yet say.",
  industry:
    "How the medspa business itself is changing — openings, closings, pricing, and the people behind it.",
};

// ---------------------------------------------------------------------------
// Evidence tier — the design system's load-bearing promise. Each tier gets
// a short label, a colon-punchline for inline use, and a longer rule that
// explains what qualifies. Category pages render the applicable rule; story
// pages render the tier badge next to the kicker.
// ---------------------------------------------------------------------------

export const TIER_META = {
  1: {
    label: "Tier 1",
    short: "Peer-reviewed",
    long: "Peer-reviewed journals, randomized controlled trials, meta-analyses, FDA documents, clinicaltrials.gov.",
  },
  2: {
    label: "Tier 2",
    short: "Professional & trade",
    long: "Professional societies (ASPS, AmSpa), reputable trade press, official state legislature pages, manufacturer announcements.",
  },
} as const;

// Which tier a category's stories must reach at minimum. Category pages
// render "Requires Tier 1 sources" or "Accepts Tier 2 sources" from this.
export const CATEGORY_TIER_RULE: Record<StoryCategory, 1 | 2> = {
  research: 1,
  longevity: 1,
  treatments: 2,
  legislation: 2,
  industry: 2,
};
