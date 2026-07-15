import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/feature/journal/data/journal-seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/api/", "/auth"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
