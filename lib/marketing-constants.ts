export const MARKETING_URLS = {
  site: "https://saaskevin.com",
  appBase: "https://app.saaskevin.com",
  auth: {
    join: "https://app.saaskevin.com/auth/join",
    login: "https://app.saaskevin.com/auth/login",
  },
} as const

export const SIGNUP_CTA_TEXT = "Claim 3 Free Domains"

export const PRICING_OFFER = {
  freeDomains: 3,
  pricePerDomainUsd: 0.15,
} as const

export const MARKETING_CONTENT_TOKENS = {
  signupCtaText: "{{SIGNUP_CTA_TEXT}}",
  signupJoinUrl: "{{SIGNUP_JOIN_URL}}",
  signupOfferLine: "{{SIGNUP_OFFER_LINE}}",
} as const

export const MARKETING_COPY = {
  signupOfferLine: `Setup in 5 minutes, first ${PRICING_OFFER.freeDomains} domains free.`,
} as const

const freeDomainsLabel = `${PRICING_OFFER.freeDomains}`
const pricePerDomainUsdLabel = PRICING_OFFER.pricePerDomainUsd.toFixed(2)

export const PRICING_COPY = {
  freeDomainsLabel,
  freeCustomDomainsTitle: `${freeDomainsLabel} Free Custom Domains`,
  freeCustomDomains: `${freeDomainsLabel} free custom domains`,
  freeDomainsIncluded: `${freeDomainsLabel} domains included`,
  freeDomainsFree: `${freeDomainsLabel} domains free`,
  firstFreeDomains: `First ${freeDomainsLabel} domains free`,
  firstDomainsAreFree: `First ${freeDomainsLabel} domains are free`,
  firstDomainsIncludedFree: `${freeDomainsLabel} custom domains included free`,
  startWithFreeCustomDomains: `Start with ${freeDomainsLabel} custom domains free`,
  payAfterFreeTier: `Pay $${pricePerDomainUsdLabel}/domain/month after that.`,
  pricePerDomain: `$${pricePerDomainUsdLabel}`,
  pricePerDomainAfter: `$${pricePerDomainUsdLabel}/domain after`,
  pricePerDomainMonthlyShort: `$${pricePerDomainUsdLabel}/domain/month`,
  pricePerDomainMonthlyLong: `$${pricePerDomainUsdLabel} per domain per month`,
  pricePerDomainMonthlySentence: `$${pricePerDomainUsdLabel} per domain per month.`,
  firstFreeThenPaySentence: `Start with ${freeDomainsLabel} custom domains free. Pay $${pricePerDomainUsdLabel}/domain/month after that.`,
  billingStartsAfterFreeTier: `Billing only starts after first ${freeDomainsLabel} free domains`,
  perDomainAfterFirstFreeTier: `per domain after first ${freeDomainsLabel}`,
} as const
