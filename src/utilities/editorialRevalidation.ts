import { getCollectionDetailPath, getCollectionListingPath, type PublicCollection } from '@/utilities/publicRoutes'

export type EditorialCollection = PublicCollection

export type EditorialRevalidationTargets = {
  paths: { path: string; type?: 'page' }[]
  tags: string[]
}

export const getEditorialRevalidationTargets = (
  collection: EditorialCollection,
  slugs: (string | null | undefined)[],
): EditorialRevalidationTargets => {
  const paths: EditorialRevalidationTargets['paths'] = [
    { path: getCollectionListingPath(collection), type: 'page' },
  ]
  const tags = [`${collection}_list`]

  for (const slug of new Set(slugs.filter((value): value is string => Boolean(value)))) {
    const detailPath = getCollectionDetailPath(collection, slug)
    if (detailPath) paths.push({ path: detailPath })
    tags.push(`${collection}_${slug}`)
  }

  return { paths, tags }
}
