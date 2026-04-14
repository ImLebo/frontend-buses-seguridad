# Firebase Authentication con Microsoft - Guía de Implementación

## 📦 Instalación

### Dependencias ya incluidas
```bash
npm install firebase
```

## 🚀 Configuración Rápida

### 1. Variables de Entorno
Crea `.env.local` en la raíz:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MICROSOFT_TENANT=your_tenant_id  # Opcional
VITE_API_BASE_URL=http://localhost:8181
```

### 2. Configurar Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Authentication → Sign-in method → Habilita Microsoft
3. Configura OAuth con credenciales de Azure AD
4. Copia las credenciales a `.env.local`

### 3. Configurar Azure AD
1. Ve a [Azure Portal](https://portal.azure.com)
2. App registrations → New registration
3. Redirect URI: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copia Client ID y Client Secret a Firebase

Ver [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para instrucciones detalladas.

## 📁 Estructura de Archivos Creados

```
src/
├── services/
│   ├── firebase.ts              # Inicialización de Firebase
│   └── firebaseAuth.ts          # Funciones de autenticación
├── context/
│   └── AuthContext.tsx          # Contexto global de auth
├── hooks/
│   └── useAuth.ts              # Hook para usar el contexto
├── components/auth/
│   ├── MicrosoftLoginButton.tsx # Botón de login
│   └── ProtectedRoute.tsx       # Componente para rutas protegidas
├── types/
│   └── auth-context.ts         # Tipos de TypeScript
└── pages/
    └── LoginPage.tsx           # Página actualizada de login
```

## 🔧 Cómo Usar

### 1. Envolver App con AuthProvider

```tsx
// App.tsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Tu app */}
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 2. Usar Hook en Componentes

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, idToken, isAuthenticated, loginWithMicrosoft, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bienvenido, {user?.displayName}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={loginWithMicrosoft}>Login</button>
      )}
    </div>
  );
}
```

### 3. Proteger Rutas

```tsx
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/app/*"
    element={
      <ProtectedRoute>
        <PrivateApp />
      </ProtectedRoute>
    }
  />
</Routes>
```

### 4. Usar MicrosoftLoginButton

```tsx
import { MicrosoftLoginButton } from '../components/auth/MicrosoftLoginButton';

<MicrosoftLoginButton
  onSuccess={() => navigate('/app')}
  onError={(err) => console.error(err)}
/>
```

## 🔐 Funcionalidades

### AuthContext Properties
```tsx
user              // Objeto del usuario (uid, email, displayName, etc)
idToken          // Token JWT de Firebase
isLoading        // During login/logout
isAuthenticated   // user && idToken
error            // Mensaje de error
```

### AuthContext Methods
```tsx
loginWithMicrosoft()  // Abre popup de Microsoft
logout()              // Cierra sesión y limpia estado
clearError()          // Limpia mensaje de error
```

## 🌐 Persistencia

- **Automática**: Firebase guarda sesión en localStorage
- **Al recargar**: Se recupera del localStorage
- **En AuthChange**: Se escucha cambios en tiempo real

## 🛡️ Seguridad

✅ Sin hardcoding de secrets
✅ Variables en `.env.local` (no commitear)
✅ Validación de nulls
✅ Manejo de errores de popup
✅ ID Token incluido en requests si es necesario

## 🧪 Testing

```tsx
// Simular login exitoso
const { user, idToken, isAuthenticated } = useAuth();

// Verificar estado después de login
expect(isAuthenticated).toBe(true);
expect(user?.email).toBeDefined();
expect(idToken).toBeDefined();
```

## 🐛 Troubleshooting

### Error: "useAuth debe ser usado dentro de AuthProvider"
→ Asegúrate que el componente está dentro de `<AuthProvider>`

### Popup bloqueado
→ Verifica que no hay bloqueador de popups activo

### Usuario no persiste después de refresh
→ Verifica que firebase.ts está inicializando correctamente
→ Abre DevTools → Application → Storage para verificar localStorage

### Token expirado
→ Firebase maneja automáticamente el refresco
→ `getIdToken()` siempre retorna token válido

## 📋 Checklist de Configuración

- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Microsoft Authentication en Firebase
- [ ] Crear app registration en Azure AD
- [ ] Copiar credenciales a `.env.local`
- [ ] Instalar Firebase (`npm install firebase`)
- [ ] Verificar que AuthProvider está en App.tsx
- [ ] Verificar que MicrosoftLoginButton funciona
- [ ] Probar login completo
- [ ] Probar logout
- [ ] Probar refresh de página (persistencia)
- [ ] Probar rutas protegidas

## 📚 Recursos

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Google Cloud Console](https://console.firebase.google.com)
- [Azure Portal](https://portal.azure.com)
- [Tutorial video Firebase + React](https://firebase.google.com/docs/auth/web/start)