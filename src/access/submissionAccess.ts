import type { CollectionConfig, FieldAccess } from 'payload'
import { canManageRequests } from '@/access/roles'
import { isAdmin } from '@/access/roles'

export const requestCollectionAccess: CollectionConfig['access'] = {
  admin: ({ req }) => canManageRequests(req.user),
  create: ({ req }) => isAdmin(req.user),
  delete: ({ req }) => isAdmin(req.user),
  read: ({ req }) => canManageRequests(req.user),
  update: ({ req }) => canManageRequests(req.user),
}

export const requestSubmittedUpdate: FieldAccess = ({ req }) => isAdmin(req.user)

export const requestWorkflowUpdate: FieldAccess = ({ req }) => canManageRequests(req.user)

export const requestAdminRead: FieldAccess = ({ req }) => isAdmin(req.user)

export const neverUpdate: FieldAccess = () => false

export const neverRead: FieldAccess = () => false
