import 'server-only'

import { headers } from 'next/headers'
import { hasRole, ROLE } from '@/access/roles'
import type { Payload } from 'payload'

export const EDITORIAL_PAGE_SIZE = 12

/** Draft reads are only enabled for an authenticated ADMIN/EDITOR preview session. */
export async function getEditorialReadOptions(payload: Payload, preview: boolean) {
  if (!preview) return { draft: false as const, overrideAccess: false as const }

  const auth = await payload.auth({ headers: await headers() })
  if (!hasRole(auth.user, [ROLE.admin, ROLE.editor])) {
    return { draft: false as const, overrideAccess: false as const }
  }

  return { draft: true as const, overrideAccess: false as const, user: auth.user }
}

export function populatedPublished<T extends { _status?: string | null }>(items: (number | T | null | undefined)[] | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => typeof item === 'object' && item !== null && item._status === 'published')
}

export function relationIDs(items: (number | { id: number } | null | undefined)[] | null | undefined): number[] {
  return [...new Set((items ?? []).flatMap((item) => {
    const id = typeof item === 'object' && item !== null ? item.id : item
    return typeof id === 'number' ? [id] : []
  }))]
}

export function orderByRelation<T extends { id: number }>(ids: number[], docs: T[]): T[] {
  const byID = new Map(docs.map((doc) => [doc.id, doc]))
  return ids.flatMap((id) => {
    const doc = byID.get(id)
    return doc ? [doc] : []
  })
}
