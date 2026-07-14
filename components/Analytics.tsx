import Script from "next/script";

// Google Analytics 4 (gtag.js). Gated on NEXT_PUBLIC_GA_ID: with no ID set the
// component renders nothing, so the site ships analytics-ready but inert until a
// measurement ID (G-XXXXXXXXXX) is provided via env. Set it in .env.local for
// local testing and in the Vercel project env for production.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
