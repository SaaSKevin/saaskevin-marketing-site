import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { TxtRecordForm } from "@/components/tools/txt-record-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free TXT Record Lookup | SaaSKevin",
  description:
    "Look up and categorize TXT records for any domain. Identify SPF, DKIM, DMARC, domain verification, and other TXT records instantly. No signup required.",
  alternates: { canonical: "/tools/txt-record-lookup" },
  keywords: [
    "TXT record lookup",
    "check TXT records",
    "domain verification record",
    "TXT record checker",
    "DNS TXT lookup",
    "SPF record lookup",
    "DMARC record lookup",
    "domain ownership verification",
  ],
  openGraph: {
    title: "Free TXT Record Lookup | SaaSKevin",
    description:
      "Look up and categorize TXT records for any domain. Identify SPF, DKIM, DMARC, domain verification, and other TXT records.",
    url: `${SITE_URL}/tools/txt-record-lookup`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free TXT Record Lookup | SaaSKevin",
    description:
      "Look up and categorize TXT records for any domain. Identify SPF, DKIM, DMARC, domain verification, and other TXT records.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What are TXT records in DNS?",
    answer:
      "TXT (Text) records are a type of DNS record that store arbitrary text data associated with a domain. They are commonly used for domain verification (proving you own a domain to third-party services), email authentication (SPF, DKIM, DMARC), and storing machine-readable data like security policies.",
  },
  {
    question: "How many TXT records can a domain have?",
    answer:
      "There is no hard limit on the number of TXT records a domain can have. Most domains have several TXT records covering SPF, DMARC, and one or more verification records for services like Google, Microsoft, or Facebook. However, individual TXT records are limited to 255 characters per string, though multiple strings can be concatenated.",
  },
  {
    question: "What is the difference between SPF, DKIM, and DMARC?",
    answer:
      "SPF (Sender Policy Framework) specifies which mail servers can send email for your domain. DKIM (DomainKeys Identified Mail) adds a cryptographic signature to outgoing emails to verify they haven't been tampered with. DMARC (Domain-based Message Authentication, Reporting, and Conformance) ties SPF and DKIM together and tells receiving servers what to do when authentication fails -- such as quarantine or reject the message.",
  },
  {
    question: "Why do I see verification records in my TXT records?",
    answer:
      "Services like Google, Microsoft, Facebook, and many other platforms require you to add a unique TXT record to your DNS to prove you own the domain. Once verified, you can use services such as Google Search Console, Microsoft 365, or Meta Business Suite. These records are safe to leave in place after verification.",
  },
  {
    question: "How long does it take for TXT record changes to propagate?",
    answer:
      "TXT record changes typically propagate within a few minutes to a few hours, depending on the TTL (Time To Live) of the existing record and the DNS provider. In most cases, changes are visible worldwide within 1-4 hours, though it can occasionally take up to 48 hours.",
  },
]

