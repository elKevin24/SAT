import React from 'react';

export type FelTabId = 'hub' | 'emisor' | 'certificadores' | 'tecnica' | 'auditor' | 'faq';

interface FelSubnavProps {
  activeTab: FelTabId;
  onSelectTab: (tab: FelTabId) => void;
}

const TABS: { id: FelTabId; label: string }[] = [
  { id: 'hub', label: 'Inicio FEL' },
  { id: 'emisor', label: 'Habilitación de Emisores' },
  { id: 'certificadores', label: 'Certificadores Autorizados' },
  { id: 'tecnica', label: 'Documentación Técnica' },
  { id: 'auditor', label: 'Auditor de Seguridad' },
  { id: 'faq', label: 'Preguntas Frecuentes' },
];

export const FelSubnav: React.FC<FelSubnavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav aria-label="Subnavegación de Factura Electrónica" className="bg-sat-blanco border-b border-sat-gris sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul ${
                  isActive
                    ? 'bg-[#14649B] text-white shadow-sat-sm'
                    : 'text-sat-texto-suave hover:text-sat-azul hover:bg-sat-fondo-tenue'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
