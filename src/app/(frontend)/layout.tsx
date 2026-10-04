import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { brandFont, bodyFont } from '@/utilities/fonts'
import { getSiteSettings } from '@/data/globals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { SkipLink } from '@/components/sia/SkipLink'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(brandFont.variable, bodyFont.variable)} lang="fr">
      <body>
        <AdminBar adminBarProps={{ preview: isEnabled }} />
        <SkipLink />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings.defaultMetaTitle?.trim() || settings.siteName?.trim() || 'SIA Consulting'
  const description = settings.defaultMetaDescription?.trim() || 'Site institutionnel de SIA Consulting.'
  const socialImage = typeof settings.defaultSocialImage === 'object' && settings.defaultSocialImage?.url
    ? getMediaUrl(settings.defaultSocialImage.url, settings.defaultSocialImage.updatedAt)
    : undefined
  const favicon = typeof settings.favicon === 'object' && settings.favicon?.url
    ? getMediaUrl(settings.favicon.url, settings.favicon.updatedAt)
    : undefined

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: mergeOpenGraph({ title, description, images: socialImage ? [{ url: socialImage }] : [] }),
    twitter: { card: socialImage ? 'summary_large_image' : 'summary', images: socialImage ? [socialImage] : undefined },
  }
}
