import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { FirebaseAuthUser } from '../services/firebaseAuth';
import {
  clearStoredFirebaseCredentials,
  loginWithMicrosoft as firebaseLoginWithMicrosoft,
  logoutUser,
  onAuthChange,
  saveFirebaseCredentials,
} from '../services/firebaseAuth';
import { getSessionToken, clearSessionToken } from '../services/authService';

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  provider?: string;
}

export interface AuthContextType {
  user: SessionUser | null;
  idToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [localToken, setLocalToken] = useState<string | null>(() => getSessionToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync token from localStorage/sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setLocalToken(getSessionToken());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('session-token-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('session-token-changed', handleStorageChange);
    };
  }, []);

  // Listen to Firebase auth changes
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthChange(async (currentUser, token) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        setFirebaseToken(token);
        if (token) {
          saveFirebaseCredentials(token, currentUser);
        }
      } else {
        setFirebaseUser(null);
        setFirebaseToken(null);
        clearStoredFirebaseCredentials();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithMicrosoft = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await firebaseLoginWithMicrosoft();
      if (!result.user) {
        throw new Error('No se pudo autenticar con Microsoft');
      }
      setFirebaseUser(result.user);
      setFirebaseToken(result.idToken);
      if (result.idToken) {
        saveFirebaseCredentials(result.idToken, result.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Microsoft login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutUser();
      setFirebaseUser(null);
      setFirebaseToken(null);
      clearStoredFirebaseCredentials();
      clearSessionToken();
      setLocalToken(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      console.error('Logout error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // The user is authenticated if EITHER Firebase has an active session OR a local session JWT is present.
  const isAuthenticated = !!localToken || (!!firebaseUser && !!firebaseToken);
  
  // Resolve user display details
  const user = firebaseUser || (localToken ? { uid: 'local', email: 'user@local.session', displayName: 'Usuario', photoURL: null, emailVerified: true, provider: 'password' } : null);
  const idToken = localToken || firebaseToken;

  const value: AuthContextType = {
    user,
    idToken,
    isLoading,
    isAuthenticated,
    error,
    loginWithMicrosoft,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
