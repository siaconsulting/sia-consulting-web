import { createHmac, timingSafeEqual } from 'node:crypto'
import type { SubmissionKind } from './validation'

const MINIMUM_FORM_AGE_MS = 3_000
const MAXIMUM_FORM_AGE_MS = 2 * 60 * 60 * 1000

const getSignature = (kind: SubmissionKind, issuedAt: number, secret: string) =>
  createHmac('sha256', secret).update(`${kind}:${issuedAt}`).digest('base64url')

export const createSubmissionFormToken = (
  kind: SubmissionKind,
  issuedAt = Date.now(),
  secret = process.env.PAYLOAD_SECRET,
): string => {
  if (!secret) throw new Error('PAYLOAD_SECRET is required to issue submission tokens.')
  return `${issuedAt}.${getSignature(kind, issuedAt, secret)}`
}

export const verifySubmissionFormToken = (
  token: unknown,
  kind: SubmissionKind,
  now = Date.now(),
  secret = process.env.PAYLOAD_SECRET,
): boolean => {
  if (!secret || typeof token !== 'string') return false
  const [timestampText, providedSignature, extra] = token.split('.')
  if (!timestampText || !providedSignature || extra !== undefined || !/^\d{13}$/.test(timestampText)) return false
  const issuedAt = Number(timestampText)
  const age = now - issuedAt
  if (!Number.isSafeInteger(issuedAt) || age < MINIMUM_FORM_AGE_MS || age > MAXIMUM_FORM_AGE_MS) return false

  const expected = Buffer.from(getSignature(kind, issuedAt, secret))
  const provided = Buffer.from(providedSignature)
  return expected.length === provided.length && timingSafeEqual(expected, provided)
}

export const isHoneypotFilled = (value: unknown): boolean =>
  typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null && value !== false
