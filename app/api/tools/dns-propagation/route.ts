import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const DOMAIN_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]).default("A"),
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

const DNS_SERVERS = [
  { name: "Google", location: "Global", ip: "8.8.8.8", dohUrl: "https://dns.google/resolve" },
  { name: "Cloudflare", location: "Global", ip: "1.1.1.1", dohUrl: "https://cloudflare-dns.com/dns-query" },
  { name: "Quad9", location: "Global", ip: "9.9.9.9", dohUrl: "https://dns.quad9.net:5053/dns-query" },
  { name: "OpenDNS", location: "US", ip: "208.67.222.222", dohUrl: "https://doh.opendns.com/dns-query" },
  { name: "AdGuard", location: "Global", ip: "94.140.14.14", dohUrl: "https://dns.adguard-dns.com/dns-query" },
  { name: "CleanBrowsing", location: "Global", ip: "185.228.168.9", dohUrl: "https://doh.cleanbrowsing.org/doh/family-filter" },
]

const TYPE_MAP: Record<string, number> = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  NS: 2,
}

async function queryDoh(
  server: (typeof DNS_SERVERS)[number],
  domain: string,
  type: string,
): Promise<{
  server: string
  location: string
  ip: string
  records: string[]
  status: "resolved" | "no_records" | "error"
  responseTime: number
}> {
  const start = Date.now()
  try {
    const typeNum = TYPE_MAP[type] ?? 1
    const url = `${server.dohUrl}?name=${encodeURIComponent(domain)}&type=${typeNum}`
    const res = await fetch(url, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(5_000),
    })
    const responseTime = Date.now() - start

    if (!res.ok) {
      return { server: server.name, location: server.location, ip: server.ip, records: [], status: "error", responseTime }
    }

    const data = (await res.json()) as {
      Answer?: { type: number; data: string }[]
    }

    const records = (data.Answer ?? [])
      .filter((a) => a.type === typeNum)
      .map((a) => a.data.replace(/^"|"$/g, ""))

    return {
      server: server.name,
      location: server.location,
      ip: server.ip,
      records,
      status: records.length > 0 ? "resolved" : "no_records",
      responseTime,
    }
  } catch {
    return {
      server: server.name,
      location: server.location,
      ip: server.ip,
      records: [],
      status: "error",
      responseTime: Date.now() - start,
    }
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { domain, type } = parsed.data
  const results = await Promise.all(
    DNS_SERVERS.map((server) => queryDoh(server, domain, type)),
  )

  const resolvedCount = results.filter((r) => r.status === "resolved").length
  const propagated = resolvedCount === results.length && resolvedCount > 0

  return NextResponse.json({
    domain,
    type,
    results,
    propagated,
    resolvedCount,
    totalServers: results.length,
  })
}
