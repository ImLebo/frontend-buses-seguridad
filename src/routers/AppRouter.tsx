import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { GoogleCallbackPage } from '../pages/GoogleCallbackPage';
import { GitHubCallbackPage } from '../pages/GitHubCallbackPage';
import { LoginPage } from '../pages/LoginPage';
import { PrivateAppPage } from '../pages/PrivateAppPage';
import { getSessionToken } from '../services/authService';

const RequireAuth = () => {
  const token = getSessionToken();

  if (!token) {
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
      <Route element={<GoogleCallbackPage />} path="/auth/google/callback" />
      <Route element={<GitHubCallbackPage />} path="/auth/github/callback" />
      <Route element={<RequireAuth />}>
        <Route element={<PrivateAppPage />} path="/app" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
};
