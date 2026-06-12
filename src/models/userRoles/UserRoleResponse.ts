import type { UserRole } from './UserRoleModel';

export interface UserRoleResponse {
  userRole?: UserRole;
  message?: string;
  success?: boolean;
}
