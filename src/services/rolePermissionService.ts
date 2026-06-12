import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { RolePermission, CreateRolePermissionRequest, UpdateRolePermissionRequest } from '../models';

export const rolePermissionService = {
  getAll: () => httpClient.get<RolePermission[]>(ENDPOINTS.ROLE_PERMISSIONS.BASE),
  create: (input: CreateRolePermissionRequest) =>
    httpClient.post<RolePermission>(ENDPOINTS.ROLE_PERMISSIONS.BASE, input),
  update: (input: UpdateRolePermissionRequest) =>
    httpClient.put<RolePermission>(ENDPOINTS.ROLE_PERMISSIONS.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.ROLE_PERMISSIONS.BY_ID(id)),
};
