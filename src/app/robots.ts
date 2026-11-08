import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/seo";

/**
 * AGENTS §12.5: until NEXT_PUBLIC_ALLOW_INDEXING=true, robots.txt disallows
 * everything so the temporary Vercel URL is never indexed. The switch is a
 * build-time env — flipping it means rebuilding/redeploying.
 *
 * AEO/GEO (agent-readiness): when indexing is on, the AI *search/answer*
 * bots are named explicitly and allowed — blocking OAI-SearchBot,
 * PerplexityBot or Claude-SearchBot costs citations in AI answers. Training
 * crawlers (GPTBot, ClaudeBot, CCBot…) are covered by the "*" rule and are
 * also allowed on purpose: this is public marketing copy, and opting out is
 * one line here if the owner ever wants it.
 */
const AI_ANSWER_BOTS = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT live browsing
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity live answers
  "Claude-SearchBot", // Claude search
  "Google-Extended", // Gemini app grounding (allowed deliberately)
  "cohere-ai",
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? {
        rules: [
          { userAgent: AI_ANSWER_BOTS, allow: "/" },
          { userAgent: "*", allow: "/" },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
      }
    : {
        rules: [{ userAgent: "*", disallow: "/" }],
      };
}
