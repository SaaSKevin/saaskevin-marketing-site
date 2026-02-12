import "server-only"

import { cache } from "react"
import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

import { slugify } from "@/lib/utils"
import { MARKETING_URLS } from "@/lib/marketing-constants"

const SITE_URL = MARKETING_URLS.site

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const isValidDateString = (value: string) => {
  const ts = Date.parse(value)
  return Number.isFinite(ts)
}

const BlogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().refine(isValidDateString, {
    message: "date must be a valid date string",
  }),
  updated: z
    .string()
    .optional()
    .refine((v) => (v ? isValidDateString(v) : true), {
      message: "updated must be a valid date string",
    }),
  tags: z.array(z.string().min(1)).optional(),
  author: z.string().min(1).optional(),
  authorSlug: z.string().min(1).optional(),
  enableCoverImage: z.boolean().optional(),
  image: z.string().min(1).optional(),
  draft: z.boolean().optional(),
})

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  author: string
  authorSlug: string
  enableCoverImage: boolean
  image?: string
  draft: boolean
  url: string
}

export type BlogCategory = {
  slug: string
  name: string
  count: number
}

export type BlogAuthor = {
  slug: string
  name: string
  count: number
}

export type BlogPostWithContent = BlogPost & {
  content: string
}

export const BLOG_POSTS_PER_PAGE = 10

export type Paginated<T> = {
  items: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const paginate = <T>(items: T[], page: number, perPage: number): Paginated<T> => {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const start = (page - 1) * perPage
  const end = start + perPage
  const slice = items.slice(start, end)

  return {
    items: slice,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  }
}

const getMarkdownFiles = async () => {
  const entries = await fs.readdir(BLOG_DIR)
  return entries.filter((name) => name.toLowerCase().endsWith(".md"))
}

const parsePostFromFile = async (filename: string): Promise<BlogPostWithContent> => {
  const slug = filename.replace(/\.md$/i, "")
  const filePath = path.join(BLOG_DIR, filename)
  const raw = await fs.readFile(filePath, "utf8")

  const parsed = matter(raw)
  const fm = BlogFrontmatterSchema.parse(parsed.data)

  const author = fm.author ?? "SaaSKevin"
  const authorSlug = fm.authorSlug ?? slugify(author)

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    tags: fm.tags ?? [],
    author,
    authorSlug,
    enableCoverImage: fm.enableCoverImage ?? false,
    image: fm.image,
    draft: fm.draft ?? false,
    url: `${SITE_URL}/blog/${slug}`,
    content: parsed.content.trim(),
  }
}

const shouldHideDrafts = () => process.env.NODE_ENV === "production"

const loadAllPosts = cache(async (): Promise<BlogPostWithContent[]> => {
  const files = await getMarkdownFiles()
  const posts = await Promise.all(files.map(parsePostFromFile))

  const visiblePosts = shouldHideDrafts() ? posts.filter((p) => !p.draft) : posts

  return visiblePosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await loadAllPosts()
  return posts.map((post) => {
    const { content, ...meta } = post
    void content
    return meta
  })
}

export const getAllBlogSlugs = async (): Promise<string[]> => {
  const posts = await loadAllPosts()
  return posts.map((p) => p.slug)
}

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostWithContent | null> => {
    const posts = await loadAllPosts()
    return posts.find((p) => p.slug === slug) ?? null
  },
)

export const getAllCategories = async (): Promise<BlogCategory[]> => {
  const posts = await loadAllPosts()
  const meta = posts.map((p) => p.tags)
  const bySlug = new Map<string, { name: string; count: number }>()

  for (const tags of meta) {
    for (const tag of tags) {
      const s = slugify(tag)
      const existing = bySlug.get(s)
      if (existing) {
        existing.count += 1
      } else {
        bySlug.set(s, { name: tag, count: 1 })
      }
    }
  }

  return Array.from(bySlug.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
}

export const getPostsByCategory = async (
  categorySlug: string,
): Promise<BlogPost[]> => {
  const posts = await loadAllPosts()
  const meta = posts.map((p) => {
    const { content, ...rest } = p
    void content
    return rest
  })
  return meta
    .filter((p) => p.tags.some((t) => slugify(t) === categorySlug))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const getAllAuthors = async (): Promise<BlogAuthor[]> => {
  const posts = await loadAllPosts()
  const bySlug = new Map<string, { name: string; count: number }>()

  for (const p of posts) {
    const s = p.authorSlug
    const existing = bySlug.get(s)
    if (existing) {
      existing.count += 1
    } else {
      bySlug.set(s, { name: p.author, count: 1 })
    }
  }

  return Array.from(bySlug.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
}

export const getPostsByAuthor = async (authorSlug: string): Promise<BlogPost[]> => {
  const posts = await loadAllPosts()
  const meta = posts.map((p) => {
    const { content, ...rest } = p
    void content
    return rest
  })
  return meta
    .filter((p) => p.authorSlug === authorSlug)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const getAllCategorySlugs = async (): Promise<string[]> => {
  const cats = await getAllCategories()
  return cats.map((c) => c.slug)
}

export const getAllAuthorSlugs = async (): Promise<string[]> => {
  const authors = await getAllAuthors()
  return authors.map((a) => a.slug)
}

export const getPaginatedBlogPosts = cache(
  async (page: number, perPage = BLOG_POSTS_PER_PAGE): Promise<Paginated<BlogPost>> => {
    const posts = await getAllBlogPosts()
    return paginate(posts, page, perPage)
  },
)

export const getPaginatedPostsByCategory = cache(
  async (
    categorySlug: string,
    page: number,
    perPage = BLOG_POSTS_PER_PAGE,
  ): Promise<Paginated<BlogPost>> => {
    const posts = await getPostsByCategory(categorySlug)
    return paginate(posts, page, perPage)
  },
)

export const getPaginatedPostsByAuthor = cache(
  async (
    authorSlug: string,
    page: number,
    perPage = BLOG_POSTS_PER_PAGE,
  ): Promise<Paginated<BlogPost>> => {
    const posts = await getPostsByAuthor(authorSlug)
    return paginate(posts, page, perPage)
  },
)

