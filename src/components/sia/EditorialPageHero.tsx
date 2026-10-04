import Image from 'next/image'
import type { Media } from '@/payload-types'
import { Container } from '@/components/sia/Container'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/sia/Breadcrumbs'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Props = {
  eyebrow: string
  title: string
  description?: string | null
  image?: number | Media | null
  breadcrumbs?: BreadcrumbItem[]
  detail?: boolean
}

export function EditorialPageHero({ eyebrow, title, description, image, breadcrumbs = [], detail = false }: Props) {
  const media = typeof image === 'object' && image && 'url' in image ? image : null
  return (
    <section className={`sia-editorial-hero${detail ? ' sia-editorial-hero--detail' : ''}`}>
      <Container>
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="sia-editorial-hero-grid">
          <div className="sia-editorial-hero-copy">
            <p className="sia-editorial-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description && <p className="sia-editorial-lead">{description}</p>}
          </div>
          <div className="sia-editorial-hero-art" aria-hidden="true">
            {media?.url ? (
              <Image src={getMediaUrl(media.url, media.updatedAt)} alt="" fill priority={detail} sizes="(max-width: 64rem) 100vw, 44vw" className="sia-editorial-hero-image" />
            ) : <span className="sia-editorial-geometry"><i /><i /><i /></span>}
          </div>
        </div>
      </Container>
    </section>
  )
}
