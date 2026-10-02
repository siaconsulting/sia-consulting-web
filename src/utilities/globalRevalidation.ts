import type { GlobalSlug } from 'payload'

export const PUBLIC_GLOBALS = [
  'site-settings',
  'contact-information',
  'home-settings',
  'header',
  'footer',
] as const satisfies readonly GlobalSlug[]

export type PublicGlobal = (typeof PUBLIC_GLOBALS)[number]

export const getGlobalRevalidationTargets = (global: PublicGlobal) => {
  const tags = [`global_${global}`]
  const paths: { path: string; type?: 'page' }[] = []

  if (global === 'home-settings') {
    paths.push({ path: '/', type: 'page' })
    tags.push('homepage')
  }

  return { paths, tags }
}
