import type { Access } from 'payload'
import { ROLE, hasRole } from './roles'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (hasRole(user, [ROLE.admin, ROLE.editor])) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
