import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOnly } from '../access/adminOnly'
import { adminOrEditor } from '../access/adminOrEditor'
import { canManageEditorial } from '../access/roles'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOrEditor,
    delete: adminOnly,
    read: anyone,
    update: adminOrEditor,
  },
  admin: {
    hidden: ({ user }) => !canManageEditorial(user),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
