import { useEffect, useState } from 'react';

export interface AlertProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export const Alert = ({
  title,
  message,
  type = 'error',
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose || !isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDuration, isVisible, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: '⚠️',
      btnHover: 'hover:bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: '⚡',
      btnHover: 'hover:bg-yellow-100',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: '✓',
      btnHover: 'hover:bg-green-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'ℹ️',
      btnHover: 'hover:bg-blue-100',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`rounded-lg border ${config.border} ${config.bg} p-4 shadow-sm animate-in fade-in slide-in-from-top-2`}
      role="alert"
    >
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${config.text}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${config.text} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`ml-2 flex-shrink-0 ${config.text} ${config.btnHover} rounded-md p-1 transition-colors`}
          aria-label="Cerrar alerta"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ForbiddenAlert = ({ onClose }: { onClose?: () => void }) => {
  return (
    <Alert
      type="error"
      title="Acceso Denegado"
      message="No tienes permisos suficientes para realizar esta acción. Por favor, contacta con un administrador si crees que esto es un error."
      onClose={onClose}
      autoClose={true}
      autoCloseDuration={7000}
    />
  );
};
