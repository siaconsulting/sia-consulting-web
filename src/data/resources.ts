import 'server-only'

import type { Media, Resource, Sector, Service } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

type Related = Pick<Service | Sector, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>
export type PublicFile = Pick<Media, 'id' | 'url' | 'filename' | 'mimeType' | 'filesize' | 'updatedAt' | 'alt'>
type ResourceFields = Pick<Resource, 'id' | 'title' | 'slug' | 'type' | 'shortDescription' | 'coverImage' | 'publishedAt' | 'createdAt' | 'featured' | '_status'>
export type ResourceListingItem = ResourceFields & { file: PublicFile }
export type ResourceDetail = Omit<ResourceFields & Pick<Resource, 'services' | 'sectors' | 'meta' | 'updatedAt'>, 'services' | 'sectors'> & {
  file: PublicFile
  services: Related[]
  sectors: Related[]
}

async function getPublicFile(value: number | Media | null | undefined): Promise<PublicFile | null> {
  if (value && typeof value === 'object') return value.url ? value as PublicFile : null
  if (typeof value !== 'number') return null
  const payload = await getPayload({ config: configPromise })
  try {
    const media = await payload.findByID({ collection: 'media', id: value, depth: 0, overrideAccess: false, select: { id: true, url: true, filename: true, mimeType: true, filesize: true, updatedAt: true, alt: true } })
    return media.url ? media as PublicFile : null
  } catch { return null }
}

async function related(collection: 'services' | 'sectors', ids: number[]) {
  if (!ids.length) return []
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection, where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] }, draft: false, overrideAccess: false, depth: 0, limit: ids.length, pagination: false, select: { id: true, title: true, slug: true, shortDescription: true, _status: true } })
  return orderByRelation(ids, result.docs as Related[])
}

async function queryResourcesPage(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'resources', where: { _status: { equals: 'published' } }, draft: false, overrideAccess: false,
    depth: 1, limit: EDITORIAL_PAGE_SIZE, page, sort: ['order', '-publishedAt', 'title'],
    select: { title: true, slug: true, type: true, shortDescription: true, file: true, coverImage: true, publishedAt: true, createdAt: true, featured: true, _status: true },
  })
  const docs = result.docs as unknown as (Omit<ResourceListingItem, 'file'> & { file: number | Media })[]
  const resolved = await Promise.all(docs.map(async (doc) => ({ ...doc, file: await getPublicFile(doc.file as number | Media) })))
  return { ...result, docs: resolved.filter((doc): doc is ResourceListingItem => doc.file !== null) }
}

const requestResourcesPage = cache(queryResourcesPage)
export const getResourcesPage = (page = 1) => requestResourcesPage(page)

async function queryResourceBySlug(slug: string, preview: boolean): Promise<ResourceDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const read = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'resources', where: { slug: { equals: slug }, ...(!read.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: read.draft, overrideAccess: false, ...(read.user ? { user: read.user } : {}), depth: 0, limit: 1, pagination: false,
    select: { title: true, slug: true, type: true, shortDescription: true, file: true, coverImage: true, services: true, sectors: true, meta: true, publishedAt: true, createdAt: true, updatedAt: true, featured: true, _status: true },
  })
  const resource = result.docs[0] as unknown as (Omit<ResourceDetail, 'file' | 'services' | 'sectors'> & { services?: Resource['services']; sectors?: Resource['sectors']; file: number | Media }) | undefined
  if (!resource) return null
  const serviceIDs = relationIDs(resource.services)
  const sectorIDs = relationIDs(resource.sectors)
  const [file, services, sectors] = await Promise.all([
    getPublicFile(resource.file), related('services', serviceIDs), related('sectors', sectorIDs),
  ])
  if (!file) return null
  return { ...resource, file, services, sectors } as ResourceDetail
}

const requestResourceBySlug = cache(queryResourceBySlug)
export const getResourceBySlug = (slug: string, preview = false) => requestResourceBySlug(slug, preview)
