import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DnsLookupForm } from "@/components/tools/dns-lookup-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free DNS Lookup Tool | SaaSKevin",
  description:
    "Free DNS record lookup tool. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records for any domain instantly. No signup required.",
  alternates: { canonical: "/tools/dns-lookup" },
  keywords: [
    "dns lookup",
    "dns checker",
    "check dns records",
    "dns record lookup",
    "nslookup online",
    "mx record lookup",
    "txt record lookup",
    "ns record checker",
  ],
  openGraph: {
    title: "Free DNS Lookup Tool | SaaSKevin",
    description:
      "Look up DNS records for any domain instantly. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records.",
    url: `${SITE_URL}/tools/dns-lookup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DNS Lookup Tool | SaaSKevin",
    description:
      "Look up DNS records for any domain instantly. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What are DNS records?",
    answer:
      "DNS (Domain Name System) records are instructions that tell the internet how to handle requests for a domain. They map domain names to IP addresses (A/AAAA records), define mail servers (MX records), verify domain ownership (TXT records), and more.",
  },
  {
    question: "What is a CNAME record used for?",
    answer:
      "A CNAME (Canonical Name) record creates an alias from one domain to another. It's commonly used for custom domain setups in SaaS platforms, where a user's custom domain (e.g., app.example.com) points to the SaaS provider's infrastructure.",
  },
  {
    question: "How do I set up DNS for a custom domain?",
    answer:
      "To set up a custom domain, you typically add a CNAME record pointing your domain to your provider's hostname, or an A record pointing to their IP address. The exact steps depend on your DNS provider (Cloudflare, Route 53, Google Cloud DNS, GoDaddy, Namecheap, and others).",
  },
  {
    question: "Why are my DNS changes not showing up?",
    answer:
      "DNS changes can take up to 48 hours to propagate worldwide, though most changes take effect within a few minutes to a few hours. If changes aren't showing, check that you've saved the records correctly and try clearing your local DNS cache.",
  },
  {
    question: "What is the difference between A and CNAME records?",
    answer:
      "An A record maps a domain directly to an IP address (e.g., 93.184.216.34). A CNAME record maps a domain to another domain name (e.g., app.example.com → myapp.saaskevin.com). CNAMEs are more flexible because if the target IP changes, you don't need to update your record.",
  },
]

export default function DnsLookupPage() {
  const currentTool = TOOLS.find((t) => t.slug === "dns-lookup")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "dns-lookup").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DNS Lookup Tool",
        description:
          "Free online DNS record lookup tool. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records for any domain.",
        url: `${SITE_URL}/tools/dns-lookup`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Organization",
          name: "SaaSKevin",
          url: SITE_URL,
        },
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
            name: "DNS Lookup",
            item: `${SITE_URL}/tools/dns-lookup`,
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
          {/* Breadcrumbs */}
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
            <span className="text-foreground">DNS Lookup</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free DNS Record Lookup
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain name to instantly view all DNS records including A,
                AAAA, CNAME, MX, TXT, NS, and SOA records.
              </p>

              <DnsLookupForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What Are DNS Records?</h2>
                <p>
                  DNS (Domain Name System) records are the instructions that tell the
                  internet how to handle requests for your domain. When someone types
                  your domain into a browser, DNS records determine which server
                  responds, where emails are delivered, and how your domain&apos;s ownership
                  is verified.
                </p>

                <h2>DNS Record Types Explained</h2>
                <p>
                  <strong>A Records</strong> map a domain to an IPv4 address. This is the
                  most fundamental DNS record -- it tells browsers which server to connect
                  to when visiting your domain.
                </p>
                <p>
                  <strong>AAAA Records</strong> are the IPv6 equivalent of A records,
                  mapping a domain to a 128-bit IPv6 address.
                </p>
                <p>
                  <strong><Link href="/tools/cname-lookup" className="text-primary hover:underline">CNAME Records</Link></strong> create an alias from one domain to
                  another. These are essential for custom domain setups in SaaS platforms,
                  where a user&apos;s domain (like <code>app.yourcompany.com</code>) points to the
                  platform&apos;s infrastructure.
                </p>
                <p>
                  <strong>MX Records</strong> specify which mail servers handle email for
                  your domain, along with priority values that determine the order servers
                  are tried.
                </p>
                <p>
                  <strong>TXT Records</strong> store text data and are commonly used for
                  domain verification (SPF, DKIM, DMARC) and proving domain ownership.
                </p>
                <p>
                  <strong>NS Records</strong> identify the authoritative name servers for
                  your domain -- the servers that hold your DNS zone data.
                </p>
                <p>
                  <strong>SOA Records</strong> contain administrative information about
                  your DNS zone, including the primary name server, admin email, and
                  timing parameters for zone transfers.
                </p>

                <h2>DNS Records for Custom Domain Setups</h2>
                <p>
                  If you&apos;re building a SaaS platform that supports custom domains, your
                  users will typically need to add a CNAME record pointing their domain to
                  your infrastructure. This is how platforms like Shopify, Notion, and
                  countless others enable branded experiences for their customers.
                </p>
                <p>
                  The process involves DNS verification (confirming the user owns the
                  domain), <Link href="/tools/ssl-checker" className="text-primary hover:underline">SSL certificate</Link> provisioning, and request routing -- which can
                  be complex to build from scratch. Tools like SaaSKevin automate this
                  entire workflow.
                </p>
              </div>

              <ToolFaq items={FAQ_ITEMS} />

              {/* Related Tools */}
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

            {/* Sidebar */}
            <ToolSidebarCta className="hidden lg:block" />
          </div>
        </div>
      </section>
    </>
  )
}
