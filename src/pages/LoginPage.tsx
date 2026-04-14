import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth';
import { MicrosoftLoginButton } from '../components/auth/MicrosoftLoginButton';
import {
    getGitHubAuthorizationUrl,
    getGoogleAuthorizationUrl,
    isApiError,
    loginWithPassword,
    saveLoginChallenge,
    saveSessionToken,
} from '../services/authService';

const queryMessageMap: Record<string, string> = {
  missing_code: 'Google no devolvio el code de autorizacion. Intenta iniciar sesion nuevamente.',
  missing_code_github: 'GitHub no devolvio el code de autorizacion. Intenta iniciar sesion nuevamente.',
  two_factor_expired: 'El codigo expiro. Debe iniciar sesion nuevamente.',
};

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
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

  const handlePasswordLogin = async (payload: { email: string; password: string; recaptchaToken: string }) => {
    setLoadingCredentials(true);
    setError(null);

    try {
      const response = await loginWithPassword(payload);

      if (response.requires2FA) {
        saveLoginChallenge({
          sessionId: response.sessionId,
          expiresAt: response.expiresAt,
          remainingAttempts: response.remainingAttempts,
          maskedEmail: response.maskedEmail,
        });
        navigate('/login/2fa', { replace: true });
        return;
      }

      saveSessionToken(response.token);
      navigate('/app', { replace: true });
    } catch (caughtError) {
      if (isApiError(caughtError)) {
        if (caughtError.status === 401) {
          setError('Email o contrasena incorrectos');
        } else if (caughtError.status === 503) {
          setError('No pudimos enviar el codigo de verificacion. Intenta de nuevo en unos minutos.');
        } else {
          setError('No se pudo iniciar sesion con password. Intenta nuevamente.');
        }
      } else {
        setError('No se pudo iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoadingCredentials(false);
    }
  };

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      {/* Background con gradiente moderno */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500" />

      <section className="w-full max-w-md">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600">Accede a tu cuenta de forma segura</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Acceso Seguro</p>
            <h2 className="text-xl font-semibold text-gray-900">Inicia sesión</h2>
          </div>

          {queryError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {queryError}
              </div>
            </div>
          )}

          <div className="mb-6">
            <LoginForm error={error} loading={loadingCredentials} onSubmit={handlePasswordLogin} />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o continúa con</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGoogleLogin}
              disabled={loadingGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loadingGoogle ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-gray-700 font-medium">Continuar con Google</span>
            </button>

            <button
              onClick={startGitHubLogin}
              disabled={loadingGitHub}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loadingGitHub ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              <span className="text-gray-700 font-medium">Continuar con GitHub</span>
            </button>

            <MicrosoftLoginButton
              onSuccess={() => navigate('/app', { replace: true })}
              onError={(err) => setError(err.message)}
            />
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Regístrate
              </button>
            </p>
            <p className="text-sm text-gray-600">
              <button
                onClick={() => navigate('/password-recovery')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Tu seguridad es nuestra prioridad
          </p>
        </div>
      </section>
    </div>
  );
};
