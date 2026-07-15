import TierBadge from "./TierBadge";

// ---------------------------------------------------------------------------
// KeyTakeaways — the standfirst band above the article body.
//
// This is the "evidence-worn-openly" moment on a story page: a hairline
// border-y block that carries the tier badge (large) and a short bulleted
// summary of the piece. The first bullet reads as the lead sentence of the
// standfirst (serif, roman, larger); the rest are supporting.
//
// If the story has no takeaways we return null — the story page proceeds
// to the body without an empty band.
// ---------------------------------------------------------------------------

export default function KeyTakeaways({
  items,
  tier,
}: {
  items: string[];
  tier?: 1 | 2;
}) {
  if (!items || items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <section className="my-10 border-y border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="small-caps font-sans text-xs text-ink-muted">
          The short version
        </p>
        {tier && <TierBadge tier={tier} size="md" />}
      </div>

      <p className="mt-5 font-serif text-xl leading-[1.45] text-ink text-wrap-pretty">
        {lead}
      </p>

      {rest.length > 0 && (
        <ul className="mt-4 space-y-2 text-ink-muted">
          {rest.map((item) => (
            <li
              key={item}
              className="pl-4 leading-relaxed text-[0.9375rem] before:mr-2 before:text-accent before:content-['\002014']"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
