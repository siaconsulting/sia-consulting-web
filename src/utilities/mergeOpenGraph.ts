import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Site institutionnel de SIA Consulting.',
  images: [
    {
      url: `${getServerSideURL()}/favicon.svg`,
    },
  ],
  siteName: 'SIA Consulting',
  title: 'SIA Consulting',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
