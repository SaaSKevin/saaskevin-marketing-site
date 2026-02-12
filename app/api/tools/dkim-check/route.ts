import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_RE =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const SELECTOR_RE = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
  selector: z
    .string()
    .min(1, "Selector is required")
    .max(63, "Selector too long")
    .regex(SELECTOR_RE, "Invalid selector format"),
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

type DkimIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

type DkimParsed = {
  version: string | null
  keyType: string | null
  publicKey: string | null
  serviceType: string | null
  testingMode: boolean
  notes: string | null
  hashAlgorithms: string | null
  flags: string | null
  rawTags: Record<string, string>
}

function parseDkimRecord(record: string): {
  parsed: DkimParsed
  issues: DkimIssue[]
  isValid: boolean
} {
  const issues: DkimIssue[] = []
  let isValid = true

  const parsed: DkimParsed = {
    version: null,
    keyType: null,
    publicKey: null,
    serviceType: null,
    testingMode: false,
    notes: null,
    hashAlgorithms: null,
    flags: null,
    rawTags: {},
  }

  // DKIM records are semicolon-delimited tag=value pairs
  const tags = record.split(";").map((t) => t.trim()).filter(Boolean)

  for (const tag of tags) {
    const eqIndex = tag.indexOf("=")
    if (eqIndex === -1) {
      issues.push({
        severity: "warning",
        message: `Malformed tag (no '=' found): "${tag}".`,
      })
      continue
    }

    const key = tag.slice(0, eqIndex).trim().toLowerCase()
    const value = tag.slice(eqIndex + 1).trim()

    parsed.rawTags[key] = value

    switch (key) {
      case "v":
        parsed.version = value
        break
      case "k":
        parsed.keyType = value.toLowerCase()
        break
      case "p":
        parsed.publicKey = value
        break
      case "s":
        parsed.serviceType = value.toLowerCase()
        break
      case "t":
        parsed.flags = value
        if (value.toLowerCase() === "y") {
          parsed.testingMode = true
        }
        // "s" flag means strict domain matching
        break
      case "n":
        parsed.notes = value
        break
      case "h":
        parsed.hashAlgorithms = value.toLowerCase()
        break
      default:
        issues.push({
          severity: "info",
          message: `Unknown tag "${key}" with value "${value}".`,
        })
    }
  }

  // Validation

  // 1. Check version tag
  if (parsed.version !== null && parsed.version !== "DKIM1") {
    issues.push({
      severity: "error",
      message: `Invalid version tag: "${parsed.version}". Must be "DKIM1".`,
    })
    isValid = false
  }

  // 2. Check public key
  if (parsed.publicKey === null) {
    issues.push({
      severity: "error",
      message: 'No public key (p=) tag found. The record is incomplete.',
    })
    isValid = false
  } else if (parsed.publicKey === "") {
    issues.push({
      severity: "error",
      message: 'Public key is empty (p=). This means the DKIM key has been revoked.',
    })
    isValid = false
  } else {
    // Try to estimate key length from base64
    // Base64 encodes 3 bytes into 4 chars. The public key is ASN.1 DER encoded.
    // For RSA, a rough estimate: key bits ~= (base64_length * 6 / 8 - overhead) * 8
    // A more accurate approach: base64 decoded bytes * 8 gives total bits of the DER structure
    const cleanKey = parsed.publicKey.replace(/\s/g, "")
    const decodedBytes = Math.floor((cleanKey.length * 3) / 4)
    // RSA public key DER has ~38 bytes overhead for 2048-bit, ~26 for 1024-bit
    // Rough key size estimate: decodedBytes includes ASN.1 header + modulus + exponent
    const estimatedBits = (decodedBytes - 38) * 8

    if (estimatedBits < 900 && estimatedBits > 0) {
      issues.push({
        severity: "error",
        message: `Key appears to be ~${Math.round(estimatedBits / 128) * 128}-bit. Keys shorter than 1024 bits are insecure and widely rejected.`,
      })
      isValid = false
    } else if (estimatedBits >= 900 && estimatedBits < 1800) {
      issues.push({
        severity: "warning",
        message: `Key appears to be ~1024-bit. While still accepted, 2048-bit keys are strongly recommended for better security.`,
      })
    } else if (estimatedBits >= 1800) {
      issues.push({
        severity: "info",
        message: `Key appears to be ~${Math.round(estimatedBits / 1024) * 1024}-bit. This meets current security recommendations.`,
      })
    }
  }

  // 3. Check key type
  if (parsed.keyType !== null && parsed.keyType !== "rsa" && parsed.keyType !== "ed25519") {
    issues.push({
      severity: "warning",
      message: `Unusual key type: "${parsed.keyType}". Most implementations expect "rsa" or "ed25519".`,
    })
  }

  if (parsed.keyType === "ed25519") {
    issues.push({
      severity: "info",
      message: 'Key type is Ed25519. This is a modern algorithm but not supported by all email providers.',
    })
  }

  // 4. Check testing mode
  if (parsed.testingMode) {
    issues.push({
      severity: "warning",
      message: 'Testing mode is enabled (t=y). DKIM failures will not cause mail to be rejected. Remove "t=y" for production use.',
    })
  }

  // 5. Check service type
  if (parsed.serviceType !== null && parsed.serviceType !== "email" && parsed.serviceType !== "*") {
    issues.push({
      severity: "warning",
      message: `Unusual service type: "${parsed.serviceType}". Expected "email" or "*" (all services).`,
    })
  }

  // 6. Check hash algorithms
  if (parsed.hashAlgorithms !== null) {
    const algos = parsed.hashAlgorithms.split(":").map((a) => a.trim())
    if (algos.includes("sha1") && !algos.includes("sha256")) {
      issues.push({
        severity: "warning",
        message: 'Only SHA-1 hash algorithm specified. SHA-256 is recommended for better security.',
      })
    }
  }

  return { parsed, issues, isValid }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DNS lookup timed out")), ms)
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

  const validated = RequestSchema.safeParse(body)
  if (!validated.success) {
    const firstError = validated.error.issues[0]
    const errorMsg =
      firstError?.path[0] === "selector"
        ? "Invalid selector format. Selectors can contain letters, numbers, hyphens, dots, and underscores."
        : "Invalid domain format."
    return NextResponse.json({ error: errorMsg }, { status: 400 })
  }

  const { domain, selector } = validated.data
  const hostname = `${selector}._domainkey.${domain}`

  let rawRecord: string | null = null
  let cnameTarget: string | null = null
  let source: "TXT" | "CNAME" = "TXT"

  // Try TXT record lookup first
  try {
    const txtRecords = await withTimeout(dns.resolveTxt(hostname), 10_000)
    // Join multi-part TXT records
    const joined = txtRecords.map((chunks) => chunks.join(""))
    // Find DKIM records (should contain p= at minimum)
    const dkimRecords = joined.filter(
      (r) => r.includes("p=") || r.toLowerCase().startsWith("v=dkim1")
    )

    if (dkimRecords.length > 0) {
      rawRecord = dkimRecords[0]
    } else if (joined.length > 0) {
      // Return the first record even if it doesn't look like DKIM
      rawRecord = joined[0]
    }
  } catch {
    // TXT lookup failed, will try CNAME
  }

  // Also try CNAME lookup (some providers use CNAME to redirect DKIM)
  try {
    const cnameRecords = await withTimeout(dns.resolveCname(hostname), 10_000)
    if (cnameRecords.length > 0) {
      cnameTarget = cnameRecords[0]

      // If we didn't get a TXT record, try resolving the CNAME target
      if (!rawRecord) {
        source = "CNAME"
        try {
          const txtRecords = await withTimeout(dns.resolveTxt(cnameRecords[0]), 10_000)
          const joined = txtRecords.map((chunks) => chunks.join(""))
          const dkimRecords = joined.filter(
            (r) => r.includes("p=") || r.toLowerCase().startsWith("v=dkim1")
          )
          if (dkimRecords.length > 0) {
            rawRecord = dkimRecords[0]
          } else if (joined.length > 0) {
            rawRecord = joined[0]
          }
        } catch {
          // CNAME target TXT lookup also failed
        }
      }
    }
  } catch {
    // No CNAME record, that's fine
  }

  // If we still have no record
  if (!rawRecord) {
    return NextResponse.json({
      domain,
      selector,
      hostname,
      found: false,
      record: null,
      cnameTarget,
      parsed: null,
      issues: [
        {
          severity: "error" as const,
          message: `No DKIM record found at "${hostname}". Check that the selector is correct and a DKIM TXT record exists.`,
        },
      ],
      status: "fail",
    })
  }

  // Parse the DKIM record
  const { parsed, issues, isValid } = parseDkimRecord(rawRecord)

  // Add info about CNAME if present
  if (cnameTarget) {
    issues.unshift({
      severity: "info",
      message: `DKIM record is served via CNAME pointing to "${cnameTarget}".`,
    })
  }

  // Determine overall status
  let status: "pass" | "warning" | "fail" = "pass"
  if (!isValid || issues.some((i) => i.severity === "error")) {
    status = "fail"
  } else if (issues.some((i) => i.severity === "warning")) {
    status = "warning"
  }

  return NextResponse.json({
    domain,
    selector,
    hostname,
    found: true,
    record: rawRecord,
    source,
    cnameTarget,
    parsed: {
      version: parsed.version,
      keyType: parsed.keyType ?? "rsa",
      publicKey: parsed.publicKey,
      serviceType: parsed.serviceType,
      testingMode: parsed.testingMode,
      notes: parsed.notes,
      hashAlgorithms: parsed.hashAlgorithms,
      flags: parsed.flags,
      rawTags: parsed.rawTags,
    },
    issues,
    status,
  })
}
