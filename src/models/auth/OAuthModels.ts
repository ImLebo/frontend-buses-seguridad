export interface OAuthUrlResponse {
  authorizationUrl: string;
  redirectUri?: string;
  url?: string; // some endpoints return 'url' directly
}

export interface OAuthCallbackResponse {
  token: string;
  githubUsername?: string;
}

export interface OAuthUnlinkResponse {
  message: string;
}
