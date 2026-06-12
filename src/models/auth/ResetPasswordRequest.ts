export interface ResetPasswordRequest {
  token?: string;
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
}

export interface ResetPasswordResponse {
  message: string;
}
