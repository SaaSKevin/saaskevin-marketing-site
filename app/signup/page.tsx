import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { TallyEmbed } from "@/components/tally-embed"
import { CheckCircle2, Sparkles } from "lucide-react"
import { MARKETING_URLS, TALLY_FORM_ID } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Sign Up — SaaSKevin",
  description:
    "Be among the first to add custom domains to your SaaS. Join the waitlist for early access to SaaSKevin.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up — SaaSKevin",
    description:
      "Be among the first to add custom domains to your SaaS. Join the waitlist for early access.",
    url: `${MARKETING_URLS.site}/signup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up — SaaSKevin",
    description:
      "Be among the first to add custom domains to your SaaS. Join the waitlist for early access.",
  },
}

const VALUE_PROPS = [
  "5-minute integration",
  "Automatic SSL certificates",
  "DNS verification handled for you",
]

export default function SignupPage() {
  return (
    <SiteShell>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-center text-balance">
            Request access to{" "}
            <span className="text-primary">SaaSKevin</span>
          </h1>

          <p className="mt-4 text-center text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto text-balance">
            Custom domains for your SaaS without the engineering headache.
            Sign up to request access.
          </p>

          {/* Form card */}
          <div className="relative mt-12 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

            <div className="relative px-6 py-4 md:px-12 md:py-2">
              <TallyEmbed formId={TALLY_FORM_ID} />
            </div>
          </div>

          {/* Value props */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            {VALUE_PROPS.map((prop) => (
              <div key={prop} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {prop}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
