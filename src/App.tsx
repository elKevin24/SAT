import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserSegmentCards, SegmentId } from './components/UserSegmentCards';
import { RotaryBanner } from './components/RotaryBanner';
import { QuickAccessCarousel } from './components/QuickAccessCarousel';
import { PopularTopicsTabs } from './components/PopularTopicsTabs';
import { GuidedProcessesSection } from './components/GuidedProcessesSection';
import { NewsAndTransparencySection } from './components/NewsAndTransparencySection';
import { InstitutionalFooter } from './components/InstitutionalFooter';
import { UserWayAccessibilityModal } from './components/UserWayAccessibilityModal';
import { DirectConsultasModal } from './components/DirectConsultasModal';
import { GuidedProcessModal } from './components/GuidedProcessModal';
import { TramiteDetailModal } from './components/TramiteDetailModal';
import { SegmentTramitesCatalog, TramiteItem } from './components/SegmentTramitesCatalog';
import { EtapaAtoId, TipoInteraccionId } from './data/portalMasterTaxonomy';

// Import official extracted datasets
import rawTramites from './data/allTramites.json';
import rawProcesos from './data/allProcesos.json';

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
  const [currentView, setCurrentView] = useState<'home' | 'catalog'>('home');
  const [activeSegment, setActiveSegment] = useState<SegmentId>('contribuyentes');
  const [activeCategory, setActiveCategory] = useState<string>('Todas las categorías');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeEtapaAto, setActiveEtapaAto] = useState<EtapaAtoId | 'todas'>('todas');
  const [activeTipoInteraccion, setActiveTipoInteraccion] = useState<TipoInteraccionId | 'todos'>('todos');

  // Search query in Header
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modals
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);
  const [selectedProceso, setSelectedProceso] = useState<any | null>(null);
  const [consultasModalSegment, setConsultasModalSegment] = useState<SegmentId | null>(null);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);

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
          if (seg && ['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'].includes(seg)) {
            setActiveSegment(seg);
          }

          const cat = params.get('categoria');
          if (cat) {
            setActiveCategory(cat);
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
      params.set('categoria', category);
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
        onSelectTramite={(t) => setSelectedTramite(t as unknown as TramiteItem)}
        onSelectProceso={(p) => setSelectedProceso(p)}
        onOpenAccessibility={() => setAccessibilityModalOpen(true)}
        allTramites={rawTramites}
        allProcesos={rawProcesos}
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
            />

            {/* 3. Rotary Banner */}
            <RotaryBanner />

            {/* 4. Quick Access Carousel */}
            <QuickAccessCarousel />

            {/* 5. Popular Topics Tabs */}
            <PopularTopicsTabs
              onOpenConsultasModal={(segId) => setConsultasModalSegment(segId)}
            />

            {/* 6. Guided Processes Section */}
            <GuidedProcessesSection
              procesos={rawProcesos as any}
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
              allTramites={rawTramites as any}
              onSelectTramite={(t) => setSelectedTramite(t as unknown as TramiteItem)}
              onBackToHome={handleGoHome}
              onSwitchSegment={(segId) => {
                handleSelectSegment(segId);
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
    </div>
  );
}
