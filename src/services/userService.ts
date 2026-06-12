import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Permission,
  Role,
} from '../models';

export interface UserPermissionsResponse {
  permissions: Permission[];
  count: number;
}

export interface UserWithRoles {
  user: User;
  roles: Role[];
}

export interface UserCompleteInfo {
  user: User;
  roles: Role[];
  permissions: Permission[];
  roleCount: number;
  permissionCount: number;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  photo?: string;
  photoUrl?: string;
  role?: string;
  roles?: string[];
}

export const userService = {
  // CRUD básico
  getAll: () => httpClient.get<User[]>(ENDPOINTS.USERS.BASE),
  create: (input: CreateUserRequest) => httpClient.post<User>(ENDPOINTS.USERS.BASE, input),
  update: (input: UpdateUserRequest) => httpClient.put<User>(ENDPOINTS.USERS.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.USERS.BY_ID(id)),

  // Búsqueda
  searchUsers: (query: string) => httpClient.get<User[]>(ENDPOINTS.USERS.SEARCH(query)),

  // Información con roles
  getUserWithRoles: (userId: string) => httpClient.get<UserWithRoles>(ENDPOINTS.USERS.WITH_ROLES(userId)),

  // Gestión de roles
  getUserRoles: (userId: string) => httpClient.get<Role[]>(ENDPOINTS.USERS.ROLES(userId)),
  assignRole: (userId: string, roleId: string) =>
    httpClient.post<UserWithRoles>(ENDPOINTS.USERS.ROLE_BY_ID(userId, roleId)),
  removeRole: (userId: string, roleId: string) =>
    httpClient.delete<UserWithRoles>(ENDPOINTS.USERS.ROLE_BY_ID(userId, roleId)),
  updateRoles: (userId: string, roleIds: string[]) =>
    httpClient.put<UserWithRoles>(ENDPOINTS.USERS.ROLES(userId), { roleIds }),

  // Permisos
  getUserPermissions: (userId: string) => httpClient.get<UserPermissionsResponse>(ENDPOINTS.USERS.PERMISSIONS(userId)),
  getUserCompleteInfo: (userId: string) => httpClient.get<UserCompleteInfo>(ENDPOINTS.USERS.COMPLETE_INFO(userId)),
  getCurrentUser: () => httpClient.get<CurrentUserResponse>('/users/me'),
};
