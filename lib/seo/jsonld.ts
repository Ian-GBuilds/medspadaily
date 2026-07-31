import type { FaqItem, StoryRow, TreatmentRow } from "../db/types";
import type { StoryCategory } from "../db/types";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, CATEGORY_ROUTES, SITE } from "../site";

export function storyUrl(story: Pick<StoryRow, "slug">): string {
  return `${SITE.url}/stories/${story.slug}`;
}

// The one Person behind the byline. Emitted inline on articles (author) and
// as the mainEntity of the /about-the-author ProfilePage.
export function authorPerson() {
  return {
    "@type": "Person",
    "@id": `${SITE.url}${SITE.author.path}#person`,
    name: SITE.author.name,
    url: `${SITE.url}${SITE.author.path}`,
    jobTitle: SITE.author.jobTitle,
    sameAs: [...SITE.author.sameAs],
    worksFor: { "@id": `${SITE.url}/#organization` },
  };
}

// The Organization node without @context — nested as publisher inside
// NewsArticle, and wrapped by organizationJsonLd() for standalone emission.
function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}${SITE.logo.path}`,
      width: SITE.logo.width,
      height: SITE.logo.height,
    },
    sameAs: Object.values(SITE.social),
  };
}

export function organizationJsonLd() {
  return { "@context": "https://schema.org", ...organizationNode() };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE.url}${SITE.author.path}`,
    name: `${SITE.author.name} — ${SITE.name}`,
    mainEntity: authorPerson(),
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE.url}/about`,
    name: `About ${SITE.name}`,
    mainEntity: { "@id": `${SITE.url}/#organization` },
  };
}

export function collectionPageJsonLd(category: StoryCategory) {
  const route = `/${CATEGORY_ROUTES[category]}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}${route}#webpage`,
    url: `${SITE.url}${route}`,
    name: `${CATEGORY_LABELS[category]} — ${SITE.name}`,
    description: CATEGORY_DESCRIPTIONS[category],
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${SITE.url}${c.path}`,
      })),
    ],
  };
}

export function storyBreadcrumbJsonLd(story: Pick<StoryRow, "slug" | "title" | "category">) {
  return breadcrumbJsonLd([
    { name: CATEGORY_LABELS[story.category], path: `/${CATEGORY_ROUTES[story.category]}` },
    { name: story.title, path: `/stories/${story.slug}` },
  ]);
}

export function treatmentBreadcrumbJsonLd(t: Pick<TreatmentRow, "slug" | "name">) {
  return breadcrumbJsonLd([
    { name: "Treatments", path: "/treatments" },
    { name: t.name, path: `/treatments/${t.slug}` },
  ]);
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
    image: story.hero_image_url
      ? [{
          "@type": "ImageObject",
          url: story.hero_image_url,
          // Pipeline story images are generated at 1536×1024 (3:2), matching
          // the width/height the article template renders them at.
          width: 1536,
          height: 1024,
        }]
      : undefined,
    url: storyUrl(story),
    mainEntityOfPage: { "@type": "WebPage", "@id": storyUrl(story) },
    datePublished: story.published_at ?? undefined,
    dateModified: story.published_at ?? undefined,
    articleSection: CATEGORY_LABELS[story.category],
    author: authorPerson(),
    // The full Organization node (with logo) is inlined rather than @id-referenced
    // so article pages satisfy the publisher-logo requirement standalone —
    // parsers don't resolve cross-page @id references.
    publisher: organizationNode(),
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
    reviewedBy: authorPerson(),
    publisher: organizationNode(),
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
