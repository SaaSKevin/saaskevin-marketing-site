import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { Comparison } from "@/lib/compare"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IndustryIcon } from "@/components/industries/industry-icon"

type CompareCardProps = {
  comparison: Comparison
  className?: string
}

export function CompareCard({ comparison, className }: CompareCardProps) {
  return (
    <Card
      className={cn(
        "group h-full overflow-hidden gap-0 py-0 transition-all hover:bg-muted/30 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring/60",
        className,
      )}
    >
      <Link
        href={`/compare/${comparison.slug}`}
        className="block focus:outline-none"
        aria-label={`View comparison: ${comparison.title}`}
      >
        <CardHeader className="gap-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {comparison.logo ? (
                <Image
                  src={comparison.logo}
                  alt={`${comparison.competitorName} logo`}
                  width={28}
                  height={28}
                  className="h-7 w-7"
                />
              ) : (
                <IndustryIcon iconName={comparison.icon} className="h-6 w-6 text-primary" />
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <CardTitle className="text-lg leading-snug">{comparison.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pb-5">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {comparison.description}
          </p>
        </CardContent>
      </Link>

      <CardContent className="pt-0 pb-6 flex items-center justify-between gap-4">
        <Badge variant="secondary">
          {comparison.category}
        </Badge>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/compare/${comparison.slug}`}>Compare</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
