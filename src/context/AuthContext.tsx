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
import type { AuthContextType } from '../types/auth-context';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar cambios de autenticación en tiempo real
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = onAuthChange(async (currentUser, token) => {
      if (currentUser) {
        setUser(currentUser);
        setIdToken(token);
        if (token) {
          saveFirebaseCredentials(token, currentUser);
        }
      } else {
        setUser(null);
        setIdToken(null);
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

      setUser(result.user);
      setIdToken(result.idToken);
      
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
      setUser(null);
      setIdToken(null);
      clearStoredFirebaseCredentials();
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

  const value: AuthContextType = {
    user,
    idToken,
    isLoading,
    isAuthenticated: !!user && !!idToken,
    error,
    loginWithMicrosoft,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};