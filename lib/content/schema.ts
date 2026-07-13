import { z } from "zod";
import type { StoryCategory } from "../db/types";

export const SourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().regex(/^https?:\/\//),
  publication: z.string().min(1),
  source_type: z.enum([
    "journal", "regulatory", "clinical_trial",
    "professional_society", "trade_press", "legislature", "manufacturer",
  ]),
  tier: z.union([z.literal(1), z.literal(2)]),
});

export const StoryDraftSchema = z.object({
  title: z.string().min(10).max(120),
  dek: z.string().min(20).max(220),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["research", "treatments", "legislation", "longevity", "industry"]),
  evidence_tier: z.union([z.literal(1), z.literal(2)]),
  body: z.string().min(400),
  meta_description: z.string().min(50).max(160),
  key_takeaways: z.array(z.string().min(10)).min(3).max(4),
  faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).max(4).nullable(),
  sources: z.array(SourceSchema).min(2).max(8),
  related_treatments: z.array(z.string()).max(3),
  image_concept: z.string().min(10),
  hero_image_alt: z.string().min(10).max(200),
});

export type StoryDraft = z.infer<typeof StoryDraftSchema>;

const TIER1_REQUIRED: StoryCategory[] = ["research", "longevity"];

/** Returns a list of human-readable rule violations; empty array = valid. */
export function validateTierRules(draft: StoryDraft): string[] {
  const errors: string[] = [];
  const hasTier1 = draft.sources.some((s) => s.tier === 1);
  if (TIER1_REQUIRED.includes(draft.category) && !hasTier1) {
    errors.push(
      `Category "${draft.category}" requires at least one tier-1 source (peer-reviewed journal, RCT, meta-analysis, FDA document, or clinicaltrials.gov).`,
    );
  }
  if (draft.evidence_tier === 1 && !hasTier1) {
    errors.push("evidence_tier is 1 but no tier-1 source is cited.");
  }
  return errors;
}
