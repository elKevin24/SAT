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
  badgeLabel: string;
  temasTotales: string;
  desc: string;
  primaryColor: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  actionTextClass: string;
  circleClasses: string;
  items: string[];
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    badgeLabel: '4 Grupos',
    temasTotales: '4 Grupos · 350 Trámites',
    desc: 'NIT sin Obligaciones, Pequeños Contribuyentes, Contribuyente General y Contribuyentes Especiales.',
    primaryColor: '#14649B',
    cardHoverBorder: 'hover:border-[#14649B]',
    cardHoverBg: 'hover:bg-[#14649B]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(20,100,155,0.28)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#14649B] group-hover:text-white',
    circleClasses: 'bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B]',
    items: [
      'NIT sin obligaciones',
      'Pequeño Contribuyente',
      'Régimen General',
      'Contribuyentes Especiales'
    ]
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    badgeLabel: '2 Grupos',
    temasTotales: '3 Grupos · 184 Trámites',
    desc: 'Importadores, exportadores, OEA y auxiliares de la función pública aduanera.',
    primaryColor: '#0284C7',
    cardHoverBorder: 'hover:border-[#0284C7]',
    cardHoverBg: 'hover:bg-[#0284C7]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(2,132,199,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#0284C7] group-hover:text-white',
    circleClasses: 'bg-[#0284C7]/15 text-[#0284C7] group-hover:bg-white group-hover:text-[#0284C7]',
    items: [
      'Auxiliares de la función pública',
      'Importadores registrados',
      'Exportadores y OEA'
    ]
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    badgeLabel: '1 Grupo',
    temasTotales: '3 Grupos · 91 Trámites',
    desc: 'Terceras personas: gestores tributarios, abogados y notarios, peritos contadores y auditores.',
    primaryColor: '#4D8014',
    cardHoverBorder: 'hover:border-[#4D8014]',
    cardHoverBg: 'hover:bg-[#4D8014]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(77,128,20,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#2D5A0C] group-hover:text-white',
    circleClasses: 'bg-[#4D8014]/15 text-[#2D5A0C] group-hover:bg-white group-hover:text-[#4D8014]',
    items: [
      'Gestores y Auxiliares Tributarios',
      'Abogados y Notarios',
      'CPA y Peritos Contadores'
    ]
  },
  {
    id: 'organismos_especiales',
    name: 'Organismos Especiales',
    badgeLabel: '2 Grupos',
    temasTotales: '3 Grupos · 134 Trámites',
    desc: 'Entidades exentas constitucionales, no lucrativas, por decreto, ZOLIC, municipalidades y entidades del Estado.',
    primaryColor: '#C25E00',
    cardHoverBorder: 'hover:border-[#C25E00]',
    cardHoverBg: 'hover:bg-[#C25E00]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(194,94,0,0.30)]',
    titleHoverText: 'group-hover:text-white',
    actionTextClass: 'text-[#8A3B00] group-hover:text-white',
    circleClasses: 'bg-[#C25E00]/15 text-[#8A3B00] group-hover:bg-white group-hover:text-[#C25E00]',
    items: [
      'Entidades Exentas por Ley',
      'Entidades del Estado',
      'Municipalidades'
    ]
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
            Seleccionar un Macrogrupo de Interés
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Categorización oficial de grupos tributarios, aduaneros, profesionales y entes exentos.
          </p>
        </div>

        {/* Las 4 Tarjetas de Macrogrupos con el estilo previo idéntico */}
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
                className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-[#14649B]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {p.badgeLabel}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs`}>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold text-[#19324B] ${p.titleHoverText} transition-colors mb-1 leading-tight`}>
                    {p.name}
                  </h3>

                  <div className="text-xs font-bold text-[#14649B] group-hover:text-white/90 transition-colors mb-2">
                    {p.temasTotales}
                  </div>

                  <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed mb-3">
                    {p.desc}
                  </p>

                  {/* Bullet points con los subgrupos */}
                  <div className="space-y-1 pt-2.5 border-t border-slate-100 group-hover:border-white/20 text-xs text-slate-600 group-hover:text-white/90 transition-colors">
                    {p.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] truncate">
                        <span className="w-1 h-1 rounded-full bg-[#14649B] group-hover:bg-white shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`text-xs font-bold pt-2 flex items-center gap-1.5 ${p.actionTextClass} transition-colors border-t border-transparent group-hover:border-white/10`}>
                  <span>Explorar grupos</span>
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
