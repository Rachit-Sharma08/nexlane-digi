import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/seo";

/**
 * AGENTS §12.5: until NEXT_PUBLIC_ALLOW_INDEXING=true, robots.txt disallows
 * everything so the temporary Vercel URL is never indexed. The switch is a
 * build-time env — flipping it means rebuilding/redeploying.
 */
export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? {
        rules: [{ userAgent: "*", allow: "/" }],
        sitemap: absoluteUrl("/sitemap.xml"),
      }
    : {
        rules: [{ userAgent: "*", disallow: "/" }],
      };
}
