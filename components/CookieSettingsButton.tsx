"use client";

import { clearConsent } from "@/lib/consent";

// Lets a visitor reopen the consent banner to change or withdraw their choice.
// Clearing the stored choice makes CookieConsent reappear. Styled to match the
// footer's utility links exactly (pass the footer's link class via `className`).
export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button type="button" onClick={() => clearConsent()} className={className}>
      Cookie choices
    </button>
  );
}
