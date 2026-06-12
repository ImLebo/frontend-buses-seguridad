import type { Role } from '../roles/RoleModel';
import type { Permission } from '../permissions/PermissionModel';

export interface RolePermission {
  id: string;
  role: Role | { id: string };
  permission: Permission | { id: string };
}
