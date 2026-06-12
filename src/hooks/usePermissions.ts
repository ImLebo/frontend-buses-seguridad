import type { CreatePermissionRequest, Permission, UpdatePermissionRequest } from '../models';
import { permissionService } from '../services/permissionService';
import { useCrudResource } from './useCrudResource';

export const usePermissions = () => {
  return useCrudResource<Permission, CreatePermissionRequest, UpdatePermissionRequest>(permissionService);
};
