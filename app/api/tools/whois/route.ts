import { NextRequest, NextResponse } from "next/server"
import { whoisDomain, firstResult } from "whoiser"
import { z } from "zod"

const DOMAIN_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
})

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 20
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
  }

  try {
    const result = await whoisDomain(parsed.data.domain, { timeout: 10_000 })

    // whoiser returns an object keyed by WHOIS server
    const servers = Object.keys(result)
    if (servers.length === 0) {
      return NextResponse.json({ error: "No WHOIS data found for this domain" }, { status: 404 })
    }

    const data = firstResult(result) as Record<string, unknown>

    // Extract key fields
    const parsed_data = {
      domainName: extractField(data, ["Domain Name", "domain name", "domain"]),
      registrar: extractField(data, ["Registrar", "registrar"]),
      createdDate: extractField(data, [
        "Created Date",
        "Creation Date",
        "created",
        "Registration Date",
      ]),
      updatedDate: extractField(data, [
        "Updated Date",
        "Last Updated",
        "updated",
        "Modified Date",
      ]),
      expiryDate: extractField(data, [
        "Expiry Date",
        "Registry Expiry Date",
        "Registrar Registration Expiration Date",
        "expires",
        "Expiration Date",
      ]),
      nameServers: extractArrayField(data, [
        "Name Server",
        "name server",
        "nserver",
        "Name Servers",
      ]),
      status: extractArrayField(data, ["Domain Status", "Status", "status"]),
      registrant: extractField(data, [
        "Registrant Organization",
        "Registrant Name",
        "registrant",
      ]),
    }

    return NextResponse.json({
      domain: parsed.data.domain,
      server: servers[0] ?? "unknown",
      parsed: parsed_data,
      raw: data,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "WHOIS lookup failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

function extractField(data: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const val = data[key]
    if (val) {
      if (Array.isArray(val)) return val[0] ? String(val[0]) : null
      return String(val)
    }
  }
  return null
}

function extractArrayField(data: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const val = data[key]
    if (val) {
      if (Array.isArray(val)) return val.map(String)
      return [String(val)]
    }
  }
  return []
}
