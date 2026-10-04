import 'server-only'

import type { Sector, Service, Training } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

export type TrainingListingItem = Pick<Training, 'id' | 'title' | 'slug' | 'code' | 'summary' | 'duration' | 'format' | 'order' | 'heroImage' | '_status'>
export type TrainingDetail = Omit<Pick<Training, 'id' | 'title' | 'slug' | 'code' | 'summary' | 'heroImage' | 'description' | 'objectives' | 'targetAudience' | 'prerequisites' | 'program' | 'duration' | 'format' | 'location' | 'services' | 'sectors' | 'meta' | 'updatedAt' | '_status'>, 'services' | 'sectors'> & {
  services: (number | Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>)[]
  sectors: (number | Pick<Sector, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>)[]
}

async function queryTrainingList(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'trainings',
    where: { _status: { equals: 'published' } },
    draft: false,
    overrideAccess: false,
    depth: 0,
    limit: EDITORIAL_PAGE_SIZE,
    page,
    sort: ['order', 'title'],
    select: { title: true, slug: true, code: true, summary: true, duration: true, format: true, order: true, heroImage: true, _status: true },
  })
  return { ...result, docs: result.docs as TrainingListingItem[] }
}

const requestTrainingList = cache(queryTrainingList)
export const getTrainingsPage = (page = 1) => requestTrainingList(page)

async function queryTrainingBySlug(slug: string, preview: boolean): Promise<TrainingDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const readOptions = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'trainings',
    where: { slug: { equals: slug }, ...(!readOptions.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: readOptions.draft,
    overrideAccess: false,
    ...(readOptions.user ? { user: readOptions.user } : {}),
    depth: 0,
    limit: 1,
    pagination: false,
    select: { title: true, slug: true, code: true, summary: true, heroImage: true, description: true, objectives: true, targetAudience: true, prerequisites: true, program: true, duration: true, format: true, location: true, services: true, sectors: true, meta: true, updatedAt: true, _status: true },
  })
  const training = result.docs[0] as TrainingDetail | undefined
  if (!training) return null
  const serviceIDs = relationIDs(training.services)
  const sectorIDs = relationIDs(training.sectors)
  const [services, sectors] = await Promise.all([
    serviceIDs.length ? payload.find({
      collection: 'services',
      where: { and: [{ id: { in: serviceIDs } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 0, limit: serviceIDs.length, pagination: false,
      select: { id: true, title: true, slug: true, shortDescription: true, _status: true },
    }) : Promise.resolve({ docs: [] }),
    sectorIDs.length ? payload.find({
      collection: 'sectors',
      where: { and: [{ id: { in: sectorIDs } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 0, limit: sectorIDs.length, pagination: false,
      select: { id: true, title: true, slug: true, shortDescription: true, _status: true },
    }) : Promise.resolve({ docs: [] }),
  ])
  return {
    ...training,
    services: orderByRelation(serviceIDs, services.docs),
    sectors: orderByRelation(sectorIDs, sectors.docs),
  } as TrainingDetail
}

const requestTrainingBySlug = cache(queryTrainingBySlug)
export const getTrainingBySlug = (slug: string, preview = false) => {
  if (preview) return requestTrainingBySlug(slug, true)
  return requestTrainingBySlug(slug, false)
}
