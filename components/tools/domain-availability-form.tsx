"use client"

import { useState } from "react"
import { Loader2, Search, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type DomainCheckResult = {
  tld: string
  fullDomain: string
  available: boolean
  ip: string | null
}

type AvailabilityResult = {
  domain: string
  results: DomainCheckResult[]
}

export function DomainAvailabilityForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/\..+$/, "") // strip any TLD the user might have included
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/domain-availability", {
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

  const availableCount = result
    ? result.results.filter((r) => r.available).length
    : 0
  const totalCount = result ? result.results.length : 0

  // Sort: available domains first, then taken
  const sortedResults = result
    ? [...result.results].sort((a, b) => {
        if (a.available === b.available) return 0
        return a.available ? -1 : 1
      })
    : []

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a domain name (e.g. myapp)"
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
          {/* Summary card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Results for{" "}
                  <span className="font-mono text-primary">
                    {result.domain}
                  </span>
                </p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {availableCount} of {totalCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  domains available
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Results grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Domain Availability Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {sortedResults.map((item) => (
                  <div
                    key={item.tld}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                      item.available
                        ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
                        : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.available ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                      )}
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-medium text-foreground truncate">
                          {item.fullDomain}
                        </p>
                        {!item.available && item.ip && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            IP: {item.ip}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={item.available ? "default" : "destructive"}
                      className={
                        item.available
                          ? "bg-green-600 hover:bg-green-600 dark:bg-green-600"
                          : ""
                      }
                    >
                      {item.available ? "Available" : "Taken"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross-links */}
          {sortedResults.some((r) => !r.available) && (
            <div className="flex flex-wrap gap-2">
              {sortedResults
                .filter((r) => !r.available)
                .slice(0, 3)
                .map((r) => (
                  <Badge key={r.tld} variant="outline" className="text-xs">
                    <a href={`/tools/whois-lookup?domain=${r.fullDomain}`}>
                      WHOIS for {r.fullDomain}
                    </a>
                  </Badge>
                ))}
            </div>
          )}

          <ToolResultBanner
            message={`${availableCount} of ${totalCount} domains available for "${result.domain}". Building a SaaS where users bring their own domains? SaaSKevin handles domain verification, DNS, and SSL automatically.`}
          />
        </>
      )}
    </div>
  )
}
