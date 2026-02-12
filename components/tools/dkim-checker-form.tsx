"use client"

import { useState } from "react"
import {
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type DkimIssue = {
  severity: "error" | "warning" | "info"
  message: string
}

type DkimParsed = {
  version: string | null
  keyType: string
  publicKey: string | null
  serviceType: string | null
  testingMode: boolean
  notes: string | null
  hashAlgorithms: string | null
  flags: string | null
  rawTags: Record<string, string>
}

type DkimResult = {
  domain: string
  selector: string
  hostname: string
  found: boolean
  record: string | null
  source?: "TXT" | "CNAME"
  cnameTarget: string | null
  parsed: DkimParsed | null
  issues: DkimIssue[]
  status: "pass" | "warning" | "fail"
}

const COMMON_SELECTORS = [
  "google",
  "default",
  "selector1",
  "selector2",
  "k1",
  "s1",
  "dkim",
  "mail",
]

function StatusBadge({ status }: { status: "pass" | "warning" | "fail" }) {
  if (status === "pass") {
    return (
      <Badge className="bg-emerald-600 text-white gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Valid
      </Badge>
    )
  }
  if (status === "warning") {
    return (
      <Badge className="bg-amber-500 text-white gap-1">
        <AlertTriangle className="h-3 w-3" />
        Warning
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      Invalid
    </Badge>
  )
}

function IssueSeverityIcon({ severity }: { severity: DkimIssue["severity"] }) {
  if (severity === "error")
    return <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
  if (severity === "warning")
    return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
  return <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
}

export function DkimCheckerForm() {
  const [domain, setDomain] = useState("")
  const [selector, setSelector] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DkimResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [keyExpanded, setKeyExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
    const trimmedSelector = selector.trim().toLowerCase()
    if (!trimmedDomain || !trimmedSelector) return

    setLoading(true)
    setError(null)
    setResult(null)
    setKeyExpanded(false)

    try {
      const res = await fetch("/api/tools/dkim-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmedDomain, selector: trimmedSelector }),
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

  function truncateKey(key: string): string {
    if (key.length <= 60) return key
    return key.slice(0, 30) + "..." + key.slice(-30)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter a domain (e.g. example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1"
            aria-label="Domain name"
          />
          <Input
            type="text"
            placeholder="Selector (e.g. google, default, selector1)"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="flex-1 sm:max-w-[280px]"
            aria-label="DKIM selector"
          />
          <Button
            type="submit"
            disabled={loading || !domain.trim() || !selector.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-1.5 hidden sm:inline">Check</span>
          </Button>
        </div>

        {/* Common selector suggestions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            Common selectors:
          </span>
          {COMMON_SELECTORS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelector(s)}
              className="text-xs px-2 py-0.5 rounded-md border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-base">
                DKIM Record for{" "}
                <span className="font-mono text-primary break-all">
                  {result.selector}._domainkey.{result.domain}
                </span>
              </CardTitle>
              <StatusBadge status={result.status} />
            </div>
            {result.record && (
              <CopyButton value={result.record} label="Copy Record" />
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Raw record */}
            {result.record && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Raw Record
                </h3>
                <pre className="text-xs font-mono bg-muted/50 border rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-all">
                  {result.record}
                </pre>
                {result.source === "CNAME" && result.cnameTarget && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Resolved via CNAME to{" "}
                    <span className="font-mono">{result.cnameTarget}</span>
                  </p>
                )}
              </div>
            )}

            {/* Parsed fields */}
            {result.parsed && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Parsed Fields
                </h3>
                <div className="border rounded-md divide-y">
                  <div className="flex items-start gap-3 px-3 py-2.5">
                    <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                      Version (v)
                    </span>
                    <span className="text-xs font-mono">
                      {result.parsed.version ?? "Not specified (defaults to DKIM1)"}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 px-3 py-2.5">
                    <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                      Key Type (k)
                    </span>
                    <span className="text-xs font-mono">
                      {result.parsed.keyType}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 px-3 py-2.5">
                    <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                      Public Key (p)
                    </span>
                    <div className="text-xs font-mono min-w-0 flex-1">
                      {result.parsed.publicKey ? (
                        <>
                          <span className="break-all">
                            {keyExpanded
                              ? result.parsed.publicKey
                              : truncateKey(result.parsed.publicKey)}
                          </span>
                          {result.parsed.publicKey.length > 60 && (
                            <button
                              type="button"
                              onClick={() => setKeyExpanded(!keyExpanded)}
                              className="ml-2 inline-flex items-center gap-0.5 text-primary hover:underline"
                            >
                              {keyExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3" />
                                  Collapse
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" />
                                  Expand
                                </>
                              )}
                            </button>
                          )}
                        </>
                      ) : result.parsed.publicKey === "" ? (
                        <span className="text-destructive">
                          Empty (key revoked)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Not found
                        </span>
                      )}
                    </div>
                  </div>
                  {result.parsed.serviceType && (
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                        Service Type (s)
                      </span>
                      <span className="text-xs font-mono">
                        {result.parsed.serviceType === "*"
                          ? "* (all services)"
                          : result.parsed.serviceType}
                      </span>
                    </div>
                  )}
                  {result.parsed.hashAlgorithms && (
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                        Hash Algo (h)
                      </span>
                      <span className="text-xs font-mono">
                        {result.parsed.hashAlgorithms}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 px-3 py-2.5">
                    <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                      Testing Mode
                    </span>
                    <span className="text-xs font-mono">
                      {result.parsed.testingMode ? (
                        <span className="text-amber-500">
                          Yes (t=y) -- not enforced
                        </span>
                      ) : (
                        "No (production)"
                      )}
                    </span>
                  </div>
                  {result.parsed.notes && (
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                        Notes (n)
                      </span>
                      <span className="text-xs font-mono">
                        {result.parsed.notes}
                      </span>
                    </div>
                  )}
                  {result.cnameTarget && (
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">
                        CNAME Target
                      </span>
                      <span className="text-xs font-mono">
                        {result.cnameTarget}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Issues & warnings */}
            {result.issues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  {result.status === "pass" ? "Details" : "Issues & Warnings"}
                </h3>
                <div className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                    >
                      <IssueSeverityIcon severity={issue.severity} />
                      <span className="text-muted-foreground">
                        {issue.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selector hints */}
            <div className="rounded-md bg-muted/40 border px-3 py-2.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Common selectors: </strong>
                <span className="font-mono">google</span> (Google Workspace),{" "}
                <span className="font-mono">selector1</span>/
                <span className="font-mono">selector2</span> (Microsoft 365),{" "}
                <span className="font-mono">default</span>,{" "}
                <span className="font-mono">k1</span> (Mailchimp),{" "}
                <span className="font-mono">s1</span>/
                <span className="font-mono">s2</span> (Amazon SES),{" "}
                <span className="font-mono">dkim</span>,{" "}
                <span className="font-mono">mail</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <ToolResultBanner message="Adding custom domains to your product? SaaSKevin automates DNS routing checks, SSL provisioning, and request routing." />
      )}
    </div>
  )
}
