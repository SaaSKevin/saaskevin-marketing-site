"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type TxtRecord = {
  value: string
  category: string
  description: string
}

type TxtResult = {
  domain: string
  records: TxtRecord[]
}

const CATEGORY_STYLES: Record<string, string> = {
  SPF: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  DMARC:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  "Google Verification":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  "Facebook Verification":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  "Microsoft Verification":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  "Domain Ownership":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  Other:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
}

function getCategoryStyle(category: string): string {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES["Other"]
}

function groupByCategory(records: TxtRecord[]): Record<string, TxtRecord[]> {
  const groups: Record<string, TxtRecord[]> = {}
  for (const record of records) {
    if (!groups[record.category]) {
      groups[record.category] = []
    }
    groups[record.category].push(record)
  }
  return groups
}

// Preferred display order for categories
const CATEGORY_ORDER = [
  "SPF",
  "DMARC",
  "Google Verification",
  "Microsoft Verification",
  "Facebook Verification",
  "Domain Ownership",
  "Other",
]

function sortedCategories(groups: Record<string, TxtRecord[]>): string[] {
  const keys = Object.keys(groups)
  return keys.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    const aIdx = ai === -1 ? CATEGORY_ORDER.length : ai
    const bIdx = bi === -1 ? CATEGORY_ORDER.length : bi
    return aIdx - bIdx
  })
}

export function TxtRecordForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TxtResult | null>(null)
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
      const res = await fetch("/api/tools/txt-lookup", {
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

  const grouped = result ? groupByCategory(result.records) : {}
  const categories = result ? sortedCategories(grouped) : []

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
          <span className="ml-1.5 hidden sm:inline">Lookup</span>
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
        <Card>
          <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
            <CardTitle className="text-base">
              TXT Records for{" "}
              <span className="font-mono text-primary break-all">{result.domain}</span>
            </CardTitle>
            <CopyButton
              value={JSON.stringify(result.records, null, 2)}
              label="Copy JSON"
            />
          </CardHeader>
          <CardContent>
            {/* Summary badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">
                {result.records.length} record
                {result.records.length !== 1 ? "s" : ""} found
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  className={getCategoryStyle(category)}
                >
                  {category}
                  <span className="ml-1 opacity-70">
                    {grouped[category].length}
                  </span>
                </Badge>
              ))}
            </div>

            {/* Records grouped by category */}
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {category}
                    </h3>
                    <Badge
                      className={getCategoryStyle(category)}
                    >
                      {grouped[category].length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {grouped[category][0].description}
                  </p>
                  <div className="space-y-2">
                    {grouped[category].map((record, i) => (
                      <div
                        key={i}
                        className="relative rounded-md border bg-muted/50 p-3"
                      >
                        <div className="absolute right-2 top-2">
                          <CopyButton value={record.value} label="Copy" />
                        </div>
                        <code className="block text-xs font-mono break-all whitespace-pre-wrap pr-16 text-foreground">
                          {record.value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <ToolResultBanner message="Onboarding user custom domains? SaaSKevin verifies CNAME/A routing, provisions SSL, and handles request routing automatically." />
      )}
    </div>
  )
}
