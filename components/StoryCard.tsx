import Image from "next/image";
import Link from "next/link";
import type { StoryRow } from "@/lib/db/types";
import { CATEGORY_LABELS, CATEGORY_ROUTES } from "@/lib/site";

export default function StoryCard({ story }: { story: StoryRow }) {
  return (
    <article className="py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
        {story.hero_image_url && (
          // Decorative duplicate of the headline link: hidden from the a11y tree
          // and tab order so screen-reader/keyboard users get one link (the title).
          <Link
            href={`/stories/${story.slug}`}
            aria-hidden
            tabIndex={-1}
            className="block shrink-0 sm:w-64 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <Image
              src={story.hero_image_url}
              alt=""
              width={1536}
              height={1024}
              sizes="(min-width: 640px) 16rem, 100vw"
              className="aspect-[3/2] w-full object-cover"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          {story.published_at && (
            <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
              <time dateTime={story.published_at}>
                {new Date(story.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
          )}
          <h2 className="mt-2 text-2xl leading-snug">
            <Link
              href={`/stories/${story.slug}`}
              className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {story.title}
            </Link>
          </h2>
          <p className="mt-2 text-ink-muted">{story.dek}</p>
          <p className="mt-3">
            <Link
              href={`/${CATEGORY_ROUTES[story.category]}`}
              className="font-sans text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {CATEGORY_LABELS[story.category]}
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
