import { isAdmin } from '@/access/roles'

export const canRunDemoSeed = (user: unknown, nodeEnvironment: string | undefined): boolean =>
  nodeEnvironment !== 'production' && isAdmin(user)
