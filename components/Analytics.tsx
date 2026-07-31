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
      {/* lazyOnload keeps the 167KB gtag fetch out of the early network
          window where it was competing with the LCP hero image. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
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
