import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import type { PayloadRequest } from 'payload'
import { getCollectionDetailPath, getLegacyDetailPath, type PublicCollection } from '@/utilities/publicRoutes'

export const getPreviewDocumentPath = (collection: 'pages' | 'posts' | PublicCollection, slug: string): string | null => {
  if (collection === 'pages' || collection === 'posts') return getLegacyDetailPath(collection, slug)
  return getCollectionDetailPath(collection, slug)
}

type Props = {
  collection: 'pages' | 'posts' | PublicCollection
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const path = getPreviewDocumentPath(collection, slug)
  if (!path) return null

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
