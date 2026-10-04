import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { getHeaderData, getSiteSettings } from '@/data/globals'
import { HeaderMenu } from './HeaderMenu.client'
import { resolveLinkHref } from '@/utilities/links'
import { PUBLIC_PRIMARY_NAV_FALLBACK } from '@/utilities/publicRoutes'

const populatedMedia = (media: number | Media | null | undefined): Media | undefined =>
  typeof media === 'object' && media !== null ? media : undefined

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([getHeaderData(), getSiteSettings()])
  const isLandingHeader = false
  const media = populatedMedia(siteSettings.logo ?? siteSettings.logoDark)
  const logoSrc = media?.url || undefined
  const siteName = siteSettings.siteName || siteSettings.shortName || 'SIA Consulting'

  const cmsNavItems = (headerData.navItems ?? []).flatMap(({ link }) => {
    const href = resolveLinkHref(link)
    return href && link.label ? [{ href, label: link.label, newTab: Boolean(link.newTab) }] : []
  })
  const navItems = cmsNavItems.length ? cmsNavItems : PUBLIC_PRIMARY_NAV_FALLBACK.map((item) => ({ ...item, newTab: false }))
  const cta = headerData.primaryCTA
  const ctaHref = cta ? resolveLinkHref(cta) : null
  const ctaData = ctaHref && cta?.label
    ? { href: ctaHref, label: cta.label, newTab: Boolean(cta.newTab) }
    : null

  return (
    <header className="sia-header" data-hero={isLandingHeader ? 'true' : 'false'} data-scrolled="false" data-sia-header>
      <div className="container sia-header-row">
        <Link className="sia-brand-link" href="/" aria-label={`${siteName} — accueil`}>
          {logoSrc && media ? (
            <Image
              src={logoSrc}
              alt=""
              width={media.width || 180}
              height={media.height || 64}
              priority
              unoptimized
            />
          ) : (
            <span className="sia-wordmark">{siteName}</span>
          )}
        </Link>
        <HeaderMenu navItems={navItems} cta={ctaData} />
      </div>
    </header>
  )
}
