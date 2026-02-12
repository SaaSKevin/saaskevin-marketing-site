import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DkimCheckerForm } from "@/components/tools/dkim-checker-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free DKIM Record Checker | SaaSKevin",
  description:
    "Look up and validate DKIM records for any domain and selector. Verify DKIM key configuration, check key length, and identify common issues. No signup required.",
  alternates: { canonical: "/tools/dkim-checker" },
  keywords: [
    "DKIM checker",
    "DKIM record lookup",
    "check DKIM",
    "DKIM validator",
    "DKIM key lookup",
    "DKIM selector lookup",
    "DKIM record checker",
    "verify DKIM",
  ],
  openGraph: {
    title: "Free DKIM Record Checker | SaaSKevin",
    description:
      "Look up and validate DKIM records for any domain and selector. Verify DKIM key configuration and check for common issues.",
    url: `${SITE_URL}/tools/dkim-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DKIM Record Checker | SaaSKevin",
    description:
      "Look up and validate DKIM records for any domain and selector. Verify DKIM key configuration and check for common issues.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a DKIM selector?",
    answer:
      "A DKIM selector is a string used to locate the DKIM public key in DNS. The full DNS lookup is performed at {selector}._domainkey.{domain}. Different email services use different selectors -- for example, Google Workspace uses \"google\", Microsoft 365 uses \"selector1\" and \"selector2\", and Mailchimp uses \"k1\". A single domain can have multiple DKIM selectors for different email services.",
  },
  {
    question: "How do I find my DKIM selector?",
    answer:
      "The easiest way is to look at the DKIM-Signature header in an email sent from your domain. The \"s=\" tag in that header contains the selector. You can also check your email provider's documentation -- Google Workspace uses \"google\", Microsoft 365 uses \"selector1\" or \"selector2\", and most ESPs document their selectors in their setup guides.",
  },
  {
    question: "What does an empty DKIM public key mean?",
    answer:
      "An empty public key (p= with no value) means the DKIM key has been intentionally revoked. This is the standard way to deactivate a DKIM key per RFC 6376. Emails signed with a revoked key will fail DKIM verification. This is commonly done when rotating DKIM keys or decommissioning an email service.",
  },
  {
    question: "What key length should my DKIM key be?",
    answer:
      "A 2048-bit RSA key is the current recommendation. While 1024-bit keys are still accepted by most providers, they are considered weak and could potentially be cracked. Some organizations are moving to Ed25519 keys, which offer strong security with shorter key sizes, but RSA 2048-bit has the broadest compatibility across email providers.",
  },
  {
    question: "Can a domain have multiple DKIM records?",
    answer:
      "Yes, a domain can have multiple DKIM records, each under a different selector. This is common and expected -- for example, you might have one selector for Google Workspace, another for your marketing email service, and another for a transactional email provider. Each service signs emails with its own private key and publishes its public key under its own selector.",
  },
]

export default function DkimCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "dkim-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "dkim-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DKIM Record Checker",
        description:
          "Free online DKIM record checker. Look up and validate DKIM records for any domain and selector.",
        url: `${SITE_URL}/tools/dkim-checker`,
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
            name: "DKIM Checker",
            item: `${SITE_URL}/tools/dkim-checker`,
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
            <span className="text-foreground">DKIM Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free DKIM Record Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter a domain and DKIM selector to look up and validate the DKIM
                record. Check key configuration, verify the public key, and
                identify common issues.
              </p>

              <DkimCheckerForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is DKIM?</h2>
                <p>
                  DKIM (DomainKeys Identified Mail) is an email authentication
                  method that allows the sending domain to cryptographically sign
                  outgoing messages. The recipient&apos;s mail server can then verify
                  the signature using a public key published in the sender&apos;s DNS
                  records, confirming that the email was authorized by the domain
                  owner and was not altered in transit.
                </p>
                <p>
                  Together with{" "}
                  <Link
                    href="/tools/spf-checker"
                    className="text-primary hover:underline"
                  >
                    SPF (Sender Policy Framework)
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/tools/dmarc-checker"
                    className="text-primary hover:underline"
                  >
                    DMARC (Domain-based Message Authentication, Reporting &
                    Conformance)
                  </Link>
                  , DKIM forms the foundation of modern email authentication. While
                  SPF verifies which servers can send email for a domain, DKIM
                  verifies that the message content is authentic and unmodified.
                </p>

                <h2>How DKIM Works</h2>
                <p>
                  When an email is sent from a DKIM-enabled domain, the sending
                  mail server generates a cryptographic hash of certain email
                  headers and the message body. This hash is encrypted using the
                  domain&apos;s private key and added to the email as a{" "}
                  <code>DKIM-Signature</code> header.
                </p>
                <p>
                  The receiving mail server extracts the selector (the{" "}
                  <code>s=</code> tag) and domain (<code>d=</code> tag) from the
                  DKIM-Signature header, looks up the public key at{" "}
                  <code>{"{selector}._domainkey.{domain}"}</code> in DNS, and uses
                  it to verify the signature. If the signature is valid, the
                  recipient knows the email was genuinely sent by the claimed domain
                  and has not been tampered with.
                </p>
                <p>
                  A DKIM DNS record is a TXT record containing tag-value pairs such
                  as <code>v=DKIM1</code> (version), <code>k=rsa</code> (key
                  type), and <code>p=...</code> (the Base64-encoded public key).
                </p>

                <h2>Finding Your DKIM Selector</h2>
                <p>
                  Every DKIM signature includes a selector that identifies which
                  key pair was used to sign the message. To find your selector,
                  open an email sent from your domain and view the full email
                  headers. Look for the <code>DKIM-Signature</code> header and find
                  the <code>s=</code> tag -- that&apos;s your selector.
                </p>
                <p>
                  Common selectors by email provider:
                </p>
                <ul>
                  <li>
                    <strong>Google Workspace:</strong> <code>google</code>
                  </li>
                  <li>
                    <strong>Microsoft 365:</strong> <code>selector1</code>,{" "}
                    <code>selector2</code>
                  </li>
                  <li>
                    <strong>Mailchimp:</strong> <code>k1</code>
                  </li>
                  <li>
                    <strong>Amazon SES:</strong> Varies per region (often
                    CNAME-based)
                  </li>
                  <li>
                    <strong>SendGrid:</strong> <code>s1</code>,{" "}
                    <code>s2</code>
                  </li>
                </ul>

                <h2>DKIM and Custom Domains</h2>
                <p>
                  For SaaS platforms that allow users to send email from their own
                  custom domains -- such as transactional emails, notifications, or
                  marketing campaigns -- DKIM is essential. Without proper DKIM
                  signing, emails sent on behalf of a custom domain are likely to
                  land in spam or be rejected entirely by receiving mail servers.
                </p>
                <p>
                  Setting up DKIM for custom domains involves generating a key
                  pair, publishing the public key in the customer&apos;s DNS, and
                  configuring the sending infrastructure to sign with the private
                  key. This process needs to be repeated for each customer domain,
                  which can become complex at scale.
                </p>
                <p>
                  SaaSKevin automates web custom domain onboarding with DNS
                  routing verification, SSL provisioning, and request routing.
                  Pair this with{" "}
                  <Link
                    href="/tools/spf-checker"
                    className="text-primary hover:underline"
                  >
                    SPF
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/tools/dmarc-checker"
                    className="text-primary hover:underline"
                  >
                    DMARC
                  </Link>{" "}
                  managed in your email platform to achieve full authentication
                  compliance for your customers&apos; domains.
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
