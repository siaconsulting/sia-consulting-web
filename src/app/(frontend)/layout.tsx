import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { brandFont, bodyFont } from '@/utilities/fonts'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { SkipLink } from '@/components/sia/SkipLink'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(brandFont.variable, bodyFont.variable)} lang="fr">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'SIA Consulting',
  description: 'Site institutionnel de SIA Consulting.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
