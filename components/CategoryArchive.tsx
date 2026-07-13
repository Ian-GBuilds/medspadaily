import StoryCard from "@/components/StoryCard";
import { getPublishedStories } from "@/lib/db/queries";
import type { StoryCategory } from "@/lib/db/types";
import { CATEGORY_LABELS } from "@/lib/site";

export default async function CategoryArchive({
  category,
}: {
  category: StoryCategory;
}) {
  const stories = await getPublishedStories({ category });
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">{CATEGORY_LABELS[category]}</h1>
      <section className="mt-8 divide-y divide-line">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </section>
      {stories.length === 0 && (
        <p className="py-24 text-center text-ink-muted">
          No stories in this section yet.
        </p>
      )}
    </div>
  );
}
