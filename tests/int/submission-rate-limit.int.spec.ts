import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { up } from '@/migrations/20261003_030000_submission_rate_limits'
import { createPostgresSubmissionRateLimiter } from '@/services/submissions/postgresRateLimiter'
import { createSubmissionRequestContext } from '@/services/submissions/requestContext'

const suffix = `limit-${Date.now()}-${Math.random().toString(36).slice(2)}`
const priorSecret = process.env.SUBMISSION_RATE_LIMIT_SECRET
process.env.SUBMISSION_RATE_LIMIT_SECRET = `test-rate-secret-${suffix}`

let payload: Payload

describe('PostgreSQL shared submission rate limiter', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await up({ db: payload.db.drizzle, payload } as never)
  }, 90_000)

  afterAll(async () => {
    await payload?.destroy()
    if (priorSecret === undefined) delete process.env.SUBMISSION_RATE_LIMIT_SECRET
    else process.env.SUBMISSION_RATE_LIMIT_SECRET = priorSecret
  })

  it('atomically enforces concurrent limits and isolates scopes/windows', async () => {
    const limiter = createPostgresSubmissionRateLimiter(payload)
    const context = createSubmissionRequestContext('198.51.100.73')
    const attempts = await Promise.all(Array.from({ length: 24 }, () => limiter.consume({
      key: context.trustedClientKey, scope: 'contact', limit: 5, windowSeconds: 900,
    })))
    expect(attempts.filter(Boolean)).toHaveLength(5)
    expect(attempts.filter((allowed) => !allowed)).toHaveLength(19)

    const rollingKey = `${context.trustedClientKey}-rolling`
    await expect(limiter.consume({ key: rollingKey, scope: 'contact', limit: 1, windowSeconds: 2 })).resolves.toBe(true)
    const currentWindow = await payload.db.pool.query<{ start: number }>(
      'SELECT floor(extract(epoch FROM now()) / 2) * 2 AS start',
    )
    const nextWindowAt = (Number(currentWindow.rows[0].start) + 2) * 1000 + 100
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, nextWindowAt - Date.now())))
    await expect(limiter.consume({ key: rollingKey, scope: 'contact', limit: 1, windowSeconds: 2 })).resolves.toBe(true)

    await expect(limiter.consume({ key: context.trustedClientKey, scope: 'service', limit: 5, windowSeconds: 900 }))
      .resolves.toBe(true)
    await expect(limiter.consume({ key: context.trustedClientKey, scope: 'contact', limit: 1, windowSeconds: 1800 }))
      .resolves.toBe(true)

    const stored = await payload.db.pool.query<{ client_key_hash: string }>(
      'SELECT client_key_hash FROM sia_private.sia_submission_rate_limits WHERE scope = $1', ['contact'],
    )
    expect(stored.rows.length).toBeGreaterThan(0)
    expect(stored.rows.every(({ client_key_hash }) => /^[a-f0-9]{64}$/.test(client_key_hash))).toBe(true)
    expect(JSON.stringify(stored.rows)).not.toContain('198.51.100.73')
  })
})
