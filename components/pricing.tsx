import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const pricingHighlights = [
  "First 100 domains free",
  "First 1M requests/mo free",
  "Automatic SSL included",
  "Unlimited teams & users",
]

/* Pricing section */
export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Simple, usage-based pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Start for free with generous limits. Pay only as you scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Starter</h3>
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
                <span><strong className="text-foreground">100</strong> domains included</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span><strong className="text-foreground">1,000,000</strong> requests/mo included</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Automatic SSL management</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Community support</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button className="w-full bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href="#waitlist" aria-label="Join the waitlist" tabIndex={0}>
                  Start Building
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-primary/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Scale</h3>
                <p className="text-sm text-muted-foreground mt-1">Pay as you grow</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">Usage</div>
                <div className="text-xs text-muted-foreground">based pricing</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl bg-secondary/50 border border-border p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-foreground">Domains</span>
                  <span className="font-bold text-foreground">$0.09<span className="text-muted-foreground text-xs font-normal">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground">per domain after first 100</p>
              </div>

              <div className="rounded-xl bg-secondary/50 border border-border p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-foreground">Requests</span>
                  <span className="font-bold text-foreground">$0.40<span className="text-muted-foreground text-xs font-normal">/million</span></span>
                </div>
                <p className="text-xs text-muted-foreground">per 1M requests after first 1M</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Everything in Starter</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Volume discounts available</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Priority support</span>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" className="w-full border-border text-foreground hover:text-foreground hover:bg-transparent" asChild>
                <Link href="#waitlist" aria-label="Get early access" tabIndex={0}>
                  Join Waitlist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
