import React from 'react';
import { ChevronRight } from 'lucide-react';

export type SegmentId = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId) => void;
}

interface SegmentDef {
  id: SegmentId;
  name: string;
  desc: string;
  actionText: string;
  primaryColor: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  actionTextClass: string;
  circleClasses: string;
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    desc: 'Inscripción en RTU, emisión de facturas electrónicas, presentación de declaraciones y gestión de impuestos para personas y negocios.',
    actionText: 'Explorar trámites de contribuyentes',
    primaryColor: '#14649B',
    cardHoverBorder: 'hover:border-[#14649B]',
    cardHoverBg: 'hover:bg-[#14649B]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(20,100,155,0.28)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#14649B] group-hover:text-white',
    circleClasses: 'bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B]',
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    desc: 'Gestión aduanera, registro de importadores y exportadores, trámites de DUCA y certificación de Operador Económico Autorizado.',
    actionText: 'Explorar trámites aduaneros',
    primaryColor: '#0284C7',
    cardHoverBorder: 'hover:border-[#0284C7]',
    cardHoverBg: 'hover:bg-[#0284C7]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(2,132,199,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#0284C7] group-hover:text-white',
    circleClasses: 'bg-[#0284C7]/15 text-[#0284C7] group-hover:bg-white group-hover:text-[#0284C7]',
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    desc: 'Habilitación de contadores y auditores, acreditación de gestores tributarios y registro de títulos universitarios con timbres fiscales.',
    actionText: 'Explorar trámites profesionales',
    primaryColor: '#4D8014',
    cardHoverBorder: 'hover:border-[#4D8014]',
    cardHoverBg: 'hover:bg-[#4D8014]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(77,128,20,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#2D5A0C] group-hover:text-white',
    circleClasses: 'bg-[#4D8014]/15 text-[#2D5A0C] group-hover:bg-white group-hover:text-[#4D8014]',
  },
  {
    id: 'organismos_especiales',
    name: 'Organismos Especiales',
    desc: 'Gestión de exenciones tributarias, constancias de adquisición de insumos y trámites para entidades del Estado y municipalidades.',
    actionText: 'Explorar trámites especiales',
    primaryColor: '#C25E00',
    cardHoverBorder: 'hover:border-[#C25E00]',
    cardHoverBg: 'hover:bg-[#C25E00]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(194,94,0,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#8A3B00] group-hover:text-white',
    circleClasses: 'bg-[#C25E00]/15 text-[#8A3B00] group-hover:bg-white group-hover:text-[#C25E00]',
  }
];

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment
}) => {
  return (
    <section className="py-8 bg-white border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
            Estructura Institucional SAT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">
            Selecciona tu perfil o tipo de trámite
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Encuentra requisitos actualizados, normativas y accesos directos adaptados a tus gestiones tributarias.
          </p>
        </div>

        {/* 4 Tarjetas: Solo Título y Descripción con UX Writing (Sin números ni íconos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className={`p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[#14649B]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className={`text-base sm:text-lg font-bold text-[#19324B] ${p.titleHoverText} transition-colors leading-tight`}>
                      {p.name}
                    </h3>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs`}>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className={`text-xs font-bold pt-4 mt-4 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between ${p.actionTextClass} transition-colors`}>
                  <span>{p.actionText}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
