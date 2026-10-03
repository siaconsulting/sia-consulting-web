import 'server-only'

import type { Payload } from 'payload'
import { createPostgresSubmissionRateLimiter, getSubmissionRateLimitPolicy } from './postgresRateLimiter'
import { hashSubmissionIdempotencyKey, isSubmissionRequestContext, type SubmissionRequestContext } from './requestContext'
import { verifySubmissionFormToken, isHoneypotFilled } from './protection'
import {
  isRecord,
  parseContactSubmission,
  parseServiceSubmission,
  parseTrainingSubmission,
  type SubmissionKind,
} from './validation'

export type SubmissionFailure = 'invalid' | 'rate_limited' | 'temporarily_unavailable'
export type SubmissionResult =
  | { success: true; duplicate: boolean }
  | { success: false; reason: SubmissionFailure }

export interface SharedRequestRateLimiter {
  consume(input: { key: string; scope: SubmissionKind; limit: number; windowSeconds: number }): Promise<boolean>
}

export type PublicSubmissionInput = {
  fields: unknown
  antiSpam: unknown
  idempotencyKey: unknown
}

type SubmissionServiceDependencies = {
  payload: Payload
  rateLimiter: SharedRequestRateLimiter
  tokenSecret?: string
  privacyNoticeVersion?: string
  consentRequired?: boolean
}

const isValidIdempotencyKey = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const getConsentConfiguration = (dependencies: SubmissionServiceDependencies) => ({
  version: dependencies.privacyNoticeVersion ?? process.env.SUBMISSION_PRIVACY_NOTICE_VERSION?.trim(),
  required: dependencies.consentRequired ?? process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED === 'true',
})

const submissionGuard = async (
  dependencies: SubmissionServiceDependencies,
  kind: SubmissionKind,
  input: PublicSubmissionInput,
  context: SubmissionRequestContext,
): Promise<SubmissionResult | null> => {
  if (!isSubmissionRequestContext(context) || !isRecord(input.antiSpam)) return { success: false, reason: 'invalid' }
  if (isHoneypotFilled(input.antiSpam.website)) return { success: true, duplicate: false }
  if (!verifySubmissionFormToken(input.antiSpam.token, kind, context.receivedAt.getTime(), dependencies.tokenSecret)) {
    return { success: false, reason: 'invalid' }
  }
  if (!isValidIdempotencyKey(input.idempotencyKey)) return { success: false, reason: 'invalid' }

  try {
    const policy = getSubmissionRateLimitPolicy(kind)
    const allowed = await dependencies.rateLimiter.consume({ key: context.trustedClientKey, scope: kind, ...policy })
    return allowed ? null : { success: false, reason: 'rate_limited' }
  } catch {
    return { success: false, reason: 'temporarily_unavailable' }
  }
}

const requestCollection = {
  contact: 'contact-requests',
  service: 'service-requests',
  training: 'training-requests',
} as const

