import 'server-only'

import { createHmac, randomUUID } from 'node:crypto'
import { isIP } from 'node:net'

const contextBrand: unique symbol = Symbol('SubmissionRequestContext')

export type SubmissionRequestContext = {
  readonly [contextBrand]: true
  readonly requestID: string
  readonly trustedClientKey: string
  readonly receivedAt: Date
}

/**
 * `validatedClientAddress` must come from a trusted runtime/proxy boundary.
 * Never pass a raw browser field or an unvalidated x-forwarded-for value.
 */
export const createSubmissionRequestContext = (validatedClientAddress: string): SubmissionRequestContext => {
  if (!isIP(validatedClientAddress)) throw new Error('A validated client network identity is required.')

  const secret = process.env.SUBMISSION_RATE_LIMIT_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('A server secret is required for submission request context.')

  return {
    [contextBrand]: true,
    requestID: randomUUID(),
    trustedClientKey: createHmac('sha256', secret).update(validatedClientAddress).digest('hex'),
    receivedAt: new Date(),
  }
}

export const isSubmissionRequestContext = (value: unknown): value is SubmissionRequestContext =>
  typeof value === 'object' && value !== null && contextBrand in value

export const hashSubmissionIdempotencyKey = (key: string): string => {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is required to protect submission idempotency keys.')
  return createHmac('sha256', secret).update(key).digest('hex')
}
