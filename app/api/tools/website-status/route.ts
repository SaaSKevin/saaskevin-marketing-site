import { NextRequest, NextResponse } from "next/server"
import tls from "node:tls"
import { z } from "zod"

const RequestSchema = z.object({
  url: z.string().min(1).max(2048),
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

function normalizeUrl(raw: string): string {
  let url = raw.trim()
  // Strip trailing slashes for cleanliness but keep paths
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`
  }
  // Validate it parses as a URL
  new URL(url)
  return url
}

function extractHostname(url: string): string {
  return new URL(url).hostname
}

function checkSsl(
  hostname: string
): Promise<{ valid: boolean; daysRemaining: number | null; error?: string }> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.destroy()
      resolve({ valid: false, daysRemaining: null, error: "SSL connection timed out" })
    }, 5_000)

    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      },
      () => {
        clearTimeout(timeout)
        try {
          const cert = socket.getPeerCertificate()
          if (!cert || !cert.valid_to) {
            socket.destroy()
            resolve({ valid: false, daysRemaining: null, error: "No certificate found" })
            return
          }

          const authorized = socket.authorized
          const validTo = new Date(cert.valid_to)
          const validFrom = new Date(cert.valid_from)
          const now = new Date()

          const isDateValid = now >= validFrom && now <= validTo
          const daysRemaining = Math.floor(
            (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )

          socket.destroy()
          resolve({
            valid: authorized && isDateValid,
            daysRemaining: isDateValid ? daysRemaining : 0,
          })
        } catch {
          socket.destroy()
          resolve({ valid: false, daysRemaining: null, error: "Failed to read certificate" })
        }
      }
    )

    socket.on("error", (err) => {
      clearTimeout(timeout)
      resolve({
        valid: false,
        daysRemaining: null,
        error: err.message || "SSL connection failed",
      })
    })
  })
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

  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid URL or domain" }, { status: 400 })
  }

  let url: string
  try {
    url = normalizeUrl(parsed.data.url)
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
  }

  const hostname = extractHostname(url)

  // Perform HTTP check and SSL check in parallel
  const [httpResult, sslResult] = await Promise.all([
    performHttpCheck(url),
    checkSsl(hostname),
  ])

  if (httpResult.error) {
    return NextResponse.json(
      {
        isUp: false,
        url,
        error: httpResult.error,
        errorType: httpResult.errorType,
        sslValid: sslResult.valid,
        sslDaysRemaining: sslResult.daysRemaining,
        sslError: sslResult.error || null,
      },
      { status: 200 }
    )
  }

  return NextResponse.json({
    isUp: httpResult.statusCode !== undefined && httpResult.statusCode < 500,
    url,
    statusCode: httpResult.statusCode,
    statusText: httpResult.statusText,
    responseTime: httpResult.responseTime,
    server: httpResult.server || null,
    contentType: httpResult.contentType || null,
    sslValid: sslResult.valid,
    sslDaysRemaining: sslResult.daysRemaining,
    sslError: sslResult.error || null,
  })
}

type HttpCheckResult = {
  statusCode?: number
  statusText?: string
  responseTime?: number
  server?: string
  contentType?: string
  error?: string
  errorType?: string
}

async function performHttpCheck(url: string): Promise<HttpCheckResult> {
  const start = Date.now()

  // Try HEAD first, fallback to GET
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "SaaSKevin-Status-Checker/1.0",
      },
    })

    const responseTime = Date.now() - start
    const server = res.headers.get("server") || undefined
    const contentType = res.headers.get("content-type") || undefined

    // Some servers return 405 for HEAD, fallback to GET
    if (res.status === 405) {
      return performGetCheck(url)
    }

    return {
      statusCode: res.status,
      statusText: res.statusText,
      responseTime,
      server,
      contentType,
    }
  } catch (err) {
    // If HEAD fails entirely (not just 405), try GET
    try {
      return await performGetCheck(url)
    } catch (getErr) {
      return categorizeError(getErr)
    }
  }
}

async function performGetCheck(url: string): Promise<HttpCheckResult> {
  const start = Date.now()

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "SaaSKevin-Status-Checker/1.0",
      },
    })

    const responseTime = Date.now() - start
    const server = res.headers.get("server") || undefined
    const contentType = res.headers.get("content-type") || undefined

    return {
      statusCode: res.status,
      statusText: res.statusText,
      responseTime,
      server,
      contentType,
    }
  } catch (err) {
    return categorizeError(err)
  }
}

function categorizeError(err: unknown): HttpCheckResult {
  const message = err instanceof Error ? err.message : "Unknown error"
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("timeout") || lowerMessage.includes("abort")) {
    return {
      error: "Connection timed out after 10 seconds. The website may be down or very slow.",
      errorType: "timeout",
    }
  }

  if (lowerMessage.includes("getaddrinfo") || lowerMessage.includes("enotfound")) {
    return {
      error: "DNS resolution failed. The domain may not exist or DNS is misconfigured.",
      errorType: "dns",
    }
  }

  if (lowerMessage.includes("econnrefused")) {
    return {
      error: "Connection refused. The server is not accepting connections on this port.",
      errorType: "connection_refused",
    }
  }

  if (lowerMessage.includes("econnreset")) {
    return {
      error: "Connection was reset by the server.",
      errorType: "connection_reset",
    }
  }

  if (
    lowerMessage.includes("ssl") ||
    lowerMessage.includes("tls") ||
    lowerMessage.includes("certificate")
  ) {
    return {
      error: "SSL/TLS error. The website may have an invalid or expired certificate.",
      errorType: "ssl",
    }
  }

  return {
    error: `Could not connect: ${message}`,
    errorType: "unknown",
  }
}
