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

type DmarcField = {
  tag: string
  label: string
  value: string
  description: string
}

type DmarcIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

function parseDmarcRecord(raw: string) {
  const fields: DmarcField[] = []
  const issues: DmarcIssue[] = []

  const trimmed = raw.trim()

  // Check that record starts with v=DMARC1
  if (!trimmed.startsWith("v=DMARC1")) {
    issues.push({
      severity: "error",
      message:
        'DMARC record must start with "v=DMARC1". This record may be malformed.',
    })
  }

  // Split into tag-value pairs
  const parts = trimmed.split(";").map((p) => p.trim()).filter(Boolean)
  const tagMap = new Map<string, string>()

  for (const part of parts) {
    const eqIndex = part.indexOf("=")
    if (eqIndex === -1) {
      issues.push({
        severity: "warning",
        message: `Invalid tag syntax: "${part}" (missing "=" separator).`,
      })
      continue
    }
    const tag = part.substring(0, eqIndex).trim().toLowerCase()
    const value = part.substring(eqIndex + 1).trim()
    tagMap.set(tag, value)
  }

  // Version
  if (tagMap.has("v")) {
    fields.push({
      tag: "v",
      label: "Version",
      value: tagMap.get("v")!,
      description: "DMARC protocol version.",
    })
  }

  // Policy (p=)
  const policy = tagMap.get("p")
  if (policy) {
    const validPolicies = ["none", "quarantine", "reject"]
    const pLower = policy.toLowerCase()
    if (!validPolicies.includes(pLower)) {
      issues.push({
        severity: "error",
        message: `Invalid policy value "${policy}". Must be one of: none, quarantine, reject.`,
      })
    }
    const policyDescriptions: Record<string, string> = {
      none: "Monitor only -- no action is taken on emails that fail DMARC checks. Useful during initial deployment.",
      quarantine:
        "Emails failing DMARC checks should be treated as suspicious (e.g., moved to spam/junk folder).",
      reject:
        "Emails failing DMARC checks should be rejected outright by the receiving mail server.",
    }
    fields.push({
      tag: "p",
      label: "Policy",
      value: policy,
      description:
        policyDescriptions[pLower] ||
        `Policy value: ${policy}`,
    })
    if (pLower === "none") {
      issues.push({
        severity: "warning",
        message:
          'Policy is set to "none" -- emails failing DMARC will not be blocked. Consider moving to "quarantine" or "reject" for better protection.',
      })
    }
  } else {
    issues.push({
      severity: "error",
      message: "Missing required policy tag (p=). A DMARC record must specify a policy.",
    })
  }

  // Subdomain policy (sp=)
  const sp = tagMap.get("sp")
  if (sp) {
    const spDescriptions: Record<string, string> = {
      none: "No action for subdomains -- emails failing DMARC from subdomains are not blocked.",
      quarantine:
        "Emails from subdomains failing DMARC should be treated as suspicious.",
      reject:
        "Emails from subdomains failing DMARC should be rejected.",
    }
    fields.push({
      tag: "sp",
      label: "Subdomain Policy",
      value: sp,
      description:
        spDescriptions[sp.toLowerCase()] ||
        `Subdomain policy value: ${sp}`,
    })
  }

  // Aggregate report URI (rua=)
  const rua = tagMap.get("rua")
  if (rua) {
    fields.push({
      tag: "rua",
      label: "Aggregate Report URI",
      value: rua,
      description:
        "Addresses where aggregate (XML) DMARC reports are sent. These reports summarize authentication results.",
    })
  }

  // Forensic report URI (ruf=)
  const ruf = tagMap.get("ruf")
  if (ruf) {
    fields.push({
      tag: "ruf",
      label: "Forensic Report URI",
      value: ruf,
      description:
        "Addresses where forensic (failure) reports are sent. These provide details on individual failed messages.",
    })
  }

  // Check if no reporting is configured
  if (!rua && !ruf) {
    issues.push({
      severity: "warning",
      message:
        "No reporting URIs configured (rua= or ruf=). Without reporting, you won't receive feedback on DMARC authentication results.",
    })
  }

  // DKIM alignment (adkim=)
  const adkim = tagMap.get("adkim")
  if (adkim) {
    const alignDescriptions: Record<string, string> = {
      r: "Relaxed -- the DKIM signing domain only needs to share the organizational domain (e.g., subdomain.example.com matches example.com).",
      s: "Strict -- the DKIM signing domain must exactly match the From header domain.",
    }
    fields.push({
      tag: "adkim",
      label: "DKIM Alignment",
      value: adkim,
      description:
        alignDescriptions[adkim.toLowerCase()] ||
        `DKIM alignment mode: ${adkim}`,
    })
  }

  // SPF alignment (aspf=)
  const aspf = tagMap.get("aspf")
  if (aspf) {
    const alignDescriptions: Record<string, string> = {
      r: "Relaxed -- the SPF-authenticated domain only needs to share the organizational domain.",
      s: "Strict -- the SPF-authenticated domain must exactly match the From header domain.",
    }
    fields.push({
      tag: "aspf",
      label: "SPF Alignment",
      value: aspf,
      description:
        alignDescriptions[aspf.toLowerCase()] ||
        `SPF alignment mode: ${aspf}`,
    })
  }

  // Percentage (pct=)
  const pct = tagMap.get("pct")
  if (pct) {
    const pctNum = parseInt(pct, 10)
    let desc = `The DMARC policy applies to ${pct}% of messages.`
    if (!isNaN(pctNum) && pctNum < 100) {
      desc += " Consider increasing to 100% for full protection."
      issues.push({
        severity: "info",
        message: `Policy applies to only ${pct}% of messages. This is useful during rollout, but aim for 100% eventually.`,
      })
    }
    fields.push({
      tag: "pct",
      label: "Percentage",
      value: pct,
      description: desc,
    })
  }

  // Failure options (fo=)
  const fo = tagMap.get("fo")
  if (fo) {
    const foDescriptions: Record<string, string> = {
      "0": "Generate failure reports only if all underlying authentication mechanisms fail (default).",
      "1": "Generate failure reports if any underlying authentication mechanism fails.",
      d: "Generate a DKIM failure report if the message had a signature that failed evaluation.",
      s: "Generate an SPF failure report if the message failed SPF evaluation.",
    }
    const foValues = fo.split(":").map((v) => v.trim())
    const desc = foValues
      .map((v) => foDescriptions[v.toLowerCase()] || `Option: ${v}`)
      .join(" ")
    fields.push({
      tag: "fo",
      label: "Failure Reporting Options",
      value: fo,
      description: desc,
    })
  }

  // Report interval (ri=)
  const ri = tagMap.get("ri")
  if (ri) {
    const riNum = parseInt(ri, 10)
    const hours = !isNaN(riNum) ? Math.round(riNum / 3600) : null
    fields.push({
      tag: "ri",
      label: "Report Interval",
      value: ri,
      description: hours
        ? `Aggregate reports requested every ${hours} hour${hours !== 1 ? "s" : ""} (${ri} seconds).`
        : `Report interval: ${ri} seconds.`,
    })
  }

  // Determine overall status
  let status: "pass" | "warn" | "fail" = "pass"
  const hasErrors = issues.some((i) => i.severity === "error")
  const hasWarnings = issues.some((i) => i.severity === "warning")

  if (hasErrors) {
    status = "fail"
  } else if (hasWarnings) {
    status = "warn"
  }

  // Build policy explanation
  let policyExplanation = ""
  if (policy) {
    const pLower = policy.toLowerCase()
    if (pLower === "reject") {
      policyExplanation =
        "Emails failing DMARC checks will be rejected by receiving mail servers. This is the strongest level of protection."
    } else if (pLower === "quarantine") {
      policyExplanation =
        "Emails failing DMARC checks will be flagged as suspicious and may be moved to the spam or junk folder."
    } else if (pLower === "none") {
      policyExplanation =
        "No action is taken on emails failing DMARC checks. This is monitor-only mode -- useful for initial setup but not protective."
    } else {
      policyExplanation = `Policy is set to "${policy}".`
    }
  } else {
    policyExplanation =
      "No DMARC policy is defined. Receiving servers will not apply any DMARC-based filtering."
  }

  return { fields, issues, status, policyExplanation }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
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
      { status: 400 },
    )
  }

  const { domain } = parsed.data
  const dmarcDomain = `_dmarc.${domain}`

  let rawRecords: string[][] = []
  try {
    rawRecords = await dns.resolveTxt(dmarcDomain)
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "SERVFAIL") {
      return NextResponse.json({
        domain,
        found: false,
        rawRecord: null,
        fields: [],
        policyExplanation:
          "No DMARC record was found for this domain. Receiving mail servers will not apply DMARC-based filtering.",
        issues: [
          {
            severity: "error" as const,
            message: `No DMARC record found at ${dmarcDomain}. This domain has no DMARC policy configured.`,
          },
        ],
        status: "fail",
      })
    }
    return NextResponse.json(
      { error: `DNS lookup failed: ${code || "unknown error"}` },
      { status: 500 },
    )
  }

  // Find the DMARC record (starts with v=DMARC1)
  const dmarcEntries = rawRecords
    .map((chunks) => chunks.join(""))
    .filter((txt) => txt.trimStart().startsWith("v=DMARC1"))

  if (dmarcEntries.length === 0) {
    // TXT records exist but none is a valid DMARC record
    return NextResponse.json({
      domain,
      found: false,
      rawRecord: null,
      fields: [],
      policyExplanation:
        "TXT records were found at _dmarc subdomain, but none contain a valid DMARC record (v=DMARC1).",
      issues: [
        {
          severity: "error" as const,
          message: `No valid DMARC record found at ${dmarcDomain}. TXT records exist but do not contain a DMARC policy.`,
        },
      ],
      status: "fail",
    })
  }

  if (dmarcEntries.length > 1) {
    // Multiple DMARC records is an error per RFC 7489
    const issues: DmarcIssue[] = [
      {
        severity: "error",
        message:
          "Multiple DMARC records found. Per RFC 7489, a domain must have only one DMARC record. Receiving servers may ignore all records.",
      },
    ]
    const rawRecord = dmarcEntries[0]
    const parsed = parseDmarcRecord(rawRecord)
    return NextResponse.json({
      domain,
      found: true,
      rawRecord,
      fields: parsed.fields,
      policyExplanation: parsed.policyExplanation,
      issues: [...issues, ...parsed.issues],
      status: "fail" as const,
    })
  }

  const rawRecord = dmarcEntries[0]
  const result = parseDmarcRecord(rawRecord)

  return NextResponse.json({
    domain,
    found: true,
    rawRecord,
    fields: result.fields,
    policyExplanation: result.policyExplanation,
    issues: result.issues,
    status: result.status,
  })
}
