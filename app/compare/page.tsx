import { Metadata } from "next"

import { SiteShell } from "@/components/site-shell"
import { CompareCard } from "@/components/compare/compare-card"
import { IndustryCTA } from "@/components/industries/industry-cta"
import { getAllComparisons } from "@/lib/compare"
import { MARKETING_URLS, PRICING_COPY } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Compare - SaaSKevin vs Custom Domain Alternatives",
  description:
    "See how SaaSKevin compares to Cloudflare for SaaS, Vercel, Approximated, SaaSCustomDomains, CoAlias, and Entri for adding custom domains to your SaaS.",
  alternates: {
    canonical: "/compare",
  },
  keywords: [
    "custom domain service comparison",
    "saaskevin alternatives",
    "cloudflare for saas alternative",
    "vercel custom domains alternative",
    "custom domain infrastructure",
    "white label domain service comparison",
  ],
  openGraph: {
    title: "Compare - SaaSKevin vs Custom Domain Alternatives | SaaSKevin",
    description:
      "See how SaaSKevin compares to other custom domain solutions for SaaS platforms.",
    url: `${MARKETING_URLS.site}/compare`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare - SaaSKevin vs Custom Domain Alternatives | SaaSKevin",
    description:
      "See how SaaSKevin compares to other custom domain solutions for SaaS platforms.",
  },
}

const SITE_URL = MARKETING_URLS.site

export default async function ComparePage() {
  const comparisons = await getAllComparisons()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Compare - SaaSKevin vs Custom Domain Alternatives",
        description:
          "See how SaaSKevin compares to other custom domain solutions for adding custom domains to your SaaS platform.",
        url: `${SITE_URL}/compare`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: comparisons.length,
          itemListElement: comparisons.map((comparison, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: comparison.title,
            url: comparison.url,
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
            name: "Compare",
            item: `${SITE_URL}/compare`,
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
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border">
              <span>{comparisons.length} Comparisons</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl text-balance leading-[1.1]">
              SaaSKevin vs <span className="text-primary">The Alternatives</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Evaluating custom domain solutions for your SaaS? See how SaaSKevin
              compares on setup time, pricing, and developer experience.
            </p>
          </div>
        </div>
      </section>

      {/* Comparisons Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {comparisons.map((comparison) => (
              <CompareCard key={comparison.slug} comparison={comparison} />
            ))}
          </div>

          {comparisons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Comparison pages are coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <IndustryCTA
        title="Ready to Try SaaSKevin?"
        description={`See for yourself why teams choose SaaSKevin. Start with ${PRICING_COPY.freeCustomDomains} and set up in 5 minutes.`}
      />
    </SiteShell>
  )
}
