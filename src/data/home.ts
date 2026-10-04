import 'server-only'

import type { CaseStudy, HomeSetting, Media, Publication, Reference, Resource, Sector, Service, Training } from '@/payload-types'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type Payload } from 'payload'

type Relation<T> = number | T | null | undefined

export type HomePageData = {
  settings: HomeSetting
  services: HomeService[]
  sectors: HomeSector[]
  trainings: HomeTraining[]
  publications: HomePublication[]
  caseStudies: HomeCaseStudy[]
  resources: HomeResource[]
  references: HomeReference[]
}

export type HomeService = Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | '_status'>
export type HomeSector = Pick<Sector, 'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | '_status'>
export type HomeTraining = Pick<Training, 'id' | 'title' | 'slug' | 'summary' | 'duration' | 'format' | 'heroImage' | '_status'>
export type HomePublication = Pick<Publication, 'id' | 'title' | 'slug' | 'excerpt' | 'type' | 'coverImage' | 'authors' | 'topics' | 'publishedAt' | '_status'>
export type HomeCaseStudy = Pick<CaseStudy, 'id' | 'title' | 'slug' | 'shortDescription' | 'coverImage' | 'clientDisclosure' | 'clientReference' | 'anonymousClientLabel' | 'context' | 'challenge' | 'approach' | 'results' | 'metrics' | '_status'>
export type HomeResource = Pick<Resource, 'id' | 'title' | 'slug' | 'type' | 'shortDescription' | 'coverImage' | '_status'>
export type HomeReference = Pick<Reference, 'id' | 'name' | 'logo' | 'shortDescription' | 'type' | '_status'>

export function orderedPublishedSelection<T extends { id: number; _status?: string | null }, R extends { id: number } = T>(
  selected: Relation<R>[] | null | undefined,
  fetched: T[],
): T[] {
  const publishedByID = new Map(fetched.filter((doc) => doc._status === 'published').map((doc) => [doc.id, doc]))
  return (selected ?? []).flatMap((item) => {
    const id = typeof item === 'object' && item !== null ? item.id : item
    if (typeof id !== 'number') return []
    const document = publishedByID.get(id)
    return document ? [document] : []
  })
}

const relationIDs = <T extends { id: number }>(selected: Relation<T>[] | null | undefined) =>
  [...new Set((selected ?? []).flatMap((item) => {
    const id = typeof item === 'object' && item !== null ? item.id : item
    return typeof id === 'number' ? [id] : []
  }))]

async function findServices(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'services', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 1, draft: false, overrideAccess: false,
    select: { title: true, slug: true, shortDescription: true, heroImage: true, _status: true },
  })
  return docs
}

async function findSectors(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'sectors', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 1, draft: false, overrideAccess: false,
    select: { title: true, slug: true, shortDescription: true, heroImage: true, _status: true },
  })
  return docs
}

async function findTrainings(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'trainings', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 1, draft: false, overrideAccess: false,
    select: { title: true, slug: true, summary: true, duration: true, format: true, heroImage: true, _status: true },
  })
  return docs
}

async function findPublications(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'publications', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 2, draft: false, overrideAccess: false,
    select: { title: true, slug: true, excerpt: true, type: true, coverImage: true, authors: true, topics: true, publishedAt: true, _status: true },
  })
  return docs
}

async function findCaseStudies(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'case-studies', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 2, draft: false, overrideAccess: false,
    select: {
      title: true, slug: true, shortDescription: true, coverImage: true, clientDisclosure: true,
      clientReference: true, anonymousClientLabel: true, context: true, challenge: true,
      approach: true, results: true, metrics: true, _status: true,
    },
  })
  return docs
}

async function findResources(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'resources', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 1, draft: false, overrideAccess: false,
    select: { title: true, slug: true, type: true, shortDescription: true, coverImage: true, _status: true },
  })
  return docs
}

async function findReferences(payload: Payload, ids: number[]) {
  if (!ids.length) return []
  const { docs } = await payload.find({
    collection: 'references', where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    limit: ids.length, depth: 1, draft: false, overrideAccess: false,
    select: { name: true, logo: true, shortDescription: true, type: true, _status: true },
  })
  return docs
}

export async function loadHomePageData(payload: Payload): Promise<HomePageData> {
  const settings = await payload.findGlobal({ slug: 'home-settings', depth: 1, draft: false, overrideAccess: false })
  const [services, sectors, trainings, publications, caseStudies, resources, references] = await Promise.all([
    findServices(payload, relationIDs(settings.featuredServices)),
    findSectors(payload, relationIDs(settings.featuredSectors)),
    findTrainings(payload, relationIDs(settings.featuredTrainings)),
    findPublications(payload, relationIDs(settings.featuredPublications)),
    findCaseStudies(payload, relationIDs(settings.featuredCaseStudies)),
    findResources(payload, relationIDs(settings.featuredResources)),
    findReferences(payload, relationIDs(settings.featuredReferences)),
  ])

  return {
    settings,
    services: orderedPublishedSelection(settings.featuredServices, services),
    sectors: orderedPublishedSelection(settings.featuredSectors, sectors),
    trainings: orderedPublishedSelection(settings.featuredTrainings, trainings),
    publications: orderedPublishedSelection(settings.featuredPublications, publications),
    caseStudies: orderedPublishedSelection(settings.featuredCaseStudies, caseStudies),
    resources: orderedPublishedSelection(settings.featuredResources, resources),
    references: orderedPublishedSelection(settings.featuredReferences, references),
  }
}

const getCachedHomePageData = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return loadHomePageData(payload)
  },
  ['sia-homepage-data-v1'],
  { tags: ['homepage', 'global_home-settings'] },
)

export const getHomePageData = () => getCachedHomePageData()

export function populatedMedia(value: Relation<Media>): Media | null {
  return typeof value === 'object' && value !== null && 'url' in value ? value : null
}
