import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * Button SAT — token de UI vivo. Usa tokens de marca (tokens.css) y la
 * escala de movimiento (--sat-duracion-*, --sat-ease-*). Obedece
 * prefers-reduced-motion vía la política global de index.css.
 */
export type ButtonVariant = 'primary' | 'outline' | 'accent' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, disabled, className = '', ...rest },
  ref
) {
  const disabledClasses = disabled
    ? 'cursor-not-allowed border-sat-gris bg-sat-fondo-tenue text-[#94A3B8] shadow-none hover:bg-sat-fondo-tenue'
    : '';

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold transition motion-reduce:transition-none',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        disabledClasses,
        className,
      ].join(' ')}
      {...rest}
    />
  );
});

export default Button;