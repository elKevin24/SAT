import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';

/**
 * Card SAT — Sistema de tarjetas insignia del Design System SAT.
 *
 * Especificación canónica (StyleGuide / Manual de Imagen y Normas Gráficas V5):
 * - Cero bordes perimetrales (borderless).
 * - Cero íconos decorativos o badges de conteo.
 * - Superficie viva con fondo sutil y transición fluida a fondo sólido institucional.
 * - Chevron estático (#94A3B8 -> blanco en hover/active).
 * - Operabilidad accesible: Teclado (Enter/Espacio) y foco visible institucional.
 */
export type CardTone = 'azul' | 'celeste' | 'verde' | 'naranja' | 'morado';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tone?: CardTone;
  onClick?: () => void;
  badges?: ReactNode;
  footer?: ReactNode;
  selected?: boolean;
  headingLevel?: HeadingLevel;
}

interface ToneStyle {
  bgBase: string;
  hoverBg: string;
  activeBg: string;
  hoverShadow: string;
  ring: string;
}

const TONE_CLASSES: Record<CardTone, ToneStyle> = {
  azul: {
    bgBase: 'bg-sat-fondo-tenue',
    hoverBg: 'hover:bg-sat-azul',
    activeBg: 'active:bg-sat-azul-oscuro',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.22)] active:shadow-inner',
    ring: 'ring-sat-azul',
  },
  celeste: {
    bgBase: 'bg-sat-fondo-tenue',
    hoverBg: 'hover:bg-(--sat-segmento-personas)',
    activeBg: 'active:bg-sky-700',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.22)] active:shadow-inner',
    ring: 'ring-(--sat-segmento-personas)',
  },
  verde: {
    bgBase: 'bg-sat-fondo-tenue',
    hoverBg: 'hover:bg-(--sat-segmento-empresas)',
    activeBg: 'active:bg-green-800',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.22)] active:shadow-inner',
    ring: 'ring-(--sat-segmento-empresas)',
  },
  naranja: {
    bgBase: 'bg-sat-fondo-tenue',
    hoverBg: 'hover:bg-(--sat-segmento-aduanas)',
    activeBg: 'active:bg-amber-800',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.22)] active:shadow-inner',
    ring: 'ring-(--sat-segmento-aduanas)',
  },
  morado: {
    bgBase: 'bg-sat-fondo-tenue',
    hoverBg: 'hover:bg-(--sat-segmento-auxiliares)',
    activeBg: 'active:bg-indigo-800',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(99,102,241,0.22)] active:shadow-inner',
    ring: 'ring-(--sat-segmento-auxiliares)',
  },
};

export function Card({
  title,
  description,
  tone = 'azul',
  onClick,
  badges,
  footer,
  selected,
  headingLevel: HeadingTag = 'h3',
  className = '',
  ...rest
}: CardProps) {
  const toneClasses = TONE_CLASSES[tone];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={selected ? true : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={[
        // Sin bordes perimetrales (borderless canónico del design system)
        'group rounded-xl border-0 p-5',
        'cursor-pointer transition-all duration-400 ease-out select-none',
        'motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-sat-azul focus-visible:outline-hidden',
        // Fondo base y variantes interactivas
        toneClasses.bgBase,
        toneClasses.hoverBg,
        toneClasses.activeBg,
        toneClasses.hoverShadow,
        'hover:-translate-y-1 motion-reduce:hover:translate-y-0 active:translate-y-0',
        selected ? `ring-2 ${toneClasses.ring}` : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {badges && <div className="mb-2.5 flex flex-wrap items-center gap-1.5">{badges}</div>}
      <div className="flex items-start justify-between gap-3">
        <HeadingTag className="text-base font-bold text-sat-texto transition-colors group-hover:text-white group-active:text-white">
          {title}
        </HeadingTag>
        <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white group-active:text-white" />
      </div>
      {description && (
        <p className="mt-2 text-xs leading-relaxed text-sat-texto-suave transition-colors group-hover:text-white/90 group-active:text-white/90">
          {description}
        </p>
      )}
      {footer && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-sat-gris/50 pt-3 text-[11px] text-sat-texto-suave font-medium transition-colors group-hover:border-white/20 group-hover:text-white/90 group-active:border-white/20 group-active:text-white/90">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;