import { ApiError, apiRequest } from './api';

const TOKEN_KEY = 'token';

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

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
