import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { CATEGORY_DESCRIPTIONS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industry",
  description: CATEGORY_DESCRIPTIONS.industry,
  alternates: { canonical: "/industry" },
};

export default function Page() { return <CategoryArchive category="industry" />; }
