import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Metadata } from "next"

import { TOOLS, SITE_URL } from "@/lib/tools"
import { ToolCard } from "@/components/tools/tool-card"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { MASCOTS } from "@/components/mascots"
import { MARKETING_URLS, SIGNUP_CTA_TEXT } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Free Domain & DNS Tools for Developers",
  description:
    "Free online tools for developers: DNS lookup, SSL checker, WHOIS lookup, HTTP header checker, DNS propagation checker, and more. No signup required.",
  alternates: {
    canonical: "/tools",
  },
  keywords: [
    "free dns tools",
    "free domain tools",
    "developer tools online",
    "dns lookup tool",
    "ssl checker tool",
    "whois lookup tool",
  ],
  openGraph: {
    title: "Free Domain & DNS Tools for Developers | SaaSKevin",
    description:
      "Free online tools for developers: DNS lookup, SSL checker, WHOIS lookup, and more.",
    url: `${SITE_URL}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Domain & DNS Tools for Developers | SaaSKevin",
    description:
      "Free online tools for developers: DNS lookup, SSL checker, WHOIS lookup, and more.",
  },
}

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Free Domain & DNS Tools for Developers",
        description:
          "Free online tools for developers: DNS lookup, SSL checker, WHOIS lookup, HTTP header checker, DNS propagation checker, and more.",
        url: `${SITE_URL}/tools`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: TOOLS.length,
          itemListElement: TOOLS.map((tool, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: tool.title,
            url: `${SITE_URL}/tools/${tool.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${SITE_URL}/tools`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="relative flex flex-col items-center text-center">
            <div className="flex justify-center mb-8 md:mb-0 md:absolute md:-top-10 md:right-8">
              <Mascot
                src={MASCOTS.freeToolsMascot}
                decorative
                sizes="140px"
                className="w-24 sm:w-28 md:w-32 h-auto rotate-[2deg] opacity-95"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border">
              <span>{TOOLS.length} Free Tools</span>
              <span className="text-muted-foreground/50">&bull;</span>
              <span>No Signup Required</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl text-balance leading-[1.1]">
              Free Domain &amp; DNS <span className="text-primary">Developer Tools</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Check DNS records, SSL certificates, WHOIS data, and more. Built for developers
              working with domains and custom domain setups.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <ToolCard
                  key={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  icon={<Icon className="h-6 w-6 text-primary" />}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Building a SaaS with Custom Domains?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            SaaSKevin automates DNS verification, SSL certificates, and request routing
            for your users&apos; custom domains. Set up in 5 minutes with 3 lines of code.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-accent text-primary-foreground"
              asChild
            >
              <Link href={MARKETING_URLS.auth.join}>
                {SIGNUP_CTA_TEXT}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
