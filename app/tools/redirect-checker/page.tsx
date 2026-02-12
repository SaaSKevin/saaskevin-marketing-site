import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { RedirectCheckerForm } from "@/components/tools/redirect-checker-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free Redirect Checker | SaaSKevin",
  description:
    "Free redirect checker and tracer. Follow the full redirect chain for any URL. See each hop with HTTP status codes, response times, and the final destination.",
  alternates: { canonical: "/tools/redirect-checker" },
  keywords: [
    "redirect checker",
    "redirect tracer",
    "check 301 redirect",
    "HTTP redirect checker",
    "redirect chain checker",
    "URL redirect tester",
    "301 redirect checker",
    "302 redirect checker",
  ],
  openGraph: {
    title: "Free Redirect Checker | SaaSKevin",
    description:
      "Trace the full redirect chain for any URL. See each hop with status codes, response times, and the final destination.",
    url: `${SITE_URL}/tools/redirect-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Redirect Checker | SaaSKevin",
    description:
      "Trace the full redirect chain for any URL. See each hop with status codes, response times, and the final destination.",
  },
}

const FAQ_ITEMS = [
  {
    question: "What is an HTTP redirect?",
    answer:
      "An HTTP redirect is a server response that tells the browser to go to a different URL instead of the one originally requested. The server sends a 3xx status code along with a Location header pointing to the new URL. Common reasons include domain migrations, enforcing HTTPS, URL canonicalization, and shortening links.",
  },
  {
    question: "What is the difference between a 301 and 302 redirect?",
    answer:
      "A 301 redirect means the resource has permanently moved to a new URL. Search engines transfer ranking signals (link equity) to the new URL. A 302 redirect means the move is temporary -- the original URL should still be indexed. Using the wrong type can hurt your SEO.",
  },
  {
    question: "How many redirects are too many?",
    answer:
      "Ideally, you should have zero or one redirect (e.g., HTTP to HTTPS). Two hops are acceptable in some cases (e.g., http://example.com -> https://example.com -> https://www.example.com). Chains of three or more redirects add latency and can confuse search engine crawlers. Most browsers will stop following redirects after about 20 hops.",
  },
  {
    question: "Do redirects affect page speed and SEO?",
    answer:
      "Yes. Each redirect adds a network round trip, increasing page load time by 100-500ms per hop depending on the server. Excessive redirects also dilute link equity and can cause crawl budget waste. Google recommends keeping redirect chains as short as possible.",
  },
  {
    question: "What is a redirect loop and how do I fix it?",
    answer:
      "A redirect loop occurs when URL A redirects to URL B, which redirects back to URL A (or through a longer chain that eventually circles back). Browsers detect this and display an ERR_TOO_MANY_REDIRECTS error. Common causes include misconfigured server rules, conflicting CDN and origin settings, or SSL/HTTPS rules that conflict with each other.",
  },
]

export default function RedirectCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "redirect-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "redirect-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Redirect Checker",
        description:
          "Free online redirect checker and tracer. Follow the full redirect chain for any URL with status codes and response times.",
        url: `${SITE_URL}/tools/redirect-checker`,
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
          { "@type": "ListItem", position: 3, name: "Redirect Checker", item: `${SITE_URL}/tools/redirect-checker` },
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
            <span className="text-foreground">Redirect Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Redirect Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any URL to trace the full redirect chain. See every hop with
                HTTP status codes, response times, and the final destination URL.
              </p>

              <RedirectCheckerForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What Are HTTP Redirects?</h2>
                <p>
                  An HTTP redirect is a server response that instructs the browser
                  to navigate to a different URL than the one originally requested.
                  When a server returns a 3xx status code, the browser reads the{" "}
                  <code>Location</code> header and automatically follows the new URL.
                  Redirects are used for domain migrations, enforcing HTTPS, URL
                  canonicalization, link shortening, and routing traffic through CDNs
                  or load balancers.
                </p>
                <p>
                  While a single redirect is often necessary and harmless, redirect
                  chains (multiple redirects in sequence) add latency and can cause
                  issues with search engine indexing. This tool lets you inspect
                  every hop so you can identify and eliminate unnecessary redirects.
                </p>

                <h2>Redirect Types Explained</h2>
                <p>
                  <strong>301 Moved Permanently</strong> -- The resource has permanently
                  moved to a new URL. This is the most common redirect for domain
                  migrations and URL changes. Search engines transfer link equity
                  (ranking signals) to the new URL, making this the preferred choice
                  for permanent moves. You can also use the{" "}
                  <Link href="/tools/http-header-checker" className="text-primary hover:underline">
                    HTTP Header Checker
                  </Link>{" "}
                  to inspect the full response headers returned with any redirect.
                </p>
                <p>
                  <strong>302 Found</strong> -- The resource is temporarily available at a
                  different URL. The original URL should still be indexed by search
                  engines. Use this for A/B testing, geolocation routing, or
                  maintenance pages where the original URL will be restored.
                </p>
                <p>
                  <strong>307 Temporary Redirect</strong> -- Similar to 302, but the
                  browser must use the same HTTP method (GET, POST, etc.) for the
                  redirected request. This is important for form submissions and API
                  endpoints where changing from POST to GET would break functionality.
                </p>
                <p>
                  <strong>308 Permanent Redirect</strong> -- Similar to 301, but like 307,
                  it preserves the original HTTP method. This is the modern replacement
                  for 301 when you need to guarantee the method is not changed during
                  the redirect.
                </p>

                <h2>Redirects and Custom Domains</h2>
                <p>
                  When SaaS platforms support custom domains, redirects are a critical
                  part of the infrastructure. A common pattern is redirecting from the
                  bare domain (<code>example.com</code>) to the <code>www</code> subdomain
                  (or vice versa), or from HTTP to HTTPS. Misconfigured redirects can
                  create chains or loops that hurt user experience and SEO.
                </p>
                <p>
                  SaaSKevin handles HTTPS enablement and request routing for your
                  customers&apos; custom domains. When a user adds their domain, we verify
                  DNS routing, provision the{" "}
                  <Link href="/tools/ssl-checker" className="text-primary hover:underline">
                    SSL certificate
                  </Link>
                  , and route traffic once the domain is active. While a domain is
                  still pending activation, SaaSKevin can return a fallback redirect.
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
