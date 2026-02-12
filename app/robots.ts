import type { MetadataRoute } from "next"
import { MARKETING_URLS } from "@/lib/marketing-constants"

const SITE_URL = MARKETING_URLS.site

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

