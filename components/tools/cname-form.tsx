"use client"

import { useState } from "react"
import { Loader2, Search, CheckCircle2, XCircle, Info, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/tools/copy-button"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"

type CnameResult = {
  domain: string
  cnames: string[]
  found: boolean
  aRecords?: string[]
  note?: string
}

type ProviderLink = {
  dashboardLabel: string
  dashboardUrl: string
  docsLabel?: string
  docsUrl?: string
}

const PROVIDER_LINKS: Record<string, ProviderLink> = {
  cloudflare: {
    dashboardLabel: "Cloudflare dashboard",
    dashboardUrl: "https://dash.cloudflare.com/",
    docsLabel: "Cloudflare DNS docs",
    docsUrl: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
  },
  godaddy: {
    dashboardLabel: "GoDaddy DNS management",
    dashboardUrl: "https://dcc.godaddy.com/manage",
  },
  namecheap: {
    dashboardLabel: "Namecheap domain list",
    dashboardUrl: "https://ap.www.namecheap.com/domains/list/",
  },
  route53: {
    dashboardLabel: "AWS Route 53 console",
    dashboardUrl: "https://console.aws.amazon.com/route53/home",
    docsLabel: "Route 53 records docs",
    docsUrl: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html",
  },
  "google-cloud-dns": {
    dashboardLabel: "Google Cloud DNS",
    dashboardUrl: "https://console.cloud.google.com/net-services/dns",
    docsLabel: "Cloud DNS records docs",
    docsUrl: "https://cloud.google.com/dns/docs/records",
  },
  "squarespace-domains": {
    dashboardLabel: "Squarespace domains",
    dashboardUrl: "https://account.squarespace.com/domains",
  },
  porkbun: {
    dashboardLabel: "Porkbun account",
    dashboardUrl: "https://porkbun.com/account",
  },
  hostinger: {
    dashboardLabel: "Hostinger hPanel",
    dashboardUrl: "https://hpanel.hostinger.com/",
  },
  bluehost: {
    dashboardLabel: "Bluehost account",
    dashboardUrl: "https://my.bluehost.com/",
  },
  ionos: {
    dashboardLabel: "IONOS account",
    dashboardUrl: "https://my.ionos.com/",
  },
  digitalocean: {
    dashboardLabel: "DigitalOcean networking",
    dashboardUrl: "https://cloud.digitalocean.com/networking/domains",
  },
  vercel: {
    dashboardLabel: "Vercel domains",
    dashboardUrl: "https://vercel.com/dashboard/domains",
    docsLabel: "Vercel domains docs",
    docsUrl: "https://vercel.com/docs/domains",
  },
  netlify: {
    dashboardLabel: "Netlify dashboard",
    dashboardUrl: "https://app.netlify.com/",
    docsLabel: "Netlify DNS docs",
    docsUrl: "https://docs.netlify.com/domains-https/netlify-dns/",
  },
  "azure-dns": {
    dashboardLabel: "Azure Portal DNS zones",
    dashboardUrl:
      "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FdnsZones",
    docsLabel: "Azure DNS docs",
    docsUrl: "https://learn.microsoft.com/en-us/azure/dns/dns-getstarted-portal",
  },
}

const DNS_PROVIDERS = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    steps: [
      "Log in to your Cloudflare dashboard",
      "Select the domain you want to configure",
      "Go to the DNS tab",
      'Click "Add record"',
      'Select "CNAME" as the type',
      "Enter the subdomain in the Name field (e.g., app)",
      "Enter the target in the Target field",
      'Set Proxy status to "DNS only" (grey cloud) for custom domain setups',
      "Click Save",
    ],
  },
  {
    id: "godaddy",
    name: "GoDaddy",
    steps: [
      "Log in to your GoDaddy account",
      "Go to My Products and find your domain",
      "Click DNS next to the domain",
      "Click Add under the Records section",
      "Select CNAME as the Type",
      "Enter the subdomain as the Host (e.g., app)",
      "Enter the target as the Points To value",
      "Set TTL to 1 hour",
      "Click Save",
    ],
  },
  {
    id: "namecheap",
    name: "Namecheap",
    steps: [
      "Log in to your Namecheap account",
      "Go to Domain List and click Manage next to your domain",
      "Click the Advanced DNS tab",
      'Click "Add New Record"',
      "Select CNAME Record as the type",
      "Enter the subdomain as the Host (e.g., app)",
      "Enter the target as the Value",
      "Set TTL to Automatic",
      "Click the checkmark to save",
    ],
  },
  {
    id: "route53",
    name: "AWS Route 53",
    steps: [
      "Open the Route 53 console",
      "Click Hosted Zones, then select your domain",
      "Click Create Record",
      "Enter the subdomain in the Record name field",
      "Select CNAME as the Record type",
      "Enter the target in the Value field",
      "Set TTL to 300 seconds (or your preference)",
      "Click Create records",
    ],
  },
  {
    id: "google-cloud-dns",
    name: "Google Cloud DNS",
    steps: [
      "Open Google Cloud Console and go to Cloud DNS",
      "Select your managed zone",
      'Click "Add standard"',
      "Enter the subdomain in the DNS name field (e.g., app)",
      "Select CNAME as the Resource record type",
      "Enter the target domain in the Data field",
      "Set TTL (300 seconds is common)",
      'Click "Add"',
    ],
  },
  {
    id: "squarespace-domains",
    name: "Squarespace Domains",
    steps: [
      "Log in to your Squarespace account",
      "Go to Domains and select your domain",
      "Open DNS Settings",
      'Click "Add record"',
      "Choose CNAME as the record type",
      "Enter your subdomain in Host (e.g., app)",
      "Enter the target in the Points to field",
      "Save your changes",
    ],
  },
  {
    id: "porkbun",
    name: "Porkbun",
    steps: [
      "Log in to your Porkbun account",
      "Open Domain Management and select your domain",
      'Click "DNS Records"',
      'Click "Add Record"',
      "Set Type to CNAME",
      "Enter your subdomain in Host (e.g., app)",
      "Enter the target in the Answer field",
      "Click Save",
    ],
  },
  {
    id: "hostinger",
    name: "Hostinger",
    steps: [
      "Log in to Hostinger hPanel",
      "Go to Domains and select your domain",
      "Open DNS / Nameservers",
      'Click "Add record"',
      "Select CNAME as the record type",
      "Enter your subdomain in Name (e.g., app)",
      "Enter the target in Points to",
      "Save the record",
    ],
  },
  {
    id: "bluehost",
    name: "Bluehost",
    steps: [
      "Log in to your Bluehost account",
      "Go to Domains and select your domain",
      "Open DNS settings (Zone Editor)",
      "Add a new DNS record",
      "Choose CNAME as the record type",
      "Enter your subdomain as Host Record (e.g., app)",
      "Enter the target in Points To",
      "Save the record",
    ],
  },
  {
    id: "ionos",
    name: "IONOS",
    steps: [
      "Log in to your IONOS account",
      "Go to Domains & SSL and select your domain",
      "Open DNS settings",
      'Click "Add record"',
      "Select CNAME",
      "Enter your subdomain in the Host name field",
      "Enter the target domain in Value",
      "Save the new record",
    ],
  },
  {
    id: "digitalocean",
    name: "DigitalOcean DNS",
    steps: [
      "Log in to DigitalOcean Control Panel",
      "Go to Networking and select your domain",
      'Click "Create New Record"',
      "Select CNAME record type",
      "Enter the subdomain as Hostname (e.g., app)",
      "Enter the target in Is an alias of",
      "Set TTL as needed",
      "Click Create Record",
    ],
  },
  {
    id: "vercel",
    name: "Vercel DNS",
    steps: [
      "Log in to your Vercel dashboard",
      "Go to Domains and select your domain",
      "Open the DNS records tab",
      'Click "Add"',
      "Choose CNAME as the type",
      "Enter your subdomain in Name (e.g., app)",
      "Enter the target in Value",
      "Save the record",
    ],
  },
  {
    id: "netlify",
    name: "Netlify DNS",
    steps: [
      "Log in to your Netlify dashboard",
      "Open Domain management for your site or team",
      "Go to DNS records",
      'Click "Add new record"',
      "Select CNAME as the record type",
      "Enter your subdomain in Name (e.g., app)",
      "Enter the target in Value",
      "Save the record",
    ],
  },
  {
    id: "azure-dns",
    name: "Azure DNS",
    steps: [
      "Open Azure Portal and go to DNS zones",
      "Select your DNS zone",
      "Click + Record set",
      "Enter your subdomain in Name (e.g., app)",
      "Set Type to CNAME",
      "Enter the target in Alias domain name",
      "Set TTL as needed",
      "Click OK to create the record",
    ],
  },
]

