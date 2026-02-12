import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { WebsiteStatusForm } from "@/components/tools/website-status-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free Website Status Checker | SaaSKevin",
  description:
    "Check if any website is up or down. See response time, HTTP status code, and SSL certificate status instantly. No signup required.",
  alternates: { canonical: "/tools/website-status-checker" },
  keywords: [
    "website status checker",
    "is it down",
    "is website down",
    "site down checker",
    "uptime checker",
    "website down checker",
    "check if website is up",
    "website monitoring",
  ],
  openGraph: {
    title: "Free Website Status Checker | SaaSKevin",
    description:
      "Check if any website is up or down. See response time, HTTP status code, and SSL certificate status instantly.",
    url: `${SITE_URL}/tools/website-status-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Status Checker | SaaSKevin",
    description:
      "Check if any website is up or down. See response time, HTTP status code, and SSL certificate status instantly.",
  },
}

const FAQ_ITEMS = [
  {
    question: "How does this website status checker work?",
    answer:
      "Our tool sends an HTTP request from our server to the website you specify. It measures the response time, captures the HTTP status code and headers, and simultaneously checks the SSL certificate. This tells you whether the site is reachable from the internet, not just from your local network.",
  },
  {
    question: "The checker says a website is up, but I can't access it. Why?",
    answer:
      "This can happen for several reasons: the issue might be with your local network, ISP, or DNS cache. The website could also be blocking traffic from certain regions or IP addresses. Try clearing your DNS cache, switching to a different DNS provider (like 1.1.1.1 or 8.8.8.8), or using a VPN to rule out local issues.",
  },
  {
    question: "What does the HTTP status code mean?",
    answer:
      "HTTP status codes indicate how the server responded. 2xx codes (like 200) mean success. 3xx codes (like 301, 302) mean the URL redirected. 4xx codes (like 404) mean there was a client error -- the page may not exist. 5xx codes (like 500, 503) mean the server encountered an error, which usually indicates the site is experiencing problems.",
  },
  {
    question: "What is a good response time for a website?",
    answer:
      "Generally, a response time under 200ms is excellent, under 500ms is good, and under 1 second is acceptable. Response times over 2-3 seconds may indicate server performance issues. Keep in mind that response time varies based on server location, current load, and network conditions.",
  },
  {
    question: "Why is the SSL certificate showing as invalid?",
    answer:
      "An invalid SSL certificate can mean several things: the certificate has expired, it was issued for a different domain, the certificate chain is incomplete, or the certificate was issued by an untrusted authority. You can use our SSL Checker tool for a more detailed analysis of the certificate chain and expiry dates.",
  },
]

export default function WebsiteStatusCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "website-status-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "website-status-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Website Status Checker",
        description:
          "Free online website status checker. Check if any website is up or down with response time, HTTP status code, and SSL certificate status.",
        url: `${SITE_URL}/tools/website-status-checker`,
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
            name: "Website Status Checker",
            item: `${SITE_URL}/tools/website-status-checker`,
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
            <span className="text-foreground">Website Status Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Website Status Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any URL or domain to instantly check if a website is up or down.
                See the HTTP status code, response time, server info, and SSL
                certificate status.
              </p>

              <WebsiteStatusForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>How to Check if a Website is Down</h2>
                <p>
                  When you can&apos;t access a website, the first question is: &quot;Is it
                  down for everyone, or just me?&quot; Our website status checker answers
                  this by testing the site from our servers. If we can reach it but
                  you can&apos;t, the problem is likely on your end -- your DNS cache,
                  ISP, or local network might be blocking the connection.
                </p>
                <p>
                  To use the tool, simply enter a domain name (like{" "}
                  <code>example.com</code>) or a full URL (like{" "}
                  <code>https://example.com/page</code>). We&apos;ll send an HTTP request
                  from our server and report back with the status code, response
                  time, and whether the SSL certificate is valid.
                </p>

                <h2>Understanding HTTP Status Codes</h2>
                <p>
                  HTTP status codes are three-digit numbers returned by a web server
                  to indicate how it handled a request. They&apos;re grouped into five
                  categories:
                </p>
                <p>
                  <strong>2xx Success</strong> -- These codes mean the request was
                  successfully received, understood, and accepted. The most common is{" "}
                  <strong>200 OK</strong>, which means the page loaded normally.
                </p>
                <p>
                  <strong>3xx Redirection</strong> -- These codes mean the requested
                  resource has moved. <strong>301 Moved Permanently</strong> and{" "}
                  <strong>302 Found</strong> are common redirects. You can use our{" "}
                  <Link
                    href="/tools/redirect-checker"
                    className="text-primary hover:underline"
                  >
                    Redirect Checker
                  </Link>{" "}
                  to trace the full redirect chain.
                </p>
                <p>
                  <strong>4xx Client Errors</strong> -- These indicate a problem with
                  the request. <strong>404 Not Found</strong> means the page
                  doesn&apos;t exist. <strong>403 Forbidden</strong> means you don&apos;t have
                  permission to access it.
                </p>
                <p>
                  <strong>5xx Server Errors</strong> -- These mean the server failed
                  to fulfill a valid request. <strong>500 Internal Server Error</strong>{" "}
                  and <strong>503 Service Unavailable</strong> are common signs that a
                  website is experiencing problems.
                </p>

                <h2>Common Reasons Websites Go Down</h2>
                <p>
                  Websites can become unavailable for many reasons. Server overload
                  happens when traffic exceeds the server&apos;s capacity -- this is
                  common during viral moments or product launches. Hardware failures,
                  software bugs, and misconfigurations can also cause outages.
                </p>
                <p>
                  DNS issues are another frequent cause. If a domain&apos;s DNS records
                  are misconfigured or if the nameservers are unreachable, browsers
                  can&apos;t resolve the domain to an IP address. Expired domains or
                  recently transferred domains sometimes experience DNS-related
                  downtime as well.
                </p>
                <p>
                  SSL certificate problems can also make a site appear &quot;down&quot; to
                  users. Modern browsers block access to sites with expired,
                  self-signed, or misconfigured certificates, showing a security
                  warning instead. You can use our{" "}
                  <Link
                    href="/tools/ssl-checker"
                    className="text-primary hover:underline"
                  >
                    SSL Certificate Checker
                  </Link>{" "}
                  to diagnose certificate issues in detail.
                </p>
                <p>
                  DDoS attacks, hosting provider outages, and network connectivity
                  issues between the server and the broader internet can all cause
                  downtime too. Checking the{" "}
                  <Link
                    href="/tools/http-header-checker"
                    className="text-primary hover:underline"
                  >
                    HTTP headers
                  </Link>{" "}
                  can sometimes reveal clues about what&apos;s happening on the server
                  side.
                </p>

                <h2>Website Monitoring and Custom Domains</h2>
                <p>
                  For SaaS platforms that offer custom domains to their customers,
                  monitoring website availability is critical. When a customer maps
                  their domain to your platform, they expect it to work reliably --
                  any downtime reflects poorly on both your service and their brand.
                </p>
                <p>
                  SaaSKevin automates custom domain onboarding for SaaS platforms.
                  It verifies DNS routing records, provisions SSL certificates,
                  and enables request routing once each domain is ready.
                </p>
                <p>
                  Rather than building custom domain infrastructure from scratch --
                  including DNS verification, SSL provisioning, and edge routing --
                  platforms use SaaSKevin to handle it through a simple API.
                  Teams can pair this with their existing uptime monitoring stack
                  for end-to-end production visibility.
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
