import { getPayload, type Payload } from 'payload'
import type { User } from '@/payload-types'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { resolveLinkHref, validateExternalURL } from '@/utilities/links'
import { getGlobalRevalidationTargets } from '@/utilities/globalRevalidation'
import { getCollectionDetailPath, getCollectionListingPath } from '@/utilities/publicRoutes'
import { canRunDemoSeed } from '@/utilities/seedAccess'
import { getPreviewDocumentPath } from '@/utilities/generatePreviewPath'
import { redirectCollections } from '@/plugins'
import { SIA_SEARCH_COLLECTIONS } from '@/search/fieldOverrides'
import { PUBLIC_PRIMARY_NAV_FALLBACK } from '@/utilities/publicRoutes'
import { getEditorialRevalidationTargets } from '@/utilities/editorialRevalidation'

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
const globalFields = {
  'site-settings': { field: 'siteName', fallback: null },
  'contact-information': { field: 'generalEmail', fallback: null },
  'home-settings': { field: 'introduction', fallback: null },
  'about-settings': { field: 'metaTitle', fallback: null },
  header: { field: 'navItems', fallback: [] },
  footer: { field: 'navigationColumns', fallback: [] },
} as const
type GlobalName = keyof typeof globalFields

let payload: Payload
const users = {} as Record<'admin' | 'editor' | 'commercial', User>
const previousValues = {} as Record<GlobalName, unknown>
let previousFeaturedServices: unknown = []
let serviceID: number | undefined

const updateGlobal = (slug: GlobalName, value: unknown, user?: User, overrideAccess = false) =>
  payload.updateGlobal({
    slug,
    data: { [globalFields[slug].field]: value } as never,
    user,
    overrideAccess,
    context: { disableRevalidate: true },
  })

