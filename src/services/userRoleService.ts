import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { UserRoleResponse } from '../models';

export const userRoleService = {
  assignRole: (userId: string, roleId: string) =>
    httpClient.post<UserRoleResponse>(ENDPOINTS.USER_ROLE.ASSIGN(userId, roleId)),
  
  removeRole: (userRoleId: string) =>
    httpClient.delete<UserRoleResponse>(ENDPOINTS.USER_ROLE.REMOVE(userRoleId)),

  updateUserRoles: (userId: string, roleIds: string[]) =>
    httpClient.put<UserRoleResponse>(ENDPOINTS.USER_ROLE.UPDATE_BULK(userId), { roleIds }),
};
