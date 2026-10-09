import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserSegmentCards, SegmentId } from './components/UserSegmentCards';
import { RotaryBanner } from './components/RotaryBanner';
import { PopularTopicsTabs } from './components/PopularTopicsTabs';
import { GuidedProcessesSection } from './components/GuidedProcessesSection';
import { NewsAndTransparencySection } from './components/NewsAndTransparencySection';
import { InstitutionalFooter } from './components/InstitutionalFooter';
import { UserWayAccessibilityModal } from './components/UserWayAccessibilityModal';
import { DirectConsultasModal } from './components/DirectConsultasModal';
import { GuidedProcessModal } from './components/GuidedProcessModal';
import { TramiteDetailModal } from './components/TramiteDetailModal';
import { VirtualAssistantModal } from './components/VirtualAssistantModal';
import { PortalFlowModal } from './components/PortalFlowModal';
import { SegmentTramitesCatalog } from './components/SegmentTramitesCatalog';
import { QuickAccessCarousel } from './components/QuickAccessCarousel';
import { SolicitarNitPage } from './pages/SolicitarNitPage';
import { EtapaAtoId, TipoInteraccionId, TramiteItem, ProcesoGuiado } from './data/schema';
import { buildTaxonomy, resolveCategoria, categoriaId } from './data/taxonomy';

// Import official extracted datasets
import rawTramites from './data/allTramites.json';
import rawProcesos from './data/allProcesos.json';

const allTramites = rawTramites as TramiteItem[];
const allProcesos = rawProcesos as ProcesoGuiado[];
const TAXONOMY = buildTaxonomy(allTramites);

