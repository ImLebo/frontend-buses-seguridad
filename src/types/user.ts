export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

export interface UserFilters {
  search: string;
  role: string | 'all';
  status: UserStatus | 'all';
}

export type UserFormValues = Pick<User, 'name' | 'email' | 'role' | 'status'>;
