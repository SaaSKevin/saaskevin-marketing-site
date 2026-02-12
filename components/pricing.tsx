import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { MASCOTS } from "@/components/mascots"
import {
  MARKETING_URLS,
  PRICING_COPY,
  PRICING_OFFER,
  SIGNUP_CTA_TEXT,
} from "@/lib/marketing-constants"

/* Pricing section */
export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative text-center mb-12">
          <div className="flex justify-center mb-8 md:mb-0 md:absolute md:-top-10 md:right-0">
            <Mascot
              src={MASCOTS.pricingMascot}
              decorative
              sizes="160px"
              className="w-28 sm:w-32 md:w-40 h-auto rotate-[2deg] opacity-95"
            />
          </div>
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Simple, domain-based pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Start for free with generous limits. Pay only for domains as you scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Free</h3>
                <p className="text-sm text-muted-foreground mt-1">Perfect for side projects</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">$0</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>
                  <strong className="text-foreground">{PRICING_OFFER.freeDomains}</strong> domains included
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Traffic included (fair use)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Automatic SSL management</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Docs and help center</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button variant="outline" className="w-full border-border text-foreground hover:text-foreground hover:bg-transparent" asChild>
                <Link href={MARKETING_URLS.auth.join} aria-label={SIGNUP_CTA_TEXT} tabIndex={0}>
                  {SIGNUP_CTA_TEXT}
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-primary/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
              Free tier included
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Pay-as-you-go</h3>
                <p className="text-sm text-muted-foreground mt-1">Domain pricing after free tier</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{PRICING_COPY.pricePerDomain}</div>
                <div className="text-xs text-muted-foreground">per domain per month</div>
              </div>
            </div>

            <div className="space-y-4 mb-6" />

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>{PRICING_COPY.billingStartsAfterFreeTier}</span>
              </div>
              {/* <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Volume discounts available</span>
              </div> */}
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Email support</span>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href={MARKETING_URLS.auth.join} aria-label={SIGNUP_CTA_TEXT} tabIndex={0}>
                  {SIGNUP_CTA_TEXT}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
