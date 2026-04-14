import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
} from 'firebase/auth';
import { auth, microsoftProvider } from './firebase';

export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface FirebaseAuthResult {
  user: FirebaseAuthUser | null;
  idToken: string | null;
}

/**
 * Convertir usuario de Firebase a nuestro tipo local
 */
const convertFirebaseUser = (user: User | null): FirebaseAuthUser | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
};

/**
 * Login con Microsoft usando Firebase Authentication
 * @throws Error si el popup es bloqueado o hay error de autenticación
 */
export const loginWithMicrosoft = async (): Promise<FirebaseAuthResult> => {
  try {
    // Configurar tenant específico (opcional)
    const tenant = import.meta.env.VITE_MICROSOFT_TENANT;
    if (tenant && tenant !== 'common') {
      microsoftProvider.setCustomParameters({
        tenant,
      });
    }

    const result = await signInWithPopup(auth, microsoftProvider);
    
    if (!result.user) {
      throw new Error('No user returned from Microsoft auth');
    }

    const idToken = await result.user.getIdToken();
    
    return {
      user: convertFirebaseUser(result.user),
      idToken,
    };
  } catch (error) {
    const errorCode = (error as any)?.code;
    
    // Manejo específico de errores
    if (errorCode === 'auth/popup-blocked') {
      throw new Error('El popup de inicio de sesión fue bloqueado. Verifica tu navegador.');
    }
    
    if (errorCode === 'auth/popup-closed-by-user') {
      throw new Error('El inicio de sesión fue cancelado.');
    }
    
    if (errorCode === 'auth/cancelled-popup-request') {
      throw new Error('Se inició otro popup. Intenta nuevamente.');
    }

    throw error;
  }
};

/**
 * Logout del usuario actual
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Obtener usuario actual sin esperar (cache)
 */
export const getCurrentUser = (): FirebaseAuthUser | null => {
  const user = auth.currentUser;
  return convertFirebaseUser(user);
};

/**
 * Obtener ID token del usuario actual
 */
export const getCurrentIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Escuchar cambios de autenticación
 * @param callback Función que se ejecuta cuando cambia el estado
 * @returns Función para desuscribirse
 */
export const onAuthChange = (
  callback: (user: FirebaseAuthUser | null, idToken: string | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    const convertedUser = convertFirebaseUser(user);
    const idToken = user ? await user.getIdToken() : null;
    callback(convertedUser, idToken);
  });
};

/**
 * Persistir credenciales en localStorage
 */
export const saveFirebaseCredentials = (idToken: string, user: FirebaseAuthUser): void => {
  localStorage.setItem('firebase_id_token', idToken);
  localStorage.setItem('firebase_user', JSON.stringify(user));
};

/**
 * Recuperar credenciales del localStorage
 */
export const getStoredFirebaseCredentials = (): { idToken: string; user: FirebaseAuthUser } | null => {
  const idToken = localStorage.getItem('firebase_id_token');
  const userStr = localStorage.getItem('firebase_user');

  if (!idToken || !userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return { idToken, user };
  } catch {
    return null;
  }
};

/**
 * Limpiar credenciales del localStorage
 */
export const clearStoredFirebaseCredentials = (): void => {
  localStorage.removeItem('firebase_id_token');
  localStorage.removeItem('firebase_user');
};