import React, { useState, useRef, useEffect } from 'react';
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
  Menu as MenuIcon
} from 'lucide-react';
import { SatIsologotipo } from './SatIsologotipo';
import type { TramiteItem, ProcesoGuiado } from '../data/schema';

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
}

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
  allProcesos
}) => {
  const [showFormacionMenu, setShowFormacionMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        (t.tramite && t.tramite.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
                              <span className="font-mono text-[10px] font-bold text-sat-azul bg-sat-azul/10 px-1.5 py-0.2 rounded-sm">
                                {t.id}
                              </span>
                              <span className="text-[10px] text-sat-texto-suave truncate">
                                {t.pillarName || t.categoria}
                              </span>
                            </div>
                            <span className="block text-xs font-bold text-sat-texto group-hover:text-sat-azul line-clamp-2 leading-snug">
                              {t.tramite}
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
    </header>
  );
};