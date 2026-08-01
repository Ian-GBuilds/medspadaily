import { config } from "dotenv";
// Load local env the same way Next does (.env.local first, then .env), so a
// local run submits real production URLs. In CI/Vercel the vars are already in
// the environment and these no-op.
config({ path: ".env.local" });
config();

import { getPublishedStories, getTreatments } from "../lib/db/queries";
import { CATEGORY_ROUTES } from "../lib/site";

// ---------------------------------------------------------------------------
// IndexNow submitter. Pings the IndexNow API (Bing / Yandex / Seznam, and the
// signal Microsoft Copilot's index consumes) with the site's current URL set
// so freshly published stories get discovered fast instead of waiting for a
// crawl. Run after publishing: `npm run indexnow`.
//
// Requires a key file served at the site root: public/<KEY>.txt whose contents
// are exactly <KEY>. Keep INDEXNOW_KEY below in sync with that filename.
// ---------------------------------------------------------------------------

const KEY = process.env.INDEXNOW_KEY ?? "4c4a5efd206c82be6ff7f2c585653fd3";

// Resolve the public host. Prefer the configured site URL; fall back to the
// known production domain (a localhost value would be rejected by IndexNow).
function resolveOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && !raw.includes("localhost") && !raw.includes("127.0.0.1")) {
    return raw.replace(/\/$/, "");
  }
  return "https://www.medspadaily.com";
}

async function main() {
  const origin = resolveOrigin();
  const host = new URL(origin).host;

  const [stories, treatments] = await Promise.all([
    getPublishedStories(),
    getTreatments(),
  ]);

  const staticPaths = [
    "",
    "/treatments",
    "/about",
    "/about-the-author",
    "/how-we-source",
    "/subscribe",
    "/for-clinics",
    "/corrections",
    "/privacy",
    "/terms",
    ...Object.values(CATEGORY_ROUTES).map((r) => `/${r}`),
  ];

  const urlList = [
    ...staticPaths.map((p) => `${origin}${p}`),
    ...stories.map((s) => `${origin}/stories/${s.slug}`),
    ...treatments.map((t) => `${origin}/treatments/${t.slug}`),
  ];

  const payload = {
    host,
    key: KEY,
    keyLocation: `${origin}/${KEY}.txt`,
    urlList,
  };

  console.log(`IndexNow: submitting ${urlList.length} URLs for ${host}…`);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, pending). 4xx means a key
  // or host mismatch — surface the body so it's debuggable.
  const body = await res.text();
  if (res.ok || res.status === 202) {
    console.log(`IndexNow: OK (${res.status}). ${urlList.length} URLs submitted.`);
  } else {
    console.error(`IndexNow: FAILED (${res.status}). ${body}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
