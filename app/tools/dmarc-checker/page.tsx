import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DmarcCheckerForm } from "@/components/tools/dmarc-checker-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free DMARC Record Checker | SaaSKevin",
  description:
    "Look up and validate DMARC records for any domain. Check policy settings, alignment mode, reporting configuration, and get actionable recommendations.",
  alternates: { canonical: "/tools/dmarc-checker" },
  keywords: [
    "DMARC checker",
    "DMARC record lookup",
    "check DMARC",
    "DMARC validator",
    "DMARC policy checker",
    "DMARC record checker",
    "DMARC reporting",
    "email authentication",
  ],
  openGraph: {
    title: "Free DMARC Record Checker | SaaSKevin",
    description:
      "Look up and validate DMARC records for any domain. Check policy settings, alignment, and reporting configuration.",
    url: `${SITE_URL}/tools/dmarc-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DMARC Record Checker | SaaSKevin",
    description:
      "Look up and validate DMARC records for any domain. Check policy settings, alignment, and reporting configuration.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a DMARC record?",
    answer:
      "A DMARC (Domain-based Message Authentication, Reporting, and Conformance) record is a TXT record published at _dmarc.yourdomain.com in DNS. It tells receiving mail servers what to do with emails that fail SPF and DKIM authentication checks -- whether to deliver, quarantine, or reject them.",
  },
  {
    question: "How do I add a DMARC record to my domain?",
    answer:
      'Add a TXT record at _dmarc.yourdomain.com with a value starting with "v=DMARC1". A basic starting record looks like: v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com. Start with p=none to monitor, then move to p=quarantine or p=reject once you\'re confident in your email authentication setup.',
  },
  {
    question: "What is the difference between DMARC policies: none, quarantine, and reject?",
    answer:
      '"none" means take no action (monitor only) -- emails are still delivered even if they fail checks. "quarantine" tells the receiving server to treat failures as suspicious, typically moving them to spam. "reject" instructs servers to block failing emails entirely. Most organizations start with "none" and progressively tighten to "reject".',
  },
  {
    question: "Do I need both SPF and DKIM for DMARC to work?",
    answer:
      "DMARC requires either SPF or DKIM to pass and align with the From header domain -- not necessarily both. However, configuring both SPF and DKIM significantly improves deliverability and provides redundancy. If one mechanism fails, the other can still allow the message to pass DMARC.",
  },
  {
    question: "What are DMARC aggregate reports (rua)?",
    answer:
      "Aggregate reports are XML summaries sent by receiving mail servers to the address specified in your rua= tag. They show how many emails passed or failed DMARC checks, which IP addresses sent email on your behalf, and the SPF/DKIM results. These reports are essential for monitoring your domain and identifying unauthorized senders.",
  },
]

export default function DmarcCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "dmarc-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "dmarc-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DMARC Record Checker",
        description:
          "Free online DMARC record checker. Look up and validate DMARC records, check policy settings, alignment, and reporting configuration for any domain.",
        url: `${SITE_URL}/tools/dmarc-checker`,
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
            name: "DMARC Checker",
            item: `${SITE_URL}/tools/dmarc-checker`,
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
            <span className="text-foreground">DMARC Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free DMARC Record Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain to look up its DMARC record. Check policy
                settings, DKIM and SPF alignment, reporting configuration, and
                get actionable recommendations.
              </p>

              <DmarcCheckerForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is DMARC?</h2>
                <p>
                  DMARC (Domain-based Message Authentication, Reporting, and
                  Conformance) is an email authentication protocol that builds on
                  top of{" "}
                  <Link
                    href="/tools/spf-checker"
                    className="text-primary hover:underline"
                  >
                    SPF
                  </Link>{" "}
                  and DKIM. It allows domain owners to specify how receiving mail
                  servers should handle emails that fail authentication checks,
                  and provides a reporting mechanism so you can monitor who is
                  sending email on behalf of your domain.
                </p>
                <p>
                  DMARC records are published as{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS TXT records
                  </Link>{" "}
                  at <code>_dmarc.yourdomain.com</code>. When a receiving mail
                  server gets an email claiming to be from your domain, it looks
                  up your DMARC record to determine the authentication policy
                  and decides whether to deliver, quarantine, or reject the
                  message.
                </p>

                <h2>How DMARC Works</h2>
                <p>
                  DMARC works through a three-step process that ties together
                  existing email authentication mechanisms:
                </p>
                <p>
                  <strong>1. Authentication:</strong> The receiving mail server
                  checks the incoming email against both SPF (which verifies the
                  sending server&apos;s IP is authorized) and DKIM (which verifies
                  the email&apos;s cryptographic signature). At least one of these
                  must pass for DMARC to succeed.
                </p>
                <p>
                  <strong>2. Alignment:</strong> DMARC adds a critical alignment
                  check that SPF and DKIM alone don&apos;t provide. The domain in
                  the visible &quot;From&quot; header must align with the domain
                  authenticated by SPF or DKIM. This prevents attackers from
                  passing SPF/DKIM with their own domain while spoofing your
                  domain in the From header.
                </p>
                <p>
                  <strong>3. Policy enforcement:</strong> Based on the DMARC
                  policy (p=none, p=quarantine, or p=reject), the receiving
                  server takes the specified action on emails that fail both
                  authentication and alignment.
                </p>

                <h2>DMARC Policies Explained</h2>
                <p>
                  The <code>p=</code> tag in a DMARC record defines the policy
                  that receiving servers should apply to emails that fail DMARC
                  checks:
                </p>
                <p>
                  <strong>p=none (Monitor):</strong> This is the starting point
                  for most organizations. No enforcement action is taken --
                  emails that fail DMARC are still delivered normally. The
                  purpose is to collect reports and understand your email
                  ecosystem before applying restrictions. This policy lets you
                  identify all legitimate senders before tightening enforcement.
                </p>
                <p>
                  <strong>p=quarantine (Suspicious):</strong> Emails failing
                  DMARC checks are treated as suspicious. In practice, this
                  usually means they are routed to the recipient&apos;s spam or
                  junk folder. This is a good intermediate step -- it protects
                  recipients while giving you a safety net if legitimate emails
                  are misconfigured.
                </p>
                <p>
                  <strong>p=reject (Block):</strong> The strictest policy.
                  Emails failing DMARC are outright rejected by the receiving
                  server and never reach the recipient. This provides the
                  strongest protection against phishing and spoofing, but
                  requires confidence that all legitimate email sources are
                  properly authenticated.
                </p>
                <p>
                  The recommended approach is a gradual rollout: start with{" "}
                  <code>p=none</code> to gather data, move to{" "}
                  <code>p=quarantine</code> once you have verified legitimate
                  senders, and finally upgrade to <code>p=reject</code> for
                  maximum protection. Use the <code>pct=</code> tag to
                  incrementally apply the policy to a percentage of your email.
                </p>

                <h2>DMARC and Custom Domains</h2>
                <p>
                  For SaaS platforms that allow users to bring their own custom
                  domains, DMARC creates an important consideration for email
                  deliverability. When your platform sends emails on behalf of
                  customers using their custom domains (e.g., transactional
                  emails, notifications, or marketing emails), those emails must
                  pass the customer&apos;s DMARC policy.
                </p>
                <p>
                  If a customer has a strict DMARC policy (<code>p=reject</code>
                  ) and your platform&apos;s sending infrastructure isn&apos;t properly
                  configured in their SPF record or DKIM signing, emails sent
                  from your platform using their domain will be rejected. This
                  can lead to missed notifications, broken user flows, and
                  frustrated customers.
                </p>
                <p>
                  The solution involves proper{" "}
                  <Link
                    href="/tools/spf-checker"
                    className="text-primary hover:underline"
                  >
                    SPF configuration
                  </Link>
                  , DKIM signing with the customer&apos;s domain, and careful{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS record management
                  </Link>
                  . SaaSKevin automates web custom domain onboarding with DNS
                  routing verification, SSL provisioning, and request routing.
                  DMARC, SPF, and DKIM policy configuration should still be
                  managed in your email sending infrastructure.
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
