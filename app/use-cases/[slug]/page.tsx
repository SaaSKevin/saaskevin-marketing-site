import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { Markdown } from "@/components/blog/markdown"
import { UseCaseHero } from "@/components/use-cases/use-case-hero"
import { UseCaseCTA } from "@/components/use-cases/use-case-cta"
import { UseCaseCard } from "@/components/use-cases/use-case-card"
import { getAllUseCaseSlugs, getUseCaseBySlug, getUseCasesByIndustry } from "@/lib/use-cases"
import { slugify } from "@/lib/utils"

export const dynamicParams = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = "https://saaskevin.com"

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveUseCaseAssetSrc = (useCaseSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/use-case-assets/${useCaseSlug}/${cleaned}`
}

const toAbsoluteUrl = (src: string) => (isAbsoluteUrl(src) ? src : `${SITE_URL}${src}`)

export async function generateStaticParams() {
  const slugs = await getAllUseCaseSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const useCase = await getUseCaseBySlug(slug)

  if (!useCase) {
    return {
      title: "Use Case not found - SaaSKevin",
      robots: { index: false, follow: false },
    }
  }

  const title = `${useCase.title} | SaaSKevin`
  const coverImage = useCase.image
    ? resolveUseCaseAssetSrc(useCase.slug, useCase.image)
    : null
  const image = coverImage ?? "/logo.png"

  return {
    title,
    description: useCase.description,
    alternates: {
      canonical: useCase.url,
    },
    keywords: useCase.metaKeywords.length ? useCase.metaKeywords : undefined,
    openGraph: {
      type: "article",
      url: useCase.url,
      title,
      description: useCase.description,
      siteName: "SaaSKevin",
      publishedTime: useCase.date,
      modifiedTime: useCase.updated ?? useCase.date,
      images: [{ url: toAbsoluteUrl(image) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: useCase.description,
      images: [toAbsoluteUrl(image)],
    },
  }
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params
  const useCase = await getUseCaseBySlug(slug)

  if (!useCase) notFound()

  const coverImage = useCase.image
    ? resolveUseCaseAssetSrc(useCase.slug, useCase.image)
    : null
  const jsonLdImage = toAbsoluteUrl(coverImage ?? "/logo.png")

  // Get related use-cases from the same industry
  const relatedUseCases = (await getUseCasesByIndustry(slugify(useCase.industry)))
    .filter((u) => u.slug !== useCase.slug)
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: useCase.title,
        description: useCase.description,
        datePublished: useCase.date,
        dateModified: useCase.updated ?? useCase.date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": useCase.url,
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
        keywords: useCase.metaKeywords.join(", "),
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
            name: "Use Cases",
            item: `${SITE_URL}/use-cases`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: useCase.title,
            item: useCase.url,
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

      <UseCaseHero
        title={useCase.title}
        description={useCase.description}
        industry={useCase.industry}
        icon={useCase.icon}
      />

      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-6">
            <div>
              <Link
                href="/use-cases"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all use cases
              </Link>
            </div>

            {coverImage && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={`${useCase.title} illustration`}
                  className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[400px] max-h-[400px] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground">
              <Markdown assetBasePath={`/use-case-assets/${useCase.slug}`}>
                {useCase.content}
              </Markdown>
            </article>
          </div>
        </div>
      </div>

      {relatedUseCases.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  More Use Cases in {useCase.industry}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Explore how other platforms in this industry use custom domains
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedUseCases.map((relatedUseCase) => (
                  <UseCaseCard key={relatedUseCase.slug} useCase={relatedUseCase} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/use-cases"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View all use cases
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <UseCaseCTA
        title="Ready to Add Custom Domains?"
        description={`Join platforms in ${useCase.industry} that trust SaaSKevin for white-label custom domains.`}
      />
    </SiteShell>
  )
}
