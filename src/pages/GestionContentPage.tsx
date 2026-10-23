import React, { useState } from 'react';
import {
  ExternalLink,
  Printer,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  Info,
  Clock,
  UserCheck,
  Sparkles,
  BookmarkCheck,
  Phone,
  Building,
  HelpCircle
} from 'lucide-react';
import type { TramiteItem } from '../data/schema';
import type { SegmentId } from '../components/UserSegmentCards';

interface GestionContentPageProps {
  tramite: TramiteItem;
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToCatalog: () => void;
  onGoHome: () => void;
  onSelectSegment?: (segId: SegmentId, category?: string) => void;
}

export const GestionContentPage: React.FC<GestionContentPageProps> = ({
  tramite,
  allTramites,
  onSelectTramite,
  onBackToCatalog,
  onGoHome,
  onSelectSegment
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  const urlValido = typeof tramite.url === 'string' && /^https?:\/\/\S+$/i.test(tramite.url.trim());

  const handleCopyLink = () => {
    if (urlValido) {
      navigator.clipboard.writeText(tramite.url);
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

  const plataformaDestino = urlValido ? getPlataformaSugerida(tramite.url) : 'Agencia u Oficina Tributaria Presencial';

  // Gestiones hermanas para la sección oficial "En esta sección"
  const siblingTramites = React.useMemo(() => {
    const currentSub = tramite.subcategoria && tramite.subcategoria !== '—' ? tramite.subcategoria : null;
    const currentCat = tramite.categoria;

    return allTramites.filter(t => {
      if (t.id === tramite.id) return false;
      if (currentSub) {
        return t.subcategoria === currentSub || t.nivel3 === currentSub;
      }
      return t.categoria === currentCat || t.nivel2 === currentCat;
    }).slice(0, 8);
  }, [allTramites, tramite]);

  return (
    <div className="bg-white min-h-[80vh] py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Barra superior de navegación y migas de pan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <nav aria-label="Migas de pan" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
            <button
              type="button"
              onClick={onGoHome}
              className="hover:text-sky-700 transition-colors font-medium"
            >
              Inicio
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <button
              type="button"
              onClick={() => onSelectSegment?.(tramite.pillar as SegmentId)}
              className="hover:text-sky-700 transition-colors font-medium"
            >
              {tramite.pillarName || 'Contribuyentes'}
            </button>
            {tramite.categoria && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                <button
                  type="button"
                  onClick={onBackToCatalog}
                  className="hover:text-sky-700 transition-colors font-medium"
                >
                  {tramite.categoria}
                </button>
              </>
            )}
            {tramite.subcategoria && tramite.subcategoria !== '—' && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="text-slate-800 font-semibold truncate max-w-[200px]">
                  {tramite.subcategoria}
                </span>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors self-start sm:self-auto cursor-pointer"
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
          </div>
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
            {urlValido && (
              <a
                href={tramite.url}
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
                    Paso 1: Reúne los Requisitos Previos
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
            </section>

            {/* Paso 2: Procedimiento de Ingreso y Carga */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Paso 2: Realiza el Trámite en el Canal Correspondiente
                </h2>
              </div>

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
            </section>

            {/* Paso 3: Resolución y Constancia */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Paso 3: Obtén tu Constancia o Documento Oficial
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Una vez procesada la gestión por el área técnica de la SAT, recibirás la notificación electrónica con tu constancia, resolución o distintivo digital habilitante en tu buzón de Agencia Virtual y correo registrado.
              </p>
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
                  <p>• <strong>Código Tributario (Decreto 6-91):</strong> Normas generales y derechos de los contribuyentes.</p>
                  <p>• <strong>Ley Orgánica de la SAT (Decreto 1-98):</strong> Competencias y facultades de administración tributaria y aduanera.</p>
                  <p>• <strong>Resoluciones de Directorio SAT:</strong> Normativa específica aplicable a {tramite.categoria}.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Regulada bajo el marco de la legislación tributaria y aduanera vigente en la República de Guatemala.
                </p>
              )}
            </section>
          </div>

          {/* Columna Lateral (1 columna): "En esta sección" (Regla de contenido) + Canales */}
          <div className="space-y-6">
            
            {/* Bloque Oficial: En esta sección (Solo en páginas de contenido según Regla 2) */}
            {siblingTramites.length > 0 && (
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <BookmarkCheck className="w-4 h-4 text-sky-700" />
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    En esta sección: {tramite.subcategoria || tramite.categoria}
                  </h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {siblingTramites.map((sibling) => (
                    <li key={sibling.id}>
                      <button
                        type="button"
                        onClick={() => onSelectTramite(sibling)}
                        className="w-full text-left py-2 px-1 text-xs text-slate-700 hover:text-sky-700 hover:bg-slate-50 rounded-md transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="line-clamp-2 leading-snug group-hover:translate-x-0.5 transition-transform">
                          {sibling.gestion || sibling.tramite}
                        </span>
                        <span className="text-slate-300 group-hover:text-sky-600 text-xs shrink-0 ml-1">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
