import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import WebVitals from "@/components/WebVitals";
import { SITE } from "@/lib/site";
import "./globals.css";

// display: "optional" skips the fallback→webfont swap when the font misses
// the first paint window — the swap was shifting <time>/meta text and
// contributing to the article template failing CLS (0.149). On repeat visits
// the cached font is used from the start.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "optional",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${workSans.variable}`}>
      <body className="bg-paper text-ink font-serif antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-6">{children}</main>
        <Footer />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
