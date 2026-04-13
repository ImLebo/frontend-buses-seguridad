import type { PropsWithChildren } from 'react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal = ({ isOpen, title, onClose, className, children, size = 'lg' }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div
        className={cn(
          'w-full rounded-2xl border border-border bg-white p-6 shadow-2xl transition-all duration-200 my-auto max-h-[90vh] overflow-y-auto',
          SIZES[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="mb-5 flex items-center justify-between border-b border-border pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <Button aria-label="Cerrar modal" onClick={onClose} size="sm" variant="ghost" type="button">
            Cerrar
          </Button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};
