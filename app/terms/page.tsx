import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms for using MedSpa Daily, including the medical-information disclaimer.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "July 13, 2026";

export default function TermsPage() {
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">Terms &amp; Conditions</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        The plain-language terms for reading and using this site.
      </p>
      <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink-muted">
        Last updated {LAST_UPDATED}
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Using this site
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          By using MedSpa Daily, you agree to these terms. If you do not agree, please do
          not use the site. We may update these terms from time to time; continued use after
          a change means you accept the revised terms.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Not medical advice
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          MedSpa Daily is an editorial publication. Everything we publish is for general
          information and education, and describes evidence — it is not medical advice, a
          diagnosis, or a treatment recommendation, and reading it does not create a
          doctor–patient relationship. Treatments, devices, and medications carry real
          risks. Always consult a qualified, licensed clinician before making any decision
          about your health or a procedure.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Content and intellectual property
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          The articles, design, and other material on this site are owned by {SITE.name} or
          its licensors and are protected by copyright. You may read, link to, and share our
          work for personal, non-commercial use. Please do not republish substantial
          portions without permission. Cited studies and sources remain the property of
          their respective owners.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Links to other sites
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          We link to studies, regulators, and other publications so you can check our
          sources. We do not control those sites and are not responsible for their content,
          accuracy, or privacy practices.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          No warranties
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          We work to be accurate and to correct mistakes promptly, but the site is provided
          &ldquo;as is,&rdquo; without warranties of any kind. To the fullest extent
          permitted by law, {SITE.name} is not liable for any loss arising from your use of,
          or reliance on, anything published here.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Contact
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          Questions about these terms? Write to{" "}
          <a
            href="mailto:hello@medspadaily.com"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            hello@medspadaily.com
          </a>
          .
        </p>
        <p className="mt-8">
          <Link
            href="/privacy"
            className="font-sans text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Read the Privacy Policy
          </Link>
        </p>
      </section>
    </div>
  );
}
