import { config } from "dotenv";
// Load local env the same way Next does (.env.local first, then .env) so a
// local run targets the right host. In CI/Vercel the vars are already present.
config({ path: ".env.local" });
config();

// ---------------------------------------------------------------------------
// IndexNow submitter. Pings the IndexNow API (Bing / Yandex / Seznam, and the
// signal Microsoft Copilot's index consumes) with the site's current URL set
// so freshly published stories get discovered fast instead of waiting for a
// crawl. Run after publishing / deploy: `npm run indexnow`.
//
// URL source is the site's *live* sitemap.xml — the canonical list we already
// hand search engines. That keeps IndexNow perfectly in sync with the sitemap,
// needs no database credentials, and doesn't couple this script to a Node/
// supabase-js version. Requires the key file served at the site root:
// public/<KEY>.txt whose contents are exactly <KEY>. Keep INDEXNOW_KEY below in
// sync with that filename.
// ---------------------------------------------------------------------------

const KEY = process.env.INDEXNOW_KEY ?? "4c4a5efd206c82be6ff7f2c585653fd3";

// Resolve the public origin. Prefer the configured site URL; fall back to the
// known production domain (a localhost value would be rejected by IndexNow).
function resolveOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && !raw.includes("localhost") && !raw.includes("127.0.0.1")) {
    return raw.replace(/\/$/, "");
  }
  return "https://www.medspadaily.com";
}

async function fetchSitemapUrls(origin: string): Promise<string[]> {
  const res = await fetch(`${origin}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(`Could not fetch ${origin}/sitemap.xml (${res.status})`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // Keep only URLs on our own host — IndexNow rejects a mixed-host urlList.
  const host = new URL(origin).host;
  const own = urls.filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
  return [...new Set(own)];
}

async function main() {
  const origin = resolveOrigin();
  const host = new URL(origin).host;

  const urlList = await fetchSitemapUrls(origin);
  if (urlList.length === 0) {
    console.error("IndexNow: sitemap returned 0 usable URLs — aborting.");
    process.exit(1);
  }

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
