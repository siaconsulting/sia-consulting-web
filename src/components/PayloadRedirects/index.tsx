import type React from 'react'
import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'
import { getCollectionDetailPath, PUBLIC_COLLECTION_ROUTES, type PublicCollection } from '@/utilities/publicRoutes'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    const reference = redirectItem.to?.reference
    if (reference) {
      const value = reference.value
      const document = typeof value === 'object'
        ? value
        : await getCachedDocument(reference.relationTo, value)()
      const slug = typeof document === 'object' && document && 'slug' in document && typeof document.slug === 'string'
        ? document.slug
        : null

      if (slug) {
        const redirectUrl = Object.prototype.hasOwnProperty.call(PUBLIC_COLLECTION_ROUTES, reference.relationTo)
          ? getCollectionDetailPath(reference.relationTo as PublicCollection, slug)
          : null
        if (redirectUrl) redirect(redirectUrl)
      }
    }
  }

  if (disableNotFound) return null

  notFound()
}
