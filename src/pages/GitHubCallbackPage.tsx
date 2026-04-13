import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { exchangeGitHubCode, isApiError, saveSessionToken } from '../services/authService';

const getErrorMessageByStatus = (status: number): string => {
  if (status === 400) {
    return 'No se pudo autenticar con GitHub. Intenta de nuevo.';
  }

  if (status === 409) {
    return 'Tu correo ya tiene un conflicto de vinculacion. Inicia con password o contacta soporte.';
  }

  return 'Error OAuth GitHub. Intenta nuevamente en unos minutos.';
};

export const GitHubCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const didRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) {
      return;
    }

    didRun.current = true;

    const resolveGitHubCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        navigate('/login?error=missing_code_github', { replace: true });
        return;
      }

      try {
        const payload = await exchangeGitHubCode(code);
        saveSessionToken(payload.token);
        navigate('/app', { replace: true });
      } catch (caughtError) {
        if (isApiError(caughtError)) {
          setError(getErrorMessageByStatus(caughtError.status));
          return;
        }

        setError('No fue posible completar la autenticacion con GitHub.');
      }
    };

    void resolveGitHubCallback();
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">OAuth Callback</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">Procesando autenticacion</h1>

        {!error && <p className="mt-4 text-sm text-text-secondary">Validando credenciales de GitHub contra el backend...</p>}

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
