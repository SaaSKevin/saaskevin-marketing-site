import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MARKETING_URLS, SIGNUP_CTA_TEXT } from "@/lib/marketing-constants"

type ToolResultBannerProps = {
  className?: string
  message?: string
}

export function ToolResultBanner({
  className,
  message = "Add custom domains to your SaaS without the infra headache. SaaSKevin simplifies DNS and SSL so you can launch in minutes.",
}: ToolResultBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground flex-1">{message}</p>
      <Button size="sm" variant="outline" className="shrink-0 gap-1.5" asChild>
        <Link href={MARKETING_URLS.auth.join}>
          {SIGNUP_CTA_TEXT}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  )
}
