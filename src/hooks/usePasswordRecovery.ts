import { useState } from 'react';
import { confirmPasswordRecovery, requestPasswordRecovery } from '../services/authService';
import { getRecaptchaToken } from '../utils/recaptcha';

export const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestRecovery = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const recaptchaToken = await getRecaptchaToken('password_recovery');

      await requestPasswordRecovery({
        email: email.trim(),
        recaptchaToken,
      });

      setSuccess('Código enviado correctamente. Redirigiendo...');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmRecovery = async (email: string, code: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await confirmPasswordRecovery({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });

      setSuccess('Contraseña actualizada correctamente.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    requestRecovery,
    confirmRecovery,
    reset,
  };
};