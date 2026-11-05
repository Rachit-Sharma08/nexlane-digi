/**
 * Services content. All facts come from the team brief — nothing invented.
 * Pricing is intentionally NOT stated: "custom quote after a free chat".
 */

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  summary: string; // shown on cards
  description: string; // meta description + Service schema
  whatIsIncluded: string[];
  whoItIsFor: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
  localCopy: string; // short local-SEO paragraph (Kaithal & nearby)
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    shortName: "Web Development",
    summary:
      "Fast, mobile-first websites for local businesses — from a simple business site to custom tools, built and maintained by us.",
    description:
      "Mobile-first websites for local businesses in Kaithal and Haryana: clear pages, fast loading, and easy for customers to use. Built by Nexlane Digital.",
    whatIsIncluded: [
      "Plan first: we map your pages and what each page should achieve",
      "Mobile-first design that loads fast on phones",
      "Clear content structure (services, contact, location)",
      "Basic on-page SEO setup (titles, descriptions, sitemap)",
      "Analytics setup so you can see visitors",
      "How-to walkthrough when it goes live, so you are not stuck",
    ],
    whoItIsFor: [
      "Shops and stores without a website",
      "Coaching and schools that need a simple information site",
      "Gyms, clinics, hotels/PGs that want to look credible in search",
      "Local professionals (advocates, CAs, agents) who need a single trustable page",
    ],
    process: [
      "Free chat about goals and content",
      "Written scope so both sides know exactly what will be built",
      "Build and review together",
      "Launch and support after go-live",
    ],
    faqs: [
      {
        question: "Can you use my existing domain or website?",
        answer:
          "Often yes. Tell us what you already have during the free chat and we will say plainly what is possible and what is not.",
      },
      {
        question: "How much does it cost?",
        answer: "Every project is different, so we quote after a free chat once we know the scope.",
      },
    ],
    localCopy:
      "We work with businesses in Kaithal, nearby districts and across Haryana. If you are a few streets away or a few districts away, the way we work is the same: talk first, plan in writing, then build.",
  },
  {
    slug: "seo",
    name: "SEO",
    shortName: "SEO",
    summary:
      "Practical SEO for local businesses: local SEO, on-page, technical SEO — plus AEO/GEO so AI search tools can also find you.",
    description:
      "Local SEO, on-page and technical SEO for small businesses, including AEO/GEO work so search and AI assistants surface your business. Nexlane Digital, Kaithal.",
    whatIsIncluded: [
      "Local SEO: Google Business Profile setup and improvement guidance",
      "On-page SEO: page structure, titles, meta descriptions, internal links",
      "Technical SEO basics: speed, mobile friendliness, crawlability",
      "AEO/GEO: content structured so AI search assistants can cite you",
      "A plain-language plan: what we will do and in which order",
      "A short written review after every stage — no jargon-heavy reports",
    ],
    whoItIsFor: [
      "Local shops that should appear for nearby searches",
      "Service businesses that depend on calls and walk-ins",
      "Anyone already advertising who wants free traffic to reduce ad cost",
    ],
    process: [
      "Free chat: what customers currently search for",
      "Audit of your website and Google profile",
      "Written plan with priorities",
      "Changes + monthly-ish reviews (agreed together, not forced)",
    ],
    faqs: [
      {
        question: "Will you get me #1 on Google?",
        answer:
          "No one can honestly promise a rank. We aim to make your business easier to find, then measure what actually improves.",
      },
      {
        question: "What is AEO/GEO?",
        answer:
          "Making your content easy for AI assistants (like ChatGPT or Google AI Overviews) to understand and cite — the same habit as good SEO, plus clear structure and facts.",
      },
    ],
    localCopy:
      "Local search in Kaithal behaves differently from national search. We optimise for what people here actually type — nearby areas, phone calls and — in Hinglish — searches in Roman script included.",
  },
  {
    slug: "game-development",
    name: "Game Development",
    shortName: "Game Development",
    summary:
      "Small browser games — for engagement campaigns, learning apps or just fun brand moments. Playable in the browser, no install.",
    description:
      "Small browser games built by Nexlane Digital in Kaithal: simple, fun, brandable games for campaigns, classrooms and events. No app install required.",
    whatIsIncluded: [
      "One simple playable game concept agreed in writing first",
      "Runs in the browser — no app store needed",
      "Your branding (colours, logo, text) baked in",
      "Works on phones",
      "Hosting guidance and a walkthrough",
    ],
    whoItIsFor: [
      "Businesses running contests or festival campaigns",
      "Schools/coaching wanting simple learning games",
      "Anyone who wants a memorable interactive brand moment",
    ],
    process: [
      "Free chat about the idea and who it is for",
      "Agreed scope: one game, features listed",
      "Build + your testing round",
      "Launch + one round of tweaks",
    ],
    faqs: [
      {
        question: "Can you build something like Candy Crush?",
        answer:
          "Honest answer: no — that takes big teams and years. We build small, focused games in the browser: quizzes, race or maze style games, and branded mini-games.",
      },
      {
        question: "Who owns the game?",
        answer:
          "Ownership and handover are agreed in the written scope before we start, so there are no surprises later.",
      },
    ],
    localCopy:
      "Browser games are an easy way to get people in Kaithal engaging with your brand without installing anything — fine for WhatsApp sharing and fair on slow internet.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
