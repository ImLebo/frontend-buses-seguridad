import type { Permission } from './PermissionModel';

export interface PermissionResponse {
  permission: Permission;
  message?: string;
}
