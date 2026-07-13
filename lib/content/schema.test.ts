import { describe, expect, it } from "vitest";
import { StoryDraftSchema, validateTierRules, type StoryDraft } from "./schema";

const validDraft: StoryDraft = {
  title: "New RCT Finds Microneedling Improves Acne Scarring",
  dek: "A 120-patient randomized trial reports measurable improvement after three sessions.",
  slug: "rct-microneedling-acne-scarring",
  category: "research",
  evidence_tier: 1,
  body: "## What the study found\n\nThis randomized controlled trial evaluated the effectiveness of microneedling for treating atrophic acne scars. Researchers enrolled 120 patients with moderate to severe scarring and assigned them to receive either active microneedling or sham treatment. Participants underwent three treatment sessions spaced four weeks apart, with assessments conducted at baseline, immediately after each treatment, and at six-month follow-up. The study measured scar depth using high-frequency ultrasound and patient satisfaction using validated quality-of-life instruments. Results showed statistically and clinically significant improvement in scar depth measurements following active microneedling compared to sham controls. The improvements persisted at the six-month follow-up evaluation.",
  meta_description: "A 120-patient randomized controlled trial finds microneedling significantly improves acne scarring after three sessions.",
  key_takeaways: [
    "120 patients completed the randomized trial",
    "Three sessions produced measurable scar improvement",
    "Effects held at six-month follow-up",
  ],
  faq: [{ question: "How many sessions were studied?", answer: "Three, spaced four weeks apart." }],
  sources: [
    {
      title: "Microneedling for atrophic acne scars: a randomized controlled trial",
      url: "https://pubmed.ncbi.nlm.nih.gov/00000000/",
      publication: "Journal of the American Academy of Dermatology",
      source_type: "journal",
      tier: 1,
    },
    {
      title: "ASPS statement on microneedling",
      url: "https://www.plasticsurgery.org/example",
      publication: "American Society of Plastic Surgeons",
      source_type: "professional_society",
      tier: 2,
    },
  ],
  related_treatments: ["microneedling"],
  image_concept: "A single steel roller resting on linen beside a sprig of eucalyptus",
  hero_image_alt: "Skincare tools arranged on natural linen in soft window light",
};

describe("StoryDraftSchema", () => {
  it("accepts a valid draft", () => {
    expect(StoryDraftSchema.safeParse(validDraft).success).toBe(true);
  });

  it("rejects a draft with no sources", () => {
    expect(StoryDraftSchema.safeParse({ ...validDraft, sources: [] }).success).toBe(false);
  });

  it("rejects an invalid category", () => {
    expect(StoryDraftSchema.safeParse({ ...validDraft, category: "gossip" }).success).toBe(false);
  });

  it("rejects fewer than 3 key takeaways", () => {
    expect(
      StoryDraftSchema.safeParse({ ...validDraft, key_takeaways: ["one", "two"] }).success,
    ).toBe(false);
  });

  it("rejects non-http source urls", () => {
    const bad = { ...validDraft, sources: [{ ...validDraft.sources[0], url: "ftp://x" }] };
    expect(StoryDraftSchema.safeParse(bad).success).toBe(false);
  });
});

describe("validateTierRules", () => {
  it("passes a research story with a tier-1 source", () => {
    expect(validateTierRules(validDraft)).toEqual([]);
  });

  it("fails a research story with only tier-2 sources", () => {
    const draft = {
      ...validDraft,
      sources: validDraft.sources.filter((s) => s.tier === 2),
    };
    expect(validateTierRules(draft).length).toBeGreaterThan(0);
  });

  it("fails a longevity story with only tier-2 sources", () => {
    const draft = {
      ...validDraft,
      category: "longevity" as const,
      sources: validDraft.sources.filter((s) => s.tier === 2),
    };
    expect(validateTierRules(draft).length).toBeGreaterThan(0);
  });

  it("passes a treatments story with only tier-2 sources", () => {
    const draft = {
      ...validDraft,
      category: "treatments" as const,
      evidence_tier: 2 as const,
      sources: validDraft.sources.filter((s) => s.tier === 2),
    };
    expect(validateTierRules(draft)).toEqual([]);
  });

  it("fails when evidence_tier is 1 but no tier-1 source exists", () => {
    const draft = {
      ...validDraft,
      category: "industry" as const,
      sources: validDraft.sources.filter((s) => s.tier === 2),
    };
    expect(validateTierRules(draft).length).toBeGreaterThan(0);
  });
});
