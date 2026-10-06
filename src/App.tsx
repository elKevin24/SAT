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

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modals
  const [selectedTramite, setSelectedTramite] = useState<any | null>(null);
  const [selectedProceso, setSelectedProceso] = useState<any | null>(null);
  const [consultasModalSegment, setConsultasModalSegment] = useState<SegmentId | null>(null);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);

  // Accessibility State
  const [accSettings, setAccSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  const handleUpdateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setAccSettings(prev => ({ ...prev, ...updates }));
  };

  const handleResetAccessibility = () => {
    setAccSettings(DEFAULT_ACCESSIBILITY);
  };

  // Switch to catalog when a user selects a segment
  const handleSelectSegment = (segId: SegmentId) => {
    setActiveSegment(segId);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build dynamic styles based on accessibility settings
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
        {currentView === 'home' ? (
          <>
            {/* 2. User Segments (4 Cards with Roll-over) */}
            <UserSegmentCards
              selectedSegment={null}
              onSelectSegment={handleSelectSegment}
            />

            {/* 3. Rotary Banner (Slide 10) */}
            <RotaryBanner />

            {/* 4. Quick Access Carousel (Slide 11: 7 visible + 2 carousel) */}
            <QuickAccessCarousel />

            {/* 5. Popular Topics Tabs with Permanent Consultas (Slide 12) */}
            <PopularTopicsTabs
              onOpenConsultasModal={(segId) => setConsultasModalSegment(segId)}
            />

            {/* 6. Guided Processes Section (49 Core Lifecycle Routes) */}
            <GuidedProcessesSection
              procesos={rawProcesos as any}
              onSelectProceso={(p) => setSelectedProceso(p)}
            />

            {/* 7. News & Transparency Section (Slide 13) */}
            <NewsAndTransparencySection />
          </>
        ) : (
          /* Segment Trámites Catalog (when exploring a specific segment) */
          <SegmentTramitesCatalog
            segmentId={activeSegment}
            allTramites={rawTramites as any}
            onSelectTramite={(t) => setSelectedTramite(t)}
            onBackToHome={handleGoHome}
            onSwitchSegment={(segId) => setActiveSegment(segId)}
          />
        )}
      </main>

      {/* 8. Institutional Footer (Slide 14) */}
      <InstitutionalFooter />

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
