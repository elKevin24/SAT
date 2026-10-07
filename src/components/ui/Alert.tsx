import type { ReactNode } from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

/**
 * Alert SAT — aviso contextual por severidad. Contraste validado WCAG 2.2 AA
 * sobre los tonos de la paleta institucional (ver sección "Contraste").
 */
export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
}

const TONE_CLASSES: Record<AlertTone, { wrap: string; icon: string; title: string }> = {
  info: {
    wrap: 'border-sat-azul/30 bg-sat-azul/5',
    icon: 'text-sat-azul',
    title: 'text-sat-azul',
  },
  success: {
    wrap: 'border-sat-comp-verde/40 bg-sat-comp-verde/10',
    icon: 'text-(--sat-segmento-empresas)',
    title: 'text-(--sat-segmento-empresas)',
  },
  warning: {
    wrap: 'border-sat-comp-ambar/40 bg-sat-comp-ambar/10',
    icon: 'text-[#D97706]',
    title: 'text-[#92400E]',
  },
  error: {
    wrap: 'border-[#DC2626]/30 bg-red-50/60',
    icon: 'text-[#DC2626]',
    title: 'text-[#DC2626]',
  },
};

const TONE_ICONS: Record<AlertTone, ReactNode> = {
  info: <Info />,
  success: <CheckCircle2 />,
  warning: <AlertTriangle />,
  error: <AlertCircle />,
};

export function Alert({ tone = 'info', title, children }: AlertProps) {
  const styles = TONE_CLASSES[tone];
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 text-sat-texto ${styles.wrap}`}>
      <span className={`mt-0.5 shrink-0 ${styles.icon}`}>
        <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{TONE_ICONS[tone]}</span>
      </span>
      <div className="text-xs leading-relaxed">
        {title && <p className={`font-bold ${styles.title}`}>{title}</p>}
        {children && <p className="mt-0.5 text-sat-texto-suave">{children}</p>}
      </div>
    </div>
  );
}

export default Alert;