"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import type { MascotSrc } from "@/components/mascots"

export interface MascotProps {
  src: MascotSrc | string
  className?: string
  priority?: boolean
  sizes?: string
  /** If true, renders as decorative image with empty alt + aria-hidden. */
  decorative?: boolean
  /** Required when `decorative` is false. */
  alt?: string
}

/* Helper: Render a mascot image with consistent styling. */
export const Mascot = ({
  src,
  className,
  priority,
  sizes,
  decorative = true,
  alt,
}: MascotProps) => {
  const resolvedAlt = decorative ? "" : (alt ?? "Mascot")

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      aria-hidden={decorative ? true : undefined}
      width={1024}
      height={1024}
      priority={priority}
      sizes={sizes ?? "256px"}
      className={cn(
        "select-none pointer-events-none drop-shadow-[0_22px_30px_rgba(0,0,0,0.18)]",
        className
      )}
    />
  )
}

