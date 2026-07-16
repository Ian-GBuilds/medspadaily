"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { setConsent, useConsent, type Consent } from "@/lib/consent";

// Calm, non-blocking consent banner. It sits quietly at the foot of the page on
// a visitor's first landing and disappears once they choose. Accept and Reject
// are one click each and equally reachable — no pre-ticked boxes, no dimmed
// "reject".
//
// GA loads cookieless by default (Consent Mode v2, see Analytics.tsx); this
// banner pushes the consent UPDATE that lets it set cookies. Accept grants all
// categories; Reject denies them AND deletes any _ga cookies already written.
// Gated to production + a configured GA ID, matching where GA actually loads.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ENABLED = process.env.NODE_ENV === "production" && !!GA_ID;

/** Push a Consent Mode v2 update onto the GA dataLayer (all categories). */
function applyConsent(value: "granted" | "denied") {
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // Mirror GA's gtag shim exactly: it enqueues the `arguments` object.
  function gtag() {
    (w.dataLayer as unknown[]).push(arguments);
  }
  (gtag as (...args: unknown[]) => void)("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

/*
 * Delete GA's _ga* cookies on rejection/withdrawal. Consent denial stops GA
 * from reading/writing cookies going forward but does NOT remove ones already
 * set, so a visitor who accepted then rejected would keep stale cookies. GA
 * scopes _ga to the registrable domain, which we can't know for sure
 * client-side (multi-label public suffixes like .co.uk break a naive "last two
 * labels" guess), so we expire the cookie against every parent-domain suffix of
 * the current host plus the no-domain (host-only) case.
 */
function clearAnalyticsCookies() {
  const labels = location.hostname.split(".");
  const domains = new Set<string>([""]);
  for (let i = 0; i < labels.length; i++) {
    const suffix = labels.slice(i).join(".");
    domains.add(suffix);
    domains.add("." + suffix);
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie =
        `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/` +
        (domain ? `;domain=${domain}` : "");
    }
  }
}

export default function CookieConsent() {
  const consent = useConsent();
  // Render nothing until mounted so the server HTML never contains the banner —
  // that avoids a flash for returning visitors who already chose.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Defensive sweep: a rejected visitor should never carry _ga cookies, even if
  // one slipped through a prior race or a stale session.
  useEffect(() => {
    if (ENABLED && consent === "rejected") clearAnalyticsCookies();
  }, [consent]);

  const choose = useCallback((value: Consent) => {
    setConsent(value);
    if (value === "accepted") {
      applyConsent("granted");
    } else {
      applyConsent("denied");
      clearAnalyticsCookies();
      // GA can finish an in-flight hit just after denial and re-write _ga;
      // clear again once that has settled (past the wait_for_update window).
      window.setTimeout(clearAnalyticsCookies, 800);
    }
  }, []);

  if (!ENABLED || !mounted || consent !== null) return null;

  const buttonBase =
    "px-4 py-2 font-sans text-xs uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
          We&rsquo;d like to set an analytics cookie to understand which stories
          are read, so we can write better ones. We never use it to advertise or
          track you across the web. Essential cookies are always on.{" "}
          <Link
            href="/privacy"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Privacy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className={`${buttonBase} border border-line text-ink hover:border-ink`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className={`${buttonBase} border border-ink bg-ink text-paper hover:bg-transparent hover:text-ink`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
