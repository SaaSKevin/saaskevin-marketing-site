import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { CnameForm } from "@/components/tools/cname-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free CNAME Lookup & Generator | SaaSKevin",
  description:
    "Free CNAME record lookup and generator. Validate CNAME records and get provider-specific setup instructions for Cloudflare, GoDaddy, Namecheap, Route 53, Google Cloud DNS, and more.",
  alternates: { canonical: "/tools/cname-lookup" },
  keywords: [
    "cname record",
    "cname lookup",
    "how to add cname record",
    "cname setup",
    "cname generator",
    "cname checker",
    "cname validation",
  ],
  openGraph: {
    title: "Free CNAME Record Lookup & Generator | SaaSKevin",
    description:
      "Look up and validate CNAME records. Get setup instructions for all major DNS providers.",
    url: `${SITE_URL}/tools/cname-lookup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CNAME Record Lookup & Generator | SaaSKevin",
    description:
      "Look up and validate CNAME records. Get setup instructions for all major DNS providers.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a CNAME record?",
    answer:
      "A CNAME (Canonical Name) record maps one domain name to another. For example, you can point app.yourdomain.com to your-app.provider.com. The CNAME acts as an alias, directing traffic from your domain to the target domain.",
  },
  {
    question: "How do I set up a CNAME for a custom domain?",
    answer:
      "Log into your DNS provider (Cloudflare, Route 53, Google Cloud DNS, GoDaddy, Namecheap, and others), add a new CNAME record with your subdomain as the host and the target domain as the value. This tool provides step-by-step instructions for major DNS providers.",
  },
  {
    question: "Can I use a CNAME on a root domain?",
    answer:
      "The DNS specification doesn't allow CNAME records on root domains (like example.com without a subdomain) because it conflicts with other records. Some DNS providers offer workarounds like ALIAS or ANAME records that provide similar functionality at the root.",
  },
  {
    question: "How long does CNAME propagation take?",
    answer:
      "CNAME changes typically propagate within a few minutes to a few hours, but can take up to 48 hours in some cases. The propagation time depends on the TTL (Time To Live) set on the record and DNS caching across the internet.",
  },
  {
    question: "What is the difference between CNAME and A record?",
    answer:
      "An A record maps a domain directly to an IP address, while a CNAME maps a domain to another domain name. CNAMEs are more flexible for custom domain setups because if the target server's IP changes, you don't need to update the CNAME record.",
  },
]

export default function CnameLookupPage() {
  const currentTool = TOOLS.find((t) => t.slug === "cname-lookup")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "cname-lookup").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "CNAME Record Lookup & Generator",
        description:
          "Free online CNAME record lookup, validation, and setup guide with provider-specific instructions.",
        url: `${SITE_URL}/tools/cname-lookup`,
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
          { "@type": "ListItem", position: 3, name: "CNAME Lookup", item: `${SITE_URL}/tools/cname-lookup` },
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
            <span className="text-foreground">CNAME Lookup</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free CNAME Record Lookup &amp; Generator
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Check if a CNAME record is configured for any domain, or get step-by-step
                instructions for adding one with your DNS provider.
              </p>

              <CnameForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>Understanding CNAME Records</h2>
                <p>
                  A CNAME (Canonical Name) record is a type of DNS record that maps an alias
                  domain name to a canonical (true) domain name. When a DNS resolver encounters
                  a CNAME record, it replaces the alias with the canonical name and continues
                  the lookup process.
                </p>

                <h2>CNAME Records for Custom Domain Setups</h2>
                <p>
                  CNAME records are the backbone of custom domain setups in SaaS platforms.
                  When your users want to use their own domain (like <code>app.theircompany.com</code>)
                  to access your platform, they add a CNAME record pointing their domain to your
                  infrastructure (like <code>custom.yourplatform.com</code>).
                </p>
                <p>
                  The challenge for SaaS platforms is guiding users through this process,
                  verifying the records are set up correctly, and handling edge cases like
                  Cloudflare proxying, conflicting A records, and{" "}
                  <Link href="/tools/dns-propagation" className="text-primary hover:underline">propagation delays</Link>.
                  SaaSKevin provides an embeddable widget with guided setup and
                  re-verification to handle this workflow reliably. You can use our{" "}
                  <Link href="/tools/dns-lookup" className="text-primary hover:underline">DNS lookup tool</Link> to
                  verify all record types for a domain.
                </p>

                <h2>Common CNAME Setup Issues</h2>
                <p>
                  <strong>Cloudflare proxy mode:</strong> If your users use Cloudflare, the orange cloud
                  (proxy) mode can interfere with custom domain verification. Users should set
                  their CNAME to &ldquo;DNS only&rdquo; (grey cloud) during setup.
                </p>
                <p>
                  <strong>Root domain CNAMEs:</strong> Standard DNS doesn&apos;t support CNAME records
                  on root domains. Users need to use a subdomain or leverage ALIAS/ANAME records
                  if their DNS provider supports them.
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
