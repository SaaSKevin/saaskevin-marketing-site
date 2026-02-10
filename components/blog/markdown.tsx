import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

type MarkdownProps = {
  children: string
  className?: string
  assetBasePath?: string
}

const isExternalHref = (href: string) => /^https?:\/\//i.test(href)
const isAbsoluteUrl = (src: string) => /^https?:\/\//i.test(src)

const resolveAssetSrc = (assetBasePath: string | undefined, src: string) => {
  if (isAbsoluteUrl(src) || src.startsWith("/") || src.startsWith("data:")) return src
  if (!assetBasePath) return src

  const base = assetBasePath.endsWith("/") ? assetBasePath.slice(0, -1) : assetBasePath
  const cleaned = src.replace(/^\.?\//, "")
  return `${base}/${cleaned}`
}

export function Markdown({ children, className, assetBasePath }: MarkdownProps) {
  return (
    <div className={cn("prose prose-neutral max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, className }) => {
            if (!href) {
              return (
                <a
                  className={cn(
                    "font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary",
                    className,
                  )}
                >
                  {children}
                </a>
              )
            }

            if (isExternalHref(href)) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary",
                    className,
                  )}
                >
                  {children}
                </a>
              )
            }

            return (
              <Link
                href={href}
                className={cn(
                  "font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary",
                  className,
                )}
              >
                {children}
              </Link>
            )
          },
          code: ({ className, children }) => {
            const isBlock = typeof className === "string" && className.includes("language-")

            if (!isBlock) {
              return (
                <code
                  className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
                >
                  {children}
                </code>
              )
            }

            return <code className={cn("text-sm font-mono", className)}>{children}</code>
          },
          pre: ({ children }) => (
            <pre
              className="my-6 overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed"
            >
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-primary/40 pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted/60 px-3 py-2 text-left font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 align-top">
              {children}
            </td>
          ),
          img: ({ alt, src, title }) => {
            if (!src) return null
            const resolved = resolveAssetSrc(assetBasePath, src)

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={alt ?? ""}
                src={resolved}
                title={title}
                className="my-6 w-full rounded-xl border border-border bg-card"
                loading="lazy"
                decoding="async"
              />
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

