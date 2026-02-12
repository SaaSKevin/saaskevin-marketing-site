import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { ProductDemo } from "@/components/product-demo"
import { CTA } from "@/components/cta"
import { MARKETING_URLS, SIGNUP_CTA_TEXT } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Powered by SaaSKevin - Custom Domains for Your Platform",
  description:
    "SaaSKevin makes it easy to add white-label custom domains to your SaaS application. DNS verification, SSL certificates, and routing handled automatically.",
  alternates: {
    canonical: "/powered-by",
  },
  openGraph: {
    title: "Powered by SaaSKevin - Custom Domains for Your Platform",
    description:
      "SaaSKevin makes it easy to add white-label custom domains to your SaaS application.",
    url: `${MARKETING_URLS.site}/powered-by`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Powered by SaaSKevin - Custom Domains for Your Platform",
    description:
      "SaaSKevin makes it easy to add white-label custom domains to your SaaS application.",
  },
}

export default function PoweredByPage() {
  return (
    <SiteShell>
      <Hero
        badgeText="Powered by SaaSKevin"
        title={
          <>
            Build <span className="text-primary">Custom Domains</span> Into Your Product
          </>
        }
        description="You found us via one of our customers. SaaSKevin makes it effortless to add white-label custom domains to your application in minutes."
        primaryCtaText={SIGNUP_CTA_TEXT}
      />
      <HowItWorks />
      <Features />
      <Pricing />
      <ProductDemo />
      <CTA />
    </SiteShell>
  )
}
