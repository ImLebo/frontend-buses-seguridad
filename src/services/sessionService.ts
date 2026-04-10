import type { CreateSessionInput, Session, UpdateSessionInput } from '../types';
import { apiRequest } from './api';

export const sessionService = {
  getAll: () => apiRequest<Session[]>('/sessions'),
  create: (input: CreateSessionInput) => apiRequest<Session>('/sessions', { method: 'POST', body: input }),
  update: (input: UpdateSessionInput) => apiRequest<Session>(`/sessions/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/sessions/${id}`, { method: 'DELETE' }),
};
