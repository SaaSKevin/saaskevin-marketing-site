"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    await growsurf.addParticipant(email);

    setStatus("success")
    setEmail("")
  }

  return (
    <section id="waitlist" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Limited early access
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
                Stop dreading custom domain requests
              </h2>

              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Join the waitlist and be first to offer your users beautiful,
                branded domains—without the engineering headache.
              </p>

              {status === "success" ? (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{"You're on the list!"}</p>
                    <p className="text-muted-foreground mt-1">{"We'll be in touch soon with early access."}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="you@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className="h-12 bg-primary hover:bg-accent text-primary-foreground px-6 shrink-0"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  First 100 domains free
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  $0.09/domain after
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
