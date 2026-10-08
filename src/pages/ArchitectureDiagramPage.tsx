import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Maximize2, 
  Minimize2,
  GitBranch,
  Network,
  Info,
  CheckCircle2
} from 'lucide-react';
import rawTramites from '../data/allTramites.json';

export type PillarKey = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'entes_exentos';

interface PillarConfig {
  id: PillarKey;
  name: string;
  shortName: string;
  badgeColor: string;
  primaryColor: string;
  borderColor: string;
  bgLight: string;
  description: string;
}

const PILLARS: PillarConfig[] = [
  {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    shortName: 'Contribuyentes',
    badgeColor: 'bg-[#14649B]',
    primaryColor: '#14649B',
    borderColor: 'border-[#14649B]',
    bgLight: 'bg-[#14649B]/5',
    description: 'Información y servicios tributarios para personas y empresas.'
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    shortName: 'Comercio Exterior',
    badgeColor: 'bg-[#0284C7]',
    primaryColor: '#0284C7',
    borderColor: 'border-[#0284C7]',
    bgLight: 'bg-[#0284C7]/5',
    description: 'Servicios e información aduanera para la importación, exportación y logística.'
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    shortName: 'Profesionales',
    badgeColor: 'bg-[#4D8014]',
    primaryColor: '#4D8014',
    borderColor: 'border-[#4D8014]',
    bgLight: 'bg-[#4D8014]/5',
    description: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.'
  },
  {
    id: 'entes_exentos',
    name: 'Entes Exentos',
    shortName: 'Entes Exentos',
    badgeColor: 'bg-[#C25E00]',
    primaryColor: '#C25E00',
    borderColor: 'border-[#C25E00]',
    bgLight: 'bg-[#C25E00]/5',
    description: 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.'
  }
];

const OFFICIAL_ORDER: Record<PillarKey, string[]> = {
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
  entes_exentos: [
    'Entidades del Estado',
    'Constitucionales',
    'No Lucrativos',
    'Municipalidades',
    'Decreto',
    'ZOLIC'
  ]
};

const OFFICIAL_SUBCATEGORY_PRIORITY: Record<string, string[]> = {
  'NIT sin Obligaciones': [
    'Inscripción de NIT',
    'Servicios en Línea y Solvencias',
    'Títulos Universitarios',
    'Información Pública'
  ],
  'Pequeños Contribuyentes': [
    'Inscripción en RTU',
    'Regímenes tributarios',
    'Facturación electrónica',
    'Otros servicios al contribuyente',
    'Cultura tributaria'
  ],
  'Contribuyente General': [
    // 1. RTU e Inscripción (puerta de entrada)
    'RTU: Inscripción de Sociedades y Empresas',
    'RTU: Inscripción de Entidades Especiales',
    'RTU: Gestión de NIT, Representantes y Contadores',
    'RTU: Actualización de Datos y Domicilio',
    'RTU: Actualización de Sociedades y Entidades',
    'RTU: Cierre y Suspensión de Negocios',
    'RTU: Cierre y Cancelación de Empresas',
    // 2. Obligaciones y Regímenes
    'Regímenes tributarios',
    'Declaraciones, pagos y solvencias',
    'Facturación: Sistema FEL y Factura Electrónica',
    'Facturación: Autorización de Documentos e Imprentas',
    'Facturación: Constancias de Exención y Formularios',
    // 3. Devoluciones
    'Devoluciones: Impuesto Sobre la Renta (ISR)',
    'Devoluciones: IVA y Crédito Fiscal',
    'Devoluciones: Pagos Indebidos o en Exceso',
    'Devoluciones: Otros Impuestos y Compensaciones',
    // 4. Registro Fiscal de Vehículos (dividido en 9 ramas de 7 a 9 trámites)
    'Vehículos: Inscripción y Primeras Placas',
    'Vehículos: Traspasos y Compraventa',
    'Vehículos: Traspasos Especiales',
    'Vehículos: Distintivos, Tarjeta y Placas',
    'Vehículos: Impuesto de Circulación (ISCV)',
    'Vehículos: Modificaciones y Rectificaciones',
    'Vehículos: Bajas e Inactivación',
    'Vehículos: Reactivación de Vehículos',
    'Vehículos: Consultas y Autorizaciones',
    // 5. Servicios y Gestiones
    'Servicios: Constancias del RTU y Acreditaciones',
    'Servicios: Libros Contables y Documentos',
    'Servicios: Correcciones en Formularios y Pagos',
    'Servicios: Agencia Virtual y Claves',
    'Servicios: Citas y Atención Presencial',
    'Consultas y verificadores',
    // 6. Capacitación y Cultura Tributaria (dividido en 7 ramas de 7 a 9 trámites)
    'Capacitación: Cursos de ISR e ISO',
    'Capacitación: Cursos de IVA e Impuestos Específicos',
    'Capacitación: Herramientas y Facturación FEL',
    'Capacitación: Eventos, Diplomados y Calendario',
    'Cultura Tributaria: Biblioteca y Materiales',
    'Cultura Tributaria: Ciudadanía y Programas NAF',
    'Cultura Tributaria: Preguntas Frecuentes y Normativa',
    'Atención, quejas y denuncias'
  ],
  'Importadores': [
    'Importación: Registro de Importador y Requisitos',
    'Importación: Pólizas y Fianza de Mercancías',
    'Importación: Vehículos y Admisiones Temporales',
    'Importación: Placas y Distintivos de Distribuidor',
    'Importación: Requisitos y Tablas de Vehículos',
    'Aduanas: Declaraciones, DUCAs y Valor',
    'Aduanas: Consultas, Retención y Estados',
    'Aduanas: Control, Abandono y Despacho',
    'Aduanas: Requisitos y Trámites Aduaneros'
  ],
  'Exportadores': [
    'Exportación: Registro y Regímenes de Exportador',
    'Exportación: Devolución de Crédito Fiscal',
    'Exportación: Declaraciones y Embarques Aduaneros'
  ]
};

