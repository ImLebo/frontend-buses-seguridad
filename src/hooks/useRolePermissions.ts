import type {
  CreateRolePermissionInput,
  RolePermission,
  UpdateRolePermissionInput,
} from '../types';
import { rolePermissionService } from '../services/rolePermissionService';
import { useCrudResource } from './useCrudResource';

export const useRolePermissions = () => {
  return useCrudResource<
    RolePermission,
    CreateRolePermissionInput,
    UpdateRolePermissionInput
  >(rolePermissionService);
};
