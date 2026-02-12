import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DomainAvailabilityForm } from "@/components/tools/domain-availability-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"
import { PRICING_COPY } from "@/lib/marketing-constants"

export const metadata: Metadata = {
  title: "Free Domain Availability Checker | SaaSKevin",
  description:
    "Check if a domain name is available or taken across multiple TLDs. Search .com, .io, .dev, .app, .co, and more. No signup required.",
  alternates: { canonical: "/tools/domain-availability-checker" },
  keywords: [
    "domain availability checker",
    "check if domain is available",
    "domain name search",
    "is domain taken",
    "domain check",
    "domain name availability",
    "bulk domain checker",
    "domain TLD search",
  ],
  openGraph: {
    title: "Free Domain Availability Checker | SaaSKevin",
    description:
      "Check if a domain name is available or taken across multiple TLDs. Search .com, .io, .dev, .app, .co, and more.",
    url: `${SITE_URL}/tools/domain-availability-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Domain Availability Checker | SaaSKevin",
    description:
      "Check if a domain name is available or taken across multiple TLDs. Search .com, .io, .dev, .app, .co, and more.",
  },
}

const FAQ_ITEMS = [
  {
    question: "How does the domain availability checker work?",
    answer:
      "The tool checks domain availability by performing DNS lookups against each TLD. It first attempts to resolve A records (IPv4 addresses) for the domain. If that fails, it checks for NS (name server) records as a fallback. If neither resolves, the domain is likely available for registration.",
  },
  {
    question: "Is this checker 100% accurate?",
    answer:
      "DNS-based checks are a fast way to gauge availability, but they are not always 100% accurate. Some registered domains may not have active DNS records, and some newly registered domains may not have propagated yet. For definitive results, check with a domain registrar before purchasing.",
  },
  {
    question: "What TLDs does this tool check?",
    answer:
      "The tool checks 10 popular TLDs: .com, .io, .dev, .app, .co, .net, .org, .ai, .so, and .me. These cover the most common choices for businesses, startups, SaaS products, and developer tools.",
  },
  {
    question: "Can I register a domain directly from this tool?",
    answer:
      "This tool only checks availability. To register a domain, you will need to use a domain registrar such as Namecheap, Google Domains, Cloudflare Registrar, or GoDaddy. Once you find an available domain here, head to your preferred registrar to complete the purchase.",
  },
  {
    question: "Why does a domain show as available but I cannot register it?",
    answer:
      "Some domains may appear available via DNS checks but are actually reserved, premium-priced, or held by the registry. Certain TLDs also have registration restrictions (e.g., .app requires HTTPS, .dev is HSTS-preloaded). Always verify with a registrar for the most up-to-date status and pricing.",
  },
]

export default function DomainAvailabilityCheckerPage() {
  const currentTool = TOOLS.find(
    (t) => t.slug === "domain-availability-checker",
  )
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "domain-availability-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Domain Availability Checker",
        description:
          "Free online domain availability checker. Check if a domain name is available or taken across multiple TLDs including .com, .io, .dev, .app, .co, and more.",
        url: `${SITE_URL}/tools/domain-availability-checker`,
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
            name: "Domain Availability Checker",
            item: `${SITE_URL}/tools/domain-availability-checker`,
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
            <span className="text-foreground">Domain Availability</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Domain Availability Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter a domain name to instantly check availability across 10
                popular TLDs including .com, .io, .dev, .app, .co, .net, .org,
                .ai, .so, and .me.
              </p>

              <DomainAvailabilityForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>How to Check Domain Availability</h2>
                <p>
                  Finding the right domain name is one of the first steps in
                  launching a new project, startup, or SaaS product. Simply
                  enter a domain name (without the TLD) into the search box
                  above, and the tool will check whether that name is available
                  across 10 popular top-level domains simultaneously.
                </p>
                <p>
                  The checker uses DNS resolution to determine availability. If
                  a domain has active DNS records (A records or NS records), it
                  is marked as taken. If no DNS records are found, the domain is
                  likely available for registration. For a deeper dive into a
                  taken domain, use our{" "}
                  <Link
                    href="/tools/whois-lookup"
                    className="text-primary hover:underline"
                  >
                    WHOIS Lookup
                  </Link>{" "}
                  tool to see registrar details, expiration dates, and more.
                </p>

                <h2>Choosing the Right TLD</h2>
                <p>
                  The TLD (top-level domain) you choose sends a signal about
                  your brand and audience. Here is a quick guide to the TLDs
                  this tool checks:
                </p>
                <ul>
                  <li>
                    <strong>.com</strong> -- The most recognized and trusted TLD.
                    Ideal for any business or product. Always check .com first.
                  </li>
                  <li>
                    <strong>.io</strong> -- Popular with tech startups and
                    developer tools. Widely recognized in the SaaS industry.
                  </li>
                  <li>
                    <strong>.dev</strong> -- Designed for developers and
                    technology projects. Requires HTTPS (HSTS-preloaded).
                  </li>
                  <li>
                    <strong>.app</strong> -- Great for mobile and web
                    applications. Also HSTS-preloaded for security.
                  </li>
                  <li>
                    <strong>.co</strong> -- A shorter alternative to .com.
                    Popular with startups and used as a &quot;company&quot; abbreviation.
                  </li>
                  <li>
                    <strong>.net</strong> -- Originally for network
                    infrastructure, now a solid general-purpose alternative to
                    .com.
                  </li>
                  <li>
                    <strong>.org</strong> -- Traditionally for organizations and
                    nonprofits, but open to anyone.
                  </li>
                  <li>
                    <strong>.ai</strong> -- Extremely popular for AI and machine
                    learning startups. Premium pricing but high brand value.
                  </li>
                  <li>
                    <strong>.so</strong> -- A clean, memorable TLD. Sometimes
                    used creatively (e.g., &quot;let.so&quot;, &quot;build.so&quot;).
                  </li>
                  <li>
                    <strong>.me</strong> -- Great for personal brands, portfolios,
                    and about-me style sites.
                  </li>
                </ul>

                <h2>What to Do When a Domain Is Taken</h2>
                <p>
                  If the .com you want is taken, do not panic. Here are a few
                  strategies:
                </p>
                <ul>
                  <li>
                    <strong>Try a different TLD.</strong> If <code>myapp.com</code>{" "}
                    is taken, <code>myapp.io</code> or <code>myapp.dev</code>{" "}
                    might be available.
                  </li>
                  <li>
                    <strong>Add a prefix or suffix.</strong> Consider{" "}
                    <code>getmyapp.com</code>, <code>trymyapp.com</code>, or{" "}
                    <code>myapphq.com</code>.
                  </li>
                  <li>
                    <strong>Check WHOIS for expiration.</strong> Use our{" "}
                    <Link
                      href="/tools/whois-lookup"
                      className="text-primary hover:underline"
                    >
                      WHOIS Lookup
                    </Link>{" "}
                    to see if the domain is expiring soon. Expired domains can
                    sometimes be acquired.
                  </li>
                  <li>
                    <strong>Explore domain marketplaces.</strong> Platforms like
                    Sedo, Afternic, and Dan.com list domains for sale by their
                    current owners.
                  </li>
                  <li>
                    <strong>Verify DNS records.</strong> Use our{" "}
                    <Link
                      href="/tools/dns-lookup"
                      className="text-primary hover:underline"
                    >
                      DNS Lookup
                    </Link>{" "}
                    to see if a taken domain is actually being used or is just
                    parked.
                  </li>
                </ul>

                <h2>Custom Domains for SaaS</h2>
                <p>
                  If you are building a SaaS platform, domain availability is
                  not just about finding a name for your product -- it is also
                  about enabling your users to bring their own custom domains.
                  Whether you are building a website builder, email platform, or
                  any white-label service, letting users connect their own
                  domains creates a professional, branded experience.
                </p>
                <p>
                  Implementing custom domain support involves DNS verification,
                  SSL certificate provisioning, and request routing -- all of
                  which can be complex to build and maintain. SaaSKevin automates
                  this entire workflow: your users add a CNAME or A record
                  pointing to your infrastructure, and SaaSKevin handles
                  verification, SSL issuance, and traffic routing automatically.
                </p>
                <p>
                  With SaaSKevin, you can offer custom domain support to your
                  users without building the infrastructure yourself. Get
                  started with {PRICING_COPY.freeCustomDomains}.
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
