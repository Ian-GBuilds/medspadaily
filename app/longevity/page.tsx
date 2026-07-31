import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { CATEGORY_DESCRIPTIONS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Longevity",
  description: CATEGORY_DESCRIPTIONS.longevity,
  alternates: { canonical: "/longevity" },
};

export default function Page() { return <CategoryArchive category="longevity" />; }
