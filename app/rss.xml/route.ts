import { getAllBlogPosts } from "@/lib/blog"
import { MARKETING_URLS } from "@/lib/marketing-constants"

export const dynamic = "force-static"

const SITE_URL = MARKETING_URLS.site

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")

export async function GET() {
  const posts = (await getAllBlogPosts()).filter((p) => !p.draft)

  const itemsXml = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("")

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        categories,
        "</item>",
      ].join("")
    })
    .join("")

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "<title>SaaSKevin Blog</title>",
    `<link>${SITE_URL}/blog</link>`,
    "<description>Notes, decisions, and implementation details from building custom domains for SaaS products.</description>",
    "<language>en-us</language>",
    `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("")

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

