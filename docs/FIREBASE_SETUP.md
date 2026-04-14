# Firebase Authentication con Microsoft

## Configuración de Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Authentication** > **Sign-in method**
4. Habilita **Microsoft** como proveedor
5. Proporciona credenciales OAuth de Azure

### 2. Configurar Azure AD para OAuth

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Busca **App registrations** > **New registration**
3. Completa el formulario:
   - Name: "Firebase-Microsoft-Auth"
   - Supported account types: "Multitenant"
   - Redirect URI: `https://[tu-proyecto].firebaseapp.com/__/auth/handler`

4. Ve a **Certificates & secrets** > **New client secret**
   - Copia el **Client ID** y **Client Secret**

5. Vuelve a Firebase Console > Authentication > Microsoft
   - Pega **Client ID** y **Client Secret**
   - Haz clic en **Save**

### 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Opcional: Para tenant específico
VITE_MICROSOFT_TENANT=your_tenant_id

# Backend
VITE_API_BASE_URL=http://localhost:8181
```

## Arquitectura de Autenticación

```
┌─────────────────────────────────────────────────────────┐
│                    React App                            │
├─────────────────────────────────────────────────────────┤
│  Pages (LoginPage) → Components (MicrosoftLoginButton)  │
│         ↓                              ↓                │
│  useAuth() Hook ← AuthContext (Global State)            │
│         ↓                              ↓                │
│  authService ← services/firebaseAuth.ts                 │
│         ↓                              ↓                │
│  services/firebase.ts → Firebase SDK                    │
│         ↓                              ↓                │
│      Microsoft OAuth Provider                           │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

1. **Usuario hace click en "Continuar con Microsoft"**
   - MicrosoftLoginButton llama a `useAuth().loginWithMicrosoft()`

2. **Se abre popup de Microsoft**
   - Firebase SDK abre popup de autenticación
   - Usuario inicia sesión con credenciales de Microsoft

3. **Firebase obtiene tokens**
   - ID Token
   - Access Token (opcional)
   - User información

4. **Actualizar estado global**
   - AuthContext guarda user + idToken
   - Guardar en localStorage para persistencia
   - Renderizar componentes protegidos

5. **Logout**
   - Llamar a `useAuth().logout()`
   - Limpiar localStorage
   - Redirigir a login

## Componentes Principales

### AuthProvider (Context)
```tsx
<AuthProvider>
  <YourApp />
</AuthProvider>
```

### useAuth Hook
```tsx
const { user, idToken, isAuthenticated, loginWithMicrosoft, logout } = useAuth();
```

### MicrosoftLoginButton Component
```tsx
<MicrosoftLoginButton
  onSuccess={() => navigate('/app')}
  onError={(err) => console.error(err)}
/>
```

### ProtectedRoute Component
```tsx
<ProtectedRoute>
  <PrivatePage />
</ProtectedRoute>
```

## Manejo de Errores

### Toast de errores en MicrosoftLoginButton
- "El popup de inicio de sesión fue bloqueado"
- "El inicio de sesión fue cancelado"
- "Se inició otro popup"

### Logs en consola
Todos los errores se loguean en consola para debugging.

## Persistencia de Sesión

- **Initial Load**: Se recupera del localStorage
- **On Auth State Change**: Firebase escucha cambios en tiempo real
- **On Logout**: Se limpia localStorage

## Seguridad

✅ **No hardcodear secrets**: Todas las credenciales en `.env.local`
✅ **Usar Firebase Auth**: No implementar OAuth manual
✅ **Validar usuario**: Comprobar nulls en contexto
✅ **ID Token**: Incluir en requests al backend si necesita validar

## Integración con Backend

Si tu backend necesita validar el usuario de Microsoft:

```tsx
// Obtener ID Token
const idToken = await getCurrentIdToken();

// Enviar en headers
const response = await fetch('/api/some-protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

## Testing

### Casos de uso a probar
- ✅ Click en botón abre popup
- ✅ Autenticación exitosa guarda user + token
- ✅ Refresh de página mantiene sesión
- ✅ Logout limpia estado
- ✅ Ruta protegida redirige si no autenticado
- ✅ Error de popup bloqueado muestra mensaje

## Troubleshooting

### "El popup fue bloqueado"
- Verifica que no hay bloqueador de popups
- Asegúrate que el click es en el mismo thread

### "CORS error"
- Configurar CORS en backend si es necesario
- Verificar dominio en Firebase Console

### Token expirado
- Firebase maneja automáticamente el refresco
- `getIdToken()` siempre devuelve token válido

### Usuario no aparece después de login
- Verificar que Firebase esté inicializado correctamente
- Revisar logs en Firebase Console
- Verificar variables de entorno