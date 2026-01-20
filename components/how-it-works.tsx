"use client"

import { useState } from "react"
import { Settings, Code2, Shield, Rocket, Check, Copy, Globe, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    id: "setup",
    number: "01",
    icon: Settings,
    title: "Connect Your App",
    time: "2 min",
  },
  {
    id: "widget",
    number: "02",
    icon: Code2,
    title: "Add the Widget",
    time: "1 min",
  },
  {
    id: "verify",
    number: "03",
    icon: Shield,
    title: "Read One Header",
    time: "2 min",
  },
  // {
  //   id: "done",
  //   number: "04",
  //   icon: Rocket,
  //   title: "You're Done!",
  //   time: "Instant",
  // },
]

function SetupContent() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("edge.saaskevin.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Tell SaaSKevin your origin server (where your app already runs)</h3>
        {/* <p className="text-muted-foreground">
          Enter your origin in SaaSKevin.
        </p> */}
      </div>

      {/* Origin settings */}
      <div className="bg-secondary/50 rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Enter Your Origin Server</span>
        </div>

        {/* <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-xs uppercase tracking-wider text-muted-foreground font-medium border-b border-border pb-2">
            <div>Setting</div>
            <div className="col-span-2">Value</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-card rounded-lg px-3 py-2 border border-border text-sm">
              Origin Server
            </div>
            <div className="col-span-2 bg-card rounded-lg px-3 py-2 border border-primary/30 text-sm font-mono text-primary fix-overflow">
              app.yoursaas.com
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-card rounded-lg px-3 py-2 border border-border text-sm">
              Fallback URL
            </div>
            <div className="col-span-2 bg-card rounded-lg px-3 py-2 border border-primary/30 text-primary text-sm font-mono text-muted-foreground fix-overflow">
              https://app.yoursaas.com/not-found
            </div>
          </div>
        </div> */}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 items-center">
            <div className="col-span-3 bg-card rounded-lg px-3 py-2 border border-primary/30 text-sm font-mono text-primary fix-overflow">
              app.yoursaas.com
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          This is your existing app host or server. You keep it pointed at your current hosting provider — SaaSKevin proxies custom domain traffic to it.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Add a new CNAME record (your users will point their custom domains to this)</h3>
        {/* <p className="text-muted-foreground">
          Create a CNAME record (like shop.yoursaas.com) that users will point their custom domains at.
        </p> */}
      </div>

      {/* Visual DNS setup */}
      <div className="bg-secondary/50 rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Add DNS Record</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-xs uppercase tracking-wider text-muted-foreground font-medium border-b border-border pb-2">
            <div>Type</div>
            <div>Name</div>
            <div>Value</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-card rounded-lg px-3 py-2 border border-border text-sm font-mono">
              CNAME
            </div>
            <div className="bg-card rounded-lg px-3 py-2 border border-primary/30 text-sm font-mono text-primary">
              shop
            </div>
            <div className="relative">
              <div className="bg-card rounded-lg px-3 py-2 border border-border text-sm font-mono pr-10 fix-overflow">
                proxy.saaskevin.com
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy SaaSKevin CNAME target"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          This creates a branded CNAME target for your users’ custom domains (traffic to <span className="font-mono text-primary">shop.yoursaas.com</span> will be proxied to <span className="font-mono text-primary">app.yoursaas.com</span>).
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Check className="w-4 h-4 text-emerald-500" />
        <span>No code changes to your app required for this step</span>
      </div>
    </div>
  )
}

function WidgetContent() {
  const [copied, setCopied] = useState(false)

  const code = `<div id="domain-settings"></div>
<script src="https://js.saaskevin.com/v1"></script>
<script>
  SaaSKevin.init({
    customerId: "{{current_user_id}}"
  }).mount('#domain-settings');
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Drop in our widget</h3>
        <p className="text-muted-foreground">
          Paste this snippet where you want users to manage their custom domains.
          We provide a beautiful, ready-to-use UI.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-foreground rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <span className="text-xs text-white/50 ml-2">settings.html</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-white/80 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>

      {/* Widget preview */}
      <div className="bg-secondary/50 rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground mb-3">What your users will see:</p>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Custom Domain</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-muted-foreground">
              puresoaps.com
            </div>
            <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerifyContent() {
  const [copied, setCopied] = useState(false)

  const code = `const customerId = req.headers['x-saaskevin-customer-id']
const user = await getUser(customerId)
renderDashboard(user)`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Read one header to know which customer</h3>
        <p className="text-muted-foreground">
          When someone visits a custom domain, we tell you which customer it belongs to.
          Just read the header and serve their content.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-foreground rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <span className="text-xs text-white/50 ml-2">middleware.js</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-white/80 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>

      {/* Visual explanation */}
      <div className="bg-secondary/50 rounded-xl p-5 border border-border">
        <p className="text-sm font-medium text-foreground mb-4">How it works:</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 text-sm">
          <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border">
            <span className="text-muted-foreground">User visits</span>
            <span className="font-mono text-primary">puresoaps.com</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
          <span className="text-muted-foreground md:hidden">↓</span>
          <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border">
            <span className="text-muted-foreground">We add</span>
            <span className="font-mono text-primary">x-saaskevin-customer-id: user_123</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
          <span className="text-muted-foreground md:hidden">↓</span>
          <div className="flex items-center gap-2 bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600">You serve their content</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DoneContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Your users can now add custom domains</h3>
        <p className="text-muted-foreground">
          That's the entire integration. From now on, we handle all the complexity.
        </p>
      </div>

      {/* What we handle */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: "DNS Validation", desc: "We verify domain ownership automatically" },
          { title: "SSL Certificates", desc: "Provisioned and renewed, always secure" },
          { title: "Traffic Routing", desc: "Requests flow seamlessly to your app" },
          { title: "Domain Management", desc: "Users can add, remove, update anytime" },
        ].map((item) => (
          <div key={item.title} className="bg-secondary/50 rounded-xl p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Total integration time: ~5 minutes</p>
            <p className="text-sm text-muted-foreground">
              One DNS record + one code snippet + read one header.
              No infrastructure to manage, no certificates to renew, no DNS headaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState("setup")

  const renderContent = () => {
    switch (activeTab) {
      case "setup":
        return <SetupContent />
      case "widget":
        return <WidgetContent />
      case "verify":
        return <VerifyContent />
      case "done":
        return <DoneContent />
      default:
        return <SetupContent />
    }
  }

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Add custom domains in 5 minutes
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            No complex APIs. No infrastructure changes. We handle all the headaches.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              <span className="text-xs opacity-60">{tab.number}</span>
              {/* <tab.icon className="w-4 h-4" /> */}
              <span className="hidden sm:inline">{tab.title}</span>
              <span className="text-xs opacity-60">({tab.time})</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </section>
  )
}
