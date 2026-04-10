import type { PermissionGrant } from './permission-grant.model'

export interface Role {
  id?: string
  name: string
  description: string
  permissions: PermissionGrant[]
}
