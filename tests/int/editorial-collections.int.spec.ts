import { getPayload, type Payload } from 'payload'
import type { Service, User } from '@/payload-types'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

type EditorialCollection = 'services' | 'sectors' | 'trainings'
type FixtureRecord = { id: number; slug: string }

const collections: EditorialCollection[] = ['services', 'sectors', 'trainings']
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
const fixturePrefix = `editorial-test-${suffix}`
const emails = {
  admin: `${fixturePrefix}-admin@example.test`,
  editor: `${fixturePrefix}-editor@example.test`,
  commercial: `${fixturePrefix}-commercial@example.test`,
}
const richText: Service['body'] = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Contenu de test', version: 1 },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}

let payload: Payload
const users: Record<'admin' | 'editor' | 'commercial', User> = {} as Record<
  'admin' | 'editor' | 'commercial',
  User
>
const fixtures: Record<EditorialCollection, { published?: FixtureRecord; draft?: FixtureRecord }> = {
  services: {},
  sectors: {},
  trainings: {},
}
const created: { collection: EditorialCollection; id: number }[] = []

async function createEditorialDoc(
  collection: EditorialCollection,
  slug: string,
  options: {
    user?: User
    overrideAccess?: boolean
    draft?: boolean
    sectors?: number[]
    services?: number[]
    code?: string
  } = {},
) {
  const { user, overrideAccess = true, draft = false, sectors, services, code } = options
  const context = { disableRevalidate: true }
  const common = {
    title: `${collection} ${slug}`,
    slug,
    _status: draft ? ('draft' as const) : ('published' as const),
  }

  switch (collection) {
    case 'services':
      return payload.create({
        collection,
        data: {
          ...common,
          shortDescription: 'Résumé de test',
          body: richText,
          sectors,
        },
        draft,
        user,
        overrideAccess,
        context,
      })
    case 'sectors':
      return payload.create({
        collection,
        data: { ...common, shortDescription: 'Résumé de test', body: richText },
        draft,
        user,
        overrideAccess,
        context,
      })
    case 'trainings':
      return payload.create({
        collection,
        data: { ...common, code, summary: 'Résumé de test', description: richText, services, sectors },
        draft,
        user,
        overrideAccess,
        context,
      })
  }
}

async function findEditorialDoc(collection: EditorialCollection, id: number) {
  switch (collection) {
    case 'services':
      return payload.findByID({ collection, id, overrideAccess: false })
    case 'sectors':
      return payload.findByID({ collection, id, overrideAccess: false })
    case 'trainings':
      return payload.findByID({ collection, id, overrideAccess: false })
  }
}

async function updateEditorialDoc(collection: EditorialCollection, id: number, user: User) {
  const data = { title: `Updated by ${user.role} ${suffix}` }
  const options = { id, data, user, overrideAccess: false, context: { disableRevalidate: true } }
  switch (collection) {
    case 'services':
      return payload.update({ collection, ...options })
    case 'sectors':
      return payload.update({ collection, ...options })
    case 'trainings':
      return payload.update({ collection, ...options })
  }
}

async function deleteEditorialDoc(collection: EditorialCollection, id: number, user: User) {
  const options = { collection, id, user, overrideAccess: false, context: { disableRevalidate: true } }
  switch (collection) {
    case 'services':
      return payload.delete(options)
    case 'sectors':
      return payload.delete(options)
    case 'trainings':
      return payload.delete(options)
  }
}

