import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config.js'

let testPayload: Payload | undefined

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  role: 'admin' as const,
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  testPayload = await getPayload({ config })

  // Delete existing test user if any
  await testPayload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
    overrideAccess: true,
  })

  // Create fresh test user
  await testPayload.create({
    collection: 'users',
    data: testUser,
    overrideAccess: true,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = testPayload ?? (await getPayload({ config }))

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
    overrideAccess: true,
  })

  await payload.destroy()
  testPayload = undefined
}
