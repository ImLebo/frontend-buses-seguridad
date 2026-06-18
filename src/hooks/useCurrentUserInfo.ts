import { useCallback, useEffect, useState } from 'react';
import { getSessionToken } from '../services/authService';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

export interface CurrentUserInfo {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role?: string;
  roles?: string[];
  empresaId?: number;
}

export const useCurrentUserInfo = () => {
  const { user: firebaseUser } = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUserInfo = useCallback(async () => {
    const token = getSessionToken();

    // Primary source of truth: backend session.
    if (token) {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.getCurrentUser();
        setCurrentUserInfo({
          id: response.id,
          email: response.email,
          name: response.name ?? response.displayName ?? 'Usuario',
          photo: response.photo ?? response.photoUrl,
          role: response.role,
          roles: response.roles,
        });
        return;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al obtener informacion del usuario';
        console.warn('[useCurrentUserInfo] Error calling /users/me:', errorMsg);

        // Optional fallback to Firebase if its available.
        if (firebaseUser) {
          console.warn('[useCurrentUserInfo] Falling back to Firebase user fields.');
          setCurrentUserInfo({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Usuario',
            photo: firebaseUser.photoURL || undefined,
          });
          setError(null);
          return;
        }

        setCurrentUserInfo(null);
        setError(errorMsg);
        return;
      } finally {
        setLoading(false);
      }
    }

    // No backend session: fallback to Firebase user data (if any).
    if (firebaseUser) {
      setCurrentUserInfo({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Usuario',
        photo: firebaseUser.photoURL || undefined,
      });
      setError(null);
      return;
    }

    setCurrentUserInfo(null);
  }, [firebaseUser]);

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
