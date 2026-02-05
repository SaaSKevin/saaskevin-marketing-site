"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { MASCOTS } from "@/components/mascots"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
                Stop dreading custom domain requests
              </h2>

              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Start offering your users beautiful,
                branded domains—without the engineering headache.
              </p>

              <div className="mt-10 flex justify-center">
                <Button
                  size="lg"
                  className="h-12 bg-primary hover:bg-accent text-primary-foreground px-8 text-base"
                  asChild
                >
                  <Link href="https://app.saaskevin.com/auth/join">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  First 100 domains free
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  $0.09/domain after
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10 md:mt-0 md:absolute md:bottom-0 md:right-0 md:translate-y-8 md:translate-x-6">
            <Mascot
              src={MASCOTS.waveHello}
              decorative
              sizes="176px"
              className="w-32 sm:w-40 md:w-44 h-auto rotate-[-2deg] opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
