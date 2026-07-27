"use client";

import { useSyncExternalStore } from "react";

// First-party cookie/analytics consent, driving Google Consent Mode v2. The
// stored flag itself is strictly-necessary (it records the visitor's own
// choice), so it lives in localStorage and needs no consent to set. GA4 loads
// on every page but starts with analytics_storage 'denied' (cookieless); it
// writes _ga cookies only after the visitor accepts, and dropping to "rejected"
// deletes them — see components/Analytics.tsx and components/CookieConsent.tsx.

export type Consent = "accepted" | "rejected";

// Exported so the GA init script (components/Analytics.tsx) can restore a prior
// "accepted" choice before gtag config, on the very first hit.
export const CONSENT_STORAGE_KEY = "msd-cookie-consent";
const EVENT = "msd:consentchange";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Private-mode / storage-disabled: choice can't persist, but honor it for
    // this page load by still notifying subscribers below.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Clear the recorded choice so the banner reappears (consent withdrawal). */
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // no-op
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // cross-tab sync
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Reactive consent value. `null` on the server and until the visitor chooses. */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}
