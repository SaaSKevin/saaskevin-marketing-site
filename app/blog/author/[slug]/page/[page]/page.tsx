import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import {
  BLOG_POSTS_PER_PAGE,
  getAllAuthors,
  getPaginatedPostsByAuthor,
} from "@/lib/blog"

export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string; page: string }>
}

const parsePageParam = (value: string) => {
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n)) return null
  return n
}

export async function generateStaticParams() {
  const authors = await getAllAuthors()
  const params: Array<{ slug: string; page: string }> = []

  for (const a of authors) {
    const totalPages = Math.max(1, Math.ceil(a.count / BLOG_POSTS_PER_PAGE))
    for (let p = 2; p <= totalPages; p += 1) {
      params.push({ slug: a.slug, page: String(p) })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params
  const pageNumber = parsePageParam(page)

  const authors = await getAllAuthors()
  const author = authors.find((a) => a.slug === slug)
  if (!author) return { title: "Author not found" }

  if (!pageNumber || pageNumber < 2) {
    return {
      title: `Posts by ${author.name} - Blog`,
      description: `${author.count} post${author.count === 1 ? "" : "s"} by ${author.name} on SaaS custom domain infrastructure, DNS, SSL, and more.`,
    }
  }

  return {
    title: `Posts by ${author.name} (Page ${pageNumber}) - Blog`,
    description: `${author.count} post${author.count === 1 ? "" : "s"} by ${author.name} on SaaS custom domain infrastructure, DNS, SSL, and more.`,
    alternates: { canonical: `/blog/author/${slug}/page/${pageNumber}` },
  }
}

export default async function AuthorPaginatedPage({ params }: PageProps) {
  const { slug, page } = await params
  const pageNumber = parsePageParam(page)

  if (!pageNumber) notFound()
  if (pageNumber === 1) redirect(`/blog/author/${slug}`)
  if (pageNumber < 1) notFound()

  const authors = await getAllAuthors()
  const author = authors.find((a) => a.slug === slug)
  if (!author) notFound()

  const { items: posts, totalPages } = await getPaginatedPostsByAuthor(slug, pageNumber)
  if (pageNumber > totalPages) notFound()

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10">
            <div>
              <Link
                href={`/blog/author/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {author.name}
              </Link>
            </div>

            <header>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {author.name}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {author.count} post{author.count === 1 ? "" : "s"} • Page {pageNumber} of{" "}
                {totalPages}
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
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

