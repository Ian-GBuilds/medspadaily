import type { TreatmentRow } from "./db/types";

// ---------------------------------------------------------------------------
// Treatment family grouping.
//
// The `treatments` table has no family column today (schema in
// lib/content/treatment-schema.ts). Rather than run a migration for what is
// really a display concern, we classify treatments into a small taxonomy
// with a first-match rule table applied to the treatment name.
//
// The taxonomy is intentionally shallow (six families) so the reference
// index reads as a printed table of contents, not a folksonomy. When a
// treatment matches no rule, it falls into "Other treatments" — visible
// but at the bottom of the page, so a missing rule is noisy rather than
// silent.
//
// Later: if the pipeline starts writing a `family` column, delete this
// module and read the column directly. The index page consumes only the
// exported `groupTreatments` function, so the swap is one call site.
// ---------------------------------------------------------------------------

export type TreatmentFamily =
  | "injectables"
  | "resurfacing"
  | "body"
  | "hair"
  | "longevity"
  | "wellness"
  | "other";

export const FAMILY_LABELS: Record<TreatmentFamily, string> = {
  injectables: "Injectables",
  resurfacing: "Skin resurfacing & lasers",
  body: "Body & contouring",
  hair: "Hair",
  longevity: "Longevity & regenerative",
  wellness: "IV & wellness",
  other: "Other treatments",
};

// Ordered so the reference index renders in editorial priority: what most
// medspa patients arrive asking about first.
export const FAMILY_ORDER: TreatmentFamily[] = [
  "injectables",
  "resurfacing",
  "body",
  "hair",
  "longevity",
  "wellness",
  "other",
];

// First-match rules. Keywords are lowercase; matched against the treatment
// name after lowercasing. Order matters — put the more specific keywords
// first so "microneedling with prp" doesn't get caught by "prp" -> longevity.
const RULES: [RegExp, TreatmentFamily][] = [
  [/botox|dysport|xeomin|jeuveau|neurotoxin|filler|sculptra|radiesse|kybella|masseter|lip flip/i, "injectables"],
  [/laser|resurfac|peel|microneedl|halo|fraxel|ipl|bbl|clear ?\+ ?brilliant|morpheus/i, "resurfacing"],
  [/coolsculpt|emsculpt|body contour|lipo|cellulite|emtone|truSculpt|evolve|renuvion/i, "body"],
  [/hair|prp|minoxidil|finasteride|smartgraft|neograft|scalp/i, "hair"],
  [/peptide|nad|stem cell|exosome|semaglutide|tirzepatide|glp[- ]?1|regenera|longevity/i, "longevity"],
  [/iv|drip|vitamin|myers|hydrat|infusion/i, "wellness"],
];

export function classifyTreatment(t: TreatmentRow): TreatmentFamily {
  const name = t.name.toLowerCase();
  for (const [re, family] of RULES) {
    if (re.test(name)) return family;
  }
  return "other";
}

// Group + sort. Returns families in FAMILY_ORDER, only including families
// that actually have members. Treatments within a family are sorted by
// name for a stable, alphabetical reference list.
export function groupTreatments(
  treatments: TreatmentRow[],
): { family: TreatmentFamily; items: TreatmentRow[] }[] {
  const buckets = new Map<TreatmentFamily, TreatmentRow[]>();
  for (const t of treatments) {
    const f = classifyTreatment(t);
    const arr = buckets.get(f) ?? [];
    arr.push(t);
    buckets.set(f, arr);
  }
  const out: { family: TreatmentFamily; items: TreatmentRow[] }[] = [];
  for (const family of FAMILY_ORDER) {
    const items = buckets.get(family);
    if (items && items.length > 0) {
      out.push({
        family,
        items: items.slice().sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }
  return out;
}

// "Start with these" — the canonical patient-first treatments a first-time
// visitor should see up top. Slug-based so we can't accidentally promote
// something that doesn't exist yet; unresolved slugs are silently skipped.
export const START_WITH_SLUGS = [
  "botox",
  "microneedling",
  "hyaluronic-acid-filler",
  "laser-hair-removal",
  "chemical-peel",
];

export function pickStartWith(treatments: TreatmentRow[]): TreatmentRow[] {
  const bySlug = new Map(treatments.map((t) => [t.slug, t]));
  return START_WITH_SLUGS.map((s) => bySlug.get(s)).filter(
    (t): t is TreatmentRow => t !== undefined,
  );
}
