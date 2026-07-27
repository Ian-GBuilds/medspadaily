import Script from "next/script";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

// Google Analytics 4 (gtag.js) with Google Consent Mode v2 + a cookie-consent
// banner (components/CookieConsent.tsx).
//
// Consent is DENIED by default, set before the config call, so GA loads in
// cookieless mode and writes no _ga cookies until the visitor explicitly
// accepts:
//
//   - Default denied + wait_for_update → GA holds its first hit briefly and
//     sends cookieless pings until a consent choice arrives. (Denial is what
//     actually suppresses the _ga cookie in GA4.)
//   - A stored "accepted" choice (localStorage, from a prior visit) is
//     re-applied here BEFORE config, so returning visitors who accepted get
//     their cookies on the very first hit — no flicker.
//   - The banner calls gtag('consent','update', …) on Accept/Reject, and
//     deletes _ga cookies on Reject.
//
// Rendered only in production builds (so local `next dev` never pollutes the
// property) and only when a measurement ID is configured.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});
try {
  if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
