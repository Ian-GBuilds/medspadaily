import Anthropic from "@anthropic-ai/sdk";
import type { StoryCategory } from "../db/types";

const TIER_GUIDE = `Evidence tiers:
- Tier 1: peer-reviewed journals, RCTs, meta-analyses, FDA documents, clinicaltrials.gov.
- Tier 2: professional societies (ASPS, AmSpa), reputable trade press, official state legislature pages, manufacturer announcements.
Category rules: "research" and "longevity" stories REQUIRE at least one tier-1 source. "treatments", "legislation", "industry" may rest on tier-2 sources.`;

const CATEGORY_BRIEFS: Record<StoryCategory, string> = {
  research: "a newly published study relevant to medspa treatments or aesthetic medicine (find the actual paper or trial registration)",
  treatments: "a procedure or treatment med spas commonly offer — something new, newly popular, or newly understood, written for a patient deciding whether to get it",
  legislation: "pending or newly passed legislation/regulation affecting med spas or their patients (injector licensing, med-spa oversight, compounding rules)",
  longevity: "a development in longevity/healthspan science relevant to medspa clientele (find the primary study)",
  industry: "product launches, FDA clearances, or notable business news in the medical-aesthetics industry",
};

// A single research stream. The Anthropic streaming call has no idle timeout, so
// a socket that stalls mid-response (observed on web-search-heavy categories) would
// leave finalMessage() awaiting forever. We put a hard wall-clock cap on it and
// abort the stream if it's exceeded, turning an infinite hang into a thrown error
// the caller can retry.
const RESEARCH_TIMEOUT_MS = 240_000; // 4 minutes

async function researchOnce(
  client: Anthropic,
  opts: { category: StoryCategory; roundup: boolean; avoidTopics: string[] },
): Promise<string> {
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 20000,
    thinking: { type: "adaptive" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 10 }],
    system:
      `You are the research desk for MedSpa Daily, an evidence-first patient publication. Today's date matters — find something RECENT (last ~10 days preferred). ${TIER_GUIDE}`,
    messages: [{
      role: "user",
      content: `Research today's ${opts.category} story: ${CATEGORY_BRIEFS[opts.category]}.${
        opts.roundup ? " Today is the Sunday research roundup: gather 3-4 notable studies from the past week instead of one." : ""
      }

Do NOT pick any of these already-covered topics:
${opts.avoidTopics.map((t) => `- ${t}`).join("\n") || "- (none yet)"}

Return a research brief: the chosen topic and why it matters to patients; the key facts with numbers; and a SOURCES section listing every source as: title | publication | url | tier (1 or 2) | type (journal/regulatory/clinical_trial/professional_society/trade_press/legislature/manufacturer). Only include sources you actually found via search — never invent URLs.`,
    }],
  });
  const timer = setTimeout(() => stream.abort(), RESEARCH_TIMEOUT_MS);
  let response;
  try {
    response = await stream.finalMessage();
  } finally {
    clearTimeout(timer);
  }
  if (response.stop_reason === "refusal") throw new Error("Research call refused");
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n");
}

export async function research(opts: {
  category: StoryCategory;
  roundup: boolean;
  avoidTopics: string[]; // existing story titles
}): Promise<string> {
  const client = new Anthropic();
  try {
    return await researchOnce(client, opts);
  } catch (err) {
    // A stalled/aborted stream or a transient network error — retry once on a
    // fresh connection before giving up (the caller logs a failed pipeline run).
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`research(${opts.category}) attempt 1 failed (${msg}); retrying once`);
    return await researchOnce(client, opts);
  }
}
