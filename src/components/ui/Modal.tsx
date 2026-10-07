import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Modal SAT — diálogo accesible sobre el contenido.
 * Bloquea el scroll del fondo, cierra con Esc o al tocar el backdrop,
 * y devuelve el foco al elemento previo al abrir. Se porta al body.
 * Duración de panel con --sat-duracion-panel / --sat-ease-suave.
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    // Foco inicial en el panel para teclado
    requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar diálogo"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Diálogo'}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-sat-lg bg-white p-6 shadow-sat-lg outline-none"
        style={{
          transitionDuration: 'var(--sat-duracion-panel)',
          transitionTimingFunction: 'var(--sat-ease-suave)',
          animation: 'sat-modal-in 1ms ease-out',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          {title && <h3 className="text-lg font-black text-sat-texto tracking-tight">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-sat-texto-tenue transition hover:bg-sat-fondo-tenue hover:text-sat-texto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-sat-texto-suave">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;