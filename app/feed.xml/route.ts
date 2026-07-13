import { getPublishedStories } from "@/lib/db/queries";
import { buildRssXml } from "@/lib/seo/feed";

export const revalidate = 300;

export async function GET() {
  const stories = await getPublishedStories({ limit: 30 });
  return new Response(buildRssXml(stories), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
