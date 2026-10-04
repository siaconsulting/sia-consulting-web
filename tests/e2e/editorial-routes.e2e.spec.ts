import { expect, test } from '@playwright/test'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import type { Service } from '@/payload-types'
import { login } from '../helpers/login'

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const body: Service['body'] = {
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Contenu temporaire de validation.', type: 'text', version: 1 }],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}

test.describe('Editorial production routes', () => {
  let payload: Payload
  let service: Service
  let sectorID: number
  let trainingID: number
  let draftServiceID: number

  test.beforeAll(async () => {
    test.setTimeout(180_000)
    payload = await getPayload({ config: await config })
    const context = { disableRevalidate: true }
    const sector = await payload.create({
      collection: 'sectors',
      data: { title: `Secteur E2E ${suffix}`, slug: `e2e-sector-${suffix}`, shortDescription: 'Résumé de test.', body, _status: 'published' },
      overrideAccess: true,
      context,
    })
    sectorID = sector.id
    service = await payload.create({
      collection: 'services',
      data: { title: `Expertise E2E ${suffix}`, slug: `e2e-service-${suffix}`, shortDescription: 'Résumé de test.', body, sectors: [sector.id], _status: 'published' },
      overrideAccess: true,
      context,
    })
    const training = await payload.create({
      collection: 'trainings',
      data: { title: `Formation E2E ${suffix}`, slug: `e2e-training-${suffix}`, summary: 'Résumé de test.', description: body, services: [service.id], sectors: [sector.id], _status: 'published' },
      overrideAccess: true,
      context,
    })
    trainingID = training.id
    const draft = await payload.create({
      collection: 'services',
      data: { title: `Brouillon E2E ${suffix}`, slug: `e2e-draft-${suffix}`, shortDescription: 'Ne doit pas être public.', body, _status: 'draft' },
      draft: true,
      overrideAccess: true,
      context,
    })
    draftServiceID = draft.id
  })

  test.afterAll(async () => {
    test.setTimeout(180_000)
    if (!payload) return
    if (trainingID) await payload.delete({ collection: 'trainings', id: trainingID, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    if (service?.id) await payload.delete({ collection: 'services', id: service.id, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    if (draftServiceID) await payload.delete({ collection: 'services', id: draftServiceID, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    if (sectorID) await payload.delete({ collection: 'sectors', id: sectorID, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    await payload.destroy()
  })

  test('published listings and all three details render and reflow across supported widths', async ({ page }) => {
    test.setTimeout(180_000)
    const pages = [
      { listing: '/expertises', detail: `/expertises/${service.slug}`, title: service.title },
      { listing: '/secteurs', detail: `/secteurs/e2e-sector-${suffix}`, title: `Secteur E2E ${suffix}` },
      { listing: '/formations', detail: `/formations/e2e-training-${suffix}`, title: `Formation E2E ${suffix}` },
    ]

    for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1600]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of pages) {
        await page.goto(route.listing)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.locator('main')).toContainText(route.title)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow in ${route.listing} at ${width}px`).toBe(true)

        await page.goto(route.detail)
        await expect(page.getByRole('heading', { level: 1, name: route.title })).toBeVisible()
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow in ${route.detail} at ${width}px`).toBe(true)
      }
    }
  })

  test('drafts remain hidden, while service relationships resolve to published detail routes', async ({ page }) => {
    await page.goto('/expertises')
    await expect(page.locator('main')).toContainText(service.title)
    await expect(page.locator('main')).not.toContainText(`Brouillon E2E ${suffix}`)

    const response = await page.goto(`/expertises/${`e2e-draft-${suffix}`}`)
    expect(response?.status()).toBe(404)

    await page.goto(`/secteurs/e2e-sector-${suffix}`)
    await expect(page.getByRole('link', { name: new RegExp(service.title) })).toHaveAttribute('href', `/expertises/${service.slug}`)
    await page.goto(`/formations/e2e-training-${suffix}`)
    await expect(page.getByRole('link', { name: new RegExp(service.title) })).toHaveAttribute('href', `/expertises/${service.slug}`)

    for (const path of ['/expertises/slug-inexistant-e2e', '/secteurs/slug-inexistant-e2e', '/formations/slug-inexistant-e2e']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(404)
    }
  })

  test('sitemap contains catalog listings and published details, but no drafts', async ({ request }) => {
    const response = await request.get('/pages-sitemap.xml')
    expect(response.ok()).toBe(true)
    const xml = await response.text()
    for (const path of ['/expertises', '/secteurs', '/formations']) {
      expect(xml).toContain(path)
    }
    expect(xml).not.toContain(`e2e-draft-${suffix}`)
  })

  test('redirects an obsolete detail URL to the centralized public route', async ({ page }) => {
    let redirectID: number | undefined
    const redirectUser = await payload.create({
      collection: 'users',
      data: { email: `e2e-preview-${suffix}@example.test`, password: `E2eTest-${suffix}`, role: 'admin' },
      overrideAccess: true,
    })
    try {
      await login({ page, user: { email: redirectUser.email, password: `E2eTest-${suffix}` } })
      const response = await page.request.post('/api/redirects', {
        data: {
          from: `/expertises/ancienne-${suffix}`,
          to: { type: 'reference', reference: { relationTo: 'services', value: service.id } },
        },
      })
      expect(response.ok()).toBe(true)
      redirectID = (await response.json()).doc.id
      await expect.poll(async () => {
        await page.goto(`/expertises/ancienne-${suffix}`)
        return new URL(page.url()).pathname
      }, { timeout: 15_000, intervals: [500, 1_000, 2_000] }).toBe(`/expertises/${service.slug}`)
      await expect(page.getByRole('heading', { level: 1, name: service.title })).toBeVisible()
    } finally {
      if (redirectID) await page.request.delete(`/api/redirects/${redirectID}`).catch(() => undefined)
      await payload.delete({ collection: 'users', id: redirectUser.id, overrideAccess: true }).catch(() => undefined)
    }
  })

  test('authorized Payload preview can render a draft while anonymous preview is denied', async ({ page }) => {
    test.skip(!process.env.PREVIEW_SECRET, 'PREVIEW_SECRET is not configured for this environment.')
    const path = `/expertises/e2e-draft-${suffix}`
    const query = new URLSearchParams({ path, previewSecret: process.env.PREVIEW_SECRET! })
    const anonymous = await page.request.get(`/next/preview?${query.toString()}`)
    expect(anonymous.status()).toBe(403)

    const previewUser = await payload.create({
      collection: 'users',
      data: { email: `e2e-preview-${suffix}@example.test`, password: `E2eTest-${suffix}`, role: 'admin' },
      overrideAccess: true,
    })
    try {
      await login({ page, user: { email: previewUser.email, password: `E2eTest-${suffix}` } })
      await page.goto(`/next/preview?${query.toString()}`)
      await expect(page).toHaveURL(new RegExp(`${path.replaceAll('/', '\\/')}$`))
      await expect(page.getByRole('heading', { level: 1, name: `Brouillon E2E ${suffix}` })).toBeVisible()
      await expect(page.locator('head meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
    } finally {
      await payload.delete({ collection: 'users', id: previewUser.id, overrideAccess: true }).catch(() => undefined)
    }
  })
})
