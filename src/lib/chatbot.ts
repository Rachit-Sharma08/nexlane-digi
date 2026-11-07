/**
 * Local chatbot knowledge base — Phase 1 (no backend, no API, no data leaves
 * the browser). Every answer comes from real site content or honest general
 * digital-marketing education: no guarantees, no invented numbers, no fake stats.
 *
 * Phase 2: `askBot` will POST the message to /api/chat (Grok API) and fall
 * back to `answerLocal` if the API fails. Keep this signature when wiring it up.
 */

import { site } from "@/config/site";
import { services } from "@/content/services";
import { homeFaqs } from "@/content/faq";

export type ChatMessage = { role: "user" | "bot"; text: string };

type Entry = { keys: string[]; answer: string };

const contactLines = [
  site.whatsappNumber ? `WhatsApp: https://wa.me/${site.whatsappNumber}` : "",
  site.contactEmail ? `Email: ${site.contactEmail}` : "",
  site.instagramUrl ? `Instagram: ${site.instagramUrl}` : "",
  site.youtubeUrl ? `YouTube: ${site.youtubeUrl}` : "",
].filter(Boolean);

const contactAnswer =
  contactLines.length > 0
    ? `Easiest ways to reach us:\n${contactLines.join("\n")}\nOr use the form on /contact — we usually reply within ${site.REPLY_TIME}.`
    : `Use the contact form at /contact — we usually reply within ${site.REPLY_TIME}.`;

const pricingFaq =
  homeFaqs.find((f) => f.question.includes("price"))?.answer ??
  "Every project gets a custom quote after a free chat, once we agree on the scope.";
const startFaq =
  homeFaqs.find((f) => f.question.includes("How do I start"))?.answer ??
  "Send us your details through the contact form and we'll take it from there.";
const trustFaq =
  homeFaqs.find((f) => f.question.includes("trust"))?.answer ??
  "We show only real work and start with a free audit so you can judge the quality before paying anything.";

