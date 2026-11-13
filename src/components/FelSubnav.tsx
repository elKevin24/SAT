import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type FelTabId = 'hub' | 'emisor' | 'certificadores' | 'tecnica' | 'auditor' | 'faq';

interface FelSubnavProps {
  activeTab: FelTabId;
  onSelectTab: (tab: FelTabId) => void;
}

const TABS: { id: FelTabId; label: string }[] = [
  { id: 'hub', label: 'Inicio Factura Electrónica (FEL)' },
  { id: 'emisor', label: 'Habilitación de emisores' },
  { id: 'certificadores', label: 'Certificadores autorizados' },
  { id: 'tecnica', label: 'Documentación técnica' },
  { id: 'auditor', label: 'Auditor de seguridad' },
  { id: 'faq', label: 'Preguntas frecuentes' },
];

/**
 * Menú lateral vertical estilo ATO (Australian Taxation Office):
 * - Desktop (>= 1024px): Lista editorial limpia con barra vertical izquierda en el ítem activo y divisores finos.
 * - Mobile (< 1024px): Acordeón colapsable "En esta sección" para no desplazar el contenido principal.
 */
export const FelSubnav: React.FC<FelSubnavProps> = ({ activeTab, onSelectTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: FelTabId) => {
    onSelectTab(id);
    setMobileOpen(false);
  };

  return (
    <aside
      aria-label="Navegación de Factura Electrónica (FEL)"
      className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4"
    >
      <nav className="bg-sat-blanco border border-sat-gris rounded-lg overflow-hidden">
        {/* Cabecera fija en Desktop / Botón acordeón en Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="fel-side-nav-list"
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 text-left font-bold text-sm text-sat-azul-oscuro border-b border-sat-gris min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
        >
          <span>En esta sección</span>
          <ChevronDown
            className={`w-4 h-4 text-sat-azul transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        <div className="hidden lg:block px-4 py-3 border-b-2 border-[#14649B]">
          <span className="text-xs font-black uppercase tracking-wider text-sat-azul-oscuro">
            En esta sección
          </span>
        </div>

        <ul
          id="fel-side-nav-list"
          className={`${mobileOpen ? 'block' : 'hidden'} lg:block divide-y divide-sat-gris/70`}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-4 py-3 text-xs sm:text-sm transition-colors min-h-[44px] flex items-center border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sat-azul ${
                    isActive
                      ? 'border-[#14649B] bg-[#14649B]/5 text-[#14649B] font-bold'
                      : 'border-transparent text-sat-texto-suave hover:text-sat-azul-oscuro hover:bg-sat-fondo-tenue hover:border-sat-gris font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
