import 'server-only'

import type { Service } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

export type ServiceListingItem = Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'order' | '_status' | 'sectors'>
export type ServiceDetail = Omit<Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'introduction' | 'body' | 'keyBenefits' | 'deliverables' | 'sectors' | 'meta' | 'updatedAt' | '_status'>, 'sectors'> & {
  sectors: (number | Pick<import('@/payload-types').Sector, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>)[]
}

async function queryServiceList(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'services',
    where: { _status: { equals: 'published' } },
    draft: false,
    overrideAccess: false,
    depth: 1,
    limit: EDITORIAL_PAGE_SIZE,
    page,
    sort: ['order', 'title'],
    select: { title: true, slug: true, shortDescription: true, heroImage: true, order: true, sectors: true, _status: true },
  })
  const docs = result.docs as ServiceListingItem[]
  const sectorIDs = relationIDs(docs.flatMap((service) => service.sectors ?? []))
  const sectors = sectorIDs.length ? await payload.find({
    collection: 'sectors',
    where: { and: [{ id: { in: sectorIDs } }, { _status: { equals: 'published' } }] },
    draft: false,
    overrideAccess: false,
    depth: 0,
    limit: sectorIDs.length,
    pagination: false,
    select: { id: true, title: true, slug: true, _status: true },
  }) : { docs: [] }
  const sectorsByID = new Map(sectors.docs.map((sector) => [sector.id, sector]))
  return {
    ...result,
    docs: docs.map((service) => ({
      ...service,
      sectors: orderByRelation(relationIDs(service.sectors), [...sectorsByID.values()]),
    })) as ServiceListingItem[],
  }
}

const requestServiceList = cache(queryServiceList)
export const getServicesPage = (page = 1) => requestServiceList(page)

async function queryServiceBySlug(slug: string, preview: boolean): Promise<ServiceDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const readOptions = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, ...(!readOptions.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: readOptions.draft,
    overrideAccess: false,
    ...(readOptions.user ? { user: readOptions.user } : {}),
    depth: 0,
    limit: 1,
    pagination: false,
    select: { title: true, slug: true, shortDescription: true, heroImage: true, introduction: true, body: true, keyBenefits: true, deliverables: true, sectors: true, meta: true, updatedAt: true, _status: true },
  })
  const service = result.docs[0] as ServiceDetail | undefined
  if (!service) return null
  const sectorIDs = relationIDs(service.sectors)
  const sectors = sectorIDs.length ? await payload.find({
    collection: 'sectors',
    where: { and: [{ id: { in: sectorIDs } }, { _status: { equals: 'published' } }] },
    draft: false,
    overrideAccess: false,
    depth: 0,
    limit: sectorIDs.length,
    pagination: false,
    select: { id: true, title: true, slug: true, shortDescription: true, _status: true },
  }) : { docs: [] }
  return { ...service, sectors: orderByRelation(sectorIDs, sectors.docs) } as ServiceDetail
}

const requestServiceBySlug = cache(queryServiceBySlug)

export const getServiceBySlug = (slug: string, preview = false) => {
  if (preview) return requestServiceBySlug(slug, true)
  return requestServiceBySlug(slug, false)
}
