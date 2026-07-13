import type { FaqItem, StoryRow, TreatmentRow } from "../db/types";
import { CATEGORY_LABELS, SITE } from "../site";

export function storyUrl(story: Pick<StoryRow, "slug">): string {
  return `${SITE.url}/stories/${story.slug}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function newsArticleJsonLd(story: StoryRow) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: story.meta_description,
    image: story.hero_image_url ? [story.hero_image_url] : undefined,
    url: storyUrl(story),
    datePublished: story.published_at ?? undefined,
    dateModified: story.published_at ?? undefined,
    articleSection: CATEGORY_LABELS[story.category],
    author: { "@type": "Organization", name: SITE.byline, url: SITE.url },
    publisher: { "@id": `${SITE.url}/#organization` },
    isAccessibleForFree: true,
  };
}

export function medicalWebPageJsonLd(treatment: Pick<TreatmentRow, "slug" | "name" | "summary">) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: treatment.name,
    description: treatment.summary,
    url: `${SITE.url}/treatments/${treatment.slug}`,
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function faqPageJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
