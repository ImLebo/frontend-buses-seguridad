export interface Session {
  id: string;
  token?: string;
  expiration?: string;
  code2FA?: string;
}

export interface CreateSessionInput {
  token: string;
  expiration: string;
  code2FA: string;
}

export interface UpdateSessionInput {
  id: string;
  token: string;
  expiration: string;
  code2FA: string;
}
