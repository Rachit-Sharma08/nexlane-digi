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
  /** Short brand alias used in schema.org alternateName (AGENTS §12.6). */
  alternateName: "Nexlane",
  // TODO: replace with the real domain once bought.
  SITE_URL: process.env.SITE_URL ?? "https://nexlanedigital.vercel.app",
  tagline: "Websites, SEO and growth for local businesses",
  description:
    "Nexlane Digital is a digital marketing and web agency from Kaithal, Haryana — websites, SEO and free learning for small local businesses.",

  // Placeholders — TODO: confirm each before go-live.
  location: "Kaithal, Haryana, India",
  /**
   * WhatsApp number for business enquiries — MUST come from the
   * NEXT_PUBLIC_WHATSAPP_NUMBER env var (personal numbers are never
   * hardcoded in source). Empty/unset = WhatsApp buttons and wa.me links
   * are not rendered at all (contact page shows form + email + socials).
   * Format: country code + digits only, no + or spaces.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
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
 * Only names, titles, skills, bios and public profile links are shown.
 * NEVER add ages, school/college names, addresses or personal
 * phone numbers to this file or any page. */
export type TeamGroup = "founders" | "team";

export type PersonalProject = {
  title: string;
  url: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  group: TeamGroup;
  /** Left-to-right order inside the group; change it here, not in a page. */
  order: number;
  title: string;
  skills: string[];
  bio: string;
  // Owner confirmed portfolio linking permission on 2026-11-06.
  portfolioUrl?: string | null;
  personalProjects: PersonalProject[];
  // Optional: add a square image to public/team/<slug>.webp (800x800, <150 KB),
  // then set this to /team/<slug>.webp. Initials tile is used until then.
  photo?: string;
};

export const teamGroups: { id: TeamGroup; label: string; path: string }[] = [
  { id: "founders", label: "Founders", path: "/about/founders" },
  { id: "team", label: "Team", path: "/about/team" },
];

export const team: TeamMember[] = [
  {
    slug: "rachit",
    name: "Rachit Sharma",
    group: "founders",
    order: 1,
    title: "Founder · SEO and Growth",
    skills: ["SEO", "AEO/GEO", "Google Ads", "Meta Ads", "AI tools"],
    bio: "Digital marketer focused on SEO (including AEO/GEO), Google Ads and Meta Ads, using AI tools to move faster.",
    portfolioUrl: "https://rachitportfolio-rouge.vercel.app/",
    photo: "/team/rachit.webp",
    personalProjects: [
      { title: "Fitness Website", url: "https://github.com/Rachit-Sharma08/Fitness-website" },
      { title: "Neon Car Racing", url: "https://github.com/Rachit-Sharma08/neon-car-racing-game-" },
      { title: "AI Assistant Chatbot", url: "https://github.com/Rachit-Sharma08/ai-assistant" },
    ],
  },
  {
    slug: "krish",
    name: "Krish Khati",
    group: "founders",
    order: 2,
    title: "Founder · Web Development and AI",
    skills: ["Web development", "Python", "AI tools", "Supabase", "Automation"],
    bio: "Builds web apps and AI-powered tools with Python and modern AI APIs.",
    portfolioUrl: "https://krish-portfolio-dev.vercel.app/",
    photo: "/team/krish.webp",
    personalProjects: [
      { title: "Fitness Temple", url: "https://krish-portfolio-dev.vercel.app/projects/fitness-temple" },
      { title: "LinguaBridge", url: "https://krish-portfolio-dev.vercel.app/projects/linguabridge" },
      { title: "Memory Match Game", url: "https://krish-portfolio-dev.vercel.app/projects/memory-match-game" },
    ],
  },
  {
    slug: "neelam",
    name: "Neelam Dhiman",
    group: "team",
    order: 2,
    title: "Team Member · Websites, Social and Video",
    skills: [
      "HTML/CSS/JavaScript",
      "YouTube SEO",
      "Social media",
      "Video editing",
      "Python automation",
    ],
    bio: "Builds responsive websites and small automation tools, and helps with YouTube SEO, social media and video.",
    portfolioUrl: "https://neelamdhiman.vercel.app/",
    personalProjects: [
      { title: "Calc Notebook", url: "https://calcnotebook.vercel.app" },
      { title: "Socratic Math Mentor", url: "https://socratic-math-mentor.vercel.app" },
      { title: "Rasoi Mitra", url: "https://rasoi-mitra-recipe.onrender.com/" },
    ],
  },
  {
    slug: "jyoti",
    name: "Jyoti",
    group: "team",
    order: 1,
    title: "Team Member · Video Editor",
    skills: ["Video editing"],
    bio: "Edits the videos for Nexlane's YouTube and Instagram.",
    portfolioUrl: null, // no personal portfolio — do not invent one
    personalProjects: [],
  },
];

/** Navigation used by Navbar/Footer so adding a page updates both. */
export const nav = {
  main: [
    { href: "/", label: "Home" },
  ],
  about: {
    label: "About",
    // Group labels come from teamGroups so renaming a group updates the menu too.
    items: [
      { href: "/about", label: "Our story" },
      ...teamGroups.map((g) => ({ href: g.path, label: g.label })),
    ],
  },
  services: {
    label: "Services",
    items: [
      { href: "/services/digital-marketing", label: "Digital Marketing" },
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
    { href: "/our-work", label: "Our Work" },
    { href: "/contact", label: "Contact" },
  ],
  cta: { href: "/audit", label: "Get a Free Audit" },
};
