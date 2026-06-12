export interface CreateSessionRequest {
  token: string;
  expiration: string;
  code2FA: string;
  userId?: string;
}
