import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { SubdomainFinderForm } from "@/components/tools/subdomain-finder-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free Subdomain Finder | SaaSKevin",
  description:
    "Free subdomain finder tool. Discover subdomains for any domain using DNS enumeration of common subdomain names. No signup required.",
  alternates: { canonical: "/tools/subdomain-finder" },
  keywords: [
    "subdomain finder",
    "find subdomains",
    "subdomain scanner",
    "subdomain enumeration",
    "subdomain lookup",
    "subdomain discovery",
    "dns enumeration",
    "subdomain checker",
  ],
  openGraph: {
    title: "Free Subdomain Finder | SaaSKevin",
    description:
      "Discover subdomains for any domain. Find existing subdomains using DNS enumeration of common subdomain names.",
    url: `${SITE_URL}/tools/subdomain-finder`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Subdomain Finder | SaaSKevin",
    description:
      "Discover subdomains for any domain. Find existing subdomains using DNS enumeration of common subdomain names.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a subdomain?",
    answer:
      "A subdomain is a prefix added to a domain name, separated by a dot. For example, in 'blog.example.com', 'blog' is the subdomain of 'example.com'. Subdomains are used to organize different sections or services under a single domain, such as mail.example.com for email or api.example.com for an API.",
  },
  {
    question: "How does subdomain enumeration work?",
    answer:
      "Subdomain enumeration works by testing a list of common subdomain names against a target domain via DNS lookups. For each candidate (e.g., 'www', 'mail', 'api'), the tool attempts to resolve the full hostname (like www.example.com) to an IP address. If the DNS query returns a valid A record, the subdomain exists.",
  },
  {
    question: "Is subdomain scanning legal?",
    answer:
      "DNS lookups are public queries -- resolving domain names to IP addresses is a fundamental part of how the internet works. Subdomain enumeration using DNS is generally considered acceptable. However, you should only scan domains you own or have authorization to test, and always follow responsible disclosure practices.",
  },
  {
    question: "Why can't the tool find all subdomains?",
    answer:
      "This tool checks a curated list of approximately 80 common subdomain names. Domains may have subdomains with custom or uncommon names that aren't in the wordlist. Additionally, some subdomains may use wildcard DNS, private DNS zones, or may not have public A records, which would prevent discovery through this method.",
  },
  {
    question: "How are subdomains used in SaaS platforms?",
    answer:
      "SaaS platforms commonly use subdomains to provide tenant-specific access points (e.g., acme.app.com) or to support custom domain functionality where customers map their own subdomains to the platform. This requires DNS configuration (usually a CNAME record), SSL certificate provisioning, and request routing -- all of which can be automated with tools like SaaSKevin.",
  },
]

