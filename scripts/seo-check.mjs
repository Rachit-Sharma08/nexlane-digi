#!/usr/bin/env node
/**
 * On-page SEO checker (AGENTS §12) — no dependencies, Node 18+ (global fetch).
 *
 * Usage:
 *   node scripts/seo-check.mjs [baseUrl] [--mode=noindex|index]
 *
 *   --mode=noindex (default) asserts every page carries noindex (the launch-off
 *   state, NEXT_PUBLIC_ALLOW_INDEXING != "true") and robots.txt disallows all.
 *   --mode=index   asserts pages are indexable and robots.txt allows + lists
 *   the sitemap (the state after the owner flips the switch).
 *
 * Exit code 0 = all checks pass, 1 = at least one FAIL.
 */

const base = (process.argv.find((a) => /^https?:\/\//.test(a)) ?? "http://localhost:3000").replace(/\/$/, "");
const mode = (process.argv.find((a) => a.startsWith("--mode=")) ?? "--mode=noindex").split("=")[1];

const ROUTES = [
  "/",
  "/about",
  "/about/founders",
  "/about/team",
  "/services",
  "/services/web-development",
  "/services/seo",
  "/services/digital-marketing",
  "/services/game-development",
  "/learn",
  "/learn/youtube",
  "/learn/blog",
  "/learn/resources",
  "/our-work",
  "/audit",
  "/contact",
  "/terms",
  "/privacy",
  "/thank-you", // always noindex
];

const SCHEMA_FORBIDDEN_TYPES = ["Review", "AggregateRating"];
const SCHEMA_FORBIDDEN_KEYS = ["telephone", "streetAddress", "email", "priceRange"];

let failures = 0;
const pass = (m) => console.log(`  PASS  ${m}`);
const fail = (m) => {
  failures++;
  console.log(`  FAIL  ${m}`);
};
const section = (t) => console.log(`\n== ${t} ==`);

const attr = (html, re) => (html.match(re)?.[1] ?? "").trim();
const unescapeHtml = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function get(path) {
  const res = await fetch(base + path, { redirect: "manual" });
  const body = res.status >= 300 && res.status < 400 ? "" : await res.text();
  return { res, body };
}

const titles = new Map();
const descs = new Map();
const internalLinks = new Set();

console.log(`seo-check → ${base}  (mode=${mode})`);

/* ---------- per-page checks ---------- */
section(`Pages (${ROUTES.length}) — title/description/robots/OG/h1/JSON-LD`);
for (const route of ROUTES) {
  const { res, body } = await get(route);
  if (res.status !== 200) {
    fail(`${route} → HTTP ${res.status}`);
    continue;
  }
  const label = route === "/" ? "/" : route;

  // title (decoded, tag text only)
  const title = unescapeHtml(attr(body, /<title[^>]*>([^<]*)<\/title>/));
  if (!title) fail(`${label} → missing <title>`);
  else {
    if (title.length > 60) fail(`${label} → title ${title.length} > 60: "${title}"`);
    else pass(`${label} → title ${title.length}c: "${title}"`);
    if (titles.has(title)) fail(`${label} → duplicate title (also ${titles.get(title)})`);
    titles.set(title, label);
  }

  // description
  const desc = unescapeHtml(attr(body, /<meta name="description" content="([^"]*)"/));
  if (!desc) fail(`${label} → missing meta description`);
  else {
    if (desc.length > 160) fail(`${label} → description ${desc.length} > 160`);
    else pass(`${label} → description ${desc.length}c`);
    if (descs.has(desc)) fail(`${label} → duplicate description (also ${descs.get(desc)})`);
    descs.set(desc, label);
  }

  // robots meta vs expected mode
  const robots = attr(body, /<meta name="robots" content="([^"]*)"/).toLowerCase();
  const isNoindex = robots.includes("noindex");
  if (route === "/thank-you" || route === "/nonexistent-page-for-check") {
    if (!isNoindex) fail(`${label} → must always be noindex (got "${robots || "none"}")`);
    else pass(`${label} → always noindex`);
  } else if (mode === "noindex" && !isNoindex) {
    fail(`${label} → expected noindex, got "${robots || "none"}"`);
  } else if (mode === "index" && isNoindex) {
    fail(`${label} → expected indexable, got "${robots}"`);
  } else {
    pass(`${label} → robots "${robots || "(none = indexable)"}"`);
  }

  // canonical
  const canonical = attr(body, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) fail(`${label} → missing canonical`);
  else if (!canonical.startsWith(base)) fail(`${label} → canonical not on site: ${canonical}`);
  else pass(`${label} → canonical ok`);

  // OG / twitter
  if (!attr(body, /<meta property="og:image" content="([^"]*)"/)) fail(`${label} → missing og:image`);
  if (!attr(body, /<meta property="og:title" content="([^"]*)"/)) fail(`${label} → missing og:title`);
  if (!attr(body, /<meta name="twitter:card" content="([^"]*)"/)) fail(`${label} → missing twitter:card`);
  if (attr(body, /<meta property="og:image" content="([^"]*)"/)) pass(`${label} → OG + twitter tags present`);

  // exactly one h1
  const h1s = body.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(`${label} → ${h1s.length} <h1> (need exactly 1)`);
  else pass(`${label} → single <h1>`);

  // language
  if (!/<html[^>]*\slang="en-IN"/.test(body)) fail(`${label} → <html> missing lang="en-IN"`);

  // JSON-LD: parse every block, enforce honesty rules
  const blocks = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) fail(`${label} → no JSON-LD`);
  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(`${label} → JSON-LD does not parse: ${e.message}`);
      continue;
    }
    const types = [data["@type"], ...(Array.isArray(data["@graph"]) ? data["@graph"].map((n) => n["@type"]) : [])].filter(Boolean);
    for (const t of SCHEMA_FORBIDDEN_TYPES) if (types.includes(t)) fail(`${label} → forbidden schema type ${t}`);
    const json = JSON.stringify(data);
    for (const k of SCHEMA_FORBIDDEN_KEYS) if (json.includes(`"${k}"`)) fail(`${label} → schema contains forbidden key ${k}`);
    if (json.includes("mailto:")) fail(`${label} → schema contains a mailto: link`);
  }
  if (blocks.length) pass(`${label} → ${blocks.length} JSON-LD block(s) parsed, no forbidden types/keys`);

  // collect internal links for the crawl check
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (!m[1].startsWith("/_next") && !m[1].includes(".")) internalLinks.add(m[1]);
  }
}

