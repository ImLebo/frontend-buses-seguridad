# Rutas del Frontend y Requisitos

Documento de mapeo entre rutas del Frontend (React), roles/permisos necesarios y recursos técnicos vinculados.

| Ruta Frontend | Página (Page) | Permisos Requeridos (Módulo:Acción) | Servicios Consumidos | Hooks Utilizados |
| ------------- | ------------- | ----------------------------------- | -------------------- | ---------------- |
| `/login` | `LoginPage` | *Ninguno (Público)* | `auth.service.ts` | `useAuth` |
| `/app/users` | `UsersPage` | `USUARIOS:READ` | `user.service.ts` | `useUsers` |
| `/app/profiles` | `ProfilesPage` | `USUARIOS:READ` (o `PROFILES:READ`) | `profile.service.ts` | `useProfiles` |
| `/app/roles` | `RolesPage` | `ROLES:READ` | `role.service.ts` | `useRoles` |
| `/app/permissions` | `PermissionsPage` | `PERMISOS:READ` | `permission.service.ts` | `usePermissions` |
| `/app/role-permissions` | `RolePermissionsPage` | `PERMISOS:READ` | `rolePermission.service.ts` | `useRolePermissions` |
| `/app/sessions` | `SessionsPage` | `USUARIOS:READ` | `session.service.ts` | `useSessions` |

## Verificaciones Previas al Desarrollo Visual
- [x] Todas las rutas del backend están documentadas.
- [x] Todos los CRUDs están identificados.
- [x] Todas las reglas de seguridad están documentadas.
- [x] Toda comunicación utiliza el API Gateway.

## Estructura de Guards / RBAC
Cada ruta privada (`/app/*`) debe estar protegida primero por el **Token de Sesión**, y luego mediante el componente `<PermissionGate>` que validará en el estado global si el usuario posee la combinación `Módulo` y `Acción` documentada en esta tabla. Los componentes UI solo utilizarán **Hooks** para invocar peticiones a los servicios, los cuales a su vez emplean **Modelos Tipados** para los Request y Response.
