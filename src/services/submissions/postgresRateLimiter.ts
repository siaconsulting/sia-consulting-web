import 'server-only'

import { createHmac } from 'node:crypto'
import type { Payload } from 'payload'
import type { SharedRequestRateLimiter } from '.'

const POLICY = {
  contact: { limit: 5, windowSeconds: 15 * 60 },
  service: { limit: 5, windowSeconds: 15 * 60 },
  training: { limit: 5, windowSeconds: 15 * 60 },
} as const

export const getSubmissionRateLimitPolicy = (scope: keyof typeof POLICY) => POLICY[scope]

export const createPostgresSubmissionRateLimiter = (payload: Payload): SharedRequestRateLimiter => ({
  consume: async ({ key, scope, limit, windowSeconds }) => {
    if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowSeconds) || windowSeconds < 1) {
      throw new Error('Invalid submission rate limit policy.')
    }

    const secret = process.env.SUBMISSION_RATE_LIMIT_SECRET || process.env.PAYLOAD_SECRET
    if (!secret) throw new Error('Submission rate limit secret is missing.')
    const clientKeyHash = createHmac('sha256', secret).update(key).digest('hex')
    const result = await payload.db.pool.query<{ count: number }>(
      `INSERT INTO sia_private.sia_submission_rate_limits
        (scope, client_key_hash, window_seconds, window_start, expires_at, hit_count)
       VALUES (
         $1::text, $2::char(64), $3::integer,
         to_timestamp(floor(extract(epoch FROM now()) / $3::numeric) * $3::numeric),
         to_timestamp(floor(extract(epoch FROM now()) / $3::numeric) * $3::numeric)
           + ($3::integer * interval '1 second'),
         1
       )
       ON CONFLICT (scope, client_key_hash, window_seconds, window_start)
       DO UPDATE SET hit_count = sia_private.sia_submission_rate_limits.hit_count + 1
       WHERE sia_private.sia_submission_rate_limits.hit_count < $4::integer
       RETURNING hit_count AS count`,
      [scope, clientKeyHash, windowSeconds, limit],
    )

    if (result.rows[0]?.count === 1) {
      await payload.db.pool.query('DELETE FROM sia_private.sia_submission_rate_limits WHERE expires_at < now()')
    }

    return result.rowCount === 1
  },
})
