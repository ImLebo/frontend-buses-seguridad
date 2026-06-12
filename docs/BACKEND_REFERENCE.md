# Referencia del Backend (API Gateway)

Esta documentación sirve como la única fuente de verdad para el consumo de servicios desde el Frontend. Todos los endpoints apuntan al API Gateway.

**URL Base (API Gateway)**: `http://localhost:8181`
**Autenticación**: Tipo Bearer Token (JWT).
**Headers Base Requeridos** (Para rutas protegidas):
- `Authorization`: `Bearer {token}`
- `Content-Type`: `application/json`

---

## 1. Inventario de Rutas y CRUDs del Sistema

### Módulo: Security
Sistema de seguridad, inicio de sesión y validación de tokens.

#### Login
- **Endpoint**: `/security/login`
- **Método**: `POST`
- **Descripción**: Autentica a un usuario y retorna los tokens de acceso.
- **Headers**: Ninguno (Público).
- **Payload**:
  ```json
  {
    "email": "admin@demo.com",
    "password": "password123"
  }
  ```
- **Respuesta Exitosa**: Sesión/Token JWT.

---

### Módulo: Users
Gestión de cuentas de usuario y sus relaciones (Perfiles y Sesiones).

#### Get All Users (Read)
- **Endpoint**: `/users`
- **Método**: `GET`
- **Descripción**: Obtiene la lista completa de usuarios.
- **Permisos requeridos**: `USUARIOS:READ`

#### Get User By Id (Read)
- **Endpoint**: `/users/{id}`
- **Método**: `GET`
- **Parámetros de ruta**: `id` (string/number)
- **Permisos requeridos**: `USUARIOS:READ`

#### Create User (Create)
- **Endpoint**: `/users`
- **Método**: `POST`
- **Payload**:
  ```json
  {
    "name": "Usuario Demo",
    "email": "user@demo.com",
    "password": "password"
  }
  ```
- **Permisos requeridos**: `USUARIOS:CREATE`

#### Update User (Update)
- **Endpoint**: `/users/{id}`
- **Método**: `PUT`
- **Payload**:
  ```json
  {
    "name": "Usuario Actualizado",
    "email": "user.updated@demo.com",
    "password": "newpassword"
  }
  ```
- **Permisos requeridos**: `USUARIOS:UPDATE`

#### Delete User (Delete)
- **Endpoint**: `/users/{id}`
- **Método**: `DELETE`
- **Permisos requeridos**: `USUARIOS:DELETE`

#### Relaciones de Usuario
- **Add User Profile**: `POST /users/{userId}/profile/{profileId}`
- **Delete User Profile**: `DELETE /users/{userId}/profile/{profileId}`
- **Add User Session**: `POST /users/{userId}/session/{sessionId}`
- **Delete User Session**: `DELETE /users/{userId}/session/{sessionId}`

---

### Módulo: Profiles
Información extendida del usuario (teléfono, foto, etc.).

#### CRUD de Profiles
- **Get All Profiles**: `GET /profiles`
- **Get Profile By Id**: `GET /profiles/{id}`
- **Create Profile**: `POST /profiles`
  - Payload: `{ "phone": "123456", "photo": "url..." }`
- **Update Profile**: `PUT /profiles/{id}`
- **Delete Profile**: `DELETE /profiles/{id}`

---

### Módulo: Roles
Roles del sistema.

#### CRUD de Roles
- **Get All Roles**: `GET /roles`
- **Get Role By Id**: `GET /roles/{id}`
- **Create Role**: `POST /roles`
  - Payload: `{ "name": "ADMIN", "description": "Rol administrador" }`
- **Update Role**: `PUT /roles/{id}`
- **Delete Role**: `DELETE /roles/{id}`
- **Permisos requeridos**: `ROLES:READ`, `ROLES:CREATE`, `ROLES:UPDATE`, `ROLES:DELETE`

---

### Módulo: Permissions
Permisos del sistema a nivel de API (Método y URL).

#### CRUD de Permissions
- **Get All Permissions**: `GET /permissions`
- **Get Permission By Id**: `GET /permissions/{id}`
- **Create Permission**: `POST /permissions`
  - Payload: `{ "url": "/users", "method": "GET", "model": "User" }`
- **Update Permission**: `PUT /permissions/{id}`
- **Delete Permission**: `DELETE /permissions/{id}`
- **Permisos requeridos**: `PERMISOS:READ`, `PERMISOS:CREATE`, `PERMISOS:UPDATE`, `PERMISOS:DELETE`

---

### Módulo: Sessions
Sesiones activas e información de 2FA.

#### CRUD de Sessions
- **Get All Sessions**: `GET /sessions`
- **Get Session By Id**: `GET /sessions/{id}`
- **Create Session**: `POST /sessions`
  - Payload: `{ "token": "...", "expiration": "2026-12-31...", "code2FA": "123456" }`
- **Update Session**: `PUT /sessions/{id}`
- **Delete Session**: `DELETE /sessions/{id}`

---

### Módulo: Relaciones (Role Permissions & User Roles)

#### Role Permissions
- **Get All**: `GET /role-permissions`
- **Get By Id**: `GET /role-permissions/{id}`
- **Create**: `POST /role-permissions` (Payload: `{ "role": { "id": "..." }, "permission": { "id": "..." } }`)
- **Update**: `PUT /role-permissions/{id}`
- **Delete**: `DELETE /role-permissions/{id}`

#### User Role
- **Add User Role**: `POST /user-role/user/{userId}/role/{roleId}`
- **Remove User Role**: `DELETE /user-role/{userRoleId}`

---

### Módulos de Negocio (Backend Buses Negocio)
Estas rutas representan las entidades core del negocio y están dirigidas a `http://localhost:3000` internamente a través del API Gateway. Siguen las mismas políticas de autenticación y se asumen operaciones CRUD estándar, dependiendo de los permisos definidos (ej. `BUS:READ`, `BUS:CREATE`).

Rutas disponibles en el servicio de negocio:
- `/bus`
- `/ciudadano`
- `/conductor`
- `/designatario-grupo`
- `/designatario-persona`
- `/direccion`
- `/empresa`
- `/foto`
- `/gps`
- `/grupo`
- `/grupo-persona`
- `/historial`
- `/incidente`
- `/incidente-bus`
- `/mensaje`
- `/metodo-pago`
- `/metodo-pago-ciudadano`
- `/nodo`
- `/paradero`
- `/persona`
- `/programacion`
- `/recarga`
- `/reportes`
- `/ruta`
- `/turno`

---

## 2. Lógica de Negocio y Sistema de Seguridad
- **Autenticación**: Todo se basa en JWT. El token debe enviarse en la cabecera `Authorization: Bearer <token>`.
- **API Gateway**: Es la única puerta de entrada y se encarga de aplicar los Guards, Middlewares y verificar Políticas de autorización.
- **Microservicios ocultos**: El Frontend NUNCA debe apuntar directamente al `backend-buses-negocio` ni `backend-buses-seguridad`. Las validaciones de RBAC en el Gateway deben ser respetadas.
