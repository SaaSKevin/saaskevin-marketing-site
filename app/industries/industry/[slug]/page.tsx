import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { IndustryCard } from "@/components/industries/industry-card"
import { IndustryCTA } from "@/components/industries/industry-cta"
import {
  getAllIndustrySlugs,
  getIndustryGuidesByIndustry,
  getAllIndustries,
} from "@/lib/industries"
import { MARKETING_URLS } from "@/lib/marketing-constants"

export const dynamicParams = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = MARKETING_URLS.site

export async function generateStaticParams() {
  const slugs = await getAllIndustrySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industries = await getAllIndustries()
  const industry = industries.find((item) => item.slug === slug)

  if (!industry) {
    return {
      title: "Industry not found",
      robots: { index: false, follow: false },
    }
  }

  const title = `Custom Domains for ${industry.name}`
  const ogTitle = `Custom Domains for ${industry.name} | SaaSKevin`
  const description = `See how ${industry.name} platforms use SaaSKevin to offer white-label custom domains. Add custom domains to your ${industry.name.toLowerCase()} platform in 5 minutes.`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/industries/industry/${slug}`,
    },
    keywords: [
      `custom domains for ${industry.name.toLowerCase()}`,
      `${industry.name.toLowerCase()} white label`,
      `${industry.name.toLowerCase()} custom domain API`,
      `branded domains for ${industry.name.toLowerCase()}`,
    ],
    openGraph: {
      type: "website",
      url: `${SITE_URL}/industries/industry/${slug}`,
      title: ogTitle,
      description,
      siteName: "SaaSKevin",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  }
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params
  const industries = await getAllIndustries()
  const industry = industries.find((item) => item.slug === slug)

  if (!industry) notFound()

  const industryGuides = await getIndustryGuidesByIndustry(slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Custom Domains for ${industry.name}`,
        description: `See how ${industry.name} platforms use SaaSKevin to offer white-label custom domains.`,
        url: `${SITE_URL}/industries/industry/${slug}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: industryGuides.length,
          itemListElement: industryGuides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: guide.url,
          })),
        },
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
            name: industry.name,
            item: `${SITE_URL}/industries/industry/${slug}`,
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all industries
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border">
              <span>{industry.count} Industry Guides</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl text-balance leading-[1.1]">
              Custom Domains for <span className="text-primary">{industry.name}</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              See how {industry.name.toLowerCase()} platforms use SaaSKevin to offer white-label
              custom domains. Add custom domains to your platform in 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Guides Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {industryGuides.map((industryGuide) => (
              <IndustryCard key={industryGuide.slug} industryGuide={industryGuide} />
            ))}
          </div>

          {industryGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No industry guides found in this industry yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Other Industries */}
      {industries.length > 1 && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-center">Explore Other Industries</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {industries
                  .filter((item) => item.slug !== slug)
                  .map((otherIndustry) => (
                    <Link
                      key={otherIndustry.slug}
                      href={`/industries/industry/${otherIndustry.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-sm"
                    >
                      {otherIndustry.name}
                      <span className="text-muted-foreground">({otherIndustry.count})</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <IndustryCTA
        title={`Ready for ${industry.name}?`}
        description={`Join ${industry.name.toLowerCase()} platforms that trust SaaSKevin for custom domains.`}
      />
    </SiteShell>
  )
}
