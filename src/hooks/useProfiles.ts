import type { CreateProfileRequest, Profile, UpdateProfileRequest } from '../models';
import { profileService } from '../services/profileService';
import { useCrudResource } from './useCrudResource';

export const useProfiles = () => {
  return useCrudResource<Profile, CreateProfileRequest, UpdateProfileRequest>(profileService);
};
