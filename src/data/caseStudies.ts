import 'server-only'

import type { CaseStudy, Reference, Sector, Service } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

type Related = Pick<Service | Sector, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>
export type PublicReference = Pick<Reference, 'id' | 'name' | 'slug' | 'website' | 'shortDescription' | 'logo' | '_status'>
export type CaseStudyListingItem = Pick<CaseStudy, 'id' | 'title' | 'slug' | 'shortDescription' | 'coverImage' | 'clientDisclosure' | 'anonymousClientLabel' | 'publishedAt' | 'createdAt' | 'featured' | '_status'> & {
  clientReference: PublicReference | null
  services: Related[]
  sectors: Related[]
}
export type CaseStudyDetail = Omit<Pick<CaseStudy, 'id' | 'title' | 'slug' | 'shortDescription' | 'coverImage' | 'clientDisclosure' | 'anonymousClientLabel' | 'context' | 'challenge' | 'approach' | 'results' | 'metrics' | 'services' | 'sectors' | 'publishedAt' | 'createdAt' | 'meta' | 'updatedAt' | '_status'>, 'services' | 'sectors' | 'clientReference'> & {
  clientReference: PublicReference | null
  services: Related[]
  sectors: Related[]
}

async function publishedRelated(collection: 'services' | 'sectors', ids: number[]) {
  if (!ids.length) return []
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection, where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    draft: false, overrideAccess: false, depth: 0, limit: ids.length, pagination: false,
    select: { id: true, title: true, slug: true, shortDescription: true, _status: true },
  })
  return orderByRelation(ids, result.docs as Related[])
}

async function publishedReference(id: number): Promise<PublicReference | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    const result = await payload.find({
      collection: 'references', where: { and: [{ id: { equals: id } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 0, limit: 1, pagination: false,
      select: { id: true, name: true, slug: true, website: true, shortDescription: true, logo: true, _status: true },
    })
    const reference = result.docs[0]
    if (!reference) return null
    return reference._status === 'published' ? reference as PublicReference : null
  } catch {
    return null
  }
}

async function referenceIDsForNamedStudies(studies: { id: number; clientDisclosure?: string | null }[]) {
  const namedIDs = studies.filter((study) => study.clientDisclosure === 'named').map((study) => study.id)
  if (!namedIDs.length) return new Map<number, number>()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies', where: { and: [{ id: { in: namedIDs } }, { clientDisclosure: { equals: 'named' } }, { _status: { equals: 'published' } }] },
    draft: false, overrideAccess: false, depth: 0, limit: namedIDs.length, pagination: false,
    select: { id: true, clientReference: true, clientDisclosure: true },
  })
  return new Map(result.docs.flatMap((doc) => {
    const relationship = doc.clientReference
    const id = typeof relationship === 'object' && relationship ? relationship.id : relationship
    return doc.clientDisclosure === 'named' && typeof id === 'number' ? [[doc.id, id] as const] : []
  }))
}

async function attachPublicRelations<T extends CaseStudyListingItem | CaseStudyDetail>(doc: T, referenceID?: number): Promise<T> {
  const serviceIDs = relationIDs(doc.services)
  const sectorIDs = relationIDs(doc.sectors)
  const [services, sectors, clientReference] = await Promise.all([
    publishedRelated('services', serviceIDs),
    publishedRelated('sectors', sectorIDs),
    doc.clientDisclosure === 'named' && referenceID ? publishedReference(referenceID) : Promise.resolve(null),
  ])
  return {
    ...doc,
    // Do not resolve, populate, or return a reference for an anonymized study.
    clientReference: doc.clientDisclosure === 'named' ? clientReference : null,
    services,
    sectors,
  } as T
}

async function queryCaseStudiesPage(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies', where: { _status: { equals: 'published' } },
    draft: false, overrideAccess: false, depth: 0, limit: EDITORIAL_PAGE_SIZE, page,
    sort: ['-publishedAt', '-createdAt'],
    // clientReference is intentionally excluded from this first read.
    select: { title: true, slug: true, shortDescription: true, coverImage: true, clientDisclosure: true, anonymousClientLabel: true, services: true, sectors: true, publishedAt: true, createdAt: true, featured: true, _status: true },
  })
  const docs = result.docs as unknown as CaseStudyListingItem[]
  const referenceIDs = await referenceIDsForNamedStudies(docs)
  return { ...result, docs: await Promise.all(docs.map((doc) => attachPublicRelations(doc, referenceIDs.get(doc.id)))) }
}

const requestCaseStudiesPage = cache(queryCaseStudiesPage)
export const getCaseStudiesPage = (page = 1) => requestCaseStudiesPage(page)

async function queryCaseStudyBySlug(slug: string, preview: boolean): Promise<CaseStudyDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const read = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'case-studies', where: { slug: { equals: slug }, ...(!read.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: read.draft, overrideAccess: false, ...(read.user ? { user: read.user } : {}),
    depth: 0, limit: 1, pagination: false,
    // Same privacy boundary as the listing: reference details are a separate, conditional read.
    select: { title: true, slug: true, shortDescription: true, coverImage: true, clientDisclosure: true, anonymousClientLabel: true, context: true, challenge: true, approach: true, results: true, metrics: true, services: true, sectors: true, publishedAt: true, createdAt: true, meta: true, updatedAt: true, _status: true },
  })
  const study = result.docs[0] as unknown as CaseStudyDetail | undefined
  if (!study) return null
  const referenceIDs = await referenceIDsForNamedStudies([study])
  return attachPublicRelations(study, referenceIDs.get(study.id))
}

const requestCaseStudyBySlug = cache(queryCaseStudyBySlug)
export const getCaseStudyBySlug = (slug: string, preview = false) => requestCaseStudyBySlug(slug, preview)
