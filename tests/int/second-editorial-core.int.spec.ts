import { getPayload, type Payload } from 'payload'
import type { User } from '@/payload-types'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const suffix = `second-core-${Date.now()}-${Math.random().toString(36).slice(2)}`
const richText = {
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Texte de test public.', version: 1 }],
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
const context = { disableRevalidate: true }

let payload: Payload
let editor: User
const records: { collection: string; id: number }[] = []

async function createDoc<C extends 'publications' | 'team-members' | 'references' | 'case-studies' | 'resources'>(
  collection: C,
  data: Record<string, unknown>,
  options: { draft?: boolean; user?: User; overrideAccess?: boolean } = {},
) {
  const doc = await payload.create({
    collection,
    data: { _status: options.draft ? 'draft' : 'published', ...data } as never,
    draft: options.draft,
    user: options.user,
    overrideAccess: options.overrideAccess ?? true,
    context,
  } as never)
  records.push({ collection, id: doc.id })
  return doc
}

const namedCaseFields = (clientReference: number, slug: string) => ({
  title: `Case ${slug}`,
  slug,
  shortDescription: 'Résumé de test',
  clientDisclosure: 'named',
  clientReference,
  context: richText,
  challenge: richText,
  approach: richText,
  results: richText,
})

describe('second SIA editorial core', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    editor = await payload.create({
      collection: 'users',
      data: { email: `${suffix}-editor@example.test`, password: `test-${suffix}`, role: 'editor' },
      overrideAccess: true,
    })
  })

  afterAll(async () => {
    if (!payload) return
    for (const record of [...records].reverse()) {
      await payload.delete({ collection: record.collection as never, id: record.id, overrideAccess: true, context } as never)
    }
    if (editor?.id) await payload.delete({ collection: 'users', id: editor.id, overrideAccess: true })
    await payload.destroy()
  })

  it('creates public and draft publications with optional team-member authors and unique slugs', async () => {
    const member = await createDoc('team-members', {
      name: 'Test Author', slug: `${suffix}-author`, jobTitle: 'Actuaire', shortBio: 'Biographie courte',
      services: [],
    })
    const draftMember = await createDoc('team-members', {
      name: 'Draft Author', slug: `${suffix}-draft-author`, jobTitle: 'Consultant', shortBio: 'Brouillon',
    }, { draft: true })
    const publication = await createDoc('publications', {
      title: 'Publication test', slug: `${suffix}-publication`, excerpt: 'Résumé de publication',
      type: 'analysis', content: richText, authors: [member.id],
    })
    const draft = await createDoc('publications', {
      title: 'Publication brouillon', slug: `${suffix}-publication-draft`, excerpt: 'Résumé brouillon',
      type: 'article', content: richText,
    }, { draft: true })

    await expect(payload.findByID({ collection: 'publications', id: publication.id, overrideAccess: false }))
      .resolves.toMatchObject({ _status: 'published', authors: [expect.objectContaining({ id: member.id })] })
    await expect(payload.findByID({ collection: 'publications', id: draft.id, overrideAccess: false })).rejects.toThrow()
    await expect(payload.findByID({ collection: 'team-members', id: draftMember.id, overrideAccess: false })).rejects.toThrow()
    await expect(createDoc('publications', {
      title: 'Duplicate', slug: `${suffix}-publication`, excerpt: 'Résumé', type: 'news', content: richText,
    })).rejects.toThrow()
    await expect(createDoc('publications', {
      title: 'Bad enum', slug: `${suffix}-bad-type`, excerpt: 'Résumé', type: 'blog', content: richText,
    })).rejects.toThrow()
  })

  it('requires a consistent, publishable client disclosure and hides real client data on anonymized cases', async () => {
    const reference = await createDoc('references', {
      name: 'Organisation confidentielle de test', slug: `${suffix}-reference`, type: 'client',
    })
    const draftReference = await createDoc('references', {
      name: 'Draft Reference', slug: `${suffix}-draft-reference`, type: 'client',
    }, { draft: true })
    const anonymous = await createDoc('case-studies', {
      title: 'Étude anonymisée', slug: `${suffix}-anonymous`, shortDescription: 'Résumé',
      clientDisclosure: 'anonymous', anonymousClientLabel: 'Compagnie régionale',
      context: richText, challenge: richText, approach: richText, results: richText,
    })
    const named = await createDoc('case-studies', namedCaseFields(reference.id, `${suffix}-named`))

    await expect(payload.findByID({ collection: 'case-studies', id: anonymous.id, overrideAccess: false }))
      .resolves.toMatchObject({ clientDisclosure: 'anonymous', anonymousClientLabel: 'Compagnie régionale', clientReference: null })
    await expect(payload.findByID({ collection: 'case-studies', id: named.id, overrideAccess: false }))
      .resolves.toMatchObject({ clientDisclosure: 'named', clientReference: expect.objectContaining({ id: reference.id }) })
    await expect(payload.findByID({ collection: 'references', id: draftReference.id, overrideAccess: false })).rejects.toThrow()
    await expect(createDoc('case-studies', namedCaseFields(draftReference.id, `${suffix}-unpublished-reference`))).rejects.toThrow()

    await expect(createDoc('case-studies', {
      ...namedCaseFields(reference.id, `${suffix}-contradictory-named`),
      clientDisclosure: 'anonymous', anonymousClientLabel: 'Compagnie régionale',
    })).rejects.toThrow()
    await expect(createDoc('case-studies', {
      ...namedCaseFields(reference.id, `${suffix}-missing-label`),
      clientDisclosure: 'anonymous', anonymousClientLabel: '', clientReference: null,
    })).rejects.toThrow()

    const draft = await createDoc('case-studies', {
      title: 'Étude brouillon', slug: `${suffix}-case-draft`, shortDescription: 'Résumé',
    }, { draft: true })
    await expect(payload.findByID({ collection: 'case-studies', id: draft.id, overrideAccess: false })).rejects.toThrow()
  })

  it('exposes inverse joins without duplicating author or named-reference relations', async () => {
    const member = await createDoc('team-members', {
      name: 'Join Author', slug: `${suffix}-join-author`, jobTitle: 'Consultant', shortBio: 'Résumé',
    })
    const reference = await createDoc('references', {
      name: 'Published Reference', slug: `${suffix}-join-reference`, type: 'partner',
    })
    const publication = await createDoc('publications', {
      title: 'Join Publication', slug: `${suffix}-join-publication`, excerpt: 'Résumé', type: 'article',
      content: richText, authors: [member.id],
    })
    const study = await createDoc('case-studies', namedCaseFields(reference.id, `${suffix}-join-case`))

    const authorWithJoin = await payload.findByID({ collection: 'team-members', id: member.id, depth: 1, overrideAccess: false })
    const referenceWithJoin = await payload.findByID({ collection: 'references', id: reference.id, depth: 1, overrideAccess: false })
    expect(authorWithJoin.publications?.docs?.map((doc) => typeof doc === 'number' ? doc : doc.id)).toContain(publication.id)
    expect(referenceWithJoin.caseStudies?.docs?.map((doc) => typeof doc === 'number' ? doc : doc.id)).toContain(study.id)
  })

  it('enforces editorial permissions for team members, references, and resources', async () => {
    const team = await createDoc('team-members', {
      name: 'Editable Member', slug: `${suffix}-editable-member`, jobTitle: 'Consultant', shortBio: 'Résumé',
    }, { user: editor, overrideAccess: false })
    await expect(payload.update({
      collection: 'team-members', id: team.id, data: { jobTitle: 'Senior consultant' },
      user: editor, overrideAccess: false, context,
    })).resolves.toMatchObject({ jobTitle: 'Senior consultant' })
    await expect(payload.create({
      collection: 'references', data: { name: 'Denied', slug: `${suffix}-denied`, type: 'client' },
      user: { ...editor, role: 'commercial' }, overrideAccess: false, context,
    })).rejects.toThrow()

    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Fichier public de test' },
      file: {
        data: Buffer.from('test document file'),
        mimetype: 'application/pdf',
        name: `${suffix}.pdf`,
        size: Buffer.byteLength('test document file'),
      },
      overrideAccess: true,
    })
    records.push({ collection: 'media', id: media.id })
    const resource = await createDoc('resources', {
      title: 'Ressource test', slug: `${suffix}-resource`, type: 'report',
      shortDescription: 'Document public', file: media.id,
    })
    await expect(payload.findByID({ collection: 'resources', id: resource.id, overrideAccess: false }))
      .resolves.toMatchObject({ _status: 'published', file: expect.anything() })
    await expect(payload.create({
      collection: 'resources',
      data: { title: 'Brouillon invalide', slug: `${suffix}-resource-invalid`, type: 'report', shortDescription: 'No file' } as never,
      draft: false,
      overrideAccess: true,
      context,
    })).rejects.toThrow()
  })

  it('runs Payload scheduled publishing on a new collection and triggers shared revalidation', async () => {
    const previousSecret = process.env.REVALIDATION_SECRET
    const previousServerURL = process.env.NEXT_PUBLIC_SERVER_URL
    process.env.REVALIDATION_SECRET = `integration-${suffix}`
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3100'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    try {
      const draft = await createDoc('publications', {
        title: 'Scheduled publication', slug: `${suffix}-scheduled`, excerpt: 'Scheduled summary',
        type: 'technical_note', content: richText,
      }, { draft: true })
      const dueAt = new Date('2020-01-01T00:00:00.000Z')
      const job = await payload.jobs.queue({
        task: 'schedulePublish',
        queue: 'default',
        waitUntil: dueAt,
        input: {
          type: 'publish',
          doc: { relationTo: 'publications', value: draft.id },
          user: { relationTo: 'users', value: editor.id },
        },
      })
      await expect(payload.findByID({ collection: 'payload-jobs', id: job.id, overrideAccess: true }))
        .resolves.toMatchObject({ taskSlug: 'schedulePublish', queue: 'default', waitUntil: dueAt.toISOString() })

      const result = await payload.jobs.run({ queue: 'default', limit: 10, overrideAccess: true })
      expect(result.jobStatus?.[String(job.id)]).toEqual({ status: 'success' })
      await expect(payload.findByID({ collection: 'publications', id: draft.id, overrideAccess: false }))
        .resolves.toMatchObject({ _status: 'published' })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [revalidationURL, revalidationOptions] = fetchMock.mock.calls[0]
      expect(String(revalidationURL)).toBe('http://localhost:3100/api/internal/revalidate')
      expect(revalidationOptions).toMatchObject({
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.REVALIDATION_SECRET}`, 'content-type': 'application/json' },
        body: JSON.stringify({ collection: 'publications', slugs: [`${suffix}-scheduled`, null] }),
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
