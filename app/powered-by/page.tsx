import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { ProductDemo } from "@/components/product-demo"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function PoweredByPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <Header />
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
      <Footer />
    </main>
  )
}
