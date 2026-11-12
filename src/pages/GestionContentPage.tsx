import React, { useState } from 'react';
import {
  ExternalLink,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Info,
  Clock,
  UserCheck,
  Sparkles,
  BookmarkCheck,
  Phone,
  Building,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Coins,
  FileText
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SolicitarNitPage } from './SolicitarNitPage';
import { ActualizarRtuPage, CasoActualizacionId } from './ActualizarRtuPage';
import { AlzaImportacionVehiculosPage } from './AlzaImportacionVehiculosPage';
import { ProgramaMiadPage } from './ProgramaMiadPage';
import { FelPage, FelTabId } from './FelPage';
import type { TramiteItem } from '../data/schema';
import type { SegmentId } from '../components/UserSegmentCards';

export const FEL_CANONICAL_IDS = new Set([
  'SAT-GES-0319',
  'SAT-GES-0321',
  'SAT-GES-0581',
  'SAT-GES-0616',
]);

export const PROGRAMA_MIAD_IDS = new Set([
  'SAT-GES-0348',
  'SAT-GES-0347',
  'SAT-GES-0341',
  'SAT-GES-0342',
  'SAT-GES-0343',
  'SAT-GES-0349',
  'SAT-GES-0459',
  'SAT-GES-0423',
  'SAT-GES-0713',
  'SAT-GES-0701',
  'SAT-GES-0445',
  'SAT-GES-0541',
  'SAT-GES-0542',
  'SAT-GES-0543',
  'SAT-GES-0544',
  'SAT-GES-0545',
  'SAT-GES-0546',
  'SAT-GES-0548',
  'SAT-GES-0549',
  'SAT-GES-0550',
  'SAT-GES-0551',
  'SAT-GES-0556',
  'SAT-GES-0557'
]);

export const SOLICITAR_NIT_IDS = new Set([
  'SAT-GES-0001',
  'SAT-GES-0049',
  'SAT-GES-0050',
  'SAT-GES-0051',
]);

export const ACTUALIZAR_RTU_CASO_BY_ID: Record<string, CasoActualizacionId> = {
  'SAT-GES-0002': 'domicilio_fiscal',
  'SAT-GES-0040': 'domicilio_fiscal',
  'SAT-GES-0069': 'domicilio_fiscal',
  'SAT-GES-0070': 'domicilio_fiscal',
  'SAT-GES-0071': 'domicilio_fiscal',
  'SAT-GES-0072': 'domicilio_fiscal',
  'SAT-GES-0075': 'domicilio_fiscal',
  'SAT-GES-0076': 'domicilio_fiscal',
  'SAT-GES-0068': 'establecimiento_negocio',
  'SAT-GES-0074': 'establecimiento_negocio',
  'SAT-GES-0054': 'afiliaciones_contador',
  'SAT-GES-0073': 'afiliaciones_contador',
  'SAT-GES-0115': 'persona_juridica',
  'SAT-GES-0118': 'persona_juridica',
};

interface GestionContentPageProps {
  tramite: TramiteItem;
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToCatalog: () => void;
  onGoHome: () => void;
  onSelectSegment?: (segId: SegmentId, category?: string) => void;
  felTab?: FelTabId;
  onFelTabChange?: (tab: FelTabId) => void;
}

