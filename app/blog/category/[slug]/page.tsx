import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { BlogPostCard } from "@/components/blog/post-card"
import { BlogPagination } from "@/components/blog/pagination"
import {
  getAllCategories,
  getAllCategorySlugs,
  getPaginatedPostsByCategory,
} from "@/lib/blog"

export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)

  if (!category) return { title: "Category not found" }

  return {
    title: `${category.name} - Blog`,
    description: `${category.count} post${category.count === 1 ? "" : "s"} about ${category.name}. Practical engineering guides for SaaS custom domain infrastructure.`,
    alternates: {
      canonical: `/blog/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)

  if (!category) notFound()

  const { items: posts, totalPages } = await getPaginatedPostsByCategory(slug, 1)

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
                {category.name}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {category.count} post{category.count === 1 ? "" : "s"}
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
              currentPage={1}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
