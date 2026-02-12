import {
  Globe,
  ShieldCheck,
  Search,
  Link as LinkIcon,
  FileCode,
  Radio,
  Calculator,
  ArrowRightLeft,
  ArrowLeftRight,
  Mail,
  Clock,
  Network,
  ShieldAlert,
  FileText,
  Activity,
  KeyRound,
  CircleDot,
} from "lucide-react"
import { MARKETING_URLS } from "@/lib/marketing-constants"

export type Tool = {
  slug: string
  title: string
  shortTitle: string
  description: string
  icon: typeof Globe
  keywords: string[]
  relatedSlugs?: string[]
}

export const TOOLS: Tool[] = [
  {
    slug: "dns-lookup",
    title: "Free DNS Record Lookup",
    shortTitle: "DNS Lookup",
    description:
      "Free DNS record lookup tool. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records for any domain instantly.",
    icon: Globe,
    keywords: [
      "dns lookup",
      "dns checker",
      "check dns records",
      "dns record lookup",
      "nslookup online",
      "mx record lookup",
    ],
    relatedSlugs: ["dns-propagation", "cname-lookup", "txt-record-lookup"],
  },
  {
    slug: "ssl-checker",
    title: "Free SSL Certificate Checker",
    shortTitle: "SSL Checker",
    description:
      "Free SSL certificate checker. View issuer, validity, expiration countdown, and certificate chain for any domain.",
    icon: ShieldCheck,
    keywords: [
      "ssl checker",
      "ssl certificate checker",
      "check ssl certificate",
      "ssl test",
      "ssl expiry check",
    ],
    relatedSlugs: ["http-header-checker", "website-status-checker", "dns-lookup"],
  },
  {
    slug: "whois-lookup",
    title: "Free WHOIS Lookup",
    shortTitle: "WHOIS Lookup",
    description:
      "Free WHOIS lookup tool. View registrar, creation and expiry dates, name servers, and registration data for any domain.",
    icon: Search,
    keywords: [
      "whois lookup",
      "domain whois",
      "who owns a domain",
      "whois search",
      "domain registration lookup",
    ],
    relatedSlugs: ["domain-age-checker", "dns-lookup", "domain-availability-checker"],
  },
  {
    slug: "cname-lookup",
    title: "Free CNAME Lookup & Generator",
    shortTitle: "CNAME Lookup",
    description:
      "Free CNAME record lookup and generator. Validate CNAME records and get provider-specific setup instructions for custom domains.",
    icon: LinkIcon,
    keywords: [
      "cname record",
      "cname lookup",
      "how to add cname record",
      "cname setup",
      "cname generator",
    ],
    relatedSlugs: ["dns-lookup", "dns-propagation", "txt-record-lookup"],
  },
  {
    slug: "http-header-checker",
    title: "Free HTTP Header Checker",
    shortTitle: "HTTP Headers",
    description:
      "Free HTTP header checker. Inspect response headers, security headers, caching, redirects, and get a security grade for any URL.",
    icon: FileCode,
    keywords: [
      "http header checker",
      "check http headers",
      "response header checker",
      "security headers check",
    ],
    relatedSlugs: ["redirect-checker", "ssl-checker", "website-status-checker"],
  },
  {
    slug: "dns-propagation",
    title: "Free DNS Propagation Checker",
    shortTitle: "DNS Propagation",
    description:
      "Free DNS propagation checker. Query DNS servers across multiple global locations to verify your DNS changes are live.",
    icon: Radio,
    keywords: [
      "dns propagation checker",
      "dns propagation",
      "check dns propagation",
      "dns propagation time",
    ],
    relatedSlugs: ["dns-lookup", "cname-lookup", "txt-record-lookup"],
  },
  {
    slug: "domain-cost-calculator",
    title: "Free Custom Domain Cost Calculator",
    shortTitle: "Cost Calculator",
    description:
      "Free cost calculator for custom domains. Compare building in-house vs. using a managed service for your SaaS platform.",
    icon: Calculator,
    keywords: [
      "saas pricing calculator",
      "custom domain cost",
      "white label domain pricing",
      "build vs buy saas",
    ],
    relatedSlugs: ["ssl-checker", "dns-lookup", "cname-lookup"],
  },
  {
    slug: "redirect-checker",
    title: "Free Redirect Checker",
    shortTitle: "Redirect Checker",
    description:
      "Trace the full redirect chain for any URL. See each hop with status codes, response times, and the final destination.",
    icon: ArrowRightLeft,
    keywords: [
      "redirect checker",
      "redirect tracer",
      "check 301 redirect",
      "HTTP redirect checker",
      "redirect chain checker",
    ],
    relatedSlugs: ["http-header-checker", "ssl-checker", "website-status-checker"],
  },
  {
    slug: "spf-checker",
    title: "Free SPF Record Checker",
    shortTitle: "SPF Checker",
    description:
      "Look up and validate SPF records for any domain. Check for syntax errors, DNS lookup limits, and common configuration issues.",
    icon: Mail,
    keywords: [
      "SPF record checker",
      "SPF lookup",
      "SPF validator",
      "check SPF record",
      "SPF record lookup",
    ],
    relatedSlugs: ["dmarc-checker", "txt-record-lookup", "dns-lookup"],
  },
  {
    slug: "domain-age-checker",
    title: "Free Domain Age Checker",
    shortTitle: "Domain Age",
    description:
      "Check how old any domain is. See the exact registration date, domain age, last updated date, and expiration date.",
    icon: Clock,
    keywords: [
      "domain age checker",
      "how old is a domain",
      "check domain age",
      "domain age lookup",
      "website age checker",
    ],
    relatedSlugs: ["whois-lookup", "dns-lookup", "domain-availability-checker"],
  },
  {
    slug: "subdomain-finder",
    title: "Free Subdomain Finder",
    shortTitle: "Subdomain Finder",
    description:
      "Discover subdomains for any domain. Find existing subdomains using DNS enumeration of common subdomain names.",
    icon: Network,
    keywords: [
      "subdomain finder",
      "find subdomains",
      "subdomain scanner",
      "subdomain enumeration",
      "subdomain lookup",
    ],
    relatedSlugs: ["dns-lookup", "cname-lookup", "dns-propagation"],
  },
  {
    slug: "reverse-ip-lookup",
    title: "Free Reverse IP Lookup",
    shortTitle: "Reverse IP",
    description:
      "Find the hostname associated with any IP address. Perform reverse DNS (PTR) lookups to map IPs back to domain names.",
    icon: ArrowLeftRight,
    keywords: [
      "reverse IP lookup",
      "reverse DNS lookup",
      "IP to domain",
      "PTR record lookup",
      "reverse IP",
    ],
    relatedSlugs: ["dns-lookup", "whois-lookup", "subdomain-finder"],
  },
  {
    slug: "dmarc-checker",
    title: "Free DMARC Record Checker",
    shortTitle: "DMARC Checker",
    description:
      "Look up and validate DMARC records for any domain. Check policy settings, alignment, and reporting configuration.",
    icon: ShieldAlert,
    keywords: [
      "DMARC checker",
      "DMARC record lookup",
      "check DMARC",
      "DMARC validator",
      "DMARC policy checker",
    ],
    relatedSlugs: ["spf-checker", "dkim-checker", "txt-record-lookup"],
  },
  {
    slug: "txt-record-lookup",
    title: "Free TXT Record Lookup",
    shortTitle: "TXT Records",
    description:
      "Look up and categorize TXT records for any domain. Identify SPF, DKIM, DMARC, domain verification, and other TXT records.",
    icon: FileText,
    keywords: [
      "TXT record lookup",
      "check TXT records",
      "domain verification record",
      "TXT record checker",
      "DNS TXT lookup",
    ],
    relatedSlugs: ["dns-lookup", "spf-checker", "dmarc-checker"],
  },
  {
    slug: "website-status-checker",
    title: "Free Website Status Checker",
    shortTitle: "Status Checker",
    description:
      "Check if any website is up or down. See response time, HTTP status code, and SSL certificate status instantly.",
    icon: Activity,
    keywords: [
      "website status checker",
      "is it down",
      "is website down",
      "site down checker",
      "uptime checker",
    ],
    relatedSlugs: ["ssl-checker", "http-header-checker", "redirect-checker"],
  },
  {
    slug: "dkim-checker",
    title: "Free DKIM Record Checker",
    shortTitle: "DKIM Checker",
    description:
      "Look up and validate DKIM records for any domain and selector. Verify DKIM key configuration and check for common issues.",
    icon: KeyRound,
    keywords: [
      "DKIM checker",
      "DKIM record lookup",
      "check DKIM",
      "DKIM validator",
      "DKIM key lookup",
    ],
    relatedSlugs: ["spf-checker", "dmarc-checker", "txt-record-lookup"],
  },
  {
    slug: "domain-availability-checker",
    title: "Free Domain Availability Checker",
    shortTitle: "Domain Availability",
    description:
      "Check if a domain name is available or taken across multiple TLDs. Search .com, .io, .dev, .app, .co, and more.",
    icon: CircleDot,
    keywords: [
      "domain availability checker",
      "check if domain is available",
      "domain name search",
      "is domain taken",
      "domain check",
    ],
    relatedSlugs: ["whois-lookup", "domain-age-checker", "dns-lookup"],
  },
]

export const SITE_URL = MARKETING_URLS.site
