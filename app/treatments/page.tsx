import Link from "next/link";
import type { Metadata } from "next";
import { getTreatments } from "@/lib/db/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Calm, evidence-first guides to the treatments medspas offer — what each one is, what to expect, and what the research actually supports.",
  alternates: { canonical: "/treatments" },
};

export default async function TreatmentsPage() {
  const treatments = await getTreatments();
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">Treatments</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Calm, evidence-first guides to the treatments medspas offer — what each one is, what
        to expect, and what the research actually supports.
      </p>
      <section className="mt-8 divide-y divide-line">
        {treatments.map((treatment) => (
          <article key={treatment.id} className="py-8">
            <h2 className="text-2xl leading-snug">
              <Link
                href={`/treatments/${treatment.slug}`}
                className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {treatment.name}
              </Link>
            </h2>
            <p className="mt-2 text-ink-muted">{treatment.summary}</p>
          </article>
        ))}
      </section>
      {treatments.length === 0 && (
        <p className="py-24 text-center text-ink-muted">
          Treatment guides arriving shortly.
        </p>
      )}
    </div>
  );
}
