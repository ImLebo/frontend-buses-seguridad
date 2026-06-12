import type { PermissionGrant } from '../permissions/PermissionModel';

export interface RolePermissionsRequest {
  permissions: PermissionGrant[];
}
