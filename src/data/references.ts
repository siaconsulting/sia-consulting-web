import 'server-only'

import type { Media, Reference, Sector } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { orderByRelation, relationIDs } from './shared/editorial'

type MediaRelation = number | Media | null | undefined
type SectorRelation = number | Pick<Sector, 'id'> | null | undefined

export type PublicReference = Pick<Reference, 'id' | 'name' | 'slug' | 'website' | 'shortDescription' | 'type' | 'featured' | 'order' | '_status'> & {
  logo: MediaRelation
  sectors: Pick<Sector, 'id' | 'title' | 'slug'>[]
}

async function queryPublicReferences(): Promise<PublicReference[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'references', where: { _status: { equals: 'published' } },
    draft: false, overrideAccess: false, depth: 1, limit: 1000, pagination: false,
    sort: ['-featured', 'order', 'name'],
    select: { id: true, name: true, slug: true, logo: true, website: true, shortDescription: true, type: true, sectors: true, featured: true, order: true, _status: true },
  })
  const references = result.docs as unknown as (Omit<PublicReference, 'sectors'> & { sectors?: SectorRelation[] })[]
  const sectorIDs = relationIDs(references.flatMap((reference) => reference.sectors ?? []))
  const sectors = sectorIDs.length ? await payload.find({
    collection: 'sectors', where: { and: [{ id: { in: sectorIDs } }, { _status: { equals: 'published' } }] },
    draft: false, overrideAccess: false, depth: 0, limit: sectorIDs.length, pagination: false,
    select: { id: true, title: true, slug: true, _status: true },
  }) : { docs: [] }
  return references.map((reference) => ({
    ...reference,
    sectors: orderByRelation(relationIDs(reference.sectors), sectors.docs as Pick<Sector, 'id' | 'title' | 'slug'>[]),
  }))
}

export const getPublicReferences = cache(queryPublicReferences)
