import type { CreateProfileInput, Profile, UpdateProfileInput } from '../types';
import { profileService } from '../services/profileService';
import { useCrudResource } from './useCrudResource';

export const useProfiles = () => {
  return useCrudResource<Profile, CreateProfileInput, UpdateProfileInput>(profileService);
};
