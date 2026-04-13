import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui';
import { getGitHubAuthorizationUrl, getGoogleAuthorizationUrl } from '../services/authService';

const queryMessageMap: Record<string, string> = {
  missing_code: 'Google no devolvio el code de autorizacion. Intenta iniciar sesion nuevamente.',
  missing_code_github: 'GitHub no devolvio el code de autorizacion. Intenta iniciar sesion nuevamente.',
};

export const LoginPage = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGitHub, setLoadingGitHub] = useState(false);

  const queryError = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');

    if (!errorCode) {
      return null;
    }

    return queryMessageMap[errorCode] ?? 'No fue posible completar el inicio de sesion.';
  }, [location.search]);

  const startGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError(null);

    try {
      const authorizationUrl = await getGoogleAuthorizationUrl();
      window.location.assign(authorizationUrl);
    } catch {
      setError('No se pudo obtener URL de Google. Intenta nuevamente en unos segundos.');
      setLoadingGoogle(false);
    }
  };

  const startGitHubLogin = async () => {
    setLoadingGitHub(true);
    setError(null);

    try {
      const authorizationUrl = await getGitHubAuthorizationUrl();
      window.location.assign(authorizationUrl);
    } catch {
      setError('No se pudo obtener URL de GitHub. Intenta nuevamente en unos segundos.');
      setLoadingGitHub(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-teal-50 to-white" />

      <section className="w-full max-w-lg rounded-3xl border border-border bg-white/95 p-8 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Acceso seguro</p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">Inicia sesion en la consola</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Usa password, Google o GitHub. Si tu correo ya existe, el backend vinculara proveedores sin duplicar usuarios.
        </p>

        {(queryError || error) && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{queryError ?? error}</div>
        )}

        <div className="mt-7 space-y-3">
          <Button className="w-full" loading={loadingGoogle} onClick={startGoogleLogin} size="lg" type="button">
            Continuar con Google
          </Button>
          <Button className="w-full" loading={loadingGitHub} onClick={startGitHubLogin} size="lg" type="button" variant="ghost">
            Continuar con GitHub
          </Button>
          <Button className="w-full" size="lg" type="button" variant="secondary">
            Ingresar con password
          </Button>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          Consejo: asegurate de configurar la misma redirect URI en Google Cloud Console y backend.
        </p>
      </section>
    </div>
  );
};
