import Image from "next/image";
import KeyTakeaways from "@/components/KeyTakeaways";
import Prose from "@/components/Prose";
import SourcesBlock from "@/components/SourcesBlock";
import { approveStory, rejectStory, updateStory } from "@/app/admin/actions";
import { CATEGORY_LABELS } from "@/lib/site";
import type { StoryRow } from "@/lib/db/types";

const fieldLabel =
  "font-sans text-xs uppercase tracking-widest text-ink-muted";
const fieldInput =
  "w-full border border-line bg-paper px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const primaryButton =
  "border border-ink bg-ink px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] text-paper transition-colors hover:bg-transparent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondaryButton =
  "border border-line px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function StoryReview({ story }: { story: StoryRow }) {
  return (
    <article className="border border-line p-6">
      <p className={fieldLabel}>
        {CATEGORY_LABELS[story.category]} · Pending review
      </p>
      <h2 className="mt-3 text-3xl leading-tight text-ink">{story.title}</h2>
      <p className="mt-3 text-lg text-ink-muted">{story.dek}</p>

      {story.hero_image_url && (
        <figure className="mt-6">
          <Image
            src={story.hero_image_url}
            alt={story.hero_image_alt ?? ""}
            width={1536}
            height={1024}
            className="w-full"
          />
          {story.image_flagged && (
            <figcaption className="mt-2 border border-line px-3 py-2 font-sans text-xs uppercase tracking-widest text-ink-muted">
              Image flagged — review before publishing.
            </figcaption>
          )}
        </figure>
      )}

      <KeyTakeaways items={story.key_takeaways} />
      <div className="mt-8">
        <Prose markdown={story.body} />
      </div>
      <SourcesBlock sources={story.sources} />

      <details className="mt-10 border-t border-line pt-6">
        <summary className={`cursor-pointer ${fieldLabel}`}>Edit</summary>
        <form
          action={updateStory.bind(null, story.id)}
          className="mt-5 space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`title-${story.id}`} className={fieldLabel}>
              Title
            </label>
            <input
              id={`title-${story.id}`}
              name="title"
              defaultValue={story.title}
              className={fieldInput}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`dek-${story.id}`} className={fieldLabel}>
              Dek
            </label>
            <input
              id={`dek-${story.id}`}
              name="dek"
              defaultValue={story.dek}
              className={fieldInput}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`meta_description-${story.id}`}
              className={fieldLabel}
            >
              Meta description
            </label>
            <input
              id={`meta_description-${story.id}`}
              name="meta_description"
              defaultValue={story.meta_description}
              className={fieldInput}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`hero_image_alt-${story.id}`}
              className={fieldLabel}
            >
              Hero image alt text
            </label>
            <input
              id={`hero_image_alt-${story.id}`}
              name="hero_image_alt"
              defaultValue={story.hero_image_alt ?? ""}
              className={fieldInput}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`body-${story.id}`} className={fieldLabel}>
              Body (Markdown)
            </label>
            <textarea
              id={`body-${story.id}`}
              name="body"
              defaultValue={story.body}
              rows={16}
              className={`${fieldInput} font-mono leading-relaxed`}
            />
          </div>
          <button type="submit" className={secondaryButton}>
            Save edits
          </button>
        </form>
      </details>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
        <form action={approveStory.bind(null, story.id)}>
          <button type="submit" className={primaryButton}>
            Approve &amp; publish
          </button>
        </form>
        <form action={rejectStory.bind(null, story.id)}>
          <button type="submit" className={secondaryButton}>
            Reject
          </button>
        </form>
      </div>
    </article>
  );
}
