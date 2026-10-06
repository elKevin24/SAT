import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import StyleGuide from './design-system/StyleGuide.tsx';
import './index.css';

/**
 * El styleguide se monta por hash para no agregar un router de dependencias
 * ni tocar App.tsx. Se alcanza en #/estilo.
 */
function resolveView(): React.ReactElement {
  return window.location.hash === '#/estilo' ? <StyleGuide /> : <App />;
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