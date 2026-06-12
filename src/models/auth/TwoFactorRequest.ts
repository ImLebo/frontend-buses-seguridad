export interface TwoFactorVerifyRequest {
  sessionId: string;
  code: string;
}

export interface TwoFactorResendRequest {
  sessionId: string;
}
