import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { SslCheckerForm } from "@/components/tools/ssl-checker-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free SSL Certificate Checker | SaaSKevin",
  description:
    "Free SSL certificate checker. View issuer, validity dates, expiration countdown, certificate chain, and protocol details for any domain.",
  alternates: { canonical: "/tools/ssl-checker" },
  keywords: [
    "ssl checker",
    "ssl certificate checker",
    "check ssl certificate",
    "ssl test",
    "ssl expiry check",
    "https checker",
    "tls checker",
  ],
  openGraph: {
    title: "Free SSL Certificate Checker | SaaSKevin",
    description:
      "Check any domain's SSL/TLS certificate. View issuer, expiration, and certificate chain.",
    url: `${SITE_URL}/tools/ssl-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SSL Certificate Checker | SaaSKevin",
    description:
      "Check any domain's SSL/TLS certificate. View issuer, expiration, and certificate chain.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is an SSL certificate?",
    answer:
      "An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection (HTTPS). It ensures data transmitted between the user's browser and the server remains private and secure.",
  },
  {
    question: "How do I know if my SSL certificate is valid?",
    answer:
      "Use this SSL checker tool to verify your certificate. A valid certificate will show a green status with days remaining before expiration. Your browser also shows a padlock icon for sites with valid SSL certificates.",
  },
  {
    question: "What happens when an SSL certificate expires?",
    answer:
      "When an SSL certificate expires, browsers will show a security warning to visitors, potentially blocking access to your site. This can damage user trust and hurt SEO rankings. It's important to renew certificates before they expire.",
  },
  {
    question: "How do SaaS platforms manage SSL for custom domains?",
    answer:
      "SaaS platforms that support custom domains need to provision individual SSL certificates for each customer's domain. This can be done manually, through automated tools like Let's Encrypt with ACME protocol, or by using services like SaaSKevin that handle SSL provisioning and renewal automatically.",
  },
  {
    question: "What is the certificate chain?",
    answer:
      "The certificate chain (or chain of trust) is the sequence of certificates from your domain's certificate up to a trusted root Certificate Authority (CA). It typically includes the leaf certificate (your domain), one or more intermediate certificates, and a root certificate.",
  },
]

export default function SslCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "ssl-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "ssl-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "SSL Certificate Checker",
        description:
          "Free online SSL certificate checker. Verify SSL/TLS certificates, check expiration dates, and inspect certificate chains.",
        url: `${SITE_URL}/tools/ssl-checker`,
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
          { "@type": "ListItem", position: 3, name: "SSL Checker", item: `${SITE_URL}/tools/ssl-checker` },
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
            <span className="text-foreground">SSL Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free SSL Certificate Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain to check its SSL/TLS certificate. View the issuer,
                validity dates, expiration countdown, and full certificate chain.
              </p>

              <SslCheckerForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>Why Check SSL Certificates?</h2>
                <p>
                  SSL certificates are essential for securing your website and building trust
                  with visitors. An expired or misconfigured certificate can lead to browser
                  warnings that drive users away and hurt your search engine rankings.
                </p>

                <h2>Understanding the Certificate Chain</h2>
                <p>
                  Every SSL certificate is part of a chain of trust. Your domain&apos;s certificate
                  (the leaf) is signed by an intermediate Certificate Authority (CA), which is
                  in turn signed by a root CA that browsers trust. If any link in this chain
                  is missing or invalid, the certificate won&apos;t be trusted.
                </p>

                <h2>SSL Certificates and Custom Domains</h2>
                <p>
                  When SaaS platforms offer custom domains, each customer domain needs its own
                  SSL certificate. Managing hundreds or thousands of certificates manually is
                  impractical. Automated solutions like Let&apos;s Encrypt combined with the ACME
                  protocol make this feasible, but the integration work is non-trivial. You can
                  verify your <Link href="/tools/dns-lookup" className="text-primary hover:underline">DNS records</Link> and{" "}
                  <Link href="/tools/http-header-checker" className="text-primary hover:underline">HTTP headers</Link> to
                  check that SSL is properly configured.
                </p>
                <p>
                  SaaSKevin handles the entire SSL lifecycle for your SaaS platform&apos;s custom
                  domains -- provisioning, validation, installation, and renewal -- automatically
                  with zero configuration from your users.
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
