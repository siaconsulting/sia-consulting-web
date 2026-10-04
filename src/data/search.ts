import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { queryPublicSearchIndex, type PublicSearchResponse } from '@/search/queryPublicSearchIndex'
import type { PublicSearchType } from '@/utilities/publicSearch'

export type { PublicSearchResponse } from '@/search/queryPublicSearchIndex'

export async function searchPublicContent(options: {
  query: string
  type?: PublicSearchType
  page: number
}): Promise<PublicSearchResponse> {
  const payload = await getPayload({ config: configPromise })
  return queryPublicSearchIndex(payload, options)
}
