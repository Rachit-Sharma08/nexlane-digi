/**
 * Blog content as typed data files (our chosen authoring format —
 * simpler than MDX for now, and the site renders it without extra deps).
 *
 * To publish a post: add an entry, set draft: false, with real content.
 * Rachit will write the actual posts; the sample below is clearly a DRAFT.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO date
  author: string; // team member's name (only ones shown on team page)
  draft: boolean;
  content: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sample-draft-post",
    title: "DRAFT — How a Kaithal shop can get found on Google Maps",
    description:
      "A draft sample post to show the blog structure. Replace with real posts before publishing.",
    category: "Local SEO",
    date: "2026-11-01",
    author: "Rachit Sharma",
    draft: true, // this post is NOT publicly listed while draft
    content: [
      { type: "p", text: "This is a sample draft post. It exists so the blog layout, categories, reading time and author fields can be reviewed before any real post is published." },
      { type: "h", text: "What this post will cover" },
      { type: "list", items: ["Claiming the Google Business Profile", "Categories and services on the profile", "Photos: what customers actually want to see before walking in"] },
      { type: "quote", text: "Draft only — do not promote or link this post anywhere until it is replaced with a real article." },
    ],
  },
];

export function notDraft(): BlogPost[] {
  return blogPosts.filter((p) => !p.draft);
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Simple reading time: ~200 wpm over visible text. */
export function readingTime(post: BlogPost): string {
  const words = post.content
    .map((b) => {
      if (b.type === "p" || b.type === "h" || b.type === "quote") return b.text;
      return b.items.join(" ");
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
