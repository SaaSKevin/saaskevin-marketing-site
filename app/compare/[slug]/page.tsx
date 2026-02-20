import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { Markdown } from "@/components/blog/markdown"
import { CompareHero } from "@/components/compare/compare-hero"
import { CompareCard } from "@/components/compare/compare-card"
import { IndustryCTA } from "@/components/industries/industry-cta"
import {
  getAllComparisonSlugs,
  getAllComparisons,
  getComparisonBySlug,
} from "@/lib/compare"
import { MARKETING_URLS } from "@/lib/marketing-constants"

export const dynamicParams = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = MARKETING_URLS.site

export async function generateStaticParams() {
  const slugs = await getAllComparisonSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const comparison = await getComparisonBySlug(slug)

  if (!comparison) {
    return {
      title: "Comparison not found",
      robots: { index: false, follow: false },
    }
  }

  const title = comparison.title
  const ogTitle = `${comparison.title} | SaaSKevin`

  return {
    title,
    description: comparison.description,
    alternates: {
      canonical: comparison.url,
    },
    keywords: comparison.metaKeywords.length ? comparison.metaKeywords : undefined,
    openGraph: {
      type: "article",
      url: comparison.url,
      title: ogTitle,
      description: comparison.description,
      siteName: "SaaSKevin",
      publishedTime: comparison.date,
      modifiedTime: comparison.updated ?? comparison.date,
      images: [{ url: `${SITE_URL}/logo.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: comparison.description,
      images: [`${SITE_URL}/logo.png`],
    },
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const comparison = await getComparisonBySlug(slug)

  if (!comparison) notFound()

  const allComparisons = await getAllComparisons()
  const otherComparisons = allComparisons
    .filter((c) => c.slug !== comparison.slug)
    .slice(0, 5)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comparison.title,
        description: comparison.description,
        datePublished: comparison.date,
        dateModified: comparison.updated ?? comparison.date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": comparison.url,
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
        image: [`${SITE_URL}/logo.png`],
        keywords: comparison.metaKeywords.join(", "),
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
            name: "Compare",
            item: `${SITE_URL}/compare`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: comparison.title,
            item: comparison.url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the difference between SaaSKevin and ${comparison.competitorName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: comparison.description,
            },
          },
          {
            "@type": "Question",
            name: `Is SaaSKevin a good alternative to ${comparison.competitorName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `SaaSKevin offers a pre-built embeddable widget, 3 free custom domains, and $0.15/domain/month pricing. It integrates in 5 minutes with just 3 lines of backend code, making it a simpler alternative to ${comparison.competitorName} for adding custom domains to your SaaS.`,
            },
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

      <CompareHero
        title={comparison.title}
        description={comparison.description}
        competitorName={comparison.competitorName}
        category={comparison.category}
        icon={comparison.icon}
        logo={comparison.logo}
      />

      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-6">
            <div>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all comparisons
              </Link>
            </div>

            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground">
              <Markdown>{comparison.content}</Markdown>
            </article>
          </div>
        </div>
      </div>

      {otherComparisons.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Other Comparisons
                </h2>
                <p className="mt-2 text-muted-foreground">
                  See how SaaSKevin compares to other custom domain solutions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherComparisons.map((otherComparison) => (
                  <CompareCard key={otherComparison.slug} comparison={otherComparison} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View all comparisons
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <IndustryCTA
        title={`Ready to Try the ${comparison.competitorName} Alternative?`}
        description="Start offering your users custom domains with SaaSKevin. Setup takes just 5 minutes."
      />
    </SiteShell>
  )
}
