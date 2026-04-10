export interface Profile {
  id: string;
  phone: string;
  photo: string;
}

export type CreateProfileInput = Omit<Profile, 'id'>;
export type UpdateProfileInput = Profile;
