import StoryReview from "@/components/admin/StoryReview";
import { generateNow, requireAdmin } from "@/app/admin/actions";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/site";
import type { PipelineRunRow, StoryRow } from "@/lib/db/types";

export const maxDuration = 300;

export default async function AdminPage() {
  await requireAdmin();

  const db = supabaseAdmin();
  const { data: pendingData } = await db
    .from("stories")
    .select("*")
    .eq("status", "pending_review")
    .order("created_at");
  const pending = (pendingData ?? []) as StoryRow[];

  const { data: runsData } = await db
    .from("pipeline_runs")
    .select("*")
    .order("ran_at", { ascending: false })
    .limit(5);
  const runs = (runsData ?? []) as PipelineRunRow[];
  const lastRun = runs[0];

  return (
    <div className="mt-10">
      <h1 className="font-serif text-3xl leading-tight text-ink">Review queue</h1>
      <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink-muted">
        {pending.length} awaiting review
      </p>

      {lastRun?.status === "failed" && (
        <div className="mt-6 border border-line p-4" role="alert">
          <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
            Last pipeline run failed
          </p>
          <p className="mt-2 text-sm text-ink">
            {lastRun.error ?? "No error detail recorded."}
          </p>
        </div>
      )}

      <details className="mt-8 border border-line p-4">
        <summary className="cursor-pointer font-sans text-xs uppercase tracking-widest text-ink-muted">
          Generate now
        </summary>
        <form
          action={generateNow}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <label htmlFor="generate-category" className="sr-only">
            Category
          </label>
          <select
            id="generate-category"
            name="category"
            defaultValue={CATEGORIES[0]}
            className="border border-line bg-paper px-3 py-2 font-sans text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="border border-line px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Generate
          </button>
        </form>
      </details>

      {pending.length === 0 ? (
        <p className="mt-10 text-ink-muted">Nothing awaiting review.</p>
      ) : (
        <div className="mt-10 space-y-16">
          {pending.map((story) => (
            <StoryReview key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