export function CnameForm() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CnameResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/cname-validate", {
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
    <div className="space-y-6 min-w-0">
      {/* Lookup */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a domain to check CNAME (e.g. app.example.com)"
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
        <Card>
          <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
            <CardTitle className="text-base">
              CNAME for{" "}
              <span className="font-mono text-primary break-all">{result.domain}</span>
            </CardTitle>
            {result.found && (
              <CopyButton
                value={result.cnames.join("\n")}
                label="Copy"
              />
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {result.found ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    CNAME record found
                  </span>
                </div>
                {result.cnames.map((cname) => (
                  <div
                    key={cname}
                    className="rounded-lg bg-muted px-4 py-3 font-mono text-sm"
                  >
                    {result.domain} → {cname}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    No CNAME record found
                  </span>
                </div>
                {result.note && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{result.note}</span>
                  </div>
                )}
                {result.aRecords && result.aRecords.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      A records found instead:
                    </p>
                    {result.aRecords.map((ip) => (
                      <Badge key={ip} variant="outline" className="font-mono text-xs">
                        {ip}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* DNS Provider Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            How to Add a CNAME Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cloudflare" className="min-w-0">
            <div className="w-full max-w-full overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <TabsList className="h-8 w-max min-w-max flex-nowrap justify-start gap-1 rounded-md bg-muted/70 p-1">
                {DNS_PROVIDERS.map((provider) => (
                  <TabsTrigger
                    key={provider.id}
                    value={provider.id}
                    className="!flex-none h-6 px-2.5 text-xs font-medium"
                  >
                    {provider.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {DNS_PROVIDERS.map((provider) => (
              <TabsContent key={provider.id} value={provider.id} className="space-y-4 pt-2">
                {PROVIDER_LINKS[provider.id] && (
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <a
                        href={PROVIDER_LINKS[provider.id].dashboardUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        {PROVIDER_LINKS[provider.id].dashboardLabel}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {PROVIDER_LINKS[provider.id].docsUrl && (
                        <a
                          href={PROVIDER_LINKS[provider.id].docsUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {PROVIDER_LINKS[provider.id].docsLabel}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <ol className="space-y-2.5">
                  {provider.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border bg-background/70 p-3"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <ToolResultBanner message="Skip the manual CNAME setup. SaaSKevin gives your users an embedded widget that guides them through DNS configuration with real-time verification." />
      )}
    </div>
  )
}
