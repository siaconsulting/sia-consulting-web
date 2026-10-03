import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import type { Service } from '@/payload-types'
import { buildSearchResultFields } from '@/search/beforeSync'

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
const richText = {
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Texte éditorial de test', version: 1 }],
      direction: null, format: '', indent: 0, version: 1,
    }],
    direction: null, format: '', indent: 0, version: 1,
  },
}

let payload: Payload
const created: { collection: 'services' | 'trainings' | 'publications'; id: number }[] = []

const searchResultFor = async (collection: string, id: number) => payload.find({
  collection: 'search',
  where: { and: [{ 'doc.relationTo': { equals: collection } }, { 'doc.value': { equals: id } }] },
  limit: 1,
  depth: 0,
  overrideAccess: false,
})

describe('SIA multi-type search index', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    if (!payload) return
    for (const item of created) {
      await payload.delete({ collection: item.collection, id: item.id, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    }
    await payload.destroy()
  })

  it('indexes published services, trainings and publications with typed public URLs', async () => {
    const service = await payload.create({
      collection: 'services',
      data: { title: `Recherche service ${suffix}`, slug: `search-service-${suffix}`, shortDescription: 'Résumé service', body: richText, _status: 'published' } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'services', id: service.id })

    const training = await payload.create({
      collection: 'trainings',
      data: { title: `Recherche formation ${suffix}`, slug: `search-training-${suffix}`, summary: 'Résumé formation', description: richText, _status: 'published' } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'trainings', id: training.id })

    const publication = await payload.create({
      collection: 'publications',
      data: { title: `Recherche publication ${suffix}`, slug: `search-publication-${suffix}`, excerpt: 'Résumé publication', type: 'analysis', content: richText, _status: 'published' } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'publications', id: publication.id })

    const serviceResult = await searchResultFor('services', service.id)
    const trainingResult = await searchResultFor('trainings', training.id)
    const publicationResult = await searchResultFor('publications', publication.id)
    expect(serviceResult.docs[0]).toMatchObject({ contentType: 'services', url: `/expertises/${service.slug}`, excerpt: 'Résumé service' })
    expect(trainingResult.docs[0]).toMatchObject({ contentType: 'trainings', url: `/formations/${training.slug}`, excerpt: 'Résumé formation' })
    expect(publicationResult.docs[0]).toMatchObject({ contentType: 'publications', url: `/publications/${publication.slug}`, excerpt: 'Résumé publication' })
  })

  it('excludes drafts and removes a result when its document is unpublished', async () => {
    const draft = await payload.create({
      collection: 'services',
      data: { title: `Brouillon recherche ${suffix}`, slug: `search-draft-${suffix}`, shortDescription: 'Ne pas indexer', body: richText, _status: 'draft' } as never,
      draft: true,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'services', id: draft.id })
    expect((await searchResultFor('services', draft.id)).docs).toHaveLength(0)

    const published = await payload.create({
      collection: 'services',
      data: { title: `À dépublier ${suffix}`, slug: `search-unpublish-${suffix}`, shortDescription: 'Résumé', body: richText, _status: 'published' } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'services', id: published.id })
    expect((await searchResultFor('services', published.id)).docs).toHaveLength(1)

    await payload.update({
      collection: 'services', id: published.id,
      data: { _status: 'draft' } as Partial<Service>,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    expect((await searchResultFor('services', published.id)).docs).toHaveLength(0)
  })

  it('keeps the search result payload intentionally small and route-backed', () => {
    const service = buildSearchResultFields('services', { slug: 'risk', title: 'Risk', shortDescription: 'A short intro', body: richText })
    expect(service).toEqual({ contentType: 'services', slug: 'risk', url: '/expertises/risk', excerpt: 'A short intro' })
    expect(service).not.toHaveProperty('body')
    expect(buildSearchResultFields('case-studies', { slug: 'case' }).url).toBe('/etudes-de-cas/case')
    expect(buildSearchResultFields('resources', { slug: 'guide' }).url).toBe('/ressources/guide')
  })
})
