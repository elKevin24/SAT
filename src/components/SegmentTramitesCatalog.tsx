import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Layers, LayoutGrid, CheckCircle2 } from 'lucide-react';
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
  initialCategory?: string;
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToHome: () => void;
  onSwitchSegment: (segId: SegmentId) => void;
}

const SEGMENT_METADATA: Record<SegmentId, { title: string; shortTitle: string; desc: string; color: string; hoverBg: string; hoverBorder: string; hoverShadow: string }> = {
  contribuyentes: {
    title: 'Catálogo de Trámites para Contribuyentes',
    shortTitle: 'Contribuyentes',
    desc: 'Trámites para personas individuales sin obligaciones, pequeños contribuyentes, negocios en régimen general y contribuyentes especiales.',
    color: '#14649B',
    hoverBg: 'hover:bg-[#14649B]',
    hoverBorder: 'hover:border-[#14649B]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.24)]'
  },
  comercio_exterior: {
    title: 'Catálogo de Trámites para Operadores de Comercio Exterior',
    shortTitle: 'Operadores de Comercio Exterior',
    desc: 'Gestiones para importadores, exportadores, empresas de transporte internacional, agentes de aduanas y normativa arancelaria.',
    color: '#0284C7',
    hoverBg: 'hover:bg-[#0284C7]',
    hoverBorder: 'hover:border-[#0284C7]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.24)]'
  },
  profesionales: {
    title: 'Catálogo de Trámites para Profesionales',
    shortTitle: 'Profesionales',
    desc: 'Habilita tu registro como perito contador, auditor, abogado, notario o gestor tributario. Consulta los títulos y requisitos exigidos por la SAT.',
    color: '#4D8014',
    hoverBg: 'hover:bg-[#4D8014]',
    hoverBorder: 'hover:border-[#4D8014]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.24)]'
  },
  organismos_especiales: {
    title: 'Catálogo de Trámites para Organismos Especiales',
    shortTitle: 'Organismos Especiales',
    desc: 'Reconocimiento de exenciones tributarias para organizaciones sin fines de lucro, iglesias, universidades, municipalidades y entidades del Estado.',
    color: '#C25E00',
    hoverBg: 'hover:bg-[#C25E00]',
    hoverBorder: 'hover:border-[#C25E00]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.24)]'
  }
};

