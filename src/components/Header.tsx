import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Video,
  Layers,
  UserCheck,
  FileText,
  Plane,
  Lock,
  X,
  Compass,
  ArrowRight,
  Palette,
  Menu as MenuIcon,
  Home
} from 'lucide-react';
import { SatIsologotipo } from './SatIsologotipo';
import type { TramiteItem, ProcesoGuiado } from '../data/schema';
import type { SegmentId } from './UserSegmentCards';
import { OFFICIAL_CATEGORY_ORDER } from '../data/categoryOrder';

interface HeaderProps {
  onGoHome: () => void;
  onGoStyleGuide?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTramite: (tramite: TramiteItem) => void;
  onSelectProceso: (proceso: ProcesoGuiado) => void;
  onOpenAccessibility: () => void;
  allTramites: TramiteItem[];
  allProcesos: ProcesoGuiado[];

  // Props para Barra de Navegación Principal y Menú de Nivel
  currentView?: 'home' | 'catalog' | 'solicitar-nit' | 'fel' | 'gestion';
  activeSegment?: SegmentId | null;
  activeCategory?: string;
  activeSubcategory?: string | null;
  onSelectSegment?: (segId: SegmentId, category?: string) => void;
  onSelectBreadcrumb?: (level: 'home' | 'segment' | 'category') => void;
  isContentLevel?: boolean;
  contentLevelItems?: TramiteItem[];
  contentLevelTitle?: string;
}

const MACROGROUPS: { id: SegmentId; name: string; shortName: string; color: string }[] = [
  { id: 'contribuyentes', name: 'Contribuyentes', shortName: 'Contribuyentes', color: '#14649B' },
  { id: 'comercio_exterior', name: 'Operadores de Comercio Exterior', shortName: 'Comercio Exterior', color: '#0284C7' },
  { id: 'profesionales', name: 'Profesionales', shortName: 'Profesionales', color: '#4D8014' },
  { id: 'entes_exentos', name: 'Entes Exentos', shortName: 'Entes Exentos', color: '#C25E00' },
];

