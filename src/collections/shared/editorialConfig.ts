import { adminOnly } from '@/access/adminOnly'
import { adminOrEditor } from '@/access/adminOrEditor'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { canManageEditorial } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const editorialAccess: CollectionConfig['access'] = {
  create: adminOrEditor,
  delete: adminOnly,
  read: authenticatedOrPublished,
  update: adminOrEditor,
}

export const editorialAdmin = (): CollectionConfig['admin'] => ({
  defaultColumns: ['title', 'slug', 'featured', 'order', 'updatedAt'],
  group: 'Catalogue éditorial',
  hidden: ({ user }) => !canManageEditorial(user),
  useAsTitle: 'title',
})

export const editorialLabels = (singular: string, plural: string) => ({
  singular,
  plural,
})

export const editorialVersions = (): NonNullable<CollectionConfig['versions']> => ({
  drafts: {
    schedulePublish: true,
  },
  maxPerDoc: 50,
})
