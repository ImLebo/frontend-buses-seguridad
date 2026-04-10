import type { PermissionGrant } from './permission-grant.model'

export interface RolePermissionsRequest {
  permissions: PermissionGrant[]
}
