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
  primaryColor: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  circleClasses: string;
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    name: 'Personas y Empresas (Contribuyentes)',
    desc: 'Inscríbete en el Registro Tributario (RTU), emite facturas electrónicas gratuitas, presenta tus declaraciones y gestiona tus impuestos con y sin negocio.',
    primaryColor: '#14649B',
    cardHoverBorder: 'hover:border-[#14649B]',
    cardHoverBg: 'hover:bg-[#14649B]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(20,100,155,0.28)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B]',
  },
  {
    id: 'comercio_exterior',
    name: 'Comercio Exterior y Aduanas',
    desc: 'Realiza gestiones para importar o exportar mercancías, consulta declaraciones aduaneras (DUCA) y certifícate como empresa de transporte o logística segura.',
    primaryColor: '#0284C7',
    cardHoverBorder: 'hover:border-[#0284C7]',
    cardHoverBg: 'hover:bg-[#0284C7]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(2,132,199,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#0284C7]/15 text-[#0284C7] group-hover:bg-white group-hover:text-[#0284C7]',
  },
  {
    id: 'profesionales',
    name: 'Profesionales y Contadores',
    desc: 'Habilita tu registro de Perito Contador o Auditor, acredita gestiones como abogado o representante y registra tus títulos universitarios pagando timbres fiscales.',
    primaryColor: '#4D8014',
    cardHoverBorder: 'hover:border-[#4D8014]',
    cardHoverBg: 'hover:bg-[#4D8014]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(77,128,20,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#4D8014]/15 text-[#2D5A0C] group-hover:bg-white group-hover:text-[#4D8014]',
  },
  {
    id: 'organismos_especiales',
    name: 'Entidades Exentas y Sector Público',
    desc: 'Gestiona la constancia para comprar sin IVA si perteneces a una entidad sin fines de lucro, educativa, religiosa, municipalidad o institución del Estado.',
    primaryColor: '#C25E00',
    cardHoverBorder: 'hover:border-[#C25E00]',
    cardHoverBg: 'hover:bg-[#C25E00]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(194,94,0,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#C25E00]/15 text-[#8A3B00] group-hover:bg-white group-hover:text-[#C25E00]',
  }
];

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment
}) => {
  return (
    <section className="py-6 bg-white border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado compacto */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1">
          <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
            Portal Tributario y Aduanero
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#19324B] tracking-tight">
            ¿Qué deseas gestionar hoy?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona tu perfil para encontrar requisitos claros, pasos guiados y sistemas oficiales en línea.
          </p>
        </div>

        {/* 4 Tarjetas compactas sin footer redundante y con gap reducido */}
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
                className={`p-5 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer group shadow-xs hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[#14649B]' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <h3 className={`text-sm sm:text-base font-bold text-[#19324B] ${p.titleHoverText} transition-colors leading-snug`}>
                      {p.name}
                    </h3>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs mt-0.5`}>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
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
