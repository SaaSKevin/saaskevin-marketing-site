"use client"

import { useState } from "react"
import { Loader2, Search, CheckCircle2, XCircle } from "lucide-react"

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

type HostnameResult = {
  hostname: string
  forwardConfirmed: boolean
}

type ReverseIpResult = {
  ip: string
  hostnames: HostnameResult[]
  count: number
  message?: string
}

export function ReverseIpForm() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReverseIpResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = ip.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/reverse-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: trimmed }),
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
          placeholder="Enter an IP address (e.g. 8.8.8.8)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="flex-1"
          aria-label="IP address"
        />
        <Button type="submit" disabled={loading || !ip.trim()}>
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
              Reverse DNS for{" "}
              <span className="font-mono text-primary break-all">{result.ip}</span>
            </CardTitle>
            <CopyButton
              value={JSON.stringify(result, null, 2)}
              label="Copy JSON"
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={result.count > 0 ? "default" : "secondary"}>
                PTR Records
                <span className="ml-1 opacity-70">{result.count}</span>
              </Badge>
              {result.count > 0 && (
                <Badge variant="outline">
                  Forward Confirmed
                  <span className="ml-1 opacity-70">
                    {result.hostnames.filter((h) => h.forwardConfirmed).length}
                  </span>
                </Badge>
              )}
            </div>

            {result.count > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hostname</TableHead>
                    <TableHead className="w-[160px]">Forward Confirmed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.hostnames.map((h) => (
                    <TableRow key={h.hostname}>
                      <TableCell className="font-mono text-xs break-all">
                        {h.hostname}
                      </TableCell>
                      <TableCell>
                        {h.forwardConfirmed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <XCircle className="h-3.5 w-3.5" />
                            Not confirmed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                {result.message || "No PTR record found for this IP address."}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {result && (
        <ToolResultBanner message="Need custom domains for your SaaS users? SaaSKevin automates DNS routing checks, SSL provisioning, and request routing." />
      )}
    </div>
  )
}