const CANONICAL_CATEGORY_ORDER: Record<string, string[]> = {
  contribuyentes: [
    'NIT sin Obligaciones',
    'Pequeños Contribuyentes',
    'Contribuyente General',
    'Contribuyentes Especiales'
  ],
  comercio_exterior: [
    'Importadores',
    'Exportadores',
    'Transportistas',
    'Agentes Aduaneros',
    'Normativa y Aranceles',
    'OEA',
    'Courier',
    'Almacenes Fiscales'
  ],
  profesionales: [
    'Abogados y Notarios',
    'Peritos Contadores',
    'Auditores',
    'Gestores Tributarios',
    'Servicios Profesionales'
  ],
  organismos_especiales: [
    'Entidades del Estado',
    'Constitucionales',
    'No Lucrativos',
    'Municipalidades',
    'Decreto'
  ]
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'NIT sin Obligaciones': 'Personas individuales, estudiantes y graduados sin actividad económica que requieren NIT para actos civiles, cuentas bancarias, títulos y remesas (cero asalariados).',
  'Pequeños Contribuyentes': 'Régimen simplificado de tributación del 5% definitivo (hasta Q150,000 anuales) y actividades agropecuarias especiales primarias y pecuarias.',
  'Contribuyente General': 'Personas y empresas con obligaciones generales de IVA (12%) e ISR, asalariados, gestión vehicular como propietarios y trámites del RTU.',
  'Contribuyentes Especiales': 'Medianos y grandes contribuyentes asignados a gerencias especiales con control y fiscalización tributaria intensiva.',
  'Importadores': 'Padrón de importadores, declaraciones DUCA, aranceles DAI, levante aduanero y vehículos para importadores.',
  'Exportadores': 'Padrón de exportadores, declaraciones aduaneras y solicitud de Devolución de Crédito Fiscal del IVA.',
  'Transportistas': 'Empresas de transporte terrestre, aéreo y marítimo internacional, tránsito aduanero y manifiestos de carga.',
  'Agentes Aduaneros': 'Auxiliares de la función pública autorizados para el despacho aduanero oficial y representación de operadores.',
  'Normativa y Aranceles': 'Criterios aduaneros oficiales, Sistema Arancelario Centroamericano (SAC), facilitación y combate al contrabando.',
  'Abogados y Notarios': 'Habilitación de e-Traspaso vehicular, registro notarial y legalización de documentos tributarios.',
  'Peritos Contadores': 'Inscripción y actualización de contadores autorizados ante la SAT para llevar contabilidades formales.',
  'Auditores': 'Habilitación para auditorías fiscales, dictámenes y trámites de devolución de crédito fiscal.',
  'Gestores Tributarios': 'Acreditación de gestores y personas autorizadas para tramitar ante agencias tributarias.',
  'Servicios Profesionales': 'Profesionales liberales independientes, emisión de facturas y pago de timbres profesionales.',
  'Entidades del Estado': 'Ministerios, secretarías y dependencias públicas con retenciones tributarias y exenciones oficiales.',
  'Constitucionales': 'Universidades, centros educativos y cuerpos diplomáticos exentos de tributos por mandato constitucional.',
  'No Lucrativos': 'Asociaciones, fundaciones, cooperativas e iglesias con reconocimiento de exención de impuestos.',
  'Municipalidades': 'Gobiernos locales y empresas municipales con trámites tributarios y acreditaciones ante SAT.',
  'Decreto': 'Entidades beneficiarias de incentivos fiscales y exenciones específicas por decreto legislativo.'
};

