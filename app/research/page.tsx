import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { categoryMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return categoryMetadata("research");
}

export default function Page() { return <CategoryArchive category="research" />; }
