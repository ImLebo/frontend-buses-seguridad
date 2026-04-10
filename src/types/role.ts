export interface Role {
  id: string;
  name: string;
  description: string;
}

export type CreateRoleInput = Omit<Role, 'id'>;
export type UpdateRoleInput = Role;
