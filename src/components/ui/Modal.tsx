import { useEffect, useRef, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface UseDialogA11yOptions {
  isOpen: boolean;
  onClose: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  lockScroll?: boolean;
}

export function useDialogA11y({
  isOpen,
  onClose,
  initialFocusRef,
  lockScroll = true,
}: UseDialogA11yOptions) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    let previousOverflow = '';
    if (lockScroll) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // Foco inicial accesible
    const focusTimer = requestAnimationFrame(() => {
      if (!panelRef.current) return;
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
      const visibleFocusables = Array.from(focusables).filter(
        (el) => el.offsetParent !== null || el.getClientRects().length > 0
      );
      if (visibleFocusables.length > 0) {
        visibleFocusables[0].focus();
      } else {
        panelRef.current.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        if (!panelRef.current) return;
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
        const visibleFocusables = Array.from(focusables).filter(
          (el) => el.offsetParent !== null || el.getClientRects().length > 0
        );

        if (visibleFocusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = visibleFocusables[0];
        const last = visibleFocusables[visibleFocusables.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first || !panelRef.current.contains(document.activeElement)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !panelRef.current.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }
      restoreRef.current?.focus?.();
    };
  }, [isOpen, onClose, initialFocusRef, lockScroll]);

  return { panelRef };
}

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  className?: string;
  panelClassName?: string;
  containerClassName?: string;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export function Modal({
  open,
  isOpen,
  onClose,
  title,
  ariaLabel,
  ariaLabelledBy,
  children,
  header,
  footer,
  maxWidth = 'max-w-md',
  className = '',
  panelClassName = '',
  containerClassName = 'fixed inset-0 z-50 flex items-center justify-center p-4',
  hideHeader = false,
  hideCloseButton = false,
  closeOnBackdropClick = true,
  initialFocusRef,
}: ModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const autoTitleId = useId();
  const titleId = ariaLabelledBy ?? (title ? autoTitleId : undefined);

  const { panelRef } = useDialogA11y({
    isOpen: isModalOpen,
    onClose,
    initialFocusRef,
    lockScroll: true,
  });

  if (!isModalOpen) return null;

  return createPortal(
    <div className={containerClassName}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={!titleId ? (ariaLabel ?? 'Diálogo') : undefined}
        tabIndex={-1}
        className={[
          'relative w-full rounded-sat-lg bg-white shadow-2xl outline-none z-10 animate-fadeIn',
          maxWidth,
          panelClassName || 'p-6',
          className,
        ].join(' ')}
        style={{
          transitionDuration: 'var(--sat-duracion-panel, 360ms)',
          transitionTimingFunction: 'var(--sat-ease-suave, cubic-bezier(0.16, 1, 0.3, 1))',
        }}
      >
        {!hideHeader &&
          (header ? (
            header
          ) : (
            <div className="flex items-start justify-between gap-3">
              {title && (
                <h3 id={titleId} className="text-lg font-black text-sat-texto tracking-tight">
                  {title}
                </h3>
              )}
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="rounded-lg p-1.5 text-sat-texto-tenue transition hover:bg-sat-fondo-tenue hover:text-sat-texto"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

        {hideHeader ? (
          children
        ) : (
          <div className="mt-3 text-xs leading-relaxed text-sat-texto-suave">{children}</div>
        )}

        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;