import { getPayload, type Payload } from 'payload'
import type { Service } from '@/payload-types'
import config from '@/payload.config'
import { loadHomePageData, orderedPublishedSelection } from '@/data/home'
import { getPublicCaseStudyClientLabel } from '@/utilities/homePresentation'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
const body: Service['body'] = {
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Contenu de test', version: 1 }], direction: null, format: '', indent: 0, version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}

describe('Homepage data contract', () => {
  let payload: Payload
  let originalSelection: unknown
  const created: number[] = []

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const settings = await payload.findGlobal({ slug: 'home-settings', depth: 0, overrideAccess: true })
    originalSelection = settings.featuredServices ?? []
  })

  afterAll(async () => {
    if (!payload) return
    await payload.updateGlobal({
      slug: 'home-settings',
      data: { featuredServices: originalSelection as number[] },
      overrideAccess: true,
      context: { disableRevalidate: true },
    }).catch(() => undefined)
    for (const id of created) {
      await payload.delete({ collection: 'services', id, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    }
    await payload.destroy()
  })

  it('preserves editorial order while omitting unresolved and non-published relations', () => {
    const documents = [
      { id: 12, _status: 'published', title: 'Second' },
      { id: 11, _status: 'published', title: 'First' },
      { id: 13, _status: 'draft', title: 'Draft' },
    ]
    expect(orderedPublishedSelection([11, 13, 404, 12], documents).map(({ title }) => title)).toEqual(['First', 'Second'])
  })

  it('uses only the neutral label for anonymized cases, even if a reference is present', () => {
    expect(getPublicCaseStudyClientLabel({
      clientDisclosure: 'anonymous',
      anonymousClientLabel: 'Organisation anonymisée',
      clientReference: { name: 'Nom confidentiel' },
    })).toBe('Organisation anonymisée')
    expect(getPublicCaseStudyClientLabel({ clientDisclosure: 'named', clientReference: { name: 'Référence publiable' } })).toBe('Référence publiable')
  })

  it('reads the homepage as a public visitor, preserves selected order, and omits a draft', async () => {
    const records = await Promise.all([
      payload.create({ collection: 'services', data: { title: `Homepage first ${suffix}`, slug: `homepage-first-${suffix}`, shortDescription: 'Résumé test.', body, _status: 'published' }, overrideAccess: true, context: { disableRevalidate: true } }),
      payload.create({ collection: 'services', data: { title: `Homepage second ${suffix}`, slug: `homepage-second-${suffix}`, shortDescription: 'Résumé test.', body, _status: 'published' }, overrideAccess: true, context: { disableRevalidate: true } }),
      payload.create({ collection: 'services', data: { title: `Homepage draft ${suffix}`, slug: `homepage-draft-${suffix}`, shortDescription: 'Résumé test.', body, _status: 'draft' }, draft: true, overrideAccess: true, context: { disableRevalidate: true } }),
    ])
    created.push(...records.map(({ id }) => id))

    await payload.updateGlobal({
      slug: 'home-settings',
      data: { featuredServices: [records[1].id, records[2].id, records[0].id] },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const homepage = await loadHomePageData(payload)
    expect(homepage.services.map(({ id }) => id)).toEqual([records[1].id, records[0].id])
    expect(homepage.services.every(({ _status }) => _status === 'published')).toBe(true)
    expect(JSON.stringify(homepage)).not.toContain('[object Object]')
  })
})
