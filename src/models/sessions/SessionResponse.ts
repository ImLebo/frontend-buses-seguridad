import type { Session } from './SessionModel';

export interface SessionResponse {
  session: Session;
  message?: string;
}