export const GestionContentPage: React.FC<GestionContentPageProps> = ({
  tramite,
  allTramites,
  onSelectTramite,
  onBackToCatalog,
  onGoHome,
  onSelectSegment,
  felTab,
  onFelTabChange
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  const canonicalId = tramite.id || tramite.codigo || '';

  // Página Universal Canónica para Solicitar NIT
  if (SOLICITAR_NIT_IDS.has(canonicalId)) {
    return <SolicitarNitPage onBackToHome={onBackToCatalog} />;
  }

  // Página Universal Canónica para Actualizar o Ratificar Datos en el RTU Digital
  if (canonicalId in ACTUALIZAR_RTU_CASO_BY_ID) {
    return (
      <ActualizarRtuPage
        onBackToHome={onBackToCatalog}
        initialCaso={ACTUALIZAR_RTU_CASO_BY_ID[canonicalId]}
      />
    );
  }

  // Página Oficial para Alza e Importación de Vehículos (SAT-GES-0384 y SAT-GES-0383)
  if (canonicalId === 'SAT-GES-0384' || canonicalId === 'SAT-GES-0383') {
    return (
      <AlzaImportacionVehiculosPage
        onBackToHome={onBackToCatalog}
        initialTab={canonicalId === 'SAT-GES-0383' ? 'alzas' : 'importacion'}
      />
    );
  }

  // Página Oficial para Programa MIAD (Modernización Integral Aduanera)
  if (PROGRAMA_MIAD_IDS.has(canonicalId)) {
    const tabMap: Record<string, 'aereo' | 'maritimo' | 'fronteras' | 'tecnologia'> = {
      'SAT-GES-0341': 'aereo',
      'SAT-GES-0342': 'aereo',
      'SAT-GES-0343': 'aereo',
      'SAT-GES-0349': 'aereo',
      'SAT-GES-0459': 'aereo',
      'SAT-GES-0423': 'tecnologia',
      'SAT-GES-0541': 'fronteras',
      'SAT-GES-0542': 'fronteras',
      'SAT-GES-0543': 'fronteras',
      'SAT-GES-0544': 'fronteras',
      'SAT-GES-0545': 'fronteras',
      'SAT-GES-0546': 'fronteras',
      'SAT-GES-0548': 'tecnologia',
      'SAT-GES-0549': 'tecnologia',
      'SAT-GES-0550': 'tecnologia',
      'SAT-GES-0551': 'tecnologia'
    };
    return (
      <ProgramaMiadPage
        onBackToHome={onBackToCatalog}
        initialTab={tabMap[canonicalId] || 'aereo'}
      />
    );
  }

  // Página Oficial Canónica para Factura Electrónica en Línea (FEL)
  if (FEL_CANONICAL_IDS.has(canonicalId)) {
    return (
      <FelPage
        onBackToHome={onBackToCatalog}
        activeTab={felTab}
        onTabChange={onFelTabChange}
      />
    );
  }

  const targetUrl = tramite.nueva_url || tramite.url;
  const urlValido = typeof targetUrl === 'string' && /^https?:\/\/\S+$/i.test(targetUrl.trim());

  const handleCopyLink = () => {
    if (urlValido) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const defaultRequirements = [
    'Documento Personal de Identificación (DPI) vigente en original o copia legible.',
    'Estar activo y con datos actualizados en el Registro Tributario Unificado (RTU Digital).',
    'Contar con usuario activo y contraseña validada en Agencia Virtual SAT.',
    'No tener omisiones ni declaraciones tributarias pendientes ante la SAT.'
  ];

  const requirementsList = (tramite.requisitos && tramite.requisitos.length > 0)
    ? tramite.requisitos
    : defaultRequirements;

  const toggleReq = (idx: number) => {
    setCheckedReqs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getPlataformaSugerida = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes('declaraguate')) return 'Sistema Declaraguate';
    if (u.includes('portal.sat.gob.gt') || u.includes('agenciavirtual')) return 'Agencia Virtual SAT';
    if (u.includes('portal.sat.gob.gt/portal/verificador')) return 'Verificador Público SAT';
    return 'Portal Oficial SAT';
  };

  const plataformaDestino = urlValido ? getPlataformaSugerida(targetUrl) : 'Agencia u Oficina Tributaria Presencial';

  return (
    <div className="pt-2.5 sm:pt-3.5 pb-8 bg-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Barra superior de navegación y migas de pan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <Breadcrumbs
            includeHome
            onHomeClick={onGoHome}
            items={[
              {
                label: tramite.pillarName || 'Contribuyentes',
                onClick: () => onSelectSegment?.(tramite.pillar as SegmentId),
              },
              ...(tramite.categoria
                ? [
                    {
                      label: tramite.categoria,
                      onClick: onBackToCatalog,
                    },
                  ]
                : []),
              ...(tramite.subcategoria &&
                  tramite.subcategoria !== '—' &&
                  tramite.subcategoria.trim().toLowerCase() !== (tramite.categoria || '').trim().toLowerCase()
                ? [
                    {
                      label: tramite.subcategoria,
                      onClick: onBackToCatalog,
                    },
                  ]
                : []),
              {
                label: tramite.gestion || tramite.tramite || 'Gestión Oficial',
                isCurrent: true,
              },
            ]}
          />

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* Encabezado Principal de la Página de Contenido (Sin códigos en títulos) */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full">
              {tramite.categoria}
            </span>
            {tramite.tipoInteraccion && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {tramite.tipoInteraccion === 'servicio_transaccional' && 'Gestión en Línea'}
                {tramite.tipoInteraccion === 'consulta_datos' && 'Consulta Pública'}
                {tramite.tipoInteraccion === 'guia_informativa' && 'Guía Operativa'}
                {tramite.tipoInteraccion === 'descarga_recurso' && 'Descarga Oficial'}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              {urlValido ? 'Servicio digital 24/7' : 'Atención presencial / mixta'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {tramite.gestion || tramite.tramite || tramite.nombreActual}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {tramite.descripcion}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>Dirigido a: <strong className="text-slate-800">{tramite.perfilDestinatario || 'Contribuyentes y ciudadanía en general'}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Modalidad: <strong className="text-slate-800">{urlValido ? 'En Línea' : 'Presencial en Agencias'}</strong></span>
            </span>
            {tramite.tiempoEstimado && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Tiempo de respuesta: <strong className="text-slate-800">{tramite.tiempoEstimado}</strong></span>
              </span>
            )}
            {tramite.costo && (
              <span className="inline-flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Costo: <strong className="text-slate-800">{tramite.costo}</strong></span>
              </span>
            )}
          </div>

          {tramite.advertencia && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="font-bold text-amber-900 mr-1.5">Recomendación clave:</strong>
                <span>{tramite.advertencia}</span>
              </div>
            </div>
          )}
        </header>

        {/* Tarjeta de Acción Primaria */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
              Canal de Atención Oficial
            </span>
            <h2 className="text-lg font-bold text-white">
              {plataformaDestino}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              {urlValido
                ? 'Accede al sistema oficial de la SAT para iniciar o consultar tu gestión de manera inmediata y segura.'
                : 'Esta gestión se atiende en oficinas o agencias tributarias SAT. Revisa requisitos y programa tu cita.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {['SAT-GES-0001', 'SAT-GES-0002', 'SAT-GES-0011', 'SAT-GES-0025'].includes(tramite.id) && (
              <button
                type="button"
                onClick={() => {
                  const map: Record<string, string> = {
                    'SAT-GES-0001': 'primer-nit',
                    'SAT-GES-0002': 'agencia-virtual',
                    'SAT-GES-0011': 'pequeno-contribuyente',
                    'SAT-GES-0025': 'e-traspaso',
                  };
                  const asstId = map[tramite.id] || 'primer-nit';
                  window.location.hash = `#/asistente/${asstId}`;
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Iniciar con Asistente Guiado</span>
              </button>
            )}

            {urlValido && (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
              >
                <span>Iniciar gestión en línea</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-colors"
              title="Imprimir esta ficha de gestión"
              aria-label="Imprimir guía"
            >
              <Printer className="w-4 h-4" />
            </button>

            {urlValido && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-colors"
                title="Copiar enlace de acceso oficial"
                aria-label="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Estructura de Contenido en 3 Pasos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Columna Principal (2 columnas): Paso a Paso y Requisitos */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Paso 1: Requisitos previos interactivos */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Paso 1: Qué necesitas (Requisitos Previos)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-600">
                  Verifica tu documentación
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {requirementsList.map((req, idx) => {
                  const isChecked = !!checkedReqs[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex w-full items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-sky-50/50 border-sky-300 text-slate-900 font-medium'
                          : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleReq(idx)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-sky-700 rounded"
                      />
                      <span className="text-xs sm:text-sm leading-relaxed">
                        {req}
                      </span>
                    </label>
                  );
                })}
              </div>

              {tramite.documentos && tramite.documentos.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-700" />
                    Documentos de soporte obligatorios:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-2">
                    {tramite.documentos.map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Paso 2: Procedimiento de Ingreso y Carga */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Paso 2: Cómo realizar la gestión (Paso a Paso)
                </h2>
              </div>

              <div className="space-y-2.5 pt-1">
                {tramite.pasos && tramite.pasos.length > 0 ? (
                  tramite.pasos.map((paso, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed"
                    >
                      <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="flex-1">{paso}</p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>
                      1. Ingresa a la plataforma oficial ({plataformaDestino}) con tu usuario de Agencia Virtual o credenciales autorizadas.
                    </p>
                    <p>
                      2. Localiza el formulario digital correspondiente a esta gestión y completa los datos requeridos sin abreviaturas.
                    </p>
                    <p>
                      3. Adjunta los documentos verificados en el Paso 1 en formato PDF o imagen legible, según las especificaciones del sistema.
                    </p>
                    <p>
                      4. Confirma el envío y guarda el número de expediente o gestión generado para consultas posteriores.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Paso 3: Resolución y Constancia */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Paso 3: Qué obtienes al finalizar
                </h2>
              </div>

              {tramite.resultadoObtenido ? (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <strong className="font-bold text-emerald-900 block">Documento o resolución oficial:</strong>
                    <p className="text-emerald-800 leading-relaxed">{tramite.resultadoObtenido}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Una vez procesada la gestión por el área técnica de la SAT, recibirás la notificación electrónica con tu constancia, resolución o distintivo digital habilitante en tu buzón de Agencia Virtual y correo registrado.
                </p>
              )}
            </section>

            {/* Base Legal y Normativa */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-sky-700" />
                  <span>Base Legal y Fundamento Normativo</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                  className="text-xs font-semibold text-sky-700 hover:underline"
                >
                  {isLegalExpanded ? 'Ocultar' : 'Consultar'}
                </button>
              </div>

              {isLegalExpanded ? (
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  {tramite.baseLegal ? (
                    <p>• <strong>Fundamento específico:</strong> {tramite.baseLegal}</p>
                  ) : null}
                  <p>• <strong>Código Aduanero Uniforme Centroamericano (CAUCA IV) y su Reglamento (RECAUCA IV):</strong> Régimen aduanero y operaciones de comercio exterior.</p>
                  <p>• <strong>Código Tributario (Decreto 6-91):</strong> Normas generales y derechos de los contribuyentes.</p>
                  <p>• <strong>Ley Orgánica de la SAT (Decreto 1-98):</strong> Competencias y facultades de administración tributaria y aduanera.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  {tramite.baseLegal
                    ? `Regulado bajo: ${tramite.baseLegal}`
                    : 'Regulada bajo el marco de la legislación tributaria y aduanera vigente en la República de Guatemala.'}
                </p>
              )}
            </section>
          </div>

          {/* Columna Lateral (1 columna): Canales de Asistencia */}
          <div className="space-y-6">

            {/* Canales de Asistencia */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-700" />
                <span>Canales de Asistencia SAT</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Call Center 1550</strong>
                    <span>Lunes a viernes de 8:00 a 16:30 horas</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Agencias Tributarias</strong>
                    <span>Atención presencial a nivel nacional</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
