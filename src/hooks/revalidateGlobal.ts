import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getGlobalRevalidationTargets, type PublicGlobal } from '@/utilities/globalRevalidation'

const isMissingNextRequestContext = (error: unknown) =>
  typeof error === 'object' && error !== null &&
  '__NEXT_ERROR_CODE' in error && error.__NEXT_ERROR_CODE === 'E263'

export const revalidatePublicGlobal = (global: PublicGlobal): GlobalAfterChangeHook => async ({ req: { context } }) => {
  if (context.disableRevalidate) return
  const targets = getGlobalRevalidationTargets(global)

  try {
    for (const { path, type } of targets.paths) revalidatePath(path, type)
    for (const tag of targets.tags) revalidateTag(tag, 'max')
    return
  } catch (error) {
    if (!isMissingNextRequestContext(error)) throw error
  }

  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL
  const secret = process.env.REVALIDATION_SECRET
  if (!baseURL || !secret) {
    throw new Error('NEXT_PUBLIC_SERVER_URL and REVALIDATION_SECRET are required to revalidate from the Payload jobs runner.')
  }

  const response = await fetch(new URL('/api/internal/revalidate', baseURL), {
    method: 'POST',
    headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
    body: JSON.stringify({ global }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Next.js cache revalidation failed with status ${response.status}.`)
}
