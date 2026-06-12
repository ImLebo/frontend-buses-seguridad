import type { User } from '../users/UserModel';

export interface Profile {
  id: string;
  phone: string;
  photo: string;
  user?: User | null;
}
