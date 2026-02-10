import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import {
  BLOG_POSTS_PER_PAGE,
  getAllCategories,
  getPaginatedPostsByCategory,
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
  const categories = await getAllCategories()
  const params: Array<{ slug: string; page: string }> = []

  for (const c of categories) {
    const totalPages = Math.max(1, Math.ceil(c.count / BLOG_POSTS_PER_PAGE))
    for (let p = 2; p <= totalPages; p += 1) {
      params.push({ slug: c.slug, page: String(p) })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params
  const pageNumber = parsePageParam(page)

  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return { title: "Category not found - SaaSKevin" }

  if (!pageNumber || pageNumber < 2) {
    return {
      title: `${category.name} - Blog - SaaSKevin`,
      description: `${category.count} post${category.count === 1 ? "" : "s"} in ${category.name}.`,
    }
  }

  return {
    title: `${category.name} (Page ${pageNumber}) - Blog - SaaSKevin`,
    description: `${category.count} post${category.count === 1 ? "" : "s"} in ${category.name}.`,
    alternates: { canonical: `/blog/category/${slug}/page/${pageNumber}` },
  }
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { slug, page } = await params
  const pageNumber = parsePageParam(page)

  if (!pageNumber) notFound()
  if (pageNumber === 1) redirect(`/blog/category/${slug}`)
  if (pageNumber < 1) notFound()

  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const { items: posts, totalPages } = await getPaginatedPostsByCategory(slug, pageNumber)
  if (pageNumber > totalPages) notFound()

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10">
            <div>
              <Link
                href={`/blog/category/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {category.name}
              </Link>
            </div>

            <header>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {category.count} post{category.count === 1 ? "" : "s"} • Page {pageNumber}{" "}
                of {totalPages}
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
                No posts in this category.
              </div>
            )}

            <BlogPagination
              basePath={`/blog/category/${slug}`}
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

