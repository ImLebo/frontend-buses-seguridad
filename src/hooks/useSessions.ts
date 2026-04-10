import type { CreateSessionInput, Session, UpdateSessionInput } from '../types';
import { sessionService } from '../services/sessionService';
import { useCrudResource } from './useCrudResource';

export const useSessions = () => {
  return useCrudResource<Session, CreateSessionInput, UpdateSessionInput>(sessionService);
};
