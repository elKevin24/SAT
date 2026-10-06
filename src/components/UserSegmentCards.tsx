import React from 'react';

export type SegmentId = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId) => void;
}

interface SegmentDef {
  id: SegmentId;
  title: string;
  badge: string;
  temasTotales: string;
  desc: string;
  primaryColor: string;
  items: string[];
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    title: 'Contribuyentes',
    badge: '4 Regímenes',
    temasTotales: '4 Grupos · 350 Trámites',
    desc: 'Personas individuales y jurídicas inscritas en el RTU, emisión de facturas y cumplimiento tributario.',
    primaryColor: '#14649B',
    items: [
      'NIT sin obligaciones',
      'Pequeño Contribuyente',
      'Régimen General',
      'Contribuyentes Especiales'
    ]
  },
  {
    id: 'comercio_exterior',
    title: 'Operadores de Comercio Exterior',
    badge: 'Aduanas',
    temasTotales: '3 Grupos · 184 Trámites',
    desc: 'Servicios aduaneros, importaciones, exportaciones, operadores económicos autorizados y auxiliares.',
    primaryColor: '#0284C7',
    items: [
      'Auxiliares de la función pública',
      'Importadores registrados',
      'Exportadores y OEA'
    ]
  },
  {
    id: 'profesionales',
    title: 'Profesionales',
    badge: 'Terceras Personas',
    temasTotales: '3 Grupos · 91 Trámites',
    desc: 'Gestión ante SAT para contadores, auditores, abogados, notarios y auxiliares tributarios.',
    primaryColor: '#2D5A0C',
    items: [
      'Gestores y Auxiliares Tributarios',
      'Abogados y Notarios',
      'CPA y Peritos Contadores'
    ]
  },
  {
    id: 'organismos_especiales',
    title: 'Organismos Especiales',
    badge: 'Sector Público y Exentos',
    temasTotales: '3 Grupos · 134 Trámites',
    desc: 'Entidades exentas por ley, instituciones del Estado, municipalidades y misiones diplomáticas.',
    primaryColor: '#C25E00',
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
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
            Segmentación por Tipo de Usuario
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19324B] tracking-tight">
            ¿Qué tipo de trámite o perfil necesitas gestionar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona tu grupo de interés para acceder a requisitos personalizados, guías normativas y sistemas directos.
          </p>
        </div>

        {/* 4 Tarjetas de Segmento sin íconos con el estilo institucional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SEGMENTS.map((seg) => {
            const isSelected = selectedSegment === seg.id;

            return (
              <div
                key={seg.id}
                onClick={() => onSelectSegment(seg.id)}
                className={`group bg-white border border-[#DCDCDC] hover:border-[#14649B] rounded-[16px] p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1 ${
                  isSelected ? 'border-[#14649B] ring-2 ring-[#14649B]/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {seg.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {seg.temasTotales}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors mb-2 leading-tight">
                    {seg.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {seg.desc}
                  </p>

                  {/* Bullet points con los subgrupos */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {seg.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11.5px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14649B] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14649B] group-hover:underline flex items-center gap-1">
                    <span>{isSelected ? 'Explorando catálogo' : 'Más información'}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
