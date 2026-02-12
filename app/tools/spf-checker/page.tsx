import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { SpfCheckerForm } from "@/components/tools/spf-checker-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free SPF Record Checker | SaaSKevin",
  description:
    "Free SPF record checker and validator. Look up SPF records, check for syntax errors, DNS lookup limits, and common configuration issues. No signup required.",
  alternates: { canonical: "/tools/spf-checker" },
  keywords: [
    "SPF record checker",
    "SPF lookup",
    "SPF validator",
    "check SPF record",
    "SPF record lookup",
    "SPF syntax checker",
    "SPF DNS lookup limit",
    "email authentication",
  ],
  openGraph: {
    title: "Free SPF Record Checker | SaaSKevin",
    description:
      "Look up and validate SPF records for any domain. Check for syntax errors, DNS lookup limits, and common configuration issues.",
    url: `${SITE_URL}/tools/spf-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SPF Record Checker | SaaSKevin",
    description:
      "Look up and validate SPF records for any domain. Check for syntax errors, DNS lookup limits, and common configuration issues.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is an SPF record?",
    answer:
      "An SPF (Sender Policy Framework) record is a DNS TXT record that specifies which mail servers are authorized to send email on behalf of your domain. It helps receiving mail servers verify that incoming email from your domain was sent from an authorized server, reducing email spoofing and spam.",
  },
  {
    question: "What does the 10 DNS lookup limit mean?",
    answer:
      'The SPF specification (RFC 7208) limits the number of DNS lookups during SPF evaluation to 10. Each "include", "a", "mx", "ptr", "exists", and "redirect" mechanism triggers a DNS lookup. If your SPF record exceeds 10 lookups, the evaluation results in a permanent error (permError), and your email may not be delivered.',
  },
  {
    question: "What is the difference between ~all and -all?",
    answer:
      '"-all" (hardfail) tells receiving servers to reject email from unauthorized senders. "~all" (softfail) tells them to accept but mark the email as suspicious. "-all" provides stronger protection but may cause issues during migration. "~all" is more forgiving and is commonly used alongside DMARC for gradual enforcement.',
  },
  {
    question: "Can I have multiple SPF records for one domain?",
    answer:
      "No. A domain must have exactly one SPF record. If multiple SPF TXT records are found, it results in a permanent error (permError), and SPF validation fails entirely. If you need to authorize multiple senders, combine them into a single SPF record using include mechanisms.",
  },
  {
    question: "How do I fix too many DNS lookups in my SPF record?",
    answer:
      'To reduce DNS lookups, you can: (1) replace "include" mechanisms with "ip4" or "ip6" for known static IPs, (2) use SPF flattening services that resolve includes to IP addresses, (3) remove unused or redundant include mechanisms, or (4) consolidate sending services where possible. Note that ip4 and ip6 mechanisms do not count toward the lookup limit.',
  },
]

export default function SpfCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "spf-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "spf-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SPF Record Checker",
        description:
          "Free online SPF record checker and validator. Look up SPF records, check for syntax errors, DNS lookup limits, and common configuration issues.",
        url: `${SITE_URL}/tools/spf-checker`,
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
            name: "SPF Checker",
            item: `${SITE_URL}/tools/spf-checker`,
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
            <span className="text-foreground">SPF Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free SPF Record Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain to look up and validate its SPF record. Check
                for syntax errors, DNS lookup limits, and common configuration
                issues that could affect email deliverability.
              </p>

              <SpfCheckerForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is an SPF Record?</h2>
                <p>
                  SPF (Sender Policy Framework) is an email authentication
                  protocol that helps prevent email spoofing. An SPF record is a{" "}
                  <Link
                    href="/tools/txt-record-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS TXT record
                  </Link>{" "}
                  published on your domain that lists all the mail servers
                  authorized to send email on your domain&apos;s behalf.
                </p>
                <p>
                  When a receiving mail server gets an email claiming to be from
                  your domain, it checks your SPF record to verify that the
                  sending server is authorized. If the server isn&apos;t listed, the
                  email can be rejected or marked as spam, protecting your
                  domain&apos;s reputation and your recipients from phishing attacks.
                </p>

                <h2>How SPF Records Work</h2>
                <p>
                  An SPF record is a single line of text added as a TXT record
                  in your domain&apos;s{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS configuration
                  </Link>
                  . It always starts with <code>v=spf1</code> and contains a
                  series of mechanisms that define which servers can send email:
                </p>
                <ul>
                  <li>
                    <strong>include:</strong> Authorizes another domain&apos;s SPF
                    record (e.g., <code>include:_spf.google.com</code> for
                    Google Workspace).
                  </li>
                  <li>
                    <strong>ip4: / ip6:</strong> Authorizes specific IP addresses
                    or CIDR ranges.
                  </li>
                  <li>
                    <strong>a:</strong> Authorizes the IP address(es) from a
                    domain&apos;s A record.
                  </li>
                  <li>
                    <strong>mx:</strong> Authorizes the IP addresses of the
                    domain&apos;s MX (mail exchange) servers.
                  </li>
                  <li>
                    <strong>all:</strong> A catch-all mechanism, typically at the
                    end. <code>-all</code> rejects unauthorized senders;{" "}
                    <code>~all</code> marks them as suspicious.
                  </li>
                </ul>
                <p>
                  Each mechanism that requires a DNS query (include, a, mx, ptr,
                  exists, redirect) counts toward the 10 DNS lookup limit. Going
                  over this limit causes SPF to fail with a permanent error.
                </p>

                <h2>Common SPF Record Issues</h2>
                <p>
                  Even small mistakes in SPF configuration can cause legitimate
                  email to be rejected. Here are the most common problems:
                </p>
                <ul>
                  <li>
                    <strong>Too many DNS lookups:</strong> Each{" "}
                    <code>include</code>, <code>a</code>, <code>mx</code>,{" "}
                    <code>ptr</code>, <code>exists</code>, and{" "}
                    <code>redirect</code> counts as a DNS lookup. Exceeding 10
                    lookups causes a permanent failure. This is the most common
                    issue for organizations using multiple email services.
                  </li>
                  <li>
                    <strong>Multiple SPF records:</strong> A domain must have
                    exactly one SPF TXT record. Having two or more causes a
                    permanent error, even if both records are valid individually.
                  </li>
                  <li>
                    <strong>Using +all:</strong> The <code>+all</code> mechanism
                    allows any server to send email for your domain, completely
                    defeating SPF protection. Always use <code>-all</code> or{" "}
                    <code>~all</code> instead.
                  </li>
                  <li>
                    <strong>Missing all mechanism:</strong> Without a trailing{" "}
                    <code>-all</code> or <code>~all</code>, there is no default
                    policy for unlisted senders, which weakens protection.
                  </li>
                  <li>
                    <strong>Using deprecated ptr:</strong> The <code>ptr</code>{" "}
                    mechanism is deprecated in RFC 7208 because it is slow and
                    unreliable. Use <code>a</code> or <code>ip4</code> instead.
                  </li>
                </ul>

                <h2>SPF Records and Custom Domains</h2>
                <p>
                  When your SaaS platform sends email on behalf of your
                  customers using their custom domains, SPF configuration
                  becomes critical. Each custom domain needs a properly
                  configured SPF record that authorizes your platform&apos;s mail
                  servers.
                </p>
                <p>
                  For example, if your platform sends transactional emails
                  (welcome emails, password resets, notifications) from
                  a customer&apos;s domain like <code>notifications@app.customer.com</code>,
                  that domain&apos;s SPF record must include your sending
                  infrastructure. Without it, those emails will likely end up in
                  spam or be rejected entirely.
                </p>
                <p>
                  Managing SPF records across hundreds or thousands of customer
                  domains can be challenging. SaaSKevin automates web custom
                  domain onboarding with DNS routing verification, SSL
                  provisioning, and request routing. SPF, DKIM, and DMARC
                  configuration should be handled in your email platform setup.
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
