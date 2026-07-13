import type { StoryCategory } from "./db/types";

export const SITE = {
  name: "MedSpa Daily",
  tagline: "The calm, evidence-first read on the medspa world.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  byline: "MedSpa Daily Editorial",
  description:
    "Daily, source-tiered reporting on medspa studies, treatments, legislation, and longevity — written for patients.",
} as const;

export const CATEGORY_LABELS: Record<StoryCategory, string> = {
  research: "Research",
  treatments: "Treatments",
  legislation: "Legislation",
  longevity: "Longevity",
  industry: "Industry",
};

// URL segment per category ("treatments" is taken by the directory).
export const CATEGORY_ROUTES: Record<StoryCategory, string> = {
  research: "research",
  treatments: "treatments-news",
  legislation: "legislation",
  longevity: "longevity",
  industry: "industry",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as StoryCategory[];
