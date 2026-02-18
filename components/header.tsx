"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { MARKETING_URLS, SIGNUP_CTA_TEXT } from "@/lib/marketing-constants"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="SaaSKevin Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-semibold text-foreground tracking-tight">SaaSKevin</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            How It Works
          </Link>
          {/* <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Features
          </Link> */}
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Pricing
          </Link>
          <Link href="/#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Demo
          </Link>
          <Link href="/industries" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Who It's For
          </Link>
          <Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Compare
          </Link>
          <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Free Tools
          </Link>
          {/* <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Blog
          </Link> */}
        </div>

        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground whitespace-nowrap" asChild>
            <Link href={MARKETING_URLS.auth.login}>Log In</Link>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-accent text-primary-foreground whitespace-nowrap" asChild>
            <Link href={MARKETING_URLS.auth.join}>{SIGNUP_CTA_TEXT}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            {/* <Link
              href="/#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link> */}
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/industries"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Who It's For
            </Link>
            <Link
              href="/compare"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Free Tools
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="justify-start text-muted-foreground" asChild>
                <Link href={MARKETING_URLS.auth.login} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-accent text-primary-foreground" asChild>
                <Link href={MARKETING_URLS.auth.join} onClick={() => setMobileMenuOpen(false)}>{SIGNUP_CTA_TEXT}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
