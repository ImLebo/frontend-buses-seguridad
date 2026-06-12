export interface UpdateRolePermissionRequest {
  id: string;
  role: { id: string };
  permission: { id: string };
}
