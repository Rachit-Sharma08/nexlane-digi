import type { Metadata } from "next";
import { site } from "@/config/site";

/** Full canonical URL for a path ("/about" → https://…/about). */
export const absoluteUrl = (path: string) => new URL(path, site.SITE_URL).toString();

const DEFAULT_OG = "/brand/og-placeholder.png"; // TODO: replace with a designed OG image after the real logo arrives

/**
 * Next.js Metadata helper — unique title/description/canonical/OG per page.
 * Every page must call this with its own title + description (SEO rule).
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = opts.ogImage ?? DEFAULT_OG;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name} — ${opts.title}` }],
      type: "website",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

/* ================= JSON-LD builders ================= */

const orgContext = {
  "@context": "https://schema.org",
};

/** Organization (ProfessionalService) — no street address exists, so none is invented. */
export function organizationSchema() {
  const sameAs = [site.instagramUrl, site.youtubeUrl, site.contactEmail ? `mailto:${site.contactEmail}` : null].filter(Boolean);
  return {
    ...orgContext,
    "@type": "ProfessionalService",
    name: site.name,
    url: site.SITE_URL,
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
    url: site.SITE_URL,
    description: site.description,
    inLanguage: "en-IN",
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
