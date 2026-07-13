import { describe, expect, it } from "vitest";
import {
  faqPageJsonLd, medicalWebPageJsonLd, newsArticleJsonLd,
  organizationJsonLd, storyUrl, webSiteJsonLd,
} from "./jsonld";
import type { StoryRow, TreatmentRow } from "../db/types";

const story = {
  id: "1", slug: "test-story", title: "Test Story", dek: "A dek.",
  body: "Body", category: "research", evidence_tier: 1, status: "published",
  hero_image_url: "https://x.supabase.co/storage/v1/object/public/story-images/test-story.png",
  hero_image_alt: "alt", image_flagged: false,
  sources: [], key_takeaways: ["a", "b", "c"], faq: null, related_treatments: [],
  meta_description: "Meta.", pipeline_log: [],
  published_at: "2026-07-12T10:00:00Z", created_at: "2026-07-12T09:00:00Z",
} as StoryRow;

describe("newsArticleJsonLd", () => {
  const ld = newsArticleJsonLd(story) as Record<string, unknown>;
  it("is a NewsArticle with headline, image, dates, and org author", () => {
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe("Test Story");
    expect((ld.image as string[])[0]).toContain("test-story.png");
    expect(ld.datePublished).toBe("2026-07-12T10:00:00Z");
    expect((ld.author as Record<string, unknown>)["@type"]).toBe("Organization");
    expect(ld.articleSection).toBe("Research");
  });
  it("uses the canonical story url", () => {
    expect(storyUrl(story)).toMatch(/\/stories\/test-story$/);
  });
});

describe("medicalWebPageJsonLd", () => {
  it("is a MedicalWebPage naming the treatment", () => {
    const t = { slug: "botox", name: "Botox", summary: "s" } as TreatmentRow;
    const ld = medicalWebPageJsonLd(t) as Record<string, unknown>;
    expect(ld["@type"]).toBe("MedicalWebPage");
    expect(ld.name).toBe("Botox");
  });
});

describe("faqPageJsonLd", () => {
  it("maps questions to mainEntity", () => {
    const ld = faqPageJsonLd([{ question: "Q?", answer: "A." }]) as Record<string, unknown>;
    expect(ld["@type"]).toBe("FAQPage");
    expect((ld.mainEntity as unknown[]).length).toBe(1);
  });
});

describe("site-wide graphs", () => {
  it("organization and website have @ids", () => {
    expect((organizationJsonLd() as Record<string, unknown>)["@type"]).toBe("Organization");
    expect((webSiteJsonLd() as Record<string, unknown>)["@type"]).toBe("WebSite");
  });
});
