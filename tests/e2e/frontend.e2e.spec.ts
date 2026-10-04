import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3299'
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await page.goto(`${baseURL}/`)
    await expect(page).toHaveTitle(/SIA Consulting/)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    expect((await heading.textContent())?.trim().length).toBeGreaterThan(0)
    await expect(page.getByRole('link', { name: 'Aller au contenu principal' })).toHaveAttribute('href', '#main-content')
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.locator('main')).not.toContainText('[object Object]')
    expect(pageErrors).toEqual([])
  })

  test('homepage content sections remain useful when present and disappear when unselected', async ({ page }) => {
    await page.goto('/')

    const expertiseLinks = page.locator('.sia-expertise-choice')
    const expertiseCount = await expertiseLinks.count()
    if (expertiseCount > 0) {
      await expect(expertiseLinks.first()).toBeVisible()
      await expertiseLinks.last().focus()
      await expect(expertiseLinks.last()).toHaveAttribute('aria-current', 'true')
      await expect(expertiseLinks.last()).toHaveAttribute('href', /^\/expertises\//)
    } else {
      await expect(page.locator('#home-expertises')).toHaveCount(0)
    }

    const publications = page.locator('#home-publications')
    if (await publications.count()) {
      await expect(publications.getByRole('heading', { level: 2, name: 'Publications' })).toBeVisible()
      await expect(publications.locator('a[href^="/publications/"]').first()).toBeVisible()
    }

    await expect(page.getByText('Aucun contenu disponible')).toHaveCount(0)
  })

  test('mobile navigation opens, closes with Escape, and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const toggle = page.locator('.sia-menu-toggle')
    const nav = page.getByRole('navigation', { name: 'Navigation principale' })

    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAccessibleName('Ouvrir le menu')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle).toHaveAccessibleName('Fermer le menu')
    await expect(nav).toBeVisible()
    await expect(nav.locator('a').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
  })

  test('shell reflows without horizontal overflow at supported viewport widths', async ({ page }) => {
    await page.goto('/')
    for (const width of [360, 390, 430, 768, 820, 1024, 1280, 1440, 1600]) {
      await page.setViewportSize({ width, height: 900 })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
      expect(overflow, `horizontal overflow at ${width}px`).toBe(false)
    }
  })

  test('homepage keeps its shell usable at a 200% reflow-equivalent width', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.sia-menu-toggle')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })

  test('reduced motion disables shell transitions without hiding content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const transitionDuration = await page.locator('[data-sia-header]').evaluate((element) =>
      getComputedStyle(element).transitionDuration,
    )
    await expect(page.getByRole('heading', { level: 1, name: 'SIA Consulting' })).toBeVisible()
    expect(transitionDuration).toBe('1e-05s')
  })
})
