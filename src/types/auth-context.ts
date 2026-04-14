import type { FirebaseAuthUser } from '../services/firebaseAuth';

export interface AuthContextType {
  // Estado
  user: FirebaseAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  idToken: string | null;

  // Acciones
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}