import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Permission, CreatePermissionRequest, UpdatePermissionRequest } from '../models';

export const permissionService = {
  getAll: () => httpClient.get<Permission[]>(ENDPOINTS.PERMISSIONS.BASE),
  create: (input: CreatePermissionRequest) => httpClient.post<Permission>(ENDPOINTS.PERMISSIONS.BASE, input),
  update: (input: UpdatePermissionRequest) => httpClient.put<Permission>(ENDPOINTS.PERMISSIONS.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.PERMISSIONS.BY_ID(id)),
};
