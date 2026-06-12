import type { User } from '../users/UserModel';
import type { Role } from '../roles/RoleModel';

export interface UserRole {
  id?: string;
  user: User;
  role: Role;
}
