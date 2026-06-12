import type { PermissionGrant } from '../permissions/PermissionModel';

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions?: PermissionGrant[];
}
