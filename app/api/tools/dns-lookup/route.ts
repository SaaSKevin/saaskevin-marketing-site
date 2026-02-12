import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
})

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA"] as const

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

async function resolveRecordType(domain: string, type: string) {
  try {
    if (type === "SOA") {
      const soa = await dns.resolveSoa(domain)
      return { type, records: [soa], error: null }
    }
    const records = await dns.resolve(domain, type)
    return { type, records, error: null }
  } catch {
    return { type, records: [], error: null }
  }
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

  const { domain } = parsed.data
  const results = await Promise.all(
    RECORD_TYPES.map((type) => resolveRecordType(domain, type)),
  )

  return NextResponse.json({ domain, results })
}
