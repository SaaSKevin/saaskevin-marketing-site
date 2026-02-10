import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

export type SiteShellProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showHeader?: boolean
  showFooter?: boolean
  showBackgroundGrid?: boolean
}

export function SiteShell({
  children,
  className,
  contentClassName,
  showHeader = true,
  showFooter = true,
  showBackgroundGrid = true,
}: SiteShellProps) {
  return (
    <main className={cn("min-h-screen bg-background", className)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] rounded-md bg-background px-3 py-2 text-sm text-foreground shadow-md ring-1 ring-border"
      >
        Skip to content
      </a>

      {showBackgroundGrid ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-40"
        />
      ) : null}

      {showHeader ? <Header /> : null}

      <div id="main-content" className={contentClassName}>
        {children}
      </div>

      {showFooter ? <Footer /> : null}
    </main>
  )
}

