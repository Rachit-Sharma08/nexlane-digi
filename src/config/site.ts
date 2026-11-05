/**
 * ================================================================
 *  NEXLANE DIGITAL — SITE CONFIG (the ONE file to edit)
 * ================================================================
 *  Everything you need to change (brand, contact, team, links)
 *  lives here. Pages read from this file; you should rarely need
 *  to touch individual pages.
 *
 *  Every placeholder is marked with `TODO:` — a full list of TODOs
 *  is kept in .opencode/plan.md and in the final build report.
 */

export const site = {
  name: "Nexlane Digital",
  // TODO: replace with the real domain once bought.
  SITE_URL: process.env.SITE_URL ?? "https://nexlanedigital.vercel.app",
  tagline: "Websites, SEO and growth for local businesses",
  description:
    "Nexlane Digital is a digital marketing and web agency from Kaithal, Haryana — websites, SEO and free learning for small local businesses.",

  // Placeholders — TODO: confirm each before go-live.
  location: "Kaithal, Haryana, India",
  // TODO: confirm the WhatsApp number for business enquiries (shown in buttons/footer).
  whatsappNumber: "918307151186", // in international format without + or spaces
  // TODO: set a real agency email. Empty = link hidden everywhere.
  contactEmail: "",
  instagramUrl: "", // TODO: add
  youtubeUrl: "", // TODO: add

  // Shown on Contact + in email copy: how fast you typically reply. TODO: confirm.
  REPLY_TIME: "24–48 hours",

  // Free audit content (shown on /audit).
  audit: {
    title: "Free Website and Marketing Audit",
    includes:
      "A short written review of your website, Google profile or social media with 3 to 5 practical suggestions you can act on.",
    note: "It is completely free, with no obligation to hire us.",
  },

  // Analytics: "off" | "vercel". Wire-up happens in layout via this flag.
  analytics: (process.env.NEXT_PUBLIC_ANALYTICS as "off" | "vercel") ?? "off",

  // Google Search Console verification (env-driven, empty = no meta tag).
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
} as const;

/** ---------------- TEAM (safe-data rule respected) -----------------
 * Only names, roles, skills and public profile links are shown.
 * NEVER add ages, school/college names, addresses or personal
 * phone numbers to this file or any page. */
export type TeamMember = {
  name: string;
  role: string;
  skills: string[];
  portfolioUrl: string | null;
};

export const team: TeamMember[] = [
  {
    name: "Rachit Sharma",
    role: "Founder",
    skills: ["SEO (incl. AEO/GEO)", "Google Ads", "Meta Ads", "AI tools"],
    portfolioUrl: "https://rachitportfolio-rouge.vercel.app/",
  },
  {
    name: "Krish Khati",
    role: "Founder",
    skills: ["Web development", "Python", "AI tools & chatbots"],
    portfolioUrl: "https://krish-portfolio-dev.vercel.app/",
  },
  {
    name: "Neelam Dhiman",
    role: "Co-founder",
    skills: [
      "Web development (HTML/CSS/JS)",
      "YouTube SEO",
      "Social media",
      "Video editing",
      "Python automation",
    ],
    portfolioUrl: "https://neelamdhiman.vercel.app/",
  },
  {
    name: "Jyoti",
    role: "Co-founder",
    skills: ["Video editing"],
    portfolioUrl: null, // add a link here when a portfolio exists
  },
];

/** Navigation used by Navbar/Footer so adding a page updates both. */
export const nav = {
  main: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ],
  services: {
    label: "Services",
    items: [
      { href: "/services/web-development", label: "Web Development" },
      { href: "/services/seo", label: "SEO" },
      { href: "/services/game-development", label: "Game Development" },
    ],
  },
  learn: {
    label: "Learn",
    items: [
      { href: "/learn/youtube", label: "YouTube Lessons" },
      { href: "/learn/blog", label: "Blog" },
      { href: "/learn/resources", label: "Free Resources" },
    ],
  },
  extra: [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ],
  cta: { href: "/audit", label: "Get a Free Audit" },
};
