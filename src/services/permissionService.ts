import type { CreatePermissionInput, Permission, UpdatePermissionInput } from '../types';
import { apiRequest } from './api';

export const permissionService = {
  getAll: () => apiRequest<Permission[]>('/permissions'),
  create: (input: CreatePermissionInput) => apiRequest<Permission>('/permissions', { method: 'POST', body: input }),
  update: (input: UpdatePermissionInput) => apiRequest<Permission>(`/permissions/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/permissions/${id}`, { method: 'DELETE' }),
};
