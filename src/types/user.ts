export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = User;
