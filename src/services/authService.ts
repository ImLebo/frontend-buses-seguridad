import type {
    LoginChallenge,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    VerifyTwoFactorRequest,
    VerifyTwoFactorResponse,
} from '../types';
import { ApiError, apiRequest } from './api';

const TOKEN_KEY = 'token';
const LOGIN_CHALLENGE_KEY = 'loginChallenge';

type GoogleAuthorizationUrlResponse = {
  authorizationUrl: string;
};

type GoogleTokenResponse = {
  token: string;
};

type GitHubAuthorizationUrlResponse = {
  authorizationUrl: string;
  redirectUri?: string;
};

type GitHubTokenResponse = {
  token: string;
};

export const getGoogleAuthorizationUrl = async (): Promise<string> => {
  const payload = await apiRequest<GoogleAuthorizationUrlResponse>('/security/google/url');

  if (!payload.authorizationUrl) {
    throw new Error('El backend no devolvio authorizationUrl.');
  }

  return payload.authorizationUrl;
};

export const exchangeGoogleCode = async (code: string): Promise<GoogleTokenResponse> => {
  return apiRequest<GoogleTokenResponse>('/security/google/code', {
    method: 'POST',
    body: { code },
  });
};

export const getGitHubAuthorizationUrl = async (): Promise<string> => {
  const payload = await apiRequest<GitHubAuthorizationUrlResponse>('/security/github/url');

  if (!payload.authorizationUrl) {
    throw new Error('El backend no devolvio authorizationUrl.');
  }

  return payload.authorizationUrl;
};

export const exchangeGitHubCode = async (code: string): Promise<GitHubTokenResponse> => {
  return apiRequest<GitHubTokenResponse>('/security/github/code', {
    method: 'POST',
    body: { code },
  });
};

export const loginWithPassword = async (payload: LoginRequest): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/security/login', {
    method: 'POST',
    body: payload,
  });
};

export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  return apiRequest<RegisterResponse>('/security/register', {
    method: 'POST',
    body: payload,
  });
};

export const verifyTwoFactorCode = async (payload: VerifyTwoFactorRequest): Promise<VerifyTwoFactorResponse> => {
  return apiRequest<VerifyTwoFactorResponse>('/security/login/2fa/verify', {
    method: 'POST',
    body: payload,
  });
};

export const saveSessionToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getSessionToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
};

export const clearSessionToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('authToken');
};

export const saveLoginChallenge = (challenge: LoginChallenge): void => {
  sessionStorage.setItem(LOGIN_CHALLENGE_KEY, JSON.stringify(challenge));
};

export const getLoginChallenge = (): LoginChallenge | null => {
  const rawChallenge = sessionStorage.getItem(LOGIN_CHALLENGE_KEY);

  if (!rawChallenge) {
    return null;
  }

  try {
    return JSON.parse(rawChallenge) as LoginChallenge;
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
