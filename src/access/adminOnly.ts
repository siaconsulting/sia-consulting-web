import type { Access } from 'payload'
import { ROLE, hasRole } from './roles'

export const adminOnly: Access = ({ req }) => hasRole(req.user, [ROLE.admin])