export const createSubmissionService = (dependencies: SubmissionServiceDependencies) => {
  const checkRelations = async (collection: 'services' | 'sectors' | 'trainings', ids: (number | undefined)[]) => {
    for (const id of ids) {
      if (id === undefined) continue
      try {
        await dependencies.payload.findByID({ collection, id, depth: 0, overrideAccess: false })
      } catch {
        return false
      }
    }
    return true
  }

  const applyServerConsent = <T extends Record<string, unknown>>(data: T, input: unknown, receivedAt: Date) => {
    const config = getConsentConfiguration(dependencies)
    if (config.required && (!config.version || !isRecord(input) || input.privacyConsent !== true)) return null
    if (!isRecord(input) || input.privacyConsent === undefined) return config.required ? null : data
    if (typeof input.privacyConsent !== 'boolean') return null
    if (input.privacyConsent && !config.version) return null
    return {
      ...data,
      privacyConsent: input.privacyConsent,
      ...(input.privacyConsent ? {
        privacyConsentAt: receivedAt.toISOString(),
        privacyNoticeVersion: config.version,
      } : {}),
    }
  }

  const submit = async (
    kind: SubmissionKind,
    input: PublicSubmissionInput,
    context: SubmissionRequestContext,
    parse: (fields: unknown, now: Date) => { success: true; data: Record<string, unknown> } | { success: false },
    relations?: () => Promise<boolean>,
  ): Promise<SubmissionResult> => {
    const receivedAt = context?.receivedAt instanceof Date ? context.receivedAt : new Date()
    const guard = await submissionGuard(dependencies, kind, input, context)
    if (guard) return guard

    const parsed = parse(input.fields, receivedAt)
    if (!parsed.success || (relations && !(await relations()))) return { success: false, reason: 'invalid' }
    const data = applyServerConsent(parsed.data, input.fields, receivedAt)
    if (!data) {
      const consentConfig = getConsentConfiguration(dependencies)
      return !consentConfig.version && (consentConfig.required ||
        (isRecord(input.fields) && input.fields.privacyConsent === true))
        ? { success: false, reason: 'temporarily_unavailable' }
        : { success: false, reason: 'invalid' }
    }
    if (!isValidIdempotencyKey(input.idempotencyKey)) return { success: false, reason: 'invalid' }

    const collection = requestCollection[kind]
    let idempotencyKey: string | undefined
    try {
      idempotencyKey = hashSubmissionIdempotencyKey(input.idempotencyKey)
      const existing = await dependencies.payload.find({
        collection,
        where: { idempotencyKey: { equals: idempotencyKey } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (existing.docs[0]) return { success: true, duplicate: true }

      await dependencies.payload.create({
        collection,
        data: {
          ...data,
          status: 'new',
          source: 'website',
          submittedAt: receivedAt.toISOString(),
          notificationStatus: 'pending',
          idempotencyKey,
        } as never,
        overrideAccess: true,
        context: { submissionSource: 'website', submissionRequestID: context.requestID },
      })
      return { success: true, duplicate: false }
    } catch {
      if (!idempotencyKey) return { success: false, reason: 'temporarily_unavailable' }
      const duplicate = await dependencies.payload.find({
        collection,
        where: { idempotencyKey: { equals: idempotencyKey } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }).catch(() => undefined)
      if (duplicate?.docs[0]) return { success: true, duplicate: true }
      return { success: false, reason: 'temporarily_unavailable' }
    }
  }

  return {
    submitContactRequest: (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
      submit('contact', input, context, parseContactSubmission),
    submitServiceRequest: (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
      submit('service', input, context, parseServiceSubmission, async () => {
        const parsed = parseServiceSubmission(input.fields, context.receivedAt)
        return parsed.success && await checkRelations('services', [parsed.data.service]) &&
          await checkRelations('sectors', [parsed.data.sector])
      }),
    submitTrainingRequest: (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
      submit('training', input, context, parseTrainingSubmission, async () => {
        const parsed = parseTrainingSubmission(input.fields, context.receivedAt)
        return parsed.success && await checkRelations('trainings', [parsed.data.training])
      }),
  }
}

type SubmissionService = ReturnType<typeof createSubmissionService>
let defaultSubmissionService: Promise<SubmissionService> | undefined

const getDefaultSubmissionService = (): Promise<SubmissionService> => {
  if (!defaultSubmissionService) {
    defaultSubmissionService = (async () => {
      const [{ getPayload }, configModule] = await Promise.all([
        import('payload'),
        import('../../payload.config'),
      ])
      const payload = await getPayload({ config: await configModule.default })
      return createSubmissionService({ payload, rateLimiter: createPostgresSubmissionRateLimiter(payload) })
    })().catch((error: unknown) => {
      defaultSubmissionService = undefined
      throw error
    })
  }
  return defaultSubmissionService
}

/** Ready for a Next.js Server Action; pass only public fields and a server-built context. */
export const submitContactRequest = async (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
  (await getDefaultSubmissionService()).submitContactRequest(input, context)

export const submitServiceRequest = async (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
  (await getDefaultSubmissionService()).submitServiceRequest(input, context)

export const submitTrainingRequest = async (input: PublicSubmissionInput, context: SubmissionRequestContext) =>
  (await getDefaultSubmissionService()).submitTrainingRequest(input, context)