const kb: Entry[] = [
  {
    keys: ["hi", "hello", "hey", "namaste", "yo"],
    answer: `Hi! I'm the ${site.name} helper — a preview bot with answers taken straight from this site. Ask me about our services, pricing, SEO, or how to start.`,
  },
  {
    keys: ["what do you do", "services", "service", "kaam karte", "help my business", "offer"],
    answer: `We do three things:\n${services
      .map((s) => `• ${s.shortName} — ${s.summary}`)
      .join("\n")}\nDetails: /services`,
  },
  {
    keys: ["website", "web development", "web design", "site banwana", "landing page"],
    answer: `${services[0].summary}\nDetails: /services/web-development`,
  },
  {
    keys: ["seo", "search engine", "rank", "ranking", "google par", "google me"],
    answer: `${services[1].summary}\nDetails: /services/seo`,
  },
  {
    keys: ["game", "browser game", "game development"],
    answer: `${services[2].summary}\nDetails: /services/game-development`,
  },
  {
    keys: ["price", "pricing", "cost", "charge", "kitne ka", "budget", "package"],
    answer: pricingFaq,
  },
  {
    keys: ["how do i start", "how to start", "start", "begin", "hire", "get started", "work with you"],
    answer: `${startFaq}\nYou can start right now: /audit`,
  },
  {
    keys: ["audit", "free audit", "website check"],
    answer:
      "We check your website (speed, mobile, SEO basics) and tell you what to fix — free, no obligation. Fill the short form at /audit.",
  },
  {
    keys: ["contact", "whatsapp", "call", "phone", "email", "number", "reach you", "baat karni"],
    answer: contactAnswer,
  },
  {
    keys: ["where are you", "location", "kaithal", "address", "city", "haryana"],
    answer: `We're based in ${site.location} and work with clients remotely as well. ${contactAnswer}`,
  },
  {
    keys: ["what is seo", "seo kya", "explain seo", "seo meaning"],
    answer:
      "SEO = Search Engine Optimization. It means improving your website so it appears higher in Google's free (organic) results. In practice that's: clear pages that answer real questions, a fast mobile-friendly site, honest content, and a Google Business Profile so you show up in local searches. That's exactly what we do — see /services/seo.",
  },
  {
    keys: ["local seo", "google business profile", "google maps", "gmb", "my shop in search"],
    answer: `${services[1].localCopy}\nMore: /services/seo`,
  },
  {
    keys: ["how long seo", "seo take", "ranking time", "kitne din", "results kab"],
    answer:
      "Honestly: it takes consistent work over months, not days. We won't promise #1 rankings or a fixed date — anyone who does is guessing. What we do agree: measurable steps, a written scope, and showing you what changed as we go.",
  },
  {
    keys: ["seo vs ads", "ads vs seo", "google ads", "meta ads", "paid ads", "should i run ads"],
    answer:
      "Ads bring traffic the day you pay and stop the day you stop. SEO builds a base you keep. For a small budget, a sensible order is: a clear fast website + Google Business Profile first, then small targeted ads while SEO grows. We set both up — see /services/seo.",
  },
  {
    keys: ["digital marketing", "digital marketing kya", "online marketing", "marketing kya"],
    answer:
      "Digital marketing = being visible where people already look: your website, Google search (SEO), local listings, ads, and social content. We do it for clients — and we teach it for free on YouTube and Instagram: /learn",
  },
  {
    keys: ["instagram", "youtube", "social media", "followers", "reels", "content"],
    answer:
      "We share free lessons on growing profiles, content and reach on YouTube and Instagram. Start at /learn — no sign-up needed.",
  },
  {
    keys: ["not showing", "website not", "index", "search console", "sitemap"],
    answer:
      "First checklist: is the site in Google Search Console with a sitemap, is it mobile-friendly and fast, and does each page have a clear title? Most 'why am I not on Google' cases start there. If you want, send us the site via /audit and we'll look properly.",
  },
  {
    keys: ["blog", "articles", "learn", "resources", "free"],
    answer: `Free learning is a big part of ${site.name}: lessons on /learn — YouTube at /learn/youtube, articles at /learn/blog, and downloadable guides at /learn/resources.`,
  },
  {
    keys: ["about", "team", "who are you", "who is nexlane", "founders"],
    answer:
      `We're a small student-run studio in ${site.location} — direct, exact, easy to reach. Meet us: /about`,
  },
  {
    keys: ["trust", "experience", "clients", "portfolio", "our work", "reviews", "testimonials"],
    answer: `${trustFaq}\nWe show exactly what exists so far at /our-work — no fake logos or reviews.`,
  },
];

const fallback = {
  answer: `I'm still a preview bot, so I only know what's on this site — the real AI brain arrives soon.\n${contactAnswer}\nTry asking me about: pricing, SEO, websites, or how to start.`,
};

function normalize(text: string): { lower: string; words: Set<string> } {
  const lower = text.toLowerCase();
  const words = new Set(lower.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean));
  return { lower, words };
}

/** Best-scoring entry: multi-word keys are phrases (weight 2), single words must match a token. */
function answerLocal(message: string): string {
  const { lower, words } = normalize(message);
  let best: Entry | undefined;
  let bestScore = 0;
  for (const entry of kb) {
    let score = 0;
    for (const key of entry.keys) {
      if (key.includes(" ")) {
        if (lower.includes(key)) score += 2;
      } else if (words.has(key)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return best?.answer ?? fallback.answer;
}

export function suggestQuestions(): string[] {
  return ["What do you do?", "How much does it cost?", "Do SEO in Kaithal?", "How do I start?"];
}

export async function askBot(message: string): Promise<string> {
  // Phase 2: `const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message }) })`
  // then `return (await r.json()).reply` with `answerLocal(message)` as the fallback.
  return answerLocal(message);
}
