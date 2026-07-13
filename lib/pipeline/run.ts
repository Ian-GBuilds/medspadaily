import { validateTierRules, type StoryDraft } from "../content/schema";
import { slugify, uniqueSlug } from "../content/slug";
import type { PipelineLogEntry, StoryCategory } from "../db/types";
import { supabaseAdmin } from "../supabase/admin";
import { draftStory } from "./draft";
import { generateHeroImage } from "./image";
import { research } from "./research";
import { categoryForDate, isSundayRoundup } from "./topics";

export async function runOnce(opts?: {
  category?: StoryCategory;
}): Promise<{ ok: boolean; storyId?: string; error?: string }> {
  const now = new Date();
  const category = opts?.category ?? categoryForDate(now);
  const roundup = !opts?.category && isSundayRoundup(now);
  const db = supabaseAdmin();
  const log: PipelineLogEntry[] = [];
  const note = (step: string, msg: string) =>
    log.push({ step, at: new Date().toISOString(), note: msg });

  try {
    const [{ data: stories }, { data: treatments }] = await Promise.all([
      db.from("stories").select("slug, title"),
      db.from("treatments").select("slug"),
    ]);
    const takenSlugs = new Set((stories ?? []).map((s) => s.slug));
    const avoidTopics = (stories ?? []).map((s) => s.title);
    const treatmentSlugs = (treatments ?? []).map((t) => t.slug);

    note("research", `category=${category} roundup=${roundup}`);
    const brief = await research({ category, roundup, avoidTopics });

    let draft: StoryDraft;
    try {
      draft = await draftStory({ category, researchBrief: brief, knownTreatmentSlugs: treatmentSlugs });
      draft.category = category; // enforce assigned category before validating tier rules — never trust the model's
      const violations = validateTierRules(draft);
      if (violations.length > 0) throw new ValidationError(violations.join(" "));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      note("draft-retry", msg);
      draft = await draftStory({
        category, researchBrief: brief, knownTreatmentSlugs: treatmentSlugs, retryNote: msg,
      });
      draft.category = category; // enforce assigned category before validating tier rules — never trust the model's
      const violations = validateTierRules(draft);
      if (violations.length > 0) throw new Error(`Draft failed validation twice: ${violations.join(" ")}`);
    }

    draft.slug = uniqueSlug(slugify(draft.slug || draft.title), takenSlugs);
    note("draft", `"${draft.title}" (${draft.sources.length} sources)`);

    let heroImageUrl: string | null = null;
    let imageFlagged = false;
    try {
      heroImageUrl = await generateHeroImage({ slug: draft.slug, imageConcept: draft.image_concept });
      note("image", "generated + uploaded");
    } catch (err) {
      imageFlagged = true;
      note("image-failed", err instanceof Error ? err.message : String(err));
    }

    const { image_concept: _drop, ...storyFields } = draft;
    const { data: inserted, error } = await db
      .from("stories")
      .insert({
        ...storyFields,
        status: "pending_review",
        hero_image_url: heroImageUrl,
        image_flagged: imageFlagged,
        pipeline_log: log,
      })
      .select("id").single();
    if (error) throw error;

    await db.from("pipeline_runs").insert({ category, status: "success", story_id: inserted.id });
    return { ok: true, storyId: inserted.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.from("pipeline_runs").insert({ category, status: "failed", error: msg });
    return { ok: false, error: msg };
  }
}

class ValidationError extends Error {}