export default function TxtRecordLookupPage() {
  const currentTool = TOOLS.find((t) => t.slug === "txt-record-lookup")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "txt-record-lookup").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "TXT Record Lookup Tool",
        description:
          "Free online TXT record lookup tool. Look up and categorize TXT records for any domain including SPF, DMARC, and verification records.",
        url: `${SITE_URL}/tools/txt-record-lookup`,
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
            name: "TXT Record Lookup",
            item: `${SITE_URL}/tools/txt-record-lookup`,
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
            <span className="text-foreground">TXT Record Lookup</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free TXT Record Lookup
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain name to look up its TXT records. Records are
                automatically categorized into SPF, DMARC, verification, and
                other types with detailed explanations.
              </p>

              <TxtRecordForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What Are TXT Records?</h2>
                <p>
                  TXT (Text) records are a versatile type of DNS record that
                  allow domain administrators to store arbitrary text data in
                  their DNS configuration. Unlike A records (which point to IP
                  addresses) or MX records (which route email), TXT records carry
                  human- and machine-readable text that serves a wide range of
                  purposes.
                </p>
                <p>
                  Originally designed for general-purpose notes, TXT records have
                  become the backbone of email authentication and domain
                  verification on the modern internet. Nearly every domain on the
                  web has at least one TXT record, and most have several -- for
                  SPF, DMARC, and service verification.
                </p>

                <h2>Common TXT Record Types</h2>

                <h3>SPF (Sender Policy Framework)</h3>
                <p>
                  SPF records start with <code>v=spf1</code> and define which
                  mail servers are authorized to send email on behalf of your
                  domain. When a receiving server gets an email claiming to be
                  from your domain, it checks your SPF record to verify the
                  sending server is on the approved list. This is a critical
                  defense against email spoofing. Use our{" "}
                  <Link
                    href="/tools/spf-checker"
                    className="text-primary hover:underline"
                  >
                    SPF Record Checker
                  </Link>{" "}
                  for a detailed SPF analysis.
                </p>

                <h3>DKIM (DomainKeys Identified Mail)</h3>
                <p>
                  DKIM records are published as TXT records at specific
                  subdomains (e.g.,{" "}
                  <code>selector._domainkey.example.com</code>). They contain
                  public keys used to verify the cryptographic signatures
                  attached to outgoing emails. This ensures that email content
                  has not been altered in transit and confirms the sender&apos;s
                  identity.
                </p>

                <h3>DMARC (Domain-based Message Authentication)</h3>
                <p>
                  DMARC records are published at <code>_dmarc.example.com</code>{" "}
                  and tie together SPF and DKIM. They instruct receiving mail
                  servers on what to do when an email fails authentication --
                  whether to allow it, quarantine it, or reject it outright.
                  DMARC also enables reporting so domain owners can monitor
                  authentication failures. Check your DMARC setup with our{" "}
                  <Link
                    href="/tools/dmarc-checker"
                    className="text-primary hover:underline"
                  >
                    DMARC Record Checker
                  </Link>
                  .
                </p>

                <h3>Verification Records</h3>
                <p>
                  Many services -- including Google, Microsoft, Facebook,
                  Atlassian, Adobe, and others -- require you to add a unique TXT
                  record to prove you own a domain. These records typically
                  follow a pattern like{" "}
                  <code>google-site-verification=abc123</code>. Once verified,
                  you gain access to the service&apos;s domain-specific features such
                  as Google Search Console, Microsoft 365 admin, or Meta Business
                  tools.
                </p>

                <h2>TXT Records for Domain Verification</h2>
                <p>
                  Domain verification via TXT records is the most widely
                  accepted method for proving domain ownership across the
                  internet. The process is straightforward: a service generates a
                  unique token, you add it as a TXT record in your DNS, and the
                  service queries your DNS to confirm the record exists. Because
                  only a domain&apos;s administrator can modify its DNS records, the
                  presence of the token proves ownership.
                </p>
                <p>
                  Many SaaS platforms use this same pattern to verify that
                  customers control the domains they want to connect. Other
                  platforms use routing-based verification (for example, checking
                  required CNAME or A records) depending on their architecture.
                </p>

                <h2>TXT Records and Custom Domains</h2>
                <p>
                  For SaaS platforms that support custom domains, TXT record
                  verification can be part of the domain onboarding workflow.
                  Depending on implementation, platforms may verify domain
                  control via TXT tokens or by validating required routing
                  records before activating SSL and traffic.
                </p>
                <p>
                  SaaSKevin verifies custom domains by checking that required
                  routing records (CNAME for subdomains, A/AAAA for apex
                  domains) resolve to expected targets. Once routing checks pass,
                  SSL provisioning and traffic routing proceed automatically.
                </p>
                <p>
                  Combined with{" "}
                  <Link
                    href="/tools/cname-lookup"
                    className="text-primary hover:underline"
                  >
                    CNAME records
                  </Link>{" "}
                  for traffic routing and automatic SSL certificate management,
                  this creates a secure and trustworthy custom domain experience
                  for your users. You can inspect the full DNS configuration for
                  any domain with our{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS Lookup Tool
                  </Link>
                  .
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
