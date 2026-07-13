import CategoryArchive from "@/components/CategoryArchive";
export const revalidate = 300;
export const metadata = { title: "Industry" };
export default function Page() { return <CategoryArchive category="industry" />; }
