import type { CreateProfileInput, Profile, UpdateProfileInput } from '../types';
import { apiRequest } from './api';

export const profileService = {
  getAll: () => apiRequest<Profile[]>('/profiles'),
  create: (input: CreateProfileInput) => apiRequest<Profile>('/profiles', { method: 'POST', body: input }),
  update: (input: UpdateProfileInput) => apiRequest<Profile>(`/profiles/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/profiles/${id}`, { method: 'DELETE' }),
};
