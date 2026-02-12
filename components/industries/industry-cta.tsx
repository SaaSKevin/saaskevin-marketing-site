"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import {
  MARKETING_URLS,
  PRICING_COPY,
  SIGNUP_CTA_TEXT,
} from "@/lib/marketing-constants"

export interface IndustryCTAProps {
  title?: string
  description?: string
  primaryCtaText?: string
  primaryCtaLink?: string
  benefits?: string[]
}

export function IndustryCTA({
  title = "Ready to Add Custom Domains?",
  description = "Start offering your users beautiful, branded domains with SaaSKevin. Setup takes just 5 minutes.",
  primaryCtaText = SIGNUP_CTA_TEXT,
  primaryCtaLink = MARKETING_URLS.auth.join,
  benefits = [
    PRICING_COPY.firstFreeDomains,
    PRICING_COPY.pricePerDomainAfter,
    "No credit card required",
  ],
}: IndustryCTAProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
                {title}
              </h2>

              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                {description}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="h-12 bg-primary hover:bg-accent text-primary-foreground px-8 text-base"
                  asChild
                >
                  <Link href={primaryCtaLink}>
                    {primaryCtaText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 text-base px-8 border-border text-foreground hover:bg-secondary hover:text-foreground bg-transparent"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>

              {benefits && benefits.length > 0 && (
                <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {benefit}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
