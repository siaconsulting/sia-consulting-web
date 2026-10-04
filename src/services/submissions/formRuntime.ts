import 'server-only'

import { randomUUID } from 'node:crypto'
import { createSubmissionFormToken } from './protection'
import type { SubmissionKind } from './validation'

export type SubmissionFormRuntime = {
  token: string | null
  idempotencyKey: string
  privacyNoticeText: string | null
  consentRequired: boolean
  configurationAvailable: boolean
}

export function getSubmissionConsentConfiguration() {
  const required = process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED?.trim().toLowerCase() === 'true'
  const version = process.env.SUBMISSION_PRIVACY_NOTICE_VERSION?.trim()
  const text = process.env.SUBMISSION_PRIVACY_NOTICE_TEXT?.trim()
  const configured = Boolean(version && text)

  return {
    required,
    version,
    text: configured ? text! : null,
    configured,
    available: !required || configured,
  }
}

export function getSubmissionFormRuntime(kind: SubmissionKind): SubmissionFormRuntime {
  const consent = getSubmissionConsentConfiguration()
  try {
    const token = createSubmissionFormToken(kind)
    return {
      token,
      idempotencyKey: randomUUID(),
      privacyNoticeText: consent.text,
      consentRequired: consent.required,
      configurationAvailable: consent.available,
    }
  } catch {
    return {
      token: null,
      idempotencyKey: randomUUID(),
      privacyNoticeText: consent.text,
      consentRequired: consent.required,
      configurationAvailable: false,
    }
  }
}
