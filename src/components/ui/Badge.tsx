import type { ReactNode } from 'react';

/**
 * Badge SAT — etiqueta de modalidad o estado de trámite.
 * Los estilos se derivan de la paleta institucional y complementarios.
 */
export type BadgeTone =
  | 'online'
  | 'agencia'
  | 'gratuito'
  | 'cita'
  | 'presencial'
  | 'neutral';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, { chip: string; dot: string }> = {
  online: { chip: 'bg-sat-azul/10 text-sat-azul', dot: 'bg-sat-azul' },
  agencia: {
    chip: 'bg-(--sat-segmento-personas)/10 text-(--sat-segmento-personas)',
    dot: 'bg-(--sat-segmento-personas)',
  },
  gratuito: { chip: 'bg-sat-comp-verde/20 text-[#216e39]', dot: 'bg-sat-comp-verde' },
  cita: { chip: 'bg-sat-comp-ambar/20 text-[#92400E]', dot: 'bg-sat-comp-ambar' },
  presencial: { chip: 'bg-sat-gris text-sat-texto-suave', dot: 'bg-sat-fondo-medio' },
  neutral: { chip: 'bg-sat-fondo-tenue text-sat-texto-suave', dot: 'bg-sat-fondo-medio' },
};

export function Badge({ tone = 'neutral', dot = true, children, className = '' }: BadgeProps) {
  const styles = TONE_CLASSES[tone];
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
        styles.chip,
        'group-hover:bg-white/20 group-hover:text-white',
        className,
      ].join(' ')}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full transition-colors ${styles.dot} group-hover:bg-white`} />}
      {children}
    </span>
  );
}

export default Badge;