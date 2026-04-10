import type {
  CreatePermissionInput,
  Permission,
  UpdatePermissionInput,
} from '../types';
import { permissionService } from '../services/permissionService';
import { useCrudResource } from './useCrudResource';

export const usePermissions = () => {
  return useCrudResource<Permission, CreatePermissionInput, UpdatePermissionInput>(permissionService);
};
