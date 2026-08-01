import { describe, expect, it } from "vitest";
import {
  aboutPageJsonLd, collectionPageJsonLd, faqPageJsonLd, medicalWebPageJsonLd,
  newsArticleJsonLd, organizationJsonLd, profilePageJsonLd,
  storyBreadcrumbJsonLd, storyUrl, treatmentBreadcrumbJsonLd, webSiteJsonLd,
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
  it("is a NewsArticle with headline, image, dates, and Person author", () => {
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe("Test Story");
    expect(ld.datePublished).toBe("2026-07-12T10:00:00Z");
    expect(ld.articleSection).toBe("Research");
  });
  it("images are ImageObjects with dimensions", () => {
    const img = (ld.image as Record<string, unknown>[])[0];
    expect(img["@type"]).toBe("ImageObject");
    expect(img.url).toContain("test-story.png");
    expect(img.width).toBe(1536);
  });
  it("author is the named RN Person with a resolvable bio URL", () => {
    const author = ld.author as Record<string, unknown>;
    expect(author["@type"]).toBe("Person");
    expect(author.name).toBe("Ian Gauntt, RN, BSN");
    expect(author.url).toContain("/about-the-author");
    expect(author.sameAs).toContain("https://www.linkedin.com/in/ian-gauntt-53018241a/");
    expect((author.image as Record<string, unknown>).url).toContain("/ian-gauntt.jpg");
  });
  it("publisher is inlined with the logo required for News eligibility", () => {
    const pub = ld.publisher as Record<string, unknown>;
    expect(pub["@type"]).toBe("Organization");
    const logo = pub.logo as Record<string, unknown>;
    expect(logo["@type"]).toBe("ImageObject");
    expect(logo.url).toContain("/logo.png");
    expect(logo.width).toBe(512);
  });
  it("carries mainEntityOfPage", () => {
    const me = ld.mainEntityOfPage as Record<string, unknown>;
    expect(me["@id"]).toMatch(/\/stories\/test-story$/);
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
  it("organization lists social profiles as sameAs", () => {
    const sameAs = (organizationJsonLd() as Record<string, unknown>).sameAs as string[];
    expect(sameAs).toContain("https://www.youtube.com/@MedSpaDaily");
    expect(sameAs).toContain("https://www.instagram.com/medspadaily/");
    expect(sameAs).toContain("https://www.tiktok.com/@medspadaily");
  });
  it("organization carries its logo", () => {
    const logo = (organizationJsonLd() as Record<string, unknown>).logo as Record<string, unknown>;
    expect(logo.url).toContain("/logo.png");
  });
  it("profile page mainEntity is the author Person", () => {
    const ld = profilePageJsonLd() as Record<string, unknown>;
    expect(ld["@type"]).toBe("ProfilePage");
    const person = ld.mainEntity as Record<string, unknown>;
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Ian Gauntt, RN, BSN");
  });
  it("about page points at the organization", () => {
    const ld = aboutPageJsonLd() as Record<string, unknown>;
    expect(ld["@type"]).toBe("AboutPage");
    expect((ld.mainEntity as Record<string, unknown>)["@id"]).toContain("#organization");
  });
  it("collection page describes the category hub", () => {
    const ld = collectionPageJsonLd("legislation") as Record<string, unknown>;
    expect(ld["@type"]).toBe("CollectionPage");
    expect(ld.url).toMatch(/\/legislation$/);
  });
});

describe("breadcrumbs", () => {
  it("story breadcrumb runs Home → category → story", () => {
    const ld = storyBreadcrumbJsonLd(story) as Record<string, unknown>;
    const items = ld.itemListElement as Record<string, unknown>[];
    expect(items.length).toBe(3);
    expect(items[0].name).toBe("Home");
    expect(items[1].name).toBe("Research");
    expect(items[2].item).toMatch(/\/stories\/test-story$/);
  });
  it("treatment breadcrumb runs Home → Treatments → entry", () => {
    const ld = treatmentBreadcrumbJsonLd({ slug: "botox", name: "Botox" }) as Record<string, unknown>;
    const items = ld.itemListElement as Record<string, unknown>[];
    expect(items.length).toBe(3);
    expect(items[1].name).toBe("Treatments");
    expect(items[2].item).toMatch(/\/treatments\/botox$/);
  });
});
