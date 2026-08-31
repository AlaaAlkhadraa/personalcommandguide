import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is login-gated and carries its own noindex; keeping crawlers
      // out entirely saves the crawl budget for the pages that should rank.
      // /demo stays crawlable on purpose: its pages carry a noindex tag, and
      // a robots block would stop Google from ever seeing that tag.
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
