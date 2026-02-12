import { NextRequest, NextResponse } from "next/server"
import tls from "node:tls"
import { z } from "zod"

const DOMAIN_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const RequestSchema = z.object({
  domain: z.string().min(1).max(253).regex(DOMAIN_RE, "Invalid domain format"),
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

type CertInfo = {
  subject: Record<string, string>
  issuer: Record<string, string>
  validFrom: string
  validTo: string
  serialNumber: string
  fingerprint: string
  fingerprint256: string
  subjectAltNames: string[]
  protocol: string
}

function getCertificate(domain: string): Promise<{ cert: CertInfo; chain: CertInfo[] }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.destroy()
      reject(new Error("Connection timed out"))
    }, 10_000)

    const socket = tls.connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
      },
      () => {
        clearTimeout(timeout)
        try {
          const peerCert = socket.getPeerCertificate(true)
          if (!peerCert || !peerCert.subject) {
            socket.destroy()
            reject(new Error("No certificate found"))
            return
          }

          const protocol = socket.getProtocol() ?? "unknown"

          function extractCert(cert: typeof peerCert): CertInfo {
            const altNames = cert.subjectaltname
              ? cert.subjectaltname.split(", ").map((s: string) => s.replace(/^DNS:/, ""))
              : []
            return {
              subject: cert.subject as unknown as Record<string, string>,
              issuer: cert.issuer as unknown as Record<string, string>,
              validFrom: cert.valid_from,
              validTo: cert.valid_to,
              serialNumber: cert.serialNumber,
              fingerprint: cert.fingerprint,
              fingerprint256: cert.fingerprint256,
              subjectAltNames: altNames,
              protocol,
            }
          }

          const mainCert = extractCert(peerCert)
          const chain: CertInfo[] = []

          let current = peerCert.issuerCertificate
          const seen = new Set<string>([peerCert.serialNumber])
          while (current && !seen.has(current.serialNumber)) {
            seen.add(current.serialNumber)
            chain.push(extractCert(current))
            current = current.issuerCertificate
          }

          socket.destroy()
          resolve({ cert: mainCert, chain })
        } catch (err) {
          socket.destroy()
          reject(err)
        }
      },
    )

    socket.on("error", (err) => {
      clearTimeout(timeout)
      reject(err)
    })
  })
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
    const { cert, chain } = await getCertificate(parsed.data.domain)
    return NextResponse.json({ domain: parsed.data.domain, cert, chain })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to connect"
    return NextResponse.json({ error: `Could not retrieve SSL certificate: ${message}` }, { status: 502 })
  }
}
