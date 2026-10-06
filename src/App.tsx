import React, { useState } from 'react';
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
import { SegmentTramitesCatalog } from './components/SegmentTramitesCatalog';

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

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modals
  const [selectedTramite, setSelectedTramite] = useState<any | null>(null);
  const [selectedProceso, setSelectedProceso] = useState<any | null>(null);
  const [consultasModalSegment, setConsultasModalSegment] = useState<SegmentId | null>(null);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);

  // Accessibility State
  const [accSettings, setAccSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Nota: el enrutado del styleguide vive en src/main.tsx (isStyleGuideHash).
  // App solo fija el hash; main.tsx decide que vista montar. Duplicar la
  // comparacion del hash aqui provocaba que el styleguide se desmontara al
  // navegar entre sus secciones internas.

  const handleUpdateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setAccSettings(prev => ({ ...prev, ...updates }));
  };

  const handleResetAccessibility = () => {
    setAccSettings(DEFAULT_ACCESSIBILITY);
  };

  const handleSelectSegment = (segId: SegmentId, category?: string) => {
    setActiveSegment(segId);
    setActiveCategory(category || 'Todas las categorías');
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    setActiveCategory('Todas las categorías');
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
        allTramites={rawTramites}
        allProcesos={rawProcesos}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* 2. User Segments */}
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
          </>
        )}

        {currentView === 'catalog' && (
          /* Segment Trámites Catalog */
          <SegmentTramitesCatalog
            segmentId={activeSegment}
            initialCategory={activeCategory}
            allTramites={rawTramites as any}
            onSelectTramite={(t) => setSelectedTramite(t)}
            onBackToHome={handleGoHome}
            onSwitchSegment={(segId) => {
              setActiveSegment(segId);
              setActiveCategory('Todas las categorías');
            }}
          />
        )}

        </main>

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
