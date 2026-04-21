# Guía: Implementación de Guards y Mejora del Navbar

## 📋 Resumen de Cambios

Se han implementado dos mejoras principales en el frontend:

1. **Manejo de Guards (Autorización 403)**: Alertas cuando el usuario no tiene permisos para realizar una acción
2. **Mejora del Navbar**: Mostrar foto/proveedor OAuth, nombre y rol del usuario

---

## 🔐 1. Manejo de Autorización (Guards)

### Lo que pasó en el Backend
Se agregaron guards que validan permisos antes de permitir acciones como:
- Crear usuarios
- Editar usuarios
- Eliminar usuarios
- Asignar roles
- Crear/modificar roles, permisos, etc.

Cuando un usuario NO tiene permisos, el backend devuelve **error 403 (Forbidden)**.

### Cómo Funciona en el Frontend

#### A. Componente Alert (Nuevo)
Se creó un componente reutilizable para mostrar alertas:

```
src/components/ui/Alert.tsx
```

**Tipos de alertas:**
- **error**: Rojo (para errores y acceso denegado)
- **warning**: Amarillo (para advertencias)
- **success**: Verde (para confirmaciones)
- **info**: Azul (para información)

**Uso simple:**
```tsx
<Alert
  type="error"
  title="Acceso Denegado"
  message="No tienes permisos para crear usuarios"
  onClose={() => setError(null)}
  autoClose={true}
  autoCloseDuration={7000}
/>
```

#### B. Actualización del hook useCrudResource
El hook ahora devuelve:

```tsx
const {
  data,
  loading,
  error,           // Objeto con { message, status, isForbidden }
  authError,       // String específico para errores 403
  create,
  update,
  remove,
  clearError,      // Función para limpiar errores
} = useUsers();
```

**Cuando ocurre un error 403:**
```tsx
// authError = "No tienes permisos para crear registros"
// error.isForbidden = true
// error.status = 403
```

### Implementación en Páginas CRUD

Usa **UsersPage.tsx** como referencia. Está completamente actualizada.

Para las otras páginas (RolesPage, PermissionsPage, etc.), sigue este patrón:

#### 1. Importa el componente Alert
```tsx
import { Alert, Button, Card, /* ... */ } from '../components/ui';
```

#### 2. Obtén los valores del hook CRUD
```tsx
const { data, loading, error, authError, create, update, remove, clearError } = useYourResource();
```

#### 3. Muestra las alertas (dentro del JSX)
```tsx
{authError && (
  <Alert
    type="error"
    title="Acceso Denegado"
    message={authError}
    onClose={() => clearError()}
    autoClose={true}
    autoCloseDuration={7000}
  />
)}

{error && !authError && (
  <Alert
    type="error"
    title="Error"
    message={error.message || 'Ocurrió un error'}
    onClose={() => clearError()}
    autoClose={false}
  />
)}
```

#### 4. Maneja errores 403 en métodos específicos
```tsx
const handleSaveRoles = async () => {
  try {
    // Tu código aquí
    await userService.updateRoles(userId, roleIds);
  } catch (err) {
    const apiError = err as any;
    
    if (apiError.status === 403) {
      setError('No tienes permisos para asignar roles');
    } else {
      setError(err.message || 'Error desconocido');
    }
  }
};
```

---

## 👤 2. Mejora del Navbar

### Lo que Cambió

El navbar ahora muestra:

1. **Foto del Usuario**: 
   - Si existe foto en la BD, la muestra
   - Si no, muestra iniciales en un círculo

2. **Proveedor OAuth**: 
   - Icono de Google, GitHub, Microsoft, etc.
   - Junto al status de "Sesión activa"

3. **Nombre del Usuario**: 
   - Del perfil BD (si existe)
   - O del usuario de Firebase (si no)

4. **Rol del Usuario**:
   - Muestra el rol principal del usuario
   - Se obtiene del endpoint `/users/me` del backend

### Componentes Modificados

#### 1. Navbar.tsx
```tsx
interface NavbarProps {
  title?: string;
  userName?: string;
  userRole?: string;          // ✨ Nuevo
  userPhoto?: string;         // ✨ Nuevo
  oauthProvider?: string;     // ✨ Nuevo (google, github, microsoft)
  onMenuClick?: () => void;
  onLogout?: () => void;
}
```

