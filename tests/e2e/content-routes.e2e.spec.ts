import { expect, test } from '@playwright/test'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import type { CaseStudy, Media, Publication, Reference, Resource, TeamMember } from '@/payload-types'
import { getCollectionDetailPath, type PublicCollection } from '@/utilities/publicRoutes'
import { login } from '../helpers/login'

const suffix = `content-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const richText: Publication['content'] = {
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: `Texte de validation ${suffix}.`, type: 'text', version: 1 }],
      direction: null, format: '', indent: 0, version: 1,
    }],
    direction: null, format: '', indent: 0, version: 1,
  },
}
type FixtureDocuments = {
  publications: Publication
  'team-members': TeamMember
  references: Reference
  'case-studies': CaseStudy
  resources: Resource
  media: Media
}

test.describe('Publication, case study and resource production routes', () => {
  let payload: Payload
  const records: { collection: string; id: number }[] = []
  const publicationSlugs: string[] = []
  const publicationIDs: number[] = []
  let authorSlug = ''
  let anonymousCaseSlug = ''
  let anonymousCaseID = 0
  let namedCaseSlug = ''
  let resourceSlug = ''
  let resourceID = 0
  let draftSlugs: string[] = []
  let referenceName = ''
  let resourceFileURL = ''
  let draftTeamSlug = ''
  const referenceSlugs: string[] = []

  async function create<C extends keyof FixtureDocuments>(
    collection: C,
    data: Record<string, unknown>,
    options: { draft?: boolean; file?: { data: Buffer; mimetype: string; name: string; size: number } } = {},
  ): Promise<FixtureDocuments[C]> {
    const isEditorial = collection !== 'media'
    const doc = await payload.create({
      collection,
      data: { ...data, ...(isEditorial ? { _status: options.draft ? 'draft' : 'published' } : {}) } as never,
      ...(options.draft ? { draft: true } : {}),
      ...(options.file ? { file: options.file } : {}),
      overrideAccess: true,
      context: { disableRevalidate: true },
    } as never)
    records.push({ collection, id: doc.id })
    return doc as FixtureDocuments[C]
  }

  test.beforeAll(async () => {
    test.setTimeout(180_000)
    payload = await getPayload({ config: await config })
    const author = await create('team-members', {
      name: `Auteur ${suffix}`, slug: `author-${suffix}`, jobTitle: 'Auteur de test', shortBio: 'Profil temporaire de test.',
    })
    authorSlug = author.slug
    const draftTeam = await create('team-members', {
      name: `Profil brouillon ${suffix}`, slug: `draft-team-${suffix}`, jobTitle: 'Fonction temporaire', shortBio: 'Profil non public.',
    }, { draft: true })
    draftTeamSlug = draftTeam.slug

    for (let index = 0; index < 13; index++) {
      const publication = await create('publications', {
        title: index === 0 ? `Publication mise en avant ${suffix}` : `Publication ${String(index + 1).padStart(2, '0')} ${suffix}`,
        slug: `publication-${index + 1}-${suffix}`, excerpt: `Résumé éditorial ${index + 1}.`, type: 'analysis',
        content: richText, authors: [author.id], topics: [{ label: 'Actuariat' }],
        publishedAt: new Date(Date.now() - index * 60_000).toISOString(), featured: index === 0,
      })
      publicationSlugs.push(publication.slug)
      publicationIDs.push(publication.id)
    }
    const draftPublication = await create('publications', {
      title: `Brouillon publication ${suffix}`, slug: `draft-publication-${suffix}`, excerpt: 'Brouillon invisible.', type: 'article', content: richText,
    }, { draft: true })
    draftSlugs.push(draftPublication.slug)

    const reference = await create('references', {
      name: `Organisation nommée test ${suffix}`, slug: `named-reference-${suffix}`, type: 'client',
    })
    referenceName = reference.name
    referenceSlugs.push(reference.slug)
    for (let index = 0; index < 20; index++) {
      const listedReference = await create('references', {
        name: `Organisation référence ${String(index + 1).padStart(2, '0')} ${suffix}`,
        slug: `listed-reference-${index + 1}-${suffix}`, type: index % 2 ? 'partner' : 'institution',
        ...(index === 0 ? { website: 'https://example.org' } : {}),
      })
      referenceSlugs.push(listedReference.slug)
    }
    const draftReference = await create('references', {
      name: `Référence brouillon ${suffix}`, slug: `draft-reference-${suffix}`, type: 'client',
    }, { draft: true })
    referenceSlugs.push(draftReference.slug)
    const namedCase = await create('case-studies', {
      title: `Étude nommée ${suffix}`, slug: `named-case-${suffix}`, shortDescription: 'Étude avec organisation publiable.',
      clientDisclosure: 'named', clientReference: reference.id,
      context: richText, challenge: richText, approach: richText, results: richText, metrics: [],
    })
    namedCaseSlug = namedCase.slug
    const anonymousCase = await create('case-studies', {
      title: `Étude anonymisée ${suffix}`, slug: `anonymous-case-${suffix}`, shortDescription: 'Étude anonymisée sans indicateur.',
      clientDisclosure: 'anonymous', anonymousClientLabel: 'Compagnie d’assurance régionale',
      context: richText, challenge: richText, approach: richText, results: richText,
    })
    anonymousCaseSlug = anonymousCase.slug
    anonymousCaseID = anonymousCase.id

    const pdf = Buffer.from('%PDF-1.4\n% SIA route test fixture\n')
    const media = await create('media', { alt: `Fichier public temporaire ${suffix}` }, {
      file: { data: pdf, mimetype: 'application/pdf', name: `public-resource-${suffix}.pdf`, size: pdf.byteLength },
    })
    resourceFileURL = media.url as string
    const resource = await create('resources', {
      title: `Ressource publique ${suffix}`, slug: `public-resource-${suffix}`, type: 'report',
      shortDescription: 'Document public de test.', file: media.id,
    })
    resourceSlug = resource.slug
    resourceID = resource.id
    const draftResource = await create('resources', {
      title: `Brouillon ressource ${suffix}`, slug: `draft-resource-${suffix}`, type: 'note',
      shortDescription: 'Brouillon invisible.', file: media.id,
    }, { draft: true })
    const draftStudy = await create('case-studies', {
      title: `Brouillon étude ${suffix}`, slug: `draft-case-${suffix}`, shortDescription: 'Brouillon invisible.',
      clientDisclosure: 'anonymous', anonymousClientLabel: 'Organisation de test',
      context: richText, challenge: richText, approach: richText, results: richText,
    }, { draft: true })
    draftSlugs = [...draftSlugs, draftResource.slug, draftStudy.slug]
  })

  test.afterAll(async () => {
    test.setTimeout(180_000)
    for (const item of [...records].reverse()) {
      await payload.delete({ collection: item.collection as never, id: item.id, overrideAccess: true, context: { disableRevalidate: true } } as never).catch(() => undefined)
    }
  })

  test('editorial listings and details reflow across supported widths', async ({ page }) => {
    test.setTimeout(180_000)
    const routes = [
      { listing: '/publications', detail: `/publications/${publicationSlugs[0]}`, title: `Publication mise en avant ${suffix}` },
      { listing: '/etudes-de-cas', detail: `/etudes-de-cas/${anonymousCaseSlug}`, title: `Étude anonymisée ${suffix}` },
      { listing: '/ressources', detail: `/ressources/${resourceSlug}`, title: `Ressource publique ${suffix}` },
      { listing: '/equipe', detail: `/equipe/${authorSlug}`, title: `Auteur ${suffix}` },
    ]
    for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1600]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of routes) {
        await page.goto(route.listing)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.locator('main')).toContainText(route.title)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route.listing} overflows at ${width}px`).toBe(true)
        await page.goto(route.detail)
        await expect(page.getByRole('heading', { level: 1, name: route.title })).toBeVisible()
        await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route.detail} overflows at ${width}px`).toBe(true)
      }
      await page.goto('/references')
      await expect(page.getByRole('heading', { level: 1, name: 'Références' })).toBeVisible()
      await expect(page.locator('main')).toContainText(`Organisation référence 20 ${suffix}`)
      await expect(page.locator('main')).not.toContainText(`Référence brouillon ${suffix}`)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `/references overflows at ${width}px`).toBe(true)
    }
  })

  test('publication pagination, author filtering, and case-study client disclosure remain correct', async ({ page }) => {
    await page.goto('/publications')
    await expect(page.getByRole('heading', { name: `Publication mise en avant ${suffix}` })).toBeVisible()
    await expect(page.locator('main')).toContainText(`Auteur ${suffix}`)
    await expect(page.locator(`main a[href="/equipe/${authorSlug}"]`).first()).toBeVisible()
    await page.goto(`/equipe/${authorSlug}`)
    await expect(page.getByRole('heading', { level: 1, name: `Auteur ${suffix}` })).toBeVisible()
    await expect(page.locator('main')).toContainText('Auteur de test')
    await page.goto('/references')
    await expect(page.locator('main')).toContainText(referenceName)
    await expect(page.locator('main a[href^="/references/"]')).toHaveCount(0)
    await expect(page.locator('main a[href="https://example.org"]')).toHaveAttribute('rel', 'noopener noreferrer')
    for (const slug of referenceSlugs) expect((await page.locator('head link[rel="canonical"]').getAttribute('href'))).not.toContain(`/references/${slug}`)
    await page.goto('/publications?page=2')
    await expect(page.locator('main')).toContainText(`Publication 13 ${suffix}`)
    await expect(page.locator('main')).not.toContainText(`Brouillon publication ${suffix}`)

    await page.goto(`/etudes-de-cas/${anonymousCaseSlug}`)
    await expect(page.locator('main')).toContainText('Compagnie d’assurance régionale')
    await expect(page.locator('html')).not.toContainText(referenceName)
    const metadata = await page.locator('head').innerText().catch(() => '')
    const metaValues = await page.locator('head meta').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('content') || '').join(' '))
    expect(`${metadata} ${metaValues}`).not.toContain(referenceName)
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)

    await page.goto(`/etudes-de-cas/${namedCaseSlug}`)
    await expect(page.locator('main')).toContainText(referenceName)
    await page.goto('/etudes-de-cas')
    await expect(page.locator('main')).toContainText('Compagnie d’assurance régionale')
  })

  test('resources provide a public working download and drafts return 404', async ({ page, request }) => {
    await page.goto(`/ressources/${resourceSlug}`)
    const downloadLink = page.getByRole('link', { name: /Télécharger le document/ })
    await expect(downloadLink).toHaveAttribute('href', new RegExp(resourceFileURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    const fileResponse = await request.get(resourceFileURL)
    expect(fileResponse.ok()).toBe(true)
    for (const slug of draftSlugs) {
      const prefix = slug.startsWith('draft-publication') ? '/publications' : slug.startsWith('draft-resource') ? '/ressources' : '/etudes-de-cas'
      const response = await page.goto(`${prefix}/${slug}`)
      expect(response?.status()).toBe(404)
    }
  })

  test('sitemap lists public content and excludes drafts', async ({ request }) => {
    const response = await request.get('/pages-sitemap.xml')
    expect(response.ok()).toBe(true)
    const xml = await response.text()
    for (const route of ['/publications', '/etudes-de-cas', '/ressources', '/equipe', '/references', `/publications/${publicationSlugs[0]}`, `/etudes-de-cas/${anonymousCaseSlug}`, `/ressources/${resourceSlug}`, `/equipe/${authorSlug}`]) expect(xml).toContain(route)
    expect(xml).not.toContain('/references/')
    for (const slug of [...draftSlugs, draftTeamSlug, ...referenceSlugs.slice(-1)]) expect(xml).not.toContain(slug)
  })

  test('Payload preview is authorized for these collections and keeps drafts noindex', async ({ page }) => {
    test.skip(!process.env.PREVIEW_SECRET, 'PREVIEW_SECRET is not configured for this environment.')
    const user = await payload.create({
      collection: 'users', data: { email: `content-preview-${suffix}@example.test`, password: `E2eTest-${suffix}`, role: 'admin' }, overrideAccess: true,
    })
    const previewTargets = [
      { collection: 'publications', slug: draftSlugs[0], title: `Brouillon publication ${suffix}` },
      { collection: 'resources', slug: draftSlugs[1], title: `Brouillon ressource ${suffix}` },
      { collection: 'case-studies', slug: draftSlugs[2], title: `Brouillon étude ${suffix}` },
      { collection: 'team-members', slug: draftTeamSlug, title: `Profil brouillon ${suffix}` },
    ]
    const redirectIDs: number[] = []
    try {
      await login({ page, user: { email: user.email, password: `E2eTest-${suffix}` } })
      const redirectTargets = [
        { collection: 'publications', id: publicationIDs[0], from: `/publications/old-${suffix}`, path: `/publications/${publicationSlugs[0]}`, title: `Publication mise en avant ${suffix}` },
        { collection: 'case-studies', id: anonymousCaseID, from: `/etudes-de-cas/old-${suffix}`, path: `/etudes-de-cas/${anonymousCaseSlug}`, title: `Étude anonymisée ${suffix}` },
        { collection: 'resources', id: resourceID, from: `/ressources/old-${suffix}`, path: `/ressources/${resourceSlug}`, title: `Ressource publique ${suffix}` },
        { collection: 'team-members', id: records.find((record) => record.collection === 'team-members')!.id, from: `/equipe/old-${suffix}`, path: `/equipe/${authorSlug}`, title: `Auteur ${suffix}` },
      ] as const
      for (const target of redirectTargets) {
        const response = await page.request.post('/api/redirects', { data: { from: target.from, to: { type: 'reference', reference: { relationTo: target.collection, value: target.id } } } })
        expect(response.ok()).toBe(true)
        redirectIDs.push((await response.json()).doc.id)
        await expect.poll(async () => {
          await page.goto(target.from)
          return new URL(page.url()).pathname
        }, { timeout: 15_000, intervals: [500, 1_000, 2_000] }).toBe(target.path)
        await expect(page.getByRole('heading', { level: 1, name: target.title })).toBeVisible()
      }
      for (const target of previewTargets) {
        const collection = target.collection as PublicCollection
        const path = getCollectionDetailPath(collection, target.slug)!
        const query = new URLSearchParams({ path, previewSecret: process.env.PREVIEW_SECRET! })
        await page.goto(`/next/preview?${query.toString()}`)
        await expect(page.getByRole('heading', { level: 1, name: target.title })).toBeVisible()
        await expect(page.locator('head meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
      }
    } finally {
      for (const id of redirectIDs) await page.request.delete(`/api/redirects/${id}`).catch(() => undefined)
      await payload.delete({ collection: 'users', id: user.id, overrideAccess: true }).catch(() => undefined)
    }
  })
})
