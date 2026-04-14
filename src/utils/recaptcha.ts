/**
 * Helper para Google reCAPTCHA v3
 */

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

if (!SITE_KEY) {
  console.warn('VITE_RECAPTCHA_SITE_KEY no está configurada. reCAPTCHA no funcionará.');
}

/**
 * Obtiene un token de reCAPTCHA v3 para una acción específica
 * @param action - La acción a verificar (ej: 'login', 'password_recovery')
 * @returns Promise<string> - El token de reCAPTCHA
 * @throws Error si reCAPTCHA no está disponible o falla
 */
export const getRecaptchaToken = async (action: string): Promise<string> => {
  if (!SITE_KEY) {
    throw new Error('reCAPTCHA no está configurado. Contacta al administrador.');
  }

  // Verificar que grecaptcha esté disponible
  if (typeof window.grecaptcha === 'undefined') {
    throw new Error('reCAPTCHA no se cargó correctamente. Recarga la página e intenta de nuevo.');
  }

  try {
    // Esperar a que grecaptcha esté listo
    await new Promise<void>((resolve, reject) => {
      window.grecaptcha.ready(() => {
        resolve();
      });

      // Timeout de 10 segundos
      setTimeout(() => {
        reject(new Error('reCAPTCHA tardó demasiado en cargar.'));
      }, 10000);
    });

    // Ejecutar reCAPTCHA
    const token = await window.grecaptcha.execute(SITE_KEY, { action });

    if (!token) {
      throw new Error('No se pudo obtener el token de reCAPTCHA.');
    }

    return token;
  } catch (error) {
    console.error('Error obteniendo token de reCAPTCHA:', error);
    throw new Error('Error de verificación de reCAPTCHA. Intenta de nuevo.');
  }
};

// Declaración de tipos para grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}