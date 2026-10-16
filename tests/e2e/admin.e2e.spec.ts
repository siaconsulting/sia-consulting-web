import { test, expect, Page, BrowserContext } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90_000)
    await seedTestUser()

    context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
    await context.close()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin$/)
    const dashboardArtifact = page.getByRole('heading', { name: 'Votre site, votre espace.' })
    await expect(dashboardArtifact).toBeVisible()
    await expect(page).toHaveTitle(/SIA Consulting/)
    await expect(page.locator('body')).not.toContainText(/payload/i)
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', '/sia-icon.svg')
    await page.screenshot({ path: 'test-results/admin-sia-dashboard.png', fullPage: true })
  })

  test('can navigate to list view', async () => {
    await page.goto('/admin/collections/users')
    await expect(page).toHaveURL(/\/admin\/collections\/users(?:\?.*)?$/)
    const listViewArtifact = page.locator('h1', { hasText: 'Utilisateurs' }).first()
    await expect(listViewArtifact).toBeVisible()
    await page.screenshot({ path: 'test-results/admin-sia-users.png' })
  })

  test('account keeps the SIA identity and uses a local avatar', async () => {
    await page.goto('/admin/account')
    await expect(page).toHaveTitle(/SIA Consulting/)
    await expect(page.locator('body')).not.toContainText(/payload/i)
    await expect.poll(() => page.locator('img:visible').evaluateAll((elements) => elements.filter((image) => !(image instanceof HTMLImageElement) || !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')))).toEqual([])
    await expect(page.locator('img[src*="gravatar"]')).toHaveCount(0)
    await page.screenshot({ path: 'test-results/admin-sia-account.png' })
  })

  test('can navigate to edit view', async () => {
    await page.goto('/admin/collections/pages/create')
    await expect(page).toHaveURL(/\/admin\/collections\/pages\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="title"]')
    await expect(editViewArtifact).toBeVisible()
    await page.screenshot({ path: 'test-results/admin-sia-editor.png' })
  })
})


test('login and recovery screens use the SIA identity on desktop and mobile', async ({ page }) => {
  for (const route of ['/admin/login', '/admin/forgot']) {
    await page.goto(route)
    await expect(page).toHaveTitle(/SIA Consulting/)
    if (route.endsWith('login')) {
      await expect(page.getByRole('img', { name: 'SIA Consulting', exact: true })).toBeVisible()
    } else {
      expect(await page.locator('.template-minimal__wrap').evaluate((element) => getComputedStyle(element, '::before').backgroundImage)).toContain('/sia-logo.png')
    }
    await expect(page.locator('body')).not.toContainText(/payload/i)
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      await page.screenshot({ path: `test-results/sia-${route.split('/').pop()}-${width}.png` })
      await expect(page.getByRole('button', { name: route.endsWith('login') ? 'Se connecter' : 'Soumettre' })).toBeVisible()
    }
  }
})
