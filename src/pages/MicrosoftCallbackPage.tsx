// Este archivo es del flujo OAuth REST anterior
// Para Firebase Authentication con Microsoft, NO se necesita página de callback
// Firebase maneja el popup internamente

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
// import { isApiError, saveSessionToken } from '../services/authService';

// const getErrorMessageByStatus = (status: number): string => {
//   if (status === 400) {
//     return 'No se pudo autenticar con Microsoft. Intenta de nuevo.';
//   }
//   if (status === 409) {
//     return 'Tu correo ya tiene un conflicto de vinculacion. Inicia con password o contacta soporte.';
//   }
//   return 'Error OAuth. Intenta nuevamente en unos minutos.';
// };

export const MicrosoftCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const didRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) {
      return;
    }

    didRun.current = true;

    const resolveMicrosoftCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        navigate('/login?error=missing_code_microsoft', { replace: true });
        return;
      }

      // Para Firebase Auth, NO hay intercambio de código
      // Firebase maneja todo internamente en el popup
      // Esta página es OBSOLETA - usar MicrosoftLoginButton en LoginPage en su lugar
      setError('Este flujo es obsoleto. Usa Firebase Authentication con MicrosoftLoginButton.');
    };

    void resolveMicrosoftCallback();
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">OAuth Callback</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">Procesando autenticacion</h1>

        {!error && <p className="mt-4 text-sm text-text-secondary">Validando credenciales de Microsoft contra el backend...</p>}

        {error && (
          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/login', { replace: true })} type="button" variant="primary">
                Volver al login
              </Button>
              <Link to="/login">
                <Button type="button" variant="ghost">
                  Reintentar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};