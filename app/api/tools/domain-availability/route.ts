import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import { z } from "zod"

const DOMAIN_NAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/

const RequestSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(63)
    .regex(DOMAIN_NAME_RE, "Invalid domain name format"),
})

const TLDS = [
  ".com",
  ".io",
  ".dev",
  ".app",
  ".co",
  ".net",
  ".org",
  ".ai",
  ".so",
  ".me",
]

const CONCURRENCY_LIMIT = 5
const TOTAL_TIMEOUT_MS = 15_000

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

type DomainCheckResult = {
  tld: string
  fullDomain: string
  available: boolean
  ip: string | null
}

async function checkSingleDomain(
  name: string,
  tld: string,
): Promise<DomainCheckResult> {
  const fullDomain = `${name}${tld}`

  // Step 1: Try DNS A record resolution
  try {
    const addresses = await dns.resolve4(fullDomain)
    if (addresses && addresses.length > 0) {
      return {
        tld,
        fullDomain,
        available: false,
        ip: addresses[0],
      }
    }
  } catch {
    // DNS resolve4 failed -- domain may still be registered without A records
  }

  // Step 2: Try NS record resolution as fallback
  try {
    const nsRecords = await dns.resolveNs(fullDomain)
    if (nsRecords && nsRecords.length > 0) {
      return {
        tld,
        fullDomain,
        available: false,
        ip: null,
      }
    }
  } catch {
    // NS resolution also failed -- domain is likely available
  }

  return {
    tld,
    fullDomain,
    available: true,
    ip: null,
  }
}

async function runWithConcurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
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
      {
        error:
          "Invalid domain name. Enter just the name without a TLD (e.g. 'myapp' not 'myapp.com').",
      },
      { status: 400 },
    )
  }

  const { domain } = parsed.data
  const name = domain.toLowerCase()

  const tasks = TLDS.map(
    (tld) => () => checkSingleDomain(name, tld),
  )

  try {
    const results = await Promise.race([
      runWithConcurrencyLimit(tasks, CONCURRENCY_LIMIT),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout")),
          TOTAL_TIMEOUT_MS,
        ),
      ),
    ])

    return NextResponse.json({ domain: name, results })
  } catch (err) {
    if (err instanceof Error && err.message === "Timeout") {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 },
      )
    }
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    )
  }
}
