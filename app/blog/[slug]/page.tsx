import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { Markdown } from "@/components/blog/markdown"
import { SidebarCta } from "@/components/blog/sidebar-cta"
import { Badge } from "@/components/ui/badge"
import { CTA } from "@/components/cta"
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog"
import { slugify } from "@/lib/utils"

export const dynamicParams = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = "https://saaskevin.com"

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(value))

const estimateReadingTimeMinutes = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const normalizeRelativePath = (value: string) => value.replace(/^\.?\//, "")

const resolveBlogAssetSrc = (postSlug: string, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/")) return src
  const cleaned = normalizeRelativePath(src)
  return `/blog-assets/${postSlug}/${cleaned}`
}

const toAbsoluteUrl = (src: string) => (isAbsoluteUrl(src) ? src : `${SITE_URL}${src}`)

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post not found - SaaSKevin",
      robots: { index: false, follow: false },
    }
  }

  const title = `${post.title} - SaaSKevin`
  const coverImage = post.image ? resolveBlogAssetSrc(post.slug, post.image) : null
  const image = coverImage ?? "/logo.png"

  return {
    title,
    description: post.description,
    alternates: {
      canonical: post.url,
    },
    keywords: post.tags.length ? post.tags : undefined,
    openGraph: {
      type: "article",
      url: post.url,
      title,
      description: post.description,
      siteName: "SaaSKevin",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const readingTime = estimateReadingTimeMinutes(post.content)
  const coverImage = post.image ? resolveBlogAssetSrc(post.slug, post.image) : null
  const jsonLdImage = toAbsoluteUrl(coverImage ?? "/logo.png")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
    author: {
      "@type": "Organization",
      name: "SaaSKevin",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SaaSKevin",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    image: [jsonLdImage],
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
            <div className="min-w-0">
              <div className="flex flex-col gap-6">
                <div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to blog
                  </Link>
                </div>

                <header className="flex flex-col gap-5">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {post.title}
                  </h1>

                  <p className="text-base leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-border" />
                      <span>{readingTime} min read</span>
                    </div>
                    <Link
                      href={`/blog/author/${post.authorSlug}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-border" />
                      <span>{post.author}</span>
                    </Link>
                  </div>

                  {post.tags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
                  ) : null}

                  {post.enableCoverImage && coverImage ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImage}
                        alt={`${post.title} cover`}
                        className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] max-h-[360px] object-cover"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                </header>

                <div className="h-px w-full bg-border" />

                <article>
                  <Markdown
                    assetBasePath={`/blog-assets/${post.slug}`}
                    className="prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground dark:prose-invert max-w-3xl"
                  >
                    {post.content}
                  </Markdown>
                </article>
              </div>
            </div>

            <SidebarCta />
          </div>
        </div>
      </div>

      <div className="pt-10">
        <CTA />
      </div>
    </SiteShell>
  )
}

