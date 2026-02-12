import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_RE =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
})

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

type Mechanism = {
  qualifier: string
  type: string
  value: string
}

type SpfIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

function parseSpfRecord(record: string): {
  mechanisms: Mechanism[]
  dnsLookupCount: number
  issues: SpfIssue[]
  isValid: boolean
} {
  const mechanisms: Mechanism[] = []
  const issues: SpfIssue[] = []
  let dnsLookupCount = 0
  let isValid = true

  const trimmed = record.trim()

  // Check if it starts with v=spf1
  if (!trimmed.startsWith("v=spf1")) {
    issues.push({
      severity: "error",
      message: 'SPF record must start with "v=spf1".',
    })
    isValid = false
    return { mechanisms, dnsLookupCount, issues, isValid }
  }

  // Split the record into parts (skip the version tag)
  const parts = trimmed.split(/\s+/).slice(1)

  for (const part of parts) {
    let qualifier = "+"
    let token = part

    // Extract qualifier if present
    if (/^[+\-~?]/.test(token)) {
      qualifier = token[0]
      token = token.slice(1)
    }

    // Parse mechanism
    let type: string
    let value = ""

    if (token.startsWith("ip4:")) {
      type = "ip4"
      value = token.slice(4)
    } else if (token.startsWith("ip6:")) {
      type = "ip6"
      value = token.slice(4)
    } else if (token.startsWith("include:")) {
      type = "include"
      value = token.slice(8)
      dnsLookupCount++
    } else if (token.startsWith("redirect=")) {
      type = "redirect"
      value = token.slice(9)
      dnsLookupCount++
    } else if (token.startsWith("exists:")) {
      type = "exists"
      value = token.slice(7)
      dnsLookupCount++
    } else if (token.startsWith("exp=")) {
      type = "exp"
      value = token.slice(4)
    } else if (token === "a" || token.startsWith("a:") || token.startsWith("a/")) {
      type = "a"
      value = token.slice(1).replace(/^:/, "") || ""
      dnsLookupCount++
    } else if (token === "mx" || token.startsWith("mx:") || token.startsWith("mx/")) {
      type = "mx"
      value = token.slice(2).replace(/^:/, "") || ""
      dnsLookupCount++
    } else if (token === "ptr" || token.startsWith("ptr:")) {
      type = "ptr"
      value = token.slice(3).replace(/^:/, "") || ""
      dnsLookupCount++
    } else if (token === "all") {
      type = "all"
      value = ""
    } else {
      type = "unknown"
      value = token
      issues.push({
        severity: "warning",
        message: `Unknown mechanism: "${part}".`,
      })
    }

    mechanisms.push({ qualifier, type, value })
  }

  // Check for common issues

  // 1. DNS lookup limit
  if (dnsLookupCount > 10) {
    issues.push({
      severity: "error",
      message: `Too many DNS lookups (${dnsLookupCount}/10). SPF evaluation will fail after 10 lookups.`,
    })
    isValid = false
  } else if (dnsLookupCount > 7) {
    issues.push({
      severity: "warning",
      message: `${dnsLookupCount} of 10 DNS lookups used. Consider consolidating to avoid hitting the limit.`,
    })
  }

  // 2. Check for +all (passes everything, defeats the purpose of SPF)
  const allMechanism = mechanisms.find((m) => m.type === "all")
  if (allMechanism) {
    if (allMechanism.qualifier === "+") {
      issues.push({
        severity: "error",
        message:
          'Using "+all" allows any server to send email for your domain. This effectively disables SPF protection.',
      })
      isValid = false
    } else if (allMechanism.qualifier === "~") {
      issues.push({
        severity: "info",
        message:
          'Using "~all" (softfail). Unauthorized senders will be marked but not rejected. Consider using "-all" for stricter enforcement.',
      })
    } else if (allMechanism.qualifier === "-") {
      // This is ideal, no issue
    } else if (allMechanism.qualifier === "?") {
      issues.push({
        severity: "warning",
        message:
          'Using "?all" (neutral) provides no protection. Consider using "~all" or "-all".',
      })
    }
  } else {
    // No all mechanism and no redirect
    const hasRedirect = mechanisms.some((m) => m.type === "redirect")
    if (!hasRedirect) {
      issues.push({
        severity: "warning",
        message:
          'No "all" mechanism found. It is recommended to end your SPF record with "~all" or "-all".',
      })
    }
  }

  // 3. Check for ptr mechanism (deprecated)
  if (mechanisms.some((m) => m.type === "ptr")) {
    issues.push({
      severity: "warning",
      message:
        'The "ptr" mechanism is deprecated (RFC 7208) and should be avoided. It is slow and unreliable.',
    })
  }

  return { mechanisms, dnsLookupCount, issues, isValid }
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

  // Look up TXT records
  let txtRecords: string[][]
  try {
    txtRecords = await dns.resolveTxt(domain)
  } catch {
    return NextResponse.json(
      { error: `Could not resolve TXT records for "${domain}". The domain may not exist or DNS is unreachable.` },
      { status: 404 }
    )
  }

  // Find SPF records (records starting with v=spf1)
  const spfRecords = txtRecords
    .map((chunks) => chunks.join(""))
    .filter((record) => record.trim().startsWith("v=spf1"))

  if (spfRecords.length === 0) {
    return NextResponse.json({
      domain,
      found: false,
      record: null,
      mechanisms: [],
      dnsLookupCount: 0,
      issues: [
        {
          severity: "error" as const,
          message: `No SPF record found for "${domain}". Add a TXT record starting with "v=spf1" to enable SPF.`,
        },
      ],
      status: "fail",
    })
  }

  const issues: SpfIssue[] = []

  // Multiple SPF records is a permError
  if (spfRecords.length > 1) {
    issues.push({
      severity: "error",
      message: `Multiple SPF records found (${spfRecords.length}). A domain must have exactly one SPF record. Having multiple causes a permanent error (permError).`,
    })
  }

  // Parse the first (or only) SPF record
  const rawRecord = spfRecords[0]
  const parsed2 = parseSpfRecord(rawRecord)

  const allIssues = [...issues, ...parsed2.issues]

  // Determine overall status
  let status: "pass" | "warning" | "fail" = "pass"
  if (allIssues.some((i) => i.severity === "error")) {
    status = "fail"
  } else if (allIssues.some((i) => i.severity === "warning")) {
    status = "warning"
  }

  // If there were multiple SPF records, it is a fail
  if (spfRecords.length > 1) {
    status = "fail"
  }

  return NextResponse.json({
    domain,
    found: true,
    record: rawRecord,
    allRecords: spfRecords.length > 1 ? spfRecords : undefined,
    mechanisms: parsed2.mechanisms,
    dnsLookupCount: parsed2.dnsLookupCount,
    issues: allIssues,
    status,
  })
}
