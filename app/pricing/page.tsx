import { SiteShell } from "@/components/site-shell"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"

export const metadata = {
  title: "Pricing - SaaSKevin",
  description: "Simple, usage-based pricing for your SaaS. Start for free, scale indefinitely.",
}

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="pt-20">
        <Pricing />
      </div>
      <CTA />
    </SiteShell>
  )
}
