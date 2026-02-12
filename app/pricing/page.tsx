import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import {
  MARKETING_URLS,
  PRICING_COPY,
  PRICING_OFFER,
} from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Pricing - Custom Domain Hosting for SaaS",
  description:
    `${PRICING_COPY.startWithFreeCustomDomains}. ${PRICING_COPY.payAfterFreeTier} No setup fees, no traffic charges. Simple pricing for SaaS custom domain infrastructure.`,
  alternates: {
    canonical: "/pricing",
  },
  keywords: [
    "custom domain pricing",
    "SaaS custom domain cost",
    "white label domain pricing",
    "custom domain API pricing",
  ],
  openGraph: {
    title: "Pricing - Custom Domain Hosting for SaaS | SaaSKevin",
    description:
      `${PRICING_COPY.startWithFreeCustomDomains}. ${PRICING_COPY.payAfterFreeTier} No setup fees, no traffic charges.`,
    url: `${MARKETING_URLS.site}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Custom Domain Hosting for SaaS | SaaSKevin",
    description:
      `${PRICING_COPY.startWithFreeCustomDomains}. ${PRICING_COPY.payAfterFreeTier}`,
  },
}

const SITE_URL = MARKETING_URLS.site

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "SaaSKevin Custom Domain Infrastructure",
        description:
          "Custom domain infrastructure for SaaS platforms with DNS verification, SSL certificates, and reverse proxy routing.",
        url: `${SITE_URL}/pricing`,
        brand: {
          "@type": "Organization",
          name: "SaaSKevin",
        },
        offers: [
          {
            "@type": "Offer",
            name: "Free Tier",
            price: "0",
            priceCurrency: "USD",
            description: PRICING_COPY.firstDomainsIncludedFree,
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Pay-as-you-go",
            price: PRICING_OFFER.pricePerDomainUsd.toFixed(2),
            priceCurrency: "USD",
            description: `Per domain per month after the first ${PRICING_OFFER.freeDomains} free domains`,
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: PRICING_OFFER.pricePerDomainUsd.toFixed(2),
              priceCurrency: "USD",
              unitText: "domain per month",
            },
          },
        ],
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
            name: "Pricing",
            item: `${SITE_URL}/pricing`,
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
      <div className="pt-20">
        <h1 className="sr-only">SaaSKevin Pricing - Custom Domain Hosting for SaaS</h1>
        <Pricing />
      </div>
      <CTA />
    </SiteShell>
  )
}
