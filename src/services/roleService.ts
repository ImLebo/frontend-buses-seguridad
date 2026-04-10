import type { CreateRoleInput, Role, UpdateRoleInput } from '../types';
import { apiRequest } from './api';

export const roleService = {
  getAll: () => apiRequest<Role[]>('/roles'),
  create: (input: CreateRoleInput) => apiRequest<Role>('/roles', { method: 'POST', body: input }),
  update: (input: UpdateRoleInput) => apiRequest<Role>(`/roles/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/roles/${id}`, { method: 'DELETE' }),
};
