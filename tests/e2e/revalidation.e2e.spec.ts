import { expect, test } from '@playwright/test'

test('internal revalidation rejects unauthenticated requests', async ({ request }) => {
  const response = await request.post('/api/internal/revalidate', {
    data: { collection: 'services', slugs: [] },
  })

  expect([401, 503]).toContain(response.status())
})
