import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Users, 
  Globe2, 
  Briefcase, 
  Building2,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
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

const SEGMENT_METADATA: Record<SegmentId, { title: string; desc: string; icon: React.ElementType; color: string }> = {
  contribuyentes: {
    title: 'Catálogo de Trámites para Contribuyentes',
    desc: 'NIT sin obligaciones, Pequeño Contribuyente, Régimen General y Contribuyentes Especiales.',
    icon: Users,
    color: '#14649B'
  },
  comercio_exterior: {
    title: 'Catálogo de Trámites de Comercio Exterior',
    desc: 'Importadores, exportadores, OEA y auxiliares de la función pública aduanera.',
    icon: Globe2,
    color: '#0284C7'
  },
  profesionales: {
    title: 'Catálogo para Profesionales y Terceras Personas',
    desc: 'Gestores tributarios, abogados, notarios, contadores públicos y auditores.',
    icon: Briefcase,
    color: '#2D5A0C'
  },
  organismos_especiales: {
    title: 'Catálogo de Organismos Especiales y Exentos',
    desc: 'Entidades exentas por ley, instituciones del Estado, municipalidades y diplomáticas.',
    icon: Building2,
    color: '#C25E00'
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const meta = SEGMENT_METADATA[segmentId];
  const Icon = meta.icon;

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
    return ['Todas', ...Array.from(set)];
  }, [segmentTramites]);

  // Apply filters and search
  const filteredTramites = useMemo(() => {
    return segmentTramites.filter(t => {
      const matchCat = selectedCategory === 'Todas' || t.categoria === selectedCategory;
      const matchQ = !internalQuery.trim() || 
        (t.tramite && t.tramite.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.subcategoria && t.subcategoria.toLowerCase().includes(internalQuery.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [segmentTramites, selectedCategory, internalQuery]);

  return (
    <div className="py-8 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb (Nielsen H1 & H3) */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button 
              onClick={onBackToHome}
              className="hover:text-[#14649B] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Inicio
            </button>
            <span>/</span>
            <span className="text-[#19324B] font-bold">{meta.title}</span>
          </div>

          {/* Quick switcher between the 4 segments */}
          <div className="flex items-center gap-1 text-xs">
            {(Object.keys(SEGMENT_METADATA) as SegmentId[]).map((segKey) => (
              <button
                key={segKey}
                onClick={() => {
                  setSelectedCategory('Todas');
                  setInternalQuery('');
                  onSwitchSegment(segKey);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  segKey === segmentId 
                    ? 'bg-[#14649B] text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {SEGMENT_METADATA[segKey].title.split(' ')[2] || 'Grupo'}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Segment Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-sky-50/30 to-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ backgroundColor: meta.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#19324B] tracking-tight">
                {meta.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {meta.desc}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-white/80 p-3 rounded-xl border border-slate-200/80">
            <div className="text-lg font-black text-[#14649B]">{filteredTramites.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trámites Disponibles</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-[#14649B] shadow-2xs border border-blue-200'
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
              placeholder="Filtrar en este segmento..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B] outline-none"
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredTramites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTramites.map((tramite) => (
              <div
                key={tramite.id}
                onClick={() => onSelectTramite(tramite)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#14649B] bg-white shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {tramite.categoria}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {tramite.subcategoria}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors leading-snug mb-2">
                    {tramite.tramite}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {tramite.descripcion}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#14649B]">
                  <span>Ver requisitos y pasos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
            <p className="text-sm font-semibold">No se encontraron trámites con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setInternalQuery('');
              }}
              className="mt-3 px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl"
            >
              Restablecer filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