export const SegmentTramitesCatalog: React.FC<SegmentTramitesCatalogProps> = ({
  segmentId,
  initialCategory,
  allTramites,
  onSelectTramite,
  onBackToHome,
  onSwitchSegment
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Todas las categorías');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos los subtemas');
  const [viewLayout, setViewLayout] = useState<'branched' | 'grid'>('branched');
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});

  // Sync initialCategory if parent changes it
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedSubcategory('Todos los subtemas');
    }
  }, [initialCategory]);

  const meta = SEGMENT_METADATA[segmentId];

  // Filter trámites for this segment
  const segmentTramites = useMemo(() => {
    return allTramites.filter(t => t.pillar === segmentId);
  }, [allTramites, segmentId]);

  // Extract unique categories (Level 2) in this segment
  const categories = useMemo(() => {
    const set = new Set<string>();
    segmentTramites.forEach(t => {
      if (t.categoria) set.add(t.categoria);
    });
    const orderList = CANONICAL_CATEGORY_ORDER[segmentId] || [];
    const sorted = Array.from(set).sort((a, b) => {
      const idxA = orderList.indexOf(a);
      const idxB = orderList.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return ['Todas las categorías', ...sorted];
  }, [segmentTramites, segmentId]);

  // Extract unique subcategories (Level 3 - Branch nodes) for current category selection
  const subcategories = useMemo(() => {
    const set = new Set<string>();
    const inCurrentCategory = selectedCategory === 'Todas las categorías'
      ? segmentTramites
      : segmentTramites.filter(t => t.categoria === selectedCategory);

    inCurrentCategory.forEach(t => {
      if (t.subcategoria) set.add(t.subcategoria);
    });

    const sorted = Array.from(set).sort((a, b) => {
      const aIsInsc = a.toLowerCase().includes('inscripci');
      const bIsInsc = b.toLowerCase().includes('inscripci');
      if (aIsInsc && !bIsInsc) return -1;
      if (!aIsInsc && bIsInsc) return 1;
      return a.localeCompare(b);
    });

    return ['Todos los subtemas', ...sorted];
  }, [segmentTramites, selectedCategory]);

  // Apply filters and search
  const filteredTramites = useMemo(() => {
    return segmentTramites.filter(t => {
      const matchCat = selectedCategory === 'Todas las categorías' || t.categoria === selectedCategory;
      const matchSub = selectedSubcategory === 'Todos los subtemas' || t.subcategoria === selectedSubcategory;
      const matchQ = !internalQuery.trim() || 
        (t.tramite && t.tramite.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.subcategoria && t.subcategoria.toLowerCase().includes(internalQuery.toLowerCase())) ||
        (t.categoria && t.categoria.toLowerCase().includes(internalQuery.toLowerCase()));
      return matchCat && matchSub && matchQ;
    });
  }, [segmentTramites, selectedCategory, selectedSubcategory, internalQuery]);

  // Group filtered results into Branch Nodes (Subcategorías / Situaciones de ciclo de vida)
  const groupedBranches = useMemo(() => {
    const map = new Map<string, TramiteItem[]>();
    filteredTramites.forEach(t => {
      const key = t.subcategoria || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });

    const entries = Array.from(map.entries()).sort(([nameA, itemsA], [nameB, itemsB]) => {
      const aIsInsc = nameA.toLowerCase().includes('inscripci');
      const bIsInsc = nameB.toLowerCase().includes('inscripci');
      if (aIsInsc && !bIsInsc) return -1;
      if (!aIsInsc && bIsInsc) return 1;
      return itemsB.length - itemsA.length;
    });

    return entries.map(([subName, items]) => ({
      name: subName,
      count: items.length,
      items
    }));
  }, [filteredTramites]);

  const toggleBranch = (branchName: string) => {
    setCollapsedBranches(prev => ({
      ...prev,
      [branchName]: !prev[branchName]
    }));
  };

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
            <span className="text-slate-700">{meta.shortTitle}</span>
            {selectedCategory !== 'Todas las categorías' && (
              <>
                <span>/</span>
                <span className="text-[#19324B] font-bold">{selectedCategory}</span>
              </>
            )}
            {selectedSubcategory !== 'Todos los subtemas' && (
              <>
                <span>/</span>
                <span className="text-[#14649B] font-semibold">{selectedSubcategory}</span>
              </>
            )}
          </div>

          {/* Quick switcher between segments */}
          <div className="flex items-center gap-1.5 text-xs">
            {(Object.keys(SEGMENT_METADATA) as SegmentId[]).map((segKey) => (
              <button
                key={segKey}
                onClick={() => {
                  setSelectedCategory('Todas las categorías');
                  setSelectedSubcategory('Todos los subtemas');
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#14649B] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                Pilar Oficial Nivel 1
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {segmentTramites.length} trámites oficiales disponibles
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#19324B] tracking-tight">
              {meta.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {meta.desc}
            </p>
          </div>

          {/* Selector de modo de visualización */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DCDCDC] text-xs font-semibold shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewLayout('branched')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'branched'
                  ? 'bg-[#14649B] text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ver agrupado por ramas temáticas jerárquicas (estilo ATO)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Por Ramas Temáticas</span>
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'grid'
                  ? 'bg-[#14649B] text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ver cuadrícula directa"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cuadrícula</span>
            </button>
          </div>
        </div>

        {/* Level 2: Selector de Categorías / Clasificaciones Oficiales */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-[14px] border border-[#DCDCDC]">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 shrink-0">
              Clasificación:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory('Todos los subtemas');
                }}
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
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              placeholder="Buscar trámite o palabra clave..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#DCDCDC] rounded-xl focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B] outline-none"
            />
          </div>
        </div>

        {/* Level 3: Subnodos Temáticos Ramificados (Filtro de Segundo Nivel / Nodos Hijos) */}
        {subcategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 shrink-0">
              Subtemas:
            </span>
            {subcategories.map((sub) => {
              const count = sub === 'Todos los subtemas'
                ? filteredTramites.length
                : segmentTramites.filter(t => 
                    (selectedCategory === 'Todas las categorías' || t.categoria === selectedCategory) &&
                    t.subcategoria === sub
                  ).length;

              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedSubcategory === sub
                      ? 'bg-slate-800 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  }`}
                >
                  <span>{sub}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedSubcategory === sub ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}


        {/* Banner contextual orientado al ciudadano para NIT sin Obligaciones */}
        {selectedCategory === 'NIT sin Obligaciones' && !internalQuery && (
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-[14px]">
            <h3 className="text-sm font-bold text-[#14649B] mb-1">
              Número de Identificación Tributaria (NIT)
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos, consultar su NIT y qué hacer si ha sido utilizado de forma indebida.
            </p>
          </div>
        )}

        {/* RENDER DE RESULTADOS */}
        {filteredTramites.length > 0 ? (
          viewLayout === 'branched' ? (
            /* Vista 1: Ramas Temáticas Jerárquicas (Estilo ATO) */
            <div className="space-y-6">
              {groupedBranches.map((branch) => {
                const isCollapsed = !!collapsedBranches[branch.name];

                return (
                  <div 
                    key={branch.name}
                    className="border border-[#DCDCDC] rounded-[16px] overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    {/* Encabezado del Nodo Hijo Temático */}
                    <div 
                      onClick={() => toggleBranch(branch.name)}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between gap-3 border-b border-slate-200 select-none transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <button className="text-slate-400 hover:text-slate-600">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-[#14649B]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#14649B]" />
                          )}
                        </button>
                        <span className="w-2 h-2 rounded-full bg-[#14649B]" />
                        <h3 className="text-sm font-bold text-[#19324B]">
                          {branch.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                          {branch.count} {branch.count === 1 ? 'trámite' : 'trámites'}
                        </span>
                      </div>
                    </div>

                    {/* Hojas / Trámites del Nodo Hijo */}
                    {!isCollapsed && (
                      <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                        {branch.items.map((tramite) => (
                          <div
                            key={tramite.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectTramite(tramite)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectTramite(tramite);
                              }
                            }}
                            aria-label={`Ver requisitos de ${tramite.tramite}`}
                            className={`p-4 sm:p-5 bg-white border border-[#DCDCDC] rounded-[14px] ${meta.hoverBorder} ${meta.hoverBg} ${meta.hoverShadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14649B] focus-visible:ring-offset-2`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-white/80">
                                  {tramite.categoria}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#19324B] group-hover:text-white transition-colors leading-snug mb-1.5">
                                {tramite.tramite}
                              </h4>

                              <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors line-clamp-3 leading-relaxed">
                                {tramite.descripcion}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Vista 2: Cuadrícula Directa */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
              {filteredTramites.map((tramite) => (
                <div
                  key={tramite.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectTramite(tramite)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTramite(tramite);
                    }
                  }}
                  aria-label={`Ver requisitos de ${tramite.tramite}`}
                  className={`p-4 sm:p-5 bg-white border border-[#DCDCDC] rounded-[14px] ${meta.hoverBorder} ${meta.hoverBg} ${meta.hoverShadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14649B] focus-visible:ring-offset-2`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 group-hover:text-white/80">
                        {tramite.categoria} › {tramite.subcategoria}
                      </span>
                    </div>
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
          )
        ) : (
          <div className="p-10 text-center bg-slate-50 rounded-[16px] border border-[#DCDCDC] text-slate-500">
            <p className="text-sm font-semibold">No encontramos trámites que coincidan con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todas las categorías');
                setSelectedSubcategory('Todos los subtemas');
                setInternalQuery('');
              }}
              className="mt-3 px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl hover:bg-[#19324B] transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
