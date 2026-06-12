import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUserInfo } from '../hooks/useCurrentUserInfo';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectPath?: string;
}

export const RoleGuard = ({
  allowedRoles,
  children,
  fallback = null,
  redirectPath,
}: RoleGuardProps) => {
  const { currentUserInfo, loading } = useCurrentUserInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Validando roles...</p>
        </div>
      </div>
    );
  }

  const userRoles = currentUserInfo?.roles ?? (currentUserInfo?.role ? [currentUserInfo.role] : []);
  const hasRole = allowedRoles.some((role) =>
    userRoles.map((r) => r.toUpperCase()).includes(role.toUpperCase())
  );

  if (!hasRole) {
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
