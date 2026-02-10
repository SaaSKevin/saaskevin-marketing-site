import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { BlogPost } from "@/lib/blog"
import { slugify } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type BlogPostCardProps = {
  post: BlogPost
  className?: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value))

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveBlogAssetSrc = (postSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/blog-assets/${postSlug}/${cleaned}`
}

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  const coverSrc =
    post.enableCoverImage && post.image
      ? resolveBlogAssetSrc(post.slug, post.image)
      : null

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden gap-0 py-0 transition-colors hover:bg-muted/30 focus-within:ring-2 focus-within:ring-ring/60",
        className,
      )}
    >
      {coverSrc ? (
        <Link
          href={`/blog/${post.slug}`}
          className="block border-b border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-inset"
          aria-label={`Read: ${post.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt={`${post.title} cover`}
            className="h-44 w-full object-cover sm:h-48"
            loading="lazy"
            decoding="async"
          />
        </Link>
      ) : null}

      <Link
        href={`/blog/${post.slug}`}
        className="block focus:outline-none"
        aria-label={`Read: ${post.title}`}
      >
        <CardHeader className={cn("gap-3", coverSrc ? "pt-5" : "pt-6")}>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">{formatDate(post.date)}</div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pb-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        </CardContent>
      </Link>

      {post.tags.length ? (
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" asChild>
                <Link
                  href={`/blog/category/${slugify(tag)}`}
                  className="hover:bg-secondary/80 transition-colors"
                >
                  {tag}
                </Link>
              </Badge>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  )
}

