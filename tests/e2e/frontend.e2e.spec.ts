import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3299'

    await page.goto(`${baseURL}/`)
    await expect(page).toHaveTitle(/SIA Consulting/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('SIA Consulting')
  })
})
