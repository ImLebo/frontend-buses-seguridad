export interface TwoFactorVerifyResponse {
  token: string;
  message?: string;
}

export interface TwoFactorResendResponse {
  message?: string;
  maskedEmail?: string;
  expiresInSeconds?: number;
}
