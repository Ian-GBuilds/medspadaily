import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { categoryMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  // Nav/masthead override: the treatments *news* desk shows as "Treatment News"
  // so the reference index at /treatments keeps the plain "Treatments" label.
  return categoryMetadata("treatments", "Treatment News");
}

export default function Page() { return <CategoryArchive category="treatments" />; }
