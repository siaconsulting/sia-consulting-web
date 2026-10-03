import type { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'
import { getCollectionDetailPath, type PublicCollection } from '@/utilities/publicRoutes'

export type SearchableCollection = Extract<
  PublicCollection,
  'services' | 'sectors' | 'trainings' | 'publications' | 'case-studies' | 'resources'
>

export const buildSearchResultFields = (collection: SearchableCollection, doc: Record<string, unknown>) => {
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const url = getCollectionDetailPath(collection, slug)
  if (!url) throw new Error(`No detail route configured for searchable collection: ${collection}`)

  const possibleImage = doc.coverImage ?? doc.heroImage
  const image = typeof possibleImage === 'object' && possibleImage !== null && 'id' in possibleImage
    ? possibleImage.id
    : possibleImage
  const excerpt = doc.shortDescription ?? doc.summary ?? doc.excerpt ?? ''

  return {
    contentType: collection,
    slug,
    url,
    excerpt: typeof excerpt === 'string' ? excerpt : '',
    ...(image !== undefined && image !== null ? { image } : {}),
    ...(typeof doc.publishedAt === 'string' ? { publishedAt: doc.publishedAt } : {}),
  }
}

export const beforeSyncWithSearch: BeforeSync = async ({ collectionSlug, originalDoc, searchDoc }) => ({
  ...searchDoc,
  title: typeof originalDoc.title === 'string' ? originalDoc.title : '',
  ...buildSearchResultFields(collectionSlug as SearchableCollection, originalDoc),
}) as DocToSync
