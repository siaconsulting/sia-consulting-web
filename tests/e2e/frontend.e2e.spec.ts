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
    for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport)
      await page.screenshot({ path: `test-results/home-real-${viewport.width}-motion.png` })
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport)
      await page.screenshot({ path: `test-results/home-real-${viewport.width}-reduced-motion.png` })
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' })
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

  test('homepage hero preserves CMS-like glyphs and wrapping with and without motion', async ({ page }) => {
    const sampleTitle = 'Éléphant à Québec : gyp, j, p, q — précision et accompagnement stratégique'
    const normalMotionWidths = [
      { width: 360, height: 900 },
      { width: 390, height: 844 },
      { width: 430, height: 900 },
      { width: 768, height: 900 },
      { width: 844, height: 390 },
      { width: 1024, height: 768 },
      { width: 1280, height: 900 },
      { width: 1440, height: 900 },
      { width: 1600, height: 900 },
    ]

    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.locator('.sia-home-hero-title').evaluate((heading, text) => {
      heading.querySelector('span')!.textContent = text
    }, sampleTitle)
    await expect(page.locator('[data-home-hero]')).toHaveAttribute('data-motion-ready', 'true')
    await page.locator('.sia-home-hero-title > span').evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished))
    })

    for (const viewport of normalMotionWidths) {
      await page.setViewportSize(viewport)
      const layout = await page.locator('.sia-home-hero-title').evaluate((heading) => {
        const hero = heading.closest('[data-home-hero]')!
        const title = heading.getBoundingClientRect()
        const bounds = hero.getBoundingClientRect()
        const reveal = heading.querySelector('span')!
        return {
          fitsHero: title.left >= bounds.left && title.right <= bounds.right && title.top >= bounds.top && title.bottom <= bounds.bottom,
          titleBottom: title.bottom,
          noHorizontalClip: heading.scrollWidth <= heading.clientWidth + 1,
          revealClip: getComputedStyle(reveal).clipPath,
        }
      })
      expect(layout.fitsHero, `title bounds at ${viewport.width}x${viewport.height}`).toBe(true)
      expect(layout.noHorizontalClip, `title width at ${viewport.width}x${viewport.height}`).toBe(true)
      expect(layout.revealClip, `overscanned reveal at ${viewport.width}x${viewport.height}`).toContain('-')
      if (viewport.width === 844 && viewport.height === 390) {
        expect(layout.titleBottom, 'landscape hero title should fit initial viewport').toBeLessThanOrEqual(390)
      }

      if ([390, 768, 844, 1440].includes(viewport.width)) {
        await page.screenshot({ path: `test-results/home-hero-${viewport.width}-motion.png` })
      }
    }

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.locator('.sia-home-hero-title').evaluate((heading, text) => {
      heading.querySelector('span')!.textContent = text
    }, sampleTitle)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(sampleTitle)
    await expect(page.locator('.sia-home-hero-title > span')).toHaveCSS('clip-path', 'none')
    for (const viewport of normalMotionWidths) {
      await page.setViewportSize(viewport)
      const reducedLayout = await page.locator('.sia-home-hero-title').evaluate((heading) => {
        const hero = heading.closest('[data-home-hero]')!
        const title = heading.getBoundingClientRect()
        const bounds = hero.getBoundingClientRect()
        return {
          fitsHero: title.left >= bounds.left && title.right <= bounds.right && title.top >= bounds.top && title.bottom <= bounds.bottom,
          titleBottom: title.bottom,
          noHorizontalClip: heading.scrollWidth <= heading.clientWidth + 1,
          revealClip: getComputedStyle(heading.querySelector('span')!).clipPath,
        }
      })
      expect(reducedLayout.fitsHero, `reduced title bounds at ${viewport.width}x${viewport.height}`).toBe(true)
      expect(reducedLayout.noHorizontalClip, `reduced title width at ${viewport.width}x${viewport.height}`).toBe(true)
      expect(reducedLayout.revealClip, `reduced reveal at ${viewport.width}x${viewport.height}`).toBe('none')
      if (viewport.width === 844 && viewport.height === 390) {
        expect(reducedLayout.titleBottom, 'reduced landscape title should fit initial viewport').toBeLessThanOrEqual(390)
      }

      if ([390, 768, 844, 1440].includes(viewport.width)) {
        await page.screenshot({ path: `test-results/home-hero-${viewport.width}-reduced-motion.png` })
      }
    }
    await expect(page.locator('.sia-home-hero-title')).toBeInViewport()

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.locator('.sia-header-controls').evaluate((controls) => {
      const anchor = document.createElement('a')
      anchor.className = 'sia-action sia-header-cta'
      anchor.textContent = 'Contact'
      anchor.href = '/contact'
      controls.append(anchor)
      const header = controls.closest<HTMLElement>('[data-sia-header]')!
      header.dataset.hero = 'true'
      header.dataset.scrolled = 'false'
    })
    const desktopCTA = page.locator('.sia-header-cta').last()
    await desktopCTA.hover()
    await expect(desktopCTA).toHaveCSS('background-color', 'rgb(77, 154, 173)')
    await expect(desktopCTA).toHaveCSS('color', 'rgb(7, 28, 40)')
    await page.locator('[data-sia-header]').evaluate((header) => { (header as HTMLElement).dataset.scrolled = 'true' })
    await desktopCTA.hover()
    await expect(desktopCTA).toHaveCSS('background-color', 'rgb(39, 97, 126)')
    await expect(desktopCTA).toHaveCSS('color', 'rgb(255, 255, 255)')
    expect(await desktopCTA.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.sia-menu-toggle').click()
    await page.locator('.sia-main-nav').evaluate((nav) => {
      const anchor = document.createElement('a')
      anchor.className = 'sia-action sia-mobile-cta'
      anchor.textContent = 'Contact'
      anchor.href = '/contact'
      nav.append(anchor)
    })
    const mobileButton = await page.locator('.sia-mobile-cta').evaluate((element) => {
      const { width, height, right } = element.getBoundingClientRect()
      return { width, height, right }
    })
    expect(mobileButton.height).toBeGreaterThanOrEqual(44)
    expect(mobileButton.width).toBeGreaterThan(mobileButton.height)
    expect(mobileButton.right).toBeLessThanOrEqual(390)

    const footerCTA = page.locator('.sia-footer-action')
    const button = await footerCTA.boundingBox()
    expect(button).not.toBeNull()
    expect(button!.width).toBeGreaterThan(button!.height)
    expect(await footerCTA.evaluate((element) => getComputedStyle(element).borderRadius)).not.toBe('50%')
    expect(button!.height).toBeGreaterThanOrEqual(44)
    await page.keyboard.press('Escape')
    await footerCTA.scrollIntoViewIfNeeded()
    await page.screenshot({ path: 'test-results/home-footer-cta-390.png' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await footerCTA.scrollIntoViewIfNeeded()
    await page.screenshot({ path: 'test-results/home-footer-cta-1440.png' })
  })

  test('retired template URLs cannot capture public routes and legacy search has one destination', async ({ page, request }) => {
    await page.goto('/search')
    await expect(page).toHaveURL(/\/recherche$/)

    for (const path of ['/posts', '/posts/template-slug', '/posts/page/2', '/next/seed', '/unknown-template-route']) {
      const response = await request.get(path)
      expect(response.status(), `${path} should not be a legacy content route`).toBe(404)
    }
    for (const path of ['/pages-sitemap.xml', '/posts-sitemap.xml']) {
      const response = await request.get(path)
      expect(response.status(), `${path} should be retired`).toBe(404)
    }
  })

  test('canonical sitemap and robots expose only the SIA public surface', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml')
    expect(sitemapResponse.ok()).toBe(true)
    const sitemap = await sitemapResponse.text()
    expect(sitemap).toContain('/expertises')
    expect(sitemap).toContain('/publications')
    expect(sitemap).not.toContain('/posts')
    expect(sitemap).not.toContain('/search')
    expect(sitemap).not.toContain('/demande-de-service')
    expect(sitemap).not.toContain('/references/')

    const robotsResponse = await request.get('/robots.txt')
    expect(robotsResponse.ok()).toBe(true)
    const robots = await robotsResponse.text()
    expect(robots).toContain('/sitemap.xml')
    expect(robots).not.toContain('pages-sitemap.xml')
    expect(robots).not.toContain('posts-sitemap.xml')
  })
})
