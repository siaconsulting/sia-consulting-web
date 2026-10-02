import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import type { User } from '@/payload-types'
import config from '@/payload.config'
import { createSubmissionService } from '@/services/submissions'
import { createSubmissionFormToken } from '@/services/submissions/protection'
import { sendSubmissionNotification } from '@/jobs/notifySubmission'

const suffix = `requests-${Date.now()}-${Math.random().toString(36).slice(2)}`
const testSecret = `test-secret-${suffix}`
const frozenNow = new Date('2026-10-01T12:00:00.000Z')
const richText = {
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Service de test', version: 1 }],
      direction: null, format: '', indent: 0, version: 1,
    }],
    direction: null, format: '', indent: 0, version: 1,
  },
}

let payload: Payload
let admin: User
let editor: User
let commercial: User
let serviceID: number
const createdRequests: { collection: 'contact-requests' | 'service-requests' | 'training-requests'; id: number }[] = []
const createdJobs: number[] = []

const createRequestService = () => createSubmissionService({
  payload,
  tokenSecret: testSecret,
  now: () => frozenNow,
  rateLimiter: { consume: async () => true },
})

const envelope = (kind: 'contact' | 'service' | 'training', fields: Record<string, unknown>, key: string) => ({
  fields,
  antiSpam: { website: '', token: createSubmissionFormToken(kind, frozenNow.getTime() - 5_000, testSecret) },
  idempotencyKey: `00000000-0000-4000-8000-${key.padStart(12, '0')}`,
  trustedClientKey: `integration-${suffix}`,
})

