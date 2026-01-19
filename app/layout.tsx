import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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

        {/* Load GrowSurf script only on the client side */}
        {typeof window !== "undefined" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(g,r,s,f){g.grsfSettings={campaignId:"ewq1pl",version:"2.0.0"};s=r.getElementsByTagName("head")[0];f=r.createElement("script");f.async=1;f.src="https://app.growsurf.com/growsurf.js"+"?v="+g.grsfSettings.version;f.setAttribute("grsf-campaign", g.grsfSettings.campaignId);!g.grsfInit?s.appendChild(f):"";})(window,document);`
            }}
          />
        )}
      </body>
    </html>
  )
}
