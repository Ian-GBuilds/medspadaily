import CategoryArchive from "@/components/CategoryArchive";
export const revalidate = 300;
export const metadata = { title: "Research" };
export default function Page() { return <CategoryArchive category="research" />; }
