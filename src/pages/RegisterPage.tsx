import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth';
import { Button } from '../components/ui';
import { isApiError, register, saveLoginChallenge, saveSessionToken } from '../services/authService';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (payload: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await register(payload);

      if (response.requires2FA) {
        saveLoginChallenge({
          sessionId: response.sessionId,
          expiresAt: response.expiresAt,
          remainingAttempts: response.remainingAttempts,
          maskedEmail: response.maskedEmail,
        });
        navigate('/register/2fa', { replace: true });
        return;
      }

      // Si no requiere 2FA, guardar token y redirigir
      // Nota: El backend devuelve token en response.token
      // Pero según tipos, es response.token para requires2FA: false
      // Necesito ajustar si es necesario, pero asumiendo que es igual
      // En LoginResponse, para requires2FA: false, tiene token: string
      // Aquí usamos saveSessionToken como en login
      // Pero wait, en register, si no requiere 2FA, debería tener token
      // En el código de login: saveSessionToken(response.token);
      // Así que aquí igual
      saveSessionToken(response.token);
      navigate('/app', { replace: true });
    } catch (caughtError) {
      if (isApiError(caughtError)) {
        if (caughtError.status === 400) {
          setError(caughtError.message);
        } else if (caughtError.status === 409) {
          setError('El email ya está registrado');
        } else {
          setError('No se pudo registrar. Intenta nuevamente.');
        }
      } else {
        setError('No se pudo registrar. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-100 via-teal-50 to-white" />

      <section className="w-full max-w-lg rounded-3xl border border-border bg-white/95 p-8 shadow-lg backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para acceder al sistema
          </p>
        </div>

        <RegisterForm onSubmit={handleRegister} loading={loading} />

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Button
              variant="ghost"
              className="p-0 text-sm"
              onClick={() => navigate('/login')}
            >
              Inicia sesión
            </Button>
          </p>
        </div>
      </section>
    </div>
  );
};