const FORMACION_ITEMS = [
  {
    title: 'Capacitaciones y Talleres',
    desc: 'Cursos virtuales y presenciales',
    icon: GraduationCap,
    url: 'https://portal.sat.gob.gt/portal/capacitaciones/'
  },
  {
    title: 'Cultura Tributaria',
    desc: 'Educación cívico tributaria',
    icon: BookOpen,
    url: 'https://portal.sat.gob.gt/portal/cultura-tributaria/'
  },
  {
    title: 'Biblioteca Virtual',
    desc: 'Leyes, reglamentos y manuales',
    icon: Layers,
    url: 'https://portal.sat.gob.gt/portal/biblioteca-virtual/'
  },
  {
    title: 'Proyección Educativa y NAF',
    desc: 'Núcleos de apoyo contable y fiscal',
    icon: UserCheck,
    url: 'https://portal.sat.gob.gt/portal/naf/'
  },
  {
    title: 'Videos y Recursos Educativos',
    desc: 'Tutoriales y material didáctico',
    icon: Video,
    url: 'https://portal.sat.gob.gt/portal/videos-tutoriales/'
  }
];

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onGoStyleGuide,
  searchQuery,
  onSearchChange,
  onSelectTramite,
  onSelectProceso,
  onOpenAccessibility,
  allTramites,
  allProcesos,
  currentView = 'home',
  activeSegment = null,
  activeCategory = '',
  activeSubcategory = null,
  onSelectSegment,
  onSelectBreadcrumb,
  isContentLevel = false,
  contentLevelItems = [],
  contentLevelTitle = ''
}) => {
  const [showFormacionMenu, setShowFormacionMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const prevContentLevelRef = useRef<boolean>(false);
  const prevContentTitleRef = useRef<string>('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Al cambiar de vista o salir del nivel de contenido, asegurar que el menú quede cerrado
    if (!isContentLevel && prevContentLevelRef.current) {
      setIsLevelMenuOpen(false);
      setMenuSearchQuery('');
    }
    prevContentLevelRef.current = !!isContentLevel;
    prevContentTitleRef.current = contentLevelTitle || '';
  }, [isContentLevel, contentLevelTitle]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLevelMenuOpen) {
        setIsLevelMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isLevelMenuOpen]);

  const visibleLevelItems = useMemo(() => {
    if (!menuSearchQuery.trim()) return contentLevelItems;
    const q = menuSearchQuery.toLowerCase();
    return contentLevelItems.filter(item =>
      (item.codigo || item.id || '').toLowerCase().includes(q) ||
      (item.gestion || item.tramite || '').toLowerCase().includes(q) ||
      (item.descripcion || '').toLowerCase().includes(q)
    );
  }, [contentLevelItems, menuSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleDismiss = (event: MouseEvent | KeyboardEvent) => {
      if (!dropdownRef.current) return;
      const target = event.target as Node;
      if (event.type === 'keydown' && (event as KeyboardEvent).key === 'Escape') {
        setShowFormacionMenu(false);
        return;
      }
      if (!dropdownRef.current.contains(target)) {
        setShowFormacionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleDismiss);
    document.addEventListener('keydown', handleDismiss);
    return () => {
      document.removeEventListener('mousedown', handleDismiss);
      document.removeEventListener('keydown', handleDismiss);
    };
  }, []);

  const filteredTramites = searchQuery.trim().length > 1
    ? allTramites.filter(t =>
        (t.id && t.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((t.gestion || t.tramite) && (t.gestion || t.tramite)!.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.categoria && t.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const filteredProcesos = searchQuery.trim().length > 1
    ? allProcesos.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.paraQuien && p.paraQuien.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : [];

  const hasResults = filteredTramites.length > 0 || filteredProcesos.length > 0;
  const showSuggestions = isSearchFocused && searchQuery.trim().length > 1;

  return (
    <header className="sticky top-0 z-40 bg-sat-blanco border-b border-sat-gris shadow-sat-sm">
      {/* 1. Barra de Navegación 1: Plataformas Oficiales SAT (Azul Oscuro Normativo - Esbelta y Compacta) */}
      <nav
        className="bg-sat-azul-oscuro text-sat-blanco text-xs font-medium h-8 relative z-50"
        aria-label="Plataformas oficiales"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <button
            type="button"
            className="p-1 text-sat-blanco lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-celeste"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-controls="sat-navbar-main"
            aria-expanded={isNavOpen}
            aria-label="Alternar navegación"
          >
            <MenuIcon className="w-4 h-4" />
          </button>

          <div
            id="sat-navbar-main"
            className={`${isNavOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:flex-1 h-full items-stretch lg:items-center justify-between gap-2 lg:gap-0 bg-sat-azul-oscuro lg:bg-transparent absolute lg:static top-full left-0 p-3 lg:p-0 shadow-lg lg:shadow-none`}
          >
            {/* Lado izquierdo: Formación Tributaria + Accesos complementarios */}
            <div className="flex items-center h-full gap-1">
              <div className="dropdown relative h-full flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowFormacionMenu(!showFormacionMenu)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-full text-sat-blanco rounded-sat-sm hover:bg-white/10 focus:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-celeste transition-colors text-xs font-semibold"
                  aria-expanded={showFormacionMenu}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sat-celeste" />
                  <span>Formación Tributaria</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFormacionMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Formación Tributaria */}
                {showFormacionMenu && (
                  <div className="dropdown-menu show absolute left-0 top-full mt-1 w-72 max-w-[calc(100vw-2rem)] bg-sat-blanco text-sat-texto border border-sat-gris rounded-sat-lg shadow-sat-lg p-2 z-50 animate-fadeIn">
                    <h6 className="dropdown-header px-3 py-1.5 mb-1 text-[11px] uppercase tracking-wider font-bold text-sat-texto-suave border-b border-sat-gris">
                      Cultura y Aprendizaje Fiscal
                    </h6>
                    {FORMACION_ITEMS.map((item) => (
                      <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dropdown-item flex items-start gap-3 px-3 py-2 rounded-sat-sm text-sat-texto hover:bg-sat-fondo-tenue hover:text-sat-azul focus:bg-sat-fondo-tenue focus:text-sat-azul transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-sat-azul mt-0.5 shrink-0" />
                        <span className="block">
                          <span className="flex items-center gap-1 text-xs font-semibold">
                            {item.title}
                            <ExternalLink className="w-3 h-3 opacity-40" />
                          </span>
                          <span className="block text-[11px] text-sat-texto-suave leading-tight">
                            {item.desc}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {onGoStyleGuide && (
                <button
                  type="button"
                  onClick={onGoStyleGuide}
                  className="inline-flex items-center gap-1 px-2 h-full text-sat-blanco/75 hover:text-sat-blanco hover:bg-white/10 rounded-sat-sm text-[11px] transition-colors"
                  title="Ver Guía de Estilo y Tokens del Design System"
                >
                  <Palette className="w-3 h-3 text-sat-celeste" />
                  <span className="hidden xl:inline">Design System</span>
                </button>
              )}

              <a
                href="#/mapa"
                className="inline-flex items-center gap-1 px-2 h-full text-sat-blanco/75 hover:text-sat-blanco hover:bg-white/10 rounded-sat-sm text-[11px] transition-colors"
                title="Ver Mapa Jerárquico Oficial del Portal en Página Completa"
              >
                <Layers className="w-3 h-3 text-sat-celeste" />
                <span className="hidden xl:inline">Mapa del Portal</span>
              </a>
            </div>

            {/* Lado derecho: Pestañas contiguas idénticas al diseño oficial del PDF */}
            <div className="flex items-center h-full">
              <a
                href="https://declaraguate.sat.gob.gt/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2.5 sm:px-3 h-full text-sat-blanco hover:bg-white/10 text-xs font-semibold transition-colors"
              >
                <span>Declaraguate</span>
              </a>

              {/* Declaración de viajero con Naranja Normativo */}
              <a
                href="https://portal.sat.gob.gt/portal/declaracion-jurada-regional-de-viajero/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 h-full bg-sat-comp-naranja text-sat-azul-oscuro font-bold hover:bg-[#d96316] text-xs transition-colors"
              >
                <Plane className="w-3 h-3" />
                <span>Declaración de Viajero</span>
              </a>

              {/* Acceso a Agencia Virtual en Celeste Normativo */}
              <a
                href="https://farm3.sat.gob.gt/menu/login.jsf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 sm:px-3.5 h-full bg-sat-celeste text-sat-azul-oscuro font-bold hover:bg-[#12a0ce] text-xs transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Agencia Virtual</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Barra Principal: Isologotipo Oficial + Buscador Inteligente + Accesibilidad (Esbelta y Proporcionada) */}
      <nav className="bg-sat-blanco py-1 sm:py-1.5 border-b border-sat-gris" aria-label="Buscador y accesibilidad">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
          {/* Isologotipo Oficial SAT escalado a altura compacta */}
          <button
            type="button"
            onClick={onGoHome}
            className="p-0.5 shrink-0 border-0 shadow-none group rounded-sat-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
            aria-label="Ir al inicio del Portal SAT"
          >
            <SatIsologotipo
              className="h-8 w-auto"
              variant="azul"
              showSubtitle={true}
            />
          </button>

          {/* Buscador Central Predictivo distribuido armónicamente */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl lg:max-w-2xl relative min-w-0">
            <div className="relative flex items-center">
              <span className="absolute left-3 pointer-events-none flex items-center">
                <Search className="w-3.5 h-3.5 text-sat-azul" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Buscar gestiones por nombre, NIT, RTU, FEL o código SAT-GES..."
                aria-label="Buscar gestiones en el Portal SAT"
                className="w-full pl-8 sm:pl-9 pr-7 py-1 text-xs sm:text-sm font-medium text-sat-azul-oscuro bg-sat-fondo-tenue/80 hover:bg-sat-fondo-medio focus:bg-white border border-sat-gris focus:border-sat-azul focus:ring-2 focus:ring-sat-azul/20 rounded-sat-md focus:outline-none transition-all h-8.5 shadow-inner"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="sat-search-suggestions"
                aria-autocomplete="list"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 p-1 text-sat-texto-suave hover:text-sat-azul-oscuro hover:bg-sat-fondo-medio rounded-full transition-colors"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown de Sugerencias con cuadrícula de 4 columnas en desktop */}
            {showSuggestions && hasResults && (
              <div
                id="sat-search-suggestions"
                role="listbox"
                aria-label="Resultados de búsqueda"
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[620px] md:w-[740px] lg:w-[960px] max-w-[96vw] p-3 sm:p-4 bg-sat-blanco rounded-sat-lg shadow-sat-lg border border-sat-gris overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
              >
                {filteredTramites.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-sat-gris">
                      <h6 className="text-[11px] uppercase tracking-wider font-bold text-sat-azul">
                        Gestiones y Servicios Encontrados ({filteredTramites.length})
                      </h6>
                      <span className="text-[11px] text-sat-texto-suave hidden sm:inline">
                        Presiona para consultar requisitos y paso a paso
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {filteredTramites.map((t) => (
                        <button
                          type="button"
                          key={t.id}
                          role="option"
                          aria-selected="false"
                          onClick={() => {
                            onSelectTramite(t);
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-start p-2.5 rounded-sat-md border border-sat-gris hover:border-sat-azul hover:bg-sat-fondo-tenue focus:bg-sat-fondo-tenue focus:border-sat-azul focus:outline-none transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[11px] font-semibold text-sat-azul truncate">
                                {t.pillarName || t.categoria}
                              </span>
                            </div>
                            <span className="block text-xs font-bold text-sat-texto group-hover:text-sat-azul line-clamp-2 leading-snug">
                              {t.gestion || t.tramite}
                            </span>
                            <span className="block text-[11px] text-sat-texto-suave line-clamp-2 mt-1 leading-relaxed">
                              {t.descripcion}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-sat-azul flex items-center gap-1 mt-2 pt-1 border-t border-sat-gris/50">
                            Ver gestión →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredProcesos.length > 0 && (
                  <div className="pt-2 border-t border-sat-gris bg-sat-fondo-tenue -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 p-3 sm:p-3.5">
                    <h6 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-sat-azul mb-2">
                      <Compass className="w-3.5 h-3.5 text-sat-azul" /> Rutas de Procesos Guiados ({filteredProcesos.length})
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredProcesos.map((p) => (
                        <button
                          type="button"
                          key={p.no}
                          role="option"
                          aria-selected="false"
                          onClick={() => {
                            onSelectProceso(p);
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-start p-2 rounded-sat-sm bg-white border border-sat-gris hover:border-sat-azul text-sat-texto transition-colors flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="block text-xs font-bold text-sat-texto">{p.nombre}</span>
                            <span className="block text-[11px] text-sat-texto-suave line-clamp-1">{p.paraQuien}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-sat-azul shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showSuggestions && !hasResults && (
              <div className="dropdown-menu show absolute left-0 right-0 top-full mt-1.5 p-0 bg-sat-blanco rounded-sat-lg shadow-sat-lg border border-sat-gris z-50">
                <div className="px-3 py-3 text-xs text-sat-texto-suave text-center">
                  Sin resultados para <span className="font-bold text-sat-texto">"{searchQuery}"</span>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Accesibilidad UserWay (Bloque ícono azul normativo como en el PDF oficial) */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="w-8 h-8 rounded-sat-sm bg-sat-celeste text-sat-blanco hover:bg-sky-500 transition-colors flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
              title="Herramientas de Accesibilidad (UserWay)"
              aria-label="Abrir panel de accesibilidad"
            >
              <span className="text-sm font-bold leading-none select-none">♿</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Barra de Navegación Principal: Estructura en Z con Menú a la Izquierda y Macrogrupos al Centro */}
      <nav
        className="bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative z-40 transition-colors"
        aria-label="Menú de Navegación y Segmentos Oficiales"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[42px] gap-2">
          
          {/* LADO IZQUIERDO: Botón Menú Hamburguesa + Botón Inicio */}
          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <button
              type="button"
              onClick={() => setIsLevelMenuOpen(!isLevelMenuOpen)}
              className={`inline-flex items-center gap-2 h-7.5 px-3 rounded-full text-xs transition-colors cursor-pointer ${
                isLevelMenuOpen
                  ? 'bg-slate-900 text-white font-semibold shadow-xs ring-2 ring-slate-900/10'
                  : isContentLevel
                    ? 'bg-sky-50 text-sky-950 border border-sky-400 hover:bg-sky-100 font-bold shadow-2xs ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:text-slate-950 font-semibold'
              }`}
              aria-expanded={isLevelMenuOpen}
              aria-controls="sat-level-menu-panel"
              title={isLevelMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {/* Icono de hamburguesa animado con morph suave a X */}
              <div className="w-3.5 h-3 relative flex flex-col justify-between items-center shrink-0" aria-hidden="true">
                <span
                  className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-transform duration-200 ease-out ${
                    isLevelMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-opacity duration-150 ease-out ${
                    isLevelMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-transform duration-200 ease-out ${
                    isLevelMenuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''
                  }`}
                />
              </div>

              <span>Menú</span>
            </button>

            <span className="h-3.5 w-px bg-slate-200 mx-0.5 shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                if (onSelectBreadcrumb) {
                  onSelectBreadcrumb('home');
                } else {
                  onGoHome();
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors shrink-0 ${
                currentView === 'home'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-semibold'
              }`}
              title="Ir al Inicio del Portal"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inicio</span>
            </button>
          </div>

          {/* CENTRO: Los 4 Macrogrupos siempre presentes y perfectamente alineados en medio */}
          <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {MACROGROUPS.map((macro) => {
              const isActive = (currentView === 'catalog' || currentView === 'gestion') && activeSegment === macro.id;
              return (
                <button
                  key={macro.id}
                  type="button"
                  onClick={() => {
                    if (onSelectSegment) {
                      onSelectSegment(macro.id);
                    }
                  }}
                  className={`group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${
                      isActive ? 'scale-125 ring-2 ring-white/60' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
                    }`}
                    style={{ backgroundColor: macro.color }}
                  />
                  <span>{macro.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* LADO DERECHO: Espaciador balanceador para centrado simétrico de los macrogrupos */}
          <div className="hidden sm:block w-[130px] shrink-0" aria-hidden="true" />

        </div>

        {/* Panel Desplegable Flotante en el Eje Z (Absolute: nunca empuja el contenido) */}
        {isLevelMenuOpen && (
          <>
            {/* Backdrop con desenfoque suave para cerrar al tocar fuera */}
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity duration-200"
              onClick={() => setIsLevelMenuOpen(false)}
              aria-hidden="true"
            />

            <div
              id="sat-level-menu-panel"
              className="absolute left-4 sm:left-6 lg:left-8 top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[580px] max-w-2xl p-4 sm:p-5 animate-fadeIn max-h-[75vh] overflow-y-auto"
            >
              {/* Cabecera Minimalista: Solo el Título y Botón Cerrar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  {contentLevelTitle || 'Menú de Navegación'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLevelMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full text-xs transition-colors cursor-pointer"
                  title="Cerrar menú (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Si estamos en Nivel de Contenido: Solo Líneas de Texto */}
              {isContentLevel && visibleLevelItems.length > 0 ? (
                <>
                  <ul className="divide-y divide-slate-100">
                    {visibleLevelItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTramite(item);
                            setIsLevelMenuOpen(false);
                          }}
                          className="w-full text-left py-2 px-2.5 rounded-md text-xs sm:text-sm text-slate-700 hover:text-sky-700 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span className="font-medium group-hover:translate-x-1 transition-transform">
                            {item.gestion || item.tramite}
                          </span>
                          <span className="text-slate-300 group-hover:text-sky-500 text-xs transition-all shrink-0 ml-2">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {contentLevelItems.length > 5 && (
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <input
                        type="text"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                        placeholder="Filtrar por texto..."
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 font-normal text-slate-800"
                      />
                    </div>
                  )}
                </>
              ) : isContentLevel && visibleLevelItems.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No se encontraron coincidencias para "{menuSearchQuery}".
                </div>
              ) : (
                /* Vista General cuando NO estamos en nivel de contenido: Líneas de texto por Macrogrupo */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-1">
                  {MACROGROUPS.map((macro) => {
                    const subCats = OFFICIAL_CATEGORY_ORDER[macro.id] || [];
                    return (
                      <div key={macro.id} className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 pb-1 border-b border-slate-100">
                          {macro.name}
                        </h4>
                        <ul className="divide-y divide-slate-50">
                          {subCats.map((catName) => (
                            <li key={catName}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onSelectSegment) {
                                    onSelectSegment(macro.id, catName);
                                  }
                                  setIsLevelMenuOpen(false);
                                }}
                                className="w-full text-left py-1 text-xs text-slate-600 hover:text-sky-700 hover:underline transition-colors cursor-pointer"
                              >
                                {catName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};