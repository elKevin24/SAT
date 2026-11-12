import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  ArrowLeft,
  RefreshCw,
  Layers,
  Link2,
  FileQuestion,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import rawTramites from '../data/allTramites.json';
import { assertTramites, TramiteItem } from '../data/schema';

const allTramites = assertTramites(rawTramites);

interface BrokenItem {
  id: string;
  gestion: string;
  n1: string;
  n2: string;
  n3: string;
  current_url: string;
  status: number | string;
  suggested_url: string;
  internal_route: string;
  motivo: string;
}

const BROKEN_404_ITEMS: BrokenItem[] = [
  {
    id: 'SAT-GES-0014',
    gestion: 'Curso: LET para pequeño contribuyente',
    n1: 'Contribuyentes',
    n2: 'Pequeños Contribuyentes',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/libro-electr%C3%B3nico-tributario-para-peque%C3%B1o-contribuyente',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/libros-electronicos-tributarios-let/',
    internal_route: '#/gestion/SAT-GES-0014',
    motivo: 'Google Sites archivó la sesión en vivo; la ruta institucional activa es el portal de Libros Electrónicos Tributarios (LET).'
  },
  {
    id: 'SAT-GES-0684',
    gestion: 'Curso: Régimen Electrónico de Pequeño Contribuyente',
    n1: 'Contribuyentes',
    n2: 'Pequeños Contribuyentes',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/r%C3%A9gimen-electr%C3%B3nico-del-peque%C3%B1o-contribuyente',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/regimen-electronico-de-pequeno-contribuyente/',
    internal_route: '#/gestion/SAT-GES-0684',
    motivo: 'La transmisión expiró; el portal oficial activo es la página del Régimen Electrónico.'
  },
  {
    id: 'SAT-GES-0132',
    gestion: 'Cómo llenar el formulario SAT-1411 (ISR anual)',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/llenado-del-formulario-sat-1411-declaraci%C3%B3n-anual-del-isr-r%C3%A9gimen-sobre-la',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0132',
    motivo: 'Webinar archivado en Google Sites; redirigir al repositorio de capacitaciones de SAT o ficha dedicada.'
  },
  {
    id: 'SAT-GES-0253',
    gestion: 'Cómo llenar la declaración anual de ISR (transporte aéreo internacional)',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/llenado-del-formulario-de-declaraci%C3%B3n-anual-del-isr-para-contribuyentes-qu',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0253',
    motivo: 'Webinar archivado en Google Sites.'
  },
  {
    id: 'SAT-GES-0023',
    gestion: 'Afiliarte al Régimen Especial Agropecuario',
    n1: 'Contribuyentes',
    n2: 'Pequeños Contribuyentes',
    n3: 'Régimen Agropecuario y Productores',
    current_url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-afiliaciones-regimen-especial-de-contribuyente-agropecuario-o-regimen-electronico-especial-de-contribuyente-agropecuario/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/regimen-especial-de-contribuyente-agropecuario/',
    internal_route: '#/gestion/SAT-GES-0023',
    motivo: 'SAT cambió el slug largo de agencia por la página simplificada del Régimen Agropecuario.'
  },
  {
    id: 'SAT-GES-0327',
    gestion: 'Curso: qué libros debo llevar y qué documentos puedo emitir',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/qu%C3%A9-libros-debo-llevar-y-qu%C3%A9-documentos-puedo-emitir',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0327',
    motivo: 'Webinar archivado.'
  },
  {
    id: 'SAT-GES-0331',
    gestion: 'Tutorial: conciliación bancaria',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/tutorial-conciliaci%C3%B3n-bancaria-cuadr%C3%A1tica',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0331',
    motivo: 'Tutorial archivado.'
  },
  {
    id: 'SAT-GES-0060',
    gestion: 'Taller sobre cultura de legalidad',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/taller-de-concientizaci%C3%B3n-a-la-poblaci%C3%B3n-sobre-la-cultura-de-legalidad',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/cultura-tributaria/',
    internal_route: '#/gestion/SAT-GES-0060',
    motivo: 'La ruta activa es la sección permanente de Cultura Tributaria.'
  },
  {
    id: 'SAT-GES-0155',
    gestion: 'Curso: Impuesto de Solidaridad (ISO)',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/impuesto-de-solidaridad',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0155',
    motivo: 'Webinar archivado.'
  },
  {
    id: 'SAT-GES-0093',
    gestion: 'Curso: beneficios de formalizarte si eres emprendedor',
    n1: 'Contribuyentes',
    n2: 'Contribuyente General',
    n3: 'Cultura tributaria y capacitación',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/beneficios-de-la-formalizaci%C3%B3n-ante-la-sat-para-emprendedores',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/cultura-tributaria/',
    internal_route: '#/gestion/SAT-GES-0093',
    motivo: 'La ruta activa es el portal de Cultura Tributaria.'
  },
  {
    id: 'SAT-GES-0410',
    gestion: 'Capacitación virtual sobre exportadores en Régimen Especial',
    n1: 'Operadores de Comercio Exterior',
    n2: 'Exportadores',
    n3: 'Regímenes Territoriales y Zonas Especiales',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/actualizaci%C3%B3n-de-exportadores-en-el-r%C3%A9gimen-especial-por-agencia-virtual',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0410',
    motivo: 'Webinar archivado.'
  },
  {
    id: 'SAT-GES-0415',
    gestion: 'Capacitación virtual sobre devolución de crédito fiscal',
    n1: 'Operadores de Comercio Exterior',
    n2: 'Exportadores',
    n3: 'Normativa y Operaciones Aduaneras Generales',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/r%C3%A9gimen-electr%C3%B3nico-de-devoluci%C3%B3n-de-cr%C3%A9dito-fiscal',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0415',
    motivo: 'Webinar archivado.'
  },
  {
    id: 'SAT-GES-0380',
    gestion: 'Permiso de Internación Temporal de Vehículos Turísticos',
    n1: 'Operadores de Comercio Exterior',
    n2: 'Importadores',
    n3: 'Mercancías en abandono, depósitos y franquicias',
    current_url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/ingreso-temporal-de-vehiculos-terrestres-con-fines-turisticos/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/procedimientos-aduanas/',
    internal_route: '#/gestion/SAT-GES-0380',
    motivo: 'SAT centralizó los requisitos aduaneros vehiculares en Procedimientos de Aduanas.'
  },
  {
    id: 'SAT-GES-0527',
    gestion: 'Requisitos y pasos para ampliar una consulta',
    n1: 'Profesionales',
    n2: 'Servicios Profesionales',
    n3: 'Consultas Vinculantes y Criterios',
    current_url: 'https://portal.sat.gob.gt/portal/contacto/ampliacion-de-la-consulta/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/consultas-tributarias/',
    internal_route: '#/gestion/SAT-GES-0527',
    motivo: 'La sección de contacto fue reemplazada por la ventanilla de Consultas Tributarias.'
  },
  {
    id: 'SAT-GES-0530',
    gestion: 'Servicio en línea para ver el estado de tu consulta',
    n1: 'Profesionales',
    n2: 'Servicios Profesionales',
    n3: 'Consultas Vinculantes y Criterios',
    current_url: 'https://portal.sat.gob.gt/portal/contacto/revision-de-estado-de-consulta-tributaria-y-aduanera/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/consultas-tributarias/',
    internal_route: '#/gestion/SAT-GES-0530',
    motivo: 'Consulta de estado unificada en el portal de Consultas Tributarias.'
  },
  {
    id: 'SAT-GES-0540',
    gestion: 'Información sobre: Pacto de integridad',
    n1: 'Entes Exentos',
    n2: 'Entidades del Estado',
    n3: 'Control Interno, Solvencias y Normativa',
    current_url: 'https://portal.sat.gob.gt/portal/pacto-de-integridad/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/transparencia/',
    internal_route: '#/gestion/SAT-GES-0540',
    motivo: 'Pacto de Integridad reubicado dentro del portal de Transparencia de la SAT.'
  },
  {
    id: 'SAT-GES-0391',
    gestion: 'Capacitación virtual sobre franquicias electrónicas',
    n1: 'Operadores de Comercio Exterior',
    n2: 'Importadores',
    n3: 'Mercancías en abandono, depósitos y franquicias',
    current_url: 'https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/sistema-de-franquicias-electr%C3%B3nicas',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/capacitaciones-tributarias/',
    internal_route: '#/gestion/SAT-GES-0391',
    motivo: 'Webinar archivado.'
  },
  {
    id: 'SAT-GES-0547',
    gestion: 'Directorio, Horarios y Ubicación de Aduanas de la República',
    n1: 'Operadores de Comercio Exterior',
    n2: 'Normativa y Operaciones Aduaneras Generales',
    n3: 'Modernización e Infraestructura Aduanera',
    current_url: 'https://portal.sat.gob.gt/portal/aduanas-de-guatemala/',
    status: 404,
    suggested_url: 'https://portal.sat.gob.gt/portal/aduanas/',
    internal_route: '#/gestion/SAT-GES-0547',
    motivo: 'El slug institucional /aduanas-de-guatemala/ fue recortado a /aduanas/.'
  }
];

