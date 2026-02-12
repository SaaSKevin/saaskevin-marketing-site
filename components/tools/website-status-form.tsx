"use client"

import { useState } from "react"
import {
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldX,
  Clock,
  Server,
  Globe,
  FileType,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type StatusResult = {
  isUp: boolean
  url: string
  statusCode?: number
  statusText?: string
  responseTime?: number
  server?: string | null
  contentType?: string | null
  sslValid: boolean
  sslDaysRemaining: number | null
  sslError?: string | null
  error?: string
  errorType?: string
}

function statusCodeColor(code: number): string {
  if (code >= 200 && code < 300) return "bg-green-600 text-white border-green-600"
  if (code >= 300 && code < 400) return "bg-yellow-500 text-white border-yellow-500"
  if (code >= 400 && code < 500) return "bg-orange-600 text-white border-orange-600"
  if (code >= 500) return "bg-red-600 text-white border-red-600"
  return ""
}

function responseTimeLabel(ms: number): { label: string; color: string; percentage: number } {
  if (ms < 200) return { label: "Excellent", color: "text-green-600", percentage: 15 }
  if (ms < 500) return { label: "Good", color: "text-green-600", percentage: 30 }
  if (ms < 1000) return { label: "Fair", color: "text-yellow-600", percentage: 55 }
  if (ms < 3000) return { label: "Slow", color: "text-orange-600", percentage: 75 }
  return { label: "Very Slow", color: "text-red-600", percentage: 95 }
}

function responseTimeBarColor(ms: number): string {
  if (ms < 200) return "[&>div]:bg-green-600"
  if (ms < 500) return "[&>div]:bg-green-500"
  if (ms < 1000) return "[&>div]:bg-yellow-500"
  if (ms < 3000) return "[&>div]:bg-orange-500"
  return "[&>div]:bg-red-500"
}

export function WebsiteStatusForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StatusResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/website-status", {
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          aria-label="Website URL or domain"
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
          {/* Big Status Indicator */}
          <Card
            className={
              result.isUp
                ? "border-green-600/30 bg-green-600/5"
                : "border-red-600/30 bg-red-600/5"
            }
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  {result.isUp ? (
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        result.isUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.isUp ? "UP" : "DOWN"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {result.url}
                    </p>
                  </div>
                </div>
                {result.responseTime !== undefined && (
                  <div className="sm:ml-auto text-center sm:text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {result.responseTime}
                      <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Response time</p>
                  </div>
                )}
              </div>

              {/* Error detail for DOWN sites */}
              {result.error && (
                <div className="mt-4 rounded-md bg-red-600/10 px-3 py-2">
                  <p className="text-sm text-red-600">{result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Grid */}
          {(result.statusCode !== undefined || result.sslValid !== undefined) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* HTTP Status */}
              {result.statusCode !== undefined && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      HTTP Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Badge className={statusCodeColor(result.statusCode)}>
                        {result.statusCode}
                      </Badge>
                      <span className="text-sm text-foreground">
                        {result.statusText || "Unknown"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Response Time */}
              {result.responseTime !== undefined && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        {result.responseTime}ms
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          responseTimeLabel(result.responseTime).color
                        }`}
                      >
                        {responseTimeLabel(result.responseTime).label}
                      </span>
                    </div>
                    <Progress
                      value={responseTimeLabel(result.responseTime).percentage}
                      className={`h-2 ${responseTimeBarColor(result.responseTime)}`}
                    />
                  </CardContent>
                </Card>
              )}

              {/* SSL Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {result.sslValid ? (
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <ShieldX className="h-4 w-4 text-red-600" />
                    )}
                    SSL Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        result.sslValid
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-red-600 text-white border-red-600"
                      }
                    >
                      {result.sslValid ? "Valid" : "Invalid"}
                    </Badge>
                    {result.sslDaysRemaining !== null && result.sslDaysRemaining > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {result.sslDaysRemaining} days remaining
                      </span>
                    )}
                    {result.sslError && !result.sslValid && (
                      <span className="text-xs text-muted-foreground">{result.sslError}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Server Software */}
              {result.server && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Server
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono text-foreground">{result.server}</p>
                  </CardContent>
                </Card>
              )}

              {/* Content Type */}
              {result.contentType && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileType className="h-4 w-4" />
                      Content Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono text-foreground break-all">
                      {result.contentType}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <ToolResultBanner message="Need reliable custom domain onboarding? SaaSKevin verifies DNS routing, provisions SSL, and routes traffic for your users' domains." />
        </>
      )}
    </div>
  )
}
