import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
  TwoFactorResendResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  OAuthUrlResponse,
  OAuthCallbackResponse,
  OAuthUnlinkResponse,
} from '../models';
import { ApiError } from '../api/interceptors';

const TOKEN_KEY = 'token';
const LOGIN_CHALLENGE_KEY = 'loginChallenge';
const PROVIDER_KEY = 'oauthProvider';
const SESSION_TOKEN_CHANGED_EVENT = 'session-token-changed';

export const getGoogleAuthorizationUrl = async (): Promise<string> => {
  const payload = await httpClient.get<OAuthUrlResponse>(ENDPOINTS.SECURITY.OAUTH_GOOGLE_URL);
  const url = payload.authorizationUrl || payload.url;
  if (!url) {
    throw new Error('El backend no devolvió authorizationUrl.');
  }
  return url;
};

export const exchangeGoogleCode = async (code: string): Promise<OAuthCallbackResponse> => {
  return httpClient.post<OAuthCallbackResponse>(ENDPOINTS.SECURITY.OAUTH_GOOGLE_CODE, { code });
};

export const getGitHubAuthorizationUrl = async (): Promise<string> => {
  const payload = await httpClient.get<OAuthUrlResponse>(ENDPOINTS.SECURITY.OAUTH_GITHUB_URL);
  const url = payload.authorizationUrl || payload.url;
  if (!url) {
    throw new Error('El backend no devolvió authorizationUrl.');
  }
  return url;
};

export const exchangeGitHubCode = async (code: string): Promise<OAuthCallbackResponse> => {
  return httpClient.post<OAuthCallbackResponse>(ENDPOINTS.SECURITY.OAUTH_GITHUB_CODE, { code });
};

export const getMicrosoftAuthorizationUrl = async (): Promise<string> => {
  const payload = await httpClient.get<OAuthUrlResponse>(ENDPOINTS.SECURITY.OAUTH_MICROSOFT_URL);
  const url = payload.authorizationUrl || payload.url;
  if (!url) {
    throw new Error('El backend no devolvió authorizationUrl.');
  }
  return url;
};

export const exchangeMicrosoftCode = async (code: string): Promise<OAuthCallbackResponse> => {
  return httpClient.post<OAuthCallbackResponse>(ENDPOINTS.SECURITY.OAUTH_MICROSOFT_CODE, { code });
};

export const unlinkGoogle = async (userId: string): Promise<OAuthUnlinkResponse> => {
  return httpClient.delete<OAuthUnlinkResponse>(ENDPOINTS.SECURITY.UNLINK_GOOGLE(userId));
};

export const unlinkGitHub = async (userId: string): Promise<OAuthUnlinkResponse> => {
  return httpClient.delete<OAuthUnlinkResponse>(ENDPOINTS.SECURITY.UNLINK_GITHUB(userId));
};

export const unlinkMicrosoft = async (userId: string): Promise<OAuthUnlinkResponse> => {
  return httpClient.delete<OAuthUnlinkResponse>(ENDPOINTS.SECURITY.UNLINK_MICROSOFT(userId));
};

export const loginWithPassword = async (payload: LoginRequest): Promise<LoginResponse> => {
  return httpClient.post<LoginResponse>(ENDPOINTS.SECURITY.LOGIN, payload);
};

export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  return httpClient.post<RegisterResponse>(ENDPOINTS.SECURITY.REGISTER, payload);
};

export const verifyTwoFactorCode = async (payload: TwoFactorVerifyRequest): Promise<TwoFactorVerifyResponse> => {
  return httpClient.post<TwoFactorVerifyResponse>(ENDPOINTS.SECURITY.VERIFY_2FA, payload);
};

export const resendTwoFactorCode = async (sessionId: string): Promise<TwoFactorResendResponse> => {
  return httpClient.post<TwoFactorResendResponse>(ENDPOINTS.SECURITY.RESEND_2FA(sessionId));
};

export const cancelTwoFactorSession = async (sessionId: string): Promise<{ message: string }> => {
  return httpClient.delete<{ message: string }>(ENDPOINTS.SECURITY.CANCEL_2FA(sessionId));
};

export const requestPasswordRecovery = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  return httpClient.post<ForgotPasswordResponse>(ENDPOINTS.SECURITY.PASSWORD_RECOVERY_REQUEST, payload);
};

export const confirmPasswordRecovery = async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  return httpClient.post<ResetPasswordResponse>(ENDPOINTS.SECURITY.PASSWORD_RECOVERY_CONFIRM, payload);
};

export const saveSessionToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(SESSION_TOKEN_CHANGED_EVENT));
};

export const getSessionToken = (): string | null => {
  return (
    sessionStorage.getItem(TOKEN_KEY) ??
    localStorage.getItem(TOKEN_KEY) ??
    localStorage.getItem('authToken')
  );
};

export const clearSessionToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('authToken');
  sessionStorage.removeItem(PROVIDER_KEY);
  window.dispatchEvent(new Event(SESSION_TOKEN_CHANGED_EVENT));
};

export const onSessionTokenChange = (callback: () => void): (() => void) => {
  const listener = () => callback();

  window.addEventListener(SESSION_TOKEN_CHANGED_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(SESSION_TOKEN_CHANGED_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

export const saveSessionProvider = (provider: string): void => {
  sessionStorage.setItem(PROVIDER_KEY, provider);
};

export const getSessionProvider = (): string | null => {
  return sessionStorage.getItem(PROVIDER_KEY);
};

export const saveLoginChallenge = (challenge: any): void => {
  sessionStorage.setItem(LOGIN_CHALLENGE_KEY, JSON.stringify(challenge));
};

export const getLoginChallenge = (): any | null => {
  const rawChallenge = sessionStorage.getItem(LOGIN_CHALLENGE_KEY);

  if (!rawChallenge) {
    return null;
  }

  try {
    return JSON.parse(rawChallenge);
  } catch {
    sessionStorage.removeItem(LOGIN_CHALLENGE_KEY);
    return null;
  }
};

export const clearLoginChallenge = (): void => {
  sessionStorage.removeItem(LOGIN_CHALLENGE_KEY);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
