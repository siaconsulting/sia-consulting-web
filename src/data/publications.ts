import 'server-only'

import type { Publication, Sector, Service, TeamMember } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

type Person = Pick<TeamMember, 'id' | 'name' | 'slug' | 'jobTitle' | 'photo' | '_status'>
type Related = Pick<Service | Sector, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>
export type PublicationListingItem = Pick<Publication, 'id' | 'title' | 'slug' | 'excerpt' | 'type' | 'coverImage' | 'publishedAt' | 'createdAt' | 'topics' | 'featured' | '_status'> & {
  authors: Person[]
}
export type PublicationDetail = Omit<Pick<Publication, 'id' | 'title' | 'slug' | 'excerpt' | 'type' | 'coverImage' | 'publishedAt' | 'createdAt' | 'content' | 'topics' | 'authors' | 'services' | 'sectors' | 'meta' | 'updatedAt' | '_status'>, 'authors' | 'services' | 'sectors'> & {
  authors: Person[]
  services: Related[]
  sectors: Related[]
}

async function queryPublicationsPage(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'publications', where: { _status: { equals: 'published' } },
    draft: false, overrideAccess: false, depth: 1, limit: EDITORIAL_PAGE_SIZE, page,
    sort: ['-publishedAt', '-createdAt'],
    select: { title: true, slug: true, excerpt: true, type: true, coverImage: true, publishedAt: true, createdAt: true, topics: true, authors: true, featured: true, _status: true },
  })
  const docs = result.docs as unknown as PublicationListingItem[]
  const authorIDs = relationIDs(docs.flatMap((doc) => doc.authors ?? []))
  const authors = authorIDs.length ? await payload.find({
    collection: 'team-members', where: { and: [{ id: { in: authorIDs } }, { _status: { equals: 'published' } }] },
    draft: false, overrideAccess: false, depth: 0, limit: authorIDs.length, pagination: false,
    select: { id: true, name: true, slug: true, jobTitle: true, photo: true, _status: true },
  }) : { docs: [] }
  const authorsByID = new Map(authors.docs.map((author) => [author.id, author as Person]))
  return { ...result, docs: docs.map((doc) => ({ ...doc, authors: orderByRelation(relationIDs(doc.authors), [...authorsByID.values()]) })) }
}

const requestPublicationsPage = cache(queryPublicationsPage)
export const getPublicationsPage = (page = 1) => requestPublicationsPage(page)

async function queryPublicationBySlug(slug: string, preview: boolean): Promise<PublicationDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const read = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'publications', where: { slug: { equals: slug }, ...(!read.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: read.draft, overrideAccess: false, ...(read.user ? { user: read.user } : {}),
    depth: 0, limit: 1, pagination: false,
    select: { title: true, slug: true, excerpt: true, type: true, coverImage: true, publishedAt: true, createdAt: true, content: true, topics: true, authors: true, services: true, sectors: true, meta: true, updatedAt: true, _status: true },
  })
  const publication = result.docs[0] as unknown as PublicationDetail | undefined
  if (!publication) return null
  const authorIDs = relationIDs(publication.authors)
  const serviceIDs = relationIDs(publication.services)
  const sectorIDs = relationIDs(publication.sectors)
  const [authors, services, sectors] = await Promise.all([
    authorIDs.length ? payload.find({ collection: 'team-members', where: { and: [{ id: { in: authorIDs } }, { _status: { equals: 'published' } }] }, draft: false, overrideAccess: false, depth: 0, limit: authorIDs.length, pagination: false, select: { id: true, name: true, slug: true, jobTitle: true, photo: true, _status: true } }) : Promise.resolve({ docs: [] }),
    serviceIDs.length ? payload.find({ collection: 'services', where: { and: [{ id: { in: serviceIDs } }, { _status: { equals: 'published' } }] }, draft: false, overrideAccess: false, depth: 0, limit: serviceIDs.length, pagination: false, select: { id: true, title: true, slug: true, shortDescription: true, _status: true } }) : Promise.resolve({ docs: [] }),
    sectorIDs.length ? payload.find({ collection: 'sectors', where: { and: [{ id: { in: sectorIDs } }, { _status: { equals: 'published' } }] }, draft: false, overrideAccess: false, depth: 0, limit: sectorIDs.length, pagination: false, select: { id: true, title: true, slug: true, shortDescription: true, _status: true } }) : Promise.resolve({ docs: [] }),
  ])
  return {
    ...publication,
    authors: orderByRelation(authorIDs, authors.docs as Person[]),
    services: orderByRelation(serviceIDs, services.docs as Related[]),
    sectors: orderByRelation(sectorIDs, sectors.docs as Related[]),
  }
}

const requestPublicationBySlug = cache(queryPublicationBySlug)
export const getPublicationBySlug = (slug: string, preview = false) => requestPublicationBySlug(slug, preview)
