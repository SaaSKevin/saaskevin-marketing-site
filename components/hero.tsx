"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Globe, Check, X } from "lucide-react"

export interface HeroProps {
  badgeText?: string
  title?: React.ReactNode
  description?: string
  primaryCtaText?: string
  primaryCtaLink?: string
}

export function Hero({
  badgeText = "100 Free Custom Domains", // "For SaaS",
  title = (
    <>
      Add <span className="text-primary">Custom Domains to Your SaaS</span> in 5 Minutes
    </>
  ),
  description = "SaaSKevin lets you offer white-label custom domains to your users without any of the headaches and complexity.",
  primaryCtaText = "Get Started",
  primaryCtaLink = "https://app.saaskevin.com/auth/join"
}: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col lg:items-start lg:text-left items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{badgeText}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-xl text-balance leading-[1.1]">
              {title}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
              {description}
            </p>

            {/* <p className="mt-3 text-sm text-muted-foreground/80 font-mono">
              Minimal backend: Read one header (3 lines of code)
            </p> */}

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground px-8 h-12 text-base" asChild>
                <Link href={primaryCtaLink}>
                  {primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 text-base px-8 border-border text-foreground hover:bg-secondary hover:text-foreground bg-transparent" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
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
                <span>Embeddable widget</span>
              </div>
            </div>
          </div>

          {/* Right side - Animated Hero illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Background glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            </div>

            {/* Animated concentric circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full max-w-md" viewBox="0 0 400 400">
                <circle
                  cx="200" cy="200" r="150"
                  fill="none" stroke="currentColor" strokeWidth="0.5"
                  className="text-primary opacity-20"
                  strokeDasharray="8 8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 200 200"
                    to="360 200 200"
                    dur="60s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="200" cy="200" r="110"
                  fill="none" stroke="currentColor" strokeWidth="0.5"
                  className="text-primary opacity-30"
                  strokeDasharray="4 6"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360 200 200"
                    to="0 200 200"
                    dur="45s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="200" cy="200" r="70"
                  fill="none" stroke="currentColor" strokeWidth="0.5"
                  className="text-primary opacity-40"
                  strokeDasharray="2 4"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 200 200"
                    to="360 200 200"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            {/* Mascot accent (desktop only) */}
            {/* <div className="absolute -bottom-10 -right-6 hidden md:block z-20">
              <Mascot
                src={MASCOTS.heroDomain}
                decorative
                sizes="176px"
                className="w-44 h-auto rotate-[4deg] animate-[float_4s_ease-in-out_infinite] opacity-95"
              />
            </div> */}

            <div className="relative z-10 flex flex-col items-center gap-4">
              {/* Before URL - Ugly subdomain with fade in animation */}
              <div className="relative animate-[fadeInDown_0.6s_ease-out]">
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2.5 shadow-lg backdrop-blur-sm">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-mono text-red-400 line-through decoration-red-500/50">
                    yoursaas.com/yourcustomer
                  </span>
                </div>
                {/* Animated dashed line down */}
                <svg className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-10" viewBox="0 0 8 40">
                  <line
                    x1="4" y1="0" x2="4" y2="40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-muted-foreground/40"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-16"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                </svg>
              </div>

              {/* Center icon - Globe with animated ring */}
              <div className="relative my-6 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Globe className="w-12 h-12 md:w-14 md:h-14 text-primary-foreground animate-[spin_20s_linear_infinite]" strokeWidth={1.5} />
                </div>
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-30" />
                <div className="absolute -inset-3 rounded-full border border-primary/20 animate-pulse" />
              </div>

              {/* After URL - Clean custom domain */}
              <div className="relative animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
                {/* Animated dashed line up */}
                <svg className="absolute left-1/2 -translate-x-1/2 bottom-full w-2 h-10" viewBox="0 0 8 40">
                  <line
                    x1="4" y1="0" x2="4" y2="40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-muted-foreground/40"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="16"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                </svg>
                <div className="flex items-center gap-2 bg-card border border-primary/30 rounded-full px-5 py-3 shadow-xl shadow-primary/10 backdrop-blur-sm">
                  <span className="text-sm md:text-base font-mono text-muted-foreground">https://</span>
                  <span className="text-sm md:text-base font-mono font-medium text-primary">yourcustomer.com</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ml-1 animate-[bounceIn_0.5s_ease-out_1s_both]">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Animated floating badges */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden md:block animate-[fadeInLeft_0.6s_ease-out_0.8s_both]">
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg text-xs animate-[float_3s_ease-in-out_infinite]">
                  <span className="text-muted-foreground">SSL</span>
                  <span className="text-emerald-500 ml-1 font-medium">Active</span>
                </div>
              </div>
              <div className="absolute -right-8 top-1/3 hidden md:block animate-[fadeInRight_0.6s_ease-out_1s_both]">
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg text-xs animate-[float_3s_ease-in-out_infinite_0.5s]">
                  <span className="text-muted-foreground">DNS</span>
                  <span className="text-emerald-500 ml-1 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom keyframe animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}
