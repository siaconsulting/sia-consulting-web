import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import type { PayloadRequest } from 'payload'
import { getCollectionDetailPath, type PublicCollection } from '@/utilities/publicRoutes'

export const getPreviewDocumentPath = (collection: PublicCollection, slug: string): string | null =>
  getCollectionDetailPath(collection, slug)

type Props = {
  collection: PublicCollection
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
