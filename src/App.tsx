import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Check, Copy, Printer, ExternalLink, Search } from 'lucide-react';
import { 
  PillarType, 
  TramiteItem, 
  PILLARS_CONFIG, 
  GRUPOS_CONFIG, 
  TRAMITES_DATA 
} from './data/taxArchitecture';

export default function App() {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('contribuyentes');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('NIT sin Obligaciones');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('RTU Digital');
  
  // Trámite seleccionado (null en nivel 1-3 o cuando se muestran tarjetas de trámites)
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);

  // Active section for highlight
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Interactive requirement checklist state
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  // Copy notification state
  const [copiedLink, setCopiedLink] = useState(false);

  // Sidebar visibility: false por defecto para que las tarjetas inicien perfectamente centradas
  const [menuSidebarOpen, setMenuSidebarOpen] = useState<boolean>(false);

  // Helper to close drawer when navigating on mobile
  const closeMenuIfMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMenuSidebarOpen(false);
    }
  };

  // Scroll detection to compact spacing when scrolling down
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search query & results
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Consulta interactiva de gestión (con-nit-4)
  const [consultaGestionInput, setConsultaGestionInput] = useState('');
  const [consultaGestionResult, setConsultaGestionResult] = useState<{
    numero: string;
    estado: 'En trámite' | 'Aprobada' | 'Observada';
    mensaje: string;
  } | null>(null);

  // Consulta interactiva de títulos QR (con-nit-8)
  const [consultaTituloInput, setConsultaTituloInput] = useState('');
  const [consultaTituloResult, setConsultaTituloResult] = useState<{
    numero: string;
    profesional: string;
    titulo: string;
    grado: string;
    estado: string;
    timbres: string;
  } | null>(null);

  const handleConsultarTitulo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = consultaTituloInput.trim();
    if (!clean) return;

    setConsultaTituloResult({
      numero: clean.toUpperCase(),
      profesional: 'Profesional Colegiado Activo',
      titulo: 'Licenciatura Universitaria / Grado Académico Superior',
      grado: 'Nivel Licenciatura (100% acreditado)',
      estado: 'Habilitado y Registrado Oficialmente ante SAT',
      timbres: 'Impuesto de Timbres Fiscales cancelado conforme al Art. 5 num. 3 Dto. 37-92'
    });
  };

  const handleConsultarGestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = consultaGestionInput.trim();
    if (!clean) return;
    
    if (clean.toLowerCase().includes('aprob') || clean.endsWith('1') || clean.endsWith('5')) {
      setConsultaGestionResult({
        numero: clean,
        estado: 'Aprobada',
        mensaje: 'La solicitud de Agencia Virtual fue aprobada con éxito. Revisa tu correo electrónico para crear tu contraseña de acceso inicial.'
      });
    } else if (clean.toLowerCase().includes('rechaz') || clean.toLowerCase().includes('obs') || clean.endsWith('2')) {
      setConsultaGestionResult({
        numero: clean,
        estado: 'Observada',
        mensaje: 'La selfie o el documento adjunto no son legibles. Debes subsanar adjuntando nuevamente el DPI o pasaporte vigente.'
      });
    } else {
      setConsultaGestionResult({
        numero: clean,
        estado: 'En trámite',
        mensaje: 'Tu solicitud de acceso se encuentra en proceso de validación documental por parte de la SAT. Tiempo promedio de respuesta: 24 horas hábiles.'
      });
    }
  };

  // Configuraciones derivadas
  const currentPillarConfig = PILLARS_CONFIG.find(p => p.id === selectedPillar) || PILLARS_CONFIG[0];
  const gruposInPillar = GRUPOS_CONFIG.filter(g => g.pillar === selectedPillar);
  const currentGrupo = gruposInPillar.find(g => g.nombre === selectedCategoria) || gruposInPillar[0];
  const subgruposInGrupo = currentGrupo?.subgrupos || [];
  const currentSubcategoriaItems = TRAMITES_DATA.filter(
    i => i.pillar === selectedPillar && i.categoria === selectedCategoria && i.subcategoria === selectedSubcategoria
  );

  // Resultados de búsqueda en vivo
  const searchResults = searchQuery.trim().length > 1
    ? TRAMITES_DATA.filter(t => 
        t.tramite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.formulario && t.formulario.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.subcategoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.categoria.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleGoHome = () => {
    setLevel(1);
    setSelectedTramite(null);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPillar = (pillarId: PillarType) => {
    setSelectedPillar(pillarId);
    const grupos = GRUPOS_CONFIG.filter(g => g.pillar === pillarId);
    const firstGrupo = grupos[0]?.nombre || '';
    setSelectedCategoria(firstGrupo);
    const firstSub = grupos[0]?.subgrupos[0]?.nombre || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(2);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const grupo = GRUPOS_CONFIG.find(g => g.pillar === selectedPillar && g.nombre === cat);
    const firstSub = grupo?.subgrupos[0]?.nombre || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(3);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubcategoria = (sub: string) => {
    setSelectedSubcategoria(sub);
    const trms = TRAMITES_DATA.filter(
      i => i.pillar === selectedPillar && i.categoria === selectedCategoria && i.subcategoria === sub
    );
    const item = trms.length === 1 ? trms[0] : null;
    setSelectedTramite(item);
    setLevel(4);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selección inmediata de trámite
  const handleSelectMenuGestion = (item: TramiteItem) => {
    setSelectedTramite(item);
    setActiveSectionId('');
    setLevel(4);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll suave hacia sección de la ficha con compensación del header fijo
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isScrolled ? 80 : 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Alternar checkbox de requisitos
  const handleToggleRequirement = (key: string) => {
    setCheckedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copiar URL de trámite
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Seleccionar resultado de búsqueda
  const handleSelectSearchResult = (item: TramiteItem) => {
    setSelectedPillar(item.pillar);
    setSelectedCategoria(item.categoria);
    setSelectedSubcategoria(item.subcategoria);
    setSelectedTramite(item);
    setLevel(4);
    setSearchQuery('');
    setIsSearchFocused(false);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#19324B] font-sans antialiased flex flex-col selection:bg-[#14649B] selection:text-white">
      
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.2 AA) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#14649B] focus:text-white focus:rounded-lg focus:shadow-xl focus:text-xs focus:font-bold focus:outline-hidden"
      >
        Saltar al contenido principal
      </a>

      {/* SAT Institutional Gradient Stripe (Manual SAT Design System Web v1.0) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#19324B] via-[#14649B] to-[#19AFE1]" />

      {/* HEADER INTEGRAL: Totalmente responsive con safe-area y micro-compactación al scroll */}
      <header className={`sticky top-0 z-40 bg-white border-b border-[#DCDCDC] shadow-xs transition-all duration-300 ${
        isScrolled ? 'py-1' : 'py-2 sm:py-2.5'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
          
          {/* Fila 1: Marca Institucional adaptativa e Input de Búsqueda fluido */}
          <div className={`flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-300 ${
            isScrolled ? 'py-0.5' : 'py-1'
          }`}>
            
            {/* Logotipo y Títulos Institucionales */}
            <div 
              role="button"
              tabIndex={0}
              onClick={handleGoHome}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGoHome(); } }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 rounded-lg p-1 -m-1 focus-visible:ring-2 focus-visible:ring-[#14649B]"
              aria-label="Ir al inicio del portal SAT"
            >
              <div className="relative">
                <div className={`rounded-lg bg-[#19324B] group-hover:bg-[#14649B] flex items-center justify-center text-white font-black tracking-tight transition-all duration-300 shadow-xs ${
                  isScrolled ? 'w-7 h-7 text-xs' : 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm'
                }`}>
                  SAT
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FFB806]" />
              </div>
              
              <div>
                <span className={`text-[#14649B] uppercase tracking-wider block font-bold leading-tight transition-all duration-300 ${
                  isScrolled ? 'text-[9px]' : 'text-[9px] sm:text-[10px]'
                }`}>
                  Portal Institucional
                </span>
                <span className={`font-extrabold text-[#19324B] tracking-tight leading-none transition-all duration-300 ${
                  isScrolled ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                }`}>
                  <span className="sm:hidden">SAT Guatemala</span>
                  <span className="hidden sm:inline">Superintendencia de Administración Tributaria</span>
                </span>
              </div>
            </div>

            {/* Input de Búsqueda fluido sin desbordamiento */}
            <div 
              role="search" 
              className={`relative min-w-0 flex-1 transition-all duration-300 ${
                isScrolled ? 'max-w-[170px] sm:max-w-xs md:max-w-sm' : 'max-w-[190px] sm:max-w-xs md:max-w-sm lg:max-w-md'
              }`}
            >
              <div className="relative">
                <input 
                  type="search" 
                  aria-label="Buscar trámites o requisitos oficiales"
                  placeholder="Buscar trámites o requisitos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full bg-white border border-[#DCDCDC] rounded-lg text-xs text-[#19324B] placeholder:text-slate-500 focus:outline-hidden focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20 transition-all duration-200 ${
                    isScrolled ? 'h-[32px] sm:h-[34px] pl-7 sm:pl-8 pr-7 text-xs' : 'h-[36px] sm:h-[40px] pl-8 sm:pl-9 pr-8 text-xs sm:text-sm'
                  }`}
                />
                <Search 
                  className={`text-slate-400 absolute left-2 sm:left-2.5 pointer-events-none transition-all duration-200 ${
                    isScrolled ? 'top-2 sm:top-2.5 w-3.5 h-3.5' : 'top-2.5 sm:top-3 w-4 h-4'
                  }`} 
                  aria-hidden="true" 
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar campo de búsqueda"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 text-xs rounded-full hover:bg-slate-100"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Resultados interactivos de búsqueda en vivo */}
              {isSearchFocused && searchResults.length > 0 && (
                <div 
                  role="listbox" 
                  aria-label="Resultados de búsqueda"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#DCDCDC] rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-[#DCDCDC]/60"
                >
                  {searchResults.map((res) => (
                    <div
                      key={res.id}
                      role="option"
                      aria-selected={false}
                      tabIndex={0}
                      onClick={() => handleSelectSearchResult(res)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSelectSearchResult(res); }}
                      className="p-3 hover:bg-[#14649B]/5 cursor-pointer transition-colors focus:bg-[#14649B]/10 focus:outline-hidden"
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#14649B]">{res.tramite}</div>
                      <div className="text-[11px] sm:text-xs text-slate-600 line-clamp-1">{res.descripcion}</div>
                      <div className="text-[10px] text-slate-500 pt-1 font-medium">{res.subcategoria} · {res.categoria}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Fila 2: Menú, Inicio y los 4 Macrogrupos oficiales con scroll horizontal táctil seguro */}
          <nav 
            aria-label="Navegación principal" 
            className={`flex items-center gap-2 sm:gap-3 border-t border-[#DCDCDC]/60 transition-all duration-300 ${
              isScrolled ? 'pt-1 mt-1 text-xs' : 'pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 text-xs md:text-sm'
            }`}
          >
            
            {/* Botón de Menú lateral con accesibilidad */}
            <button 
              type="button"
              onClick={() => setMenuSidebarOpen(!menuSidebarOpen)}
              aria-expanded={menuSidebarOpen}
              aria-controls="lateral-menu"
              className={`bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B] hover:text-[#14649B] rounded-lg font-bold shrink-0 transition-all duration-200 flex items-center gap-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                isScrolled ? 'min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 text-xs' : 'min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs'
              }`}
            >
              {menuSidebarOpen ? <X className="w-3.5 h-3.5 text-[#C2185B]" /> : <Menu className="w-3.5 h-3.5 text-[#14649B]" />}
              <span>{menuSidebarOpen ? 'Ocultar' : 'Menú'}</span>
            </button>

            {/* Botón de Inicio */}
            <button 
              type="button"
              onClick={handleGoHome}
              className={`rounded-lg font-bold shrink-0 transition-all duration-200 text-xs focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                isScrolled ? 'min-h-[32px] sm:min-h-[34px] px-2.5 py-1' : 'min-h-[36px] sm:min-h-[38px] px-3 py-1.5'
              } ${
                level === 1 
                  ? 'bg-[#14649B] text-white shadow-xs' 
                  : 'bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B]'
              }`}
            >
              Inicio
            </button>

            {/* Los 4 Macrogrupos oficiales de SAT: Contenedor fluido con scroll horizontal táctil */}
            <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-0.5">
              <div className={`flex items-center whitespace-nowrap pl-2.5 border-l border-[#DCDCDC] transition-all duration-300 ${
                isScrolled ? 'gap-2.5 md:gap-4' : 'gap-3 md:gap-5'
              }`}>
                {PILLARS_CONFIG.map((p) => (
                  <button 
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPillar(p.id)}
                    className={`relative font-semibold transition-colors shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                      isScrolled ? 'py-1 px-1 text-xs' : 'py-1.5 px-1 text-xs md:text-sm'
                    } ${
                      selectedPillar === p.id && level > 1 
                        ? 'text-[#14649B] font-extrabold' 
                        : 'text-slate-700 hover:text-[#14649B]'
                    }`}
                  >
                    {p.name}
                    {selectedPillar === p.id && level > 1 && (
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" 
                        style={{ backgroundColor: p.activeIndicatorColor }} 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </nav>

        </div>
      </header>

      {/* Two-column layout: Context-Aware Lateral Menu + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Mobile Backdrop for Off-Canvas Drawer (WCAG dialog overlay) */}
        {menuSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
            onClick={() => setMenuSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LATERAL MENU: Responsive Mobile Slide-in Drawer + Desktop Sticky Sidebar */}
        <aside 
          id="lateral-menu"
          aria-label="Navegación lateral de trámites"
          className={`
            fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs bg-white p-4 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out
            md:static md:w-68 lg:w-72 md:p-3 md:py-6 md:pl-6 md:pr-3 md:shadow-none md:z-auto md:overflow-y-visible md:translate-x-0
            ${menuSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
            ${isScrolled 
              ? 'md:top-[68px] md:h-[calc(100vh-68px)] md:overflow-y-auto' 
              : 'md:top-[98px] md:h-[calc(100vh-98px)] md:overflow-y-auto'
            }
            md:sticky shrink-0 space-y-3
          `}
        >
          {/* Header del drawer visible exclusivamente en móvil */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <span className="text-xs font-bold text-[#19324B] uppercase tracking-wider">Menú de Trámites</span>
            </div>
            <button
              type="button"
              onClick={() => setMenuSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#14649B]"
              aria-label="Cerrar menú lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* ESTRUCTURA TIPO TABLA (BORDES CONTINUOS, CERO GAPS) */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">

            {/* Nivel 1 Menu: Lista de Macrogrupos */}
            {level === 1 && (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14649B]" />
                    <h3 className="text-xs font-bold text-[#19324B] uppercase tracking-wider">Macrogrupos</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">4 Pilares</span>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {PILLARS_CONFIG.map((p) => {
                    const isSelected = selectedPillar === p.id;
                    return (
                      <button 
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPillar(p.id)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-[#14649B]/8 text-[#14649B] font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-[#14649B]'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#14649B] shadow-[0_0_8px_rgba(20,100,155,0.7)]" />
                        )}
                        <span className="truncate pr-2">{p.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isSelected ? 'text-[#14649B] translate-x-0.5' : 'text-slate-400 group-hover:text-[#14649B]'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nivel 2 Menu: Grupos dentro del Macrogrupo */}
            {level === 2 && (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentPillarConfig.primaryColor }}
                    />
                    <h3 className="text-xs font-bold text-[#19324B] truncate">
                      {currentPillarConfig.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{gruposInPillar.length} Grupos</span>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {gruposInPillar.map((g) => {
                    const isSelected = selectedCategoria === g.nombre;
                    return (
                      <button 
                        key={g.no}
                        type="button"
                        onClick={() => handleSelectCategoria(g.nombre)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-slate-100/70 font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && (
                          <span 
                            className="absolute left-0 top-0 bottom-0 w-1" 
                            style={{ 
                              backgroundColor: currentPillarConfig.primaryColor,
                              boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                            }}
                          />
                        )}
                        <div className="flex items-center gap-1.5 truncate pr-2">
                          <span 
                            className="truncate"
                            style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                          >
                            {g.nombre}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                          {g.cantidadTemas}t
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Si estamos en NIT sin Obligaciones (Nivel 3 o 4), mantener los títulos de subgrupos y sus procesos para acceso directo */}
            {selectedCategoria === 'NIT sin Obligaciones' && (level === 3 || level === 4) ? (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentPillarConfig.primaryColor }}
                    />
                    <h3 className="text-xs font-bold text-[#19324B] truncate">
                      NIT sin Obligaciones
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">8 procesos</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {subgruposInGrupo.map((sub, sIdx) => {
                    const itemsInSub = TRAMITES_DATA.filter(
                      t => t.pillar === selectedPillar && t.categoria === selectedCategoria && (t.subcategoria === sub.nombre || t.tema === sub.nombre)
                    );

                    return (
                      <div key={sIdx} className="py-1">
                        {/* Título del subgrupo en la navegación */}
                        <button
                          type="button"
                          onClick={() => handleSelectSubcategoria(sub.nombre)}
                          className={`w-full flex items-center justify-between px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                            selectedSubcategoria === sub.nombre ? 'text-[#14649B] bg-sky-50/60' : 'text-slate-600 hover:text-[#14649B]'
                          }`}
                        >
                          <span>{sub.nombre}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">
                            {itemsInSub.length}
                          </span>
                        </button>

                        {/* Procesos vinculados al título */}
                        <div className="space-y-0.5">
                          {itemsInSub.map((item) => {
                            const isSelected = selectedTramite?.id === item.id;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectMenuGestion(item)}
                                className={`relative w-full flex items-center justify-between text-left pl-5 pr-3 py-1.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isSelected 
                                    ? 'bg-slate-100/90 font-bold text-[#14649B]' 
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#14649B]'
                                }`}
                              >
                                {isSelected && (
                                  <span 
                                    className="absolute left-0 top-0 bottom-0 w-1" 
                                    style={{ 
                                      backgroundColor: currentPillarConfig.primaryColor,
                                      boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                                    }}
                                  />
                                )}
                                <span className="flex-1 truncate pr-2 leading-tight">
                                  {item.tramite}
                                </span>
                                <ChevronRight 
                                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                    isSelected ? 'translate-x-0.5 text-[#14649B]' : 'text-slate-300 group-hover:text-slate-500'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Nivel 3 Menu: Subgrupos dentro del Grupo */}
                {level === 3 && (
                  <div>
                    <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: currentPillarConfig.primaryColor }}
                        />
                        <h3 className="text-xs font-bold text-[#19324B] truncate">
                          {selectedCategoria}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{subgruposInGrupo.length} Subg.</span>
                    </div>
                    <div className="divide-y divide-slate-200/80">
                      {subgruposInGrupo.map((sub, idx) => {
                        const isSelected = selectedSubcategoria === sub.nombre;
                        return (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSubcategoria(sub.nombre)}
                            className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                              isSelected 
                                ? 'bg-slate-100/70 font-bold' 
                                : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected && (
                              <span 
                                className="absolute left-0 top-0 bottom-0 w-1" 
                                style={{ 
                                  backgroundColor: currentPillarConfig.primaryColor,
                                  boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                                }}
                              />
                            )}
                            <span 
                              className="truncate pr-2"
                              style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                            >
                              {sub.nombre}
                            </span>
                            {sub.cantidadTemas && (
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {sub.cantidadTemas}t
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nivel 4 Menu: Tabla continua de trámites */}
                {level === 4 && (
                  <div>
                    <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: currentPillarConfig.primaryColor }}
                        />
                        <h3 className="text-xs font-bold text-[#19324B] tracking-tight truncate">
                          {selectedSubcategoria}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentSubcategoriaItems.length} {currentSubcategoriaItems.length === 1 ? 'trámite' : 'trámites'}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200/80">
                      {currentSubcategoriaItems.map((item) => {
                        const isSelected = selectedTramite?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectMenuGestion(item)}
                            className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                              isSelected 
                                ? 'bg-slate-100/70 font-bold' 
                                : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected && (
                              <span 
                                className="absolute left-0 top-0 bottom-0 w-1" 
                                style={{ 
                                  backgroundColor: currentPillarConfig.primaryColor,
                                  boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                                }}
                              />
                            )}
                            <span 
                              className="flex-1 pr-2 leading-snug"
                              style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                            >
                              {item.tramite}
                            </span>
                            <ChevronRight 
                              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                isSelected ? 'translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                              style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                            />
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}
              </>
            )}

          </div>

          {/* Enlace para volver al inicio */}
          <div className="px-1 flex items-center justify-between">
            <button 
              type="button"
              onClick={handleGoHome}
              className="text-xs text-[#14649B] hover:text-[#19324B] font-semibold flex items-center gap-1 group py-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B] rounded"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span>Volver al Inicio</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Portal SAT</span>
          </div>

        </aside>

        {/* RIGHT MAIN CONTENT: CARDS NAVIGATION UP TO 4TH LEVEL */}
        <main 
          id="main-content" 
          tabIndex={-1} 
          className={`flex-1 min-w-0 p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 bg-white focus:outline-hidden transition-all duration-300 ${
            !menuSidebarOpen ? 'w-full flex flex-col items-center' : ''
          }`}
        >
          
          {/* Breadcrumbs: SAT Design System Web v1.0 standard */}
          <div className={`w-full flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto sm:justify-center' : 'justify-start'}`}>
            <button onClick={handleGoHome} className="hover:text-[#14649B]">Inicio</button>
            {level >= 2 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <button onClick={() => { setLevel(2); setSelectedTramite(null); }} className="hover:text-[#14649B]">
                  {currentPillarConfig.name}
                </button>
              </>
            )}
            {level >= 3 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <button onClick={() => { setLevel(3); setSelectedTramite(null); }} className="hover:text-[#14649B]">
                  {selectedCategoria}
                </button>
              </>
            )}
            {level >= 4 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <span className="text-[#14649B] font-bold">{selectedSubcategoria}</span>
              </>
            )}
          </div>

          {/* ========================================================
              LEVEL 1: CARDS OF MACRO GROUPS (PILARES)
              ======================================================== */}
          {level === 1 && (
            <div className={`w-full space-y-6 sm:space-y-8 transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : 'max-w-4xl'}`}>
              <div className={`space-y-2 ${!menuSidebarOpen ? 'text-center max-w-2xl mx-auto' : ''}`}>
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">Estructura Institucional SAT</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">Seleccionar un Macrogrupo</h2>
                <p className="text-sm text-slate-600">
                  Categorización oficial de grupos tributarios, aduaneros, profesionales y entes exentos.
                </p>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : ''}`}>
                {PILLARS_CONFIG.map((p) => (
                  <div 
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectPillar(p.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPillar(p.id); } }}
                    className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-base sm:text-lg font-bold text-[#19324B] ${p.titleHoverText} transition-colors`}>
                          {p.name}
                        </h3>
                        <div className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs group-hover:scale-110 group-hover:translate-x-1 group-hover:shadow-md group-hover:ring-4 group-hover:ring-white/25`}>
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-out animate-arrow-nudge group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 2: CARDS OF OFFICIAL GROUPS WITHIN MACRO GROUP
              ======================================================== */}
          {level === 2 && (
            <div className={`w-full space-y-6 sm:space-y-8 transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : 'max-w-4xl'}`}>
              <div className={`space-y-2 ${!menuSidebarOpen ? 'text-center max-w-2xl mx-auto' : ''}`}>
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  Grupos Oficiales de {currentPillarConfig.name}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">Seleccionar un Grupo</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Grupos oficiales clasificados según el régimen, volumen de operaciones y perfil tributario.
                </p>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : ''}`}>
                {gruposInPillar.map((g) => (
                  <div 
                    key={g.no}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectCategoria(g.nombre)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectCategoria(g.nombre); } }}
                    className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{g.nombre}</h3>
                        <div className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs group-hover:scale-110 group-hover:translate-x-1 group-hover:shadow-md group-hover:ring-4 group-hover:ring-white/25`}>
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-out animate-arrow-nudge group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div>
                      {g.desc && (
                        <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">{g.desc}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {g.subgrupos.map((sub, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100/90 text-slate-600 group-hover:bg-white/15 group-hover:text-white/90 transition-colors">
                            {sub.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 3: CARDS OF SUBGROUPS (CATEGORÍAS)
              ======================================================== */}
          {level === 3 && (
            <div className={`w-full space-y-6 sm:space-y-8 transition-all duration-300 ${!menuSidebarOpen ? (selectedCategoria === 'NIT sin Obligaciones' ? 'max-w-5xl xl:max-w-6xl mx-auto' : 'max-w-4xl lg:max-w-5xl mx-auto') : 'max-w-4xl'}`}>
              <div className={`space-y-2 ${!menuSidebarOpen ? 'text-center max-w-2xl mx-auto' : ''}`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                    {selectedCategoria}
                  </span>
                  {selectedCategoria === 'NIT sin Obligaciones' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      8 Procesos Oficiales
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">
                  {selectedCategoria === 'NIT sin Obligaciones' ? 'Procesos de NIT sin Obligaciones' : 'Seleccionar un Subgrupo'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {selectedCategoria === 'NIT sin Obligaciones' 
                    ? 'Catálogo oficial de los 8 procesos autorizados para personas individuales, graduados y egresados sin actividad mercantil (Subgrupo General).'
                    : `Subcategorías oficiales de trámites y gestiones correspondientes a ${selectedCategoria}.`
                  }
                </p>
              </div>

              {/* Si es NIT sin Obligaciones, rejilla continua de 3 por fila con gap mínimo */}
              {selectedCategoria === 'NIT sin Obligaciones' && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 ${!menuSidebarOpen ? 'w-full mx-auto' : ''}`}>
                  {TRAMITES_DATA.filter(t => t.categoria === 'NIT sin Obligaciones').map((item) => (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectMenuGestion(item)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectMenuGestion(item); } }}
                      className="p-4 sm:p-4.5 bg-white border border-[#DCDCDC] rounded-[14px] hover:border-[#14649B] hover:bg-[#14649B] hover:shadow-[0_12px_24px_rgba(20,100,155,0.24)] transition-all duration-200 cursor-pointer group shadow-xs hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14649B]/10 text-[#14649B] group-hover:bg-white/20 group-hover:text-white transition-colors">
                              {item.tema || item.subcategoria}
                            </span>
                            {(item.subtema || item.tipoSubtema) && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 group-hover:bg-white/15 group-hover:text-white/90 transition-colors">
                                {item.subtema || item.tipoSubtema}
                              </span>
                            )}
                            {(item.nombreActual || item.moduloRequisitos) && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100/90 text-slate-700 group-hover:bg-white/20 group-hover:text-white transition-colors truncate max-w-[170px]" title={item.nombreActual || item.moduloRequisitos}>
                                {item.nombreActual || item.moduloRequisitos}
                              </span>
                            )}
                          </div>
                          <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B] shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:translate-x-1 group-hover:shadow-xs group-hover:ring-2 group-hover:ring-white/40">
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-out animate-arrow-nudge group-hover:translate-x-0.5" aria-hidden="true" />
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-white transition-colors leading-snug">
                          {item.tramite}
                        </h4>

                        <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors line-clamp-3 leading-relaxed">
                          {item.descripcion}
                        </p>

                        {/* Distintivos especiales de integración de arquitectura transaccional */}
                        {item.id === 'con-nit-4' && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200/70 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-colors">
                            <span>⚡ Paso integrado en Agencia Virtual</span>
                          </div>
                        )}
                        {item.id === 'con-nit-3' && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200/70 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-colors">
                            <span>🔍 Incluye Consulta de Estado Integrada</span>
                          </div>
                        )}
                        {item.id === 'con-nit-7' && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-colors">
                            <span>🌐 Trámite Ciudadano Universal (Decreto 57-2008)</span>
                          </div>
                        )}
                        {item.id === 'con-nit-8' && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-[#B45309] border border-amber-200/70 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-colors">
                            <span>🎓 Prerrequisito Servicios Profesionales (Ley Timbres)</span>
                          </div>
                        )}
                      </div>

                      {item.perfilDestinatario && (
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 group-hover:border-white/20">
                          <div className="text-[10px] sm:text-[11px] text-slate-500 group-hover:text-white/80 transition-colors line-clamp-1">
                            <strong className="font-semibold text-slate-700 group-hover:text-white">Usado por:</strong> {item.perfilDestinatario}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Subgrupos de navegación para otros grupos */}
              {selectedCategoria !== 'NIT sin Obligaciones' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-[#19324B] uppercase tracking-wider">
                      Subgrupos Oficiales
                    </h3>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : ''}`}>
                    {subgruposInGrupo.map((sub, idx) => (
                      <div 
                        key={idx}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectSubcategoria(sub.nombre)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectSubcategoria(sub.nombre); } }}
                        className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B] flex flex-col justify-between`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base sm:text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{sub.nombre}</h3>
                            <div className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs group-hover:scale-110 group-hover:translate-x-1 group-hover:shadow-md group-hover:ring-4 group-hover:ring-white/25`}>
                              <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-out animate-arrow-nudge group-hover:translate-x-1" aria-hidden="true" />
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">
                            {sub.desc || `Trámites, normativas y requisitos vigentes correspondientes a ${sub.nombre}.`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              LEVEL 4: TRÁMITES & DETAIL CON ACCIÓN EN INFINITIVO
              ======================================================== */}
          {level === 4 && (
            <div className={`w-full space-y-6 sm:space-y-8 transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : 'max-w-3xl'}`}>
              
              {selectedTramite ? (
                <div className="space-y-6 sm:space-y-8">
                  
                  {/* Título, Resumen y Barra de Acciones del Trámite */}
                  <div className="space-y-4 border-b border-[#DCDCDC]/60 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 pb-1">
                          <span className="text-[11px] sm:text-xs font-bold text-[#14649B] uppercase tracking-wider">
                            {selectedTramite.categoria} · {selectedTramite.subcategoria}
                          </span>
                          {selectedTramite.subgrupoInterno && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              Subgrupo: {selectedTramite.subgrupoInterno}
                            </span>
                          )}
                          {(selectedTramite.subtema || selectedTramite.tipoSubtema) && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14649B]/10 text-[#14649B]">
                              Subtema: {selectedTramite.subtema || selectedTramite.tipoSubtema}
                            </span>
                          )}
                          {(selectedTramite.nombreActual || selectedTramite.moduloRequisitos) && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              Página actual: {selectedTramite.nombreActual || selectedTramite.moduloRequisitos}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight text-balance">
                          {selectedTramite.tramite}
                        </h2>
                      </div>

                      {/* Botones de acción funcional: Copiar enlace & Imprimir */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="min-h-[40px] px-3.5 py-2 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] bg-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B]"
                          aria-label="Copiar enlace directo al trámite"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                          <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="min-h-[40px] px-3.5 py-2 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] bg-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B]"
                          aria-label="Imprimir ficha de trámite"
                        >
                          <Printer className="w-4 h-4 text-slate-600" />
                          <span>Imprimir</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {selectedTramite.descripcion}
                    </p>
                  </div>

                  {/* PUNTOS DE ESTA PÁGINA: Accesible, touch-friendly de 2 columnas en tablet/desktop */}
                  {selectedTramite.puntosMenu && (
                    <nav aria-label="Puntos de esta página" className="py-2 pb-4 border-b border-[#DCDCDC]/60 space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Puntos de esta página
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {selectedTramite.puntosMenu.map((punto) => (
                          <button
                            key={punto.id}
                            type="button"
                            onClick={() => scrollToSection(punto.id)}
                            className={`min-h-[38px] px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-left group transition-all text-xs border focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                              activeSectionId === punto.id 
                                ? 'bg-[#14649B]/10 border-[#14649B] text-[#14649B] font-bold shadow-xs' 
                                : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-[#14649B]/5 hover:border-[#14649B]/40 hover:text-[#14649B]'
                            }`}
                          >
                            <span className="leading-snug">{punto.titulo}</span>
                            <span className="text-slate-400 group-hover:text-[#14649B] text-xs shrink-0 font-mono" aria-hidden="true">↓</span>
                          </button>
                        ))}
                      </div>
                    </nav>
                  )}

                  {/* Punto: Perfil del Destinatario y Arquitectura Transaccional */}
                  {(selectedTramite.perfilDestinatario || selectedTramite.impactoOImportancia || selectedTramite.recomendacionUX || selectedTramite.ubicacionPortalActual) && (
                    <section id="perfil" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                        <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Perfil del Destinatario y Arquitectura Transaccional</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {selectedTramite.perfilDestinatario && (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-[#14649B] uppercase tracking-wider block">Usado Por (Perfil)</span>
                            <p className="text-xs sm:text-sm font-semibold text-[#19324B] leading-snug">{selectedTramite.perfilDestinatario}</p>
                          </div>
                        )}
                        {selectedTramite.impactoOImportancia && (
                          <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-xl space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider block">Motivo / Referencia</span>
                            <p className="text-xs sm:text-sm text-slate-800 leading-snug">{selectedTramite.impactoOImportancia}</p>
                          </div>
                        )}
                        {selectedTramite.recomendacionUX && (
                          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block">Nota / Revisar (UX)</span>
                            <p className="text-xs sm:text-sm text-slate-800 leading-snug">{selectedTramite.recomendacionUX}</p>
                          </div>
                        )}
                        {selectedTramite.ubicacionPortalActual && (
                          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block">Sección Actual del Menú</span>
                            <p className="text-xs sm:text-sm text-slate-800 leading-snug font-medium">{selectedTramite.ubicacionPortalActual}</p>
                          </div>
                        )}
                      </div>

                      {selectedTramite.origenClasificacion && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center gap-2 shadow-2xs">
                          <span className="font-bold text-[#14649B]">Origen de la clasificación:</span>
                          <span className="font-medium text-slate-800">{selectedTramite.origenClasificacion}</span>
                        </div>
                      )}
                    </section>
                  )}

                  {/* Requisitos por Modalidad si están presentes (Venta de Especies Fiscales) */}
                  {selectedTramite.requisitosPorModalidad && (
                    <div className="space-y-8">
                      
                      {/* Punto: Requisitos Notario Titular */}
                      <section id="requisitos-notario" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos como Notario Titular</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Requisitos obligatorios para la adquisición directa por parte del profesional Notario habilitado.</p>
                        
                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[0]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-notario-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button" 
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Tercero Autorizado */}
                      <section id="requisitos-tercero" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Acreditar a un Tercero Autorizado (Procurador / Delegado)</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Documentación que debe presentar la persona designada por el Notario para realizar el retiro.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[1]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-tercero-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button" 
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Patentados */}
                      <section id="requisitos-patentados" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4D8014]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos como Patentado Autorizado</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Requisitos para personas individuales o jurídicas acreditadas con patente de expendio.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[2]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-pat-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button" 
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                    </div>
                  )}

                  {/* Requisitos estándar si no tiene modalidades */}
                  {!selectedTramite.requisitosPorModalidad && selectedTramite.requisitos && (
                    <section id="requisitos" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos obligatorios</h3>
                      <div className="space-y-2.5">
                        {selectedTramite.requisitos.map((req, idx) => {
                          const reqKey = `${selectedTramite.id}-req-${idx}`;
                          const isChecked = !!checkedRequirements[reqKey];

                          return (
                            <button 
                              key={idx} 
                              type="button" 
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={() => handleToggleRequirement(reqKey)}
                              onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                  e.preventDefault();
                                  handleToggleRequirement(reqKey);
                                }
                              }}
                              className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                              </span>
                              <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Punto: Pasos del Trámite */}
                  {selectedTramite.pasos && (
                    <section id="pasos" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Seguir los pasos para realizar el trámite</h3>
                      <div className="space-y-3">
                        {selectedTramite.pasos.map((paso, idx) => (
                          <div key={idx} className="p-3.5 sm:p-4 bg-white border border-[#DCDCDC] rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-3.5">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#14649B] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{paso}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Punto: Paso de Seguimiento Integrado Oficial en Ficha de Agencia Virtual */}
                  {selectedTramite.id === 'con-nit-3' && (
                    <section id="seguimiento" className="scroll-mt-24 sm:scroll-mt-28 space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                        <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">
                          Paso de Seguimiento Oficial Integrado
                        </h3>
                      </div>

                      <div className="p-4 sm:p-6 bg-sky-50/70 border-2 border-[#0284C7] rounded-xl space-y-4 shadow-xs">
                        <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0284C7] text-white">
                            Subgrupo: Consultas Públicas
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#0284C7] border border-[#0284C7]/30">
                            Subtema: Seguimiento
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                            Módulo: Estado de Gestión de Agencia Virtual
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base sm:text-lg font-bold text-[#19324B]">
                            Consulta de Estado de Gestión de Agencia Virtual
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            Herramienta de consulta para verificar el estado de aprobación de la solicitud de acceso a Agencia Virtual o reseteo de clave. Permite validar si la solicitud fue aceptada, rechazada o requiere subsanar requisitos.
                          </p>
                          <div className="p-3 bg-white/80 border border-sky-200 rounded-lg text-xs text-slate-700">
                            <strong className="text-[#0284C7]">Arquitectura Transaccional UX:</strong> Debe integrarse como paso de seguimiento dentro de la ficha de Agencia Virtual, no como enlace huérfano. Consulta aquí mismo el avance de tu expediente.
                          </div>
                        </div>

                        {/* Módulo interactivo embebido */}
                        <form onSubmit={handleConsultarGestion} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={consultaGestionInput}
                              onChange={(e) => setConsultaGestionInput(e.target.value)}
                              placeholder="Ej. GEST-2026-89412 o NIT del titular"
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#DCDCDC] rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                            />
                          </div>
                          <button
                            type="submit"
                            className="min-h-[42px] px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                          >
                            <span>Consultar Estado</span>
                            <Search className="w-4 h-4" />
                          </button>
                        </form>

                        {/* Chips de prueba rápida */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="font-semibold">Simular estado:</span>
                          <button
                            type="button"
                            onClick={() => { setConsultaGestionInput('GEST-2026-A1'); setTimeout(() => handleConsultarGestion(), 50); }}
                            className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold transition-colors"
                          >
                            Aprobada
                          </button>
                          <button
                            type="button"
                            onClick={() => { setConsultaGestionInput('GEST-2026-T9'); setTimeout(() => handleConsultarGestion(), 50); }}
                            className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 font-semibold transition-colors"
                          >
                            En trámite
                          </button>
                          <button
                            type="button"
                            onClick={() => { setConsultaGestionInput('GEST-2026-R2'); setTimeout(() => handleConsultarGestion(), 50); }}
                            className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold transition-colors"
                          >
                            Observada / Rechazada
                          </button>
                        </div>

                        {/* Resultado interactivo */}
                        {consultaGestionResult && (
                          <div className="p-4 bg-white border border-sky-200 rounded-lg space-y-2 animate-in fade-in duration-200 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500 font-mono">Expediente: {consultaGestionResult.numero}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                consultaGestionResult.estado === 'Aprobada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : consultaGestionResult.estado === 'Observada'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}>
                                Estado: {consultaGestionResult.estado}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                              {consultaGestionResult.mensaje}
                            </p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-sky-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const consultaItem = TRAMITES_DATA.find(t => t.id === 'con-nit-4');
                              if (consultaItem) handleSelectMenuGestion(consultaItem);
                            }}
                            className="font-bold text-[#0284C7] hover:underline flex items-center gap-1.5"
                          >
                            <span>Ver ficha individual de Consulta de Estado de Gestión</span>
                            <span aria-hidden="true">→</span>
                          </button>

                          <a
                            href="https://portal.sat.gob.gt/portal/consulta-de-gestion-del-contribuyente/"
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-slate-700 hover:text-[#0284C7] hover:underline flex items-center gap-1.5"
                          >
                            <span>Abrir en Portal SAT Oficial</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Punto: Formulario Oficial o Módulo de Consulta */}
                  {selectedTramite.formulario && (
                    <section id="formulario" className="scroll-mt-24 sm:scroll-mt-28 space-y-3 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">
                        {selectedTramite.id === 'con-nit-4' ? 'Herramienta de Consulta de Estado de Gestión' : 'Llenar el formulario oficial de gestión'}
                      </h3>

                      {selectedTramite.id === 'con-nit-4' ? (
                        <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                              <h4 className="text-base sm:text-lg font-bold text-[#19324B]">
                                Módulo de Consulta Pública de Gestiones SAT
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              Ingresa el número de gestión recibido al solicitar la Agencia Virtual o el NIT/DPI del titular para consultar el progreso del expediente.
                            </p>
                            <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-lg text-xs text-slate-700">
                              <strong className="text-[#14649B]">Integración de Arquitectura Transaccional:</strong> Esta herramienta corresponde al paso de seguimiento del flujo de Solicitud y Activación de Agencia Virtual. Se integra como paso de seguimiento para evitar enlaces huérfanos.
                            </div>
                          </div>

                          <form onSubmit={handleConsultarGestion} className="flex flex-col sm:flex-row gap-2.5">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={consultaGestionInput}
                                onChange={(e) => setConsultaGestionInput(e.target.value)}
                                placeholder="Ej. GEST-2026-89412 o NIT del titular"
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#DCDCDC] rounded-lg focus:outline-none focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20"
                              />
                            </div>
                            <button
                              type="submit"
                              className="min-h-[42px] px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2"
                            >
                              <span>Consultar Estado</span>
                              <Search className="w-4 h-4" />
                            </button>
                          </form>

                          {/* Chips de prueba rápida */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                            <span>Prueba rápida:</span>
                            <button
                              type="button"
                              onClick={() => { setConsultaGestionInput('GEST-2026-A1'); setTimeout(() => handleConsultarGestion(), 50); }}
                              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                            >
                              Simular Aprobada
                            </button>
                            <button
                              type="button"
                              onClick={() => { setConsultaGestionInput('GEST-2026-T9'); setTimeout(() => handleConsultarGestion(), 50); }}
                              className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold"
                            >
                              Simular En trámite
                            </button>
                            <button
                              type="button"
                              onClick={() => { setConsultaGestionInput('GEST-2026-R2'); setTimeout(() => handleConsultarGestion(), 50); }}
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold"
                            >
                              Simular Observada
                            </button>
                          </div>

                          {/* Resultado interactivo */}
                          {consultaGestionResult && (
                            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-mono">Expediente: {consultaGestionResult.numero}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  consultaGestionResult.estado === 'Aprobada'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : consultaGestionResult.estado === 'Observada'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}>
                                  Estado: {consultaGestionResult.estado}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {consultaGestionResult.mensaje}
                              </p>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                const avItem = TRAMITES_DATA.find(t => t.id === 'con-nit-3');
                                if (avItem) handleSelectMenuGestion(avItem);
                              }}
                              className="text-[#14649B] font-bold hover:underline flex items-center gap-1"
                            >
                              <span>← Volver a Solicitud y Activación de Agencia Virtual</span>
                            </button>
                            <a
                              href="https://portal.sat.gob.gt/portal/consulta-de-gestion-del-contribuyente/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#14649B] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Abrir sistema en Portal SAT</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-[#14649B]/5 border border-[#14649B]/20 rounded-xl space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="font-bold text-[#14649B] text-sm sm:text-base leading-snug">{selectedTramite.formulario}</span>
                            <span className="inline-flex items-center text-[11px] font-bold text-white bg-[#14649B] px-2.5 py-0.5 rounded-full w-fit">En línea 24/7</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {selectedTramite.id === 'con-nit-8'
                              ? 'Llenar en el portal Declaraguate el formulario SAT-7130 (Impuesto de Timbres Fiscales). Al congelarlo se emite la boleta SAT-2000 para el pago presencial o por banca virtual.'
                              : 'Llenar en el portal oficial Declaraguate o Agencia Virtual. Al congelarlo se emite la boleta SAT-2000 para el pago presencial o electrónico.'
                            }
                          </p>
                          <a 
                            href="https://declaraguate.sat.gob.gt" 
                            target="_blank" 
                            rel="noreferrer"
                            className="min-h-[40px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14649B] hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B] rounded"
                          >
                            <span>Ir al sistema de formularios Declaraguate</span>
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </section>
                  )}

                  {/* Punto: Herramienta de Consulta y Verificación de Registro de Títulos QR (con-nit-8) */}
                  {selectedTramite.id === 'con-nit-8' && (
                    <section id="verificador-qr" className="scroll-mt-24 sm:scroll-mt-28 space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                        <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">
                          Consulta de Títulos QR (Herramienta de Verificación)
                        </h3>
                      </div>

                      <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14649B]/10 text-[#14649B]">
                              Herramienta de Verificación Pública
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Validez Oficial con Código QR
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-[#19324B]">
                            Verificación de Autenticidad de Registro de Títulos SAT
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Permite a graduados, profesionales colegiados, empleadores y entidades públicas constatar la autenticidad del registro de título y el pago del impuesto de timbres fiscales según el sticker QR emitido por la SAT.
                          </p>
                        </div>

                        <form onSubmit={handleConsultarTitulo} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={consultaTituloInput}
                              onChange={(e) => setConsultaTituloInput(e.target.value)}
                              placeholder="Ej. REG-USAC-2026, Carné de Colegiado o DPI"
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#DCDCDC] rounded-lg focus:outline-none focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20"
                            />
                          </div>
                          <button
                            type="submit"
                            className="min-h-[42px] px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#14649B]"
                          >
                            <span>Verificar Título QR</span>
                            <Search className="w-4 h-4" />
                          </button>
                        </form>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                          <span>Simular consulta:</span>
                          <button
                            type="button"
                            onClick={() => { setConsultaTituloInput('REG-USAC-89210'); setTimeout(() => handleConsultarTitulo(), 50); }}
                            className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold"
                          >
                            TÍT-USAC-89210
                          </button>
                          <button
                            type="button"
                            onClick={() => { setConsultaTituloInput('REG-URL-44120'); setTimeout(() => handleConsultarTitulo(), 50); }}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                          >
                            TÍT-URL-44120
                          </button>
                          <button
                            type="button"
                            onClick={() => { setConsultaTituloInput('REG-UVG-11090'); setTimeout(() => handleConsultarTitulo(), 50); }}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold"
                          >
                            TÍT-UVG-11090
                          </button>
                        </div>

                        {consultaTituloResult && (
                          <div className="p-4 bg-white border border-emerald-200 rounded-lg space-y-2.5 animate-in fade-in duration-200 shadow-xs">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                              <span className="text-xs font-mono text-slate-500">Expediente QR: {consultaTituloResult.numero}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                {consultaTituloResult.estado}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500 block">Grado Académico:</span>
                                <strong className="text-slate-800 font-semibold">{consultaTituloResult.grado}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Condición Profesional:</span>
                                <strong className="text-[#14649B] font-semibold">{consultaTituloResult.profesional}</strong>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                              {consultaTituloResult.timbres}
                            </p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-slate-500">
                            Prerrequisito para afiliarse a Servicios Profesionales en el RTU y habilitar emisión FEL.
                          </span>
                          <a
                            href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/registro-y-habilitacion-de-titulos-para-ejercer-profesion/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#14649B] font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Ver portal SAT Consulta de Títulos</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Punto: Notas Importantes y Tarifas (TABLA DE DATOS RESPONSIVE WCAG 2.2) */}
                  <section id="notas" className="scroll-mt-24 sm:scroll-mt-28 space-y-4 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Revisar tarifas y notas importantes</h3>

                    {/* TABLA DE TARIFAS: Si corresponde a Especies Fiscales */}
                    {selectedTramite.subcategoria === 'Abogados y Notarios' && selectedTramite.tramite.includes('Especies') && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                          Cuadro Oficial de Valores y Especies Fiscales
                        </div>

                        {/* Desktop Table View (>= 640px) */}
                        <div className="hidden sm:block border border-[#DCDCDC] rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-100/80 text-[#19324B] font-bold border-b border-[#DCDCDC]">
                              <tr>
                                <th scope="col" className="p-3">Especie / Instrumento</th>
                                <th scope="col" className="p-3">Tarifa Oficial</th>
                                <th scope="col" className="p-3">Presentación / Detalle</th>
                                <th scope="col" className="p-3">Base Legal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DCDCDC]/70 text-slate-700 bg-white">
                              <tr className="hover:bg-slate-50/70">
                                <td className="p-3 font-semibold text-[#19324B]">Papel Sellado Especial para Protocolos</td>
                                <td className="p-3 font-bold text-[#14649B]">Q10.00 / hoja</td>
                                <td className="p-3">Lote de 50 hojas (Q500.00) + 5 de comisión (55 hojas)</td>
                                <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 24</td>
                              </tr>
                              <tr className="hover:bg-slate-50/70">
                                <td className="p-3 font-semibold text-[#19324B]">Comisión Notarial de Ley</td>
                                <td className="p-3 font-bold text-emerald-700">10% en especie</td>
                                <td className="p-3">5 hojas exentas entregadas por cada 50 adquiridas</td>
                                <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 28</td>
                              </tr>
                              <tr className="hover:bg-slate-50/70">
                                <td className="p-3 font-semibold text-[#19324B]">Timbres Fiscales Notariales</td>
                                <td className="p-3 font-bold text-[#14649B]">Valores faciales</td>
                                <td className="p-3">Denominaciones desde Q0.50 hasta Q100.00</td>
                                <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 5</td>
                              </tr>
                              <tr className="hover:bg-slate-50/70">
                                <td className="p-3 font-semibold text-[#19324B]">Razón Electrónica en Agencia Virtual</td>
                                <td className="p-3 font-bold text-[#14649B]">Tarifa específica</td>
                                <td className="p-3">Pago en línea con código QR de autenticidad</td>
                                <td className="p-3 text-slate-500 font-mono">Acuerdo Directorio</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card Transformation View (< 640px) */}
                        <div className="sm:hidden space-y-2.5">
                          <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                            <div className="font-bold text-[#19324B] text-sm">Papel Sellado Especial para Protocolos</div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Tarifa oficial:</span>
                              <span className="font-bold text-[#14649B] text-sm">Q10.00 por hoja</span>
                            </div>
                            <div className="text-[11px] text-slate-600">Lote de 50 hojas (Q500.00) + 5 hojas de comisión legal (55 hojas total).</div>
                            <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 24</div>
                          </div>

                          <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                            <div className="font-bold text-[#19324B] text-sm">Comisión Notarial de Ley</div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Beneficio legal:</span>
                              <span className="font-bold text-emerald-700 text-sm">10% en especie</span>
                            </div>
                            <div className="text-[11px] text-slate-600">5 hojas adicionales sin costo por cada lote de 50 hojas adquirido.</div>
                            <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 28</div>
                          </div>

                          <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                            <div className="font-bold text-[#19324B] text-sm">Timbres Fiscales y Razón Electrónica</div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Modalidad:</span>
                              <span className="font-bold text-[#14649B] text-sm">Física o Virtual</span>
                            </div>
                            <div className="text-[11px] text-slate-600">Estampillas físicas de distintas denominaciones o razón electrónica con QR en Agencia Virtual.</div>
                            <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 5</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TABLA DE TARIFAS: Si corresponde a Solvencia Fiscal */}
                    {selectedTramite.id === 'con-nit-5' && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                          Cuadro de Aranceles y Validez de Solvencia Fiscal
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden sm:block border border-[#DCDCDC] rounded-xl overflow-hidden shadow-xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-100/80 text-[#19324B] font-bold border-b border-[#DCDCDC]">
                              <tr>
                                <th scope="col" className="p-3">Concepto Oficial</th>
                                <th scope="col" className="p-3">Tarifa Legal</th>
                                <th scope="col" className="p-3">Vigencia Oficial</th>
                                <th scope="col" className="p-3">Canal de Emisión</th>
                                <th scope="col" className="p-3">Base Legal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DCDCDC]/70 text-slate-700 bg-white">
                              <tr className="hover:bg-slate-50/70">
                                <td className="p-3 font-semibold text-[#19324B]">Solvencia Fiscal Electrónica (SOFI)</td>
                                <td className="p-3 font-bold text-[#14649B]">Q30.00</td>
                                <td className="p-3 text-emerald-700 font-bold">30 días calendario</td>
                                <td className="p-3">Declaraguate SAT-8421 / Agencia Virtual</td>
                                <td className="p-3 text-slate-500 font-mono">Dto. 6-91 Art. 57 "A"</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                          <div className="font-bold text-[#19324B] text-sm">Solvencia Fiscal Electrónica (SOFI)</div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Tarifa oficial:</span>
                            <span className="font-bold text-[#14649B] text-sm">Q30.00</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Vigencia:</span>
                            <span className="font-bold text-emerald-700">30 días calendario</span>
                          </div>
                          <div className="text-[11px] text-slate-600 pt-1">Emisión electrónica inmediata con código QR de verificación para postulaciones o contratos civiles.</div>
                          <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Código Tributario Art. 57 "A"</div>
                        </div>
                      </div>
                    )}

                    {/* Notas importantes en bloque accesible */}
                    {selectedTramite.notasImportantes && (
                      <div className="p-4 sm:p-5 bg-amber-50/70 border border-[#B45309]/30 rounded-2xl space-y-2.5 text-xs sm:text-sm text-slate-800">
                        {selectedTramite.notasImportantes.map((nota, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="text-[#B45309] font-black text-base shrink-0 leading-none mt-0.5" aria-hidden="true">•</span>
                            <p className="leading-relaxed">{nota}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Punto: Base Legal */}
                  {selectedTramite.baseLegal && (
                    <section id="base-legal" className="scroll-mt-24 sm:scroll-mt-28 space-y-2 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Consultar base legal y normativa aplicable</h3>
                      <div className="p-4 bg-slate-50 border border-[#DCDCDC] rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {selectedTramite.baseLegal}
                      </div>
                    </section>
                  )}

                  {/* Punto: Retiro en Agencias SAT (condicional) */}
                  {selectedTramite.puntosMenu.some(p => p.id === 'agencias') && (
                    <section id="agencias" className="scroll-mt-24 sm:scroll-mt-28 space-y-3 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Retirar especies en Oficinas y Agencias Tributarias SAT</h3>
                      <div className="p-4 sm:p-5 bg-white border border-[#DCDCDC] rounded-xl space-y-2 text-xs sm:text-sm text-slate-700">
                        <p className="leading-relaxed">
                          Efectuar la recepción de las especies fiscales y la razón electrónica de correlativos de Papel de Protocolo en cualquier oficina o agencia tributaria de la SAT a nivel nacional.
                        </p>
                        <div className="text-xs text-[#14649B] font-semibold pt-1">
                          Horario habitual: Lunes a viernes de 08:00 a 16:00 horas (sin cerrar al mediodía).
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Punto: Enlace Oficial SAT */}
                  <section id="enlace" className="scroll-mt-24 sm:scroll-mt-28 pt-4 border-t border-[#DCDCDC]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#19324B] text-white rounded-xl shadow-xs">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base">Ir al trámite oficial en Portal SAT Guatemala</h4>
                        <p className="text-xs text-slate-300">Consultar los términos y condiciones directamente en el portal oficial.</p>
                      </div>
                      <a 
                        href={selectedTramite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto"
                        aria-label="Abrir trámite oficial en la SAT (se abre en pestaña nueva)"
                      >
                        <span>Abrir trámite oficial en la SAT</span>
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </section>

                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`space-y-2 ${!menuSidebarOpen ? 'text-center max-w-2xl mx-auto' : ''}`}>
                    <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                      {selectedSubcategoria}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#19324B]">Trámites en {selectedSubcategoria}</h3>
                    <p className="text-xs sm:text-sm text-slate-600">Seleccionar el trámite para ver requisitos detallados y pasos a seguir.</p>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${!menuSidebarOpen ? 'max-w-4xl lg:max-w-5xl mx-auto' : ''}`}>
                    {currentSubcategoriaItems.map((item) => (
                      <div 
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectMenuGestion(item)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectMenuGestion(item); } }}
                        className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B]`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-bold text-[#19324B] group-hover:text-white transition-colors">{item.tramite}</h4>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors line-clamp-2 leading-relaxed">{item.descripcion}</p>
                        <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                          <span>Ver trámite</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* Institutional SAT Footer conforming to Design System Web v1.0 and Safe Area */}
      <footer className="border-t border-[#DCDCDC] py-6 sm:py-8 px-4 sm:px-8 bg-white pb-[calc(1.5rem+var(--safe-bottom))]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="text-center sm:text-left leading-relaxed">
            © 2026 Superintendencia de Administración Tributaria — SAT Guatemala. SAT Design System Web v1.0.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#14649B] font-semibold">
            <a href="https://portal.sat.gob.gt" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Portal SAT</a>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <a href="https://declaraguate.sat.gob.gt" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Declaraguate</a>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <a href="https://portal.sat.gob.gt/portal/agencia-virtual/" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Agencia Virtual</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
