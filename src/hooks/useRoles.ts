import type { CreateRoleRequest, Role, UpdateRoleRequest } from '../models';
import { roleService } from '../services/roleService';
import { useCrudResource } from './useCrudResource';

export const useRoles = () => {
  return useCrudResource<Role, CreateRoleRequest, UpdateRoleRequest>(roleService);
};
