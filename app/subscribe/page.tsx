import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "One considered, sourced story on the medspa world — studies, treatments, legislation, and longevity — in your inbox each morning.",
  alternates: { canonical: "/subscribe" },
};

const promises = [
  "One story a day — never a firehose.",
  "Every claim tied to a tiered source, so you can see the evidence.",
  "Written for patients, not clinicians. No hype, no medical advice.",
];

export default function SubscribePage() {
  return (
    <div className="py-16">
      <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
        The Daily
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl leading-tight">
        The calm, evidence-first read on the medspa world.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-ink-muted">
        Studies, treatments, legislation, and longevity news — one considered story each
        morning, free.
      </p>

      <div className="mt-8 max-w-sm">
        <NewsletterForm source="subscribe" />
      </div>

      <ul className="mt-12 max-w-xl space-y-4 border-t border-line pt-8">
        {promises.map((line) => (
          <li key={line} className="flex gap-3 leading-relaxed text-ink-muted">
            <span aria-hidden className="text-accent">
              —
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-ink-muted">
        We send a confirmation email first, so you are always in control. Unsubscribe anytime
        — every issue has a one-click link.
      </p>
    </div>
  );
}
