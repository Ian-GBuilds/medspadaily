import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases, strips punctuation, hyphenates", () => {
    expect(slugify("New FDA Rule: What Patients Should Know!")).toBe(
      "new-fda-rule-what-patients-should-know",
    );
  });
  it("collapses repeated separators", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });
});

describe("uniqueSlug", () => {
  it("returns base when free", () => {
    expect(uniqueSlug("botox-news", new Set())).toBe("botox-news");
  });
  it("suffixes -2, -3 when taken", () => {
    expect(uniqueSlug("botox-news", new Set(["botox-news", "botox-news-2"]))).toBe(
      "botox-news-3",
    );
  });
});
