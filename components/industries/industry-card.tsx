import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { IndustryGuide } from "@/lib/industries"
import { slugify } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IndustryIcon } from "@/components/industries/industry-icon"

type IndustryCardProps = {
  industryGuide: IndustryGuide
  className?: string
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveIndustryAssetSrc = (guideSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/industry-assets/${guideSlug}/${cleaned}`
}

export function IndustryCard({ industryGuide, className }: IndustryCardProps) {
  const coverSrc = industryGuide.image
    ? resolveIndustryAssetSrc(industryGuide.slug, industryGuide.image)
    : null

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden gap-0 py-0 transition-all hover:bg-muted/30 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring/60",
        className,
      )}
    >
      {coverSrc ? (
        <Link
          href={`/industries/${industryGuide.slug}`}
          className="block border-b border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-inset"
          aria-label={`View industry guide: ${industryGuide.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt={`${industryGuide.title} illustration`}
            className="h-44 w-full object-cover sm:h-48"
            loading="lazy"
            decoding="async"
          />
        </Link>
      ) : null}

      <Link
        href={`/industries/${industryGuide.slug}`}
        className="block focus:outline-none"
        aria-label={`View industry guide: ${industryGuide.title}`}
      >
        <CardHeader className={cn("gap-4", coverSrc ? "pt-5" : "pt-6")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <IndustryIcon iconName={industryGuide.icon} className="h-6 w-6 text-primary" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <CardTitle className="text-lg leading-snug">{industryGuide.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pb-5">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {industryGuide.description}
          </p>
        </CardContent>
      </Link>

      <CardContent className="pt-0 pb-6 flex items-center justify-between gap-4">
        <Badge variant="secondary" asChild>
          <Link
            href={`/industries/industry/${slugify(industryGuide.industry)}`}
            className="hover:bg-secondary/80 transition-colors"
          >
            {industryGuide.industry}
          </Link>
        </Badge>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/industries/${industryGuide.slug}`}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
