import type { CreateUserInput, UpdateUserInput, User } from '../types';
import { userService } from '../services/userService';
import { useCrudResource } from './useCrudResource';

export const useUsers = () => {
  return useCrudResource<User, CreateUserInput, UpdateUserInput>(userService);
};
