"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Users, Settings, Check, Loader2, Globe, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
                    value="shop.puresoaps.com" 
                    readOnly
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <Button className="bg-primary hover:bg-accent text-primary-foreground">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-fadeIn space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground mb-3">Add this CNAME record:</p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-2 bg-background rounded border border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground">CNAME</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded border border-border">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground">shop</span>
                  </div>
                  <div className="flex justify-between p-2 bg-background rounded border border-border items-center">
                    <span className="text-muted-foreground">Target</span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">proxy.saaskevin.com</span>
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Checking DNS propagation...
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
                <p className="text-sm text-muted-foreground">Provisioning SSL certificate...</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Issuing SSL certificate...
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="animate-fadeIn space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-foreground">Domain Active</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Your custom domain is now live!</p>
                <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  https://shop.puresoaps.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>SSL: <span className="text-emerald-500">Active</span></span>
                <span>CDN: <span className="text-emerald-500">Enabled</span></span>
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
  const [activeSection, setActiveSection] = useState<'overview' | 'domains' | 'settings'>('overview')

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
          dashboard.saaskevin.com
        </div>
      </div>
      
      {/* Admin Dashboard */}
      <div className="flex min-h-[320px]">
        {/* Sidebar */}
        <div className="w-48 bg-secondary/30 border-r border-border p-4 hidden sm:block">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">SK</span>
            </div>
            <span className="font-semibold text-foreground text-sm">SaaSKevin</span>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart },
              { id: 'domains', label: 'Domains', icon: Globe },
              { id: 'settings', label: 'Settings', icon: Settings },
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
          {activeSection === 'overview' && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Overview</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary">47</div>
                  <div className="text-xs text-muted-foreground">Active Domains</div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-foreground">2.4M</div>
                  <div className="text-xs text-muted-foreground">Requests/day</div>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-foreground">All systems operational</span>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'domains' && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Active Domains</h4>
              <div className="space-y-2">
                {[
                  { domain: 'shop.puresoaps.com', user: 'user_abc', status: 'active' },
                  { domain: 'shop.bobstees.io', user: 'user_xyz', status: 'active' },
                  { domain: 'store.corp.net', user: 'user_123', status: 'pending' },
                ].map((item) => (
                  <div key={item.domain} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.domain}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.user}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeSection === 'settings' && (
            <div className="animate-fadeIn">
              <h4 className="font-semibold text-foreground mb-4">Configuration</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Origin Server</label>
                  <div className="p-2.5 bg-secondary/50 rounded border border-border text-sm font-mono text-foreground">
                    app.yoursaas.com
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">API Key</label>
                  <div className="p-2.5 bg-secondary/50 rounded border border-border text-sm font-mono text-muted-foreground">
                    pk_live_abc123...
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Webhook URL</label>
                  <div className="p-2.5 bg-secondary/50 rounded border border-border text-sm font-mono text-muted-foreground">
                    https://app.yoursaas.com/webhooks/saaskevin
                  </div>
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

  return (
    <section id="demo" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">See It In Action</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Beautiful UX for everyone
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Your users get a polished domain setup experience. You get a simple admin dashboard.
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
            <Link href="#waitlist">Get Early Access</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
