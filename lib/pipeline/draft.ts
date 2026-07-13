import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { StoryDraftSchema, type StoryDraft } from "../content/schema";
import type { StoryCategory } from "../db/types";

const HOUSE_STYLE = `House style: calm, precise, literary — Kinfolk, not BuzzFeed. Write for a patient, not a clinician. Short declarative sentences. No hype words ("game-changer", "miracle", "revolutionary"). Numbers over adjectives. Markdown body with ## section headings, 600-1000 words (roundups may run longer). Be honest about uncertainty and study limitations. Never give medical advice — describe evidence.`;

export async function draftStory(opts: {
  category: StoryCategory;
  researchBrief: string;
  knownTreatmentSlugs: string[];
  retryNote?: string;
}): Promise<StoryDraft> {
  const client = new Anthropic();
  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: `You write MedSpa Daily stories from research briefs. This story's assigned category is "${opts.category}" — write and label it accordingly. ${HOUSE_STYLE}
image_concept: propose a calm editorial STILL-LIFE photograph concept for this story (objects, texture, light — never people, faces, text, screens, or logos).
related_treatments: choose 0-3 ONLY from this list of treatment guide slugs: ${opts.knownTreatmentSlugs.join(", ")}.
sources: carry over the brief's sources verbatim (real URLs only, correctly tiered). evidence_tier is 1 only if a tier-1 source is central to the story.
Field length limits you must stay within exactly: title 10-120 characters; dek 20-220 characters; meta_description 50-160 characters; hero_image_alt 10-200 characters; key_takeaways exactly 3-4 items (each at least 10 characters); faq 0-4 pairs; sources 2-8; body at least 400 characters.`,
    messages: [{
      role: "user",
      content: `Write the story for this research brief.${opts.retryNote ? `\n\nYour previous attempt failed validation: ${opts.retryNote} — fix that.` : ""}\n\n${opts.researchBrief}`,
    }],
    output_config: { format: zodOutputFormat(StoryDraftSchema) },
  });
  if (response.stop_reason === "refusal") throw new Error("Draft call refused");
  const draft = response.parsed_output;
  if (!draft) throw new Error("Draft call returned no parsed output");
  return draft;
}
