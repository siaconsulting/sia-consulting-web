import type { GlobalSlug } from 'payload'
import { PUBLIC_PAGES } from '@/utilities/publicRoutes'

export const PUBLIC_GLOBALS = [
  'site-settings',
  'contact-information',
  'home-settings',
  'header',
  'footer',
  'about-settings',
] as const satisfies readonly GlobalSlug[]

export type PublicGlobal = (typeof PUBLIC_GLOBALS)[number]

export const getGlobalRevalidationTargets = (global: PublicGlobal) => {
  const tags = [`global_${global}`]
  const paths: { path: string; type?: 'page' }[] = []

  if (global === 'home-settings') {
    paths.push({ path: PUBLIC_PAGES.home, type: 'page' })
    tags.push('homepage')
  }

  if (global === 'about-settings') {
    paths.push({ path: PUBLIC_PAGES.about, type: 'page' })
    tags.push('about')
  }

  return { paths, tags }
}
