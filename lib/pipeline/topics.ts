import type { StoryCategory } from "../db/types";

const ROTATION: Record<string, StoryCategory> = {
  Mon: "research", Tue: "treatments", Wed: "legislation",
  Thu: "research", Fri: "longevity", Sat: "industry", Sun: "research",
};

export function categoryForDate(date: Date): StoryCategory {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short", timeZone: "America/New_York",
  }).format(date);
  return ROTATION[weekday];
}

export function isSundayRoundup(date: Date): boolean {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", timeZone: "America/New_York",
  }).format(date) === "Sun";
}
