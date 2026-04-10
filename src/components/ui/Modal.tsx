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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <div className={cn('w-full max-w-xl rounded-xl bg-white p-5 shadow-xl', className)} role="dialog" aria-modal="true" aria-label={title}>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <Button aria-label="Cerrar modal" onClick={onClose} size="sm" variant="ghost" type="button">
            Cerrar
          </Button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};
