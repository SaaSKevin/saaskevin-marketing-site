import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { WhoisForm } from "@/components/tools/whois-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free WHOIS Lookup Tool - Domain Registration Data | SaaSKevin",
  description:
    "Look up WHOIS registration data for any domain. View registrar, creation date, expiry date, name servers, and registrant information. Free WHOIS lookup tool.",
  alternates: { canonical: "/tools/whois-lookup" },
  keywords: [
    "whois lookup",
    "domain whois",
    "who owns a domain",
    "whois search",
    "domain registration lookup",
    "whois checker",
    "domain age checker",
  ],
  openGraph: {
    title: "Free WHOIS Lookup Tool | SaaSKevin",
    description:
      "Look up WHOIS registration data for any domain. View registrar, dates, and name servers.",
    url: `${SITE_URL}/tools/whois-lookup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WHOIS Lookup Tool | SaaSKevin",
    description:
      "Look up WHOIS registration data for any domain. View registrar, dates, and name servers.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is WHOIS?",
    answer:
      "WHOIS is a query and response protocol used to look up information about registered domain names. It provides details like the domain registrar, registration and expiration dates, name servers, and sometimes the registrant's contact information.",
  },
  {
    question: "Why is WHOIS information hidden?",
    answer:
      "Many domain registrars offer WHOIS privacy protection (also called WHOIS guard or domain privacy) that replaces the registrant's personal information with the registrar's proxy details. This helps protect domain owners from spam and unwanted contact.",
  },
  {
    question: "How can I find out when a domain expires?",
    answer:
      "Use this WHOIS lookup tool to check the expiry date. The tool parses the WHOIS data and shows the expiration date prominently along with a countdown of days remaining.",
  },
  {
    question: "What are name servers?",
    answer:
      "Name servers are the DNS servers that host a domain's DNS zone. They respond to DNS queries for the domain. Common name servers include those from registrars (like ns1.example-registrar.com) or DNS providers like Cloudflare (like aria.ns.cloudflare.com).",
  },
  {
    question: "How old is a domain?",
    answer:
      "The domain age is calculated from the creation date shown in the WHOIS record. Our tool automatically calculates and displays the domain age for you.",
  },
]

export default function WhoisLookupPage() {
  const currentTool = TOOLS.find((t) => t.slug === "whois-lookup")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "whois-lookup").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "WHOIS Lookup Tool",
        description:
          "Free online WHOIS lookup tool. Check domain registration data including registrar, dates, and name servers.",
        url: `${SITE_URL}/tools/whois-lookup`,
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
          { "@type": "ListItem", position: 3, name: "WHOIS Lookup", item: `${SITE_URL}/tools/whois-lookup` },
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
            <span className="text-foreground">WHOIS Lookup</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free WHOIS Lookup
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain to look up its WHOIS registration data. See the registrar,
                creation and expiry dates, name servers, and domain status.
              </p>

              <WhoisForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is WHOIS?</h2>
                <p>
                  WHOIS is a public database that stores registration information for every
                  registered domain name. When someone registers a domain, their information
                  (or their registrar&apos;s privacy proxy) is recorded in the WHOIS database.
                  This data includes the registrar, registration dates, and authoritative
                  name servers.
                </p>

                <h2>Understanding WHOIS Data</h2>
                <p>
                  The most important fields in a WHOIS record are the <strong>registrar</strong> (the
                  company managing the domain registration), <strong>creation date</strong> (when the
                  domain was first registered), <strong>expiry date</strong> (when the registration
                  expires), and <strong>name servers</strong> (the DNS servers handling the domain&apos;s{" "}
                  <Link href="/tools/dns-lookup" className="text-primary hover:underline">DNS queries</Link>).
                </p>

                <h2>WHOIS and Custom Domains</h2>
                <p>
                  When building a SaaS platform that supports custom domains, WHOIS data can help
                  verify domain ownership and check that a domain is active. However, parsing WHOIS
                  data programmatically is notoriously difficult due to inconsistent formatting
                  across different registrars and TLDs.
                </p>
                <p>
                  Services like SaaSKevin use DNS-based verification instead of WHOIS parsing,
                  which is more reliable and works consistently across all domain registrars.
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
