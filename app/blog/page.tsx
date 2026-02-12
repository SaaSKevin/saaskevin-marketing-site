import Link from "next/link"
import { Rss } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import { Button } from "@/components/ui/button"
import { getPaginatedBlogPosts } from "@/lib/blog"

export const metadata = {
  title: "Blog - Custom Domain Engineering & SaaS Infrastructure",
  description:
    "Practical posts on DNS verification, SSL certificates, reverse proxy routing, onboarding UX, and building custom domain infrastructure for SaaS products.",
  alternates: {
    canonical: "/blog",
  },
}

export default async function BlogIndexPage() {
  const { items: posts, totalPages } = await getPaginatedBlogPosts(1)

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                {/* <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground border border-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Shipping custom domains without the headache</span>
                </div> */}
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  SaaSKevin Blog
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Practical posts on DNS, TLS, routing, onboarding UX, and the messy parts
                  you only notice after you ship.
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

            <BlogPagination basePath="/blog" currentPage={1} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

