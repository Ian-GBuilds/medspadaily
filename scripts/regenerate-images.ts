import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { generateHeroImage } from "../lib/pipeline/image";
import { supabaseAdmin } from "../lib/supabase/admin";

// Re-generate hero images for any non-rejected story flagged as missing an image
// (image generation is best-effort in the pipeline, so a transient failure leaves
// image_flagged = true). The story's original image_concept is not persisted, so we
// re-derive a house-style still-life concept from the headline before generating.

const client = new Anthropic();

async function imageConceptFor(s: {
  title: string;
  dek: string;
  category: string;
}): Promise<string> {
  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Propose ONE calm editorial still-life photograph concept for this magazine story — objects, texture, and light only. Never people, faces, hands, text, screens, or logos. Answer with just the concept in one or two sentences.\n\nStory: "${s.title}" — ${s.dek}\nCategory: ${s.category}`,
      },
    ],
  });
  return res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join(" ")
    .trim();
}

async function main() {
  const db = supabaseAdmin();
  const { data: stories, error } = await db
    .from("stories")
    .select("id, slug, title, dek, category")
    .eq("image_flagged", true)
    .neq("status", "rejected");
  if (error) throw error;
  if (!stories || stories.length === 0) {
    console.log("No flagged stories — nothing to regenerate.");
    return;
  }
  console.log(`Regenerating hero images for ${stories.length} story(ies)...`);
  for (const s of stories) {
    try {
      const concept = await imageConceptFor(s);
      const url = await generateHeroImage({ slug: s.slug, imageConcept: concept });
      const { error: upErr } = await db
        .from("stories")
        .update({ hero_image_url: url, image_flagged: false })
        .eq("id", s.id);
      if (upErr) throw upErr;
      console.log(`  ok  ${s.slug} -> ${url}`);
    } catch (err) {
      console.log(`  FAIL ${s.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
