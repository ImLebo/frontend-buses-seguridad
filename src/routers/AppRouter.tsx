import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { GitHubCallbackPage } from '../pages/GitHubCallbackPage';
import { GoogleCallbackPage } from '../pages/GoogleCallbackPage';
import { LoginPage } from '../pages/LoginPage';
import { PasswordRecoveryConfirmPage } from '../pages/PasswordRecoveryConfirmPage';
import { PasswordRecoveryPage } from '../pages/PasswordRecoveryPage';
import { PrivateAppPage } from '../pages/PrivateAppPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RegisterTwoFactorPage } from '../pages/RegisterTwoFactorPage';
import { TwoFactorPage } from '../pages/TwoFactorPage.tsx';
import { apiRequest } from '../services/api';
import { clearSessionToken, getSessionToken } from '../services/authService';

const RequireAuth = () => {
  const token = getSessionToken();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // HU-ENTR-1-009: Validar token pasando primero por el API gateway
        const response = await apiRequest<{ valid: boolean }>('/security/validate-token', {
          method: 'POST',
          body: { token },
        });

        setIsValid(response.valid === true);
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValid(false);
        clearSessionToken();
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValidating) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!isValid) {
    // HU-ENTR-1-009: Sesión expirada
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

const RedirectBySession = () => {
  const token = getSessionToken();

  if (token) {
    return <Navigate replace to="/app" />;
  }

  return <Navigate replace to="/login" />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<RedirectBySession />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<PasswordRecoveryPage />} path="/password-recovery" />
      <Route element={<PasswordRecoveryConfirmPage />} path="/password-recovery/confirm" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<TwoFactorPage />} path="/login/2fa" />
      <Route element={<RegisterTwoFactorPage />} path="/register/2fa" />
      <Route element={<GoogleCallbackPage />} path="/auth/google/callback" />
      <Route element={<GitHubCallbackPage />} path="/auth/github/callback" />
      <Route element={<RequireAuth />}>
        <Route element={<PrivateAppPage />} path="/app/*" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
};
