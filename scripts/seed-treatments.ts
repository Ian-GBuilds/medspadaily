import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { TreatmentDraftSchema } from "../lib/content/treatment-schema";
import { supabaseAdmin } from "../lib/supabase/admin";

const TREATMENTS = [
  ["botox", "Botox & Neurotoxins"],
  ["dermal-fillers", "Dermal Fillers"],
  ["microneedling", "Microneedling"],
  ["laser-resurfacing", "Laser Resurfacing"],
  ["chemical-peels", "Chemical Peels"],
  ["hydrafacial", "HydraFacial"],
  ["body-contouring", "Body Contouring"],
  ["iv-therapy", "IV Therapy"],
] as const;

const client = new Anthropic();

async function draftTreatment(slug: string, name: string, retryNote?: string) {
  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system:
      "You write calm, evidence-first patient education for MedSpa Daily. Plain markdown paragraphs (no headings inside fields). Neutral about brands; explicit about evidence quality and risks; American English; costs as typical US ranges. Respect every field length limit exactly.",
    messages: [{
      role: "user",
      content: `Write the treatment directory entry for "${name}" (slug must be exactly "${slug}"). Fields, with length limits you must stay within:
- summary: 50-300 characters (2-3 sentences, one calm paragraph — keep it under 300).
- what_it_is: at least 200 characters.
- what_to_expect: at least 200 characters (appointment, downtime, results timeline).
- evidence_summary: at least 200 characters (what the research actually supports, with study types named in text).
- risks: at least 100 characters (frank, including who should avoid it).
- typical_cost_range: 5-120 characters (typical US range).
- faq: 3-5 patient question/answer pairs.${retryNote ? `\n\nYour previous attempt was rejected for violating a field limit: ${retryNote}\nFix it and stay within every limit above.` : ""}`,
    }],
    output_config: { format: zodOutputFormat(TreatmentDraftSchema) },
  });
  const draft = response.parsed_output;
  if (!draft) throw new Error(`No parsed output for ${slug}`);
  return draft;
}

async function main() {
  const db = supabaseAdmin();
  for (const [slug, name] of TREATMENTS) {
    const { data: existing } = await db.from("treatments").select("id").eq("slug", slug).maybeSingle();
    if (existing) { console.log(`skip ${slug} (exists)`); continue; }
    console.log(`drafting ${slug}...`);
    // Structured output enforces types but not string length limits, so a draft
    // can still violate the schema and be rejected on parse — retry once with the
    // rejection reason before giving up.
    let treatment;
    try {
      treatment = await draftTreatment(slug, name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  retry ${slug}: ${msg.slice(0, 140)}`);
      treatment = await draftTreatment(slug, name, msg);
    }
    // Force the intended slug onto the row so the dedup key (checked above),
    // the intended slug, and the inserted row can never diverge if the model
    // returns a valid-but-different slug — otherwise a re-run would duplicate.
    const draft = { ...treatment, slug };
    const { error } = await db.from("treatments").insert(draft);
    if (error) throw error;
    console.log(`inserted ${slug}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
