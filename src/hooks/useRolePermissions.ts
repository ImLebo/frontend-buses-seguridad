import type { CreateRolePermissionRequest, RolePermission, UpdateRolePermissionRequest } from '../models';
import { rolePermissionService } from '../services/rolePermissionService';
import { useCrudResource } from './useCrudResource';

export const useRolePermissions = () => {
  return useCrudResource<RolePermission, CreateRolePermissionRequest, UpdateRolePermissionRequest>(rolePermissionService);
};
