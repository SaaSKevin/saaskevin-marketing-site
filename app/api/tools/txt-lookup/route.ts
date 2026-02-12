import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_RE =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
})

type TxtRecord = {
  value: string
  category: string
  description: string
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 30
const RATE_WINDOW = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function categorizeRecord(value: string): { category: string; description: string } {
  const lower = value.toLowerCase()

  if (lower.startsWith("v=spf1")) {
    return {
      category: "SPF",
      description:
        "Sender Policy Framework record. Specifies which mail servers are authorized to send email on behalf of this domain.",
    }
  }

  if (lower.startsWith("google-site-verification=")) {
    return {
      category: "Google Verification",
      description:
        "Google site verification record. Proves domain ownership for Google Search Console, Google Workspace, and other Google services.",
    }
  }

  if (lower.startsWith("facebook-domain-verification=")) {
    return {
      category: "Facebook Verification",
      description:
        "Facebook domain verification record. Proves domain ownership for Facebook Business Manager and Meta services.",
    }
  }

  if (lower.startsWith("ms=") || lower.includes("ms=")) {
    return {
      category: "Microsoft Verification",
      description:
        "Microsoft domain verification record. Proves domain ownership for Microsoft 365, Azure, and other Microsoft services.",
    }
  }

  if (
    lower.includes("-site-verification=") ||
    lower.includes("-domain-verification=") ||
    lower.includes("_verify") ||
    lower.includes("verify=") ||
    lower.startsWith("atlassian-domain-verification=") ||
    lower.startsWith("adobe-idp-site-verification=") ||
    lower.startsWith("apple-domain-verification=") ||
    lower.startsWith("docusign=") ||
    lower.startsWith("stripe-verification=") ||
    lower.startsWith("have-i-been-pwned-verification=") ||
    lower.startsWith("postman-domain-verification=") ||
    lower.startsWith("hubspot-developer-verification=") ||
    lower.startsWith("zoom-domain-verification=") ||
    lower.startsWith("miro-verification=")
  ) {
    return {
      category: "Domain Ownership",
      description:
        "Domain ownership verification record. Used by a third-party service to confirm that you control this domain.",
    }
  }

  return {
    category: "Other",
    description:
      "General-purpose TXT record. May contain configuration data, policy information, or service-specific settings.",
  }
}

async function resolveTxtWithTimeout(
  domain: string,
  timeoutMs: number
): Promise<string[][]> {
  return Promise.race([
    dns.resolveTxt(domain),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DNS lookup timed out")), timeoutMs)
    ),
  ])
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid domain format" },
      { status: 400 }
    )
  }

  const { domain } = parsed.data
  const records: TxtRecord[] = []

  // Look up TXT records for the root domain
  try {
    const txtRecords = await resolveTxtWithTimeout(domain, 10_000)
    for (const chunks of txtRecords) {
      const value = chunks.join("")
      const { category, description } = categorizeRecord(value)
      records.push({ value, category, description })
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error"

    if (message === "DNS lookup timed out") {
      return NextResponse.json(
        { error: "DNS lookup timed out. Please try again." },
        { status: 504 }
      )
    }

    if (message.includes("ENOTFOUND") || message.includes("ENODATA")) {
      // Domain not found or no TXT records -- not necessarily a hard error,
      // continue to check _dmarc subdomain
    } else if (message.includes("SERVFAIL")) {
      return NextResponse.json(
        { error: "DNS server failed to respond for this domain." },
        { status: 502 }
      )
    }
  }

  // Also check _dmarc.{domain} for DMARC records
  try {
    const dmarcRecords = await resolveTxtWithTimeout(
      `_dmarc.${domain}`,
      10_000
    )
    for (const chunks of dmarcRecords) {
      const value = chunks.join("")
      if (value.toLowerCase().startsWith("v=dmarc1")) {
        records.push({
          value,
          category: "DMARC",
          description:
            "Domain-based Message Authentication, Reporting, and Conformance record. Defines how receivers should handle email that fails SPF or DKIM checks.",
        })
      }
    }
  } catch {
    // _dmarc subdomain may not exist -- that is fine
  }

  if (records.length === 0) {
    return NextResponse.json(
      { error: "No TXT records found for this domain." },
      { status: 404 }
    )
  }

  return NextResponse.json({ domain, records })
}
