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
        (t.tramite && t.tramite.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.categoria && t.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
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
      {/* 1. Barra de Navegación 1: Plataformas Oficiales SAT (Azul Oscuro Normativo) */}
      <nav
        className="navbar navbar-expand-lg bg-sat-azul-oscuro text-sat-blanco text-xs font-medium py-1.5"
        aria-label="Plataformas oficiales"
      >
        <div className="container-fluid flex items-center px-3 sm:px-4 lg:px-6">
          <button
            type="button"
            className="navbar-toggler border-0 shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-celeste p-1 text-sat-blanco me-2 lg:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-controls="sat-navbar-main"
            aria-expanded={isNavOpen}
            aria-label="Alternar navegación"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div
            id="sat-navbar-main"
            className={`${isNavOpen ? 'block' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:flex-1 items-stretch lg:items-center lg:gap-3`}
          >
            {/* Menú de Formación Tributaria */}
            <div className="dropdown relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowFormacionMenu(!showFormacionMenu)}
                className="btn btn-sm dropdown-toggle inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sat-blanco border-0 shadow-none hover:bg-white/15 focus:bg-white/15 focus:shadow-none active:bg-white/20"
                aria-expanded={showFormacionMenu}
              >
                <GraduationCap className="w-4 h-4 text-sat-celeste" />
                <span>Formación Tributaria</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFormacionMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Formación Tributaria */}
              {showFormacionMenu && (
                <div className="dropdown-menu show absolute left-0 mt-1 w-72 max-w-[calc(100vw-2rem)] bg-sat-blanco text-sat-texto border border-sat-gris rounded-sat-lg shadow-sat-lg p-2 z-50 animate-fadeIn">
                  <h6 className="dropdown-header px-3 py-1.5 mb-1 text-[11px] uppercase tracking-wider font-bold text-sat-texto-tenue border-b border-sat-gris">
                    Cultura y Aprendizaje Fiscal
                  </h6>
                  {FORMACION_ITEMS.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dropdown-item flex align-items-start gap-3 px-3 py-2 rounded-sat-sm text-sat-texto hover:bg-sat-fondo-tenue hover:text-sat-azul focus:bg-sat-fondo-tenue focus:text-sat-azul transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-sat-azul mt-0.5 shrink-0" />
                      <span className="block">
                        <span className="flex align-items-center gap-1 text-xs font-semibold">
                          {item.title}
                          <ExternalLink className="w-3 h-3 opacity-40" />
                        </span>
                        <span className="block text-[11px] text-sat-texto-tenue leading-tight">
                          {item.desc}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Enlaces Rápidos a Plataformas Externas y Guía de Estilo */}
            <div className="btn-group flex flex-wrap items-center gap-y-1">
              {onGoStyleGuide && (
                <button
                  type="button"
                  onClick={onGoStyleGuide}
                  className="btn btn-sm inline-flex items-center gap-1 px-2.5 py-1.5 border-0 shadow-none text-sat-blanco hover:bg-white/15 hover:text-sat-blanco focus:bg-white/15 active:bg-white/20"
                  title="Ver Guía de Estilo y Tokens del Design System"
                >
                  <Palette className="w-3.5 h-3.5 me-1 text-sat-celeste" />
                  <span>Design System</span>
                </button>
              )}

              <a
                href="#/mapa"
                className="btn btn-sm inline-flex items-center gap-1 px-2.5 py-1.5 border-0 shadow-none text-sat-blanco hover:bg-white/15 hover:text-sat-blanco focus:bg-white/15 active:bg-white/20"
                title="Ver Mapa Jerárquico Oficial del Portal en Página Completa"
              >
                <Layers className="w-3.5 h-3.5 me-1 text-sat-celeste" />
                <span>Mapa del Portal</span>
              </a>

              <a
                href="https://declaraguate.sat.gob.gt/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm inline-flex items-center px-2.5 py-1.5 border-0 shadow-none text-sat-blanco hover:bg-white/15 hover:text-sat-blanco active:bg-white/20"
              >
                <FileText className="w-3.5 h-3.5 me-1 text-sat-celeste" />
                <span>Declaraguate</span>
              </a>

              {/* Declaración de viajero con Naranja Normativo y texto oscuro para accesibilidad WCAG */}
              <a
                href="https://portal.sat.gob.gt/portal/declaracion-jurada-regional-de-viajero/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm inline-flex items-center px-2.5 py-1.5 border-0 shadow-none bg-sat-comp-naranja text-sat-azul-oscuro fw-bold hover:bg-[#d96316] hover:text-sat-azul-oscuro active:bg-[#c25712]"
              >
                <Plane className="w-3.5 h-3.5 me-1" />
                <span>Declaración de Viajero</span>
              </a>

              {/* Acceso a Agencia Virtual en Azul SAT Normativo */}
              <a
                href="https://farm3.sat.gob.gt/menu/login.jsf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm inline-flex items-center px-3 py-1.5 border-0 shadow-sm bg-sat-azul text-sat-blanco fw-bold hover:bg-[#0f4e7a] hover:text-sat-blanco active:bg-[#0b3f63]"
              >
                <Lock className="w-3.5 h-3.5 me-1" />
                <span>Accede a tu Agencia Virtual</span>
                <ExternalLink className="w-3 h-3 ms-1 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Barra Principal: Isologotipo Oficial + Buscador Inteligente + Accesibilidad */}
      <nav className="navbar py-2" aria-label="Buscador y accesibilidad">
        <div className="container-fluid flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 flex-wrap md:flex-nowrap">
            {/* Isologotipo Oficial SAT como bloque indivisible normativo */}
            <button
              type="button"
              onClick={onGoHome}
              className="btn p-1 shrink-0 border-0 shadow-none group rounded-sat-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
              aria-label="Ir al inicio del Portal SAT"
            >
              <SatIsologotipo
                className="max-w-[148px] sm:max-w-[210px] lg:max-w-none w-auto"
                variant="azul"
                showSubtitle={true}
              />
            </button>

            {/* Buscador Central Predictivo */}
            <div ref={searchContainerRef} className="input-group input-group-sm flex order-2 md:order-none w-full md:w-auto md:flex-1 min-w-0 max-w-2xl relative">
              <span className="input-group-text flex items-center bg-sat-fondo-tenue border border-sat-gris border-e-0 text-sat-texto-tenue pe-2">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Buscar trámites, NIT, RTU Digital, facturas FEL, impuestos o leyes..."
                aria-label="Buscar trámites en el Portal SAT"
                className="form-control flex-1 min-w-0 border border-sat-gris border-s-0 ps-2 pe-8 py-2 text-xs sm:text-sm text-sat-texto bg-sat-fondo-tenue hover:bg-sat-fondo-medio focus:bg-sat-blanco focus:shadow-[0_0_0_0.25rem_rgba(20,100,155,0.2)] transition-colors"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="sat-search-suggestions"
                aria-autocomplete="list"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-1 px-2 border-0 shadow-none text-sat-texto-tenue hover:bg-sat-fondo-medio rounded-circle"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Dropdown de Sugerencias */}
              {showSuggestions && hasResults && (
                <div
                  id="sat-search-suggestions"
                  role="listbox"
                  className="dropdown-menu show absolute left-0 right-0 top-full mt-2 p-0 bg-sat-blanco rounded-sat-lg shadow-sat-lg border border-sat-gris overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  {filteredTramites.length > 0 && (
                    <div className="p-2">
                      <h6 className="dropdown-header px-3 py-1.5 text-[11px] uppercase tracking-wider fw-bold text-sat-azul">
                        Trámites y Servicios Encontrados ({filteredTramites.length})
                      </h6>
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
                          className="dropdown-item w-full text-start px-3 py-2 rounded-sat-sm text-sat-texto hover:bg-sat-fondo-tenue hover:text-sat-azul focus:bg-sat-fondo-tenue focus:text-sat-azul transition-colors"
                        >
                          <span className="block text-xs fw-bold">{t.tramite}</span>
                          <span className="block text-[11px] text-sat-texto-tenue line-clamp-1">
                            {t.descripcion}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredProcesos.length > 0 && (
                    <>
                      <hr className="dropdown-divider m-0 border-sat-gris" />
                      <div className="p-2 bg-sat-fondo-tenue">
                        <h6 className="dropdown-header px-3 py-1.5 flex align-items-center gap-1 text-[11px] uppercase tracking-wider fw-bold text-sat-azul">
                          <Compass className="w-3.5 h-3.5" /> Guías Paso a Paso
                        </h6>
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
                            className="dropdown-item w-full text-start px-3 py-2 rounded-sat-sm text-sat-texto hover:bg-sat-fondo-tenue hover:text-sat-azul focus:bg-sat-fondo-tenue focus:text-sat-azul transition-colors"
                          >
                            <span className="flex align-items-center justify-between gap-2">
                              <span>
                                <span className="block text-xs fw-bold">{p.nombre}</span>
                                <span className="block text-[11px] text-sat-texto-tenue">{p.paraQuien}</span>
                              </span>
                              <ArrowRight className="w-4 h-4 text-sat-texto-tenue shrink-0" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {showSuggestions && !hasResults && (
                <div className="dropdown-menu show absolute left-0 right-0 top-full mt-2 p-0 bg-sat-blanco rounded-sat-lg shadow-sat-lg border border-sat-gris z-50">
                  <div className="px-3 py-3 text-xs text-sat-texto-tenue text-center">
                    Sin resultados para <span className="fw-bold text-sat-texto">"{searchQuery}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de Accesibilidad UserWay */}
            <div className="order-3 md:order-none ml-auto shrink-0">
              <button
                type="button"
                onClick={onOpenAccessibility}
                className="btn btn-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-sat-gris bg-sat-fondo-tenue text-sat-texto-suave hover:bg-sat-fondo-medio hover:text-sat-azul hover:border-sat-azul transition-colors fw-semibold"
                title="Herramientas de Accesibilidad (UserWay)"
                aria-label="Abrir panel de accesibilidad"
              >
                <span className="w-5 h-5 rounded-full bg-sat-azul text-sat-blanco flex align-items-center justify-center text-[10px] fw-bold">
                  ♿
                </span>
                <span className="hidden lg:inline">Accesibilidad</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};