import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Input = ({ label, helperText, error, id, className, ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className={cn(
          'block w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
          className,
        )}
        {...props}
      />

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {!error && helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}
    </div>
  );
};
