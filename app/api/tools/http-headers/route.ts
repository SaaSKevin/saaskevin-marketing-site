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

const SECURITY_HEADERS = [
  { name: "strict-transport-security", label: "Strict-Transport-Security (HSTS)", weight: 2 },
  { name: "content-security-policy", label: "Content-Security-Policy", weight: 2 },
  { name: "x-frame-options", label: "X-Frame-Options", weight: 1 },
  { name: "x-content-type-options", label: "X-Content-Type-Options", weight: 1 },
  { name: "referrer-policy", label: "Referrer-Policy", weight: 1 },
  { name: "permissions-policy", label: "Permissions-Policy", weight: 1 },
  { name: "x-xss-protection", label: "X-XSS-Protection", weight: 0.5 },
]

function gradeSecurityHeaders(headers: Record<string, string>): {
  grade: string
  score: number
  maxScore: number
  checks: { label: string; present: boolean; value: string | null }[]
} {
  let score = 0
  let maxScore = 0
  const checks = SECURITY_HEADERS.map((sh) => {
    maxScore += sh.weight
    const value = headers[sh.name] ?? null
    if (value) score += sh.weight
    return { label: sh.label, present: !!value, value }
  })

  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  let grade = "F"
  if (pct >= 90) grade = "A+"
  else if (pct >= 80) grade = "A"
  else if (pct >= 70) grade = "B"
  else if (pct >= 55) grade = "C"
  else if (pct >= 40) grade = "D"

  return { grade, score, maxScore, checks }
}

type RedirectHop = {
  url: string
  status: number
  headers: Record<string, string>
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
    const redirects: RedirectHop[] = []
    let currentUrl = parsed.data.url
    const maxRedirects = 10

    for (let i = 0; i < maxRedirects; i++) {
      const res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
        headers: {
          "User-Agent": "SaaSKevin-Header-Checker/1.0",
        },
      })

      const headers: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value
      })

      redirects.push({
        url: currentUrl,
        status: res.status,
        headers,
      })

      if (res.status >= 300 && res.status < 400 && headers.location) {
        // Resolve relative redirects
        const nextUrl = new URL(headers.location, currentUrl).toString()
        currentUrl = nextUrl
      } else {
        break
      }
    }

    const finalHop = redirects[redirects.length - 1]
    const security = gradeSecurityHeaders(finalHop.headers)

    return NextResponse.json({
      url: parsed.data.url,
      redirects,
      finalUrl: finalHop.url,
      finalStatus: finalHop.status,
      headers: finalHop.headers,
      security,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch URL"
    return NextResponse.json({ error: `Could not fetch URL: ${message}` }, { status: 502 })
  }
}
