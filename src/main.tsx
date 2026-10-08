import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import StyleGuide from './design-system/StyleGuide.tsx';
import { PortalFlowPage } from './pages/PortalFlowPage.tsx';
import './index.css';

const STYLEGUIDE_PREFIX = '#/estilo';
const DIAGRAM_PREFIX = '#/diagrama';
const MAPA_PREFIX = '#/mapa';
const FLUJO_PREFIX = '#/flujo';
const ARBOL_PREFIX = '#/arbol';

export const isStyleGuideHash = (hash: string): boolean =>
  hash === STYLEGUIDE_PREFIX || hash.startsWith(`${STYLEGUIDE_PREFIX}/`);

export const isDiagramHash = (hash: string): boolean =>
  hash === DIAGRAM_PREFIX || hash.startsWith(`${DIAGRAM_PREFIX}/`) ||
  hash === MAPA_PREFIX || hash.startsWith(`${MAPA_PREFIX}/`) ||
  hash === FLUJO_PREFIX || hash.startsWith(`${FLUJO_PREFIX}/`) ||
  hash === ARBOL_PREFIX || hash.startsWith(`${ARBOL_PREFIX}/`);

function resolveView(): React.ReactElement {
  const hash = window.location.hash;
  if (isStyleGuideHash(hash)) return <StyleGuide />;
  if (isDiagramHash(hash)) return <PortalFlowPage />;
  return <App />;
}

function Root() {
  const [view, setView] = React.useState(resolveView);

  React.useEffect(() => {
    const onHashChange = () => setView(resolveView());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return view;
}

createRoot(document.getElementById('root')!).render(<Root />);