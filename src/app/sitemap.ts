import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { notDraft } from "@/content/blog";
import { absoluteUrl } from "@/lib/seo";

// All public routes (AGENTS §12.9): /thank-you and /portfolio stay out,
// blog posts join only when they exist and are not drafts.
const paths = [
  "/",
  "/about",
  "/about/founders",
  "/about/team",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/learn",
  "/learn/youtube",
  "/learn/blog",
  ...notDraft().map((p) => `/learn/blog/${p.slug}`),
  "/learn/resources",
  "/our-work",
  "/audit",
  "/contact",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
