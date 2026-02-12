"use client"

import { useState } from "react"
import { Loader2, Search, CheckCircle2, XCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type RedirectHop = {
  url: string
  status: number
  headers: Record<string, string>
}

type SecurityCheck = {
  label: string
  present: boolean
  value: string | null
}

type HeadersResult = {
  url: string
  redirects: RedirectHop[]
  finalUrl: string
  finalStatus: number
  headers: Record<string, string>
  security: {
    grade: string
    score: number
    maxScore: number
    checks: SecurityCheck[]
  }
}

function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-green-600 bg-green-600/10 border-green-600/30"
  if (grade === "B") return "text-yellow-600 bg-yellow-600/10 border-yellow-600/30"
  if (grade === "C") return "text-orange-600 bg-orange-600/10 border-orange-600/30"
  return "text-destructive bg-destructive/10 border-destructive/30"
}

function statusColor(status: number): "default" | "secondary" | "destructive" | "outline" {
  if (status >= 200 && status < 300) return "default"
  if (status >= 300 && status < 400) return "secondary"
  return "destructive"
}

export function HttpHeadersForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HeadersResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/http-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
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

  const securityHeaders = new Set([
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "x-xss-protection",
  ])

  const cachingHeaders = new Set([
    "cache-control",
    "expires",
    "etag",
    "last-modified",
    "age",
    "vary",
  ])

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a URL (e.g. example.com or https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          aria-label="URL"
        />
        <Button type="submit" disabled={loading || !url.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-1.5 hidden sm:inline">Check</span>
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
          {/* Security Grade */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">Security Grade</CardTitle>
              <Badge className={`text-lg px-3 py-1 ${gradeColor(result.security.grade)}`}>
                {result.security.grade}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.security.checks.map((check) => (
                  <div key={check.label} className="flex items-start gap-2 text-sm">
                    {check.present ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className={check.present ? "text-foreground" : "text-muted-foreground"}>
                        {check.label}
                      </span>
                      {check.value && (
                        <p className="font-mono text-xs text-muted-foreground truncate mt-0.5">
                          {check.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Redirect Chain */}
          {result.redirects.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Redirect Chain ({result.redirects.length} hops)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.redirects.map((hop, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Badge variant={statusColor(hop.status)} className="shrink-0">
                        {hop.status}
                      </Badge>
                      <span className="font-mono text-xs truncate">{hop.url}</span>
                      {i < result.redirects.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Headers */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">
                Response Headers
                <Badge variant="secondary" className="ml-2">
                  {result.finalStatus}
                </Badge>
              </CardTitle>
              <CopyButton
                value={Object.entries(result.headers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")}
                label="Copy"
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-52">Header</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.headers)
                    .sort(([a], [b]) => {
                      // Security headers first, then caching, then rest
                      const aS = securityHeaders.has(a) ? 0 : cachingHeaders.has(a) ? 1 : 2
                      const bS = securityHeaders.has(b) ? 0 : cachingHeaders.has(b) ? 1 : 2
                      if (aS !== bS) return aS - bS
                      return a.localeCompare(b)
                    })
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-mono text-xs font-medium">
                          {key}
                          {securityHeaders.has(key) && (
                            <Badge variant="outline" className="ml-1.5 text-[10px] py-0">
                              security
                            </Badge>
                          )}
                          {cachingHeaders.has(key) && (
                            <Badge variant="outline" className="ml-1.5 text-[10px] py-0">
                              cache
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs break-all">
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <ToolResultBanner message="SaaSKevin handles request proxying for custom domains with consistent header forwarding and signed customer identification headers." />
        </>
      )}
    </div>
  )
}
