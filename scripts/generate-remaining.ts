import "dotenv/config";
import type { StoryCategory } from "../lib/db/types";
import { runOnce } from "../lib/pipeline/run";

// Targeted re-run for the launch stories that didn't complete in the first pass
// (a transient network stall hung the streaming research call). Industry first
// (tier-2, faster), then longevity (tier-1, does deep web search). runOnce
// generates + uploads the hero image inline, so no separate image pass is needed
// for anything that succeeds here.
const REMAINING: StoryCategory[] = ["longevity"];

async function main() {
  for (const category of REMAINING) {
    console.log(`\n=== generating ${category} @ ${new Date().toISOString()} ===`);
    const result = await runOnce({ category });
    console.log(
      result.ok
        ? `ok: story ${result.storyId} @ ${new Date().toISOString()}`
        : `FAILED: ${result.error} @ ${new Date().toISOString()}`,
    );
  }
  console.log("\n=== done ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
