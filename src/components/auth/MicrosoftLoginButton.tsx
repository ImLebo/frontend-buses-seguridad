import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface MicrosoftLoginButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const MicrosoftLoginButton = ({
  className = '',
  onSuccess,
  onError,
}: MicrosoftLoginButtonProps) => {
  const { loginWithMicrosoft, isLoading, error } = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleClick = async () => {
    setIsLoginLoading(true);
    try {
      await loginWithMicrosoft();
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      onError?.(error);
    } finally {
      setIsLoginLoading(true);
    }
  };

  const isDisabled = isLoading || isLoginLoading;
  const displayError = error;

  return (
    <div className="w-full space-y-3">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200
          flex items-center justify-center gap-2
          ${
            isDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }
          ${className}
        `}
      >
        {isDisabled ? (
          <>
            <span className="inline-block animate-spin">◌</span>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6v-11.4H24V24zM11.4 12.6H0V1.2h11.4v11.4zm12.6 0H12.6V1.2H24v11.4z" />
            </svg>
            <span>Continuar con Microsoft</span>
          </>
        )}
      </button>

      {displayError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}
    </div>
  );
};