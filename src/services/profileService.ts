import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Profile, CreateProfileRequest, UpdateProfileRequest } from '../models';

export const profileService = {
  getAll: () => httpClient.get<Profile[]>(ENDPOINTS.PROFILES.BASE),
  create: (input: CreateProfileRequest) => httpClient.post<Profile>(ENDPOINTS.PROFILES.BASE, input),
  update: (input: UpdateProfileRequest) => httpClient.put<Profile>(ENDPOINTS.PROFILES.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.PROFILES.BY_ID(id)),
};
