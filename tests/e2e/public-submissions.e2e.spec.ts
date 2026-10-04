import { expect, test } from '@playwright/test'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import type { Service, Training } from '@/payload-types'
import { getCollectionDetailPath } from '@/utilities/publicRoutes'

const suffix = `public-form-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const email = (kind: string) => `${kind}-${suffix}@example.test`
const richText = {
  root: { type: 'root', children: [{ type: 'paragraph', children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Texte de test public.', type: 'text', version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 },
}

test.describe('public SIA request journeys', () => {
  let payload: Payload
  let service: Service
  let training: Training
  const requests: { collection: 'contact-requests' | 'service-requests' | 'training-requests'; id: number }[] = []

  test.beforeAll(async () => {
    test.setTimeout(300_000)
    payload = await getPayload({ config: await config })
    service = await payload.create({
      collection: 'services', data: { title: `Prestation ${suffix}`, slug: `request-${suffix}`, shortDescription: 'Expertise E2E', body: richText, _status: 'published' } as never,
      overrideAccess: true, context: { disableRevalidate: true },
    }) as Service
    training = await payload.create({
      collection: 'trainings', data: { title: `Formation ${suffix}`, slug: `training-${suffix}`, summary: 'Catalogue E2E', description: richText, _status: 'published' } as never,
      overrideAccess: true, context: { disableRevalidate: true },
    }) as Training
  })

  test.afterAll(async () => {
    if (!payload) return
    const requestKeys = new Set(requests.map(({ collection, id }) => `${collection}:${id}`))
    const jobs = await payload.find({ collection: 'payload-jobs', where: { taskSlug: { equals: 'notifySubmission' } }, limit: 1000, overrideAccess: true }).catch(() => null)
    for (const job of jobs?.docs ?? []) {
      const input = job.input as { requestCollection?: string; requestID?: number } | null
      if (input?.requestCollection && input.requestID && requestKeys.has(`${input.requestCollection}:${input.requestID}`)) {
        await payload.delete({ collection: 'payload-jobs', id: job.id, overrideAccess: true }).catch(() => undefined)
      }
    }
    for (const item of requests.reverse()) await payload.delete({ collection: item.collection, id: item.id, overrideAccess: true }).catch(() => undefined)
    if (service?.id) await payload.delete({ collection: 'services', id: service.id, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    if (training?.id) await payload.delete({ collection: 'trainings', id: training.id, overrideAccess: true, context: { disableRevalidate: true } }).catch(() => undefined)
    await payload.destroy()
  })

  test('contact form persists one request, reports success, and does not render submitted HTML', async ({ page }) => {
    test.setTimeout(90_000)
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible()
    await page.locator('input[name="name"]').fill('Prospect E2E')
    await page.getByLabel('Adresse e-mail').fill(email('contact'))
    await page.getByLabel('Objet').fill('Question & information')
    await page.getByLabel('Votre message').fill('<script>alert(1)</script> & demande')
    await page.waitForTimeout(3_100)
    await page.getByRole('button', { name: /Envoyer la demande/ }).click()
    await expect(page.getByRole('heading', { name: 'Demande reçue' })).toBeVisible({ timeout: 30_000 })
    const result = await payload.find({ collection: 'contact-requests', where: { email: { equals: email('contact') } }, limit: 2, overrideAccess: true })
    expect(result.totalDocs).toBe(1)
    expect(result.docs[0]).toMatchObject({ status: 'new', source: 'website', subject: 'Question & information', message: '<script>alert(1)</script> & demande' })
    requests.push({ collection: 'contact-requests', id: result.docs[0].id })
    await expect(page.locator('main script')).toHaveCount(0)
  })

  test('service CTA resolves the published service slug and stores only its verified relation', async ({ page }) => {
    test.setTimeout(90_000)
    const serviceURL = getCollectionDetailPath('services', service.slug!)
    await page.goto(serviceURL!)
    await page.getByRole('link', { name: /Décrire mon besoin/ }).click()
    await expect(page).toHaveURL(new RegExp(`/demande-de-service\\?service=${encodeURIComponent(service.slug!)}`))
    await expect(page.getByLabel('Expertise concernée')).toHaveValue(service.slug!)
    await page.locator('input[name="name"]').fill('Prospect prestation')
    await page.getByLabel('Adresse e-mail').fill(email('service'))
    await page.getByLabel('Organisation').fill('Organisation E2E')
    await page.getByLabel('Description du besoin').fill('Décrire un besoin professionnel.')
    await page.waitForTimeout(3_100)
    await page.getByRole('button', { name: /Envoyer la demande/ }).click()
    await expect(page.getByRole('heading', { name: 'Demande reçue' })).toBeVisible({ timeout: 30_000 })
    const result = await payload.find({ collection: 'service-requests', where: { email: { equals: email('service') } }, limit: 2, overrideAccess: true })
    expect(result.totalDocs).toBe(1)
    expect(result.docs[0]).toMatchObject({ service: { id: service.id }, organization: 'Organisation E2E', status: 'new', source: 'website' })
    requests.push({ collection: 'service-requests', id: result.docs[0].id })
  })

  test('training CTA preselects the catalogue item and the free-form route remains available', async ({ page }) => {
    test.setTimeout(90_000)
    const trainingURL = getCollectionDetailPath('trainings', training.slug!)
    await page.goto(trainingURL!)
    await page.getByRole('link', { name: /Demander cette formation/ }).click()
    await expect(page).toHaveURL(new RegExp(`/demande-de-formation\\?formation=${encodeURIComponent(training.slug!)}`))
    await expect(page.getByLabel('Formation du catalogue')).toHaveValue(training.slug!)
    await page.locator('input[name="name"]').fill('Prospect formation')
    await page.getByLabel('Adresse e-mail').fill(email('training'))
    await page.getByLabel('Organisation').fill('Organisation formation')
    await page.waitForTimeout(3_100)
    await page.getByRole('button', { name: /Envoyer la demande/ }).click()
    await expect(page.getByRole('heading', { name: 'Demande reçue' })).toBeVisible({ timeout: 30_000 })
    const result = await payload.find({ collection: 'training-requests', where: { email: { equals: email('training') } }, limit: 2, overrideAccess: true })
    expect(result.totalDocs).toBe(1)
    expect(result.docs[0]).toMatchObject({ training: { id: training.id }, status: 'new', source: 'website' })
    requests.push({ collection: 'training-requests', id: result.docs[0].id })

    await page.goto('/demande-de-formation')
    await expect(page.getByLabel('Formation du catalogue')).toHaveValue('')
    await expect(page.getByLabel('Besoin de formation spécifique')).toBeVisible()
  })
})
