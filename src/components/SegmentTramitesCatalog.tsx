import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { SegmentId } from './UserSegmentCards';

interface TramiteItem {
  id: string;
  pillar: string;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tema?: string;
  subtema?: string;
  nombreActual?: string;
  tramite: string;
  descripcion: string;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  seccionActual?: string;
  url: string;
  nota?: string;
  baseLegal?: string;
}

interface SegmentTramitesCatalogProps {
  segmentId: SegmentId;
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToHome: () => void;
  onSwitchSegment: (segId: SegmentId) => void;
}

const SEGMENT_METADATA: Record<SegmentId, { title: string; shortTitle: string; desc: string; color: string; hoverBg: string; hoverBorder: string; hoverShadow: string }> = {
  contribuyentes: {
    title: 'Catálogo de Trámites para Personas y Empresas',
    shortTitle: 'Personas y Empresas',
    desc: 'Trámites para personas individuales, pequeños contribuyentes, negocios en régimen general y empresas con obligaciones tributarias.',
    color: '#14649B',
    hoverBg: 'hover:bg-[#14649B]',
    hoverBorder: 'hover:border-[#14649B]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.24)]'
  },
  comercio_exterior: {
    title: 'Catálogo de Trámites de Comercio Exterior y Aduanas',
    shortTitle: 'Comercio Exterior',
    desc: 'Gestiones para importadores, exportadores, empresas de transporte internacional y agentes aduaneros.',
    color: '#0284C7',
    hoverBg: 'hover:bg-[#0284C7]',
    hoverBorder: 'hover:border-[#0284C7]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.24)]'
  },
  profesionales: {
    title: 'Catálogo para Profesionales, Notarios y Contadores',
    shortTitle: 'Profesionales',
    desc: 'Habilitación de peritos contadores, auditores, registro de títulos universitarios y acreditación de gestores.',
    color: '#4D8014',
    hoverBg: 'hover:bg-[#4D8014]',
    hoverBorder: 'hover:border-[#4D8014]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.24)]'
  },
  organismos_especiales: {
    title: 'Catálogo para Entidades Exentas y Sector Público',
    shortTitle: 'Entidades Exentas',
    desc: 'Reconocimiento de exenciones tributarias para ONG, iglesias, universidades, municipalidades y entidades del Estado.',
    color: '#C25E00',
    hoverBg: 'hover:bg-[#C25E00]',
    hoverBorder: 'hover:border-[#C25E00]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.24)]'
  }
};

export const SegmentTramitesCatalog: React.FC<SegmentTramitesCatalogProps> = ({
  segmentId,
  allTramites,
  onSelectTramite,
  onBackToHome,
  onSwitchSegment
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las categorías');

  const meta = SEGMENT_METADATA[segmentId];

  // Filter trámites for this segment
  const segmentTramites = useMemo(() => {
    return allTramites.filter(t => t.pillar === segmentId);
  }, [allTramites, segmentId]);

  // Extract unique categories in this segment
  const categories = useMemo(() => {
    const set = new Set<string>();
    segmentTramites.forEach(t => {
      if (t.categoria) set.add(t.categoria);
    });
    return ['Todas las categorías', ...Array.from(set)];
  }, [segmentTramites]);

  // Apply filters and search
  const filteredTramites = useMemo(() => {
    return segmentTramites.filter(t => {
      const matchCat = selectedCategory === 'Todas las categorías' || t.categoria === selectedCategory;
      const matchQ = !internalQuery.trim() || 
        (t.tramite && t.tramite.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.subcategoria && t.subcategoria.toLowerCase().includes(internalQuery.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [segmentTramites, selectedCategory, internalQuery]);

  return (
    <div className="py-6 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#DCDCDC]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button 
              onClick={onBackToHome}
              className="hover:text-[#14649B] transition-colors"
            >
              Inicio
            </button>
            <span>/</span>
            <span className="text-[#19324B] font-bold">{meta.title}</span>
          </div>

          {/* Quick switcher between segments */}
          <div className="flex items-center gap-1.5 text-xs">
            {(Object.keys(SEGMENT_METADATA) as SegmentId[]).map((segKey) => (
              <button
                key={segKey}
                onClick={() => {
                  setSelectedCategory('Todas las categorías');
                  setInternalQuery('');
                  onSwitchSegment(segKey);
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  segKey === segmentId 
                    ? 'bg-[#14649B] text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {SEGMENT_METADATA[segKey].shortTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Segment Header */}
        <div className="p-5 rounded-[16px] bg-slate-50 border border-[#DCDCDC] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#19324B] tracking-tight">
              {meta.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {meta.desc}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-[14px] border border-[#DCDCDC]">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-[#14649B] shadow-2xs border border-[#14649B]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search within segment */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              placeholder="Buscar trámite en esta sección..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#DCDCDC] rounded-xl focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B] outline-none"
            />
          </div>
        </div>

        {/* Results Grid: Compacto y sin footer de acción redundante */}
        {filteredTramites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {filteredTramites.map((tramite) => (
              <div
                key={tramite.id}
                onClick={() => onSelectTramite(tramite)}
                className={`p-4 sm:p-5 bg-white border border-[#DCDCDC] rounded-[14px] ${meta.hoverBorder} ${meta.hoverBg} ${meta.hoverShadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-0.5`}
              >
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-white transition-colors leading-snug mb-1.5">
                    {tramite.tramite}
                  </h3>

                  <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors line-clamp-3 leading-relaxed">
                    {tramite.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-slate-50 rounded-[16px] border border-[#DCDCDC] text-slate-500">
            <p className="text-sm font-semibold">No encontramos trámites que coincidan con tu búsqueda.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todas las categorías');
                setInternalQuery('');
              }}
              className="mt-3 px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