interface AccessibilitySettings {
  contrastMode: 'normal' | 'high' | 'dark' | 'inverted';
  fontSizeStep: number;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  highlightLinks: boolean;
  readingGuide: boolean;
  textSpacing: boolean;
  cursorBig: boolean;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  contrastMode: 'normal',
  fontSizeStep: 0,
  dyslexiaFont: false,
  reducedMotion: false,
  highlightLinks: false,
  readingGuide: false,
  textSpacing: false,
  cursorBig: false,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'solicitar-nit'>('home');
  const [activeSegment, setActiveSegment] = useState<SegmentId>('contribuyentes');
  const [activeCategory, setActiveCategory] = useState<string>('Todas las categorías');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeEtapaAto, setActiveEtapaAto] = useState<EtapaAtoId | 'todas'>('todas');
  const [activeTipoInteraccion, setActiveTipoInteraccion] = useState<TipoInteraccionId | 'todos'>('todos');

  // Search query in Header
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modals
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);
  const [selectedProceso, setSelectedProceso] = useState<ProcesoGuiado | null>(null);
  const [consultasModalSegment, setConsultasModalSegment] = useState<SegmentId | null>(null);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);

  // Accessibility State
  const [accSettings, setAccSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Enrutamiento por Hash compatible con GitHub Pages (Deep Linking sin errores 404)
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#/catalogo')) {
        setCurrentView('catalog');
        const queryIndex = hash.indexOf('?');
        if (queryIndex !== -1) {
          const params = new URLSearchParams(hash.substring(queryIndex + 1));

          const seg = params.get('segmento') as SegmentId | null;
          let resolvedSeg: SegmentId | null = null;
          if (seg && ['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'].includes(seg)) {
            resolvedSeg = seg;
            setActiveSegment(seg);
          }

          const cat = params.get('categoria');
          if (cat) {
            setActiveCategory(resolveCategoria(TAXONOMY, resolvedSeg ?? 'contribuyentes', cat) ?? cat);
          } else {
            setActiveCategory('Todas las categorías');
          }

          const sub = params.get('subcategoria');
          setActiveSubcategory(sub || null);

          const etapa = params.get('etapa') as EtapaAtoId | null;
          if (etapa && ['empezar', 'operar', 'consultar', 'modificar_cerrar', 'normativa'].includes(etapa)) {
            setActiveEtapaAto(etapa);
          } else {
            setActiveEtapaAto('todas');
          }

          const tipo = params.get('tipo') as TipoInteraccionId | null;
          if (tipo && ['servicio_transaccional', 'consulta_datos', 'guia_informativa', 'descarga_recurso'].includes(tipo)) {
            setActiveTipoInteraccion(tipo);
          } else {
            setActiveTipoInteraccion('todos');
          }
        }
      } else if (hash.startsWith('#/solicitar-nit') || hash.startsWith('#/primer-nit') || hash.startsWith('#/quiero-ser-contribuyente')) {
        setCurrentView('solicitar-nit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash || hash === '#' || hash === '#/') {
        setCurrentView('home');
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, []);

  const handleUpdateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setAccSettings(prev => ({ ...prev, ...updates }));
  };

  const handleResetAccessibility = () => {
    setAccSettings(DEFAULT_ACCESSIBILITY);
  };

  const handleSelectSegment = (segId: SegmentId, category?: string) => {
    setActiveSegment(segId);
    setActiveCategory(category || 'Todas las categorías');
    setActiveSubcategory(null);
    setActiveEtapaAto('todas');
    setActiveTipoInteraccion('todos');
    setCurrentView('catalog');

    const params = new URLSearchParams();
    params.set('segmento', segId);
    if (category && category !== 'Todas las categorías') {
      params.set('categoria', categoriaId(segId, category));
    }
    window.location.hash = '#/catalogo?' + params.toString();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    setActiveCategory('Todas las categorías');
    setActiveSubcategory(null);
    setActiveEtapaAto('todas');
    setActiveTipoInteraccion('todos');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoStyleGuide = () => {
    window.location.hash = '#/estilo';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAccessibilityClasses = () => {
    const classes = [];
    if (accSettings.contrastMode === 'high') classes.push('contrast-125 saturate-150');
    if (accSettings.contrastMode === 'dark') classes.push('invert hue-rotate-180 bg-slate-900');
    if (accSettings.contrastMode === 'inverted') classes.push('invert');
    if (accSettings.highlightLinks) classes.push('[&_a]:underline [&_a]:bg-yellow-100 [&_a]:text-blue-900');
    if (accSettings.textSpacing) classes.push('tracking-wide leading-loose');
    if (accSettings.dyslexiaFont) classes.push('font-mono');
    return classes.join(' ');
  };

  return (
    <div 
      className={`min-h-screen bg-white text-slate-800 flex flex-col antialiased transition-all ${getAccessibilityClasses()}`}
      style={{
        fontSize: accSettings.fontSizeStep ? `${100 + accSettings.fontSizeStep * 8}%` : undefined
      }}
    >
      {/* 1. Official Institutional Header */}
      <Header
        onGoHome={handleGoHome}
        onGoStyleGuide={handleGoStyleGuide}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTramite={(t) => setSelectedTramite(t)}
        onSelectProceso={(p) => setSelectedProceso(p)}
        onOpenAccessibility={() => setAccessibilityModalOpen(true)}
        allTramites={allTramites}
        allProcesos={allProcesos}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            {/* Título de página (accesible; el hero visual lo presenta cada sección) */}
            <h1 className="sr-only">Portal de Trámites y Servicios de la SAT en línea</h1>

            {/* 2. User Segments (4 Macrogrupos Oficiales) */}
            <UserSegmentCards
              selectedSegment={null}
              onSelectSegment={handleSelectSegment}
              onOpenFlowDiagram={() => setIsFlowModalOpen(true)}
            />

            {/* 3. Rotary Banner (Lámina 10 del PDF Oficial: 3 simultáneos, máx 120 caracteres) */}
            <RotaryBanner />

            {/* 4. Accesos Rápidos (Lámina 11 del PDF Oficial: 7 visibles + 2 en carrusel) */}
            <QuickAccessCarousel
              onSelectQuickAction={(item) => {
                if (item.id === 'cual-es-mi-nit' || item.id === 'consultar-vehiculos' || item.id === 'omisos') {
                  setConsultasModalSegment('contribuyentes');
                } else if (item.id === 'solvencia-fiscal') {
                  const solvencia = allTramites.find(t => t.id === 'SAT-GES-0154' || t.tramite.toLowerCase().includes('solvencia fiscal'));
                  if (solvencia) setSelectedTramite(solvencia);
                } else if (item.id === 'solicitar-nit') {
                  window.location.hash = '#/solicitar-nit';
                } else if (item.id === 'fel') {
                  handleSelectSegment('contribuyentes', 'Facturación Electrónica en Línea (FEL)');
                }
              }}
            />

            {/* 5. Temas Más Consultados (Lámina 12 del PDF Oficial: opción 1 fija a Consultas) */}
            <PopularTopicsTabs
              onOpenConsultasModal={(segId) => setConsultasModalSegment(segId)}
            />

            {/* 6. Guided Processes Section */}
            <GuidedProcessesSection
              procesos={allProcesos}
              onSelectProceso={(p) => setSelectedProceso(p)}
            />

            {/* 7. News & Transparency Section */}
            <NewsAndTransparencySection />
          </main>
        )}

        {currentView === 'catalog' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <SegmentTramitesCatalog
              segmentId={activeSegment}
              initialCategory={activeCategory}
              initialSubcategory={activeSubcategory}
              initialEtapaAto={activeEtapaAto}
              initialTipoInteraccion={activeTipoInteraccion}
              allTramites={allTramites}
              onSelectTramite={(t) => setSelectedTramite(t)}
              onBackToHome={handleGoHome}
              onSwitchSegment={(segId) => {
                handleSelectSegment(segId);
              }}
            />
          </main>
        )}

        {currentView === 'solicitar-nit' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <SolicitarNitPage
              onBackToHome={handleGoHome}
              onOpenConsultasNIT={() => setConsultasModalSegment('contribuyentes')}
              onOpenProcesoGuiado={() => {
                const procNit = allProcesos.find(p => p.no === 1);
                if (procNit) setSelectedProceso(procNit);
              }}
            />
          </main>
        )}
      </div>

      {/* 8. Institutional Footer */}
      <InstitutionalFooter onOpenStyleGuide={handleGoStyleGuide} />

      {/* Modals & Overlays */}
      <UserWayAccessibilityModal
        isOpen={accessibilityModalOpen}
        onClose={() => setAccessibilityModalOpen(false)}
        settings={accSettings}
        onUpdateSettings={handleUpdateAccessibility}
        onReset={handleResetAccessibility}
      />

      <DirectConsultasModal
        isOpen={!!consultasModalSegment}
        onClose={() => setConsultasModalSegment(null)}
        segmentId={consultasModalSegment || 'contribuyentes'}
      />

      <GuidedProcessModal
        proceso={selectedProceso}
        onClose={() => setSelectedProceso(null)}
      />

      <TramiteDetailModal
        tramite={selectedTramite}
        onClose={() => setSelectedTramite(null)}
      />

      <VirtualAssistantModal />

      <PortalFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        initialSegment={activeSegment}
      />
    </div>
  );
}