const sortSubcategories = (catName: string, entries: [string, any[]][]) => {
  const priorityList = OFFICIAL_SUBCATEGORY_PRIORITY[catName] || [];
  return [...entries].sort(([subA, itemsA], [subB, itemsB]) => {
    // 1. Inscripción siempre tiene prioridad absoluta de primer lugar
    const aIsInsc = subA.toLowerCase().includes('inscripci');
    const bIsInsc = subB.toLowerCase().includes('inscripci');
    if (aIsInsc && !bIsInsc) return -1;
    if (!aIsInsc && bIsInsc) return 1;

    // 2. Orden oficial por lista
    const idxA = priorityList.indexOf(subA);
    const idxB = priorityList.indexOf(subB);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    // 3. Fallback por cantidad descendente
    return itemsB.length - itemsA.length;
  });
};

export const ArchitectureDiagramPage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarKey | 'all'>('contribuyentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'diagram' | 'tree' | 'umbrella'>('diagram');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'contribuyentes-NIT sin Obligaciones': true,
    'contribuyentes-Pequeños Contribuyentes': true,
    'contribuyentes-Contribuyente General': true,
    'contribuyentes-Contribuyentes Especiales': true,
  });
  const [selectedDiagramBranch, setSelectedDiagramBranch] = useState<string>('NIT sin Obligaciones');
  const [activeModalTramite, setActiveModalTramite] = useState<any | null>(null);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    PILLARS.forEach(p => {
      const items = rawTramites.filter(t => t.pillar === p.id);
      const cats = Array.from(new Set(items.map(i => i.categoria)));
      cats.forEach(c => {
        next[`${p.id}-${c}`] = true;
      });
    });
    setExpandedNodes(next);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Hierarchical tree build
  const treeHierarchy = useMemo(() => {
    const pillarsToProcess = selectedPillar === 'all' 
      ? PILLARS 
      : PILLARS.filter(p => p.id === selectedPillar);

    return pillarsToProcess.map(pillar => {
      let pillarTramites = (rawTramites as any[]).filter(t => t.pillar === pillar.id);
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        pillarTramites = pillarTramites.filter(t => 
          t.tramite?.toLowerCase().includes(q) ||
          t.categoria?.toLowerCase().includes(q) ||
          t.subcategoria?.toLowerCase().includes(q) ||
          t.descripcion?.toLowerCase().includes(q)
        );
      }

      // Group by Category (Nivel 2)
      const categoriesMap: Record<string, any[]> = {};
      pillarTramites.forEach(t => {
        const cat = t.categoria || 'General';
        if (!categoriesMap[cat]) categoriesMap[cat] = [];
        categoriesMap[cat].push(t);
      });

      const orderList = OFFICIAL_ORDER[pillar.id] || [];
      const sortedCatEntries = Object.entries(categoriesMap).sort(([catA], [catB]) => {
        const idxA = orderList.indexOf(catA);
        const idxB = orderList.indexOf(catB);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return catA.localeCompare(catB);
      });

      const categories = sortedCatEntries.map(([catName, tramitesInCat]) => {
        // Group by Subcategory / Theme (Nivel 3)
        const subcategoriesMap: Record<string, any[]> = {};
        tramitesInCat.forEach(t => {
          const sub = t.subcategoria || 'General';
          if (!subcategoriesMap[sub]) subcategoriesMap[sub] = [];
          subcategoriesMap[sub].push(t);
        });

        const subcategories = sortSubcategories(catName, Object.entries(subcategoriesMap))
          .map(([subName, tramitesInSub]) => ({
            name: subName,
            count: tramitesInSub.length,
            tramites: tramitesInSub
          }));

        return {
          name: catName,
          nodeId: `${pillar.id}-${catName}`,
          count: tramitesInCat.length,
          subcategories
        };
      });

      return {
        ...pillar,
        totalCount: pillarTramites.length,
        categories
      };
    });
  }, [selectedPillar, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#14649B] selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#DCDCDC] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a 
              href="#/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:text-[#19324B] px-3 py-1.5 rounded-lg border border-[#DCDCDC] hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Portal
            </a>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#14649B] flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-[#19324B] tracking-tight leading-tight">
                  Diagrama de Arquitectura de Información
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Mapa visual jerárquico de contenidos oficiales SAT · 4 Pilares · 690 Trámites
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="#/estilo" 
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#14649B] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#14649B]" />
              Design System
            </a>

            {/* Selector de Vistas de Diagrama */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('diagram')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${viewMode === 'diagram' ? 'bg-white shadow-xs text-[#14649B] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                title="Ver organigrama visual jerárquico ramificado"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Mapa de Ramificación</span>
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${viewMode === 'tree' ? 'bg-white shadow-xs text-[#14649B] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                title="Explorador dinámico con todos los trámites hojas"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Árbol Detallado</span>
              </button>
              <button
                onClick={() => setViewMode('umbrella')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${viewMode === 'umbrella' ? 'bg-white shadow-xs text-[#14649B] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                title="Vista sombrilla de los 4 pilares y sus grupos"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sombrilla Macro</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Leyenda de Arquitectura Jerárquica ATO */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCDCDC] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#19324B]">Jerarquía Oficial:</span>
            <span className="bg-[#19324B] text-white px-2 py-0.5 rounded-md font-bold text-[11px]">Nivel 0: Raíz SAT</span>
            <span className="text-slate-400">›</span>
            <span className="bg-[#14649B] text-white px-2 py-0.5 rounded-md font-bold text-[11px]">Nivel 1: Pilar</span>
            <span className="text-slate-400">›</span>
            <span className="bg-sky-700 text-white px-2 py-0.5 rounded-md font-bold text-[11px]">Nivel 2: Grupo Normativo</span>
            <span className="text-slate-400">›</span>
            <span className="bg-slate-700 text-white px-2 py-0.5 rounded-md font-bold text-[11px]">Nivel 3: Subnodo Temático</span>
            <span className="text-slate-400">›</span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-bold text-[11px]">Nivel 4: Trámite Hoja</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Sin categorías artificiales · Estructura normativa de 4 grupos en Contribuyentes
          </div>
        </div>

        {/* Controles de Filtro y Segmento */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDC] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Segment Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setSelectedPillar('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedPillar === 'all'
                    ? 'bg-[#19324B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos los Pilares ({rawTramites.length})
              </button>
              {PILLARS.map(p => {
                const isSelected = selectedPillar === p.id;
                const count = (rawTramites as any[]).filter(t => t.pillar === p.id).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPillar(p.id);
                      const defaultBranch = OFFICIAL_ORDER[p.id]?.[0] || 'General';
                      setSelectedDiagramBranch(defaultBranch);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? `${p.badgeColor} text-white shadow-xs`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tree expansion toggles */}
            {viewMode === 'tree' && (
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={expandAll}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#14649B] bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Maximize2 className="w-3 h-3" />
                  Expandir Todo
                </button>
                <button
                  onClick={collapseAll}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#14649B] bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Minimize2 className="w-3 h-3" />
                  Colapsar Todo
                </button>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar trámite, régimen, categoría o palabra clave (ej. RTU, ISCV, FEL, importación, donaciones)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-[#DCDCDC] rounded-xl focus:bg-white focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/10 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISTA 1: MAPA DE RAMIFICACIÓN VISUAL (DIAGRAMA INTERACTIVO) */}
        {/* ========================================================= */}
        {viewMode === 'diagram' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Raíz Institucional Nivel 0 */}
            <div className="text-center bg-white p-5 rounded-2xl border-2 border-[#14649B] shadow-xs max-w-2xl mx-auto relative">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#14649B] bg-[#14649B]/10 px-3 py-0.5 rounded-full inline-block mb-1">
                Nivel 0 · Raíz Institucional
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#19324B]">PORTAL SAT GUATEMALA</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Arquitectura de Información Unificada · 4 Macro Pilares · {rawTramites.length} Trámites
              </p>
            </div>

            {/* Conectores hacia los 4 Pilares (Nivel 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {PILLARS.map(p => {
                const count = (rawTramites as any[]).filter(t => t.pillar === p.id).length;
                const isPillarSelected = selectedPillar === p.id || selectedPillar === 'all';
                const branches = OFFICIAL_ORDER[p.id] || [];

                return (
                  <div 
                    key={p.id}
                    className={`rounded-2xl border transition-all bg-white flex flex-col justify-between ${
                      isPillarSelected ? `${p.borderColor} border-2 shadow-sm` : 'border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="p-4">
                      {/* Cabecera del Pilar */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`w-3 h-3 rounded-full ${p.badgeColor}`} />
                        <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {count} trámites
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#19324B] mb-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                        {p.description}
                      </p>

                      {/* Grupos de Nivel 2 en este Pilar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Grupos Normativos (Nivel 2):
                        </span>
                        <div className="flex flex-col gap-1">
                          {branches.map(bName => {
                            const countInB = (rawTramites as any[]).filter(t => t.pillar === p.id && t.categoria === bName).length;
                            const isBranchActive = selectedDiagramBranch === bName;

                            return (
                              <button
                                key={bName}
                                onClick={() => setSelectedDiagramBranch(bName)}
                                className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between gap-1.5 ${
                                  isBranchActive
                                    ? `${p.badgeColor} text-white font-bold shadow-2xs`
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="truncate">{bName}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isBranchActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                  {countInB}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explorador de Ramificación Profunda (Nivel 3 y 4 del Grupo Seleccionado) */}
            <div className="bg-white rounded-2xl border border-[#DCDCDC] p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Inspección de Ramificación · Grupo Seleccionado:
                  </span>
                  <span className="text-base font-black text-[#19324B]">
                    {selectedDiagramBranch}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {rawTramites.filter((t: any) => t.categoria === selectedDiagramBranch).length} trámites en este grupo
                </div>
              </div>

              {/* Banner contextual de Plain Language si es NIT sin Obligaciones */}
              {selectedDiagramBranch === 'NIT sin Obligaciones' && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14649B]" />
                    <h4 className="text-xs font-black text-[#14649B] uppercase tracking-wider">
                      Número de Identificación Tributaria (NIT) · Regla de Exclusividad
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos, consultar su NIT y qué hacer si ha sido utilizado de forma indebida. 
                    <strong> Exclusivo para personas sin actividad lucrativa (cero trabajadores asalariados).</strong>
                  </p>
                </div>
              )}

              {/* Subnodos Temáticos (Nivel 3) */}
              <div className="space-y-4 pt-1">
                {(() => {
                  const itemsInBranch = (rawTramites as any[]).filter(t => t.categoria === selectedDiagramBranch);
                  const subMap: Record<string, any[]> = {};
                  itemsInBranch.forEach(t => {
                    const sub = t.subcategoria || 'General';
                    if (!subMap[sub]) subMap[sub] = [];
                    subMap[sub].push(t);
                  });

                  const subList = sortSubcategories(selectedDiagramBranch, Object.entries(subMap));

                  if (subList.length === 0) {
                    return (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        Selecciona un grupo en el mapa superior para explorar su ramificación tematica.
                      </p>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subList.map(([subName, items]) => (
                        <div 
                          key={subName}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
                              <h4 className="text-xs font-bold text-[#19324B]">
                                {subName}
                              </h4>
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                              {items.length} {items.length === 1 ? 'trámite' : 'trámites'}
                            </span>
                          </div>

                          {/* Trámites hojas dentro del subtema */}
                          <div className="space-y-1.5">
                            {items.map(tr => (
                              // Página de exploración (dev): CRÍTICO 1 (ROADMAP-AUDITORIA.md, Fase 1)
                              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                              <div
                                key={tr.id}
                                onClick={() => setActiveModalTramite(tr)}
                                className="p-2 bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-[#14649B] rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 text-xs group"
                              >
                                <span className="font-semibold text-slate-800 group-hover:text-[#14649B] truncate">
                                  {tr.tramite}
                                </span>
                                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-[#14649B] shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 2: SOMBRILLA MACRO (VISTA RESUMEN COMPARATIVA)       */}
        {/* ========================================================= */}
        {viewMode === 'umbrella' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Root Umbrella Node */}
            <div className="text-center bg-white p-6 rounded-2xl border-2 border-[#14649B] shadow-xs max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14649B]/10 text-[#14649B] text-xs font-black uppercase tracking-wider mb-2">
                Nivel 0 · Raíz Institucional
              </div>
              <h2 className="text-xl font-black text-[#19324B]">PORTAL SAT GUATEMALA</h2>
              <p className="text-xs text-slate-600 mt-1">
                Catálogo Unificado de {rawTramites.length} Trámites Oficiales y 49 Procesos Guiados
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PILLARS.map(p => {
                const count = (rawTramites as any[]).filter(t => t.pillar === p.id).length;
                const cats = Array.from(new Set((rawTramites as any[]).filter(t => t.pillar === p.id).map(t => t.categoria)));
                
                return (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#DCDCDC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`w-3 h-3 rounded-full ${p.badgeColor}`} />
                        <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {count} Trámites
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#19324B] mb-1.5 leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="space-y-1.5 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Categorías Oficiales (Nivel 2):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(cats))
                            .sort((a, b) => {
                              const list = OFFICIAL_ORDER[p.id] || [];
                              const ia = list.indexOf(a);
                              const ib = list.indexOf(b);
                              if (ia !== -1 && ib !== -1) return ia - ib;
                              if (ia !== -1) return -1;
                              if (ib !== -1) return 1;
                              return a.localeCompare(b);
                            })
                            .map(c => (
                              <span 
                                key={c}
                                className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                              >
                                {c}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPillar(p.id);
                        setViewMode('tree');
                      }}
                      className="mt-5 w-full py-2 bg-slate-50 hover:bg-[#14649B] hover:text-white text-[#14649B] border border-[#DCDCDC] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Explorar Árbol Detallado</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 3: ÁRBOL DETALLADO DINÁMICO (EXPANSIÓN MULTINIVEL)   */}
        {/* ========================================================= */}
        {viewMode === 'tree' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {treeHierarchy.map(pillar => (
              <div 
                key={pillar.id}
                className="bg-white rounded-2xl border border-[#DCDCDC] overflow-hidden shadow-xs"
              >
                {/* Pillar Header (Nivel 1) */}
                <div className={`p-4 sm:p-5 border-b border-[#DCDCDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${pillar.bgLight}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${pillar.badgeColor} shrink-0`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Nivel 1 · Macro Segmento
                        </span>
                        <span className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                          {pillar.totalCount} trámites
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-[#19324B]">
                        {pillar.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 max-w-md hidden md:block">
                    {pillar.description}
                  </p>
                </div>

                {/* Categories Container (Nivel 2) */}
                <div className="p-4 sm:p-5 space-y-3">
                  {pillar.categories.map(cat => {
                    const isExpanded = !!expandedNodes[cat.nodeId] || !!searchQuery;
                    
                    return (
                      <div 
                        key={cat.name}
                        className="border border-[#DCDCDC] rounded-xl overflow-hidden bg-slate-50/50 transition-all"
                      >
                        {/* Category Row Header */}
                        {/* Página de exploración (dev): CRÍTICO 1 (ROADMAP-AUDITORIA.md, Fase 1) */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <div 
                          onClick={() => toggleNode(cat.nodeId)}
                          className="p-3 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 select-none transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <button className="text-slate-400 hover:text-slate-600">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[#14649B]" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wide">
                              Nivel 2:
                            </span>
                            <h3 className="text-sm font-bold text-[#19324B]">
                              {cat.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {cat.count} {cat.count === 1 ? 'trámite' : 'trámites'}
                            </span>
                          </div>
                        </div>

                        {/* Banner contextual de plain language para NIT sin Obligaciones */}
                        {cat.name === 'NIT sin Obligaciones' && isExpanded && (
                          <div className="mx-3 my-2 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-slate-700">
                            <strong>Número de Identificación Tributaria (NIT):</strong> Cómo solicitar un NIT, actualizar sus datos y consultar su NIT. 
                            <em> Exclusivo para personas sin actividad económica (cero asalariados).</em>
                          </div>
                        )}

                        {/* Subcategories / Temas (Nivel 3) */}
                        {isExpanded && (
                          <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 space-y-3 animate-in slide-in-from-top-1 duration-200">
                            {cat.subcategories.map(sub => (
                              <div 
                                key={sub.name}
                                className="bg-white p-3 rounded-lg border border-slate-200 space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#14649B]" />
                                    <span className="text-xs font-bold text-slate-800">
                                      {sub.name}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    {sub.count} items
                                  </span>
                                </div>

                                {/* Trámites Pills Grid (Nivel 4) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                                  {sub.tramites.map(tr => (
                                  // Página de exploración (dev): CRÍTICO 1 (ROADMAP-AUDITORIA.md, Fase 1)
                                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                                  <div
                                    key={tr.id}
                                    onClick={() => setActiveModalTramite(tr)}
                                      className="p-2.5 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-[#14649B] rounded-lg cursor-pointer transition-all hover:shadow-xs group flex flex-col justify-between text-left"
                                    >
                                      <div>
                                        <h4 className="text-xs font-bold text-[#19324B] group-hover:text-[#14649B] line-clamp-2 leading-snug">
                                          {tr.tramite}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                                          {tr.descripcion || 'Requisitos normativos oficiales y pasos en línea de la SAT.'}
                                        </p>
                                      </div>

                                      <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                          <FileText className="w-3 h-3 text-[#14649B]" />
                                          Ver detalle
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-[#14649B]" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Modal for Trámite Inspection */}
      {activeModalTramite && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#DCDCDC] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#DCDCDC] bg-slate-50 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#14649B] bg-[#14649B]/10 px-2 py-0.5 rounded-md inline-block mb-1">
                  {activeModalTramite.pillarName || activeModalTramite.pillar} › {activeModalTramite.categoria}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#19324B] leading-tight">
                  {activeModalTramite.tramite}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalTramite(null)}
                className="text-slate-400 hover:text-slate-700 w-7 h-7 rounded-full bg-slate-200/60 flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Descripción Oficial:
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {activeModalTramite.descripcion || 'Sin descripción adicional registrada en la ficha oficial.'}
                </p>
              </div>

              {activeModalTramite.nota && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-bold block mb-0.5">Nota / Aclaración Normativa:</span>
                  {activeModalTramite.nota}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1">Subcategoría / Rama:</span>
                  <span className="text-[#19324B] font-semibold">{activeModalTramite.subcategoria || 'General'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1">Pilar Oficial:</span>
                  <span className="text-[#19324B] font-semibold">{activeModalTramite.pillarName || activeModalTramite.pillar}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DCDCDC] bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalTramite(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cerrar
              </button>
              {activeModalTramite.url && (
                <a
                  href={activeModalTramite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#14649B] hover:bg-[#19324B] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Abrir en Portal SAT Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
