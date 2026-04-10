import type { PropsWithChildren } from 'react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string;
}

export const Modal = ({ isOpen, title, onClose, className, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={cn(
          'w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-2xl transition-all duration-200',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="mb-5 flex items-center justify-between border-b border-border pb-3">
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
