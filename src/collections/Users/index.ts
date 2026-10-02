import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { ROLE, hasKnownRole, isAdmin } from '../../access/roles'
import type { CollectionBeforeValidateHook } from 'payload'

const assignFirstUserAdmin: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data) return data

  const existingUsers = await req.payload.count({ collection: 'users', overrideAccess: true, req })
  if (existingUsers.totalDocs === 0) return { ...data, role: ROLE.admin }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => hasKnownRole(req.user),
    create: adminOnly,
    delete: adminOnly,
    read: ({ id, req }) => (isAdmin(req.user) ? true : Boolean(req.user && id === req.user.id)),
    update: ({ id, req }) => (isAdmin(req.user) ? true : Boolean(req.user && id === req.user.id)),
  },
  admin: {
    defaultColumns: ['name', 'email'],
    hidden: ({ user }) => !isAdmin(user),
    useAsTitle: 'name',
  },
  auth: true,
  hooks: { beforeValidate: [assignFirstUserAdmin] },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: ROLE.editor,
      saveToJWT: true,
      access: {
        create: ({ req }) => isAdmin(req.user),
        update: ({ req }) => isAdmin(req.user),
      },
      options: [
        { label: 'Admin', value: ROLE.admin },
        { label: 'Editor', value: ROLE.editor },
        { label: 'Commercial', value: ROLE.commercial },
      ],
    },
  ],
  timestamps: true,
}
