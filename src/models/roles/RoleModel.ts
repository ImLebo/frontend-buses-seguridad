import type { PermissionGrant } from '../permissions/PermissionModel';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: PermissionGrant[];
  isDefault?: boolean;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
