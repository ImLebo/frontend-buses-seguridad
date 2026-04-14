import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:from-indigo-600 hover:to-purple-700 focus-visible:ring-indigo-500',
  secondary: 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 hover:from-cyan-600 hover:to-teal-700 focus-visible:ring-cyan-500',
  danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 hover:from-red-600 hover:to-pink-700 focus-visible:ring-red-500',
  ghost: 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-gray-500',
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantClassMap[variant],
        sizeClassMap[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};
