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
import { GestionContentPage, SOLICITAR_NIT_IDS, ACTUALIZAR_RTU_CASO_BY_ID } from './pages/GestionContentPage';
import { VirtualAssistantModal } from './components/VirtualAssistantModal';
import { SegmentTramitesCatalog } from './components/SegmentTramitesCatalog';
import { QuickAccessCarousel } from './components/QuickAccessCarousel';
import { SolicitarNitPage } from './pages/SolicitarNitPage';
import { FelPage } from './pages/FelPage';
import { GuidedAssistantPage } from './pages/GuidedAssistantPage';
import { ProcessJourneyPage } from './pages/ProcessJourneyPage';
import { EtapaAtoId, TipoInteraccionId, TramiteItem, ProcesoGuiado, assertTramites } from './data/schema';
import { compareCanonicalTramiteOrder } from './data/categoryOrder';
import { buildTaxonomy, resolveCategoria, categoriaId, subcategoriaId } from './data/taxonomy';

// Import official extracted datasets
import rawTramites from './data/allTramites.json';
import rawProcesos from './data/allProcesos.json';

const allTramites = assertTramites(rawTramites);
const allProcesos = rawProcesos as ProcesoGuiado[];
const TAXONOMY = buildTaxonomy(allTramites);

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toGestionSlug(t: TramiteItem): string {
  const cid = t.id || t.codigo || '';
  if (SOLICITAR_NIT_IDS.has(cid)) {
    return 'solicitar-nit';
  }
  if (cid in ACTUALIZAR_RTU_CASO_BY_ID) {
    return 'actualizar-rtu';
  }
  return toSlug(t.gestion || t.tramite || t.id);
}

