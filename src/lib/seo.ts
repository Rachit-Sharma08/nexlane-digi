import type { Metadata } from "next";
import { site } from "@/config/site";

/** Full canonical URL for a path ("/about" → https://…/about). */
export const absoluteUrl = (path: string) => new URL(path, site.SITE_URL).toString();

/**
 * AGENTS §12.5 indexing switch: the site must NOT be indexed under a temporary
 * URL. Anything but "true" = noindex everywhere (robots.ts disallows all too).
 * Owner flips it at launch; it is a build-time env, so flipping requires a rebuild.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/**
 * Next.js Metadata helper — unique title/description/canonical/OG per page.
 * Every page must call this with its own title + description (SEO rule).
 * `title` may be the full SERP title (docs/seo-content.md) or just the page
 * part — the brand is appended only when it is missing, so nothing doubles up.
 * og:image comes from the app/opengraph-image.tsx file convention (no explicit
 * images here, or they would override it with a broken placeholder).
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const title = opts.title.includes(site.alternateName)
    ? opts.title
    : `${opts.title} | ${site.name}`;
  return {
    title: { absolute: title },
    description: opts.description,
    alternates: { canonical: url },
    ...(allowIndexing ? {} : { robots: { index: false, follow: false } as const }),
    openGraph: {
      title,
      description: opts.description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title, description: opts.description },
  };
}

/* ================= JSON-LD builders ================= */

const orgContext = {
  "@context": "https://schema.org",
};

/** Organization (ProfessionalService) — no street address exists, so none is invented. */
export function organizationSchema() {
  // sameAs: social profiles only — never mailto: (AGENTS §12.6).
  const sameAs = [site.instagramUrl, site.youtubeUrl].filter(Boolean);
  return {
    ...orgContext,
    "@type": "ProfessionalService",
    name: site.name,
    alternateName: site.alternateName,
    url: site.SITE_URL,
    logo: absoluteUrl("/nexlane-logo.png"),
    description: site.description,
    foundingDate: "2026",
    slogan: site.tagline,
    areaServed: [
      { "@type": "City", name: "Kaithal" },
      { "@type": "AdministrativeArea", name: "Haryana" },
      { "@type": "Country", name: "India" },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.alternateName,
    url: site.SITE_URL,
    description: site.description,
    inLanguage: "en-IN",
  };
}

/** Person schema for founders (AGENTS §12.7) — name, jobTitle, worksFor, url. */
export function personSchema(m: {
  name: string;
  jobTitle: string;
  /** portfolioUrl when the person has one, else their profile page. */
  url: string;
}) {
  return {
    ...orgContext,
    "@type": "Person",
    name: m.name,
    jobTitle: m.jobTitle,
    worksFor: { "@type": "ProfessionalService", name: site.name, url: site.SITE_URL },
    url: m.url.startsWith("http") ? m.url : absoluteUrl(m.url),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    ...orgContext,
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.SITE_URL,
      areaServed: [
        { "@type": "City", name: "Kaithal" },
        { "@type": "AdministrativeArea", name: "Haryana" },
      ],
    },
    url: absoluteUrl(opts.path),
    offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceSpecification: { "@type": "PriceSpecification", description: "Custom quote after a free chat" } },
  };
}

export function articleSchema(post: { slug: string; title: string; description: string; authorName: string; datePublished: string; dateModified?: string }) {
  return {
    ...orgContext,
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.authorName },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    url: absoluteUrl(`/learn/blog/${post.slug}`),
    articleSection: "Digital marketing with AI",
  };
}
