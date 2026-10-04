'use client'

import { useEffect } from 'react'

export function HomeHeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-home-hero]')
    if (!hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    hero.dataset.motionReady = 'true'
    let frame = 0

    const update = () => {
      frame = 0
      const bounds = hero.getBoundingClientRect()
      const travel = Math.max(1, hero.offsetHeight * 0.72)
      const progress = Math.min(1, Math.max(0, -bounds.top / travel))
      hero.style.setProperty('--hero-progress', progress.toFixed(3))
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        hero.dataset.motionReady = 'false'
        hero.style.removeProperty('--hero-progress')
        if (frame) window.cancelAnimationFrame(frame)
        frame = 0
      } else {
        hero.dataset.motionReady = 'true'
        scheduleUpdate()
      }
    }
    reducedMotion.addEventListener('change', onPreferenceChange)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reducedMotion.removeEventListener('change', onPreferenceChange)
      if (frame) window.cancelAnimationFrame(frame)
      hero.removeAttribute('data-motion-ready')
      hero.style.removeProperty('--hero-progress')
    }
  }, [])

  return <span className="sia-home-hero-plans" aria-hidden="true"><i /><i /><i /></span>
}
