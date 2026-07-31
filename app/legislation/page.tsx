import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { CATEGORY_DESCRIPTIONS } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Legislation",
  description: CATEGORY_DESCRIPTIONS.legislation,
  alternates: { canonical: "/legislation" },
};

export default function Page() { return <CategoryArchive category="legislation" />; }
