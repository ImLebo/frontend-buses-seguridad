import type { User } from '../users/UserModel';

export interface Session {
  id: string;
  token?: string;
  expiration?: string;
  code2FA?: string;
  otpAttempts?: number;
  otpVerified?: boolean;
  partialAuth?: boolean;
  createdAt?: string;
  user?: User;
}
