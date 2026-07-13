import { supabasePublic } from "../supabase/public";
import type { StoryCategory, StoryRow, TreatmentRow } from "./types";

export async function getPublishedStories(opts?: {
  limit?: number;
  category?: StoryCategory;
}): Promise<StoryRow[]> {
  let q = supabasePublic()
    .from("stories")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as StoryRow[];
}

export async function getStoryBySlug(slug: string): Promise<StoryRow | null> {
  const { data, error } = await supabasePublic()
    .from("stories")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as StoryRow | null;
}

export async function getTreatments(): Promise<TreatmentRow[]> {
  const { data, error } = await supabasePublic()
    .from("treatments").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as TreatmentRow[];
}

export async function getTreatmentBySlug(slug: string): Promise<TreatmentRow | null> {
  const { data, error } = await supabasePublic()
    .from("treatments").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as TreatmentRow | null;
}

export async function getRelatedStoriesForTreatment(
  slug: string, limit = 5,
): Promise<StoryRow[]> {
  const { data, error } = await supabasePublic()
    .from("stories")
    .select("*")
    .eq("status", "published")
    .contains("related_treatments", JSON.stringify([slug]))
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as StoryRow[];
}
