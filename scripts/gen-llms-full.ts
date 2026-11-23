/**
 * Generates public/llms-full.txt — the site's copy in one file so an AI
 * agent gets everything in a single request (companion to public/llms.txt).
 * Re-run after changing site copy:
 *   node --experimental-strip-types scripts/gen-llms-full.ts
 * Run from the repo root (reads public/llms.txt for the page list).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { site } from "../src/config/site.ts";
import { services } from "../src/content/services.ts";
import { homeFaqs } from "../src/content/faq.ts";

const today = new Date().toISOString().slice(0, 10);
// Page list has one source of truth: llms.txt.
const pages = readFileSync("public/llms.txt", "utf8")
  .split("## Pages")[1]
  ?.trim();

const out: string[] = [
  `# ${site.name} — full site content`,
  "",
  `> ${site.description}`,
  "",
  `Generated ${today} from this site's own content files (scripts/gen-llms-full.ts). Honesty note: ${site.name} started in 2026 and has no client projects to show yet — we offer a free audit instead of pretending to have case studies. We never guarantee rankings; nobody can honestly promise those.`,
  "",
  "## Who we are",
  "",
  `We are a young digital marketing and web agency based in ${site.location}. We build websites, do SEO (including AEO and GEO, so AI assistants can understand and quote your content), run Google Ads and Meta Ads, make small browser games, and teach what we learn for free.`,
  "",
  "## Services",
];

for (const s of services) {
  out.push("", `### ${s.name} — /services/${s.slug}`, "", s.summary, "");
  out.push("**What is included:**");
  for (const x of s.whatIsIncluded) out.push(`- ${x}`);
  out.push("", "**Who it is for:**");
  for (const x of s.whoItIsFor) out.push(`- ${x}`);
  out.push("", "**How we work:**");
  s.process.forEach((x, i) => out.push(`${i + 1}. ${x}`));
  out.push("", s.localCopy, "", "**FAQ:**");
  for (const f of s.faqs) out.push(`- **${f.question}** ${f.answer}`);
}

out.push("", "## Common questions (home page)");
for (const f of homeFaqs) out.push(`- **${f.question}** ${f.answer}`);

out.push("", "## Contact", "", "Use the form at /contact.");

if (pages) out.push("", "## Pages", "", pages);

writeFileSync("public/llms-full.txt", out.join("\n") + "\n");
console.log(`public/llms-full.txt written (${out.join("\n").length} chars)`);
