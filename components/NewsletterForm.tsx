"use client";

import { useActionState, useEffect } from "react";
import { subscribeAction, type SubscribeState } from "@/app/newsletter-actions";
import { trackEvent } from "@/lib/analytics";

export default function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [state, formAction, pending] = useActionState<SubscribeState, FormData>(
    subscribeAction,
    null,
  );

  // Report a conversion once the double-opt-in email has been sent successfully.
  useEffect(() => {
    if (state?.ok) trackEvent("newsletter_signup", { source });
  }, [state, source]);

  return (
    <form
      action={formAction}
      className="mt-4 flex flex-col gap-2"
      aria-label="Subscribe to the daily edition"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        className="w-full border border-line bg-paper px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="border border-ink bg-ink px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] text-paper transition-colors hover:bg-transparent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </button>
      {state && (
        <p
          aria-live="polite"
          className={`text-sm ${state.ok ? "text-ink" : "text-ink-muted"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
