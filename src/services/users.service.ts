import type { User } from '../types';

export const usersService = {
  async getUsers(): Promise<User[]> {
    // Placeholder service: API integration will be added later.
    return Promise.resolve([]);
  },
};
