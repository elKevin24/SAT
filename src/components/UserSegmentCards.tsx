import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export type SegmentId = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface SegmentDef {
  id: SegmentId;
  name: string;
  desc: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  circleClasses: string;
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    desc: 'Personas individuales, pequeños contribuyentes, régimen general y contribuyentes especiales.',
    cardHoverBorder: 'hover:border-[#14649B]',
    cardHoverBg: 'hover:bg-[#14649B]',
    cardHoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.22)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B]'
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    desc: 'Gestiones para importadores, exportadores, transportistas, agentes de aduanas y normativa arancelaria.',
    cardHoverBorder: 'hover:border-[#0284C7]',
    cardHoverBg: 'hover:bg-[#0284C7]',
    cardHoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.22)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#0284C7]/15 text-[#0284C7] group-hover:bg-white group-hover:text-[#0284C7]'
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    desc: 'Habilita tu registro como perito contador, auditor, abogado, notario o gestor tributario autorizado.',
    cardHoverBorder: 'hover:border-[#4D8014]',
    cardHoverBg: 'hover:bg-[#4D8014]',
    cardHoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.22)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#4D8014]/15 text-[#4D8014] group-hover:bg-white group-hover:text-[#4D8014]'
  },
  {
    id: 'organismos_especiales',
    name: 'Organismos Especiales',
    desc: 'Reconocimiento de exenciones para entidades del Estado, iglesias, universidades y organizaciones no lucrativas.',
    cardHoverBorder: 'hover:border-[#C25E00]',
    cardHoverBg: 'hover:bg-[#C25E00]',
    cardHoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.22)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#C25E00]/15 text-[#C25E00] group-hover:bg-white group-hover:text-[#C25E00]'
  }
];

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId, category?: string) => void;
}

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment
}) => {
  return (
    <section className="py-6 sm:py-8 bg-white" aria-labelledby="segmentation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="space-y-1">
          <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
            Segmentación por Tipo de Usuario
          </span>
          <h2 id="segmentation-heading" className="text-xl sm:text-2xl font-black text-[#19324B] tracking-tight">
            ¿Qué tipo de trámite o perfil necesitas gestionar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona tu grupo de interés para acceder a requisitos personalizados, guías normativas y trámites en línea.
          </p>
        </div>

        {/* Las 4 Tarjetas: fondo azul mínimo institucional (#F0F7FC) con borde limpio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {SEGMENTS.map((p) => {
            const isSelected = selectedSegment === p.id;

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSegment(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSegment(p.id);
                  }
                }}
                className={`p-5 bg-[#F0F7FC] border border-[#CDE3F1] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer group shadow-2xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[#14649B]' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <h3 className={`text-base font-bold text-[#19324B] ${p.titleHoverText} transition-colors leading-snug`}>
                      {p.name}
                    </h3>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs mt-0.5`}>
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
