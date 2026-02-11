import { SiteShell } from "@/components/site-shell"
import { getAllUseCases, getAllIndustries } from "@/lib/use-cases"
import { UseCaseCard } from "@/components/use-cases/use-case-card"
import { UseCaseCTA } from "@/components/use-cases/use-case-cta"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Use Cases - Custom Domains for Every SaaS | SaaSKevin",
  description:
    "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps, offer white-label domains in 5 minutes.",
  alternates: {
    canonical: "/use-cases",
  },
  keywords: [
    "custom domain use cases",
    "white label domains",
    "custom domain API",
    "branded domains for SaaS",
    "custom domain examples",
  ],
  openGraph: {
    title: "Use Cases - Custom Domains for Every SaaS | SaaSKevin",
    description:
      "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps.",
    url: "https://saaskevin.com/use-cases",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases - Custom Domains for Every SaaS | SaaSKevin",
    description:
      "See how SaaSKevin helps platforms across industries add custom domains.",
  },
}

const SITE_URL = "https://saaskevin.com"

export default async function UseCasesPage() {
  const useCases = await getAllUseCases()
  const industries = await getAllIndustries()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Use Cases - Custom Domains for Every SaaS",
        description:
          "See how SaaSKevin helps platforms across industries add custom domains. From link-in-bio tools to scheduling apps, offer white-label domains in 5 minutes.",
        url: `${SITE_URL}/use-cases`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: useCases.length,
          itemListElement: useCases.map((u, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: u.title,
            url: u.url,
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
            name: "Use Cases",
            item: `${SITE_URL}/use-cases`,
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
              <span>{industries.length} Industries</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{useCases.length} Use Cases</span>
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

      {/* Use Cases Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {useCases.map((useCase) => (
              <UseCaseCard key={useCase.slug} useCase={useCase} />
            ))}
          </div>

          {useCases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Use cases are coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <UseCaseCTA
        title="Ready for Your Use Case?"
        description="No matter your industry, SaaSKevin makes it easy to offer custom domains. Start with 100 free domains."
      />
    </SiteShell>
  )
}
