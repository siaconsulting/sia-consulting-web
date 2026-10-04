'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { getPublicRoutePath } from '@/utilities/publicRoutes'

export type HeaderMenuItem = { href: string; label: string; newTab: boolean }

type Props = {
  navItems: HeaderMenuItem[]
  cta: HeaderMenuItem | null
}

function MenuAnchor({ item, className, onNavigate }: {
  item: HeaderMenuItem
  className: string
  onNavigate?: () => void
}) {
  const external = /^(https:|mailto:|tel:)/.test(item.href)
  const target = item.newTab ? '_blank' : undefined
  const rel = target ? 'noopener noreferrer' : undefined

  if (external || target) {
    return <a className={className} href={item.href} target={target} rel={rel} onClick={onNavigate}>{item.label}</a>
  }

  return <Link className={className} href={item.href} onClick={onNavigate}>{item.label}</Link>
}

export function HeaderMenu({ navItems, cta }: Props) {
  const pathname = usePathname()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    controlsRef.current?.setAttribute('data-enhanced', 'true')
    const header = document.querySelector<HTMLElement>('[data-sia-header]')
    if (header) header.dataset.hero = pathname === '/' ? 'true' : 'false'
  }, [pathname])

  useEffect(() => {
    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const next = window.scrollY > 24
        setScrolled((current) => current === next ? current : next)
        frame = 0
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-sia-header]')
    if (header) header.dataset.scrolled = String(scrolled)
  }, [scrolled])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <div className="sia-header-controls" data-enhanced="false" ref={controlsRef}>
      <nav className="sia-main-nav" id="sia-primary-navigation" aria-label="Navigation principale" data-open={open}>
        {navItems.map((item, index) => (
          <MenuAnchor key={`${item.href}-${index}`} item={item} className="sia-nav-link" onNavigate={closeMenu} />
        ))}
        {cta && <MenuAnchor item={cta} className="sia-action sia-mobile-cta" onNavigate={closeMenu} />}
      </nav>
      <Link className="sia-header-search" href={getPublicRoutePath('search')} aria-label="Recherche" title="Recherche">
        <SearchIcon aria-hidden="true" size={19} strokeWidth={1.7} />
        <span className="sr-only">Recherche</span>
      </Link>
      {cta && <MenuAnchor item={cta} className="sia-action sia-header-cta" />}
      <button
        ref={toggleRef}
        className="sia-menu-toggle"
        type="button"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="sia-primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </div>
  )
}
