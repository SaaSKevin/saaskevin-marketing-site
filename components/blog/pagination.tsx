import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BlogPaginationProps = {
  basePath: string
  currentPage: number
  totalPages: number
  className?: string
}

type PageToken = number | "ellipsis"

const hrefForPage = (basePath: string, page: number) => {
  const normalized = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
  if (page <= 1) return normalized
  return `${normalized}/page/${page}`
}

const getTokens = (current: number, total: number): PageToken[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const tokens: PageToken[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) tokens.push("ellipsis")
  for (let p = start; p <= end; p += 1) tokens.push(p)
  if (end < total - 1) tokens.push("ellipsis")

  tokens.push(total)
  return tokens
}

export function BlogPagination({
  basePath,
  currentPage,
  totalPages,
  className,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const tokens = getTokens(currentPage, totalPages)
  const prevHref = currentPage > 1 ? hrefForPage(basePath, currentPage - 1) : null
  const nextHref =
    currentPage < totalPages ? hrefForPage(basePath, currentPage + 1) : null

  return (
    <nav
      aria-label="Pagination"
      className={cn("mx-auto mt-10 flex w-full justify-center", className)}
    >
      <span className="sr-only">
        Page {currentPage} of {totalPages}
      </span>
      <ul className="flex flex-row items-center gap-1">
        <li>
          {prevHref ? (
            <Link
              href={prevHref}
              rel="prev"
              aria-label="Go to previous page"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5",
              )}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pl-2.5 opacity-50 pointer-events-none",
              )}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </span>
          )}
        </li>

        {tokens.map((t, idx) => {
          if (t === "ellipsis") {
            return (
              <li key={`e-${idx}`}>
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center"
                >
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">More pages</span>
                </span>
              </li>
            )
          }

          const isActive = t === currentPage
          return (
            <li key={t}>
              <Link
                href={hrefForPage(basePath, t)}
                aria-label={`Go to page ${t}`}
                aria-current={isActive ? "page" : undefined}
                className={buttonVariants({
                  variant: isActive ? "outline" : "ghost",
                  size: "icon",
                })}
              >
                {t}
              </Link>
            </li>
          )
        })}

        <li>
          {nextHref ? (
            <Link
              href={nextHref}
              rel="next"
              aria-label="Go to next page"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5",
              )}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 px-2.5 sm:pr-2.5 opacity-50 pointer-events-none",
              )}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}

