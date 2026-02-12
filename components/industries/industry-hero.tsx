"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  MARKETING_URLS,
  PRICING_COPY,
  SIGNUP_CTA_TEXT,
} from "@/lib/marketing-constants"
import { IndustryIcon } from "@/components/industries/industry-icon"

export interface IndustryHeroProps {
  title: string
  description: string
  industry: string
  icon?: string
  ctaText?: string
  ctaLink?: string
}

export function IndustryHero({
  title,
  description,
  industry,
  icon,
  ctaText = SIGNUP_CTA_TEXT,
  ctaLink = MARKETING_URLS.auth.join,
}: IndustryHeroProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Industry badge */}
          <Badge variant="secondary" className="mb-8 text-sm px-4 py-1.5">
            {industry}
          </Badge>

          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-8 ring-1 ring-primary/20">
            <IndustryIcon iconName={icon} className="h-10 w-10 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl text-balance leading-[1.1]">
            {title}
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-accent text-primary-foreground px-8 h-12 text-base"
              asChild
            >
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
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

          {/* Quick benefits */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>5 minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Automatic SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{PRICING_COPY.freeCustomDomains}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
