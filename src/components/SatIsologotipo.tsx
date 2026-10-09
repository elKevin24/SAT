import React from 'react';

interface SatIsologotipoProps {
  className?: string;
  variant?: 'azul' | 'blanco' | 'oscuro';
  showSubtitle?: boolean;
}

/**
 * Isologotipo Oficial SAT Guatemala
 * Conforme a las especificaciones del Manual de Imagen y Normas Gráficas V5 (p.10, p.14, p.20, p.34).
 * Proporción normativa: 5.0 cm ancho x 1.60 cm alto (3.125:1).
 * Bloque indivisible: Isotipo (mano con factura) + Logotipo (SAT) + Nombre oficial.
 */
export const SatIsologotipo: React.FC<SatIsologotipoProps> = ({
  className = 'h-10 w-auto',
  variant = 'azul',
  showSubtitle = true
}) => {
  const isBlanco = variant === 'blanco';

  const lettersFill = isBlanco ? '#FFFFFF' : variant === 'oscuro' ? '#19324B' : '#14649B';
  const accentFill = isBlanco ? 'rgba(255,255,255,0.72)' : variant === 'oscuro' ? '#14649B' : '#19AFE1';
  const subtitleFill = isBlanco ? '#FFFFFF' : '#19324B';
  const emblemFill = isBlanco ? '#FFFFFF' : 'url(#satGradIsotipo)';
  const docFill = isBlanco ? 'rgba(255,255,255,0.14)' : '#FFFFFF';
  const docStroke = isBlanco ? 'rgba(255,255,255,0.4)' : '#BFDCEF';
  const docLines = isBlanco ? 'rgba(255,255,255,0.38)' : '#A9C9E2';
  const docFold = isBlanco ? 'rgba(255,255,255,0.2)' : '#DCEBFA';
  const divider = isBlanco ? 'rgba(255,255,255,0.45)' : '#9BC7E8';

  return (
    <div className={`inline-flex flex-col select-none ${className}`} role="img" aria-label="Superintendencia de Administración Tributaria - SAT Guatemala">
      <svg
        viewBox="0 0 320 102.4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="satGradIsotipo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#19AFE1" />
            <stop offset="100%" stopColor="#14649B" />
          </linearGradient>
        </defs>

        {/* ISOTIPO: Mano señalando a la derecha sosteniendo la factura estilizada */}
        <g transform="rotate(-6 70 56)">
          {/* Factura detrás de la mano */}
          <g transform="rotate(-6 118 48)">
            <rect x="92" y="24" width="36" height="54" rx="4" fill={docFill} stroke={docStroke} strokeWidth="1.2" />
            <path d="M128 24 L116 24 L128 40 Z" fill={docFold} />
            <rect x="100" y="34" width="20" height="2" rx="1" fill={docLines} />
            <rect x="100" y="46" width="20" height="2" rx="1" fill={docLines} />
            <rect x="100" y="58" width="20" height="2" rx="1" fill={docLines} />
          </g>

          {/* Mano (dedos + palma) como un solo bloque en gradiente institucional */}
          <g fill={emblemFill}>
            <rect x="20" y="24" width="46" height="60" rx="14" />
            <rect x="40" y="26" width="72" height="16" rx="8" />
            <rect x="38" y="42" width="46" height="14" rx="7" />
            <rect x="40" y="57" width="34" height="13" rx="6.5" />
            <rect x="42" y="71" width="22" height="12" rx="6" />
            <rect x="24" y="76" width="18" height="10" rx="5" />
          </g>
        </g>

        {/* LOGOTIPO: Tipografía 'SAT' en itálica con corte dinámico horizontal */}
        <g fill={lettersFill}>
          {/* Letra S */}
          <path d="M132 66 C120 66 113 61 115 51 C116 44 123 40 132 38 C141 36 145 33 146 30 C147 26 143 24 138 24 C130 24 124 27 120 31 L115 22 C120 18 129 13 139 13 C152 13 159 18 158 28 C157 37 150 41 141 43 C133 45 127 47 127 51 C127 55 131 57 138 57 C147 57 152 55 156 51 L162 62 C155 65 145 66 132 66 Z" />
          {/* Letra A (inclinada) con corte en la barra */}
          <path d="M200 13 L226 13 L247 66 L227 66 L220 50 L190 50 L183 66 L163 66 L200 13 Z" />
          {/* Letra T */}
          <path d="M232 13 L280 13 L276 26 L236 26 Z" />
          <path d="M251 24 L266 24 L260 67 L245 67 Z" />
        </g>

        {/* Corte dinámico horizontal en la A */}
        <path d="M188 46 L222 46 L214 30 L196 30 Z" fill={accentFill} />

        {/* Línea divisoria y Nombre oficial completo si showSubtitle está activo */}
        {showSubtitle && (
          <g>
            <rect x="72" y="75" width="176" height="2" rx="1" fill={divider} />

            <text
              x="160"
              y="88"
              textAnchor="middle"
              fontFamily="Montserrat, 'Gotham Bold', -apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="0.1em"
              fill={subtitleFill}
            >
              SUPERINTENDENCIA DE ADMINISTRACION TRIBUTARIA
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};