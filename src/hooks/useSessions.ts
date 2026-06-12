import type { CreateSessionRequest, Session, UpdateSessionRequest } from '../models';
import { sessionService } from '../services/sessionService';
import { useCrudResource } from './useCrudResource';

export const useSessions = () => {
  return useCrudResource<Session, CreateSessionRequest, UpdateSessionRequest>(sessionService);
};
