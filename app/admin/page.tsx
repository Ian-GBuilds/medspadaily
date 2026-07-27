import StoryReview from "@/components/admin/StoryReview";
import { requireAdmin } from "@/app/admin/actions";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PipelineRunRow, StoryRow } from "@/lib/db/types";

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
