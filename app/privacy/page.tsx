import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What MedSpa Daily collects, how it is used, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "July 13, 2026";

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <h1 className="text-4xl leading-tight">Privacy Policy</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        We collect as little as we can, use it only to run this publication, and never
        sell it.
      </p>
      <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink-muted">
        Last updated {LAST_UPDATED}
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          What we collect
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          If you subscribe to our newsletter, we store the email address you give us and a
          record of your confirmation, so we can send the daily email and prove it was
          opt-in. If you do not subscribe, we do not ask for any personal information. Like
          most websites, our hosting provider automatically records standard technical logs
          — such as IP address, browser type, and the pages requested — to serve pages and
          keep the site secure.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          How we use it
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          We use your email only to send the newsletter you asked for. We use technical logs
          only to operate, debug, and secure the site. We do not sell your information, and
          we do not use it for advertising.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Service providers
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          We rely on a small number of vendors to run the site, and your data may pass
          through them solely to provide the service: our hosting and content-delivery
          provider, our database provider, and our email-delivery provider. Each processes
          data on our behalf under its own privacy and security terms.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Cookies
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          The public site uses only essential cookies needed to load pages. Signed-in
          editors use an authentication cookie to stay logged in to the private editorial
          tools. We do not use advertising or cross-site tracking cookies.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Your choices
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          Every newsletter email includes an unsubscribe link, and unsubscribing takes
          effect immediately. You may also ask us to access or delete the information we
          hold about you by writing to{" "}
          <a
            href="mailto:hello@medspadaily.com"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            hello@medspadaily.com
          </a>
          .
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Children
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          MedSpa Daily is intended for adults and is not directed to children under 13. We
          do not knowingly collect information from children.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          Changes
        </h2>
        <p className="mt-5 leading-relaxed text-ink-muted">
          We may update this policy as the publication changes. When we do, we will revise
          the date above. Questions? Reach us at{" "}
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
            href="/terms"
            className="font-sans text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Read the Terms &amp; Conditions
          </Link>
        </p>
      </section>

      <p className="mt-12 border-t border-line pt-6 text-sm leading-relaxed text-ink-muted">
        {SITE.name} is an editorial publication. Its reporting is for general information and
        is not medical advice.
      </p>
    </div>
  );
}
