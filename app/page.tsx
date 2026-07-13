import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import StoryCard from "@/components/StoryCard";
import { getPublishedStories } from "@/lib/db/queries";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 300;

export default async function HomePage() {
  const stories = await getPublishedStories({ limit: 13 });
  const [lead, ...rest] = stories;
  return (
    <div className="py-12">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      {lead && (
        <article className="border-b border-line pb-12">
          {lead.hero_image_url && (
            <Link href={`/stories/${lead.slug}`}>
              <Image
                src={lead.hero_image_url} alt={lead.hero_image_alt ?? ""}
                width={1536} height={1024} priority
                className="mb-8 w-full"
              />
            </Link>
          )}
          <h1 className="text-4xl leading-tight">
            <Link href={`/stories/${lead.slug}`}>{lead.title}</Link>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">{lead.dek}</p>
        </article>
      )}
      <section className="divide-y divide-line">
        {rest.map((s) => <StoryCard key={s.id} story={s} />)}
      </section>
      {stories.length === 0 && (
        <p className="py-24 text-center text-ink-muted">First edition arriving shortly.</p>
      )}
    </div>
  );
}
