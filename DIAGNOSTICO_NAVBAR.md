# 🔍 Diagnóstico: Navbar no muestra información del usuario

## Qué está pasando

Agregué un componente de **debug en la esquina inferior izquierda** de la pantalla que te mostrará exactamente qué datos tiene el sistema.

---

## Cómo diagnosticar el problema

### Paso 1: Abre la aplicación
- Inicia sesión normalmente
- Mira la **esquina inferior izquierda** de la pantalla
- Deberías ver un panel verde (si está autenticado) o amarillo (si no)

### Paso 2: Revisa los datos que muestra

**Si ves VERDE ✅ (Autenticado):**
```json
{
  "displayName": "Tu Nombre",      // ← Debería tener tu nombre
  "email": "tu@email.com",
  "photoURL": "https://...",       // ← Debería tener URL de foto
  "provider": "google",            // ← Debería mostrar: google, github, microsoft
  "uid": "..."
}
```

**Si ves AMARILLO ⚠️ (No autenticado):**
- El usuario no está siendo seteado en Firebase
- Problema: No se inició sesión correctamente

---

## Problemas Comunes y Soluciones

### Problema 1: displayName está vacío (null o undefined)
```javascript
displayName: null              // ❌ Problema
displayName: "Tu Nombre"       // ✅ Correcto
```

**Solución:**
1. El usuario de Google/GitHub no configuró un nombre en su perfil de Firebase
2. O Firebase no está extrayendo el nombre correctamente

**Qué hacer:**
- Ir a https://myaccount.google.com y actualizar tu nombre
- O en GitHub: https://github.com/settings/profile
- Luego salir e iniciar sesión nuevamente

---

### Problema 2: photoURL está vacío
```javascript
photoURL: null        // ❌ Sin foto
photoURL: "https://" // ✅ Con foto
```

**Solución:**
1. Google/GitHub no tiene foto de perfil
2. Firebase no está extrayendo la foto correctamente

**Qué hacer:**
- Ir a tu perfil de Google o GitHub
- Agregar una foto de perfil
- Salir e iniciar sesión nuevamente
- La foto debería aparecer en la navbar

---

### Problema 3: provider es undefined
```javascript
provider: undefined      // ❌ No detectó el proveedor
provider: "google"       // ✅ Detectó correctamente
provider: "github"       // ✅ GitHub OK
provider: "microsoft"    // ✅ Microsoft OK
```

**Solución:**
- Actualiza firebaseAuth.ts - revisa que convertFirebaseUser() está detectando el proveedor
- Verifica que user.providerData tiene datos

---

### Problema 4: Rol no se ve en Navbar
El rol viene del endpoint `/users/me` del backend.

**Si el rol no aparece:**
1. El endpoint `/users/me` no existe en el backend
2. El endpoint devuelve error 403
3. El endpoint no devuelve el campo "role"

**Qué hacer:**
- Asegúrate que el backend tiene `GET /users/me` que devuelve:
```json
{
  "id": "user-id",
  "email": "email",
  "name": "nombre",
  "photo": "url-foto",
  "role": "Admin",        // ← Importante
  "roles": ["Admin"]
}
```

---

## Verificación Rápida

### En la consola del navegador (F12)

**1. Mira los logs de MainLayout:**
```
[MainLayout] Debug: {
  currentUserInfo: {...},
  user: {...},
  final: {
    displayName: "...",
    userPhoto: "...",
    userRole: "...",
    oauthProvider: "..."
  }
}
```

**2. Mira los logs de useCurrentUserInfo:**
```
[useCurrentUserInfo] Fallback a datos de Firebase: ...
```

**3. Mira los logs de Navbar:**
```
[Navbar] Rendered with: {
  displayName: "...",
  userRole: "...",
  userPhoto: "...",
  oauthProvider: "..."
}
```

---

## Versión Simplificada (Sin rol de Backend)

Si el endpoint `/users/me` no existe o no tienes rol configurado, la navbar funciona así:

✅ **Muestra:**
- Nombre (de Firebase)
- Foto (de Firebase)
- Proveedor (detectado automáticamente)

❌ **No muestra:**
- Rol (necesita backend)

---

## Flujo de Datos Correcto

```
Usuario inicia sesión con Google/GitHub
    ↓
Firebase autentica
    ↓
convertFirebaseUser() extrae:
  - displayName ✅
  - photoURL ✅  
  - provider: 'google' ✅
    ↓
MainLayout recibe el user
    ↓
MainLayout pasa a Navbar:
  - userName: displayName
  - userPhoto: photoURL
  - oauthProvider: provider
    ↓
Navbar renderiza con TODA la información
    ↓
✅ Usuario ve su foto, nombre y proveedor
```

---

## Pasos a Seguir AHORA

### 1. ✅ Mira el panel de debug (esquina inferior izquierda)
- ¿Dice VERDE (autenticado) o AMARILLO (no autenticado)?

### 2. 📋 Revisa los datos mostrados
- ¿Tiene displayName?
- ¿Tiene photoURL?
- ¿Tiene provider?

### 3. 🔧 Soluciona según lo que veas faltando:
- **Sin displayName**: Actualiza tu perfil en Google/GitHub
- **Sin photoURL**: Agrega foto en Google/GitHub
- **Sin provider**: Backend/Firebase issue (revisar convertFirebaseUser)
- **Sin rol**: Implementar `/users/me` en backend

### 4. 🧪 Prueba los cambios:
- Salir de la sesión
- Limpiar localStorage: `localStorage.clear()`
- Iniciar sesión nuevamente
- La navbar debería mostrar todo

---

## Si aún así no funciona

### Check backend
```bash
# Verifica que /users/me devuelve correctamente
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8181/users/me
```

### Check Firebase console
- Entra a https://console.firebase.google.com
- Tu proyecto
- Authentication → Providers
- Verifica que Google, GitHub, etc. están correctamente configurados

### Check localStorage
En la consola:
```javascript
// Mira qué token se guardó
localStorage.getItem('authToken')
localStorage.getItem('token')
sessionStorage.getItem('token')

// Mira si Firebase tiene datos
sessionStorage.getItem('firebase')
```

---

## Después de Solucionar - Eliminar el Debug

Una vez que todo funcione, elimina el componente AuthDebug:

1. Abre `MainLayout.tsx`
2. Elimina la línea: `<AuthDebug />`
3. Elimina el import: `import { AuthDebug } from './AuthDebug';`
4. Elimina el archivo: `src/components/layout/AuthDebug.tsx`

---

## 📊 Checklist Final

Una vez que la navbar muestra correctamente:

- [ ] Se ve la foto del usuario (o iniciales si no tiene)
- [ ] Se ve el nombre completo del usuario
- [ ] Se ve el ícono del proveedor (Google, GitHub, etc.)
- [ ] Si implementaste /users/me: Se ve el rol
- [ ] El panel de debug muestra todos los datos llenos

---

## 💡 Resumen Rápido

| Dato | Origen | Si falta |
|------|--------|----------|
| displayName | Firebase | Actualiza perfil Google/GitHub |
| photoURL | Firebase | Agrega foto en Google/GitHub |
| provider | Firebase | Revisa convertFirebaseUser() |
| role | Backend /users/me | Implementar endpoint |

---

**¿Qué ves en el panel de debug? Dime qué campos están vacíos y te ayudaré a solucionar.** 🚀
