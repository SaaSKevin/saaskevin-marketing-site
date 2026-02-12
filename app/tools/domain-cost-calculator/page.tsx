import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { CostCalculatorForm } from "@/components/tools/cost-calculator-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"
import { PRICING_OFFER } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Free Custom Domain Cost Calculator | SaaSKevin",
  description:
    "Free custom domain cost calculator for SaaS. Calculate the total cost of offering custom domains and compare building in-house vs using a managed service.",
  alternates: { canonical: "/tools/domain-cost-calculator" },
  keywords: [
    "saas pricing calculator",
    "custom domain cost",
    "white label domain pricing",
    "build vs buy saas",
    "custom domain roi",
    "saas infrastructure cost",
  ],
  openGraph: {
    title: "Free Custom Domain Cost Calculator | SaaSKevin",
    description:
      "Free calculator to compare the cost of building custom domain support in-house vs using a managed service.",
    url: `${SITE_URL}/tools/domain-cost-calculator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Custom Domain Cost Calculator | SaaSKevin",
    description:
      "Free calculator to compare the cost of building custom domain support in-house vs using a managed service.",
  },
}

const FAQ_ITEMS = [
  {
    question: "How much does it cost to build custom domain support?",
    answer:
      "Building custom domain support from scratch typically takes 80-200+ hours of developer time. This includes DNS validation, SSL certificate provisioning and renewal, request routing/proxying, a user-facing setup UI, monitoring, and handling edge cases. At $100-200/hour, that's $8,000-$40,000 in initial development costs alone.",
  },
  {
    question: "What are the hidden costs of building in-house?",
    answer:
      "Beyond initial development, hidden costs include: SSL certificate infrastructure (servers, storage, ACME client maintenance), ongoing DNS debugging and support tickets, monitoring and alerting systems, and the opportunity cost of developer time not spent on your core product.",
  },
  {
    question: "When does building in-house make more sense?",
    answer:
      "Building in-house may make sense if you have very specific requirements (unusual routing logic, custom TLS termination), you're at massive scale (10,000+ domains), you have dedicated infrastructure engineers, or custom domains are your core product rather than a feature.",
  },
  {
    question: "How is SaaSKevin priced?",
    answer:
      `SaaSKevin offers the first ${PRICING_OFFER.freeDomains} domains free, then charges $${PRICING_OFFER.pricePerDomainUsd.toFixed(2)} per domain per month. This includes SSL provisioning, DNS verification, request routing, an embeddable setup widget, and operational support tooling (including traffic alerts). There are no setup fees or minimum commitments.`,
  },
  {
    question: "What does the maintenance cost include?",
    answer:
      "Monthly maintenance for in-house solutions includes fixing certificate renewal failures, debugging DNS configuration issues for specific users, handling edge cases (Cloudflare proxy conflicts, DNSSEC issues), updating dependencies, and responding to support tickets about domain setup.",
  },
]

export default function DomainCostCalculatorPage() {
  const currentTool = TOOLS.find((t) => t.slug === "domain-cost-calculator")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "domain-cost-calculator").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SaaS Custom Domain Cost Calculator",
        description:
          "Calculate the total cost of offering custom domains to your SaaS users. Compare building in-house vs managed services.",
        url: `${SITE_URL}/tools/domain-cost-calculator`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Organization", name: "SaaSKevin", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${SITE_URL}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Cost Calculator",
            item: `${SITE_URL}/tools/domain-cost-calculator`,
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

      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/tools"
              className="hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Cost Calculator</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                SaaS Custom Domain Cost Calculator
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Should you build custom domain support in-house or use a managed service?
                Adjust the sliders to calculate the total cost of ownership for your situation.
              </p>

              <CostCalculatorForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>The True Cost of Custom Domains</h2>
                <p>
                  Custom domain support seems simple on the surface: let users point their
                  domain to your app. In practice, it involves DNS validation, SSL certificate
                  provisioning and renewal, reverse proxy configuration, request routing, a
                  user-facing setup UI, and ongoing monitoring and maintenance.
                </p>

                <h2>What Goes Into Building It In-House</h2>
                <p>
                  A typical in-house implementation requires: a DNS verification system
                  (checking CNAME or TXT records), integration with an ACME provider like
                  Let&apos;s Encrypt for SSL certificates, a reverse proxy (Nginx, Caddy, or
                  custom) for request routing, a database to store domain-to-customer
                  mappings, a user interface for domain setup, and monitoring for certificate
                  expiration and DNS changes.
                </p>

                <h2>The Opportunity Cost</h2>
                <p>
                  Beyond direct costs, consider the opportunity cost. Every hour your team
                  spends on DNS infrastructure is an hour not spent on your core product.
                  For most SaaS companies, custom domains are an important feature but not
                  the product itself. Using a managed service lets you ship the feature in
                  minutes instead of weeks and focus your engineering effort where it matters
                  most.
                </p>
              </div>

              <ToolFaq items={FAQ_ITEMS} />

              <section className="mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                  Related Tools
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <ToolCard
                        key={tool.slug}
                        title={tool.shortTitle}
                        description={tool.description}
                        href={`/tools/${tool.slug}`}
                        icon={<Icon className="h-6 w-6 text-primary" />}
                      />
                    )
                  })}
                </div>
              </section>
            </div>

            <ToolSidebarCta className="hidden lg:block" />
          </div>
        </div>
      </section>
    </>
  )
}
