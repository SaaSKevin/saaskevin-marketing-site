import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { ProductDemo } from "@/components/product-demo"
import { CTA } from "@/components/cta"

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <ProductDemo />
      <CTA />
    </SiteShell>
  )
}
