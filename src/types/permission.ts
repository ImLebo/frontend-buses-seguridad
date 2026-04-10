export interface Permission {
  id: string;
  url: string;
  method: string;
  model: string;
}

export type CreatePermissionInput = Omit<Permission, 'id'>;
export type UpdatePermissionInput = Permission;
