import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { ProductDemo } from "@/components/product-demo"
import { CTA } from "@/components/cta"
import { MARKETING_URLS, PRICING_COPY } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "SaaSKevin - Custom Domains for Your SaaS Platform",
  description:
    "Add custom domains to your SaaS in 5 minutes. SaaSKevin handles DNS verification, SSL certificates, and request routing so your users get white-label branded domains.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "custom domains for SaaS",
    "white label domains",
    "custom domain API",
    "SaaS custom domains",
    "branded domains",
    "custom domain infrastructure",
    "reverse proxy SaaS",
  ],
  openGraph: {
    title: "SaaSKevin - Custom Domains for Your SaaS Platform",
    description:
      "Add custom domains to your SaaS in 5 minutes. DNS verification, SSL certificates, and request routing handled for you.",
    url: MARKETING_URLS.site,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSKevin - Custom Domains for Your SaaS Platform",
    description:
      "Add custom domains to your SaaS in 5 minutes. DNS verification, SSL certificates, and request routing handled for you.",
  },
}

const SITE_URL = MARKETING_URLS.site

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SaaSKevin",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
        description:
          "SaaSKevin lets founders and developers add custom domains to their SaaS platforms with minimal code. Handles DNS verification, SSL certificates, and request routing.",
      },
      {
        "@type": "WebSite",
        name: "SaaSKevin",
        url: SITE_URL,
      },
      {
        "@type": "SoftwareApplication",
        name: "SaaSKevin",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "Custom domain infrastructure for SaaS platforms. Add white-label domains with DNS verification, SSL certificates, and reverse proxy routing.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: `Free tier with ${PRICING_COPY.freeDomainsIncluded}`,
        },
      },
    ],
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <ProductDemo />
      <CTA />
    </SiteShell>
  )
}
