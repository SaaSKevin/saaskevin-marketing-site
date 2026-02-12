import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ToolCardProps = {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  className?: string
}

export function ToolCard({ title, description, href, icon, className }: ToolCardProps) {
  return (
    <Card
      className={cn(
        "group h-full overflow-hidden gap-0 py-0 transition-all hover:bg-muted/30 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring/60",
        className,
      )}
    >
      <Link href={href} className="block focus:outline-none">
        <CardHeader className="gap-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <CardTitle className="text-lg leading-snug">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
