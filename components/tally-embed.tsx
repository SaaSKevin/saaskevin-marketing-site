"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type TallyEmbedProps = {
  formId: string
  className?: string
}

export function TallyEmbed({ formId, className }: TallyEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://tally.so/widgets/embed.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <iframe
        ref={iframeRef}
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        width="100%"
        height="300"
        frameBorder="0"
        title="Signup form"
        className="w-full"
      />
    </div>
  )
}
