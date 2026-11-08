/**
 * Blog content as typed data files (our chosen authoring format —
 * simpler than MDX for now, and the site renders it without extra deps).
 *
 * Source of truth is blog.json — edit via /admin panel or edit the JSON directly; redeploy to publish.
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

import data from "./blog.json";
export const blogPosts: BlogPost[] = data as BlogPost[];

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