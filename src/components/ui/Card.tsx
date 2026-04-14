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
    <section className={cn(
      'rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-xl shadow-indigo-500/5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-0.5',
      className
    )}>
      {(title || description || actions) && (
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {title ? (
              <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>
          ) : null}
        </header>
      )}
      <div className="text-gray-800">
        {children}
      </div>
    </section>
  );
};
