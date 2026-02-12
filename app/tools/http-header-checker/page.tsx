import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { HttpHeadersForm } from "@/components/tools/http-headers-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free HTTP Header Checker | SaaSKevin",
  description:
    "Free HTTP header checker. Inspect response headers, security headers, caching, and redirects for any URL. Get a security grade instantly.",
  alternates: { canonical: "/tools/http-header-checker" },
  keywords: [
    "http header checker",
    "check http headers",
    "response header checker",
    "security headers check",
    "http headers online",
    "security header test",
  ],
  openGraph: {
    title: "Free HTTP Header Checker | SaaSKevin",
    description:
      "Check HTTP response headers, inspect security headers, and get a security grade.",
    url: `${SITE_URL}/tools/http-header-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free HTTP Header Checker | SaaSKevin",
    description:
      "Check HTTP response headers, inspect security headers, and get a security grade.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What are HTTP headers?",
    answer:
      "HTTP headers are metadata sent between browsers and servers with every request and response. Response headers contain information about the server, caching rules, security policies, content type, and more.",
  },
  {
    question: "What security headers should my site have?",
    answer:
      "Key security headers include Strict-Transport-Security (HSTS) for forcing HTTPS, Content-Security-Policy for preventing XSS, X-Frame-Options for preventing clickjacking, X-Content-Type-Options for preventing MIME sniffing, and Referrer-Policy for controlling referrer information.",
  },
  {
    question: "What does the security grade mean?",
    answer:
      "The security grade (A+ to F) is based on how many recommended security headers your site includes. An A+ means all major security headers are present, while an F means few or none are configured. This is a general assessment -- specific requirements depend on your application.",
  },
  {
    question: "How do redirect chains affect performance?",
    answer:
      "Each redirect adds a round trip between the browser and server, increasing page load time. A single redirect (e.g., HTTP to HTTPS) is normal, but chains of 3+ redirects should be avoided by pointing directly to the final URL.",
  },
  {
    question: "What is HSTS and why is it important?",
    answer:
      "HSTS (HTTP Strict Transport Security) tells browsers to only access your site over HTTPS. Once a browser receives this header, it will automatically convert any HTTP requests to HTTPS, preventing man-in-the-middle attacks from protocol downgrade.",
  },
]

export default function HttpHeaderCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "http-header-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "http-header-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "HTTP Header Checker",
        description:
          "Free online HTTP header inspection tool. Check response headers, security headers, and redirect chains.",
        url: `${SITE_URL}/tools/http-header-checker`,
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
          { "@type": "ListItem", position: 3, name: "HTTP Header Checker", item: `${SITE_URL}/tools/http-header-checker` },
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
            <span className="text-foreground">HTTP Header Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free HTTP Header Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any URL to inspect its HTTP response headers. Check security headers,
                caching configuration, redirect chains, and get a security grade.
              </p>

              <HttpHeadersForm />

              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>Why Check HTTP Headers?</h2>
                <p>
                  HTTP response headers control how browsers interact with your website.
                  Properly configured headers improve security, performance, and SEO. Missing
                  security headers can leave your site vulnerable to attacks like XSS,
                  clickjacking, and protocol downgrade.
                </p>

                <h2>Security Headers Explained</h2>
                <p>
                  <strong>Strict-Transport-Security (HSTS)</strong> forces browsers to use HTTPS,
                  preventing man-in-the-middle attacks. This is especially important for sites
                  handling sensitive data or using custom domains. Check your{" "}
                  <Link href="/tools/ssl-checker" className="text-primary hover:underline">SSL certificate</Link> to
                  make sure HTTPS is properly configured.
                </p>
                <p>
                  <strong>Content-Security-Policy (CSP)</strong> defines which resources can be loaded
                  on your page, providing strong protection against cross-site scripting (XSS) attacks.
                </p>

                <h2>Headers and Custom Domain Proxying</h2>
                <p>
                  When proxying requests for custom domains, proper header forwarding is critical.
                  The proxy should sanitize hop-by-hop headers, forward relevant request context,
                  and inject identification headers so your application knows which customer is
                  accessing it. SaaSKevin handles this automatically, including signed customer
                  identification headers that your application can read to serve the right content.
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
