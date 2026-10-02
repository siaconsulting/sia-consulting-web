import type { Access } from 'payload'
import { ROLE, hasRole } from './roles'

export const adminOrCommercial: Access = ({ req }) =>
  hasRole(req.user, [ROLE.admin, ROLE.commercial])
