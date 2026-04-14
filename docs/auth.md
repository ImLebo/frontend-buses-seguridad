# Autenticación - Ejemplos de Requests

## Registro Local

```bash
curl -X POST http://localhost:8181/security/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Demo",
    "email": "user@demo.com",
    "password": "123456"
  }'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Login Local

```bash
curl -X POST http://localhost:8181/security/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "123456"
  }'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Obtener URL de Autorización de Microsoft

```bash
curl -X GET http://localhost:8181/security/microsoft/url
```

Respuesta esperada:
```json
{
  "authorizationUrl": "https://login.microsoftonline.com/...",
  "redirectUri": "http://localhost:3000/auth/microsoft/callback"
}
```

## Intercambiar Código de Microsoft por Token

Después de que el usuario se autentique en Microsoft y sea redirigido con el `code`:

```bash
curl -X POST http://localhost:8181/security/microsoft/code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CODE_RECIBIDO_EN_CALLBACK"
  }'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Configuración de Variables de Entorno

Para Microsoft OAuth, configura las siguientes variables en `application.properties`:

```properties
microsoft.tenant=your-tenant-id
microsoft.client-id=your-client-id
microsoft.client-secret=your-client-secret
microsoft.redirect-uri=http://localhost:3000/auth/microsoft/callback
```

## Flujo Completo de Microsoft

1. Llama a `GET /security/microsoft/url` para obtener la URL de autorización.
2. Redirige al usuario a esa URL.
3. Microsoft autentica al usuario y redirige de vuelta con el `code` en la query string.
4. Envía el `code` a `POST /security/microsoft/code` para obtener el token JWT.
5. Usa el token en requests subsiguientes con `Authorization: Bearer <token>`.

## Manejo de Errores

- `400`: Parámetros inválidos
- `401`: Credenciales inválidas
- `409`: Conflicto de cuenta (ej. email ya registrado)
- `500`: Error interno del servidor