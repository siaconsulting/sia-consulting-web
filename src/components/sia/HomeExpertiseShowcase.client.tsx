'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { HomeService } from '@/data/home'
import { getCollectionDetailPath, getCollectionListingPath } from '@/utilities/publicRoutes'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useState } from 'react'

type Props = { services: HomeService[] }

const servicePath = (slug: string) => getCollectionDetailPath('services', slug) ?? getCollectionListingPath('services')

export function HomeExpertiseShowcase({ services }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = services[activeIndex] ?? services[0]
  if (!active) return null

  const activeMedia = typeof active.heroImage === 'object' && active.heroImage ? active.heroImage : null

  return (
    <div className="sia-expertise-showcase">
      <ol className="sia-expertise-index" aria-label="Expertises sélectionnées">
        {services.map((service, index) => (
          <li key={service.id}>
            <Link
              href={servicePath(service.slug)}
              className="sia-expertise-choice"
              aria-current={index === activeIndex ? 'true' : undefined}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') setActiveIndex(index) }}
              onFocus={() => setActiveIndex(index)}
              onPointerDown={() => setActiveIndex(index)}
            >
              <span className="sia-expertise-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="sia-expertise-choice-copy"><strong>{service.title}</strong><span>{service.shortDescription}</span></span>
              <span className="sia-expertise-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>

      <aside className="sia-expertise-preview" aria-live="polite" aria-atomic="true">
        {activeMedia?.url ? (
          <Image
            key={active.id}
            src={getMediaUrl(activeMedia.url, activeMedia.updatedAt)}
            alt={activeMedia.alt || active.title}
            fill
            sizes="(max-width: 64rem) 100vw, 45vw"
            className="sia-expertise-preview-image"
          />
        ) : <span className="sia-expertise-preview-geometry" aria-hidden="true" />}
        <span className="sia-expertise-preview-shade" aria-hidden="true" />
        <span className="sia-expertise-preview-label">{active.title}</span>
      </aside>
    </div>
  )
}
