import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    browserPopupRedirectResolver,
    GithubAuthProvider,
    GoogleAuthProvider,
    initializeAuth,
    OAuthProvider,
    type Auth,
} from 'firebase/auth';

// Configuración de Firebase
// Usa variables de entorno si existen, sino usa valores por defecto
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDA7UmElNlXAnPfDHvfJTcWvvh9Vka8jJ8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'proyecto-react-5fc5b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'proyecto-react-5fc5b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'proyecto-react-5fc5b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '429402941051',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:429402941051:web:c28445382064e5bb41e4de',
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializar Auth con soporte para popup
const auth: Auth = initializeAuth(app, {
  popupRedirectResolver: browserPopupRedirectResolver,
});

// Providers de autenticación
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

export { app, auth };
