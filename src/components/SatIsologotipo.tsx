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
  // Colores normativos según variante
  const primaryColor = variant === 'blanco' ? '#FFFFFF' : '#14649B';
  const subtitleColor = variant === 'blanco' ? '#FFFFFF' : '#14649B';

  return (
    <div className={`inline-flex flex-col select-none ${className}`} role="img" aria-label="Superintendencia de Administración Tributaria - SAT Guatemala">
      <svg
        viewBox="0 0 320 102.4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ISOTIPO: Mano señalando hacia la derecha con la factura estilizada */}
        <g fill={primaryColor}>
          {/* Dedos y palma estilizada */}
          <path d="M42 43 C42 40 44 38 48 38 L95 38 C98 38 100 40 100 43 C100 46 98 48 95 48 L48 48 C44 48 42 46 42 43 Z" />
          <path d="M35 52 C35 49 37 47 41 47 L88 47 C91 47 93 49 93 52 C93 55 91 57 88 57 L41 57 C37 57 35 55 35 52 Z" />
          <path d="M28 61 C28 58 30 56 34 56 L80 56 C83 56 85 58 85 61 C85 64 83 66 80 66 L34 66 C30 66 28 64 28 61 Z" />
          
          {/* Base curva inferior (pulgar/palma) */}
          <path d="M22 69 C24 67 27 67 30 69 C38 75 50 78 65 78 C70 78 72 80 72 83 C72 86 70 88 65 88 C45 88 30 83 18 73 C16 71 18 69 22 69 Z" />

          {/* Dedo índice apuntando hacia arriba e inclinado hacia la derecha (Factura / Cumplimiento) */}
          <path d="M55 48 C50 48 46 44 46 39 C46 28 54 18 66 12 C72 9 82 8 88 8 C92 8 95 10 93 14 L80 43 C78 47 75 48 70 48 L55 48 Z M80 18 C74 20 68 26 68 33 C68 35 70 37 72 37 L78 24 C79 21 80 19 80 18 Z" />
        </g>

        {/* LOGOTIPO: Tipografía 'SAT' en cursiva con corte dinámico horizontal */}
        <g fill={primaryColor}>
          {/* Letra S */}
          <path d="M125 68 C115 68 106 63 108 52 C109 44 116 41 126 39 C136 37 141 35 142 31 C143 27 139 25 133 25 C124 25 117 28 113 32 L108 21 C114 16 125 13 135 13 C149 13 158 19 156 30 C154 39 146 42 136 44 C126 46 122 48 121 52 C120 56 124 58 131 58 C141 58 149 54 153 50 L158 61 C152 66 140 68 125 68 Z" />
          
          {/* Letra A (inclinada) */}
          <path d="M174 15 L196 15 L218 66 L201 66 L196 53 L178 53 L172 66 L156 66 L174 15 Z M182 43 L193 43 L189 27 L182 43 Z" />

          {/* Letra T */}
          <path d="M216 26 L237 26 L220 66 L204 66 L221 26 L206 26 L210 15 L252 15 L247 26 L231 26 Z" />
        </g>

        {/* Línea divisoria y Nombre oficial completo si showSubtitle está activo */}
        {showSubtitle && (
          <g fill={subtitleColor}>
            {/* Barra separadora horizontal */}
            <rect x="25" y="74" width="270" height="2" rx="1" />
            
            {/* Texto: SUPERINTENDENCIA DE ADMINISTRACION TRIBUTARIA */}
            <text
              x="160"
              y="88"
              textAnchor="middle"
              fontFamily="Gotham, Montserrat, -apple-system, sans-serif"
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="0.08em"
            >
              SUPERINTENDENCIA DE ADMINISTRACION TRIBUTARIA
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