describe('SIA editorial collections', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })

    for (const role of ['admin', 'editor', 'commercial'] as const) {
      users[role] = await payload.create({
        collection: 'users',
        data: { email: emails[role], password: `test-${suffix}`, role },
        overrideAccess: true,
      })
    }

    for (const collection of collections) {
      fixtures[collection].published = await createEditorialDoc(
        collection,
        `${fixturePrefix}-${collection}-published`,
        { draft: false },
      )
      fixtures[collection].draft = await createEditorialDoc(
        collection,
        `${fixturePrefix}-${collection}-draft`,
        { draft: true },
      )
    }
  })

  afterAll(async () => {
    if (!payload) return
    for (const collection of collections) {
      for (const fixture of Object.values(fixtures[collection])) {
        if (fixture) {
          await payload.delete({ collection, id: fixture.id, overrideAccess: true, context: { disableRevalidate: true } })
        }
      }
    }
    for (const item of created) {
      await payload.delete({
        collection: item.collection,
        id: item.id,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
    for (const user of Object.values(users)) {
      if (user?.id) await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
    }
    await payload.destroy()
  })

  it('applies the same editorial write and delete policy to all three collections', async () => {
    for (const collection of collections) {
      const slug = `${fixturePrefix}-${collection}-created`
      const adminDoc = await createEditorialDoc(collection, `${slug}-admin`, {
        user: users.admin,
        overrideAccess: false,
      })
      created.push({ collection, id: adminDoc.id })

      const editorDoc = await createEditorialDoc(collection, `${slug}-editor`, {
        user: users.editor,
        overrideAccess: false,
      })
      created.push({ collection, id: editorDoc.id })
      await expect(updateEditorialDoc(collection, editorDoc.id, users.editor)).resolves.toMatchObject({
        title: `Updated by editor ${suffix}`,
      })

      await expect(deleteEditorialDoc(collection, editorDoc.id, users.editor)).rejects.toThrow()
      await expect(deleteEditorialDoc(collection, adminDoc.id, users.admin)).resolves.toMatchObject({
        id: adminDoc.id,
      })
      created.splice(created.findIndex((item) => item.id === adminDoc.id), 1)

      await expect(
        createEditorialDoc(collection, `${slug}-commercial`, {
          user: users.commercial,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
      await expect(updateEditorialDoc(collection, editorDoc.id, users.commercial)).rejects.toThrow()
    }
  })

  it('serves published records publicly and withholds drafts', async () => {
    for (const collection of collections) {
      await expect(findEditorialDoc(collection, fixtures[collection].published!.id)).resolves.toMatchObject({
        _status: 'published',
      })
      await expect(findEditorialDoc(collection, fixtures[collection].draft!.id)).rejects.toThrow()
    }
  })

  it('enforces unique, URL-safe slugs and required editorial content', async () => {
    for (const collection of collections) {
      const original = fixtures[collection].published!
      await expect(createEditorialDoc(collection, original.slug)).rejects.toThrow()

      await expect(createEditorialDoc(collection, `${fixturePrefix}-Invalid Slug`)).rejects.toThrow()
    }

    const incompleteDraft = await payload.create({
      collection: 'services',
      data: { title: 'Missing required content', slug: `${fixturePrefix}-missing`, _status: 'draft' },
      draft: true,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    created.push({ collection: 'services', id: incompleteDraft.id })
    await expect(
      payload.update({
        collection: 'services',
        id: incompleteDraft.id,
        data: { _status: 'published' },
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
  })

  it('keeps the service-sector relationship in one place and supports training associations', async () => {
    const sector = fixtures.sectors.published!
    const service = await createEditorialDoc('services', `${fixturePrefix}-related-service`, {
      sectors: [sector.id],
    })
    created.push({ collection: 'services', id: service.id })

    const training = await createEditorialDoc('trainings', `${fixturePrefix}-related-training`, {
      services: [service.id],
      sectors: [sector.id],
    })
    created.push({ collection: 'trainings', id: training.id })

    const savedService = await payload.findByID({
      collection: 'services',
      id: service.id,
      depth: 0,
      overrideAccess: true,
    })
    const savedTraining = await payload.findByID({
      collection: 'trainings',
      id: training.id,
      depth: 0,
      overrideAccess: true,
    })
    expect(savedService.sectors).toContain(sector.id)
    expect(savedTraining.services).toContain(service.id)
    expect(savedTraining.sectors).toContain(sector.id)
  })

  it('runs a due Payload scheduled publish and requests Next.js revalidation', async () => {
    const previousSecret = process.env.REVALIDATION_SECRET
    const previousServerURL = process.env.NEXT_PUBLIC_SERVER_URL
    process.env.REVALIDATION_SECRET = `integration-${suffix}`
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3100'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    try {
      const draft = await createEditorialDoc('services', `${fixturePrefix}-scheduled`, { draft: true })
      created.push({ collection: 'services', id: draft.id })

      // A fixed past instant makes the job due immediately without a wall-clock wait.
      const dueAt = new Date('2020-01-01T00:00:00.000Z')
      const scheduledJob = await payload.jobs.queue({
        task: 'schedulePublish',
        queue: 'default',
        waitUntil: dueAt,
        input: {
          type: 'publish',
          doc: { relationTo: 'services', value: draft.id },
          user: { relationTo: 'users', value: users.editor.id },
        },
      })
      const queuedJob = await payload.findByID({
        collection: 'payload-jobs',
        id: scheduledJob.id,
        overrideAccess: true,
      })
      expect(queuedJob).toMatchObject({
        taskSlug: 'schedulePublish',
        queue: 'default',
        waitUntil: dueAt.toISOString(),
      })

      const runResult = await payload.jobs.run({ queue: 'default', limit: 10, overrideAccess: true })
      expect(runResult.jobStatus?.[String(scheduledJob.id)]).toEqual({ status: 'success' })

      const published = await payload.findByID({
        collection: 'services',
        id: draft.id,
        overrideAccess: false,
      })
      expect(published._status).toBe('published')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [revalidationURL, revalidationOptions] = fetchMock.mock.calls[0]
      expect(String(revalidationURL)).toBe('http://localhost:3100/api/internal/revalidate')
      expect(revalidationOptions).toMatchObject({
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.REVALIDATION_SECRET}` },
        body: JSON.stringify({ collection: 'services', slugs: [`${fixturePrefix}-scheduled`, null] }),
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
