import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Rss } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import { Button } from "@/components/ui/button"
import { getPaginatedBlogPosts } from "@/lib/blog"

export const dynamicParams = false

type PageProps = {
  params: Promise<{ page: string }>
}

const parsePageParam = (value: string) => {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n)) return null
  return n
}

export async function generateStaticParams() {
  const { totalPages } = await getPaginatedBlogPosts(1)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, idx) => ({
    page: String(idx + 2),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parsePageParam(page)

  if (!pageNumber || pageNumber < 2) {
    return { title: "Blog - SaaSKevin" }
  }

  return {
    title: `Blog (Page ${pageNumber}) - SaaSKevin`,
    description:
      "Notes, decisions, and implementation details from building custom domains for SaaS products.",
    alternates: {
      canonical: `/blog/page/${pageNumber}`,
    },
  }
}

export default async function BlogIndexPaginatedPage({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parsePageParam(page)

  if (!pageNumber) notFound()
  if (pageNumber === 1) redirect("/blog")
  if (pageNumber < 1) notFound()

  const { items: posts, totalPages } = await getPaginatedBlogPosts(pageNumber)
  if (pageNumber > totalPages) notFound()

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  SaaSKevin Blog
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Practical posts on DNS, TLS, routing, onboarding UX, and the messy parts
                  you only notice after you ship.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Page {pageNumber} of {totalPages}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/rss.xml" aria-label="RSS feed">
                    <Rss className="h-4 w-4" />
                    RSS
                  </Link>
                </Button>
              </div>
            </div>

            {posts.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
                No posts yet.
              </div>
            )}

            <BlogPagination
              basePath="/blog"
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

