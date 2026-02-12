"use client"

import { useState, useRef } from "react"
import { Loader2, Search, Network } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type SubdomainEntry = {
  subdomain: string
  fqdn: string
  ips: string[]
}

type SubdomainResult = {
  domain: string
  total_checked: number
  found: SubdomainEntry[]
}

export function SubdomainFinderForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SubdomainResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ checked: number; total: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
    if (!trimmed) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setResult(null)
    setProgress({ checked: 0, total: 80 })

    // Simulate scanning progress while the API works
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (!prev) return prev
        const next = Math.min(prev.checked + 2, prev.total - 1)
        return { ...prev, checked: next }
      })
    }, 400)

    try {
      const res = await fetch("/api/tools/subdomain-find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }
      setResult(data)
      setProgress({ checked: data.total_checked, total: data.total_checked })
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setError("Network error. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
    }
  }

  function buildCopyText(): string {
    if (!result) return ""
    const lines = result.found.map(
      (entry) => `${entry.fqdn}\t${entry.ips.join(", ")}`,
    )
    return `Subdomains for ${result.domain}\n${"=".repeat(40)}\n${lines.join("\n")}`
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a root domain (e.g. example.com)"
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
          <span className="ml-1.5 hidden sm:inline">Scan</span>
        </Button>
      </form>

      {loading && progress && (
        <Card>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Network className="h-4 w-4 animate-pulse" />
                  Scanning subdomains...
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {progress.checked}/{progress.total} checked
                </span>
              </div>
              <Progress
                value={(progress.checked / progress.total) * 100}
              />
            </div>
          </CardContent>
        </Card>
      )}

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
              Subdomains for{" "}
              <span className="font-mono text-primary break-all">{result.domain}</span>
            </CardTitle>
            <CopyButton value={buildCopyText()} label="Copy All" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default">
                {result.found.length} found
              </Badge>
              <Badge variant="secondary">
                {result.total_checked} checked
              </Badge>
            </div>

            {result.found.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>IP Address(es)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.found.map((entry) => (
                      <TableRow key={entry.fqdn}>
                        <TableCell className="font-mono text-xs">
                          {entry.fqdn}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {entry.ips.map((ip, i) => (
                            <span key={ip}>
                              {ip}
                              {i < entry.ips.length - 1 && (
                                <span className="text-muted-foreground">
                                  ,{" "}
                                </span>
                              )}
                            </span>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No subdomains found for this domain. The domain may not use
                common subdomain names, or the subdomains may not have public
                A records.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {result && (
        <ToolResultBanner message="Managing subdomains for your SaaS users' custom domains? SaaSKevin automates subdomain routing, DNS verification, and SSL provisioning." />
      )}
    </div>
  )
}
