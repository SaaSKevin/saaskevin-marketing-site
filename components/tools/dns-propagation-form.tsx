"use client"

import { useState } from "react"
import { Loader2, Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type ServerResult = {
  server: string
  location: string
  ip: string
  records: string[]
  status: "resolved" | "no_records" | "error"
  responseTime: number
}

type PropagationResult = {
  domain: string
  type: string
  results: ServerResult[]
  propagated: boolean
  resolvedCount: number
  totalServers: number
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"] as const

function StatusIcon({ status }: { status: ServerResult["status"] }) {
  if (status === "resolved") return <CheckCircle2 className="h-4 w-4 text-green-600" />
  if (status === "error") return <AlertCircle className="h-4 w-4 text-yellow-600" />
  return <XCircle className="h-4 w-4 text-muted-foreground" />
}

export function DnsPropagationForm() {
  const [domain, setDomain] = useState("")
  const [recordType, setRecordType] = useState<string>("A")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PropagationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/dns-propagation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed, type: recordType }),
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
        <Select value={recordType} onValueChange={setRecordType}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RECORD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">
                {result.type} Propagation for{" "}
                <span className="font-mono text-primary break-all">{result.domain}</span>
              </CardTitle>
              <Badge variant={result.propagated ? "default" : "secondary"}>
                {result.propagated
                  ? "Fully Propagated"
                  : `${result.resolvedCount}/${result.totalServers} Servers`}
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>DNS Provider</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.results.map((r) => (
                    <TableRow key={r.server}>
                      <TableCell>
                        <StatusIcon status={r.status} />
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <span className="font-medium">{r.server}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">
                            ({r.ip})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.location}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.records.length > 0
                          ? r.records.join(", ")
                          : r.status === "error"
                            ? "Error"
                            : "No records"}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {r.responseTime}ms
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <ToolResultBanner message="SaaSKevin verifies DNS routing for custom domains and activates SSL once records resolve correctly." />
        </>
      )}
    </div>
  )
}
