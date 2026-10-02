import type { Access } from 'payload'
import { ROLE, hasRole } from './roles'

export const adminOrEditor: Access = ({ req }) => hasRole(req.user, [ROLE.admin, ROLE.editor])
