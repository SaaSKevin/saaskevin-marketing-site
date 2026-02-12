import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import {
  getAllAuthors,
  getAllAuthorSlugs,
  getPaginatedPostsByAuthor,
} from "@/lib/blog"

export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const authors = await getAllAuthors()
  const author = authors.find((a) => a.slug === slug)

  if (!author) return { title: "Author not found" }

  return {
    title: `Posts by ${author.name} - Blog`,
    description: `${author.count} post${author.count === 1 ? "" : "s"} by ${author.name} on SaaS custom domain infrastructure, DNS, SSL, and more.`,
    alternates: {
      canonical: `/blog/author/${slug}`,
    },
  }
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params
  const authors = await getAllAuthors()
  const author = authors.find((a) => a.slug === slug)

  if (!author) notFound()

  const { items: posts, totalPages } = await getPaginatedPostsByAuthor(slug, 1)

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10">
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>
            </div>

            <header>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {author.name}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {author.count} post{author.count === 1 ? "" : "s"}
              </p>
            </header>

            {posts.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
                No posts by this author.
              </div>
            )}

            <BlogPagination
              basePath={`/blog/author/${slug}`}
              currentPage={1}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
