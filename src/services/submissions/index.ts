import type { Payload } from 'payload'
import { verifySubmissionFormToken, isHoneypotFilled } from './protection'
import {
  isRecord,
  parseContactSubmission,
  parseServiceSubmission,
  parseTrainingSubmission,
  type SubmissionKind,
} from './validation'

export type SubmissionFailure = 'invalid' | 'rate_limited' | 'temporarily_unavailable'
export type SubmissionResult = { success: true } | { success: false; reason: SubmissionFailure }

export interface SharedRequestRateLimiter {
  consume(input: { key: string; scope: SubmissionKind; limit: number; windowSeconds: number }): Promise<boolean>
}

export type SubmissionEnvelope = {
  fields: unknown
  antiSpam: unknown
  idempotencyKey: unknown
  trustedClientKey: unknown
}

type SubmissionServiceDependencies = {
  payload: Payload
  rateLimiter: SharedRequestRateLimiter
  now?: () => Date
  tokenSecret?: string
}

const isValidIdempotencyKey = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const isValidTrustedClientKey = (value: unknown): value is string =>
  typeof value === 'string' && value.length >= 8 && value.length <= 256 && !/[\r\n]/.test(value)

const submissionGuard = async (
  dependencies: SubmissionServiceDependencies,
  kind: SubmissionKind,
  envelope: SubmissionEnvelope,
  now: Date,
): Promise<SubmissionResult | null> => {
  if (!isRecord(envelope.antiSpam)) return { success: false, reason: 'invalid' }
  if (isHoneypotFilled(envelope.antiSpam.website)) return { success: true }
  if (!verifySubmissionFormToken(envelope.antiSpam.token, kind, now.getTime(), dependencies.tokenSecret)) {
    return { success: false, reason: 'invalid' }
  }
  if (!isValidIdempotencyKey(envelope.idempotencyKey) || !isValidTrustedClientKey(envelope.trustedClientKey)) {
    return { success: false, reason: 'invalid' }
  }

  try {
    const allowed = await dependencies.rateLimiter.consume({
      key: envelope.trustedClientKey,
      scope: kind,
      limit: 5,
      windowSeconds: 15 * 60,
    })
    return allowed ? null : { success: false, reason: 'rate_limited' }
  } catch {
    // Fail closed: a missing shared limiter must not silently disable production protection.
    return { success: false, reason: 'temporarily_unavailable' }
  }
}

const existingIdempotentRequest = async (
  payload: Payload,
  collection: 'contact-requests' | 'service-requests' | 'training-requests',
  idempotencyKey: string,
) => {
  const result = await payload.find({
    collection,
    where: { idempotencyKey: { equals: idempotencyKey } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs[0]
}

const publishedDocumentExists = async (
  payload: Payload,
  collection: 'services' | 'sectors' | 'trainings',
  id: number,
) => {
  try {
    await payload.findByID({ collection, id, depth: 0, overrideAccess: false })
    return true
  } catch {
    return false
  }
}

export const createSubmissionService = (dependencies: SubmissionServiceDependencies) => {
  const now = dependencies.now ?? (() => new Date())

  const checkRelations = async (
    collection: 'services' | 'sectors' | 'trainings',
    ids: (number | undefined)[],
  ) => {
    for (const id of ids) {
      if (id !== undefined && !(await publishedDocumentExists(dependencies.payload, collection, id))) return false
    }
    return true
  }

  return {
    submitContactRequest: async (envelope: SubmissionEnvelope): Promise<SubmissionResult> => {
      const nowValue = now()
      const guard = await submissionGuard(dependencies, 'contact', envelope, nowValue)
      if (guard) return guard
      const parsed = parseContactSubmission(envelope.fields, nowValue)
      if (!parsed.success) return { success: false, reason: 'invalid' }
      // The guard was run above so shared anti-spam checks are not repeated by createRequest.
      return createRequestAfterGuard(envelope, 'contact-requests', parsed.data, nowValue)
    },

    submitServiceRequest: async (envelope: SubmissionEnvelope): Promise<SubmissionResult> => {
      const nowValue = now()
      const guard = await submissionGuard(dependencies, 'service', envelope, nowValue)
      if (guard) return guard
      const parsed = parseServiceSubmission(envelope.fields, nowValue)
      if (!parsed.success || !(await checkRelations('services', [parsed.success ? parsed.data.service : undefined])) ||
        !(await checkRelations('sectors', [parsed.success ? parsed.data.sector : undefined]))) {
        return { success: false, reason: 'invalid' }
      }
      return createRequestAfterGuard(envelope, 'service-requests', parsed.data, nowValue)
    },

    submitTrainingRequest: async (envelope: SubmissionEnvelope): Promise<SubmissionResult> => {
      const nowValue = now()
      const guard = await submissionGuard(dependencies, 'training', envelope, nowValue)
      if (guard) return guard
      const parsed = parseTrainingSubmission(envelope.fields, nowValue)
      if (!parsed.success || !(await checkRelations('trainings', [parsed.success ? parsed.data.training : undefined]))) {
        return { success: false, reason: 'invalid' }
      }
      return createRequestAfterGuard(envelope, 'training-requests', parsed.data, nowValue)
    },
  }

  async function createRequestAfterGuard(
    envelope: SubmissionEnvelope,
    collection: 'contact-requests' | 'service-requests' | 'training-requests',
    data: Record<string, unknown>,
    timestamp: Date,
  ): Promise<SubmissionResult> {
    const idempotencyKey = envelope.idempotencyKey as string
    const existing = await existingIdempotentRequest(dependencies.payload, collection, idempotencyKey)
    if (existing) return { success: true }

    try {
      await dependencies.payload.create({
        collection,
        data: {
          ...data,
          status: 'new',
          source: 'website',
          submittedAt: timestamp.toISOString(),
          notificationStatus: 'pending',
          idempotencyKey,
        } as never,
        overrideAccess: true,
        context: { submissionSource: 'website' },
      })
      return { success: true }
    } catch (error) {
      const duplicate = await existingIdempotentRequest(dependencies.payload, collection, idempotencyKey).catch(() => undefined)
      if (duplicate) return { success: true }
      throw error
    }
  }
}
