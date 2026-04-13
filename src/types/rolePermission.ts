import type { Role } from './role';
import type { Permission } from './permission';

export interface RolePermission {
  id: string;
  role: Role | { id: string };
  permission: Permission | { id: string };
}

export type CreateRolePermissionInput = Omit<RolePermission, 'id'>;
export type UpdateRolePermissionInput = RolePermission;

// Tipo para matriz de permisos (módulo x acción)
export interface PermissionMatrix {
  module: string;
  permissions: {
    [action: string]: boolean; // READ, CREATE, UPDATE, DELETE
  };
}

