export interface Permission {
  id: string;
  url?: string;
  method?: string;
  model?: string;
  module?: string; // USUARIOS, BUSES, RUTAS, PROGRAMACIONES, REPORTES, INCIDENTES, MENSAJES
  action?: string; // READ, CREATE, UPDATE, DELETE
  createdAt?: string;
  createdBy?: string;
  isActive?: boolean;
}

export type CreatePermissionInput = Omit<Permission, 'id' | 'createdAt'>;
export type UpdatePermissionInput = Permission;
