"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Users, Settings, Shield, Check, Loader2, Globe, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { MASCOTS } from "@/components/mascots"
import Link from "next/link"
import Image from "next/image"

function EndUserDemo() {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5)
    }, 2500)

    return () => clearInterval(timer)
  }, [isAnimating])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-secondary/50 border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
          app.yoursaas.com/settings/domain
        </div>
      </div>

      {/* Widget UI */}
      <div className="p-6 min-h-[320px]">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Custom Domain</h4>
          </div>

          {step === 0 && (
            <div className="animate-fadeIn">
              <p className="text-sm text-muted-foreground mb-4">Connect your own domain to your dashboard.</p>
              <Button className="w-full bg-primary hover:bg-accent text-primary-foreground">
                + Add Custom Domain
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fadeIn space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Enter your domain</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="yourcustomer.com"
                    readOnly
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <Button className="bg-primary hover:bg-accent text-primary-foreground">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn space-y-4">
              {/* Automatic DNS */}
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Add records automatically</p>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      Sign in to your DNS provider and we'll add the DNS records for you.
                    </p> */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[""].map((provider) => (
                        <span
                          key={provider}
                          className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border bg-transparent hover:bg-background"
                  >
                    Sign in with Cloudflare
                  </Button>
                </div>
                {/* <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  Not supported? Use manual DNS below.
                </div> */}
              </div>

              {/* Manual DNS */}
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-foreground">Add these CNAME records</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                    Pending verification
                  </span>
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  Add <span className="font-medium text-foreground">routing</span> +{" "}
                  <span className="font-medium text-foreground">ACME delegation</span> CNAMEs.
                </p> */}

                <div className="mt-3 space-y-3 font-mono text-xs">
                  <div className="bg-background rounded border border-border">
                    {/* <div className="px-2.5 py-2 border-b border-border text-[11px] text-muted-foreground">
                      Routing
                    </div> */}
                    <div className="p-2.5 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-foreground">CNAME</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="text-foreground">shop</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground">Target</span>
                        <span className="inline-flex items-center gap-2 text-primary">
                          proxy.saaskevin.com <Copy className="w-3 h-3 text-muted-foreground" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background rounded border border-border">
                    {/* <div className="px-2.5 py-2 border-b border-border text-[11px] text-muted-foreground">
                      ACME delegation (for automatic SSL)
                    </div> */}
                    <div className="p-2.5 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-foreground">CNAME</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="text-foreground">_acme-challenge.shop</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground">Target</span>
                        <span className="inline-flex items-center gap-2 text-primary">
                          acme_7f9a2b.acme.saaskevin.com{" "}
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Button size="sm" className="bg-primary hover:bg-accent text-primary-foreground">
                    Verify records
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Checking DNS…
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-foreground">DNS Verified</span>
                </div>
                {/* <p className="text-sm text-muted-foreground">Provisioning SSL certificate…</p> */}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Issuing certificate...
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeIn space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-foreground">SSL Active</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Your custom domain is now live.</p>
                <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  https://yourcustomer.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>SSL: <span className="text-emerald-500">Active</span></span>
                {/* <span>CDN: <span className="text-emerald-500">Enabled</span></span> */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 pb-4">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => { setStep(i); setIsAnimating(false); }}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === i ? 'bg-primary' : 'bg-border hover:bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

function AdminDemo() {
  const [activeSection, setActiveSection] = useState<"setup" | "domains" | "security">("setup")
  const [requireSignedToken, setRequireSignedToken] = useState(true)
  const [rotatedSecretKey, setRotatedSecretKey] = useState<string | null>(null)

  const handleRotateSecret = () => {
    const suffix = Math.random().toString(16).slice(2, 8)
    setRotatedSecretKey(`sk_live_${suffix}…`)
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-secondary/50 border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
          app.saaskevin.com/teams/acme/custom-domains/setup
        </div>
      </div>

      {/* Admin Dashboard */}
      <div className="flex min-h-[320px]">
        {/* Sidebar */}
        <div className="w-48 bg-secondary/30 border-r border-border p-4 hidden sm:block">
          <div className="flex items-center gap-2 mb-6">
            <Image src="/icon.svg" alt="SaaSKevin Logo" width={24} height={24} className="rounded" />
            <span className="font-semibold text-foreground text-sm">SaaSKevin</span>
          </div>
          <nav className="space-y-1">
            {[
              { id: "setup", label: "Setup", icon: Settings },
              { id: "domains", label: "Domains", icon: Globe },
              { id: "security", label: "Security", icon: Shield },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveSection(item.id as typeof activeSection)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {activeSection === "setup" && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Site setup</h4>

              <div className="space-y-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Origin hostname</div>
                  <div className="text-sm font-mono text-foreground">app.yoursaas.com</div>
                  {/* <div className="mt-2 text-xs text-muted-foreground">Fallback URL (optional)</div>
                  <div className="text-xs font-mono text-muted-foreground">
                    https://app.yoursaas.com/not-found
                  </div> */}
                </div>

                {/* <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Branded CNAME (optional)</div>
                      <div className="text-sm font-mono text-foreground">custom-domains.yoursaas.com</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Lets users CNAME to your domain instead of a SaaSKevin hostname.
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Optional
                    </span>
                  </div>
                </div> */}

                {/* <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Site public API key (widget)</div>
                  <div className="text-sm font-mono text-muted-foreground">pk_live_abc123…</div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    Used as <span className="font-mono text-foreground">apiKey</span> in{" "}
                    <span className="font-mono text-foreground">SaaSKevin.init</span>.
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {activeSection === "domains" && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Domains</h4>
              <div className="space-y-2">
                {[
                  { domain: "yourcustomer.com", customerId: "cust_abc", status: "ssl_active" },
                  { domain: "shop.bobstees.io", customerId: "cust_xyz", status: "ssl_active" },
                  { domain: "store.corp.net", customerId: "cust_123", status: "pending_ssl" },
                ].map((item) => (
                  <div key={item.domain} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.domain}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.customerId}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === "ssl_active"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-yellow-500/10 text-yellow-700"
                    }`}>
                      {item.status === "ssl_active" ? "SSL active" : "Provisioning SSL"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Security</h4>

              <div className="space-y-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">Require signed customer token</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        When enabled, widget will require an expiring server‑minted token{" "}
                        (<span className="font-mono text-foreground">hash</span>) in order to load.
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={requireSignedToken}
                        onChange={(e) => setRequireSignedToken(e.target.checked)}
                        aria-label="Require signed customer token"
                        className="h-4 w-4 rounded border-border"
                      />
                      {requireSignedToken ? "On" : "Off"}
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">Origin verification secret</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Use it to verify <span className="font-mono text-foreground">X-SaaSKevin-Signature</span> on your origin server/app.
                        {/* The secret is shown once after rotation. */}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-transparent hover:bg-background"
                      onClick={handleRotateSecret}
                    >
                      Rotate
                    </Button>
                  </div>

                  <div className="mt-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs font-mono text-muted-foreground">
                    {rotatedSecretKey ?? "Rotate to generate a new secret…"}
                  </div>

                  {/* <div className="mt-3 text-[11px] text-muted-foreground">
                    Signed headers include{" "}
                    <span className="font-mono text-foreground">X-SaaSKevin-Customer-ID</span>,{" "}
                    <span className="font-mono text-foreground">X-SaaSKevin-Hostname</span>,{" "}
                    <span className="font-mono text-foreground">X-SaaSKevin-Timestamp</span>,{" "}
                    <span className="font-mono text-foreground">X-SaaSKevin-Signature</span>.
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

function BarChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

export function ProductDemo() {
  const [activeTab, setActiveTab] = useState<"end-user" | "admin">("end-user")
  const demoMascot = activeTab === "end-user" ? MASCOTS.cloudflareSignin : MASCOTS.dnsWatcher

  return (
    <section id="demo" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative text-center mb-12">
          <div className="flex justify-center mb-8 md:mb-0 md:absolute md:-top-10 md:right-0">
            <Mascot
              src={demoMascot}
              decorative
              sizes="160px"
              className="w-28 sm:w-32 md:w-40 h-auto rotate-[-3deg] opacity-95"
            />
          </div>
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">See It In Action</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Beautiful UX for everyone
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Your users get a polished domain setup experience.
            You get an admin dashboard for tracking and troubleshooting.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-card border border-border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab("end-user")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "end-user"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              Your Users See
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              You See
            </button>
          </div>
        </div>

        {activeTab === "end-user" ? <EndUserDemo /> : <AdminDemo />}

        <div className="mt-10 text-center">
          <Button className="bg-primary hover:bg-accent text-primary-foreground" asChild>
            <Link href="https://app.saaskevin.com/auth/join">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
