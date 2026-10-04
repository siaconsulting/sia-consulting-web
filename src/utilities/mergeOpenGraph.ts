import type { Metadata } from 'next'
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Site institutionnel de SIA Consulting.',
  siteName: 'SIA Consulting',
  title: 'SIA Consulting',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ?? defaultOpenGraph.images,
  }
}
