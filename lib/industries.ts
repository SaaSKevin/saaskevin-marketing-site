import "server-only"

import { cache } from "react"
import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

import { slugify } from "@/lib/utils"
import {
  MARKETING_CONTENT_TOKENS,
  MARKETING_COPY,
  MARKETING_URLS,
  SIGNUP_CTA_TEXT,
} from "@/lib/marketing-constants"

const SITE_URL = MARKETING_URLS.site
const INDUSTRY_GUIDES_DIR = path.join(process.cwd(), "content", "industries")
const LEGACY_GUIDES_SEGMENT = ["use", "cases"].join("-")
const LEGACY_INDUSTRY_GUIDES_DIR = path.join(
  process.cwd(),
  "content",
  LEGACY_GUIDES_SEGMENT,
)

const isValidDateString = (value: string) => {
  const ts = Date.parse(value)
  return Number.isFinite(ts)
}

const IndustryGuideFrontmatterSchema = z.object({
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
  industry: z.string().min(1),
  customerType: z.string().min(1),
  featured: z.boolean().optional(),
  icon: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  draft: z.boolean().optional(),
  metaKeywords: z.array(z.string().min(1)).optional(),
})

export type IndustryGuide = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  industry: string
  customerType: string
  featured: boolean
  icon?: string
  image?: string
  draft: boolean
  url: string
  metaKeywords: string[]
}

export type Industry = {
  slug: string
  name: string
  count: number
}

export type IndustryGuideWithContent = IndustryGuide & {
  content: string
}

export const INDUSTRY_GUIDES_PER_PAGE = 12

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

const getIndustryGuidesDir = async () => {
  try {
    await fs.access(INDUSTRY_GUIDES_DIR)
    return INDUSTRY_GUIDES_DIR
  } catch {
    return LEGACY_INDUSTRY_GUIDES_DIR
  }
}

const getMarkdownFiles = async (
  directoryPath: string,
): Promise<string[]> => {
  try {
    const entries = await fs.readdir(directoryPath)
    return entries.filter((name) => name.toLowerCase().endsWith(".md"))
  } catch {
    // Directory does not exist yet
    return []
  }
}

const parseIndustryGuideFromFile = async (
  directoryPath: string,
  filename: string,
): Promise<IndustryGuideWithContent> => {
  const slug = filename.replace(/\.md$/i, "")
  const filePath = path.join(directoryPath, filename)
  const raw = await fs.readFile(filePath, "utf8")

  const parsed = matter(raw)
  const fm = IndustryGuideFrontmatterSchema.parse(parsed.data)

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    industry: fm.industry,
    customerType: fm.customerType,
    featured: fm.featured ?? false,
    icon: fm.icon,
    image: fm.image,
    draft: fm.draft ?? false,
    url: `${SITE_URL}/industries/${slug}`,
    metaKeywords: fm.metaKeywords ?? [],
    content: applyIndustryGuideContentTokens(parsed.content.trim()),
  }
}

const shouldHideDrafts = () => process.env.NODE_ENV === "production"

const applyIndustryGuideContentTokens = (content: string) =>
  content
    .replaceAll(MARKETING_CONTENT_TOKENS.signupCtaText, SIGNUP_CTA_TEXT)
    .replaceAll(MARKETING_CONTENT_TOKENS.signupJoinUrl, MARKETING_URLS.auth.join)
    .replaceAll(MARKETING_CONTENT_TOKENS.signupOfferLine, MARKETING_COPY.signupOfferLine)

const loadAllIndustryGuides = cache(async (): Promise<IndustryGuideWithContent[]> => {
  const guidesDirectory = await getIndustryGuidesDir()
  const files = await getMarkdownFiles(guidesDirectory)
  const industryGuides = await Promise.all(
    files.map((fileName) => parseIndustryGuideFromFile(guidesDirectory, fileName)),
  )

  const visibleIndustryGuides = shouldHideDrafts()
    ? industryGuides.filter((guide) => !guide.draft)
    : industryGuides

  return visibleIndustryGuides.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

export const getAllIndustryGuides = async (): Promise<IndustryGuide[]> => {
  const guides = await loadAllIndustryGuides()
  return guides.map((guide) => {
    const { content, ...meta } = guide
    void content
    return meta
  })
}

export const getAllIndustryGuideSlugs = async (): Promise<string[]> => {
  const guides = await loadAllIndustryGuides()
  return guides.map((guide) => guide.slug)
}

export const getIndustryGuideBySlug = cache(
  async (slug: string): Promise<IndustryGuideWithContent | null> => {
    const guides = await loadAllIndustryGuides()
    return guides.find((guide) => guide.slug === slug) ?? null
  },
)

export const getAllIndustries = async (): Promise<Industry[]> => {
  const guides = await loadAllIndustryGuides()
  const bySlug = new Map<string, { name: string; count: number }>()

  for (const guide of guides) {
    const industrySlug = slugify(guide.industry)
    const existing = bySlug.get(industrySlug)
    if (existing) {
      existing.count += 1
    } else {
      bySlug.set(industrySlug, { name: guide.industry, count: 1 })
    }
  }

  return Array.from(bySlug.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
}

export const getIndustryGuidesByIndustry = async (
  industrySlug: string,
): Promise<IndustryGuide[]> => {
  const guides = await loadAllIndustryGuides()
  const meta = guides.map((guide) => {
    const { content, ...rest } = guide
    void content
    return rest
  })
  return meta
    .filter((guide) => slugify(guide.industry) === industrySlug)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const getAllIndustrySlugs = async (): Promise<string[]> => {
  const industries = await getAllIndustries()
  return industries.map((industry) => industry.slug)
}

export const getPaginatedIndustryGuides = cache(
  async (
    page: number,
    perPage = INDUSTRY_GUIDES_PER_PAGE,
  ): Promise<Paginated<IndustryGuide>> => {
    const guides = await getAllIndustryGuides()
    return paginate(guides, page, perPage)
  },
)

export const getPaginatedIndustryGuidesByIndustry = cache(
  async (
    industrySlug: string,
    page: number,
    perPage = INDUSTRY_GUIDES_PER_PAGE,
  ): Promise<Paginated<IndustryGuide>> => {
    const guides = await getIndustryGuidesByIndustry(industrySlug)
    return paginate(guides, page, perPage)
  },
)
