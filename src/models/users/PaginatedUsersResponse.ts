import type { User } from './UserModel';

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page?: number;
  limit?: number;
}
