import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getEditorialRevalidationTargets, type EditorialCollection } from '@/utilities/editorialRevalidation'

const isMissingNextRequestContext = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  '__NEXT_ERROR_CODE' in error &&
  error.__NEXT_ERROR_CODE === 'E263'

const invalidatePublicContent = async (collection: EditorialCollection, slugs: (string | null | undefined)[]) => {
  const targets = getEditorialRevalidationTargets(collection, slugs)

  try {
    for (const { path, type } of targets.paths) revalidatePath(path, type)
    for (const tag of targets.tags) revalidateTag(tag, 'max')
    return
  } catch (error) {
    // A standalone Payload worker has no Next.js request store; delegate cache work to the web process.
    if (!isMissingNextRequestContext(error)) throw error
  }

  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL
  const secret = process.env.REVALIDATION_SECRET
  if (!baseURL || !secret) {
    throw new Error('NEXT_PUBLIC_SERVER_URL and REVALIDATION_SECRET are required to revalidate from the Payload jobs runner.')
  }

  const response = await fetch(new URL('/api/internal/revalidate', baseURL), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${secret}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ collection, slugs }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Next.js cache revalidation failed with status ${response.status}.`)
  }
}

export const editorialAfterChange =
  (collection: EditorialCollection): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req: { context } }) => {
    if (context.disableRevalidate) return doc

    const isPublic = doc._status === 'published' || doc._status === 'changed'
    const wasPublic = previousDoc?._status === 'published' || previousDoc?._status === 'changed'

    if (!isPublic && !wasPublic) return doc

    await invalidatePublicContent(collection, [
      isPublic ? doc.slug : undefined,
      wasPublic ? previousDoc?.slug : undefined,
    ])

    return doc
  }

export const editorialAfterDelete =
  (collection: EditorialCollection): CollectionAfterDeleteHook =>
  async ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) await invalidatePublicContent(collection, [doc?.slug])
    return doc
  }
