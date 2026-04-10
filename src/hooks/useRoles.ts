import type { CreateRoleInput, Role, UpdateRoleInput } from '../types';
import { roleService } from '../services/roleService';
import { useCrudResource } from './useCrudResource';

export const useRoles = () => {
  return useCrudResource<Role, CreateRoleInput, UpdateRoleInput>(roleService);
};
