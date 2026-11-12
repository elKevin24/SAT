import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Search, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import miadData from '../data/miadData.json';

interface ProgramaMiadPageProps {
  onBackToHome: () => void;
  initialTab?: 'aereo' | 'maritimo' | 'fronteras' | 'tecnologia';
}

type TabKey = 'aereo' | 'maritimo' | 'fronteras' | 'tecnologia';

export const ProgramaMiadPage: React.FC<ProgramaMiadPageProps> = ({
  onBackToHome,
  initialTab = 'aereo'
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const rawItems = useMemo(() => {
    switch (activeTab) {
      case 'aereo':
        return miadData.aereo_courier;
      case 'maritimo':
        return miadData.maritimo_vumar;
      case 'fronteras':
        return miadData.infraestructura_fronteras;
      case 'tecnologia':
        return miadData.tecnologia_inspeccion;
      default:
        return miadData.aereo_courier;
    }
  }, [activeTab]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rawItems;
    return rawItems.filter(item =>
      item.titulo_ciudadano.toLowerCase().includes(query) ||
      item.codigo_normativo.toLowerCase().includes(query) ||
      item.descripcion.toLowerCase().includes(query)
    );
  }, [rawItems, searchQuery]);

  return (
    <div className="py-6 bg-white min-h-[80vh] text-slate-800 antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">

        {/* 1. Miga de pan simple */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
          <Breadcrumbs
            includeHome
            onHomeClick={onBackToHome}
            items={[
              { label: 'Comercio Exterior', onClick: onBackToHome },
              { label: 'Programa MIAD', isCurrent: true }
            ]}
          />
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
        </div>

        {/* 2. Título directo */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programa MIAD: Modernización Aduanera
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Instructivos de despacho, guías operativas y normativas técnicas de aduanas.
          </p>
        </div>

        {/* 3. Pestañas simples */}
        <div className="flex gap-6 border-b border-slate-200 text-sm overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('aereo');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'aereo'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Aéreo y Courier ({miadData.aereo_courier.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('maritimo');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'maritimo'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Marítimo VUMAR ({miadData.maritimo_vumar.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('fronteras');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'fronteras'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Fronteras ({miadData.infraestructura_fronteras.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('tecnologia');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tecnologia'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tecnología ({miadData.tecnologia_inspeccion.length})
          </button>
        </div>

        {/* 4. Buscador único */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, código o palabra clave..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>

        {/* 5. Lista limpia de documentos */}
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron documentos con este criterio de búsqueda.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="py-3 px-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {item.titulo_ciudadano}
                    </span>
                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      {item.codigo_normativo}
                    </span>
                  </div>
                </div>

                <a
                  href={item.url_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline shrink-0"
                >
                  {item.url_pdf.endsWith('.pdf') ? (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </>
                  )}
                </a>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