export default function SubdomainFinderPage() {
  const currentTool = TOOLS.find((t) => t.slug === "subdomain-finder")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "subdomain-finder").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Subdomain Finder Tool",
        description:
          "Free online subdomain finder tool. Discover subdomains for any domain using DNS enumeration of common subdomain names.",
        url: `${SITE_URL}/tools/subdomain-finder`,
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
            name: "Subdomain Finder",
            item: `${SITE_URL}/tools/subdomain-finder`,
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
            <span className="text-foreground">Subdomain Finder</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Subdomain Finder
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any root domain to discover its subdomains. This tool
                checks common subdomain names using DNS A record lookups to find
                active subdomains and their IP addresses.
              </p>

              <SubdomainFinderForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What Are Subdomains?</h2>
                <p>
                  A subdomain is a subdivision of a domain name in the Domain
                  Name System (DNS) hierarchy. It appears as a prefix before the
                  main domain, separated by a dot -- for example,{" "}
                  <code>blog.example.com</code> or <code>api.example.com</code>.
                  Subdomains allow organizations to structure different services,
                  departments, or applications under a single root domain without
                  needing to register additional domain names.
                </p>
                <p>
                  Common uses include hosting a blog (<code>blog.</code>),
                  running a web application (<code>app.</code>), exposing an API
                  (<code>api.</code>), or separating staging and production
                  environments (<code>staging.</code>, <code>dev.</code>). Each
                  subdomain can point to a completely different server or IP
                  address through its own{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS records
                  </Link>
                  .
                </p>

                <h2>Why Discover Subdomains?</h2>
                <p>
                  Subdomain discovery is a valuable practice for several
                  reasons:
                </p>
                <ul>
                  <li>
                    <strong>Security auditing:</strong> Knowing all active
                    subdomains helps identify forgotten or abandoned services
                    that might be vulnerable. Shadow IT and legacy applications
                    running on old subdomains can become attack vectors if left
                    unpatched.
                  </li>
                  <li>
                    <strong>Asset inventory:</strong> Organizations often lose
                    track of subdomains over time as teams create new services.
                    Regular enumeration ensures a complete picture of your
                    domain&apos;s footprint.
                  </li>
                  <li>
                    <strong>Competitive research:</strong> Understanding a
                    competitor&apos;s subdomain structure can reveal the
                    technologies and services they use, from CDN providers to
                    development workflows.
                  </li>
                  <li>
                    <strong>Migration planning:</strong> Before migrating DNS
                    providers or restructuring your domain, a full subdomain
                    inventory ensures nothing gets left behind.
                  </li>
                </ul>

                <h2>How Subdomain Enumeration Works</h2>
                <p>
                  This tool uses dictionary-based DNS enumeration, one of the
                  most common and effective techniques. It works by taking a
                  curated wordlist of common subdomain names (like{" "}
                  <code>www</code>, <code>mail</code>, <code>api</code>,{" "}
                  <code>admin</code>, etc.) and performing DNS A record lookups
                  for each candidate against the target domain.
                </p>
                <p>
                  For each candidate subdomain, the tool constructs the full
                  hostname (e.g., <code>api.example.com</code>) and queries DNS
                  servers to resolve it to an IP address. If the query returns a
                  valid A record, the subdomain exists and is active. The
                  lookups run in parallel with a concurrency limit to balance
                  speed and reliability.
                </p>
                <p>
                  Other enumeration techniques include certificate transparency
                  log scanning, search engine dorking, and zone transfer
                  attempts -- though zone transfers are rarely permitted on
                  properly configured servers. You can verify the DNS
                  configuration of any discovered subdomain using our{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS Lookup tool
                  </Link>{" "}
                  or check its{" "}
                  <Link
                    href="/tools/cname-lookup"
                    className="text-primary hover:underline"
                  >
                    CNAME records
                  </Link>{" "}
                  to understand how it&apos;s routed.
                </p>

                <h2>Subdomains and Custom Domain Setups</h2>
                <p>
                  Subdomains play a central role in SaaS platforms that support
                  custom domains. A typical pattern is multi-tenant subdomains
                  where each customer gets their own subdomain (e.g.,{" "}
                  <code>acme.yourapp.com</code>,{" "}
                  <code>globex.yourapp.com</code>). This allows SaaS platforms
                  to provide branded, isolated experiences for each tenant.
                </p>
                <p>
                  When a SaaS customer wants to use their own custom domain
                  instead, they typically create a{" "}
                  <Link
                    href="/tools/cname-lookup"
                    className="text-primary hover:underline"
                  >
                    CNAME record
                  </Link>{" "}
                  pointing their subdomain (like <code>app.acme.com</code>) to
                  the platform&apos;s hostname. The platform then needs to verify
                  DNS ownership, provision an SSL certificate, and route incoming
                  requests to the correct tenant.
                </p>
                <p>
                  Building this infrastructure from scratch involves handling DNS
                  verification, certificate automation (via Let&apos;s Encrypt or
                  similar CAs), subdomain routing, and DNS provider edge cases.
                  SaaSKevin automates this workflow, letting you offer custom
                  domains to your users without building and maintaining the
                  underlying infrastructure.
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
