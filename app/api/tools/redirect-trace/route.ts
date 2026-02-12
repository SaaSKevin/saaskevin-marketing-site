import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const RequestSchema = z.object({
  url: z.string().min(1).max(2048).url("Must be a valid URL"),
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

type RedirectHop = {
  url: string
  status: number
  location: string | null
  responseTime: number
}

const MAX_HOPS = 20
const HOP_TIMEOUT = 10_000

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

  // Normalize - add https:// if missing
  if (typeof body === "object" && body !== null && "url" in body) {
    const rawUrl = (body as { url: string }).url
    if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
      (body as { url: string }).url = `https://${rawUrl}`
    }
  }

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
  }

  try {
    const hops: RedirectHop[] = []
    let currentUrl = parsed.data.url
    const visitedUrls = new Set<string>()

    for (let i = 0; i < MAX_HOPS; i++) {
      // Detect redirect loops
      if (visitedUrls.has(currentUrl)) {
        hops.push({
          url: currentUrl,
          status: 0,
          location: null,
          responseTime: 0,
        })
        return NextResponse.json({
          url: parsed.data.url,
          hops,
          finalUrl: currentUrl,
          totalHops: hops.length,
          isLoop: true,
          error: "Redirect loop detected",
        })
      }
      visitedUrls.add(currentUrl)

      const start = performance.now()
      const res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(HOP_TIMEOUT),
        headers: {
          "User-Agent": "SaaSKevin-Redirect-Checker/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      })
      const responseTime = Math.round(performance.now() - start)

      const locationHeader = res.headers.get("location")

      hops.push({
        url: currentUrl,
        status: res.status,
        location: locationHeader,
        responseTime,
      })

      // If it's a redirect status, follow the location header
      if (res.status >= 300 && res.status < 400 && locationHeader) {
        // Resolve relative redirects
        const nextUrl = new URL(locationHeader, currentUrl).toString()
        currentUrl = nextUrl
      } else {
        // Final destination reached (2xx, 4xx, 5xx, or no location header)
        break
      }
    }

    const finalHop = hops[hops.length - 1]
    const totalResponseTime = hops.reduce((sum, hop) => sum + hop.responseTime, 0)

    return NextResponse.json({
      url: parsed.data.url,
      hops,
      finalUrl: finalHop.url,
      finalStatus: finalHop.status,
      totalHops: hops.length,
      totalResponseTime,
      isLoop: false,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch URL"
    return NextResponse.json({ error: `Could not fetch URL: ${message}` }, { status: 502 })
  }
}
