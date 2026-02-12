import { NextRequest, NextResponse } from "next/server"

type RateLimitBucket = {
  count: number
  resetAtMs: number
}

type RateLimitState = {
  buckets: Map<string, RateLimitBucket>
  lastCleanupMs: number
}

const DEFAULT_RATE_LIMIT_MAX = 30
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000

function readPositiveIntEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback

  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback

  return parsed
}

const RATE_LIMIT_MAX = readPositiveIntEnv("TOOLS_API_RATE_LIMIT_MAX", DEFAULT_RATE_LIMIT_MAX)
const RATE_LIMIT_WINDOW_MS = readPositiveIntEnv(
  "TOOLS_API_RATE_LIMIT_WINDOW_MS",
  DEFAULT_RATE_LIMIT_WINDOW_MS,
)

const globalScope = globalThis as typeof globalThis & {
  __toolsRateLimitState?: RateLimitState
}

const rateLimitState: RateLimitState = globalScope.__toolsRateLimitState ?? {
  buckets: new Map<string, RateLimitBucket>(),
  lastCleanupMs: 0,
}

if (!globalScope.__toolsRateLimitState) {
  globalScope.__toolsRateLimitState = rateLimitState
}

function cleanupExpiredBuckets(nowMs: number): void {
  if (nowMs - rateLimitState.lastCleanupMs < RATE_LIMIT_WINDOW_MS) return

  for (const [key, bucket] of rateLimitState.buckets.entries()) {
    if (bucket.resetAtMs <= nowMs) {
      rateLimitState.buckets.delete(key)
    }
  }

  rateLimitState.lastCleanupMs = nowMs
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  const cloudflareIp = request.headers.get("cf-connecting-ip")
  if (cloudflareIp) return cloudflareIp.trim()

  return "unknown"
}

function buildRateLimitHeaders(
  remaining: number,
  resetAtMs: number,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(Math.max(remaining, 0)),
    "X-RateLimit-Reset": String(Math.ceil(resetAtMs / 1000)),
  }
}

export function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next()
  }

  const nowMs = Date.now()
  cleanupExpiredBuckets(nowMs)

  const ip = getClientIp(request)
  const key = ip === "unknown" ? `${ip}:${request.headers.get("user-agent") ?? "unknown"}` : ip
  const existingBucket = rateLimitState.buckets.get(key)

  if (!existingBucket || existingBucket.resetAtMs <= nowMs) {
    const resetAtMs = nowMs + RATE_LIMIT_WINDOW_MS
    rateLimitState.buckets.set(key, { count: 1, resetAtMs })

    const response = NextResponse.next()
    const headers = buildRateLimitHeaders(RATE_LIMIT_MAX - 1, resetAtMs)
    Object.entries(headers).forEach(([header, value]) => response.headers.set(header, value))
    return response
  }

  existingBucket.count += 1

  if (existingBucket.count > RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existingBucket.resetAtMs - nowMs) / 1000),
    )

    return NextResponse.json(
      {
        error: "Too many requests. Please wait a minute and try again.",
      },
      {
        status: 429,
        headers: {
          ...buildRateLimitHeaders(0, existingBucket.resetAtMs),
          "Retry-After": String(retryAfterSeconds),
        },
      },
    )
  }

  const remaining = RATE_LIMIT_MAX - existingBucket.count
  const response = NextResponse.next()
  const headers = buildRateLimitHeaders(remaining, existingBucket.resetAtMs)
  Object.entries(headers).forEach(([header, value]) => response.headers.set(header, value))
  return response
}

export const config = {
  matcher: ["/api/tools/:path*"],
}
