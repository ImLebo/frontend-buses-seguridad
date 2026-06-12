export interface UpdateUserRequest {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  password?: string;
}
