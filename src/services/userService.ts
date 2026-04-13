import type { CreateUserInput, UpdateUserInput, User } from '../types';
import { apiRequest } from './api';

export interface UserWithRoles {
  user: User;
  roles: any[];
}

export interface UserCompleteInfo {
  user: User;
  roles: any[];
  permissions: any[];
  roleCount: number;
  permissionCount: number;
}

export const userService = {
  // CRUD básico
  getAll: () => apiRequest<User[]>('/users'),
  create: (input: CreateUserInput) => apiRequest<User>('/users', { method: 'POST', body: input }),
  update: (input: UpdateUserInput) => apiRequest<User>(`/users/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),

  // Búsqueda
  searchUsers: (query: string) => apiRequest<User[]>(`/users/search?q=${encodeURIComponent(query)}`),

  // Información con roles
  getUserWithRoles: (userId: string) => apiRequest<UserWithRoles>(`/users/${userId}/with-roles`),

  // Gestión de roles
  getUserRoles: (userId: string) => apiRequest<any[]>(`/users/${userId}/roles`),
  assignRole: (userId: string, roleId: string) =>
    apiRequest<any>(`/users/${userId}/roles/${roleId}`, { method: 'POST' }),
  removeRole: (userId: string, roleId: string) =>
    apiRequest<any>(`/users/${userId}/roles/${roleId}`, { method: 'DELETE' }),
  updateRoles: (userId: string, roleIds: string[]) =>
    apiRequest<any>(`/users/${userId}/roles`, { method: 'PUT', body: { roleIds } }),

  // Permisos
  getUserPermissions: (userId: string) => apiRequest<any>(`/users/${userId}/permissions`),
  getUserCompleteInfo: (userId: string) => apiRequest<UserCompleteInfo>(`/users/${userId}/complete-info`),
};
