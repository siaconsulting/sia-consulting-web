export const ROLE = {
  admin: 'admin',
  editor: 'editor',
  commercial: 'commercial',
} as const

export type UserRole = (typeof ROLE)[keyof typeof ROLE]

export const hasRole = (user: unknown, roles: readonly UserRole[]): boolean => {
  if (!user || typeof user !== 'object' || !('role' in user)) return false
  const role = (user as { role?: unknown }).role
  return typeof role === 'string' && roles.some((allowedRole) => role === allowedRole)
}

export const isAdmin = (user: unknown): boolean => hasRole(user, [ROLE.admin])
export const canManageEditorial = (user: unknown): boolean =>
  hasRole(user, [ROLE.admin, ROLE.editor])
export const hasKnownRole = (user: unknown): boolean =>
  hasRole(user, [ROLE.admin, ROLE.editor, ROLE.commercial])
