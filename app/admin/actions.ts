"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { revalidateStoryPaths } from "@/lib/revalidate";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";
import { runOnce } from "@/lib/pipeline/run";
import type { StoryCategory } from "@/lib/db/types";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== env("ADMIN_EMAIL").toLowerCase()) {
    redirect("/admin/login");
  }
  return user;
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const supabase = await supabaseServer();
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${SITE.url}/auth/callback` },
  });
}

export async function approveStory(id: string) {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data: story, error } = await db
    .from("stories")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id).eq("status", "pending_review")
    .select("slug, category").single();
  if (error) throw error;
  revalidateStoryPaths(story.slug, story.category as StoryCategory);
}

export async function rejectStory(id: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from("stories").update({ status: "rejected" })
    .eq("id", id).eq("status", "pending_review");
  if (error) throw error;
  revalidatePath("/admin");
}

export async function updateStory(id: string, formData: FormData) {
  await requireAdmin();
  const fields = {
    title: String(formData.get("title")),
    dek: String(formData.get("dek")),
    body: String(formData.get("body")),
    meta_description: String(formData.get("meta_description")),
    hero_image_alt: String(formData.get("hero_image_alt")),
  };
  const { error } = await supabaseAdmin().from("stories").update(fields).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

export async function generateNow(formData: FormData) {
  await requireAdmin();
  const category = String(formData.get("category")) as StoryCategory;
  await runOnce({ category });
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
