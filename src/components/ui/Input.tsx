import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Input = ({ label, helperText, error, id, className, ...props }: InputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className={cn(
          'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
          className,
        )}
        {...props}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!error && helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
};
