import { expect, test } from '@playwright/test'

test('public search GET form is shareable, resilient, and responsive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/recherche')

  await expect(page).toHaveTitle(/Recherche/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/recherche$/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow|follow.*noindex/)
  await expect(page.getByRole('searchbox', { name: 'Rechercher dans le site' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Résultats' })).toHaveCount(0)

  const input = page.getByRole('searchbox', { name: 'Rechercher dans le site' })
  const query = `aucun-resultat-${Date.now()} & é ? <script>`
  await input.fill(query)
  await page.getByLabel('Type de contenu').selectOption('services')
  await page.getByRole('button', { name: /Rechercher/ }).click()

  await expect(page).toHaveURL(/\/recherche\?q=/)
  await expect(page.getByRole('heading', { name: /Aucun résultat/ })).toBeVisible()
  await expect(page.getByRole('searchbox')).toHaveValue(query)
  await expect(page.getByLabel('Type de contenu')).toHaveValue('services')
  expect(await page.evaluate(() => new URL(window.location.href).searchParams.get('q'))).toBe(query)
  await expect(page.locator('main script')).toHaveCount(0)

  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1600]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.locator('body').evaluate((element) => element.scrollWidth <= window.innerWidth), `overflow at ${width}px`).toBe(true)
    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Aucun résultat/ })).toBeVisible()
  }
})
