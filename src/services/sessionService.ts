import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Session, CreateSessionRequest, UpdateSessionRequest } from '../models';

export const sessionService = {
  getAll: () => httpClient.get<Session[]>(ENDPOINTS.SESSIONS.BASE),
  create: (input: CreateSessionRequest) => httpClient.post<Session>(ENDPOINTS.SESSIONS.BASE, input),
  update: (input: UpdateSessionRequest) => httpClient.put<Session>(ENDPOINTS.SESSIONS.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.SESSIONS.BY_ID(id)),
};