function toProcesoSlug(p: ProcesoGuiado): string {
  if (p.no === 1) return 'solicitar-nit';
  if (p.no === 9 || p.no === 10) return 'actualizar-rtu';
  return toSlug(p.nombre || String(p.no));
}

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
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'solicitar-nit' | 'fel' | 'gestion' | 'asistente' | 'proceso'>('home');
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>('primer-nit');
  const [selectedProcessNo, setSelectedProcessNo] = useState<number>(1);
  const [activeSegment, setActiveSegment] = useState<SegmentId>('contribuyentes');
  const [activeCategory, setActiveCategory] = useState<string>('Todas las categorías');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeEtapaAto, setActiveEtapaAto] = useState<EtapaAtoId | 'todas'>('todas');
  const [activeTipoInteraccion, setActiveTipoInteraccion] = useState<TipoInteraccionId | 'todos'>('todos');

  // Search query in Header
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modals
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);
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
          let resolvedSeg: SegmentId | null = null;
          if (seg && ['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'].includes(seg)) {
            resolvedSeg = seg;
            setActiveSegment(seg);
          }

          const cat = params.get('categoria');
          const resolvedCat = cat
            ? (resolveCategoria(TAXONOMY, resolvedSeg ?? 'contribuyentes', cat) ?? cat)
            : 'Todas las categorías';
          setActiveCategory(resolvedCat);

          const sub = params.get('subcategoria');
          if (sub && resolvedCat !== 'Todas las categorías') {
            const catNode = TAXONOMY.pillars[resolvedSeg ?? 'contribuyentes']?.find(
              c => c.nombre.toLowerCase() === resolvedCat.toLowerCase() || c.id === cat
            );
            const foundSub = catNode?.subcategorias.find(
              s => s.id === sub || s.nombre.toLowerCase() === sub.toLowerCase() || s.id.endsWith('/' + sub)
            );
            if (foundSub && foundSub.nombre.toLowerCase() !== resolvedCat.toLowerCase() && foundSub.nombre !== '—') {
              setActiveSubcategory(foundSub.nombre);
            } else if (!foundSub && !sub.includes('/') && sub.toLowerCase() !== resolvedCat.toLowerCase() && sub !== '—') {
              setActiveSubcategory(sub);
            } else {
              setActiveSubcategory(null);
            }
          } else {
            setActiveSubcategory(null);
          }

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
      } else if (
        hash.startsWith('#/solicitar-nit') ||
        hash.startsWith('#/primer-nit') ||
        hash.startsWith('#/quiero-ser-contribuyente') ||
        hash === '#/proceso/1' ||
        hash === '#/asistente/primer-nit' ||
        hash === '#/gestion/SAT-GES-0001' ||
        hash === '#/gestion/solicitar-nit'
      ) {
        window.history.replaceState(null, '', '#/solicitar-nit');
        setCurrentView('gestion');
        const found = allTramites.find(t => t.id === 'SAT-GES-0001' || t.codigo === 'SAT-GES-0001');
        if (found) {
          setSelectedTramite(found);
          setActiveSegment('contribuyentes');
          setActiveCategory(found.categoria || 'Sin Obligaciones');
          setActiveSubcategory(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.startsWith('#/actualizar-rtu') ||
        hash.startsWith('#/actualizacion-rtu') ||
        hash === '#/proceso/9' ||
        hash === '#/proceso/10' ||
        hash === '#/gestion/actualizar-rtu'
      ) {
        const targetId = hash === '#/proceso/10' ? 'SAT-GES-0115' : 'SAT-GES-0072';
        window.history.replaceState(null, '', '#/actualizar-rtu');
        setCurrentView('gestion');
        setSelectedTramite(prev => {
          if (prev && (prev.id || prev.codigo || '') in ACTUALIZAR_RTU_CASO_BY_ID) {
            return prev;
          }
          return (
            allTramites.find(t => t.id === targetId || t.codigo === targetId) ||
            allTramites.find(t => t.id === 'SAT-GES-0002' || t.codigo === 'SAT-GES-0002') ||
            null
          );
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/gestion/') || hash.startsWith('#/tramite/')) {
        setCurrentView('gestion');
        const param = hash.split('?')[0].replace('#/gestion/', '').replace('#/tramite/', '').trim();
        const found = allTramites.find(
          t => t.id === param || (t.codigo && t.codigo === param) || toGestionSlug(t) === param
        );
        if (found) {
          const cleanSlug = toGestionSlug(found);
          const targetHash =
            cleanSlug === 'solicitar-nit'
              ? '#/solicitar-nit'
              : cleanSlug === 'actualizar-rtu'
                ? '#/actualizar-rtu'
                : `#/gestion/${cleanSlug}`;
          window.history.replaceState(null, '', targetHash);
          setSelectedTramite(found);
          if (found.pillar) setActiveSegment(found.pillar as SegmentId);
          if (found.categoria) setActiveCategory(found.categoria);
          if (found.subcategoria && found.subcategoria !== '—') {
            setActiveSubcategory(found.subcategoria);
          } else {
            setActiveSubcategory(null);
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/asistente/')) {
        setCurrentView('asistente');
        const asstId = hash.replace('#/asistente/', '').split('?')[0].trim();
        setSelectedAssistantId(asstId || 'primer-nit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/proceso/')) {
        const param = hash.replace('#/proceso/', '').split('?')[0].trim();
        const foundProc = allProcesos.find(p => String(p.no) === param || toProcesoSlug(p) === param);
        const pNo = foundProc ? foundProc.no : 1;
        if (pNo === 1) {
          window.history.replaceState(null, '', '#/solicitar-nit');
          setCurrentView('gestion');
          const found = allTramites.find(t => t.id === 'SAT-GES-0001' || t.codigo === 'SAT-GES-0001');
          if (found) setSelectedTramite(found);
        } else if (pNo === 9 || pNo === 10) {
          const targetId = pNo === 10 ? 'SAT-GES-0115' : 'SAT-GES-0072';
          window.history.replaceState(null, '', '#/actualizar-rtu');
          setCurrentView('gestion');
          const found = allTramites.find(t => t.id === targetId || t.codigo === targetId);
          if (found) setSelectedTramite(found);
        } else {
          if (foundProc) {
            window.history.replaceState(null, '', `#/proceso/${toProcesoSlug(foundProc)}`);
          }
          setCurrentView('proceso');
          setSelectedProcessNo(pNo);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/fel') || hash.startsWith('#/factura-electronica-fel') || hash.startsWith('#/facturacion-electronica')) {
        setCurrentView('fel');
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

  const handleSelectTramite = (t: TramiteItem) => {
    setSelectedTramite(t);
    if (t.pillar) setActiveSegment(t.pillar as SegmentId);
    if (t.categoria) setActiveCategory(t.categoria);
    if (t.subcategoria && t.subcategoria !== '—') {
      setActiveSubcategory(t.subcategoria);
    } else {
      setActiveSubcategory(null);
    }
    setCurrentView('gestion');
    const slug = toGestionSlug(t);
    window.location.hash =
      slug === 'solicitar-nit'
        ? '#/solicitar-nit'
        : slug === 'actualizar-rtu'
          ? '#/actualizar-rtu'
          : `#/gestion/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    setSelectedTramite(null);
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

  const handleSelectBreadcrumb = (level: 'home' | 'segment' | 'category') => {
    if (level === 'home') {
      handleGoHome();
    } else if (level === 'segment') {
      setCurrentView('catalog');
      setSelectedTramite(null);
      setActiveCategory('Todas las categorías');
      setActiveSubcategory(null);
      const params = new URLSearchParams();
      if (activeSegment) params.set('segmento', activeSegment);
      window.location.hash = '#/catalogo?' + params.toString();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (level === 'category') {
      setCurrentView('catalog');
      setSelectedTramite(null);
      setActiveSubcategory(null);
      const params = new URLSearchParams();
      if (activeSegment) params.set('segmento', activeSegment);
      if (activeCategory && activeCategory !== 'Todas las categorías') {
        params.set('categoria', categoriaId(activeSegment, activeCategory));
      }
      window.location.hash = '#/catalogo?' + params.toString();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Cálculo de si la vista actual se encuentra en un Nivel de Contenido (terminal o página final)
  const { isContentLevel, contentLevelItems, contentLevelTitle } = React.useMemo(() => {
    // Si estamos en la página de contenido de una gestión (Nivel 5 / Terminal)
    if (currentView === 'gestion' && selectedTramite) {
      const currentSub = selectedTramite.subcategoria && selectedTramite.subcategoria !== '—'
        ? selectedTramite.subcategoria
        : null;
      const currentCat = selectedTramite.categoria;

      const siblingItems = allTramites.filter(t => {
        if (currentSub) {
          return t.subcategoria === currentSub || t.nivel3 === currentSub;
        }
        return t.categoria === currentCat || t.nivel2 === currentCat;
      });

      return {
        isContentLevel: true,
        contentLevelItems: [...siblingItems].sort(compareCanonicalTramiteOrder),
        contentLevelTitle: currentSub || currentCat || selectedTramite.gestion || 'Opciones del nivel'
      };
    }

    if (currentView === 'solicitar-nit') {
      const items = allTramites.filter(
        t => t.id === 'SAT-GES-0001' || t.id === 'SAT-GES-0011' || ((t.gestion || '').toLowerCase().includes('solicitar') && (t.gestion || '').toLowerCase().includes('nit'))
      );
      return { isContentLevel: true, contentLevelItems: [...items].sort(compareCanonicalTramiteOrder), contentLevelTitle: 'Solicitar NIT en Línea' };
    }

    if (currentView === 'fel') {
      const items = allTramites.filter(
        t => (t.gestion || '').toLowerCase().includes('fel') || (t.gestion || '').toLowerCase().includes('factura')
      );
      return { isContentLevel: true, contentLevelItems: [...items].sort(compareCanonicalTramiteOrder), contentLevelTitle: 'Factura Electrónica en Línea (FEL)' };
    }

    if (currentView === 'catalog' && activeCategory && activeCategory !== 'Todas las categorías') {
      const categoryTramites = allTramites.filter(
        t => t.pillar === activeSegment && (t.nivel2 === activeCategory || t.categoria === activeCategory)
      );

      const distinctSubcategories = Array.from(
        new Set(categoryTramites.map(t => (t.nivel3 && t.nivel3 !== '—' ? t.nivel3 : '').trim()).filter(Boolean))
      );

      // Rama compactada (ej. Sin Obligaciones o Régimen Agropecuario): está en nivel de contenido directo
      if (distinctSubcategories.length <= 1) {
        return {
          isContentLevel: true,
          contentLevelItems: [...categoryTramites].sort(compareCanonicalTramiteOrder),
          contentLevelTitle: activeCategory
        };
      }

      // Si tiene subcategorías y el usuario seleccionó una: está en nivel de contenido
      if (activeSubcategory) {
        const subTramites = categoryTramites.filter(
          t => t.nivel3 === activeSubcategory || t.subcategoria === activeSubcategory
        );
        return {
          isContentLevel: true,
          contentLevelItems: [...subTramites].sort(compareCanonicalTramiteOrder),
          contentLevelTitle: activeSubcategory
        };
      }
    }

    return { isContentLevel: false, contentLevelItems: [], contentLevelTitle: '' };
  }, [currentView, selectedTramite, activeSegment, activeCategory, activeSubcategory, allTramites]);

  return (
    <div 
      className={`min-h-screen bg-white text-slate-800 flex flex-col antialiased transition-all ${getAccessibilityClasses()}`}
      style={{
        fontSize: accSettings.fontSizeStep ? `${100 + accSettings.fontSizeStep * 8}%` : undefined
      }}
    >
      {/* 1. Official Institutional Header con Barra de Navegación Principal */}
      <Header
        onGoHome={handleGoHome}
        onGoStyleGuide={handleGoStyleGuide}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTramite={handleSelectTramite}
        onSelectProceso={(p) => {
          if (p.no === 1) {
            window.location.hash = '#/solicitar-nit';
          } else if (p.no === 9 || p.no === 10) {
            const targetId = p.no === 10 ? 'SAT-GES-0115' : 'SAT-GES-0072';
            const found = allTramites.find(t => t.id === targetId || t.codigo === targetId);
            if (found) setSelectedTramite(found);
            window.location.hash = '#/actualizar-rtu';
          } else {
            window.location.hash = `#/proceso/${toProcesoSlug(p)}`;
          }
        }}
        onOpenAccessibility={() => setAccessibilityModalOpen(true)}
        allTramites={allTramites}
        allProcesos={allProcesos}
        currentView={currentView}
        activeSegment={activeSegment}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onSelectSegment={handleSelectSegment}
        onSelectBreadcrumb={handleSelectBreadcrumb}
        isContentLevel={isContentLevel}
        contentLevelItems={contentLevelItems}
        contentLevelTitle={contentLevelTitle}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            {/* Título de página (accesible; el hero visual lo presenta cada sección) */}
            <h1 className="sr-only">Portal de Gestiones y Servicios de la SAT en línea</h1>

            {/* 2. Fichas de Nivel 1 */}
            <UserSegmentCards
              selectedSegment={null}
              onSelectSegment={handleSelectSegment}
            />

            {/* 3. Rotary Banner (Lámina 10 del PDF Oficial: 3 simultáneos, máx 120 caracteres) */}
            <RotaryBanner />

            {/* 4. Accesos Rápidos (Lámina 11 del PDF Oficial: 7 visibles + 2 en carrusel) */}
            <QuickAccessCarousel
              onSelectQuickAction={(item) => {
                if (item.id === 'cual-es-mi-nit' || item.id === 'consultar-vehiculos' || item.id === 'omisos') {
                  setConsultasModalSegment('contribuyentes');
                } else if (item.id === 'solvencia-fiscal') {
                  const solvencia = allTramites.find(t => t.id === 'SAT-GES-0154' || (t.gestion || t.tramite || '').toLowerCase().includes('solvencia fiscal'));
                  if (solvencia) handleSelectTramite(solvencia);
                } else if (item.id === 'solicitar-nit') {
                  window.location.hash = '#/solicitar-nit';
                } else if (item.id === 'fel') {
                  window.location.hash = '#/fel';
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
              onSelectProceso={(p) => {
                if (p.no === 1) {
                  window.location.hash = '#/solicitar-nit';
                } else if (p.no === 9 || p.no === 10) {
                  const targetId = p.no === 10 ? 'SAT-GES-0115' : 'SAT-GES-0072';
                  const found = allTramites.find(t => t.id === targetId || t.codigo === targetId);
                  if (found) setSelectedTramite(found);
                  window.location.hash = '#/actualizar-rtu';
                } else {
                  window.location.hash = `#/proceso/${toProcesoSlug(p)}`;
                }
              }}
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
              onSelectTramite={handleSelectTramite}
              onBackToHome={handleGoHome}
              onSwitchSegment={(segId) => {
                handleSelectSegment(segId);
              }}
              onCategoryChange={(cat) => {
                setActiveCategory(cat || 'Todas las categorías');
                setActiveSubcategory(null);
              }}
              onSubcategoryChange={(sub) => {
                setActiveSubcategory(sub || null);
              }}
            />
          </main>
        )}

        {currentView === 'gestion' && selectedTramite && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <GestionContentPage
              tramite={selectedTramite}
              allTramites={allTramites}
              onSelectTramite={handleSelectTramite}
              onBackToCatalog={() => {
                setCurrentView('catalog');
                const pillar = (selectedTramite.pillar as SegmentId) || 'contribuyentes';
                const catName = selectedTramite.categoria || 'Todas las categorías';
                const isRealSub = Boolean(
                  selectedTramite.subcategoria &&
                  selectedTramite.subcategoria !== '—' &&
                  selectedTramite.subcategoria.trim().toLowerCase() !== catName.trim().toLowerCase() &&
                  selectedTramite.nivel3 &&
                  selectedTramite.nivel3 !== '—'
                );

                setActiveSegment(pillar);
                setActiveCategory(catName);
                setActiveSubcategory(isRealSub ? selectedTramite.subcategoria! : null);

                const params = new URLSearchParams();
                params.set('segmento', pillar);
                const catId = categoriaId(pillar, catName);
                params.set('categoria', catId);
                if (isRealSub) {
                  params.set('subcategoria', subcategoriaId(catId, selectedTramite.subcategoria!));
                }
                window.location.hash = '#/catalogo?' + params.toString();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoHome={handleGoHome}
              onSelectSegment={handleSelectSegment}
            />
          </main>
        )}

        {currentView === 'solicitar-nit' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <SolicitarNitPage
              onBackToHome={handleGoHome}
              onOpenConsultasNIT={() => setConsultasModalSegment('contribuyentes')}
              onOpenProcesoGuiado={() => {
                window.location.hash = '#/proceso/1';
              }}
            />
          </main>
        )}

        {currentView === 'fel' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <FelPage onBackToHome={handleGoHome} />
          </main>
        )}

        {currentView === 'asistente' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <GuidedAssistantPage
              assistantId={selectedAssistantId}
              onBackToHome={handleGoHome}
              onBackToCatalog={() => {
                setCurrentView('catalog');
                window.location.hash = `#/catalogo?segmento=${activeSegment}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectSegment={handleSelectSegment}
            />
          </main>
        )}

        {currentView === 'proceso' && (
          <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
            <ProcessJourneyPage
              procesoNo={selectedProcessNo}
              onBackToHome={handleGoHome}
              onBackToCatalog={() => {
                setCurrentView('catalog');
                window.location.hash = `#/catalogo?segmento=${activeSegment}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectSegment={handleSelectSegment}
            />
          </main>
        )}
      </div>

      {/* 8. Institutional Footer */}
      <InstitutionalFooter onOpenStyleGuide={handleGoStyleGuide} />

      {/* Modals & Overlays (Solo consultas interactivas y accesibilidad, cero modales de contenido) */}
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

      <VirtualAssistantModal />
    </div>
  );
}
