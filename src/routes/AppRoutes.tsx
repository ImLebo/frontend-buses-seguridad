import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
import { PrivateRoutes } from './PrivateRoutes';
import { getSessionToken } from '../services/authService';

const RedirectBySession = () => {
  const token = getSessionToken();

  if (token) {
    return <Navigate replace to="/app" />;
  }

  return <Navigate replace to="/login" />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RedirectBySession />} path="/" />
      {PublicRoutes}
      {PrivateRoutes}
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
};

export default AppRoutes;