/* ---------- 404 page ---------- */
section("404 page");
{
  const { res, body } = await get("/nonexistent-page-for-check");
  if (res.status !== 404) fail(`unknown route → HTTP ${res.status} (expected 404)`);
  else pass("unknown route → 404");
  const robots = attr(body, /<meta name="robots" content="([^"]*)"/).toLowerCase();
  if (!robots.includes("noindex")) fail(`404 page not noindex (got "${robots || "none"}")`);
  else pass("404 page → noindex");
}

/* ---------- robots.txt ---------- */
section("robots.txt");
{
  const { res, body } = await get("/robots.txt");
  if (res.status !== 200) fail(`robots.txt → HTTP ${res.status}`);
  else if (mode === "noindex" && !/^Disallow: \/$/m.test(body)) fail(`robots.txt → expected "Disallow: /", got:\n${body}`);
  else if (mode === "index") {
    if (!/^Allow: \/$/m.test(body)) fail('robots.txt → expected "Allow: /"');
    if (!/^sitemap:/im.test(body)) fail("robots.txt → missing sitemap line");
    if (body.match(/^Allow/m)) pass("robots.txt → allows all + sitemap");
  } else pass('robots.txt → "Disallow: /" (switch off)');
}

/* ---------- sitemap.xml ---------- */
section("sitemap.xml");
{
  const { res, body } = await get("/sitemap.xml");
  if (res.status !== 200) fail(`sitemap.xml → HTTP ${res.status}`);
  else {
    const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length < 15) fail(`sitemap.xml → only ${urls.length} URLs`);
    else pass(`sitemap.xml → ${urls.length} URLs`);
    if (urls.some((u) => u.includes("/thank-you"))) fail("sitemap.xml → contains /thank-you");
    else pass("sitemap.xml → no /thank-you");
    if (!urls.some((u) => u.endsWith("/services/digital-marketing"))) fail("sitemap.xml → missing /services/digital-marketing");
    else pass("sitemap.xml → digital-marketing present");
    if (urls.some((u) => u.includes("/portfolio"))) fail("sitemap.xml → contains old /portfolio");
    for (const need of ["/", "/services/seo", "/about/founders", "/audit"]) {
      if (!urls.some((u) => u.endsWith(need))) fail(`sitemap.xml → missing ${need}`);
    }
  }
}

/* ---------- llms.txt ---------- */
section("llms.txt");
{
  const { res, body } = await get("/llms.txt");
  if (res.status !== 200) fail(`llms.txt → HTTP ${res.status}`);
  else {
    if (/[6-9]\d{9}/.test(body)) fail("llms.txt → contains a phone-like number");
    else pass("llms.txt → no phone numbers");
    if (/tagore/i.test(body)) fail("llms.txt → mentions Tagore");
    if (!/Kaithal/.test(body)) fail("llms.txt → missing location");
    else pass("llms.txt → honest facts present (location, no client work yet)");
    if (!/no client projects/i.test(body)) fail("llms.txt → missing the honest 'no client work' note");
    else pass("llms.txt → new-agency honesty note present");
  }
}

/* ---------- og:image endpoint ---------- */
section("opengraph-image");
{
  const { res } = await get("/opengraph-image");
  if (res.status !== 200) fail(`opengraph-image → HTTP ${res.status}`);
  else {
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("image")) fail(`opengraph-image → content-type ${ct}`);
    else pass(`opengraph-image → ${ct}`);
  }
}

/* ---------- internal links resolve ---------- */
section(`Internal links (${internalLinks.size} unique)`);
{
  let bad = 0;
  for (const link of [...internalLinks].sort()) {
    const res = await fetch(base + link, { redirect: "manual" });
    if (res.status >= 400) {
      bad++;
      fail(`${link} → HTTP ${res.status}`);
    }
  }
  if (!bad) pass(`all internal links resolve (2xx/3xx)`);
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`} (mode=${mode})`);
process.exit(failures === 0 ? 0 : 1);
