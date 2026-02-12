"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type RecordResult = {
  type: string
  records: unknown[]
  error: string | null
}

type DnsResult = {
  domain: string
  results: RecordResult[]
}

function formatRecord(type: string, record: unknown): string[] {
  if (type === "MX") {
    const mx = record as { priority: number; exchange: string }
    return [`${mx.priority}`, mx.exchange]
  }
  if (type === "SOA") {
    const soa = record as {
      nsname: string
      hostmaster: string
      serial: number
      refresh: number
      retry: number
      expire: number
      minttl: number
    }
    return [
      `Primary NS: ${soa.nsname}`,
      `Hostmaster: ${soa.hostmaster}`,
      `Serial: ${soa.serial}`,
    ]
  }
  if (type === "TXT") {
    if (Array.isArray(record)) return [record.join("")]
    return [String(record)]
  }
  return [String(record)]
}

function RecordTable({ type, records }: { type: string; records: unknown[] }) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No {type} records found.
      </p>
    )
  }

  if (type === "SOA") {
    const soa = records[0] as Record<string, unknown>
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(soa).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-mono text-xs">{key}</TableCell>
              <TableCell className="font-mono text-xs">{String(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (type === "MX") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Priority</TableHead>
            <TableHead>Exchange</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, i) => {
            const cols = formatRecord(type, record)
            return (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{cols[0]}</TableCell>
                <TableCell className="font-mono text-xs">{cols[1]}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record, i) => {
          const cols = formatRecord(type, record)
          return (
            <TableRow key={i}>
              <TableCell className="font-mono text-xs break-all">
                {cols.join(" ")}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function DnsLookupForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DnsResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/dns-lookup", {
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

  const recordsWithData = result?.results.filter((r) => r.records.length > 0) ?? []
  const defaultTab = recordsWithData[0]?.type ?? "A"

  return (
    <div className="space-y-6 min-w-0">
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
              DNS Records for{" "}
              <span className="font-mono text-primary break-all">{result.domain}</span>
            </CardTitle>
            <CopyButton
              value={JSON.stringify(result.results, null, 2)}
              label="Copy JSON"
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.results.map((r) => (
                <Badge
                  key={r.type}
                  variant={r.records.length > 0 ? "default" : "secondary"}
                >
                  {r.type}
                  <span className="ml-1 opacity-70">{r.records.length}</span>
                </Badge>
              ))}
            </div>

            {recordsWithData.length > 0 ? (
              <Tabs defaultValue={defaultTab} className="min-w-0">
                <div className="w-full max-w-full overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  <TabsList className="h-8 w-max min-w-max flex-nowrap justify-start gap-1 rounded-md bg-muted/70 p-1">
                    {recordsWithData.map((r) => (
                      <TabsTrigger
                        key={r.type}
                        value={r.type}
                        className="!flex-none h-6 px-2.5 text-xs font-medium"
                      >
                        {r.type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {recordsWithData.map((r) => (
                  <TabsContent key={r.type} value={r.type}>
                    <RecordTable type={r.type} records={r.records} />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No DNS records found for this domain.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {result && (
        <ToolResultBanner message="Setting up DNS for your SaaS users' custom domains? SaaSKevin automates CNAME verification and DNS instructions." />
      )}
    </div>
  )
}