#### 2. MainLayout.tsx
Ahora obtiene la información del usuario y la pasa al Navbar:

```tsx
const { user } = useAuth();
const { currentUserInfo } = useCurrentUserInfo();

const displayName = currentUserInfo?.name || user?.displayName || 'Operador';
const userPhoto = currentUserInfo?.photo || user?.photoURL || undefined;
const userRole = currentUserInfo?.role || currentUserInfo?.roles?.[0] || undefined;
const oauthProvider = user?.provider;

<Navbar
  userName={displayName}
  userPhoto={userPhoto}
  userRole={userRole}
  oauthProvider={oauthProvider}
/>
```

#### 3. Hook useCurrentUserInfo (Nuevo)
```
src/hooks/useCurrentUserInfo.ts
```

**Responsabilidades:**
- Obtiene la información completa del usuario del backend
- Endpoint: `GET /users/me`
- Almacena: nombre, email, foto, rol, roles
- Usa fallback a Firebase si falla

**Uso:**
```tsx
const { currentUserInfo, loading, error, refetch } = useCurrentUserInfo();

// currentUserInfo = {
//   id: string
//   email: string
//   name: string
//   photo?: string
//   role?: string
//   roles?: string[]
// }
```

#### 4. firebaseAuth.ts - Detección de Proveedor
Se agregó detección automática del proveedor OAuth:

```tsx
export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  provider?: string;  // ✨ Nuevo: google, github, microsoft, etc.
}
```

La función `convertFirebaseUser` detecta automáticamente el proveedor:

```tsx
const convertFirebaseUser = (user: User | null): FirebaseAuthUser | null => {
  if (!user) return null;
  
  let provider: string | undefined;
  if (user.providerData && user.providerData.length > 0) {
    const providerId = user.providerData[0].providerId;
    if (providerId.includes('google')) provider = 'google';
    else if (providerId.includes('github')) provider = 'github';
    else if (providerId.includes('microsoft')) provider = 'microsoft';
    // ...
  }
  
  return {
    // ...
    provider,
  };
};
```

---

## 🔄 Checklist de Implementación

### Para el Backend
- [ ] Asegúrate de que los guards estén implementados y devuelvan 403
- [ ] El endpoint `GET /users/me` devuelve: `{ id, email, name, photo?, role?, roles? }`
- [ ] Los mensajes de error 403 sean descriptivos (incluidos en el body de la respuesta)

### Para el Frontend
- [x] Alert.tsx creado en `src/components/ui`
- [x] useCrudResource.ts actualizado con authError y clearError
- [x] Navbar.tsx mejora para mostrar usuario, rol y proveedor
- [x] MainLayout.tsx actualizado para pasar datos al Navbar
- [x] useCurrentUserInfo.ts creado
- [x] firebaseAuth.ts detecta el proveedor OAuth
- [x] UsersPage.tsx completamente actualizada como referencia
- [ ] Actualizar TODAS las otras páginas CRUD (RolesPage, PermissionsPage, etc.)

### Páginas CRUD que Necesitan Actualización
```
src/pages/
├── RolesPage.tsx          ← Actualizar
├── PermissionsPage.tsx    ← Actualizar
├── ProfilesPage.tsx       ← Actualizar
├── RolePermissionsPage.tsx ← Actualizar
├── SessionsPage.tsx       ← Actualizar
└── UsersPage.tsx          ✅ (Ya actualizada)
```

---

## 📝 Pasos para Actualizar una Página CRUD

### Ejemplo: RolesPage.tsx

1. **Importa Alert y destructura el hook**
```tsx
import { Alert, Button, Card, /* ... */ } from '../components/ui';

const { data, loading, error, authError, create, update, remove, clearError } = useRoles();
```

2. **Agrega estado si tiene modal/operaciones especiales**
```tsx
const [roleError, setRoleError] = useState<string | null>(null);
```

