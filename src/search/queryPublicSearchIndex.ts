import { type Payload } from 'payload'
import type { Search } from '@/payload-types'
import { SIA_SEARCH_COLLECTIONS } from '@/search/fieldOverrides'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'
import type { PublicSearchType } from '@/utilities/publicSearch'

export type PublicSearchResult = Pick<Search, 'id' | 'title' | 'contentType' | 'slug' | 'url' | 'excerpt' | 'publishedAt'> & {
  url: string
}

export type PublicSearchResponse = {
  docs: PublicSearchResult[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export async function queryPublicSearchIndex(payload: Payload, {
  query,
  type,
  page,
}: {
  query: string
  type?: PublicSearchType
  page: number
}): Promise<PublicSearchResponse> {
  const contentTypes = type ? [type] : [...SIA_SEARCH_COLLECTIONS]
  const result = await payload.find({
    collection: 'search',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 10,
    page,
    sort: ['-priority', 'title'],
    select: {
      title: true,
      contentType: true,
      slug: true,
      url: true,
      excerpt: true,
      publishedAt: true,
    },
    where: {
      and: [
        { contentType: { in: contentTypes } },
        { or: [{ title: { like: query } }, { excerpt: { like: query } }] },
      ],
    },
  })

  const docs = result.docs.flatMap((doc) => {
    if (!SIA_SEARCH_COLLECTIONS.includes(doc.contentType as PublicSearchType) || !doc.slug) return []
    const canonicalPath = getCollectionDetailPath(doc.contentType as PublicSearchType, doc.slug)
    if (!canonicalPath) return []

    // Recompute from the route contract so stale index URLs can never point into the template.
    return [{
      id: doc.id,
      title: doc.title ?? '',
      contentType: doc.contentType as PublicSearchType,
      slug: doc.slug,
      url: canonicalPath,
      excerpt: doc.excerpt ?? '',
      publishedAt: doc.publishedAt,
    }]
  })

  return {
    docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    limit: result.limit,
  }
}
