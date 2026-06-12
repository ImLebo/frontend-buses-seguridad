import type { RolePermission } from './RolePermissionModel';

export interface RolePermissionResponse {
  rolePermission: RolePermission;
  message?: string;
}
