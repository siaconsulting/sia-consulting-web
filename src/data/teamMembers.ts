import 'server-only'

import type { Media, Publication, Service, TeamMember } from '@/payload-types'
import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'
import { EDITORIAL_PAGE_SIZE, getEditorialReadOptions, orderByRelation, relationIDs } from './shared/editorial'

type MediaRelation = number | Media | null | undefined
type ServiceRelation = number | Pick<Service, 'id'> | null | undefined
type PublicationAuthor = number | Pick<TeamMember, 'id' | 'name' | 'slug' | 'jobTitle'> | null | undefined

export type TeamService = Pick<Service, 'id' | 'title' | 'slug' | 'shortDescription' | '_status'>
export type TeamPublication = Pick<Publication, 'id' | 'title' | 'slug' | 'type' | 'publishedAt' | 'createdAt' | '_status'>
export type TeamMemberItem = Pick<TeamMember, 'id' | 'name' | 'slug' | 'jobTitle' | 'shortBio' | 'featured' | 'order' | '_status'> & {
  photo: MediaRelation
  services: TeamService[]
  publications: TeamPublication[]
}
export type TeamMemberDetail = Pick<TeamMember, 'id' | 'name' | 'slug' | 'jobTitle' | 'shortBio' | 'bio' | 'linkedin' | 'publicEmail' | 'meta' | 'updatedAt' | '_status'> & {
  photo: MediaRelation
  services: TeamService[]
  publications: TeamPublication[]
}

async function attachPublicRelations<T extends { id: number; services?: ServiceRelation[] | null }>(members: T[]) {
  const payload = await getPayload({ config: configPromise })
  if (!members.length) return [] as (T & { services: TeamService[]; publications: TeamPublication[] })[]

  const serviceIDs = relationIDs(members.flatMap((member) => member.services ?? []))
  const [serviceResult, publicationResult] = await Promise.all([
    serviceIDs.length ? payload.find({
      collection: 'services', where: { and: [{ id: { in: serviceIDs } }, { _status: { equals: 'published' } }] },
      draft: false, overrideAccess: false, depth: 0, limit: serviceIDs.length, pagination: false,
      select: { id: true, title: true, slug: true, shortDescription: true, _status: true },
    }) : Promise.resolve({ docs: [] }),
    payload.find({
      collection: 'publications',
      where: { and: [{ _status: { equals: 'published' } }, { or: members.map(({ id }) => ({ authors: { contains: id } })) }] },
      draft: false, overrideAccess: false, depth: 0, limit: 500, pagination: false,
      sort: ['-publishedAt', '-createdAt'],
      select: { id: true, title: true, slug: true, type: true, publishedAt: true, createdAt: true, authors: true, _status: true },
    }),
  ])

  const services = serviceResult.docs as TeamService[]
  const publications = publicationResult.docs as unknown as (TeamPublication & { authors?: PublicationAuthor[] })[]
  return members.map((member) => {
    const authorPublications = publications.filter((publication) => relationIDs(publication.authors).includes(member.id))
    return {
      ...member,
      services: orderByRelation(relationIDs(member.services), services),
      publications: authorPublications.map(({ authors: _authors, ...publication }) => publication),
    }
  })
}

async function queryTeamMembersPage(page: number) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'team-members', where: { _status: { equals: 'published' } },
    draft: false, overrideAccess: false, depth: 1, limit: EDITORIAL_PAGE_SIZE, page,
    sort: ['order', 'name'],
    select: { id: true, name: true, slug: true, jobTitle: true, shortBio: true, photo: true, services: true, featured: true, order: true, _status: true },
  })
  const members = await attachPublicRelations(result.docs as unknown as (TeamMemberItem & { services?: ServiceRelation[] })[])
  return { ...result, docs: members }
}

const requestTeamMembersPage = cache(queryTeamMembersPage)
export const getTeamMembersPage = (page = 1) => requestTeamMembersPage(page)

async function queryTeamMemberBySlug(slug: string, preview: boolean): Promise<TeamMemberDetail | null> {
  const payload = await getPayload({ config: configPromise })
  const read = await getEditorialReadOptions(payload, preview)
  const result = await payload.find({
    collection: 'team-members',
    where: { slug: { equals: slug }, ...(!read.draft ? { _status: { equals: 'published' as const } } : {}) },
    draft: read.draft, overrideAccess: false, ...(read.user ? { user: read.user } : {}),
    depth: 1, limit: 1, pagination: false,
    select: { id: true, name: true, slug: true, jobTitle: true, shortBio: true, bio: true, photo: true, linkedin: true, publicEmail: true, services: true, meta: true, updatedAt: true, _status: true },
  })
  const member = result.docs[0] as unknown as (TeamMemberDetail & { services?: ServiceRelation[] }) | undefined
  if (!member) return null
  const [enriched] = await attachPublicRelations([member])
  return enriched as TeamMemberDetail
}

const requestTeamMemberBySlug = cache(queryTeamMemberBySlug)
export const getTeamMemberBySlug = (slug: string, preview = false) => requestTeamMemberBySlug(slug, preview)
