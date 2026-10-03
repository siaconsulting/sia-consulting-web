import type { Field } from 'payload'
import type { PublicCollection } from '@/utilities/publicRoutes'

export const SIA_SEARCH_COLLECTIONS = [
  'services', 'sectors', 'trainings', 'publications', 'case-studies', 'resources',
] as const satisfies readonly PublicCollection[]

export const searchFields: Field[] = [
  {
    name: 'contentType',
    type: 'select',
    required: true,
    index: true,
    admin: { readOnly: true },
    options: [
      { label: 'Expertise', value: 'services' },
      { label: 'Secteur', value: 'sectors' },
      { label: 'Formation', value: 'trainings' },
      { label: 'Publication', value: 'publications' },
      { label: 'Étude de cas', value: 'case-studies' },
      { label: 'Ressource', value: 'resources' },
    ],
  },
  { name: 'slug', type: 'text', index: true, admin: { readOnly: true } },
  { name: 'url', type: 'text', required: true, admin: { readOnly: true } },
  { name: 'excerpt', type: 'textarea', index: true, admin: { readOnly: true } },
  { name: 'image', type: 'upload', relationTo: 'media', admin: { readOnly: true } },
  { name: 'publishedAt', type: 'date', admin: { readOnly: true } },
  {
    // Kept hidden to preserve the old Posts search index schema while its rows are retired separately.
    name: 'meta',
    type: 'group',
    admin: { hidden: true, readOnly: true },
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    // Retained only to preserve the existing Posts index table during migration; never populated by SIA search.
    name: 'categories',
    type: 'array',
    admin: { hidden: true, readOnly: true },
    fields: [
      { name: 'relationTo', type: 'text' },
      { name: 'categoryID', type: 'text' },
      { name: 'title', type: 'text' },
    ],
  },
]

export const withLegacySearchRelations = ({ defaultFields }: { defaultFields: Field[] }): Field[] => [
  ...defaultFields.map((field): Field => {
    if ('name' in field && field.name === 'doc' && field.type === 'relationship') {
      return { ...field, relationTo: [...SIA_SEARCH_COLLECTIONS, 'posts'] } as Field
    }
    return field
  }),
  ...searchFields,
]
