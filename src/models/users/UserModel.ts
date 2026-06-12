import type { Role } from '../roles/RoleModel';
import type { Permission } from '../permissions/PermissionModel';

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  githubId?: string;
  githubUsername?: string;
  githubAvatarUrl?: string;
  googleId?: string;
  googleAvatarUrl?: string;
  microsoftId?: string;
  microsoftAvatarUrl?: string;
}

export interface UserWithRolesResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  roles: Role[];
}

export interface UserCompleteInfoResponse {
  user: User;
  roles: Role[];
  permissions: Permission[];
  roleCount: number;
  permissionCount: number;
}
