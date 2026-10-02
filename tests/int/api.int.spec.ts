import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
const fixtureEmails = {
  admin: `access-admin-${suffix}@example.test`,
  editor: `access-editor-${suffix}@example.test`,
  commercial: `access-commercial-${suffix}@example.test`,
}
const userIDs: (string | number)[] = []
let publishedPageID: string | number
let draftPageID: string | number

describe('Payload role access control', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    for (const role of ['admin', 'editor', 'commercial'] as const) {
      const user = await payload.create({
        collection: 'users',
        data: { email: fixtureEmails[role], password: `test-${suffix}`, role },
        overrideAccess: true,
      })
      userIDs.push(user.id)
    }

    const published = await payload.create({
      collection: 'pages',
      data: { title: `Published access fixture ${suffix}`, slug: `access-published-${suffix}`, hero: { type: 'none' }, layout: [{ blockType: 'content', columns: [] }], _status: 'published' },
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    publishedPageID = published.id

    const draft = await payload.create({
      collection: 'pages',
      data: { title: `Draft access fixture ${suffix}`, slug: `access-draft-${suffix}`, hero: { type: 'none' }, layout: [{ blockType: 'content', columns: [] }], _status: 'draft' },
      draft: true,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    draftPageID = draft.id
  })

  afterAll(async () => {
    if (!payload) return
    if (publishedPageID !== undefined) {
      await payload.delete({ collection: 'pages', id: publishedPageID, overrideAccess: true, context: { disableRevalidate: true } })
    }
    if (draftPageID !== undefined) {
      await payload.delete({ collection: 'pages', id: draftPageID, overrideAccess: true, context: { disableRevalidate: true } })
    }
    for (const id of userIDs) {
      await payload.delete({ collection: 'users', id, overrideAccess: true })
    }
    await payload.destroy()
  })

  it('allows ADMIN and EDITOR to create and update editorial content', async () => {
    for (const role of ['admin', 'editor'] as const) {
      const user = await payload.find({
        collection: 'users',
        where: { email: { equals: fixtureEmails[role] } },
        overrideAccess: true,
      }).then(({ docs }) => docs[0])

      const page = await payload.create({
        collection: 'pages',
        data: { title: `${role} created ${suffix}`, slug: `${role}-created-${suffix}`, hero: { type: 'none' }, layout: [{ blockType: 'content', columns: [] }] },
        draft: false,
        user,
        overrideAccess: false,
        context: { disableRevalidate: true },
      })
      await expect(
        payload.update({
          collection: 'pages',
          id: page.id,
          data: { title: `${role} updated ${suffix}` },
          user,
          overrideAccess: false,
          context: { disableRevalidate: true },
        }),
      ).resolves.toMatchObject({ title: `${role} updated ${suffix}` })
      if (role === 'admin') {
        await expect(
          payload.delete({ collection: 'pages', id: page.id, user, overrideAccess: false, context: { disableRevalidate: true } }),
        ).resolves.toMatchObject({ id: page.id })
      } else {
        await expect(
          payload.delete({ collection: 'pages', id: page.id, user, overrideAccess: false, context: { disableRevalidate: true } }),
        ).rejects.toThrow()
        await payload.delete({ collection: 'pages', id: page.id, overrideAccess: true, context: { disableRevalidate: true } })
      }
    }
  })

  it('denies COMMERCIAL and anonymous editorial writes while retaining public published reads', async () => {
    const commercial = await payload.find({
      collection: 'users',
      where: { email: { equals: fixtureEmails.commercial } },
      overrideAccess: true,
    }).then(({ docs }) => docs[0])

    await expect(
      payload.update({
        collection: 'pages',
        id: publishedPageID,
        data: { title: 'Commercial edit denied' },
        user: commercial,
        overrideAccess: false,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
    await expect(
      payload.create({
        collection: 'pages',
        data: { title: 'Anonymous create denied', slug: `anonymous-${suffix}`, hero: { type: 'none' }, layout: [{ blockType: 'content', columns: [] }] },
        draft: false,
        overrideAccess: false,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
    await expect(
      payload.update({
        collection: 'pages',
        id: publishedPageID,
        data: { title: 'Anonymous edit denied' },
        overrideAccess: false,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
    await expect(
      payload.delete({ collection: 'pages', id: publishedPageID, overrideAccess: false }),
    ).rejects.toThrow()

    await expect(
      payload.findByID({ collection: 'pages', id: publishedPageID, overrideAccess: false }),
    ).resolves.toMatchObject({ id: publishedPageID })
    await expect(
      payload.findByID({ collection: 'pages', id: draftPageID, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('prevents EDITOR and COMMERCIAL from managing users or escalating roles', async () => {
    for (const role of ['editor', 'commercial'] as const) {
      const user = await payload.find({
        collection: 'users',
        where: { email: { equals: fixtureEmails[role] } },
        overrideAccess: true,
      }).then(({ docs }) => docs[0])
      const otherUserID = userIDs.find((id) => id !== user.id)!

      await expect(
        payload.create({
          collection: 'users',
          data: { email: `forbidden-${role}-${suffix}@example.test`, password: 'secret', role: 'admin' },
          user,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
      await expect(
        payload.delete({
          collection: 'users',
          id: otherUserID,
          user,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
      await expect(
        payload.update({
          collection: 'users',
          id: user.id,
          data: { role: 'admin' },
          user,
          overrideAccess: false,
        }),
      ).resolves.toMatchObject({ role })
      await expect(
        payload.update({
          collection: 'users',
          id: otherUserID,
          data: { role: 'admin' },
          user,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    }

    const editor = await payload.find({
      collection: 'users',
      where: { email: { equals: fixtureEmails.editor } },
      overrideAccess: true,
    }).then(({ docs }) => docs[0])
    const admin = await payload.find({
      collection: 'users',
      where: { email: { equals: fixtureEmails.admin } },
      overrideAccess: true,
    }).then(({ docs }) => docs[0])
    await expect(
      payload.findByID({ collection: 'users', id: editor.id, user: editor, overrideAccess: false }),
    ).resolves.toMatchObject({ id: editor.id })
    await expect(
      payload.findByID({ collection: 'users', id: admin.id, user: editor, overrideAccess: false }),
    ).rejects.toThrow()
  })
})
