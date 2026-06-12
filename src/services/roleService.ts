import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Role, CreateRoleRequest, UpdateRoleRequest, RolePermissionsRequest } from '../models';

export const roleService = {
  getAll: () => httpClient.get<Role[]>(ENDPOINTS.ROLES.BASE),
  create: (input: CreateRoleRequest) => httpClient.post<Role>(ENDPOINTS.ROLES.BASE, input),
  update: (input: UpdateRoleRequest) => httpClient.put<Role>(ENDPOINTS.ROLES.BY_ID(input.id), input),
  remove: (id: string) => httpClient.delete<void>(ENDPOINTS.ROLES.BY_ID(id)),
  updatePermissions: (id: string, input: RolePermissionsRequest) =>
    httpClient.put<Role>(`${ENDPOINTS.ROLES.BY_ID(id)}/permissions`, input),
};
