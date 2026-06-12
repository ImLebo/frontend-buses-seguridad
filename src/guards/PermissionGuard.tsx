import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';

interface PermissionGuardProps {
  module: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectPath?: string;
}

export const PermissionGuard = ({
  module,
  action,
  children,
  fallback = null,
  redirectPath,
}: PermissionGuardProps) => {
  const { loading, hasPermission } = useRBAC();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Validando permisos...</p>
        </div>
      </div>
    );
  }

  const hasAccess = hasPermission(module, action);

  if (!hasAccess) {
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const PermissionGate = PermissionGuard;
export default PermissionGuard;