describe('SIA incoming request collections and submission service', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const userPrefix = `${suffix}@example.test`
    admin = await payload.create({
      collection: 'users', data: { email: `admin-${userPrefix}`, password: suffix, role: 'admin' }, overrideAccess: true,
    })
    editor = await payload.create({
      collection: 'users', data: { email: `editor-${userPrefix}`, password: suffix, role: 'editor' }, overrideAccess: true,
    })
    commercial = await payload.create({
      collection: 'users', data: { email: `commercial-${userPrefix}`, password: suffix, role: 'commercial' }, overrideAccess: true,
    })
    const service = await payload.create({
      collection: 'services',
      data: {
        title: `Request test ${suffix}`, slug: `request-test-${suffix}`, shortDescription: 'Test',
        body: richText, _status: 'published',
      } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    serviceID = service.id
  }, 90_000)

  afterAll(async () => {
    if (!payload) return
    const requestIDs = new Set(createdRequests.map(({ collection, id }) => `${collection}:${id}`))
    const queued = await payload.find({
      collection: 'payload-jobs', where: { taskSlug: { equals: 'notifySubmission' } },
      overrideAccess: true, limit: 1000,
    }).catch(() => null)
    for (const job of queued?.docs ?? []) {
      const input = job.input as { requestCollection?: string; requestID?: number } | null
      if (input?.requestCollection && input.requestID && requestIDs.has(`${input.requestCollection}:${input.requestID}`)) {
        createdJobs.push(job.id)
      }
    }
    for (const jobID of createdJobs) {
      await payload.delete({ collection: 'payload-jobs', id: jobID, overrideAccess: true }).catch(() => undefined)
    }
    for (const record of createdRequests.reverse()) {
      await payload.delete({ collection: record.collection, id: record.id, overrideAccess: true }).catch(() => undefined)
    }
    if (serviceID) await payload.delete({ collection: 'services', id: serviceID, overrideAccess: true, context: { disableRevalidate: true } })
    for (const user of [admin, editor, commercial]) {
      if (user?.id) await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
    }
    await payload.destroy()
  })

  it('keeps CRUD private while allowing commercial workflow-only updates', async () => {
    const request = await payload.create({
      collection: 'contact-requests',
      data: {
        name: 'Test prospect', email: `${suffix}-access@example.test`, subject: 'Question', message: 'Message',
        status: 'new', source: 'admin', submittedAt: frozenNow.toISOString(),
      },
      user: admin, overrideAccess: false, draft: false,
    })
    createdRequests.push({ collection: 'contact-requests', id: request.id })

    await expect(payload.find({ collection: 'contact-requests', overrideAccess: false })).rejects.toThrow()
    await expect(payload.find({ collection: 'contact-requests', user: editor, overrideAccess: false })).rejects.toThrow()
    await expect(payload.update({
      collection: 'contact-requests', id: request.id, overrideAccess: false, draft: false,
      data: { status: 'converted' },
    })).rejects.toThrow()
    await expect(payload.delete({ collection: 'contact-requests', id: request.id, overrideAccess: false })).rejects.toThrow()
    await expect(payload.create({
      collection: 'contact-requests',
      data: {
        name: 'Anonymous', email: 'anonymous@example.test', subject: 'x', message: 'y',
        status: 'new', source: 'admin', submittedAt: frozenNow.toISOString(),
      },
      overrideAccess: false, draft: false,
    })).rejects.toThrow()
    await expect(payload.find({ collection: 'contact-requests', user: commercial, overrideAccess: false }))
      .resolves.toMatchObject({ docs: [expect.objectContaining({ id: request.id })] })
    await expect(payload.update({
      collection: 'contact-requests', id: request.id, user: commercial, overrideAccess: false,
      data: { status: 'in_progress', internalNotes: 'Rappel prévu', assignedTo: commercial.id },
    })).resolves.toMatchObject({ status: 'in_progress', internalNotes: 'Rappel prévu' })
    await expect(payload.update({
      collection: 'contact-requests', id: request.id, user: commercial, overrideAccess: false,
      data: { email: 'rewritten@example.test' },
    })).resolves.toMatchObject({ email: `${suffix}-access@example.test` })
    await expect(payload.update({
      collection: 'contact-requests', id: request.id, user: commercial, overrideAccess: false,
      data: { assignedTo: editor.id },
    })).rejects.toThrow()
    await expect(payload.delete({ collection: 'contact-requests', id: request.id, user: commercial, overrideAccess: false })).rejects.toThrow()
    await expect(payload.delete({ collection: 'contact-requests', id: request.id, user: admin, overrideAccess: false }))
      .resolves.toMatchObject({ id: request.id })
  })

  it('validates and persists contact submissions with server-owned workflow fields', async () => {
    const requests = createRequestService()
    const input = envelope('contact', {
      name: '  Prospect Test  ', email: 'PROSPECT@example.test', subject: 'Question', message: 'Besoin de contact',
      source: 'integration', status: 'converted', assignedTo: editor.id, internalNotes: 'injected',
      notificationStatus: 'sent',
    }, '1')
    await expect(requests.submitContactRequest(input)).resolves.toEqual({ success: true })
    const docs = await payload.find({
      collection: 'contact-requests', where: { email: { equals: 'prospect@example.test' } },
      overrideAccess: true, limit: 10,
    })
    const created = docs.docs.find((doc) => doc.name === 'Prospect Test')
    expect(created).toMatchObject({ source: 'website', status: 'new', notificationStatus: 'pending', assignedTo: null, internalNotes: null })
    expect(created?.submittedAt).toBe(frozenNow.toISOString())
    createdRequests.push({ collection: 'contact-requests', id: created!.id })

    const previousRecipient = process.env.SUBMISSION_NOTIFICATION_TO
    process.env.SUBMISSION_NOTIFICATION_TO = 'internal-test@example.test'
    try {
      await expect(sendSubmissionNotification(payload, 'contact-requests', created!.id)).rejects.toThrow()
      await expect(payload.findByID({ collection: 'contact-requests', id: created!.id, overrideAccess: true }))
        .resolves.toMatchObject({ notificationStatus: 'pending' })
    } finally {
      if (previousRecipient === undefined) delete process.env.SUBMISSION_NOTIFICATION_TO
      else process.env.SUBMISSION_NOTIFICATION_TO = previousRecipient
    }

    const firstJob = await payload.find({
      collection: 'payload-jobs', where: { taskSlug: { equals: 'notifySubmission' } },
      overrideAccess: true, limit: 100,
    })
    const matchingJob = firstJob.docs.find((job) => JSON.stringify(job.input).includes(String(created!.id)))
    expect(matchingJob).toBeDefined()
    if (matchingJob) createdJobs.push(matchingJob.id)

    await expect(requests.submitContactRequest(input)).resolves.toEqual({ success: true })
    const afterRetry = await payload.find({
      collection: 'contact-requests', where: { idempotencyKey: { equals: input.idempotencyKey } },
      overrideAccess: true,
    })
    expect(afterRetry.totalDocs).toBe(1)

    await expect(requests.submitContactRequest(envelope('contact', {
      name: 'Invalid', email: 'not-an-email', subject: 'x', message: 'y',
    }, '2'))).resolves.toEqual({ success: false, reason: 'invalid' })
    const invalidToken = envelope('contact', {
      name: 'Trap', email: 'trap@example.test', subject: 'x', message: 'y',
    }, '3')
    invalidToken.antiSpam = { website: '', token: 'invalid' }
    await expect(requests.submitContactRequest(invalidToken)).resolves.toEqual({ success: false, reason: 'invalid' })
  })

  it('creates valid service and training requests and rejects invalid references or empty training needs', async () => {
    const requests = createRequestService()
    const serviceResult = await requests.submitServiceRequest(envelope('service', {
      name: 'Service Prospect', email: 'service@example.test', organization: 'Org', service: serviceID,
      need: 'Accompagnement demandé', budget: '',
    }, '4'))
    expect(serviceResult).toEqual({ success: true })

    const trainingResult = await requests.submitTrainingRequest(envelope('training', {
      name: 'Training Prospect', email: 'training@example.test', organization: 'Org',
      customTrainingNeed: 'Formation sur mesure', participantCount: '12', preferredFormat: 'hybrid',
    }, '5'))
    expect(trainingResult).toEqual({ success: true })

    await expect(requests.submitServiceRequest(envelope('service', {
      name: 'Bad service', email: 'bad-service@example.test', organization: 'Org', service: 99999999, need: 'Besoin',
    }, '6'))).resolves.toEqual({ success: false, reason: 'invalid' })
    await expect(requests.submitTrainingRequest(envelope('training', {
      name: 'Empty training', email: 'empty-training@example.test', organization: 'Org',
    }, '7'))).resolves.toEqual({ success: false, reason: 'invalid' })
    await expect(requests.submitTrainingRequest(envelope('training', {
      name: 'Missing training', email: 'missing-training@example.test', organization: 'Org', training: 99999999,
    }, '10'))).resolves.toEqual({ success: false, reason: 'invalid' })

    for (const [collection, address] of [
      ['service-requests', 'service@example.test'], ['training-requests', 'training@example.test'],
    ] as const) {
      const result = await payload.find({ collection, where: { email: { equals: address } }, overrideAccess: true })
      expect(result.totalDocs).toBe(1)
      createdRequests.push({ collection, id: result.docs[0].id })
    }
  })

  it('silently accepts honeypots without persistence and fails closed without shared rate limiting', async () => {
    const requests = createRequestService()
    const trapped = envelope('contact', {
      name: 'Bot', email: 'bot@example.test', subject: 'x', message: 'y',
    }, '8')
    trapped.antiSpam = { website: 'filled-by-bot', token: '' }
    await expect(requests.submitContactRequest(trapped)).resolves.toEqual({ success: true })

    const noLimiter = createSubmissionService({
      payload, tokenSecret: testSecret, now: () => frozenNow,
      rateLimiter: { consume: async () => { throw new Error('No shared store') } },
    })
    await expect(noLimiter.submitContactRequest(envelope('contact', {
      name: 'Rate limited', email: 'rate@example.test', subject: 'x', message: 'y',
    }, '9'))).resolves.toEqual({ success: false, reason: 'temporarily_unavailable' })
    const trappedRecord = await payload.find({ collection: 'contact-requests', where: { email: { equals: 'bot@example.test' } }, overrideAccess: true })
    expect(trappedRecord.totalDocs).toBe(0)
  })
})
