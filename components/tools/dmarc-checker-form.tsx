"use client"

import { useState } from "react"
import {
  Loader2,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type DmarcField = {
  tag: string
  label: string
  value: string
  description: string
}

type DmarcIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

type DmarcResult = {
  domain: string
  found: boolean
  rawRecord: string | null
  fields: DmarcField[]
  policyExplanation: string
  issues: DmarcIssue[]
  status: "pass" | "warn" | "fail"
}

function StatusBadge({ status }: { status: "pass" | "warn" | "fail" }) {
  if (status === "pass") {
    return (
      <Badge className="gap-1.5 bg-emerald-600 hover:bg-emerald-600 text-white">
        <ShieldCheck className="h-3.5 w-3.5" />
        Pass
      </Badge>
    )
  }
  if (status === "warn") {
    return (
      <Badge className="gap-1.5 bg-amber-500 hover:bg-amber-500 text-white">
        <ShieldAlert className="h-3.5 w-3.5" />
        Warning
      </Badge>
    )
  }
  return (
    <Badge className="gap-1.5 bg-red-600 hover:bg-red-600 text-white">
      <ShieldX className="h-3.5 w-3.5" />
      Fail
    </Badge>
  )
}

function SeverityIcon({ severity }: { severity: "error" | "warning" | "info" }) {
  if (severity === "error") {
    return <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
  }
  if (severity === "warning") {
    return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
  }
  return <Info className="h-4 w-4 shrink-0 text-blue-500" />
}

export function DmarcCheckerForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DmarcResult | null>(null)
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
      const res = await fetch("/api/tools/dmarc-check", {
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
        <div className="space-y-4">
          {/* Overall Status */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-base">
                  DMARC for{" "}
                  <span className="font-mono text-primary break-all">
                    {result.domain}
                  </span>
                </CardTitle>
                <StatusBadge status={result.status} />
              </div>
              {result.rawRecord && (
                <CopyButton value={result.rawRecord} label="Copy Record" />
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Policy Explanation */}
              <div className="rounded-md border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground mb-1">
                  Policy Summary
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.policyExplanation}
                </p>
              </div>

              {/* Raw Record */}
              {result.rawRecord && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Raw DMARC Record
                  </p>
                  <div className="rounded-md border bg-muted/20 p-3">
                    <code className="text-xs break-all text-muted-foreground">
                      {result.rawRecord}
                    </code>
                  </div>
                </div>
              )}

              {/* Parsed Fields */}
              {result.fields.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Parsed Fields
                  </p>
                  <div className="space-y-3">
                    {result.fields.map((field) => (
                      <div
                        key={field.tag}
                        className="rounded-md border p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {field.tag}=
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {field.label}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-primary">
                          {field.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {field.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues & Warnings */}
              {result.issues.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Issues & Warnings
                  </p>
                  <div className="space-y-2">
                    {result.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 rounded-md border p-3 ${
                          issue.severity === "error"
                            ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                            : issue.severity === "warning"
                              ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
                              : "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20"
                        }`}
                      >
                        <SeverityIcon severity={issue.severity} />
                        <p className="text-sm text-foreground">
                          {issue.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <ToolResultBanner message="Supporting custom domains in your SaaS? SaaSKevin handles DNS routing verification, SSL provisioning, and request routing automatically." />
      )}
    </div>
  )
}
