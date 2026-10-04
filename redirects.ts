import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  return [
    { source: '/search', destination: '/recherche', permanent: true },
  ]
}
