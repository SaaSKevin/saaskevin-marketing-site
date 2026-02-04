import { Header } from "@/components/header"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Pricing - SaaSKevin",
  description: "Simple, usage-based pricing for your SaaS. Start for free, scale indefinitely.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <Header />
      <div className="pt-20">
        <Pricing />
      </div>
      <CTA />
      <Footer />
    </main>
  )
}
