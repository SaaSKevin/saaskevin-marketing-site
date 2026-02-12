import { Metadata } from "next"

import { SiteShell } from "@/components/site-shell"
import { IndustryCard } from "@/components/industries/industry-card"
import { IndustryCTA } from "@/components/industries/industry-cta"
import { Mascot } from "@/components/mascot"
import { MASCOTS } from "@/components/mascots"
import { getAllIndustryGuides, getAllIndustries } from "@/lib/industries"
import { MARKETING_URLS, PRICING_COPY } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Industries - Custom Domains for Every SaaS",
  description:
    "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps, offer white-label domains in 5 minutes.",
  alternates: {
    canonical: "/industries",
  },
  keywords: [
    "custom domains by industry",
    "white label domains",
    "custom domain API",
    "branded domains for SaaS",
    "industry guides for SaaS",
  ],
  openGraph: {
    title: "Industries - Custom Domains for Every SaaS | SaaSKevin",
    description:
      "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps.",
    url: `${MARKETING_URLS.site}/industries`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Industries - Custom Domains for Every SaaS | SaaSKevin",
    description: "See how SaaSKevin helps platforms across industries add custom domains.",
  },
}

const SITE_URL = MARKETING_URLS.site

export default async function IndustriesPage() {
  const industryGuides = await getAllIndustryGuides()
  const industries = await getAllIndustries()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Industries - Custom Domains for Every SaaS",
        description:
          "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps, offer white-label domains in 5 minutes.",
        url: `${SITE_URL}/industries`,
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
          <div className="relative flex flex-col items-center text-center">
            <div className="flex justify-center mb-8 md:mb-0 md:absolute md:-top-10 md:right-8">
              <Mascot
                src={MASCOTS.industriesMascot}
                decorative
                sizes="140px"
                className="w-24 sm:w-28 md:w-32 h-auto rotate-[1deg] opacity-95"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border">
              <span>{industries.length} Industries</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{industryGuides.length} Industry Guides</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl text-balance leading-[1.1]">
              Custom Domains for <span className="text-primary">Every Industry</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              See how platforms across industries use SaaSKevin to offer white-label custom
              domains. From creator tools to business platforms, add custom domains in 5 minutes.
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
                Industry guides are coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <IndustryCTA
        title="Ready for Your Industry?"
        description={`No matter your industry, SaaSKevin makes it easy to offer custom domains. Start with ${PRICING_COPY.freeCustomDomains}.`}
      />
    </SiteShell>
  )
}
