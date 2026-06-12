export interface ForgotPasswordRequest {
  email: string;
  recaptchaToken?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
