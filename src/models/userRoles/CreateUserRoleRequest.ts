export interface AssignUserRoleRequest {
  userId: string;
  roleId: string;
}

export interface UpdateUserRolesRequest {
  roleIds: string[];
}
