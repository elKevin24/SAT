import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';

/**
 * Card SAT — sistema de tarjetas vivo. Reglas del manual:
 * sin íconos decorativos, sin badges de conteo, surface 100% clickeable,
 * chevron estático (sin animación de movimiento), hover sólido con tono
 * de segmento. Respeta prefers-reduced-motion.
 *
 * Extensiones mínimas ([DERIVADO]): `badges` (fila de chips opcional sobre el
 * título, útil en catálogos de trámites), `footer` (pie opcional con divisor)
 * y `selected` (anillo de selección del tono para estados activos).
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

const TONE_CLASSES: Record<CardTone, { hoverBg: string; hoverShadow: string; ring: string }> = {
  azul: {
    hoverBg: 'hover:bg-sat-azul',
    hoverShadow: 'hover:shadow-[0_14px_30px_rgba(20,100,155,0.18)]',
    ring: 'ring-sat-azul',
  },
  celeste: {
    hoverBg: 'hover:bg-(--sat-segmento-personas)',
    hoverShadow: 'hover:shadow-[0_14px_30px_rgba(2,132,199,0.18)]',
    ring: 'ring-(--sat-segmento-personas)',
  },
  verde: {
    hoverBg: 'hover:bg-(--sat-segmento-empresas)',
    hoverShadow: 'hover:shadow-[0_14px_30px_rgba(77,128,20,0.18)]',
    ring: 'ring-(--sat-segmento-empresas)',
  },
  naranja: {
    hoverBg: 'hover:bg-(--sat-segmento-aduanas)',
    hoverShadow: 'hover:shadow-[0_14px_30px_rgba(194,94,0,0.18)]',
    ring: 'ring-(--sat-segmento-aduanas)',
  },
  morado: {
    hoverBg: 'hover:bg-(--sat-segmento-auxiliares)',
    hoverShadow: 'hover:shadow-[0_14px_30px_rgba(99,102,241,0.18)]',
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
      aria-label={onClick ? title : undefined}
      aria-pressed={selected ? true : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={[
        'group rounded-xl border border-sat-gris bg-white p-5',
        'cursor-pointer transition hover:-translate-y-1 motion-reduce:hover:translate-y-0',
        'motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-sat-azul focus-visible:outline-hidden',
        toneClasses.hoverBg,
        toneClasses.hoverShadow,
        selected ? `ring-2 ${toneClasses.ring}` : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {badges && <div className="mb-2.5 flex flex-wrap items-center gap-1.5">{badges}</div>}
      <div className="flex items-start justify-between gap-3">
        <HeadingTag className="text-base font-bold text-sat-texto transition-colors group-hover:text-white">
          {title}
        </HeadingTag>
        <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
      </div>
      {description && (
        <p className="mt-2 text-xs leading-relaxed text-sat-texto-suave transition-colors group-hover:text-white/90">
          {description}
        </p>
      )}
      {footer && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-sat-gris/70 pt-3 text-[11px] text-sat-texto-tenue transition-colors group-hover:border-white/20 group-hover:text-white/80">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;