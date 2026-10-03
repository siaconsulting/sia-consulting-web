import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload, type SendEmailOptions } from 'payload'
import type { User } from '@/payload-types'
import config from '@/payload.config'
import { createSubmissionService } from '@/services/submissions'
import { createSubmissionFormToken } from '@/services/submissions/protection'
import { sendSubmissionNotification } from '@/jobs/notifySubmission'
import { notifySubmissionTask } from '@/jobs/notifySubmission'
import { createSubmissionRequestContext } from '@/services/submissions/requestContext'
import { hashSubmissionIdempotencyKey } from '@/services/submissions/requestContext'

const suffix = `requests-${Date.now()}-${Math.random().toString(36).slice(2)}`
const testSecret = `test-secret-${suffix}`
const requestContext = createSubmissionRequestContext('192.0.2.27')
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
let idempotencyCounter = 0

const createRequestService = (options: { privacyNoticeVersion?: string; consentRequired?: boolean } = {}) => createSubmissionService({
  payload,
  tokenSecret: testSecret,
  rateLimiter: { consume: async () => true },
  ...options,
})

const envelope = (kind: 'contact' | 'service' | 'training', fields: Record<string, unknown>, key: string) => ({
  fields,
  antiSpam: { website: '', token: createSubmissionFormToken(kind, requestContext.receivedAt.getTime() - 5_000, testSecret) },
  idempotencyKey: `00000000-0000-4000-8000-${(BigInt(Date.now()) * 1000n + BigInt(++idempotencyCounter) + BigInt(key)).toString(16).slice(-12).padStart(12, '0')}`,
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
      status: 'new', source: 'admin', submittedAt: new Date().toISOString(),
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
        status: 'new', source: 'admin', submittedAt: new Date().toISOString(),
      },
      overrideAccess: false, draft: false,
    })).rejects.toThrow()
    await expect(payload.find({ collection: 'contact-requests', where: { id: { equals: request.id } }, user: commercial, overrideAccess: false }))
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
      name: '  Prospect Test  ', email: `${suffix}-PROSPECT@example.test`, subject: 'Question', message: 'Besoin de contact',
      source: 'integration', status: 'converted', assignedTo: editor.id, internalNotes: 'injected',
      privacyNoticeVersion: 'browser-controlled',
      notificationStatus: 'sent',
    }, '1')
    await expect(requests.submitContactRequest(input, requestContext)).resolves.toEqual({ success: true, duplicate: false })
    const docs = await payload.find({
      collection: 'contact-requests', where: { email: { equals: `${suffix}-prospect@example.test` } },
      overrideAccess: true, limit: 10,
    })
    const created = docs.docs.find((doc) => doc.name === 'Prospect Test')
    expect(created).toMatchObject({ source: 'website', status: 'new', notificationStatus: 'pending', assignedTo: null, internalNotes: null })
    expect(created?.submittedAt).toBe(requestContext.receivedAt.toISOString())
    expect(created?.privacyNoticeVersion).toBeNull()
    createdRequests.push({ collection: 'contact-requests', id: created!.id })

    const previousRecipient = process.env.SUBMISSION_NOTIFICATION_TO
    process.env.SUBMISSION_NOTIFICATION_TO = 'internal-test@example.test'
    try {
      await expect(sendSubmissionNotification(payload, 'contact-requests', created!.id)).rejects.toThrow()
      await expect(payload.findByID({ collection: 'contact-requests', id: created!.id, overrideAccess: true }))
        .resolves.toMatchObject({ notificationStatus: 'failed' })
    } finally {
      if (previousRecipient === undefined) delete process.env.SUBMISSION_NOTIFICATION_TO
      else process.env.SUBMISSION_NOTIFICATION_TO = previousRecipient
    }

    await payload.update({
      collection: 'contact-requests', id: created!.id, data: { internalNotes: 'NE PAS ENVOYER' },
      overrideAccess: true,
    })
    let capturedText = ''
    const sendEmail = async (message: SendEmailOptions) => { capturedText = typeof message.text === 'string' ? message.text : '' }
    await expect(sendSubmissionNotification(payload, 'contact-requests', created!.id, {
      recipient: 'internal@example.test', sendEmail,
    })).resolves.toBe(true)
    expect(capturedText).toContain('Besoin de contact')
    expect(capturedText).not.toContain('NE PAS ENVOYER')
    await expect(sendSubmissionNotification(payload, 'contact-requests', created!.id, {
      recipient: 'internal@example.test', sendEmail,
    })).resolves.toBe(false)

    const firstJob = await payload.find({
      collection: 'payload-jobs', where: { taskSlug: { equals: 'notifySubmission' } },
      overrideAccess: true, limit: 100,
    })
    const matchingJob = firstJob.docs.find((job) => JSON.stringify(job.input).includes(String(created!.id)))
    expect(matchingJob).toBeDefined()
    if (matchingJob) {
      createdJobs.push(matchingJob.id)
      expect(Object.keys(matchingJob.input as object).sort()).toEqual(['requestCollection', 'requestID'])
    }

    await expect(requests.submitContactRequest(input, requestContext)).resolves.toEqual({ success: true, duplicate: true })
    const afterRetry = await payload.find({
      collection: 'contact-requests', where: { idempotencyKey: { equals: hashSubmissionIdempotencyKey(input.idempotencyKey as string) } },
      overrideAccess: true,
    })
    expect(afterRetry.totalDocs).toBe(1)

    await expect(requests.submitContactRequest(envelope('contact', {
      name: 'Invalid', email: 'not-an-email', subject: 'x', message: 'y',
    }, '2'), requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })
    const invalidToken = envelope('contact', {
      name: 'Trap', email: 'trap@example.test', subject: 'x', message: 'y',
    }, '3')
    invalidToken.antiSpam = { website: '', token: 'invalid' }
    await expect(requests.submitContactRequest(invalidToken, requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })
  })

  it('creates valid service and training requests and rejects invalid references or empty training needs', async () => {
    const requests = createRequestService()
    const serviceResult = await requests.submitServiceRequest(envelope('service', {
      name: 'Service Prospect', email: `${suffix}-service@example.test`, organization: 'Org', service: serviceID,
      need: 'Accompagnement demandé', budget: '',
    }, '4'), requestContext)
    expect(serviceResult).toEqual({ success: true, duplicate: false })

    const trainingResult = await requests.submitTrainingRequest(envelope('training', {
      name: 'Training Prospect', email: `${suffix}-training@example.test`, organization: 'Org',
      customTrainingNeed: 'Formation sur mesure', participantCount: '12', preferredFormat: 'hybrid',
    }, '5'), requestContext)
    expect(trainingResult).toEqual({ success: true, duplicate: false })

    for (const [collection, address] of [
      ['service-requests', `${suffix}-service@example.test`], ['training-requests', `${suffix}-training@example.test`],
    ] as const) {
      const result = await payload.find({ collection, where: { email: { equals: address } }, overrideAccess: true })
      expect(result.totalDocs).toBe(1)
      createdRequests.push({ collection, id: result.docs[0].id })
    }

    await expect(requests.submitServiceRequest(envelope('service', {
      name: 'Bad service', email: 'bad-service@example.test', organization: 'Org', service: 99999999, need: 'Besoin',
    }, '6'), requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })
    await expect(requests.submitTrainingRequest(envelope('training', {
      name: 'Empty training', email: 'empty-training@example.test', organization: 'Org',
    }, '7'), requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })
    await expect(requests.submitTrainingRequest(envelope('training', {
      name: 'Missing training', email: 'missing-training@example.test', organization: 'Org', training: 99999999,
    }, '10'), requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })

  })

  it('silently accepts honeypots without persistence and fails closed without shared rate limiting', async () => {
    const requests = createRequestService()
    const trapped = envelope('contact', {
      name: 'Bot', email: 'bot@example.test', subject: 'x', message: 'y',
    }, '8')
    trapped.antiSpam = { website: 'filled-by-bot', token: '' }
    await expect(requests.submitContactRequest(trapped, requestContext)).resolves.toEqual({ success: true, duplicate: false })

    const noLimiter = createSubmissionService({
      payload, tokenSecret: testSecret,
      rateLimiter: { consume: async () => { throw new Error('No shared store') } },
    })
    await expect(noLimiter.submitContactRequest(envelope('contact', {
      name: 'Rate limited', email: 'rate@example.test', subject: 'x', message: 'y',
    }, '9'), requestContext)).resolves.toEqual({ success: false, reason: 'temporarily_unavailable' })
    const trappedRecord = await payload.find({ collection: 'contact-requests', where: { email: { equals: 'bot@example.test' } }, overrideAccess: true })
    expect(trappedRecord.totalDocs).toBe(0)
  })

  it('records consent time and notice version only from server configuration', async () => {
    const input = envelope('contact', {
      name: 'Consent Prospect', email: `${suffix}-consent@example.test`, subject: 'Question', message: 'Consent test',
      privacyConsent: true, privacyNoticeVersion: 'attacker-version', privacyConsentAt: '2000-01-01T00:00:00.000Z',
    }, '11')
    const service = createRequestService({ privacyNoticeVersion: 'notice-v1', consentRequired: true })
    await expect(service.submitContactRequest(input, requestContext)).resolves.toMatchObject({ success: true, duplicate: false })
    const result = await payload.find({
      collection: 'contact-requests', where: { email: { equals: `${suffix}-consent@example.test` } },
      overrideAccess: true, limit: 1,
    })
    const created = result.docs[0]
    expect(created).toMatchObject({ privacyConsent: true, privacyNoticeVersion: 'notice-v1' })
    expect(Math.abs(Date.now() - new Date(created.privacyConsentAt!).getTime())).toBeLessThan(120_000)
    createdRequests.push({ collection: 'contact-requests', id: created.id })

    const missingVersion = createRequestService({ consentRequired: true })
    await expect(missingVersion.submitContactRequest(envelope('contact', {
      name: 'No Notice', email: `${suffix}-no-notice@example.test`, subject: 'Question', message: 'No version', privacyConsent: true,
    }, '12'), requestContext)).resolves.toEqual({ success: false, reason: 'temporarily_unavailable' })
    await expect(service.submitContactRequest(envelope('contact', {
      name: 'No Consent', email: `${suffix}-no-consent@example.test`, subject: 'Question', message: 'No consent', privacyConsent: false,
    }, '13'), requestContext)).resolves.toEqual({ success: false, reason: 'invalid' })
  })

  it('deduplicates concurrent retries and queues only one identifier-only notification job', async () => {
    const service = createRequestService()
    const input = envelope('contact', {
      name: 'Concurrent Prospect', email: `${suffix}-concurrent@example.test`, subject: 'Question', message: 'Concurrent retry',
    }, '14')
    const results = await Promise.all(Array.from({ length: 5 }, () => service.submitContactRequest(input, requestContext)))
    expect(results.filter((result) => result.success)).toHaveLength(5)
    const requests = await payload.find({
      collection: 'contact-requests', where: { idempotencyKey: { equals: hashSubmissionIdempotencyKey(input.idempotencyKey as string) } },
      overrideAccess: true, limit: 10,
    })
    expect(requests.totalDocs).toBe(1)
    createdRequests.push({ collection: 'contact-requests', id: requests.docs[0].id })
    const jobs = await payload.find({ collection: 'payload-jobs', where: { taskSlug: { equals: 'notifySubmission' } }, overrideAccess: true, limit: 1000 })
    const matching = jobs.docs.filter((job) => {
      const input = job.input as { requestCollection?: string; requestID?: number } | null
      return input?.requestCollection === 'contact-requests' && input.requestID === requests.docs[0].id
    })
    expect(matching).toHaveLength(1)
    createdJobs.push(matching[0].id)
    expect(notifySubmissionTask.retries).toMatchObject({ attempts: 3, backoff: { type: 'exponential' } })
    expect(() => createSubmissionRequestContext('untrusted arbitrary header')).toThrow()
  })
})
