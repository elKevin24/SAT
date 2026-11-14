import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

/**
 * Button SAT — token de UI vivo. Usa tokens de marca (tokens.css) y la
 * escala de movimiento (--sat-duracion-*, --sat-ease-*). Obedece
 * prefers-reduced-motion vía la política global de index.css.
 */
export type ButtonVariant = 'primary' | 'outline' | 'accent' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonAsLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-sat-azul text-white shadow-sat-sm hover:bg-sat-azul-oscuro',
  outline: 'border border-sat-gris bg-white text-sat-texto shadow-sat-sm hover:bg-sat-fondo-tenue',
  accent: 'bg-sat-celeste text-sat-azul-oscuro shadow-sat-sm hover:opacity-90',
  destructive: 'bg-[#DC2626] text-white shadow-sat-sm hover:bg-[#B91C1C]',
  ghost: 'bg-transparent text-sat-texto-acento hover:bg-sat-fondo-tenue',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'rounded-sat-sm px-3 py-1.5 text-[11px]',
  md: 'rounded-sat-md px-4 py-2.5 text-xs',
  lg: 'rounded-sat-md px-6 py-3 text-sm',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, icon, disabled, className = '', children, ...rest },
  ref
) {
  const disabledClasses = disabled
    ? 'cursor-not-allowed border-sat-gris bg-sat-fondo-tenue text-[#94A3B8] shadow-none hover:bg-sat-fondo-tenue'
    : '';

  const classes = [
    'inline-flex items-center justify-center gap-2 font-bold transition motion-reduce:transition-none',
    'active:scale-[0.98] motion-reduce:active:scale-100',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (typeof (rest as ButtonAsLinkProps).href === 'string') {
    const { href, onClick, ...anchorRest } = rest as Omit<ButtonAsLinkProps, keyof ButtonBaseProps>;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchorRest.tabIndex}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        className={classes}
        {...anchorRest}
      >
        {icon}
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as Omit<ButtonAsButtonProps, keyof ButtonBaseProps>;
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={classes}
      {...buttonRest}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;