import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DnsPropagationForm } from "@/components/tools/dns-propagation-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free DNS Propagation Checker | SaaSKevin",
  description:
    "Free DNS propagation checker. Query multiple DNS servers worldwide to verify your DNS changes have propagated and records are live.",
  alternates: { canonical: "/tools/dns-propagation" },
  keywords: [
    "dns propagation checker",
    "dns propagation",
    "check dns propagation",
    "dns propagation time",
    "has dns propagated",
    "global dns check",
  ],
  openGraph: {
    title: "Free DNS Propagation Checker | SaaSKevin",
    description:
      "Check if DNS changes have propagated globally by querying multiple DNS servers.",
    url: `${SITE_URL}/tools/dns-propagation`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DNS Propagation Checker | SaaSKevin",
    description:
      "Check if DNS changes have propagated globally by querying multiple DNS servers.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is DNS propagation?",
    answer:
      "DNS propagation is the process of DNS changes (like new records or modified values) being distributed across all DNS servers worldwide. When you update a DNS record, it takes time for every DNS server to receive and cache the new information.",
  },
  {
    question: "How long does DNS propagation take?",
    answer:
      "DNS propagation typically takes a few minutes to 48 hours, though most changes propagate within 1-4 hours. The speed depends on the TTL (Time To Live) of the previous record, DNS caching, and the DNS provider.",
  },
  {
    question: "Why do some DNS servers show different results?",
    answer:
      "Different DNS servers may cache records for different durations based on the TTL value. During propagation, some servers will still serve the old cached record while others have already picked up the new one.",
  },
  {
    question: "How can I speed up DNS propagation?",
    answer:
      "Before making changes, lower the TTL of the record to a small value (like 60 seconds) and wait for the old TTL to expire. Then make your change. After propagation, you can increase the TTL again. Some DNS providers like Cloudflare also have instant propagation for their own resolvers.",
  },
  {
    question: "How does DNS propagation affect custom domain setup?",
    answer:
      "When setting up custom domains for a SaaS platform, users add CNAME or A records that must resolve to the expected routing target before the domain goes live. SaaSKevin keeps domains in pending DNS/SSL states until routing checks pass, then activates SSL and routing.",
  },
]

export default function DnsPropagationPage() {
  const currentTool = TOOLS.find((t) => t.slug === "dns-propagation")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "dns-propagation").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DNS Propagation Checker",
        description:
          "Free online DNS propagation checker. Verify DNS changes have propagated across global DNS servers.",
        url: `${SITE_URL}/tools/dns-propagation`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Organization", name: "SaaSKevin", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
          { "@type": "ListItem", position: 3, name: "DNS Propagation", item: `${SITE_URL}/tools/dns-propagation` },
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
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">DNS Propagation</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free DNS Propagation Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Check if your DNS changes have propagated globally. We query multiple DNS
                servers worldwide to show whether your records are live everywhere.
              </p>

              <DnsPropagationForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>Understanding DNS Propagation</h2>
                <p>
                  When you change a DNS record, the update doesn&apos;t happen instantly across
                  the entire internet. DNS servers around the world cache records based on
                  their TTL (Time To Live) value. Until those caches expire, different servers
                  may return different results for the same query.
                </p>

                <h2>How This Tool Works</h2>
                <p>
                  This tool queries major public DNS resolvers (Google, Cloudflare, Quad9,
                  OpenDNS, and others) to check what each one returns for your domain. If all
                  servers return the same, correct records, propagation is complete.
                </p>

                <h2>DNS Propagation and Custom Domains</h2>
                <p>
                  When users set up custom domains for SaaS platforms, they add DNS records
                  (typically a <Link href="/tools/cname-lookup" className="text-primary hover:underline">CNAME record</Link>) that need to propagate before the domain becomes active.
                  Premature activation attempts fail because not all DNS servers have the new
                  records yet. Use our <Link href="/tools/dns-lookup" className="text-primary hover:underline">DNS lookup tool</Link> to
                  check what records are currently set for any domain.
                </p>
                <p>
                  SaaSKevin solves this by verifying that each domain&apos;s records resolve
                  to the expected routing targets before activation. Domains stay pending
                  until checks pass, then SSL is provisioned and traffic routing is enabled.
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
