import NewsletterForm from "@/components/NewsletterForm";

// End-of-article newsletter prompt. Paid traffic tends to land on a single story,
// so the article itself needs a signup path — the footer alone converts poorly.
export default function InlineNewsletterCTA({ source = "article" }: { source?: string }) {
  return (
    <aside className="mt-12 border border-line border-t-2 border-t-accent bg-paper px-6 py-8">
      <h2 className="font-sans text-xs uppercase tracking-[0.12em] text-ink-muted">
        The Daily
      </h2>
      <p className="mt-3 max-w-md text-lg leading-snug">
        One considered, sourced story on the medspa world — in your inbox each morning.
      </p>
      <div className="mt-4 max-w-sm">
        <NewsletterForm source={source} />
      </div>
    </aside>
  );
}
