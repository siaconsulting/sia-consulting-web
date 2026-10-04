import 'server-only'

import { createSubmissionFormToken, isHoneypotFilled, verifySubmissionFormToken } from '@/services/submissions/protection'
import { submitContactRequest, submitServiceRequest, submitTrainingRequest, type SubmissionResult } from '@/services/submissions'
import { createTrustedSubmissionContext } from '@/services/submissions/trustedNetwork'
import { getSubmissionConsentConfiguration } from '@/services/submissions/formRuntime'
import { resolvePublishedSubmissionRelation } from '@/data/submissionOptions'
import type { SubmissionKind } from '@/services/submissions/validation'
import type { SubmissionRequestContext } from '@/services/submissions/requestContext'
import { submissionMessages, type SubmissionActionState } from './submissionState'

const readString = (formData: FormData, name: string): string | undefined => {
  const value = formData.get(name)
  return typeof value === 'string' ? value : undefined
}

const refreshFormToken = (kind: SubmissionKind) => {
  try {
    return createSubmissionFormToken(kind)
  } catch {
    return undefined
  }
}

const mapResult = (result: SubmissionResult, kind: SubmissionKind): SubmissionActionState => {
  if (result.success) return { status: 'success', message: submissionMessages.success }
  if (result.reason === 'rate_limited') return { status: 'rate-limited', message: submissionMessages.rateLimited, formToken: refreshFormToken(kind) }
  if (result.reason === 'temporarily_unavailable') return { status: 'unavailable', message: submissionMessages.unavailable, formToken: refreshFormToken(kind) }
  return { status: 'invalid', message: submissionMessages.invalid, formToken: refreshFormToken(kind) }
}

const publicFields = (formData: FormData, fields: readonly string[], consentConfigured: boolean) => {
  const data: Record<string, unknown> = {}
  for (const field of fields) {
    const value = readString(formData, field)
    // Empty optional selects/inputs mean "not supplied" to the domain service.
    data[field] = value === '' ? undefined : value
  }
  if (consentConfigured) data.privacyConsent = formData.get('privacyConsent') === 'on'
  return data
}

export async function executePublicSubmission(kind: SubmissionKind, formData: FormData): Promise<SubmissionActionState> {
  // Match the backend's silent honeypot success without creating a record or a job.
  if (isHoneypotFilled(readString(formData, 'website'))) {
    return { status: 'success', message: submissionMessages.success }
  }

  const consent = getSubmissionConsentConfiguration()
  if (!consent.available || !process.env.PAYLOAD_SECRET?.trim()) {
    return { status: 'unavailable', message: submissionMessages.configurationUnavailable }
  }

  let context: SubmissionRequestContext
  try {
    context = await createTrustedSubmissionContext()
  } catch {
    return { status: 'unavailable', message: submissionMessages.configurationUnavailable }
  }

  const token = readString(formData, 'submissionToken')
  if (!verifySubmissionFormToken(token, kind, context.receivedAt.getTime())) {
    return { status: 'invalid', message: submissionMessages.invalid, formToken: refreshFormToken(kind) }
  }

  const antiSpam = { website: '', token }
  const idempotencyKey = readString(formData, 'idempotencyKey')
  const consentConfigured = consent.configured

  try {
    if (kind === 'contact') {
      const fields = publicFields(formData, ['name', 'email', 'phone', 'organization', 'jobTitle', 'country', 'subject', 'message'], consentConfigured)
      return mapResult(await submitContactRequest({ fields, antiSpam, idempotencyKey }, context), kind)
    }

    if (kind === 'service') {
      const [service, sectorSlug] = await Promise.all([
        resolvePublishedSubmissionRelation('services', readString(formData, 'serviceSlug') ?? ''),
        readString(formData, 'sectorSlug'),
      ])
      const sector = sectorSlug ? await resolvePublishedSubmissionRelation('sectors', sectorSlug) : null
      const fields = publicFields(formData, ['name', 'email', 'phone', 'organization', 'jobTitle', 'country', 'need', 'wantedPeriod', 'budget'], consentConfigured)
      fields.service = service ?? -1
      if (sectorSlug) fields.sector = sector ?? -1
      return mapResult(await submitServiceRequest({ fields, antiSpam, idempotencyKey }, context), kind)
    }

    const trainingSlug = readString(formData, 'trainingSlug')
    const training = trainingSlug ? await resolvePublishedSubmissionRelation('trainings', trainingSlug) : null
    const fields = publicFields(formData, [
      'name', 'email', 'phone', 'organization', 'jobTitle', 'country', 'customTrainingNeed',
      'participantCount', 'preferredFormat', 'wantedPeriod', 'location', 'message',
    ], consentConfigured)
    if (trainingSlug) fields.training = training ?? -1
    return mapResult(await submitTrainingRequest({ fields, antiSpam, idempotencyKey }, context), kind)
  } catch {
    // The action boundary intentionally drops Payload, SQL, transport, and user-data details.
    return { status: 'unavailable', message: submissionMessages.unavailable, formToken: refreshFormToken(kind) }
  }
}
