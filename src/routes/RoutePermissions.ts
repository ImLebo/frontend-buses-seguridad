export interface RoutePermissionConfig {
  module: string;
  action: string;
}

export const RoutePermissions: Record<string, RoutePermissionConfig> = {
  users: { module: 'USUARIOS', action: 'READ' },
  profiles: { module: 'USUARIOS', action: 'READ' }, // Can be adjusted to PROFILES:READ if required
  roles: { module: 'ROLES', action: 'READ' },
  permissions: { module: 'PERMISOS', action: 'READ' },
  rolePermissions: { module: 'PERMISOS', action: 'READ' },
  sessions: { module: 'USUARIOS', action: 'READ' },
  'citizen-routes': { module: 'RUTAS', action: 'READ' },
  'citizen-stops': { module: 'RUTAS', action: 'READ' },
  'citizen-boarding': { module: 'BOLETOS', action: 'CREATE' },
};
