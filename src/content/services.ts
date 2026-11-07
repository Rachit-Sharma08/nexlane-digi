/**
 * Services content. All facts come from the team brief — nothing invented.
 * Pricing is intentionally NOT stated: "custom quote after a free chat".
 */

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  /** Full SERP title from docs/seo-content.md (≤60 chars incl. brand). */
  metaTitle: string;
  summary: string; // shown on cards + as the answer-first hero intro on the detail page
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
    metaTitle: "Website Development in Kaithal, Haryana | Nexlane Digital",
    summary:
      "We build fast, mobile-friendly websites for local businesses in Kaithal and across Haryana. You get a written scope before we start, and a site that is easy to find and easy to use.",
    description:
      "Fast, mobile-friendly websites for local businesses in Kaithal and across Haryana, built by Nexlane Digital with a written scope before work starts.",
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
    metaTitle: "SEO Services in Kaithal | Local SEO, AEO & GEO | Nexlane",
    summary:
      "We help local businesses in Kaithal and across Haryana get found on Google and in AI search. That means local SEO, on-page and technical fixes, and content that AI assistants can quote.",
    description:
      "Local SEO, on-page and technical SEO, plus AEO and GEO so AI search can find you. SEO services in Kaithal, Haryana from Nexlane Digital. Free audit first.",
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
    metaTitle: "Browser Game Development | Nexlane Digital",
    summary:
      "We build small browser games for brands, events and learning — playable in the browser with no install. Built by Nexlane Digital in Kaithal, Haryana.",
    description:
      "Small browser games for brands, events and learning, built by Nexlane Digital, a young web and digital agency from Kaithal, Haryana.",
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
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Digital Marketing",
    metaTitle: "Digital Marketing in Kaithal | Google & Meta Ads | Nexlane",
    summary:
      "We run Google Ads, Meta Ads and social media for local businesses in Kaithal and across Haryana, and create YouTube and Instagram content. Every project starts with a free audit.",
    description:
      "Digital marketing for local businesses in Kaithal and Haryana: Google Ads, Meta Ads, social media and YouTube content. Start with a free audit.",
    whatIsIncluded: [
      // TODO(owner): confirm exactly which of these you offer as paid work before launch.
      "Google Ads and Meta Ads campaigns for your business",
      "Social media content planned around what your customers care about",
      "YouTube and Instagram content, including video editing",
      "A free audit first, so we agree what to work on before spending anything",
      "A written scope: what we will run, where, and how we review it",
    ],
    whoItIsFor: [
      "Local businesses that want customers from Google or Meta ads",
      "Shops and clinics that post inconsistently and need steady content",
      "Brands that want YouTube or Instagram content without hiring in-house",
    ],
    process: [
      "Free chat about your goals and who you want to reach",
      "Free audit of your current website, profile and social presence",
      "Written scope: channels, content plan and what we will measure",
      "Launch, then review what actually worked — and adjust",
    ],
    faqs: [
      {
        question: "How much does digital marketing cost?",
        answer:
          "The price depends on the pages, features and goals, so we give a quote after a free chat. We write the scope down before any work starts, so there are no surprises.",
      },
      {
        question: "What do I get from the free audit?",
        answer:
          "A short written review of your website or Google profile with 3 to 5 practical suggestions, free and with no obligation.",
      },
    ],
    localCopy:
      "Around Kaithal, customers search in their own words — nearby shops, phone calls, and Hinglish typed in Roman script. We plan ads and content around what people here actually search for, work in person around Kaithal and remotely across Haryana, and start every project with a free audit.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
