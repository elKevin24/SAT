import React from 'react';
import { Users, Globe2, Briefcase, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export type SegmentId = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId) => void;
}

interface SegmentDef {
  id: SegmentId;
  title: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  primaryColor: string;
  accentBg: string;
  borderColor: string;
  items: string[];
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    title: 'Contribuyentes',
    badge: '4 Regímenes',
    desc: 'Personas individuales y jurídicas inscritas en el RTU, emisión de facturas y cumplimiento tributario.',
    icon: Users,
    primaryColor: '#14649B',
    accentBg: 'bg-blue-50/70',
    borderColor: 'hover:border-[#14649B]',
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
    desc: 'Servicios aduaneros, importaciones, exportaciones, operadores económicos autorizados y auxiliares.',
    icon: Globe2,
    primaryColor: '#0284C7',
    accentBg: 'bg-sky-50/70',
    borderColor: 'hover:border-[#0284C7]',
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
    desc: 'Gestión ante SAT para contadores, auditores, abogados, notarios y auxiliares tributarios.',
    icon: Briefcase,
    primaryColor: '#2D5A0C',
    accentBg: 'bg-emerald-50/70',
    borderColor: 'hover:border-[#2D5A0C]',
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
    desc: 'Entidades exentas por ley, instituciones del Estado, municipalidades y misiones diplomáticas.',
    icon: Building2,
    primaryColor: '#C25E00',
    accentBg: 'bg-amber-50/70',
    borderColor: 'hover:border-[#C25E00]',
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
    <section className="py-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 text-[#14649B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Segmentación por Tipo de Usuario
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19324B] tracking-tight">
            ¿Qué tipo de trámite o perfil necesitas gestionar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Selecciona tu grupo de interés para acceder a requisitos personalizados, guías normativas y sistemas directos.
          </p>
        </div>

        {/* 4 Tarjetas de Segmento con Efecto Roll-over (Slide 9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SEGMENTS.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const Icon = seg.icon;

            return (
              <div
                key={seg.id}
                onClick={() => onSelectSegment(seg.id)}
                className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isSelected 
                    ? 'border-[#14649B] ring-2 ring-[#14649B]/20 shadow-md' 
                    : `border-slate-200 ${seg.borderColor}`
                }`}
              >
                {/* Header de la tarjeta */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div 
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#14649B] text-white shadow-sm' 
                          : `${seg.accentBg} text-slate-700 group-hover:scale-105`
                      }`}
                      style={{ color: isSelected ? '#FFFFFF' : seg.primaryColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                      {seg.badge}
                    </span>
                  </div>

                  <h3 
                    className="text-base font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors mb-2 leading-tight"
                  >
                    {seg.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                    {seg.desc}
                  </p>

                  {/* Bullet points con los subgrupos (Slide 9) */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {seg.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11.5px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#19AFE1] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la tarjeta con acción "Más información" */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14649B] group-hover:underline flex items-center gap-1">
                    {isSelected ? 'Explorando catálogo' : 'Más información'}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#14649B] animate-ping" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
