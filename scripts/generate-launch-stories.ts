import "dotenv/config";
import type { StoryCategory } from "../lib/db/types";
import { runOnce } from "../lib/pipeline/run";

const CATEGORIES: StoryCategory[] = [
  "research", "treatments", "legislation", "longevity", "industry",
];

async function main() {
  for (const category of CATEGORIES) {
    console.log(`\n=== generating ${category} ===`);
    const result = await runOnce({ category });
    console.log(result.ok ? `ok: story ${result.storyId}` : `FAILED: ${result.error}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
