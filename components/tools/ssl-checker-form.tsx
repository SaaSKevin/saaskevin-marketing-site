"use client"

import { useState } from "react"
import { Loader2, Search, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

type CertInfo = {
  subject: Record<string, string>
  issuer: Record<string, string>
  validFrom: string
  validTo: string
  serialNumber: string
  fingerprint: string
  fingerprint256: string
  subjectAltNames: string[]
  protocol: string
}

type SslResult = {
  domain: string
  cert: CertInfo
  chain: CertInfo[]
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function ExpiryIndicator({ validTo }: { validTo: string }) {
  const days = getDaysUntil(validTo)
  const maxDays = 365
  const percentage = Math.max(0, Math.min(100, (days / maxDays) * 100))

  let color = "text-green-600"
  let bgClass = "[&>div]:bg-green-600"
  let Icon = ShieldCheck
  let label = `${days} days remaining`

  if (days <= 0) {
    color = "text-destructive"
    bgClass = "[&>div]:bg-destructive"
    Icon = ShieldX
    label = "Expired"
  } else if (days <= 7) {
    color = "text-destructive"
    bgClass = "[&>div]:bg-destructive"
    Icon = ShieldAlert
    label = `${days} days remaining - Expiring soon!`
  } else if (days <= 30) {
    color = "text-yellow-600"
    bgClass = "[&>div]:bg-yellow-600"
    Icon = ShieldAlert
    label = `${days} days remaining`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>
      <Progress value={percentage} className={`h-2 ${bgClass}`} />
    </div>
  )
}

export function SslCheckerForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SslResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/ssl-check", {
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
        <>
          {/* Certificate Overview */}
          <Card>
            <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
              <CardTitle className="text-base">
                SSL Certificate for{" "}
                <span className="font-mono text-primary break-all">{result.domain}</span>
              </CardTitle>
              <CopyButton
                value={JSON.stringify({ cert: result.cert, chain: result.chain }, null, 2)}
                label="Copy JSON"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <ExpiryIndicator validTo={result.cert.validTo} />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Subject</TableCell>
                    <TableCell className="font-mono text-xs">
                      {result.cert.subject.CN || Object.values(result.cert.subject).join(", ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Issuer</TableCell>
                    <TableCell className="font-mono text-xs">
                      {result.cert.issuer.O || result.cert.issuer.CN || Object.values(result.cert.issuer).join(", ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Valid From</TableCell>
                    <TableCell className="font-mono text-xs">{result.cert.validFrom}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Valid To</TableCell>
                    <TableCell className="font-mono text-xs">{result.cert.validTo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Protocol</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{result.cert.protocol}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Serial Number</TableCell>
                    <TableCell className="font-mono text-xs break-all">{result.cert.serialNumber}</TableCell>
                  </TableRow>
                  {result.cert.subjectAltNames.length > 0 && (
                    <TableRow>
                      <TableCell className="text-xs font-medium align-top">SANs</TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex flex-wrap gap-1">
                          {result.cert.subjectAltNames.slice(0, 10).map((san) => (
                            <Badge key={san} variant="outline" className="text-xs">
                              {san}
                            </Badge>
                          ))}
                          {result.cert.subjectAltNames.length > 10 && (
                            <Badge variant="secondary" className="text-xs">
                              +{result.cert.subjectAltNames.length - 10} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Certificate Chain */}
          {result.chain.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Certificate Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Leaf cert */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <div className="w-px h-6 bg-border" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {result.cert.subject.CN || "Leaf Certificate"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued by {result.cert.issuer.O || result.cert.issuer.CN}
                      </p>
                    </div>
                  </div>
                  {/* Intermediates */}
                  {result.chain.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
                        {i < result.chain.length - 1 && (
                          <div className="w-px h-6 bg-border" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {cert.subject.CN || cert.subject.O || `Intermediate ${i + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Issued by {cert.issuer.O || cert.issuer.CN}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <ToolResultBanner message="SaaSKevin automatically provisions and renews SSL certificates for every custom domain your users add. No manual certificate management needed." />
        </>
      )}
    </div>
  )
}
