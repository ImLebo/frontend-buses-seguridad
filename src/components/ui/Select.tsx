import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = ({ label, helperText, error, id, className, options, ...props }: SelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-text-secondary" htmlFor={id}>
        {label}
      </label>

      <select
        id={id}
        className={cn(
          'block w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100',
          error && 'border-red-500 focus:border-red-700 focus:ring-red-100',
          className,
        )}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
      {!error && helperText ? <p className="text-xs text-text-muted">{helperText}</p> : null}
    </div>
  );
};