import type { MetadataRoute } from "next"

import {
  BLOG_POSTS_PER_PAGE,
  getAllBlogPosts,
  getAllAuthors,
  getAllCategories,
} from "@/lib/blog"
import {
  getAllUseCases,
  getAllIndustries,
} from "@/lib/use-cases"

const SITE_URL = "https://saaskevin.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/use-cases`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/powered-by`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/refunds`, changeFrequency: "yearly", priority: 0.2 },
  ]

  const [posts, categories, authors, useCases, industries] = await Promise.all([
    getAllBlogPosts(),
    getAllCategories(),
    getAllAuthors(),
    getAllUseCases(),
    getAllIndustries(),
  ])

  const visiblePosts = posts.filter((p) => !p.draft)

  const postRoutes: MetadataRoute.Sitemap = visiblePosts
    .map((p) => ({
      url: p.url,
      lastModified: p.updated ?? p.date,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  const totalBlogPages = Math.max(
    1,
    Math.ceil(visiblePosts.length / BLOG_POSTS_PER_PAGE),
  )
  const blogPageRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, totalBlogPages - 1) },
    (_, idx) => ({
      url: `${SITE_URL}/blog/page/${idx + 2}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }),
  )

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }))
  const categoryPageRoutes: MetadataRoute.Sitemap = categories.flatMap((c) => {
    const totalPages = Math.max(1, Math.ceil(c.count / BLOG_POSTS_PER_PAGE))
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, idx) => ({
      url: `${SITE_URL}/blog/category/${c.slug}/page/${idx + 2}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }))
  })

  const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${SITE_URL}/blog/author/${a.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }))
  const authorPageRoutes: MetadataRoute.Sitemap = authors.flatMap((a) => {
    const totalPages = Math.max(1, Math.ceil(a.count / BLOG_POSTS_PER_PAGE))
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, idx) => ({
      url: `${SITE_URL}/blog/author/${a.slug}/page/${idx + 2}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }))
  })

  // Use-case routes
  const visibleUseCases = useCases.filter((u) => !u.draft)

  const useCaseRoutes: MetadataRoute.Sitemap = visibleUseCases.map((u) => ({
    url: u.url,
    lastModified: u.updated ?? u.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${SITE_URL}/use-cases/industry/${i.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...useCaseRoutes,
    ...industryRoutes,
    ...postRoutes,
    ...blogPageRoutes,
    ...categoryRoutes,
    ...categoryPageRoutes,
    ...authorRoutes,
    ...authorPageRoutes,
  ]
}

