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
  primary: 'bg-primary text-white shadow-sm hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md focus-visible:ring-primary',
  secondary: 'bg-secondary text-white shadow-sm hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md focus-visible:ring-secondary',
  danger: 'bg-red-700 text-white shadow-sm hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-md focus-visible:ring-red-700',
  ghost: 'bg-transparent text-text-secondary hover:bg-slate-100 focus-visible:ring-accent',
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
