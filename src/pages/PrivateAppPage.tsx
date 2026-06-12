import type { ReactNode } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { RolesPage } from './RolesPage';
import { PermissionsPage } from './PermissionsPage';
import { RolePermissionsPage } from './RolePermissionsPage';
import { UsersPage } from './UsersPage';
import { ProfilesPage } from './ProfilesPage';
import { SessionsPage } from './SessionsPage';
import { useRBAC } from '../hooks/useRBAC';
import { clearSessionToken } from '../services/authService';

type PermissionGateProps = {
  module: string;
  action: string;
  children: ReactNode;
};

const PermissionGate = ({ module, action, children }: PermissionGateProps) => {
  const { loading, hasPermission } = useRBAC();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Validando permisos...</div>;
  }

  if (!hasPermission(module, action)) {
    return <Navigate replace to="/app/unauthorized" />;
  }

  return <>{children}</>;
};

const UnauthorizedPage = () => {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-lg font-semibold">Acceso denegado</h2>
      <p className="mt-2 text-sm">No tienes permisos para acceder a este módulo.</p>
    </section>
  );
};

export const PrivateAppPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useRBAC();

  const getDefaultAuthorizedPath = () => {
    if (hasPermission('USUARIOS', 'READ')) {
      return '/app/users';
    }
    if (hasPermission('ROLES', 'READ')) {
      return '/app/roles';
    }
    if (hasPermission('PERMISOS', 'READ')) {
      return '/app/permissions';
    }

    return '/app/unauthorized';
  };

  const handleLogout = () => {
    clearSessionToken();
    navigate('/login', { replace: true });
  };

  return (
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultAuthorizedPath()} replace />} />
        <Route path="/roles" element={<PermissionGate module="ROLES" action="READ"><RolesPage /></PermissionGate>} />
        <Route path="/permissions" element={<PermissionGate module="PERMISOS" action="READ"><PermissionsPage /></PermissionGate>} />
        <Route path="/role-permissions" element={<PermissionGate module="PERMISOS" action="READ"><RolePermissionsPage /></PermissionGate>} />
        <Route path="/users" element={<PermissionGate module="USUARIOS" action="READ"><UsersPage /></PermissionGate>} />
        <Route path="/profiles" element={<PermissionGate module="USUARIOS" action="READ"><ProfilesPage /></PermissionGate>} />
        <Route path="/sessions" element={<PermissionGate module="USUARIOS" action="READ"><SessionsPage /></PermissionGate>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to={getDefaultAuthorizedPath()} replace />} />
      </Routes>
    </MainLayout>
  );
};
