import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import alzaData from '../data/alzaVehiculosData.json';

interface AlzaImportacionVehiculosPageProps {
  onBackToHome: () => void;
  initialTab?: 'importacion' | 'alzas';
}

export const AlzaImportacionVehiculosPage: React.FC<AlzaImportacionVehiculosPageProps> = ({
  onBackToHome,
  initialTab = 'importacion'
}) => {
  const [activeTab, setActiveTab] = useState<'importacion' | 'alzas'>(initialTab);
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const rawItems = activeTab === 'importacion' ? alzaData.importaciones : alzaData.alzas;

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(rawItems.map(item => String(item.anio))));
    return years.sort((a, b) => Number(b) - Number(a));
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    return rawItems.filter(item => {
      const matchYear = selectedYear === 'todos' || String(item.anio) === selectedYear;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        item.mes.toLowerCase().includes(query) ||
        String(item.anio).includes(query);

      return matchYear && matchSearch;
    });
  }, [rawItems, selectedYear, searchQuery]);

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
              { label: 'Alza e Importación de Vehículos', isCurrent: true }
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
            Alza e Importación de Vehículos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Archivos mensuales de vehículos nacionalizados y rectificaciones de valor aduanero.
          </p>
        </div>

        {/* 3. Pestañas simples */}
        <div className="flex gap-6 border-b border-slate-200 text-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab('importacion');
              setSelectedYear('todos');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium transition-colors cursor-pointer ${
              activeTab === 'importacion'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vehículos Importados
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('alzas');
              setSelectedYear('todos');
              setSearchQuery('');
            }}
            className={`pb-2.5 font-medium transition-colors cursor-pointer ${
              activeTab === 'alzas'
                ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Alzas de Valoración
          </button>
        </div>

        {/* 4. Barra de búsqueda y filtro */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mes o año..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
            />
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Filtrar por año"
            className="px-3 py-1.5 text-xs bg-white rounded-md border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="todos">Todos los años</option>
            {availableYears.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        {/* 5. Lista limpia de descargas */}
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay reportes disponibles con estos criterios.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="py-3 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    {item.mes} {item.anio}
                  </span>
                  <span className="ml-2 text-xs text-slate-400 font-mono">
                    #{item.id}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar ZIP</span>
                </a>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
