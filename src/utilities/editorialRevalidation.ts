export const editorialPublicPaths = {
  services: '/expertises',
  sectors: '/secteurs',
  trainings: '/formations',
  publications: '/publications',
  'case-studies': '/etudes-de-cas',
  'team-members': '/equipe',
  references: '/references',
  resources: '/ressources',
} as const

export type EditorialCollection = keyof typeof editorialPublicPaths

export type EditorialRevalidationTargets = {
  paths: { path: string; type?: 'page' }[]
  tags: string[]
}

export const getEditorialRevalidationTargets = (
  collection: EditorialCollection,
  slugs: (string | null | undefined)[],
): EditorialRevalidationTargets => {
  const paths: EditorialRevalidationTargets['paths'] = [
    { path: editorialPublicPaths[collection], type: 'page' },
  ]
  const tags = [`${collection}_list`]

  for (const slug of new Set(slugs.filter((value): value is string => Boolean(value)))) {
    paths.push({ path: `${editorialPublicPaths[collection]}/${encodeURIComponent(slug)}` })
    tags.push(`${collection}_${slug}`)
  }

  return { paths, tags }
}
