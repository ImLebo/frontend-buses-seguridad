export interface UpdateSessionRequest {
  id: string;
  token: string;
  expiration: string;
  code2FA: string;
  userId?: string;
}
