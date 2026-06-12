import type { PermissionGrant } from '../permissions/PermissionModel';

export interface UpdateRoleRequest {
  id: string;
  name: string;
  description: string;
  permissions?: PermissionGrant[];
}
