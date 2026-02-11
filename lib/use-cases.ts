import "server-only"

import { cache } from "react"
import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

import { slugify } from "@/lib/utils"

const SITE_URL = "https://saaskevin.com"

const USE_CASES_DIR = path.join(process.cwd(), "content", "use-cases")

const isValidDateString = (value: string) => {
  const ts = Date.parse(value)
  return Number.isFinite(ts)
}

const UseCaseFrontmatterSchema = z.object({
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

export type UseCase = {
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

export type UseCaseWithContent = UseCase & {
  content: string
}

export const USE_CASES_PER_PAGE = 12

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
  try {
    const entries = await fs.readdir(USE_CASES_DIR)
    return entries.filter((name) => name.toLowerCase().endsWith(".md"))
  } catch (error) {
    // Directory doesn't exist yet
    return []
  }
}

const parseUseCaseFromFile = async (filename: string): Promise<UseCaseWithContent> => {
  const slug = filename.replace(/\.md$/i, "")
  const filePath = path.join(USE_CASES_DIR, filename)
  const raw = await fs.readFile(filePath, "utf8")

  const parsed = matter(raw)
  const fm = UseCaseFrontmatterSchema.parse(parsed.data)

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
    url: `${SITE_URL}/use-cases/${slug}`,
    metaKeywords: fm.metaKeywords ?? [],
    content: parsed.content.trim(),
  }
}

const shouldHideDrafts = () => process.env.NODE_ENV === "production"

const loadAllUseCases = cache(async (): Promise<UseCaseWithContent[]> => {
  const files = await getMarkdownFiles()
  const useCases = await Promise.all(files.map(parseUseCaseFromFile))

  const visibleUseCases = shouldHideDrafts()
    ? useCases.filter((u) => !u.draft)
    : useCases

  return visibleUseCases.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

export const getAllUseCases = async (): Promise<UseCase[]> => {
  const useCases = await loadAllUseCases()
  return useCases.map((useCase) => {
    const { content, ...meta } = useCase
    void content
    return meta
  })
}

export const getAllUseCaseSlugs = async (): Promise<string[]> => {
  const useCases = await loadAllUseCases()
  return useCases.map((u) => u.slug)
}

export const getUseCaseBySlug = cache(
  async (slug: string): Promise<UseCaseWithContent | null> => {
    const useCases = await loadAllUseCases()
    return useCases.find((u) => u.slug === slug) ?? null
  },
)

export const getAllIndustries = async (): Promise<Industry[]> => {
  const useCases = await loadAllUseCases()
  const bySlug = new Map<string, { name: string; count: number }>()

  for (const useCase of useCases) {
    const s = slugify(useCase.industry)
    const existing = bySlug.get(s)
    if (existing) {
      existing.count += 1
    } else {
      bySlug.set(s, { name: useCase.industry, count: 1 })
    }
  }

  return Array.from(bySlug.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
}

export const getUseCasesByIndustry = async (
  industrySlug: string,
): Promise<UseCase[]> => {
  const useCases = await loadAllUseCases()
  const meta = useCases.map((u) => {
    const { content, ...rest } = u
    void content
    return rest
  })
  return meta
    .filter((u) => slugify(u.industry) === industrySlug)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const getAllIndustrySlugs = async (): Promise<string[]> => {
  const industries = await getAllIndustries()
  return industries.map((i) => i.slug)
}

export const getPaginatedUseCases = cache(
  async (page: number, perPage = USE_CASES_PER_PAGE): Promise<Paginated<UseCase>> => {
    const useCases = await getAllUseCases()
    return paginate(useCases, page, perPage)
  },
)

export const getPaginatedUseCasesByIndustry = cache(
  async (
    industrySlug: string,
    page: number,
    perPage = USE_CASES_PER_PAGE,
  ): Promise<Paginated<UseCase>> => {
    const useCases = await getUseCasesByIndustry(industrySlug)
    return paginate(useCases, page, perPage)
  },
)
