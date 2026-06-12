import type { Profile } from './ProfileModel';

export interface ProfileResponse {
  profile: Profile;
  message?: string;
}
