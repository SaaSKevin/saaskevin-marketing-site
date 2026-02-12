import Link from "next/link"

type FaqItem = {
  question: string
  answer: string
}

type ToolFaqProps = {
  items: FaqItem[]
}

export function ToolFaq({ items }: ToolFaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <dl className="space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-sm font-semibold text-foreground">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Need setup examples for real SaaS products? Browse our{" "}
        <Link href="/industries" className="text-primary hover:underline">
          industry guides
        </Link>{" "}
        and explore all{" "}
        <Link href="/tools" className="text-primary hover:underline">
          free domain tools
        </Link>
        .
      </p>
    </section>
  )
}
