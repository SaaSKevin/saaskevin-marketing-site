"use client"

import { useState } from "react"
import { Loader2, Search, Calendar, Clock, RefreshCw, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type WhoisParsed = {
  domainName: string | null
  registrar: string | null
  createdDate: string | null
  updatedDate: string | null
  expiryDate: string | null
  nameServers: string[]
  status: string[]
  registrant: string | null
}

type WhoisResult = {
  domain: string
  server: string
  parsed: WhoisParsed
  raw: Record<string, unknown>
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  try {
    const target = new Date(dateStr)
    const now = new Date()
    return Math.floor(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    )
  } catch {
    return null
  }
}

function getDomainAgeDetailed(dateStr: string | null): {
  text: string
  years: number
  months: number
  days: number
  totalDays: number
} | null {
  if (!dateStr) return null
  try {
    const created = new Date(dateStr)
    const now = new Date()

    if (created > now) return null

    const totalDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    )

    let years = now.getFullYear() - created.getFullYear()
    let months = now.getMonth() - created.getMonth()
    let days = now.getDate() - created.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const parts: string[] = []
    if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`)
    if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`)
    if (days > 0 || parts.length === 0)
      parts.push(`${days} day${days !== 1 ? "s" : ""}`)

    return { text: parts.join(", "), years, months, days, totalDays }
  } catch {
    return null
  }
}

function getLifecycleProgress(
  createdDate: string | null,
  expiryDate: string | null,
): number | null {
  if (!createdDate || !expiryDate) return null
  try {
    const created = new Date(createdDate).getTime()
    const expiry = new Date(expiryDate).getTime()
    const now = Date.now()
    const total = expiry - created
    if (total <= 0) return null
    const elapsed = now - created
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))
    return Math.round(pct)
  } catch {
    return null
  }
}

export function DomainAgeForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/whois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }
      setResult(data)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const domainAge = result
    ? getDomainAgeDetailed(result.parsed.createdDate)
    : null
  const expiryDays = result ? getDaysUntil(result.parsed.expiryDate) : null
  const lifecycleProgress = result
    ? getLifecycleProgress(result.parsed.createdDate, result.parsed.expiryDate)
    : null

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a domain (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1"
          aria-label="Domain name"
        />
        <Button type="submit" disabled={loading || !domain.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-1.5 hidden sm:inline">Check Age</span>
        </Button>
      </form>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          {/* Prominent age display */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  <span className="font-mono text-primary">
                    {result.domain}
                  </span>{" "}
                  is
                </p>
                {domainAge ? (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                      {domainAge.text}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      old ({domainAge.totalDays.toLocaleString()} days total)
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-medium text-muted-foreground">
                    Age data not available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Date details grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registration Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(result.parsed.createdDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(result.parsed.updatedDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Expiry Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(result.parsed.expiryDate)}
                </p>
                {expiryDays !== null && (
                  <Badge
                    variant={
                      expiryDays < 30
                        ? "destructive"
                        : expiryDays < 90
                          ? "secondary"
                          : "outline"
                    }
                    className="mt-2"
                  >
                    {expiryDays > 0
                      ? `${expiryDays.toLocaleString()} days remaining`
                      : "Expired"}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Registrar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  {result.parsed.registrar || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lifecycle timeline */}
          {lifecycleProgress !== null &&
            result.parsed.createdDate &&
            result.parsed.expiryDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Domain Lifecycle Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Registered:{" "}
                        {formatShortDate(result.parsed.createdDate)}
                      </span>
                      <span>
                        Expires: {formatShortDate(result.parsed.expiryDate)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={lifecycleProgress} className="h-3" />
                      <div
                        className="absolute top-0 h-3 flex items-center"
                        style={{ left: `${lifecycleProgress}%` }}
                      >
                        <div className="w-1 h-5 bg-primary rounded-full -translate-x-1/2 -translate-y-[4px]" />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">0%</span>
                      <span className="font-medium text-primary">
                        {lifecycleProgress}% through current registration
                      </span>
                      <span className="text-muted-foreground">100%</span>
                    </div>
                  </div>

                  {domainAge && expiryDays !== null && expiryDays > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {domainAge.totalDays.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          days since registration
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {expiryDays.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          days until expiry
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Cross-links */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <a href={`/tools/whois-lookup?domain=${result.domain}`}>
                Full WHOIS Lookup
              </a>
            </Badge>
            <Badge variant="outline" className="text-xs">
              <a href={`/tools/dns-lookup?domain=${result.domain}`}>
                Check DNS Records
              </a>
            </Badge>
            <Badge variant="outline" className="text-xs">
              <a href={`/tools/ssl-checker?domain=${result.domain}`}>
                Check SSL Certificate
              </a>
            </Badge>
          </div>

          <ToolResultBanner
            message={
              domainAge
                ? `This domain is ${domainAge.text} old. Building a SaaS where users bring their own domains? SaaSKevin handles domain verification, DNS setup, and SSL automatically.`
                : "Building a SaaS where users bring their own domains? SaaSKevin handles domain verification, DNS setup, and SSL automatically."
            }
          />
        </>
      )}
    </div>
  )
}
