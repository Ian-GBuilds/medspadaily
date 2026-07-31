import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { CATEGORY_DESCRIPTIONS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research",
  description: CATEGORY_DESCRIPTIONS.research,
  alternates: { canonical: "/research" },
};

export default function Page() { return <CategoryArchive category="research" />; }
