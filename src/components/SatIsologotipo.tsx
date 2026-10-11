import React from 'react';

interface SatIsologotipoProps {
  className?: string;
  variant?: 'azul' | 'blanco' | 'oscuro';
  showSubtitle?: boolean;
}

/**
 * Identificador Tipográfico Institucional SAT Guatemala
 * Tipografía vectorial limpia, sobria y de alto rendimiento.
 * Elimina la ilustración artificial previa, manteniendo la jerarquía institucional.
 */
export const SatIsologotipo: React.FC<SatIsologotipoProps> = ({
  className = '',
  variant = 'azul',
  showSubtitle = true
}) => {
  const isBlanco = variant === 'blanco';

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none text-left ${className}`} 
      role="img" 
      aria-label="Superintendencia de Administración Tributaria - SAT Guatemala"
    >
      {/* Siglas SAT en tipografía institucional sobria */}
      <div className="flex items-baseline font-black tracking-tight leading-none">
        <span className={`text-2xl sm:text-[28px] ${isBlanco ? 'text-white' : variant === 'oscuro' ? 'text-white' : 'text-sat-azul'}`}>
          SAT
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-sat-celeste ml-1 mb-0.5 inline-block" />
      </div>

      {showSubtitle && (
        <div className={`hidden sm:flex flex-col border-l pl-2.5 py-0.5 ${isBlanco ? 'border-white/30 text-white' : variant === 'oscuro' ? 'border-white/30 text-white' : 'border-sat-gris text-sat-azul-oscuro'}`}>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-tight">
            Superintendencia
          </span>
          <span className={`text-[9px] sm:text-[10px] font-medium tracking-normal leading-tight ${isBlanco || variant === 'oscuro' ? 'text-white/80' : 'text-sat-texto-suave'}`}>
            de Administración Tributaria
          </span>
        </div>
      )}
    </div>
  );
};