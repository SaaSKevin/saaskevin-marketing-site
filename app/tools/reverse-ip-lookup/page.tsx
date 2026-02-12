import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { ReverseIpForm } from "@/components/tools/reverse-ip-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free Reverse IP Lookup | SaaSKevin",
  description:
    "Free reverse IP lookup tool. Find the hostname associated with any IP address. Perform reverse DNS (PTR) lookups to map IPs back to domain names.",
  alternates: { canonical: "/tools/reverse-ip-lookup" },
  keywords: [
    "reverse IP lookup",
    "reverse DNS lookup",
    "IP to domain",
    "PTR record lookup",
    "reverse IP",
    "IP to hostname",
    "rDNS lookup",
    "reverse DNS check",
  ],
  openGraph: {
    title: "Free Reverse IP Lookup | SaaSKevin",
    description:
      "Find the hostname associated with any IP address. Perform reverse DNS (PTR) lookups to map IPs back to domain names.",
    url: `${SITE_URL}/tools/reverse-ip-lookup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Reverse IP Lookup | SaaSKevin",
    description:
      "Find the hostname associated with any IP address. Perform reverse DNS (PTR) lookups to map IPs back to domain names.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a reverse IP lookup?",
    answer:
      "A reverse IP lookup (also called reverse DNS or rDNS) takes an IP address and finds the hostname associated with it. This is the opposite of a standard DNS lookup, which converts a domain name into an IP address. Reverse lookups use PTR (Pointer) records stored in special reverse DNS zones.",
  },
  {
    question: "What is a PTR record?",
    answer:
      "A PTR (Pointer) record is a type of DNS record that maps an IP address to a hostname. PTR records are stored in reverse DNS zones (in-addr.arpa for IPv4 and ip6.arpa for IPv6). They are typically configured by the IP address owner, such as a hosting provider or ISP.",
  },
  {
    question: "Why does my IP not have a PTR record?",
    answer:
      "Not all IP addresses have PTR records. PTR records must be configured by the owner of the IP address block, which is usually a hosting provider or ISP. Many residential IPs and some cloud-hosted IPs may not have PTR records set up. If you need a PTR record, contact your hosting provider to configure one.",
  },
  {
    question: "What does forward-confirmed reverse DNS mean?",
    answer:
      "Forward-confirmed reverse DNS (FCrDNS) means that a hostname found through a reverse DNS lookup also resolves back to the original IP address in a forward lookup. This two-way verification is important for validating that the IP address and hostname genuinely belong together, and is commonly used in email authentication and spam prevention.",
  },
  {
    question: "How is reverse DNS used in email deliverability?",
    answer:
      "Many email servers check the reverse DNS of the sending server's IP address as part of spam filtering. If the sending IP lacks a PTR record, or if the PTR record does not forward-confirm back to the same IP, the email may be flagged as spam or rejected entirely. Properly configured reverse DNS is considered a best practice for email deliverability.",
  },
]

export default function ReverseIpLookupPage() {
  const currentTool = TOOLS.find((t) => t.slug === "reverse-ip-lookup")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "reverse-ip-lookup").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Reverse IP Lookup Tool",
        description:
          "Free online reverse IP lookup tool. Find the hostname associated with any IP address using reverse DNS (PTR) record lookups.",
        url: `${SITE_URL}/tools/reverse-ip-lookup`,
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
            name: "Reverse IP Lookup",
            item: `${SITE_URL}/tools/reverse-ip-lookup`,
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
            <span className="text-foreground">Reverse IP Lookup</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Reverse IP Lookup
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any IP address to find the hostname associated with it.
                This tool performs a reverse DNS lookup using PTR records and
                verifies the results with forward confirmation.
              </p>

              <ReverseIpForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is Reverse DNS?</h2>
                <p>
                  Reverse DNS (rDNS) is the process of resolving an IP address
                  back to a hostname. While standard{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS lookups
                  </Link>{" "}
                  translate domain names into IP addresses, reverse DNS does the
                  opposite -- it takes an IP address and returns the associated
                  domain name. This is accomplished through PTR (Pointer)
                  records, which are stored in a special reverse DNS zone.
                </p>
                <p>
                  For IPv4 addresses, reverse DNS uses the{" "}
                  <code>in-addr.arpa</code> domain. For example, the reverse
                  lookup for <code>8.8.8.8</code> queries{" "}
                  <code>8.8.8.8.in-addr.arpa</code>. For IPv6 addresses, the{" "}
                  <code>ip6.arpa</code> domain is used, with each nibble of the
                  expanded address reversed and separated by dots.
                </p>

                <h2>How PTR Records Work</h2>
                <p>
                  PTR records are the DNS record type used for reverse lookups.
                  Unlike A records or CNAME records that are managed by the
                  domain owner, PTR records are managed by the owner of the IP
                  address block -- typically a hosting provider, cloud platform,
                  or ISP.
                </p>
                <p>
                  When you perform a reverse IP lookup, the DNS resolver queries
                  the appropriate reverse zone for a PTR record. If one exists,
                  it returns the hostname. A well-configured PTR record should
                  also pass forward confirmation, meaning the returned hostname
                  should resolve back to the original IP address when you perform
                  a standard{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS lookup
                  </Link>{" "}
                  on it. This two-way match is called Forward-Confirmed Reverse
                  DNS (FCrDNS).
                </p>

                <h2>Why Use Reverse IP Lookup?</h2>
                <p>
                  Reverse IP lookup is useful in many scenarios:
                </p>
                <ul>
                  <li>
                    <strong>Email deliverability:</strong> Most email servers
                    check the reverse DNS of the sending IP. Without a valid PTR
                    record, your emails are more likely to be flagged as spam.
                  </li>
                  <li>
                    <strong>Security investigations:</strong> When analyzing
                    server logs, reverse DNS helps identify who is connecting to
                    your servers by mapping IP addresses to recognizable
                    hostnames.
                  </li>
                  <li>
                    <strong>Network diagnostics:</strong> System administrators
                    use reverse DNS to troubleshoot connectivity issues and
                    verify that IP allocations are correctly configured.
                  </li>
                  <li>
                    <strong>
                      <Link
                        href="/tools/whois-lookup"
                        className="text-primary hover:underline"
                      >
                        WHOIS
                      </Link>{" "}
                      and ownership verification:
                    </strong>{" "}
                    Reverse DNS can help confirm the organization behind an IP
                    address, complementing WHOIS data.
                  </li>
                  <li>
                    <strong>Spam prevention:</strong> Anti-spam systems use
                    forward-confirmed reverse DNS as one factor in determining
                    whether to accept incoming connections.
                  </li>
                </ul>

                <h2>Reverse DNS and Custom Domains</h2>
                <p>
                  When running a SaaS platform that supports custom domains,
                  reverse DNS is usually a separate concern from web domain
                  routing. PTR records are managed by whoever controls the IP
                  address block (typically your hosting or email provider), not
                  by the customer who owns the domain.
                </p>
                <p>
                  SaaSKevin focuses on web custom domain onboarding: DNS routing
                  verification, SSL provisioning, and request routing. If your
                  platform sends email, configure reverse DNS with your mail
                  infrastructure provider separately.
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
