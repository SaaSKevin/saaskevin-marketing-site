import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import net from "node:net"
import { z } from "zod"

const RequestSchema = z.object({
  ip: z.string().min(1).max(45),
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

function isValidIp(ip: string): boolean {
  return net.isIP(ip) !== 0
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms)
    promise.then(
      (val) => {
        clearTimeout(timer)
        resolve(val)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

async function forwardConfirm(
  hostname: string,
  originalIp: string,
): Promise<boolean> {
  try {
    const isIPv6 = net.isIPv6(originalIp)
    const addresses = isIPv6
      ? await withTimeout(dns.resolve6(hostname), 5000)
      : await withTimeout(dns.resolve4(hostname), 5000)
    return addresses.includes(originalIp)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(clientIp)) {
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
      { error: "Please provide a valid IP address." },
      { status: 400 },
    )
  }

  const { ip } = parsed.data
  const trimmedIp = ip.trim()

  if (!isValidIp(trimmedIp)) {
    return NextResponse.json(
      { error: "Invalid IP address format. Please enter a valid IPv4 or IPv6 address." },
      { status: 400 },
    )
  }

  try {
    const hostnames = await withTimeout(dns.reverse(trimmedIp), 10_000)

    // Forward-confirm each hostname
    const hostnameResults = await Promise.all(
      hostnames.map(async (hostname) => {
        const confirmed = await forwardConfirm(hostname, trimmedIp)
        return { hostname, forwardConfirmed: confirmed }
      }),
    )

    return NextResponse.json({
      ip: trimmedIp,
      hostnames: hostnameResults,
      count: hostnameResults.length,
    })
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException

    if (error.message === "Timeout") {
      return NextResponse.json(
        { error: "The lookup timed out. The IP address may not have a PTR record or the DNS server is not responding." },
        { status: 504 },
      )
    }

    if (error.code === "ENOTFOUND" || error.code === "ENODATA") {
      return NextResponse.json({
        ip: trimmedIp,
        hostnames: [],
        count: 0,
        message: "No PTR record found for this IP address.",
      })
    }

    if (error.code === "ESERVFAIL") {
      return NextResponse.json({
        ip: trimmedIp,
        hostnames: [],
        count: 0,
        message: "DNS server failed to process the request. No PTR record may exist for this IP.",
      })
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during the reverse DNS lookup." },
      { status: 500 },
    )
  }
}
