import type { User } from './UserModel';

export interface UserResponse {
  user: User;
  message?: string;
}
