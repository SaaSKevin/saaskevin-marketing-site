"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ToolResultBanner } from "@/components/tools/tool-result-banner"
import { PRICING_COPY, PRICING_OFFER } from "@/lib/marketing-constants"

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
  }
  return `$${amount.toLocaleString()}`
}

function formatCurrencyFull(amount: number): string {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function CostCalculatorForm() {
  const [domains, setDomains] = useState(200)
  const [devRate, setDevRate] = useState(100)
  const [buildHours, setBuildHours] = useState(120)
  const [monthlyMaintHours, setMonthlyMaintHours] = useState(8)

  // Build in-house costs
  const initialBuildCost = buildHours * devRate
  const monthlyMaintCost = monthlyMaintHours * devRate
  const annualMaintCost = monthlyMaintCost * 12
  const yearOneBuildCost = initialBuildCost + annualMaintCost

  // Hidden costs (estimated)
  const sslManagementMonthly = Math.ceil(domains / 100) * 15 // Infra for cert management
  const supportOverheadMonthly = Math.ceil(domains / 50) * devRate * 0.5 // Support tickets
  const monitoringMonthly = 30 // Operational alerts / observability
  const hiddenMonthlyCost = sslManagementMonthly + supportOverheadMonthly + monitoringMonthly
  const hiddenAnnualCost = hiddenMonthlyCost * 12

  const totalBuildYearOne = yearOneBuildCost + hiddenAnnualCost

  // SaaSKevin costs
  const freeDomains = PRICING_OFFER.freeDomains
  const pricePerDomain = PRICING_OFFER.pricePerDomainUsd
  const saaskevinMonthly = Math.max(0, domains - freeDomains) * pricePerDomain
  const saaskevinAnnual = saaskevinMonthly * 12
  const saaskevinSetupHours = 0.5 // 30 minutes
  const saaskevinSetupCost = saaskevinSetupHours * devRate
  const saaskevinYearOne = saaskevinAnnual + saaskevinSetupCost

  const savings = totalBuildYearOne - saaskevinYearOne
  const savingsPercent = totalBuildYearOne > 0 ? Math.round((savings / totalBuildYearOne) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Number of custom domains</Label>
              <Input
                type="number"
                value={domains}
                onChange={(e) => setDomains(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-right"
                min={1}
                max={10000}
              />
            </div>
            <Slider
              value={[domains]}
              onValueChange={([v]) => setDomains(v)}
              min={1}
              max={2000}
              step={10}
            />
            <p className="text-xs text-muted-foreground">
              How many custom domains will your users connect?
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Developer hourly rate ($)</Label>
              <Input
                type="number"
                value={devRate}
                onChange={(e) => setDevRate(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-right"
                min={1}
                max={500}
              />
            </div>
            <Slider
              value={[devRate]}
              onValueChange={([v]) => setDevRate(v)}
              min={25}
              max={300}
              step={5}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Estimated build hours</Label>
              <Input
                type="number"
                value={buildHours}
                onChange={(e) => setBuildHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-right"
                min={1}
                max={1000}
              />
            </div>
            <Slider
              value={[buildHours]}
              onValueChange={([v]) => setBuildHours(v)}
              min={40}
              max={500}
              step={10}
            />
            <p className="text-xs text-muted-foreground">
              DNS validation, SSL provisioning, request routing, UI widget, operational tooling, edge cases
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Monthly maintenance hours</Label>
              <Input
                type="number"
                value={monthlyMaintHours}
                onChange={(e) => setMonthlyMaintHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 text-right"
                min={0}
                max={100}
              />
            </div>
            <Slider
              value={[monthlyMaintHours]}
              onValueChange={([v]) => setMonthlyMaintHours(v)}
              min={0}
              max={40}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Bug fixes, cert renewals, DNS edge cases, support tickets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Build In-House */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Build In-House
              <Badge variant="secondary">DIY</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial build ({buildHours}h x ${devRate})</span>
                <span className="font-mono">{formatCurrencyFull(initialBuildCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual maintenance ({monthlyMaintHours}h/mo)</span>
                <span className="font-mono">{formatCurrencyFull(annualMaintCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>SSL infrastructure</span>
                <span className="font-mono">{formatCurrencyFull(sslManagementMonthly * 12)}/yr</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Support overhead</span>
                <span className="font-mono">{formatCurrencyFull(supportOverheadMonthly * 12)}/yr</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Operational alerts</span>
                <span className="font-mono">{formatCurrencyFull(monitoringMonthly * 12)}/yr</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Year 1 Total</span>
              <span className="font-mono text-lg">{formatCurrencyFull(totalBuildYearOne)}</span>
            </div>
          </CardContent>
        </Card>

        {/* SaaSKevin */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Use SaaSKevin
              <Badge>Managed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Setup (30 min x ${devRate})</span>
                <span className="font-mono">{formatCurrencyFull(saaskevinSetupCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  First {freeDomains} domains
                </span>
                <span className="font-mono text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {Math.max(0, domains - freeDomains)} additional domains x {PRICING_COPY.pricePerDomain}/mo
                </span>
                <span className="font-mono">{formatCurrencyFull(saaskevinAnnual)}/yr</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>SSL provisioning</span>
                <span className="text-green-600">Included</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>DNS verification</span>
                <span className="text-green-600">Included</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Operations &amp; support</span>
                <span className="text-green-600">Included</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Year 1 Total</span>
              <span className="font-mono text-lg text-primary">{formatCurrencyFull(saaskevinYearOne)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Summary */}
      {savings > 0 ? (
        <Card className="border-green-600/30 bg-green-600/5">
          <CardContent className="">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-bold">Estimated Year 1 Savings with SaaSKevin</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(savings)}
              </p>
              <p className="text-sm text-muted-foreground">
                That&apos;s {savingsPercent}% less than building in-house
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              At this scale and cost structure, building in-house may be comparable. Consider the
              opportunity cost of developer time spent on infrastructure vs. product features.
            </p>
          </CardContent>
        </Card>
      )}

      <ToolResultBanner
        message={`Ready to skip the build phase? SaaSKevin gives you custom domains for your SaaS in 5 minutes with ${PRICING_COPY.freeDomainsFree}.`}
      />
    </div>
  )
}
