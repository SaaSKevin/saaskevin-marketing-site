import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { Markdown } from "@/components/blog/markdown"
import { IndustryHero } from "@/components/industries/industry-hero"
import { IndustryCTA } from "@/components/industries/industry-cta"
import { IndustryCard } from "@/components/industries/industry-card"
import {
  getAllIndustryGuideSlugs,
  getIndustryGuideBySlug,
  getIndustryGuidesByIndustry,
} from "@/lib/industries"
import { slugify } from "@/lib/utils"
import { MARKETING_URLS } from "@/lib/marketing-constants"

export const dynamicParams = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = MARKETING_URLS.site

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveIndustryAssetSrc = (guideSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/industry-assets/${guideSlug}/${cleaned}`
}

const toAbsoluteUrl = (src: string) => (isAbsoluteUrl(src) ? src : `${SITE_URL}${src}`)

export async function generateStaticParams() {
  const slugs = await getAllIndustryGuideSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industryGuide = await getIndustryGuideBySlug(slug)

  if (!industryGuide) {
    return {
      title: "Industry guide not found",
      robots: { index: false, follow: false },
    }
  }

  const title = industryGuide.title
  const ogTitle = `${industryGuide.title} | SaaSKevin`
  const coverImage = industryGuide.image
    ? resolveIndustryAssetSrc(industryGuide.slug, industryGuide.image)
    : null
  const image = coverImage ?? "/logo.png"

  return {
    title,
    description: industryGuide.description,
    alternates: {
      canonical: industryGuide.url,
    },
    keywords: industryGuide.metaKeywords.length ? industryGuide.metaKeywords : undefined,
    openGraph: {
      type: "article",
      url: industryGuide.url,
      title: ogTitle,
      description: industryGuide.description,
      siteName: "SaaSKevin",
      publishedTime: industryGuide.date,
      modifiedTime: industryGuide.updated ?? industryGuide.date,
      images: [{ url: toAbsoluteUrl(image) }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: industryGuide.description,
      images: [toAbsoluteUrl(image)],
    },
  }
}

export default async function IndustryGuidePage({ params }: PageProps) {
  const { slug } = await params
  const industryGuide = await getIndustryGuideBySlug(slug)

  if (!industryGuide) notFound()

  const coverImage = industryGuide.image
    ? resolveIndustryAssetSrc(industryGuide.slug, industryGuide.image)
    : null
  const jsonLdImage = toAbsoluteUrl(coverImage ?? "/logo.png")

  // Get related guides from the same industry
  const relatedIndustryGuides = (await getIndustryGuidesByIndustry(slugify(industryGuide.industry)))
    .filter((guide) => guide.slug !== industryGuide.slug)
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: industryGuide.title,
        description: industryGuide.description,
        datePublished: industryGuide.date,
        dateModified: industryGuide.updated ?? industryGuide.date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": industryGuide.url,
        },
        author: {
          "@type": "Organization",
          name: "SaaSKevin",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "SaaSKevin",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icon.svg`,
          },
        },
        image: [jsonLdImage],
        keywords: industryGuide.metaKeywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: `${SITE_URL}/industries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: industryGuide.title,
            item: industryGuide.url,
          },
        ],
      },
    ],
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <IndustryHero
        title={industryGuide.title}
        description={industryGuide.description}
        industry={industryGuide.industry}
        icon={industryGuide.icon}
      />

      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-6">
            <div>
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all industries
              </Link>
            </div>

            {coverImage && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={`${industryGuide.title} illustration`}
                  className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[400px] max-h-[400px] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground">
              <Markdown assetBasePath={`/industry-assets/${industryGuide.slug}`}>
                {industryGuide.content}
              </Markdown>
            </article>
          </div>
        </div>
      </div>

      {relatedIndustryGuides.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  More Guides in {industryGuide.industry}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Explore how other platforms in this industry use custom domains
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedIndustryGuides.map((relatedGuide) => (
                  <IndustryCard key={relatedGuide.slug} industryGuide={relatedGuide} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/industries"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View all industries
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <IndustryCTA
        title="Ready to Add Custom Domains?"
        description={`Join platforms in ${industryGuide.industry} that trust SaaSKevin for white-label custom domains.`}
      />
    </SiteShell>
  )
}
