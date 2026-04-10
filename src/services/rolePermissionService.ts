import type {
  CreateRolePermissionInput,
  RolePermission,
  UpdateRolePermissionInput,
} from '../types';
import { apiRequest } from './api';

export const rolePermissionService = {
  getAll: () => apiRequest<RolePermission[]>('/role-permissions'),
  create: (input: CreateRolePermissionInput) =>
    apiRequest<RolePermission>('/role-permissions', { method: 'POST', body: input }),
  update: (input: UpdateRolePermissionInput) =>
    apiRequest<RolePermission>(`/role-permissions/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/role-permissions/${id}`, { method: 'DELETE' }),
};
