import type { Metadata } from 'next'
import type { Media, SiteSetting } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type MediaRelation = number | Media | null | undefined

function mediaHref(value: MediaRelation): string | undefined {
  if (!value || typeof value !== 'object' || !value.url) return undefined
  return getMediaUrl(value.url, value.updatedAt)
}

function absoluteURL(value: string): string {
  return new URL(value, getServerSideURL()).toString()
}

export function createEditorialMetadata({
  title,
  description,
  path,
  image,
  settings,
  noIndex = false,
}: {
  title?: string | null
  description?: string | null
  path: string
  image?: MediaRelation
  settings?: SiteSetting | null
  noIndex?: boolean
}): Metadata {
  const siteName = settings?.siteName?.trim() || 'SIA Consulting'
  const baseTitle = title?.trim() || settings?.defaultMetaTitle?.trim() || siteName
  const suffix = settings?.titleSuffix?.trim()
  const finalTitle = suffix && baseTitle !== suffix && !baseTitle.endsWith(suffix)
    ? `${baseTitle} ${suffix}`
    : baseTitle
  const finalDescription = description?.trim() || settings?.defaultMetaDescription?.trim() || 'Site institutionnel de SIA Consulting.'
  const imageURL = mediaHref(image) || mediaHref(settings?.defaultSocialImage)
  const canonical = absoluteURL(path)

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName,
      images: imageURL ? [{ url: absoluteURL(imageURL) }] : undefined,
    },
    twitter: {
      card: imageURL ? 'summary_large_image' : 'summary',
      title: finalTitle,
      description: finalDescription,
      images: imageURL ? [absoluteURL(imageURL)] : undefined,
    },
  }
}
