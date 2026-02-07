import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SaaSKevin - Custom Domains for Your SaaS, Minimal Code Required',
  description: 'Give your users custom domains with only 3 lines of code. SaaSKevin lets you embed white-label domain functionality in minutes.',
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
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
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
