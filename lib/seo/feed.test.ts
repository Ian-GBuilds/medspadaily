import { describe, expect, it } from "vitest";
import { buildRssXml } from "./feed";
import type { StoryRow } from "../db/types";

const story = {
  slug: "test-story", title: "Ampersand & Co", dek: "A <dek>.",
  published_at: "2026-07-12T10:00:00Z", category: "research",
} as StoryRow;

describe("buildRssXml", () => {
  const xml = buildRssXml([story]);
  it("is an rss 2.0 document with the story item", () => {
    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).toContain("/stories/test-story");
  });
  it("escapes XML entities", () => {
    expect(xml).toContain("Ampersand &amp; Co");
    expect(xml).toContain("A &lt;dek&gt;.");
  });
});
