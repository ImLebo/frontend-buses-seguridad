export interface LoginResponse {
  requires2FA: boolean;
  token?: string;
  sessionId?: string;
  expiresAt?: number;
  remainingAttempts?: number;
  maskedEmail?: string;
  message?: string;
}