3. **Reemplaza alertas HTML con Alert component**
```tsx
// ❌ Antes
{error ? (
  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
    {error}
  </div>
) : null}

// ✅ Después
{authError && (
  <Alert
    type="error"
    title="Acceso Denegado"
    message={authError}
    onClose={() => clearError()}
  />
)}

{error && !authError && (
  <Alert
    type="error"
    title="Error"
    message={error.message || 'Ocurrió un error'}
    onClose={() => clearError()}
  />
)}
```

4. **Maneja errores 403 en métodos**
```tsx
const handleCreateRole = async (values: CreateRoleInput) => {
  try {
    await create(values);
    // Cerrar modal, etc.
  } catch (err) {
    const apiError = err as any;
    if (apiError.status === 403) {
      setRoleError('No tienes permisos para crear roles');
    }
  }
};
```

---

## 🎨 Algunos Ejemplos de Alertas

### Error de Autorización (403)
```tsx
<Alert
  type="error"
  title="Acceso Denegado"
  message="No tienes permisos para crear usuarios. Contacta con un administrador."
  autoClose={true}
  autoCloseDuration={7000}
/>
```

### Error General
```tsx
<Alert
  type="error"
  title="Error al Cargar"
  message="No fue posible conectar con el servidor"
  autoClose={false}
/>
```

### Advertencia
```tsx
<Alert
  type="warning"
  title="Atención"
  message="Este campo es obligatorio"
  autoClose={true}
/>
```

### Éxito
```tsx
<Alert
  type="success"
  title="¡Éxito!"
  message="Usuario creado correctamente"
  autoClose={true}
  autoCloseDuration={3000}
/>
```

---

## 🧪 Cómo Probar

### 1. Probar Alertas de Error 403
- Crea un usuario con rol restringido
- Intenta crear un usuario, editar, etc.
- Deberías ver la alerta roja "Acceso Denegado"

### 2. Probar el Navbar
- Inicia sesión con Google, GitHub o Microsoft
- Deberías ver:
  - ✅ Tu foto de perfil (si existe)
  - ✅ El logo del proveedor (Google, GitHub, etc.)
  - ✅ Tu nombre
  - ✅ Tu rol

---

## 📚 Archivos Nuevos Creados

```
src/
├── components/ui/
│   └── Alert.tsx                 ← Componente alerta reutilizable
├── hooks/
│   └── useCurrentUserInfo.ts      ← Hook para obtener info del usuario actual
└── pages/
    └── UsersPage.tsx             ← Actualizada como referencia
```

---

## 🔗 Referencias Rápidas

### Importar Alert
```tsx
import { Alert } from '../components/ui';
```

### Usar useCurrentUserInfo
```tsx
import { useCurrentUserInfo } from '../hooks/useCurrentUserInfo';

const { currentUserInfo, loading, error } = useCurrentUserInfo();
```

### Destructurar hook CRUD
```tsx
const { data, loading, error, authError, create, update, remove, clearError } = useYourResource();
```

### Tipos del componente Alert
```tsx
type AlertType = 'error' | 'warning' | 'success' | 'info';
```

---

## ⚠️ Notas Importantes

1. **El endpoint `/users/me` debe existir en el backend**
   - Si no existe, crea uno que devuelva la información del usuario autenticado
   - Estructura esperada:
   ```json
   {
     "id": "string",
     "email": "string",
     "name": "string",
     "photo": "string (opcional)",
     "role": "string (opcional)",
     "roles": ["string"] (opcional)
   }
   ```

2. **Los guards deben estar en el backend**
   - Cada endpoint debe validar permisos
   - Devolver 403 si no está autorizado
   - Incluir mensaje descriptivo en el error

3. **El hook useCurrentUserInfo hace fallback a Firebase**
   - Si el backend no responde, usa datos de Firebase
   - Esto asegura que siempre haya un nombre mostrado

4. **Los mensajes de error deben ser claros**
   - Ej: "No tienes permisos para crear usuarios"
   - No: "Error 403"

---

## 🚀 Próximos Pasos

1. ✅ Revisar implementación en UsersPage.tsx
2. [ ] Actualizar todas las páginas CRUD siguiendo el patrón
3. [ ] Probar guardrails con usuarios con roles restringidos
4. [ ] Verificar que el endpoint `/users/me` funciona correctamente
5. [ ] Revisar mensajes de error en el backend para hacerlos más descriptivos
