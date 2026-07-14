// Fire a Google Analytics 4 event via gtag. Safe no-op on the server, or in the
// browser before/when GA is not loaded (e.g. no NEXT_PUBLIC_GA_ID configured), so
// callers can track conversions without guarding every call site.
type GtagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params ?? {});
}
