import type { StoryRow } from "../db/types";
import { SITE } from "../site";
import { storyUrl } from "./jsonld";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function buildRssXml(stories: StoryRow[]): string {
  const items = stories
    .map(
      (s) => `    <item>
      <title>${esc(s.title)}</title>
      <link>${storyUrl(s)}</link>
      <guid isPermaLink="true">${storyUrl(s)}</guid>
      <description>${esc(s.dek)}</description>
      <pubDate>${new Date(s.published_at ?? Date.now()).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${esc(SITE.description)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
}
