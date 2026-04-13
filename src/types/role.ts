export interface Role {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateRoleInput = Omit<Role, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoleInput = Role;
