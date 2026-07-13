import { describe, expect, it } from "vitest";
import { categoryForDate } from "./topics";

describe("categoryForDate (America/New_York weekly rotation)", () => {
  // 2026-07-13 is a Monday
  it.each([
    ["2026-07-13T12:00:00Z", "research"],    // Mon
    ["2026-07-14T12:00:00Z", "treatments"],  // Tue
    ["2026-07-15T12:00:00Z", "legislation"], // Wed
    ["2026-07-16T12:00:00Z", "research"],    // Thu
    ["2026-07-17T12:00:00Z", "longevity"],   // Fri
    ["2026-07-18T12:00:00Z", "industry"],    // Sat
    ["2026-07-19T12:00:00Z", "research"],    // Sun (roundup)
  ])("%s -> %s", (iso, expected) => {
    expect(categoryForDate(new Date(iso))).toBe(expected);
  });

  it("uses the New York day, not UTC (2am UTC Tuesday is still Monday in NY)", () => {
    expect(categoryForDate(new Date("2026-07-14T02:00:00Z"))).toBe("research");
  });
});
