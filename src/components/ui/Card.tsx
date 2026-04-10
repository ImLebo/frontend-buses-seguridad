import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends PropsWithChildren {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const Card = ({ title, description, actions, className, children }: CardProps) => {
  return (
    <section className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      {(title || description || actions) && (
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : null}
            {description ? <p className="text-sm text-slate-600">{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
};
