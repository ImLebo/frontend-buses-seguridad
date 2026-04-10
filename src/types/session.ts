export interface Session {
  id: string;
  token: string;
  expiration: string;
  code2FA: string;
}

export type CreateSessionInput = Omit<Session, 'id'>;
export type UpdateSessionInput = Session;
