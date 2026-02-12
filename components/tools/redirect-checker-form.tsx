"use client"

import { useState } from "react"
import {
  Loader2,
  Search,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type RedirectHop = {
  url: string
  status: number
  location: string | null
  responseTime: number
}

type RedirectResult = {
  url: string
  hops: RedirectHop[]
  finalUrl: string
  finalStatus: number
  totalHops: number
  totalResponseTime: number
  isLoop: boolean
  error?: string
}

function statusLabel(status: number): string {
  const labels: Record<number, string> = {
    200: "OK",
    201: "Created",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  }
  return labels[status] || `Status ${status}`
}

function statusBadgeClass(status: number): string {
  if (status === 301 || status === 308)
    return "bg-green-600 text-white border-green-600"
  if (status === 302 || status === 303 || status === 307)
    return "bg-yellow-500 text-white border-yellow-500"
  if (status >= 200 && status < 300)
    return "bg-blue-600 text-white border-blue-600"
  if (status >= 400 && status < 500)
    return "bg-orange-600 text-white border-orange-600"
  if (status >= 500)
    return "bg-red-600 text-white border-red-600"
  return ""
}

export function RedirectCheckerForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RedirectResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/redirect-trace", {
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

  const hasRedirects = result && result.hops.length > 1

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          aria-label="URL to check redirects"
        />
        <Button type="submit" disabled={loading || !url.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-1.5 hidden sm:inline">Trace</span>
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
          {/* Summary Card */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">
                {result.isLoop ? (
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Redirect Loop Detected
                  </span>
                ) : hasRedirects ? (
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {result.totalHops - 1} Redirect{result.totalHops - 1 > 1 ? "s" : ""} Found
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    No Redirects
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {result.totalResponseTime}ms total
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">Final URL:</span>
                <code className="text-sm font-mono truncate flex-1">{result.finalUrl}</code>
                <CopyButton value={result.finalUrl} label="Copy" />
              </div>
            </CardContent>
          </Card>

          {/* Redirect Chain Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Redirect Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {result.hops.map((hop, i) => {
                  const isLast = i === result.hops.length - 1
                  const isRedirect = hop.status >= 300 && hop.status < 400

                  return (
                    <div key={i} className="relative">
                      {/* Timeline connector */}
                      {!isLast && (
                        <div className="absolute left-[15px] top-[36px] bottom-0 w-px bg-border" />
                      )}

                      <div className="flex items-start gap-4 pb-6">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                              isLast && !result.isLoop
                                ? "border-green-600 bg-green-600/10 text-green-600"
                                : isRedirect
                                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-600"
                                  : hop.status >= 400
                                    ? "border-red-500 bg-red-500/10 text-red-600"
                                    : "border-blue-500 bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {i + 1}
                          </div>
                        </div>

                        {/* Hop details */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <Badge className={statusBadgeClass(hop.status)}>
                              {hop.status} {statusLabel(hop.status)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {hop.responseTime}ms
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 min-w-0">
                            <code className="text-sm font-mono truncate text-foreground">
                              {hop.url}
                            </code>
                            <a
                              href={hop.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={`Open ${hop.url} in new tab`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>

                          {isRedirect && hop.location && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                              <ArrowDown className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                Redirects to: <span className="font-mono">{hop.location}</span>
                              </span>
                            </div>
                          )}

                          {isLast && !result.isLoop && (
                            <p className="text-xs text-green-600 font-medium mt-1.5">
                              Final destination
                            </p>
                          )}

                          {isLast && result.isLoop && (
                            <p className="text-xs text-destructive font-medium mt-1.5">
                              Loop detected -- this URL was already visited
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <ToolResultBanner message="SaaSKevin handles custom domain SSL and request routing, with fallback redirects while domains are still activating." />
        </>
      )}
    </div>
  )
}
