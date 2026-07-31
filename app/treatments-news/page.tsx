import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { CATEGORY_DESCRIPTIONS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Treatment News",
  description: CATEGORY_DESCRIPTIONS.treatments,
  alternates: { canonical: "/treatments-news" },
};

export default function Page() { return <CategoryArchive category="treatments" />; }
