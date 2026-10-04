import 'server-only'

import type { Sector, Service, Training } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions } from './shared/editorial'

export type SectorListingItem = Pick<Sector, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'order' | '_status'>
export type SectorDetail = Pick<Sector, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'introduction' | 'body' | 'meta' | 'updatedAt' | '_status'> & {
  relatedServices: Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | '_status'>[]
  relatedTrainings: Pick<Training, 'id' | 'title' | 'slug' | 'summary' | 'duration' | 'format' | '_status'>[]
}

async function querySectorList(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'sectors',
    where: { _status: { equals: 'published' } },
    draft: false,
    overrideAccess: false,
    depth: 1,
    limit: EDITORIAL_PAGE_SIZE,
    page,
    sort: ['order', 'title'],
    select: { title: true, slug: true, shortDescription: true, heroImage: true, order: true, _status: true },
  })
  return { ...result, docs: result.docs as SectorListingItem[] }
}

const requestSectorList = cache(querySectorList)
export const getSectorsPage = (page = 1) => requestSectorList(page)

async function querySectorBySlug(slug: string, preview: boolean): Promise<SectorDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const readOptions = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'sectors',
    where: { slug: { equals: slug }, ...(!readOptions.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: readOptions.draft,
    overrideAccess: false,
    ...(readOptions.user ? { user: readOptions.user } : {}),
    depth: 0,
    limit: 1,
    pagination: false,
    select: { title: true, slug: true, shortDescription: true, heroImage: true, introduction: true, body: true, meta: true, updatedAt: true, _status: true },
  })
  const sector = result.docs[0] as Sector | undefined
  if (!sector) return null

  const [servicesResult, trainingsResult] = await Promise.all([
    payload.find({
      collection: 'services', where: { and: [{ sectors: { contains: sector.id } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 1, limit: 100, pagination: false, sort: ['order', 'title'],
      select: { title: true, slug: true, shortDescription: true, heroImage: true, _status: true },
    }),
    payload.find({
      collection: 'trainings', where: { and: [{ sectors: { contains: sector.id } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 1, limit: 100, pagination: false, sort: ['order', 'title'],
      select: { title: true, slug: true, summary: true, duration: true, format: true, _status: true },
    }),
  ])
  const relatedServices = servicesResult.docs as SectorDetail['relatedServices']
  const relatedTrainings = trainingsResult.docs as SectorDetail['relatedTrainings']

  return {
    ...sector,
    relatedServices,
    relatedTrainings,
  }
}

const requestSectorBySlug = cache(querySectorBySlug)
export const getSectorBySlug = (slug: string, preview = false) => {
  if (preview) return requestSectorBySlug(slug, true)
  return requestSectorBySlug(slug, false)
}
