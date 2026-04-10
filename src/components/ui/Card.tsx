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
    <section className={cn('rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200', className)}>
      {(title || description || actions) && (
        <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h3 className="text-lg font-semibold text-text-primary">{title}</h3> : null}
            {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
};
