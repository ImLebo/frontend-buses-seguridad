import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Permission } from '../models';
import { userService } from '../services/userService';
import { getUserIdFromToken } from '../utils/jwt';
import { getSessionToken } from '../services/authService';

export interface PermissionCheck {
  module: string;
  action: string;
}

export interface PermissionContextValue {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (checks: PermissionCheck[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

export const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

export const PermissionProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => getSessionToken());
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPermissions = useCallback(async () => {
    if (!token) {
      setPermissions([]);
      setError(null);
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      setPermissions([]);
      setError('No fue posible resolver el usuario desde el token de sesión.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = await userService.getUserPermissions(userId);
      const nextPermissions = Array.isArray(payload?.permissions) ? payload.permissions : [];
      setPermissions(nextPermissions);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'No fue posible cargar permisos del usuario.';
      setPermissions([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const onTokenChanged = () => {
      setToken(getSessionToken());
    };

    window.addEventListener('session-token-changed', onTokenChanged);
    window.addEventListener('storage', onTokenChanged);

    return () => {
      window.removeEventListener('session-token-changed', onTokenChanged);
      window.removeEventListener('storage', onTokenChanged);
    };
  }, []);

  useEffect(() => {
    void refreshPermissions();
  }, [refreshPermissions]);

  const hasPermission = useCallback(
    (module: string, action: string): boolean => {
      const normalizedModule = module.trim().toUpperCase();
      const normalizedAction = action.trim().toUpperCase();

      return permissions.some(
        (permission) =>
          permission.module?.toUpperCase() === normalizedModule &&
          permission.action?.toUpperCase() === normalizedAction,
      );
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (checks: PermissionCheck[]): boolean => {
      return checks.some((check) => hasPermission(check.module, check.action));
    },
    [hasPermission],
  );

  const value = useMemo<PermissionContextValue>(
    () => ({
      permissions,
      loading,
      error,
      hasPermission,
      hasAnyPermission,
      refreshPermissions,
    }),
    [permissions, loading, error, hasPermission, hasAnyPermission, refreshPermissions],
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};
