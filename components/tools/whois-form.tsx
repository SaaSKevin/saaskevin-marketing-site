"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CopyButton } from "@/components/tools/copy-button"
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

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  try {
    const target = new Date(dateStr)
    const now = new Date()
    return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  } catch {
    return null
  }
}

function getDomainAge(dateStr: string | null): string | null {
  if (!dateStr) return null
  try {
    const created = new Date(dateStr)
    const now = new Date()
    const years = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    )
    if (years < 1) {
      const months = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
      )
      return `${months} month${months !== 1 ? "s" : ""}`
    }
    return `${years} year${years !== 1 ? "s" : ""}`
  } catch {
    return null
  }
}

export function WhoisForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawOpen, setRawOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
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

  const expiryDays = result ? getDaysUntil(result.parsed.expiryDate) : null
  const domainAge = result ? getDomainAge(result.parsed.createdDate) : null

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
        <>
          {/* Key Facts */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">
                WHOIS for{" "}
                <span className="font-mono text-primary break-all">{result.domain}</span>
              </CardTitle>
              <CopyButton
                value={JSON.stringify(result.raw, null, 2)}
                label="Copy JSON"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick stats */}
              <div className="flex flex-wrap gap-2">
                {domainAge && (
                  <Badge variant="secondary">Age: {domainAge}</Badge>
                )}
                {expiryDays !== null && (
                  <Badge
                    variant={expiryDays < 30 ? "destructive" : "secondary"}
                  >
                    {expiryDays > 0
                      ? `Expires in ${expiryDays} days`
                      : "Expired"}
                  </Badge>
                )}
                <Badge variant="outline">{result.server}</Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.parsed.domainName && (
                    <TableRow>
                      <TableCell className="text-xs font-medium">Domain</TableCell>
                      <TableCell className="font-mono text-xs">{result.parsed.domainName}</TableCell>
                    </TableRow>
                  )}
                  {result.parsed.registrar && (
                    <TableRow>
                      <TableCell className="text-xs font-medium">Registrar</TableCell>
                      <TableCell className="font-mono text-xs">{result.parsed.registrar}</TableCell>
                    </TableRow>
                  )}
                  {result.parsed.registrant && (
                    <TableRow>
                      <TableCell className="text-xs font-medium">Registrant</TableCell>
                      <TableCell className="font-mono text-xs">{result.parsed.registrant}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="text-xs font-medium">Created</TableCell>
                    <TableCell className="font-mono text-xs">{formatDate(result.parsed.createdDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Updated</TableCell>
                    <TableCell className="font-mono text-xs">{formatDate(result.parsed.updatedDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Expires</TableCell>
                    <TableCell className="font-mono text-xs">{formatDate(result.parsed.expiryDate)}</TableCell>
                  </TableRow>
                  {result.parsed.nameServers.length > 0 && (
                    <TableRow>
                      <TableCell className="text-xs font-medium align-top">Name Servers</TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex flex-col gap-1">
                          {result.parsed.nameServers.map((ns) => (
                            <span key={ns}>{ns}</span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {result.parsed.status.length > 0 && (
                    <TableRow>
                      <TableCell className="text-xs font-medium align-top">Status</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {result.parsed.status.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs font-mono">
                              {s.split(" ")[0]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Raw WHOIS data */}
              <Collapsible open={rawOpen} onOpenChange={setRawOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    {rawOpen ? "Hide" : "Show"} raw WHOIS data
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 max-h-96 overflow-y-auto rounded-lg bg-muted p-4 text-xs font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(result.raw, null, 2)}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Cross-links */}
          <div className="flex flex-wrap gap-2">
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

          <ToolResultBanner message="Building a SaaS where users bring their own domains? SaaSKevin handles domain verification, DNS setup, and SSL automatically." />
        </>
      )}
    </div>
  )
}
