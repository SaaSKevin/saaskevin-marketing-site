import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SaaSKevin - Custom Domains for Your SaaS, No Code Required',
  description: 'Give your users custom domains without writing a single line of code. SaaSKevin wraps Cloudflare for SaaS so you can embed white-label domain functionality in minutes.',
  generator: 'SaaSKevin',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />

        {/* Load GrowSurf */}
        <Script
          id="growsurf-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.grsfSettings = { campaignId: "ewq1pl", version: "2.0.0" };
            `,
          }}
        />
        <Script
          id="growsurf-script"
          strategy="afterInteractive"
          src="https://app.growsurf.com/growsurf.js?v=2.0.0"
          data-grsf-campaign="ewq1pl"
        />
      </body>
    </html>
  )
}
