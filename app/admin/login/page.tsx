"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Fire regardless of whether the email is the admin's — never reveal
      // which addresses exist.
      await sendMagicLink(formData);
      setSent(true);
    });
  }

  return (
    <section className="mx-auto max-w-sm py-16">
      <h1 className="font-serif text-2xl tracking-[0.12em] text-ink">Admin</h1>
      <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink-muted">
        Sign in with a magic link
      </p>
      <form
        action={handleSubmit}
        className="mt-8 flex flex-col gap-3"
        aria-label="Request a magic link"
      >
        <label htmlFor="admin-email" className="sr-only">
          Email address
        </label>
        <input
          id="admin-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full border border-line bg-paper px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="border border-ink bg-ink px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] text-paper transition-colors hover:bg-transparent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send magic link"}
        </button>
      </form>
      {sent && (
        <p aria-live="polite" className="mt-4 text-sm text-ink">
          Link sent — check your email.
        </p>
      )}
    </section>
  );
}
