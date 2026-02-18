import "server-only"

import { cache } from "react"
import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

import {
  MARKETING_CONTENT_TOKENS,
  MARKETING_COPY,
  MARKETING_URLS,
  SIGNUP_CTA_TEXT,
} from "@/lib/marketing-constants"

const SITE_URL = MARKETING_URLS.site
const COMPARISONS_DIR = path.join(process.cwd(), "content", "compare")

const isValidDateString = (value: string) => {
  const ts = Date.parse(value)
  return Number.isFinite(ts)
}

const ComparisonFrontmatterSchema = z.object({
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
  competitorName: z.string().min(1),
  competitorUrl: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().min(1).optional(),
  draft: z.boolean().optional(),
  metaKeywords: z.array(z.string().min(1)).optional(),
})

export type Comparison = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  competitorName: string
  competitorUrl: string
  category: string
  icon?: string
  draft: boolean
  url: string
  metaKeywords: string[]
}

export type ComparisonWithContent = Comparison & {
  content: string
}

const getMarkdownFiles = async (directoryPath: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(directoryPath)
    return entries.filter((name) => name.toLowerCase().endsWith(".md"))
  } catch {
    return []
  }
}

const applyContentTokens = (content: string) =>
  content
    .replaceAll(MARKETING_CONTENT_TOKENS.signupCtaText, SIGNUP_CTA_TEXT)
    .replaceAll(MARKETING_CONTENT_TOKENS.signupJoinUrl, MARKETING_URLS.auth.join)
    .replaceAll(MARKETING_CONTENT_TOKENS.signupOfferLine, MARKETING_COPY.signupOfferLine)

const parseComparisonFromFile = async (
  directoryPath: string,
  filename: string,
): Promise<ComparisonWithContent> => {
  const slug = filename.replace(/\.md$/i, "")
  const filePath = path.join(directoryPath, filename)
  const raw = await fs.readFile(filePath, "utf8")

  const parsed = matter(raw)
  const fm = ComparisonFrontmatterSchema.parse(parsed.data)

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    competitorName: fm.competitorName,
    competitorUrl: fm.competitorUrl,
    category: fm.category,
    icon: fm.icon,
    draft: fm.draft ?? false,
    url: `${SITE_URL}/compare/${slug}`,
    metaKeywords: fm.metaKeywords ?? [],
    content: applyContentTokens(parsed.content.trim()),
  }
}

const shouldHideDrafts = () => process.env.NODE_ENV === "production"

const loadAllComparisons = cache(async (): Promise<ComparisonWithContent[]> => {
  const files = await getMarkdownFiles(COMPARISONS_DIR)
  const comparisons = await Promise.all(
    files.map((fileName) => parseComparisonFromFile(COMPARISONS_DIR, fileName)),
  )

  const visible = shouldHideDrafts()
    ? comparisons.filter((c) => !c.draft)
    : comparisons

  return visible.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

export const getAllComparisons = async (): Promise<Comparison[]> => {
  const comparisons = await loadAllComparisons()
  return comparisons.map((c) => {
    const { content, ...meta } = c
    void content
    return meta
  })
}

export const getAllComparisonSlugs = async (): Promise<string[]> => {
  const comparisons = await loadAllComparisons()
  return comparisons.map((c) => c.slug)
}

export const getComparisonBySlug = cache(
  async (slug: string): Promise<ComparisonWithContent | null> => {
    const comparisons = await loadAllComparisons()
    return comparisons.find((c) => c.slug === slug) ?? null
  },
)