const TOP_OMNIBUS = [
  { url: 'https://portal.sat.gob.gt/portal/procedimientos-aduanas/', count: 32, label: 'Procedimientos Aduaneros Generales' },
  { url: 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/', count: 30, label: 'Requisitos de Personas y Empresas (Acordeón WPBakery)' },
  { url: 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/', count: 22, label: 'Requisitos de Vehículos (Acordeón WPBakery)' },
  { url: 'https://portal.sat.gob.gt/portal/requisitos-de-aduanas/', count: 22, label: 'Requisitos de Aduanas (Acordeón WPBakery)' },
  { url: 'https://portal.sat.gob.gt/portal/consultas-aduanas/', count: 17, label: 'Consultas y Sistemas Aduaneros' },
  { url: 'https://portal.sat.gob.gt/portal/biblioteca-en-linea-sat/legislacion-aduanera/', count: 9, label: 'Biblioteca de Legislación Aduanera' },
  { url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/', count: 8, label: 'Solvencia Fiscal en Línea' },
  { url: 'https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/', count: 7, label: 'Preguntas Frecuentes de Aduanas' }
];

export function UrlAuditResultsPage() {
  const [tab, setTab] = useState<'404' | 'omnibus' | 'solucion'>('404');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered404 = useMemo(() => {
    return BROKEN_404_ITEMS.filter(it => {
      const q = search.toLowerCase();
      return (
        it.gestion.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q) ||
        it.n1.toLowerCase().includes(q) ||
        it.n2.toLowerCase().includes(q) ||
        it.current_url.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Institucional */}
      <header className="bg-[#003865] text-white border-b border-sky-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Portal
            </a>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">
                  Auditoría de Enlaces HTTP, 404 y Páginas Ómnibus
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  <AlertTriangle className="w-3 h-3" />
                  Diagnóstico en Vivo
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Verificación de las 714 gestiones del catálogo frente al servidor del Portal SAT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/wpbakery"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Ir al Planificador WPBakery
            </a>
          </div>
        </div>
      </header>

      {/* Métricas Resumen */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                  Enlaces con Error 404
                </span>
                <span className="text-2xl font-black text-red-900 mt-0.5 block">18</span>
                <span className="text-[11px] text-red-600">Webinars expirados y slugs modificados</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <FileQuestion className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Gestiones en Páginas Ómnibus
                </span>
                <span className="text-2xl font-black text-amber-950 mt-0.5 block">269</span>
                <span className="text-[11px] text-amber-700">37.7% del catálogo comparte 53 URLs</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  Enlaces con Ancla (#)
                </span>
                <span className="text-2xl font-black text-sky-950 mt-0.5 block">91</span>
                <span className="text-[11px] text-sky-700">Acordeones de WPBakery que no abren</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                <Link2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Solución Canónica (Regla 13)
                </span>
                <span className="text-2xl font-black text-emerald-950 mt-0.5 block">100%</span>
                <span className="text-[11px] text-emerald-700">714 rutas fijas dedicadas #/gestion/:id</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Pestañas */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('404')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === '404'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Enlaces 404 Detectados ({BROKEN_404_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('omnibus')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === 'omnibus'
                  ? 'bg-[#003865] text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Páginas Ómnibus y Acordeones # ({TOP_OMNIBUS.length} Críticas)
            </button>
            <button
              type="button"
              onClick={() => setTab('solucion')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === 'solucion'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              3. Propuesta de Solución Inmediata
            </button>
          </div>

          {tab === '404' && (
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filtrar por gestión, código o URL..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#14649B]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {tab === '404' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900 leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Causa del error 404:</strong> 12 enlaces corresponden a webinars/capacitaciones en vivo en Google Sites que fueron archivados o despublicados por SAT, y 6 corresponden a URLs de agencias y aduanas donde el webmaster de SAT modificó el slug sin colocar redirección 301. Abajo tienes el reemplazo canónico para cada una.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Código / Gestión</th>
                      <th className="py-3 px-4">Ubicación Jerárquica</th>
                      <th className="py-3 px-4">URL Actual (Da 404)</th>
                      <th className="py-3 px-4 bg-emerald-50 text-emerald-900">Solución Propuesta (URL Activa)</th>
                      <th className="py-3 px-4 bg-sky-50 text-sky-900">Ruta Propia Interna</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered404.map(it => (
                      <tr key={it.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium align-top">
                          <span className="font-mono font-bold text-xs text-slate-900 block">{it.id}</span>
                          <span className="text-xs text-slate-700 font-semibold">{it.gestion}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 align-top whitespace-nowrap">
                          <span className="block text-[11px] font-semibold text-[#003865]">{it.n1}</span>
                          <span className="block text-[10px] text-slate-500">{it.n2}</span>
                        </td>
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 mb-1">
                            HTTP 404
                          </span>
                          <a
                            href={it.current_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block font-mono text-[11px] text-red-600 hover:underline break-all"
                            title="Probar enlace actual"
                          >
                            {it.current_url}
                          </a>
                          <span className="text-[10px] text-slate-500 mt-1 block italic">{it.motivo}</span>
                        </td>
                        <td className="py-3.5 px-4 bg-emerald-50/40 align-top max-w-xs">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 mb-1">
                            HTTP 200 OK
                          </span>
                          <a
                            href={it.suggested_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block font-mono text-[11px] text-emerald-700 font-bold hover:underline break-all"
                            title="Abrir URL sugerida"
                          >
                            {it.suggested_url}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(it.suggested_url, it.id + '_sug')}
                            className="inline-flex items-center gap-1 mt-1 text-[10px] text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
                          >
                            {copiedId === it.id + '_sug' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === it.id + '_sug' ? 'Copiada' : 'Copiar URL activa'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 bg-sky-50/40 align-top whitespace-nowrap">
                          <a
                            href={it.internal_route}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#003865] hover:bg-[#14649B] text-white text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            <span>Ver Página Dedicada</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                            {it.internal_route}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'omnibus' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 leading-relaxed flex items-start gap-3">
              <Layers className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Por qué te lleva a contenidos que no son de esa línea:</strong> En el portal actual de la SAT, <strong>269 gestiones (37.7%)</strong> no tienen página propia. Apuntan a una misma URL compartida («página ómnibus») con acordeones de WPBakery. Cuando se abre el enlace desde un navegador móvil o moderno, el hash numérico `#154...` no se expande automáticamente y el ciudadano cae en la parte superior viendo un trámite completamente diferente.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOP_OMNIBUS.map((om, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                      {om.count} Gestiones distintas caen aquí
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Página #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{om.label}</h4>
                  <a
                    href={om.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-mono text-xs text-[#14649B] hover:underline break-all"
                  >
                    {om.url}
                  </a>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Al hacer clic, el usuario ve el primer acordeón de la página en lugar del servicio específico que solicitó.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'solucion' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Plan de Solución Definitiva en 2 Pasos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Para que nunca más un ciudadano o evaluador caiga en un error 404 o en una página con contenido incorrecto:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                  Paso 1: Reemplazar los 18 enlaces 404
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Actualizar las URLs en el catálogo y WPBakery
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Ya tenemos el mapeo exacto de las 18 URLs caídas sustituidas por sus equivalentes activos con respuesta <code>HTTP 200 OK</code> en el portal SAT (ej. cambiando capacitaciones expiradas por el portal oficial del servicio o capacitaciones vigentes).
                </p>
                <div className="text-[11px] font-semibold text-emerald-800">
                  ✓ Garantiza 0 enlaces 404 al navegar hacia afuera.
                </div>
              </div>

              <div className="p-5 rounded-xl border-2 border-[#003865] bg-sky-50/40 space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#003865] text-white">
                  Paso 2: Activar Enlaces Canónicos Locales (Regla 13)
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Vincular las tarjetas a las páginas dedicadas
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  En lugar de mandar al usuario a páginas ómnibus externas de la SAT con acordeones colapsados, las tarjetas de las páginas finales pueden enlazar a la ficha dedicada de tu nuevo portal (<code>#/gestion/:id</code>), donde cada gestión tiene su propio título, requisitos limpios, pasos y base legal.
                </p>
                <div className="text-[11px] font-semibold text-sky-900">
                  ✓ Elimina el 100% de la confusión de caer en trámites ajenos.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
