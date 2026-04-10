export interface RolePermission {
  id: string;
  role: { id: string };
  permission: { id: string };
}

export type CreateRolePermissionInput = Omit<RolePermission, 'id'>;
export type UpdateRolePermissionInput = RolePermission;
