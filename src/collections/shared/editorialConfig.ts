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

export const editorialAdmin = (options: {
  group?: string
  defaultColumns?: string[]
  titleField?: string
} = {}): CollectionConfig['admin'] => ({
  defaultColumns: options.defaultColumns ?? ['title', 'slug', 'featured', 'order', 'updatedAt'],
  group: options.group ?? 'Catalogue éditorial',
  hidden: ({ user }) => !canManageEditorial(user),
  useAsTitle: options.titleField ?? 'title',
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
