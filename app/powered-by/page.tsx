import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { ProductDemo } from "@/components/product-demo"
import { CTA } from "@/components/cta"

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
        primaryCtaText="Get Custom Domains"
      />
      <HowItWorks />
      <Features />
      <Pricing />
      <ProductDemo />
      <CTA />
    </SiteShell>
  )
}
