"use client"

import { useState } from "react"
import {
  Loader2,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type Mechanism = {
  qualifier: string
  type: string
  value: string
}

type SpfIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

type SpfResult = {
  domain: string
  found: boolean
  record: string | null
  allRecords?: string[]
  mechanisms: Mechanism[]
  dnsLookupCount: number
  issues: SpfIssue[]
  status: "pass" | "warning" | "fail"
}

function StatusBadge({ status }: { status: "pass" | "warning" | "fail" }) {
  if (status === "pass") {
    return (
      <Badge className="gap-1.5 bg-green-600 hover:bg-green-700 text-white border-transparent">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Pass
      </Badge>
    )
  }
  if (status === "warning") {
    return (
      <Badge className="gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-white border-transparent">
        <AlertTriangle className="h-3.5 w-3.5" />
        Warning
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="gap-1.5">
      <XCircle className="h-3.5 w-3.5" />
      Fail
    </Badge>
  )
}

function IssueSeverityIcon({ severity }: { severity: "error" | "warning" | "info" }) {
  if (severity === "error") {
    return <XCircle className="h-4 w-4 shrink-0 text-destructive" />
  }
  if (severity === "warning") {
    return <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600" />
  }
  return <Info className="h-4 w-4 shrink-0 text-blue-600" />
}

function QualifierBadge({ qualifier }: { qualifier: string }) {
  const map: Record<string, { label: string; className: string }> = {
    "+": { label: "Pass (+)", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
    "-": { label: "Fail (-)", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
    "~": { label: "SoftFail (~)", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
    "?": { label: "Neutral (?)", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800" },
  }

  const info = map[qualifier] ?? { label: qualifier, className: "" }

  return (
    <Badge variant="outline" className={`text-xs font-mono ${info.className}`}>
      {info.label}
    </Badge>
  )
}

function DnsLookupIndicator({
  count,
  max,
}: {
  count: number
  max: number
}) {
  const percentage = Math.min(100, (count / max) * 100)
  const isOver = count > max
  const isNear = count > 7 && count <= max

  let color = "text-green-600"
  let bgClass = "[&>div]:bg-green-600"
  if (isOver) {
    color = "text-destructive"
    bgClass = "[&>div]:bg-destructive"
  } else if (isNear) {
    color = "text-yellow-600"
    bgClass = "[&>div]:bg-yellow-600"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">DNS Lookups</span>
        <span className={`text-sm font-semibold ${color}`}>
          {count} / {max}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${bgClass}`} />
      {isOver && (
        <p className="text-xs text-destructive">
          Exceeds the 10-lookup limit. SPF evaluation will fail.
        </p>
      )}
    </div>
  )
}

function categorizeMechanisms(mechanisms: Mechanism[]) {
  const includes: Mechanism[] = []
  const ipRanges: Mechanism[] = []
  const other: Mechanism[] = []

  for (const m of mechanisms) {
    if (m.type === "include") {
      includes.push(m)
    } else if (m.type === "ip4" || m.type === "ip6") {
      ipRanges.push(m)
    } else {
      other.push(m)
    }
  }

  return { includes, ipRanges, other }
}

function MechanismRow({ mechanism }: { mechanism: Mechanism }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/40">
      <QualifierBadge qualifier={mechanism.qualifier} />
      <Badge variant="secondary" className="font-mono text-xs">
        {mechanism.type}
      </Badge>
      {mechanism.value && (
        <span className="font-mono text-xs text-muted-foreground break-all">
          {mechanism.value}
        </span>
      )}
    </div>
  )
}

export function SpfCheckerForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SpfResult | null>(null)
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
      const res = await fetch("/api/tools/spf-check", {
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

  const categorized = result
    ? categorizeMechanisms(result.mechanisms)
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
          {/* Status & Raw Record */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-base">
                  SPF Record for{" "}
                  <span className="font-mono text-primary break-all">{result.domain}</span>
                </CardTitle>
                <StatusBadge status={result.status} />
              </div>
              {result.record && (
                <CopyButton value={result.record} label="Copy Record" />
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Raw Record */}
              {result.record ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Raw SPF Record
                  </p>
                  <div className="rounded-md border bg-muted/30 px-4 py-3">
                    <code className="text-sm font-mono break-all text-foreground">
                      {result.record}
                    </code>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No SPF record found for this domain.
                </p>
              )}

              {/* Multiple records warning */}
              {result.allRecords && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-destructive uppercase tracking-wider">
                    All SPF Records Found ({result.allRecords.length})
                  </p>
                  {result.allRecords.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3"
                    >
                      <code className="text-sm font-mono break-all text-foreground">
                        {rec}
                      </code>
                    </div>
                  ))}
                </div>
              )}

              {/* DNS Lookup Count */}
              {result.found && (
                <DnsLookupIndicator count={result.dnsLookupCount} max={10} />
              )}
            </CardContent>
          </Card>

          {/* Parsed Mechanisms */}
          {categorized && result.mechanisms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Parsed Mechanisms ({result.mechanisms.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categorized.includes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Includes ({categorized.includes.length})
                    </p>
                    <div className="space-y-1.5">
                      {categorized.includes.map((m, i) => (
                        <MechanismRow key={`inc-${i}`} mechanism={m} />
                      ))}
                    </div>
                  </div>
                )}

                {categorized.ipRanges.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IP Ranges ({categorized.ipRanges.length})
                    </p>
                    <div className="space-y-1.5">
                      {categorized.ipRanges.map((m, i) => (
                        <MechanismRow key={`ip-${i}`} mechanism={m} />
                      ))}
                    </div>
                  </div>
                )}

                {categorized.other.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Other Mechanisms ({categorized.other.length})
                    </p>
                    <div className="space-y-1.5">
                      {categorized.other.map((m, i) => (
                        <MechanismRow key={`other-${i}`} mechanism={m} />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Issues & Warnings */}
          {result.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Issues & Recommendations ({result.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <IssueSeverityIcon severity={issue.severity} />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <ToolResultBanner message="Offering custom domains in your SaaS? SaaSKevin automates DNS routing checks, SSL provisioning, and request routing." />
        </>
      )}
    </div>
  )
}