describe('Globals SIA', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    for (const role of ['admin', 'editor', 'commercial'] as const) {
      users[role] = await payload.create({
        collection: 'users',
        data: { email: `globals-${role}-${suffix}@example.test`, password: `test-${suffix}`, role },
        overrideAccess: true,
      })
    }
    for (const slug of Object.keys(globalFields) as GlobalName[]) {
      const doc = await payload.findGlobal({ slug, overrideAccess: true })
      previousValues[slug] = doc[globalFields[slug].field as keyof typeof doc] ?? globalFields[slug].fallback
    }
    const home = await payload.findGlobal({ slug: 'home-settings', overrideAccess: true })
    previousFeaturedServices = home.featuredServices ?? []
  })

  afterAll(async () => {
    if (!payload) return
    for (const slug of Object.keys(globalFields) as GlobalName[]) {
      await updateGlobal(slug, previousValues[slug], undefined, true).catch(() => undefined)
    }
    await payload.updateGlobal({ slug: 'home-settings', data: { featuredServices: previousFeaturedServices as number[] }, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    if (serviceID !== undefined) await payload.delete({ collection: 'services', id: serviceID, overrideAccess: true, context: { disableRevalidate: true } })
    for (const user of Object.values(users)) if (user?.id) await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
    await payload.destroy()
  })

  it('allows public reads and ADMIN/EDITOR updates, while denying COMMERCIAL and anonymous writes', async () => {
    for (const slug of Object.keys(globalFields) as GlobalName[]) {
      await expect(payload.findGlobal({ slug, overrideAccess: false })).resolves.toBeDefined()
      const value = slug === 'site-settings' ? `Test ${suffix}` : slug === 'contact-information' ? `public-${suffix}@example.test` : slug === 'home-settings' ? `Test introduction ${suffix}` : slug === 'about-settings' ? `About ${suffix}` : []
      await expect(updateGlobal(slug, value, users.editor)).resolves.toBeDefined()
      await expect(updateGlobal(slug, value, users.admin)).resolves.toBeDefined()
      await expect(updateGlobal(slug, value, users.commercial)).rejects.toThrow()
      await expect(updateGlobal(slug, value)).rejects.toThrow()
    }
  })

  it('rejects unsafe Payload URLs and resolves typed internal links', async () => {
    expect(validateExternalURL('https://example.com/page')).toBe(true)
    expect(validateExternalURL('javascript:alert(1)')).toContain('HTTPS')
    expect(resolveLinkHref({ type: 'route', route: '/expertises' })).toBe('/expertises')
    expect(resolveLinkHref({ type: 'route', route: '//evil.example' })).toBeNull()
    expect(resolveLinkHref({ type: 'custom', url: '/contact' })).toBe('/contact')
    expect(resolveLinkHref({ type: 'custom', url: '//evil.example' })).toBeNull()
    expect(resolveLinkHref({ type: 'reference', reference: { relationTo: 'services', value: { slug: 'actuariat' } } })).toBe('/expertises/actuariat')
    await expect(payload.updateGlobal({
      slug: 'header',
      data: { primaryCTA: { type: 'custom', url: 'javascript:alert(1)', label: 'Unsafe' } },
      user: users.editor,
      overrideAccess: false,
      context: { disableRevalidate: true },
    })).rejects.toThrow()
    expect(getGlobalRevalidationTargets('home-settings')).toEqual({ paths: [{ path: '/', type: 'page' }], tags: ['global_home-settings', 'homepage'] })
    expect(getGlobalRevalidationTargets('about-settings')).toEqual({ paths: [{ path: '/a-propos', type: 'page' }], tags: ['global_about-settings', 'about'] })
    expect(getEditorialRevalidationTargets('services', ['homepage-service'])).toMatchObject({
      paths: expect.arrayContaining([{ path: '/', type: 'page' }]),
      tags: expect.arrayContaining(['homepage']),
    })
    expect(getCollectionListingPath('services')).toBe('/expertises')
    expect(getCollectionDetailPath('services', 'actuariat')).toBe('/expertises/actuariat')
    expect(getCollectionDetailPath('case-studies', 'cas-sia')).toBe('/etudes-de-cas/cas-sia')
    expect(getCollectionDetailPath('team-members', 'membre')).toBe('/equipe/membre')
    expect(getCollectionDetailPath('resources', 'rapport')).toBe('/ressources/rapport')
    expect(getCollectionDetailPath('references', 'organisation')).toBeNull()
    expect(PUBLIC_PRIMARY_NAV_FALLBACK).toEqual([
      { label: 'Expertises', href: '/expertises' },
      { label: 'Secteurs', href: '/secteurs' },
      { label: 'Formations', href: '/formations' },
      { label: 'Publications', href: '/publications' },
      { label: 'À propos', href: '/a-propos' },
    ])
    expect(getPreviewDocumentPath('services', 'actuariat')).toBe('/expertises/actuariat')
    expect(getPreviewDocumentPath('references', 'organisation')).toBeNull()
    expect(redirectCollections).toEqual(expect.arrayContaining(['services', 'sectors', 'trainings', 'publications', 'case-studies', 'team-members', 'resources']))
    expect(redirectCollections).not.toContain('references')
    expect(SIA_SEARCH_COLLECTIONS).toEqual(['services', 'sectors', 'trainings', 'publications', 'case-studies', 'resources'])
    expect(canRunDemoSeed({ role: 'admin' }, 'development')).toBe(true)
    expect(canRunDemoSeed({ role: 'editor' }, 'development')).toBe(false)
    expect(canRunDemoSeed({ role: 'commercial' }, 'development')).toBe(false)
    expect(canRunDemoSeed(null, 'development')).toBe(false)
    expect(canRunDemoSeed({ role: 'admin' }, 'production')).toBe(false)
  })

  it('stores a valid homepage relationship and relays targeted revalidation from the worker context', async () => {
    const service = await payload.create({
      collection: 'services',
      data: { title: `Relation ${suffix}`, slug: `global-home-${suffix}`, shortDescription: 'Fixture relation', body: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Fixture text', version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } }, _status: 'published' },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    serviceID = service.id
    await payload.updateGlobal({ slug: 'home-settings', data: { featuredServices: [service.id] }, user: users.editor, overrideAccess: false, context: { disableRevalidate: true } })
    const home = await payload.findGlobal({ slug: 'home-settings', depth: 0, overrideAccess: true })
    expect(home.featuredServices).toContain(service.id)
    expect(Object.keys(home).filter((key) => /password|secret|api.?key|private/i.test(key))).toEqual([])

    const previousSecret = process.env.REVALIDATION_SECRET
    const previousServerURL = process.env.NEXT_PUBLIC_SERVER_URL
    process.env.REVALIDATION_SECRET = `globals-${suffix}`
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3100'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    try {
      await payload.updateGlobal({ slug: 'home-settings', data: { introduction: `Revalidate ${suffix}` }, user: users.editor, overrideAccess: false })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, options] = fetchMock.mock.calls[0]
      expect(String(url)).toBe('http://localhost:3100/api/internal/revalidate')
      expect(options).toMatchObject({
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.REVALIDATION_SECRET}` },
        body: JSON.stringify({ global: 'home-settings' }),
        cache: 'no-store',
      })
    } finally {
      fetchMock.mockRestore()
      if (previousSecret === undefined) delete process.env.REVALIDATION_SECRET
      else process.env.REVALIDATION_SECRET = previousSecret
      if (previousServerURL === undefined) Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SERVER_URL')
      else process.env.NEXT_PUBLIC_SERVER_URL = previousServerURL
    }
  })
})
