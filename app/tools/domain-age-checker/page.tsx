import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SITE_URL, TOOLS } from "@/lib/tools"
import { DomainAgeForm } from "@/components/tools/domain-age-form"
import { ToolSidebarCta } from "@/components/tools/tool-sidebar-cta"
import { ToolFaq } from "@/components/tools/tool-faq"
import { ToolCard } from "@/components/tools/tool-card"

export const metadata: Metadata = {
  title: "Free Domain Age Checker | SaaSKevin",
  description:
    "Check how old any domain is. See the exact registration date, domain age, last updated date, and expiration date. Free domain age checker tool.",
  alternates: { canonical: "/tools/domain-age-checker" },
  keywords: [
    "domain age checker",
    "how old is a domain",
    "check domain age",
    "domain age lookup",
    "website age checker",
    "domain registration date",
    "domain expiry checker",
  ],
  openGraph: {
    title: "Free Domain Age Checker | SaaSKevin",
    description:
      "Check how old any domain is. See the exact registration date, age, and expiration countdown.",
    url: `${SITE_URL}/tools/domain-age-checker`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Domain Age Checker | SaaSKevin",
    description:
      "Check how old any domain is. See the exact registration date, age, and expiration countdown.",
  },
}

const FAQ_ITEMS = [
  {
    question: "How is domain age calculated?",
    answer:
      "Domain age is calculated from the original registration date (creation date) found in the WHOIS record to the current date. Our tool breaks this down into exact years, months, and days, as well as total days since registration.",
  },
  {
    question: "Does domain age affect SEO?",
    answer:
      "Domain age is one of many factors that search engines consider. Older domains may have an advantage because they've had more time to build backlinks, establish authority, and accumulate trust signals. However, domain age alone is not a ranking factor -- content quality, relevance, and backlink profile matter far more.",
  },
  {
    question: "Can I find the exact date a domain was registered?",
    answer:
      "Yes. Our domain age checker retrieves the creation date from the WHOIS database, which records when a domain was first registered. This date is displayed alongside the calculated age and is accurate to the day for most domain registrars.",
  },
  {
    question: "What does the lifecycle timeline show?",
    answer:
      "The lifecycle timeline is a visual bar that shows how far through its current registration period a domain is. It spans from the creation date to the expiry date, with a marker showing where the domain is today. This makes it easy to see at a glance how much of the registration period remains.",
  },
  {
    question: "What happens when a domain expires?",
    answer:
      "When a domain expires, it typically enters a grace period (usually 30-45 days) where the original owner can still renew it. After that, it enters a redemption period with higher renewal fees. Finally, if not renewed, it goes through a deletion process and becomes available for anyone to register.",
  },
]

export default function DomainAgeCheckerPage() {
  const currentTool = TOOLS.find((t) => t.slug === "domain-age-checker")
  const relatedTools = currentTool?.relatedSlugs
    ? currentTool.relatedSlugs
        .map((slug) => TOOLS.find((t) => t.slug === slug))
        .filter(Boolean)
    : TOOLS.filter((t) => t.slug !== "domain-age-checker").slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Domain Age Checker",
        description:
          "Free online domain age checker tool. Check how old any domain is with exact registration date, age breakdown, and expiration countdown.",
        url: `${SITE_URL}/tools/domain-age-checker`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: {
          "@type": "Organization",
          name: "SaaSKevin",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${SITE_URL}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Domain Age Checker",
            item: `${SITE_URL}/tools/domain-age-checker`,
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
            <span className="text-foreground">Domain Age Checker</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10">
            {/* Main content */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Free Domain Age Checker
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Enter any domain name to check its age. See the exact
                registration date, how old the domain is, when it was last
                updated, and when it expires.
              </p>

              <DomainAgeForm />

              {/* SEO Content */}
              <div className="mt-16 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <h2>What is Domain Age?</h2>
                <p>
                  Domain age refers to how long a domain name has been
                  registered and active on the internet. It is calculated from
                  the original creation date recorded in the{" "}
                  <Link
                    href="/tools/whois-lookup"
                    className="text-primary hover:underline"
                  >
                    WHOIS database
                  </Link>{" "}
                  to the present day. A domain registered on January 1, 2010
                  would be over 15 years old today. Domain age is one of the
                  simplest metrics for understanding the history and
                  trustworthiness of a website.
                </p>

                <h2>Why Domain Age Matters</h2>
                <p>
                  Domain age is a useful signal in several contexts. Older
                  domains tend to carry more authority because they have had time
                  to accumulate backlinks, build a reputation, and establish
                  trust with search engines and users alike. When evaluating a
                  domain for purchase, partnership, or competitive analysis, the
                  age can reveal whether a site is a well-established player or a
                  newcomer.
                </p>
                <p>
                  For SaaS businesses, understanding domain age is particularly
                  relevant when customers bring their own custom domains. A
                  long-established domain suggests a mature business that is
                  likely to be a reliable, long-term customer. Newer domains may
                  need additional verification or onboarding steps. Tools like
                  SaaSKevin help SaaS platforms manage custom domains seamlessly,
                  regardless of whether the domain is brand new or decades old.
                </p>

                <h2>How to Check Domain Age</h2>
                <p>
                  To check a domain&apos;s age, enter the domain name in the
                  tool above and click &quot;Check Age.&quot; Our tool queries
                  the WHOIS database to retrieve the domain&apos;s creation date,
                  last updated date, and expiry date. From the creation date, we
                  calculate the exact age broken down into years, months, and
                  days.
                </p>
                <p>
                  You can also see the domain lifecycle timeline, which
                  visually shows how far through its current registration period
                  the domain is. This is especially useful for understanding when
                  a domain needs to be renewed. For a full view of all WHOIS
                  data, use our{" "}
                  <Link
                    href="/tools/whois-lookup"
                    className="text-primary hover:underline"
                  >
                    WHOIS lookup tool
                  </Link>
                  . To check the technical{" "}
                  <Link
                    href="/tools/dns-lookup"
                    className="text-primary hover:underline"
                  >
                    DNS configuration
                  </Link>{" "}
                  of a domain, use our DNS lookup tool.
                </p>

                <h2>Domain Age and SEO</h2>
                <p>
                  While domain age alone is not a direct Google ranking factor,
                  it correlates with many signals that do impact SEO. Older
                  domains have had more time to earn backlinks from authoritative
                  sources, build topical authority through content, and establish
                  a consistent track record that search engines trust.
                </p>
                <p>
                  That said, a new domain with high-quality content can
                  absolutely outrank an older domain with thin or irrelevant
                  content. Domain age is best understood as an indirect
                  advantage rather than a guarantee. For SaaS companies offering
                  custom domain functionality, domain age data can be part of a
                  broader strategy for understanding user profiles and
                  prioritizing support or onboarding.
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
