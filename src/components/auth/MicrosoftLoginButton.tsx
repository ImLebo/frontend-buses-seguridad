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
  const { loginWithMicrosoft, isLoading } = useAuth();
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

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
        ${className}
      `}
    >
      {isDisabled ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6v-11.4H24V24zM11.4 12.6H0V1.2h11.4v11.4zm12.6 0H12.6V1.2H24v11.4z" />
          </svg>
          <span className="text-gray-700 font-medium">Continuar con Microsoft</span>
        </>
      )}
    </button>
  );
};