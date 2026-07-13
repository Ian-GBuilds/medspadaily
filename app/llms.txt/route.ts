import { getPublishedStories, getTreatments } from "@/lib/db/queries";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const [stories, treatments] = await Promise.all([
    getPublishedStories({ limit: 50 }), getTreatments(),
  ]);
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description} Every story cites its sources and labels evidence quality (Tier 1 = peer-reviewed/regulatory; Tier 2 = professional bodies/trade press). A human editor approves every story before publication.`,
    "",
    "## Recent stories",
    ...stories.map((s) => `- [${s.title}](${SITE.url}/stories/${s.slug}): ${s.dek}`),
    "",
    "## Treatment guides",
    ...treatments.map((t) => `- [${t.name}](${SITE.url}/treatments/${t.slug}): ${t.summary}`),
    "",
    "## Editorial policy",
    `- [How we source](${SITE.url}/how-we-source)`,
    `- [About](${SITE.url}/about)`,
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
