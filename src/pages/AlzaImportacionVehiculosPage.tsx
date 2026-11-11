import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  TrendingUp,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Car,
  ShieldAlert,
  Layers,
  Database
} from 'lucide-react';
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
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Obtener lista de items según la pestaña activa
  const rawItems = activeTab === 'importacion' ? alzaData.importaciones : alzaData.alzas;

  // Años disponibles únicos
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(rawItems.map(item => String(item.anio))));
    return years.sort((a, b) => Number(b) - Number(a));
  }, [rawItems]);

  // Meses disponibles
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filtrado reactivo
  const filteredItems = useMemo(() => {
    return rawItems.filter(item => {
      const matchYear = selectedYear === 'todos' || String(item.anio) === selectedYear;
      const matchMonth = selectedMonth === 'todos' || item.mes.toLowerCase() === selectedMonth.toLowerCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.anio).includes(searchQuery);

      return matchYear && matchMonth && matchSearch;
    });
  }, [rawItems, selectedYear, selectedMonth, searchQuery]);

  return (
    <div className="pt-2.5 sm:pt-3.5 pb-12 bg-white min-h-[85vh] text-slate-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Miga de pan y retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <Breadcrumbs
            includeHome
            onHomeClick={onBackToHome}
            items={[
              { label: 'Comercio Exterior', onClick: onBackToHome },
              { label: 'Importadores', onClick: onBackToHome },
              { label: 'Importación y Nacionalización de Vehículos', onClick: onBackToHome },
              { label: 'Alza e Importación de Vehículos', isCurrent: true }
            ]}
          />

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* 2. Encabezado en Lenguaje Ciudadano (ATO Front-loading) */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Datos Abiertos y Transparencia Aduanera
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Actualización Mensual Oficial
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Intendencia de Aduanas · SAT Guatemala
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Alza e Importación de Vehículos: Reportes y Datos Abiertos
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Consulta y descarga los registros mensuales oficiales de vehículos nacionalizados que ingresaron por aduanas y las tablas de rectificación de valor ("alzas") aplicadas por la SAT.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Database className="w-4 h-4 text-sky-600" />
              <span>Formato: <strong className="text-slate-800">ZIP (TXT estructurado con delimitador |)</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Cobertura: <strong className="text-slate-800">2018 a 2026</strong></span>
            </span>
          </div>
        </header>

        {/* 3. Módulo Didáctico Explicativo ATO (¿Qué es cada reporte?) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
              <Car className="w-4 h-4 text-sky-700" />
              <span>¿Qué es el reporte de vehículos importados?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Es el listado consolidado de todos los vehículos que completaron su despacho aduanero y pago de impuestos en el mes. Incluye marca, modelo, aduana de entrada, cilindraje, combustible y valor CIF.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <span>¿Qué es un alza aduanera de vehículos?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Es el ajuste hacia arriba que la autoridad aduanera aplicó al valor declarado en factura, debido a que el precio de compra no coincidió con los valores de referencia del mercado.
            </p>
          </div>
        </div>

        {/* 4. Selector de Pestaña Principal (Tabs) */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('importacion');
              setSelectedYear('todos');
              setSelectedMonth('todos');
            }}
            className={`flex items-center gap-2 py-3 px-5 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'importacion'
                ? 'border-sky-700 text-sky-800 bg-sky-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Vehículos Importados ({alzaData.importaciones.length} períodos)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('alzas');
              setSelectedYear('todos');
              setSelectedMonth('todos');
            }}
            className={`flex items-center gap-2 py-3 px-5 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'alzas'
                ? 'border-sky-700 text-sky-800 bg-sky-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Alzas de Valoración ({alzaData.alzas.length} períodos)</span>
          </button>
        </div>

        {/* 5. Barra de Búsqueda y Filtros */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Buscador de texto */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por mes o año..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>

          {/* Filtros de Año y Mes */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">Año:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
              >
                <option value="todos">Todos los años</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">Mes:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
              >
                <option value="todos">Todos los meses</option>
                {meses.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {(selectedYear !== 'todos' || selectedMonth !== 'todos' || searchQuery !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedYear('todos');
                  setSelectedMonth('todos');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>

        </div>

        {/* 6. Listado de Archivos Mensuales (Grilla de Tarjetas Compactas) */}
        <section aria-label="Lista de descargas oficiales">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-700">
              Mostrando {filteredItems.length} archivos disponibles
            </span>
            <button
              type="button"
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isGuideOpen ? 'Ocultar guía de importación a Excel' : '¿Cómo abrir estos archivos en Excel?'}</span>
            </button>
          </div>

          {/* Guía colapsable de apertura en Excel */}
          {isGuideOpen && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
              <strong className="font-bold text-slate-800 block">
                Instrucciones para abrir los archivos .txt delimitados por barra vertical (|) en Microsoft Excel:
              </strong>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Descarga y descomprime el archivo ZIP en tu computadora.</li>
                <li>Abre una hoja en blanco en Microsoft Excel y ve a la pestaña <strong>Datos</strong> &gt; <strong>Obtener datos</strong> &gt; <strong>Desde texto/CSV</strong>.</li>
                <li>Selecciona el archivo <code>.txt</code> extraído.</li>
                <li>En la ventana del asistente, selecciona como <strong>Delimitador</strong>: <em>Personalizado</em> y escribe el símbolo <code>|</code> (barra vertical).</li>
                <li>Haz clic en <strong>Cargar</strong> para visualizar los datos en columnas independientes (Aduana, Marca, Modelo, Cilindraje, Valor CIF, etc.).</li>
              </ol>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-2">
              <Info className="w-6 h-6 mx-auto text-slate-400" />
              <p className="text-sm font-semibold">No se encontraron archivos con los filtros seleccionados.</p>
              <p className="text-xs">Prueba seleccionando otro año o limpiando la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#DCDCDC] bg-white hover:border-sky-600 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                        {item.mes} {item.anio}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ID: {item.id}
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {activeTab === 'importacion'
                        ? `Reporte de Vehículos Importados - ${item.mes} ${item.anio}`
                        : `Alzas de Importación de Vehículos - ${item.mes} ${item.anio}`}
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {activeTab === 'importacion'
                        ? '17 columnas: Aduana, Modelo, Marca, Línea, Cilindraje, Tonelaje, Valor CIF e Impuestos.'
                        : '15 columnas: Aduana, Modelo, Marca, Línea, Cilindraje, Tonelaje y Alza aplicada.'}
                    </p>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    aria-label={`Descargar archivo de ${item.mes} ${item.anio}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar archivo ZIP oficial</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Navegación Transversal Relacionada (Anti-callejón sin salida ATO) */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Gestiones y Consultas Relacionadas con Vehículos
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <a
              href="#/gestion/inscribir-vehiculos-nuevos-para-importadores"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-600 hover:shadow-sm transition-all block group"
            >
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center justify-between">
                <span>Inscripción de Primeras Placas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Requisitos completos y formularios SAT-8620 y SAT-4041 para inscribir vehículos nuevos.
              </p>
            </a>

            <a
              href="#/gestion/buscador-de-tabla-de-valores-de-vehiculos"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-600 hover:shadow-sm transition-all block group"
            >
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center justify-between">
                <span>Buscador de Tablas de Valores</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Cotizador de valores imponibles e impuestos proyectados antes de comprar o importar.
              </p>
            </a>

            <a
              href="#/gestion/guia-para-comprobar-valor-de-vehiculos-usados"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-600 hover:shadow-sm transition-all block group"
            >
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center justify-between">
                <span>Comprobar Valor Declarado</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Guía técnica para justificar válidamente el valor de factura de vehículos comprados en subastas.
              </p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
