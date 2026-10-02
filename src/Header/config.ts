import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/adminOrEditor'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'En-tête',
  access: {
    read: anyone,
    update: adminOrEditor,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({ name: 'primaryCTA', appearances: false, required: false }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
