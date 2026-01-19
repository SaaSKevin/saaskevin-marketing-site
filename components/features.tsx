import { Globe, Shield, Zap, Code, Palette, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Pre-built Widget",
    description: "Paste one JavaScript snippet. Your users can add and manage custom domains without ever leaving your app.",
  },
  {
    icon: Shield,
    title: "Automatic SSL",
    description: "Every custom domain gets HTTPS automatically. No certificates to manage, no renewals to worry about. Ever.",
  },
  {
    icon: Zap,
    title: "We Handle DNS",
    description: "Your users follow simple instructions. We verify everything and tell them exactly when their domain is ready.",
  },
  {
    icon: Code,
    title: "5 Lines of Code",
    description: "Read one header to know which customer is visiting. That's your entire backend integration. Seriously.",
  },
  {
    icon: Palette,
    title: "Matches Your Brand",
    description: "Customize colors, fonts, and styling. The widget looks and feels like part of your product.",
  },
  {
    icon: BarChart3,
    title: "Domain Dashboard",
    description: "See all your customers' domains in one place. Track usage, status, and troubleshoot issues instantly.",
  },
]

const comparisons = [
  { label: "How you add it", competitors: "Complex backend APIs", saaskevin: "Paste a widget" },
  { label: "Code you write", competitors: "~100+ lines", saaskevin: "5 lines" },
  { label: "User interface", competitors: "Build it yourself", saaskevin: "Ready to use" },
  { label: "DNS headaches", competitors: "You figure it out", saaskevin: "We handle it" },
  { label: "SSL certificates", competitors: "Your problem", saaskevin: "Automatic" },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Custom domains shouldn't be a headache. We take care of everything so you can focus on your product.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">How we compare</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-secondary/50 border-b border-border">
              <div className="p-4 text-sm font-medium text-muted-foreground">Feature</div>
              <div className="p-4 text-sm font-medium text-muted-foreground text-center border-l border-border">Other Solutions</div>
              <div className="p-4 text-sm font-medium text-primary text-center border-l border-border">SaaSKevin</div>
            </div>
            {comparisons.map((row, index) => (
              <div key={row.label} className={`grid grid-cols-3 ${index !== comparisons.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="p-4 text-sm text-foreground font-medium">{row.label}</div>
                <div className="p-4 text-sm text-muted-foreground text-center border-l border-border">{row.competitors}</div>
                <div className="p-4 text-sm text-foreground text-center border-l border-border font-medium">{row.saaskevin}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-1">5 min</div>
            <div className="text-sm text-muted-foreground">Average setup time</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-1">5 lines</div>
            <div className="text-sm text-muted-foreground">Of backend code needed</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-1">$0.20</div>
            <div className="text-sm text-muted-foreground">Per domain/month (minimum 100)</div>
          </div>
        </div>
      </div>
    </section>
  )
}
