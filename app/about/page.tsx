import type { Metadata } from "next";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { CATEGORY_LABELS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedSpa Daily is an independent editorial publication covering the medical-spa world for patients — calm, sourced reporting, reviewed by a human editor.",
  alternates: { canonical: "/about" },
};

const coverage: { category: keyof typeof CATEGORY_LABELS; description: string }[] = [
  {
    category: "research",
    description:
      "New studies on injectables, devices, and skin science, read against the original paper rather than the press release.",
  },
  {
    category: "treatments",
    description:
      "Plain guides to what a treatment is, what to expect, and what the evidence actually supports.",
  },
  {
    category: "legislation",
    description:
      "The state and federal rules that shape who can offer a treatment, and how.",
  },
  {
    category: "longevity",
    description:
      "Claims about aging and longevity, weighed against what peer-reviewed research can and can't yet say.",
  },
  {
    category: "industry",
    description:
      "How the medspa business itself is changing — openings, closings, pricing, and the people behind it.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">About</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        MedSpa Daily is an independent editorial publication covering the medical-spa world
        for patients.
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          What we cover
        </h2>
        <dl className="mt-5 space-y-5">
          {coverage.map((item) => (
            <div key={item.category}>
              <dt className="text-lg italic">
                {CATEGORY_LABELS[item.category]}
              </dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          How to reach us
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          Questions, tips, or feedback on a story:{" "}
          <a
            href="mailto:hello@medspadaily.com"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            hello@medspadaily.com
          </a>
          .
        </p>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}
