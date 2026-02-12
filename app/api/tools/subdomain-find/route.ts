import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_RE =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(253)
    .regex(DOMAIN_RE, "Invalid domain format"),
})

const COMMON_SUBDOMAINS = [
  "www",
  "mail",
  "ftp",
  "blog",
  "shop",
  "api",
  "app",
  "dev",
  "staging",
  "test",
  "admin",
  "portal",
  "dashboard",
  "docs",
  "support",
  "help",
  "cdn",
  "assets",
  "static",
  "media",
  "images",
  "img",
  "video",
  "m",
  "mobile",
  "ns1",
  "ns2",
  "mx",
  "smtp",
  "imap",
  "pop",
  "webmail",
  "cpanel",
  "whm",
  "vpn",
  "remote",
  "git",
  "gitlab",
  "jenkins",
  "ci",
  "status",
  "monitor",
  "beta",
  "alpha",
  "demo",
  "sandbox",
  "preview",
  "old",
  "new",
  "v2",
  "auth",
  "login",
  "sso",
  "oauth",
  "graphql",
  "rest",
  "ws",
  "socket",
  "chat",
  "forum",
  "wiki",
  "kb",
  "store",
  "pay",
  "billing",
  "invoice",
  "crm",
  "erp",
  "hr",
  "jira",
  "confluence",
  "slack",
  "teams",
  "zoom",
  "meet",
  "calendar",
  "drive",
  "cloud",
  "aws",
  "gcp",
  "azure",
  "k8s",
  "docker",
  "registry",
  "npm",
  "pypi",
  "maven",
]

const CONCURRENCY_LIMIT = 10
const PER_LOOKUP_TIMEOUT = 5_000
const TOTAL_TIMEOUT = 30_000

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
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

async function resolveSubdomain(
  subdomain: string,
  domain: string,
  signal: AbortSignal,
): Promise<{ subdomain: string; fqdn: string; ips: string[] } | null> {
  const fqdn = `${subdomain}.${domain}`
  try {
    const ips = await Promise.race<string[]>([
      dns.resolve4(fqdn),
      new Promise<string[]>((_, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Lookup timeout")),
          PER_LOOKUP_TIMEOUT,
        )
        signal.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(new Error("Aborted"))
        })
      }),
    ])
    return { subdomain, fqdn, ips }
  } catch {
    return null
  }
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++
      results[currentIndex] = await tasks[currentIndex]()
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
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
      { error: "Invalid domain format. Enter a root domain like example.com (no subdomain prefix)." },
      { status: 400 },
    )
  }

  const { domain } = parsed.data

  const abortController = new AbortController()
  const totalTimer = setTimeout(
    () => abortController.abort(),
    TOTAL_TIMEOUT,
  )

  try {
    const tasks = COMMON_SUBDOMAINS.map(
      (sub) => () => resolveSubdomain(sub, domain, abortController.signal),
    )

    const results = await runWithConcurrency(tasks, CONCURRENCY_LIMIT)
    const found = results.filter(
      (r): r is { subdomain: string; fqdn: string; ips: string[] } =>
        r !== null,
    )

    return NextResponse.json({
      domain,
      total_checked: COMMON_SUBDOMAINS.length,
      found: found.map((r) => ({
        subdomain: r.subdomain,
        fqdn: r.fqdn,
        ips: r.ips,
      })),
    })
  } finally {
    clearTimeout(totalTimer)
  }
}
