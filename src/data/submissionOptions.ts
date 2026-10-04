import 'server-only'

import type { Sector, Service, Training } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type SubmissionOption = { slug: string; title: string }

const readOptions = async (collection: 'services' | 'sectors' | 'trainings'): Promise<SubmissionOption[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection,
    where: { _status: { equals: 'published' } },
    draft: false,
    overrideAccess: false,
    depth: 0,
    limit: 500,
    pagination: false,
    sort: 'title',
    select: { id: true, slug: true, title: true, _status: true },
  })

  return result.docs.flatMap((doc) => doc.slug && doc._status === 'published' ? [{ slug: doc.slug, title: doc.title }] : [])
}

export async function getServiceSubmissionOptions() {
  const [services, sectors] = await Promise.all([readOptions('services'), readOptions('sectors')])
  return { services: services as Pick<Service, 'slug' | 'title'>[], sectors: sectors as Pick<Sector, 'slug' | 'title'>[] }
}

export async function getTrainingSubmissionOptions() {
  const trainings = await readOptions('trainings')
  return { trainings: trainings as Pick<Training, 'slug' | 'title'>[] }
}

export async function resolvePublishedSubmissionRelation(collection: 'services' | 'sectors' | 'trainings', slug: string) {
  if (!slug || slug.length > 200) return null
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft: false,
    overrideAccess: false,
    depth: 0,
    limit: 1,
    pagination: false,
    select: { id: true, slug: true, _status: true },
  })
  const doc = result.docs[0]
  return doc?._status === 'published' ? doc.id : null
}
