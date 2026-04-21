import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from './useAuth';

export interface CurrentUserInfo {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role?: string;
  roles?: string[];
}

interface CurrentUserResponse {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role?: string;
  roles?: string[];
}

export const useCurrentUserInfo = () => {
  const { user, idToken } = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUserInfo = useCallback(async () => {
    if (!user || !idToken) {
      setCurrentUserInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<CurrentUserResponse>('/users/me', {
        method: 'GET',
      });

      setCurrentUserInfo({
        id: response.id,
        email: response.email,
        name: response.name,
        photo: response.photo,
        role: response.role,
        roles: response.roles,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al obtener información del usuario';
      console.warn('[useCurrentUserInfo] Fallback a datos de Firebase:', errorMsg);
      
      // Mantener la información que tenemos del user de Firebase como fallback
      setCurrentUserInfo({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'Usuario',
        photo: user.photoURL || undefined,
      });
      
      // No seteamos error para que no muestre alerta innecesaria
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [user, idToken]);

  useEffect(() => {
    void fetchCurrentUserInfo();
  }, [fetchCurrentUserInfo]);

  return {
    currentUserInfo,
    loading,
    error,
    refetch: fetchCurrentUserInfo,
  };
};
