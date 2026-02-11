import Link from "next/link"
import { ArrowUpRight, Link as LinkIcon } from "lucide-react"
import * as Icons from "lucide-react"

import type { UseCase } from "@/lib/use-cases"
import { slugify } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type UseCaseCardProps = {
  useCase: UseCase
  className?: string
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveUseCaseAssetSrc = (useCaseSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/use-case-assets/${useCaseSlug}/${cleaned}`
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LinkIcon

  // Convert kebab-case to PascalCase (e.g., "link-2" -> "Link2")
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

  // @ts-expect-error - Dynamic icon lookup
  const IconComponent = Icons[pascalCase] as React.ComponentType<{ className?: string }>
  return IconComponent || LinkIcon
}

export function UseCaseCard({ useCase, className }: UseCaseCardProps) {
  const coverSrc = useCase.image
    ? resolveUseCaseAssetSrc(useCase.slug, useCase.image)
    : null

  const IconComponent = getIconComponent(useCase.icon)

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden gap-0 py-0 transition-all hover:bg-muted/30 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring/60",
        className,
      )}
    >
      {coverSrc ? (
        <Link
          href={`/use-cases/${useCase.slug}`}
          className="block border-b border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-inset"
          aria-label={`View use case: ${useCase.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt={`${useCase.title} illustration`}
            className="h-44 w-full object-cover sm:h-48"
            loading="lazy"
            decoding="async"
          />
        </Link>
      ) : null}

      <Link
        href={`/use-cases/${useCase.slug}`}
        className="block focus:outline-none"
        aria-label={`View use case: ${useCase.title}`}
      >
        <CardHeader className={cn("gap-4", coverSrc ? "pt-5" : "pt-6")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <CardTitle className="text-lg leading-snug">{useCase.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pb-5">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {useCase.description}
          </p>
        </CardContent>
      </Link>

      <CardContent className="pt-0 pb-6 flex items-center justify-between gap-4">
        <Badge variant="secondary" asChild>
          <Link
            href={`/use-cases/industry/${slugify(useCase.industry)}`}
            className="hover:bg-secondary/80 transition-colors"
          >
            {useCase.industry}
          </Link>
        </Badge>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/use-cases/${useCase.slug}`}>
            Learn More
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
