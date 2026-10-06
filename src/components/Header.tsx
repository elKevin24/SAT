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
  Palette
} from 'lucide-react';
import { SatIsologotipo } from './SatIsologotipo';

interface HeaderProps {
  onGoHome: () => void;
  onGoStyleGuide?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTramite: (tramite: any) => void;
  onSelectProceso: (proceso: any) => void;
  onOpenAccessibility: () => void;
  allTramites: any[];
  allProcesos: any[];
}

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DCDCDC] shadow-xs">
      {/* 1. Barra de Navegación 1: Plataformas Oficiales SAT (Azul Oscuro Normativo #19324B) */}
      <div className="bg-[#19324B] text-white text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          
          {/* Menú de Formación Tributaria */}
          <div className="relative">
            <button
              onClick={() => setShowFormacionMenu(!showFormacionMenu)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded hover:bg-white/10 transition-colors text-slate-100 hover:text-white"
              aria-expanded={showFormacionMenu}
            >
              <GraduationCap className="w-4 h-4 text-[#19AFE1]" />
              <span>Formación Tributaria</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFormacionMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Formación Tributaria */}
            {showFormacionMenu && (
              <div 
                className="absolute left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-[#DCDCDC] py-2 text-slate-800 z-50 animate-fadeIn"
                onMouseLeave={() => setShowFormacionMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Cultura y Aprendizaje Fiscal
                </div>
                {[
                  { title: 'Capacitaciones y Talleres', desc: 'Cursos virtuales y presenciales', icon: GraduationCap, url: 'https://portal.sat.gob.gt/portal/capacitaciones/' },
                  { title: 'Cultura Tributaria', desc: 'Educación cívico tributaria', icon: BookOpen, url: 'https://portal.sat.gob.gt/portal/cultura-tributaria/' },
                  { title: 'Biblioteca Virtual', desc: 'Leyes, reglamentos y manuales', icon: Layers, url: 'https://portal.sat.gob.gt/portal/biblioteca-virtual/' },
                  { title: 'Proyección Educativa y NAF', desc: 'Núcleos de apoyo contable y fiscal', icon: UserCheck, url: 'https://portal.sat.gob.gt/portal/naf/' },
                  { title: 'Videos y Recursos Educativos', desc: 'Tutoriales y material didáctico', icon: Video, url: 'https://portal.sat.gob.gt/portal/videos-tutoriales/' }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-3.5 py-2 hover:bg-slate-50 transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-[#14649B] mt-0.5 shrink-0 group-hover:text-[#19AFE1]" />
                    <div>
                      <div className="font-semibold text-xs text-slate-800 group-hover:text-[#14649B] flex items-center gap-1">
                        {item.title}
                        <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">{item.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Enlaces Rápidos a Plataformas Externas y Guía de Estilo */}
          <div className="flex items-center gap-1 sm:gap-2">
            {onGoStyleGuide && (
              <button
                onClick={onGoStyleGuide}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded text-slate-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
                title="Ver Guía de Estilo y Tokens del Design System"
              >
                <Palette className="w-3.5 h-3.5 text-[#19AFE1]" />
                <span>Design System</span>
              </button>
            )}

            <a
              href="https://declaraguate.sat.gob.gt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#19AFE1]" />
              <span className="hidden sm:inline">Declaraguate</span>
            </a>

            {/* Declaración de viajero con Naranja Normativo #F37521 y texto oscuro para accesibilidad WCAG */}
            <a
              href="https://portal.sat.gob.gt/portal/declaracion-jurada-regional-de-viajero/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F37521] hover:bg-[#d96316] text-[#19324B] font-bold transition-colors"
            >
              <Plane className="w-3.5 h-3.5 text-[#19324B]" />
              <span>Declaración de Viajero</span>
            </a>

            {/* Acceso a Agencia Virtual en Azul SAT Normativo #14649B */}
            <a
              href="https://farm3.sat.gob.gt/menu/login.jsf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#14649B] hover:bg-[#0f4e7a] text-white font-bold transition-all shadow-xs active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accede a tu Agencia Virtual</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal: Isologotipo Oficial + Buscador Inteligente + Accesibilidad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Isologotipo Oficial SAT como bloque indivisible normativo */}
          <button
            onClick={onGoHome}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14649B] rounded-lg p-1 group shrink-0"
            aria-label="Ir al inicio del Portal SAT"
          >
            <SatIsologotipo className="h-9 sm:h-10 w-auto" variant="azul" showSubtitle={true} />
          </button>

          {/* Buscador Central Predictivo */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Buscar trámites, NIT, RTU Digital, facturas FEL, impuestos o leyes..."
                className="w-full pl-10 pr-10 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-[#DCDCDC] focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown de Sugerencias */}
            {isSearchFocused && searchQuery.trim().length > 1 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#DCDCDC] overflow-hidden z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {filteredTramites.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#14649B] uppercase tracking-wider">
                      Trámites y Servicios Encontrados ({filteredTramites.length})
                    </div>
                    {filteredTramites.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTramite(t);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50/60 rounded-xl transition-colors flex items-start justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#14649B]">
                            {t.tramite}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {t.descripcion}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredProcesos.length > 0 && (
                  <div className="p-2 bg-slate-50/50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#14649B] uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Guías Paso a Paso
                    </div>
                    {filteredProcesos.map((p) => (
                      <button
                        key={p.no}
                        onClick={() => {
                          onSelectProceso(p);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#14649B]">
                            {p.nombre}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.paraQuien}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#14649B] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón de Accesibilidad UserWay */}
          <div className="shrink-0">
            <button
              onClick={onOpenAccessibility}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DCDCDC] bg-slate-50 hover:bg-blue-50/80 hover:border-[#14649B] text-slate-700 hover:text-[#14649B] transition-all text-xs font-semibold shadow-2xs"
              title="Herramientas de Accesibilidad (UserWay)"
              aria-label="Abrir panel de accesibilidad"
            >
              <span className="w-5 h-5 rounded-full bg-[#14649B] text-white flex items-center justify-center text-[10px] font-bold">
                ♿
              </span>
              <span className="hidden lg:inline">Accesibilidad</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
