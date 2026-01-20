import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const pricingHighlights = [
  "Free during beta",
  "Automatic SSL included",
  "No setup fees",
]

/* Pricing section */
export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Simple pricing that scales with you
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free during beta. When you&apos;re ready, pricing is simple and predictable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Beta Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">Launch with zero risk</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">Free</div>
                <div className="text-xs text-muted-foreground">during beta</div>
              </div>
            </div>

            <ul className="space-y-3">
              {pricingHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button className="w-full bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href="#waitlist" aria-label="Join the waitlist" tabIndex={0}>
                  Join the Waitlist
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-primary/30 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Growth Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">For production scale</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">$0.20/mo</div>
                <div className="text-xs text-muted-foreground">per domain</div>
              </div>
            </div>

            {/* <div className="rounded-xl bg-secondary/50 border border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">After 100 domains minimum</p>
              <p>
                Pay only when you&apos;re ready. Usage-based pricing starts after your first 100 domains.
              </p>
            </div> */}

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>100 domains minimum</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Unlimited teams and users</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span>Priority support as you scale</span>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" className="w-full border-border text-foreground hover:text-foreground hover:bg-transparent" asChild>
                <Link href="#waitlist" aria-label="Get early access" tabIndex={0}>
                  Get Early Access
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
