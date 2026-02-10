import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SidebarCtaProps = {
  className?: string
}

export function SidebarCta({ className }: SidebarCtaProps) {
  return (
    <aside
      className={cn(" shrink-0", className)}
      aria-label="Try SaaSKevin"
    >
      <Card className="sticky top-24 gap-2 border-border bg-card shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.svg"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
              aria-hidden
            />
            <span className="font-semibold text-foreground">SaaSKevin</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Add custom domains to your SaaS in 5 minutes. 100 domains free.
          </p>
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-accent text-primary-foreground"
            asChild
          >
            <Link href="https://app.saaskevin.com/auth/join">
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>5 min setup</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Auto SSL</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Cancel anytime</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}
