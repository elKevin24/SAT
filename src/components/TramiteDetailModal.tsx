import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Printer, 
  BookOpen, 
  Info, 
  UserCheck, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import type { TramiteItem } from '../data/schema';

interface TramiteDetailModalProps {
  tramite: TramiteItem | null;
  onClose: () => void;
}

export const TramiteDetailModal: React.FC<TramiteDetailModalProps> = ({
  tramite,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  if (!tramite) return null;

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

  // Requisitos estructurados estándar si no vienen definidos
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

  // Detectar plataforma o sistema de atención sugerido
  const getPlataformaSugerida = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes('declaraguate')) return 'Sistema Declaraguate';
    if (u.includes('portal.sat.gob.gt') || u.includes('agenciavirtual')) return 'Agencia Virtual SAT';
    if (u.includes('portal.sat.gob.gt/portal/verificador')) return 'Verificador Público SAT';
    return 'Portal Oficial SAT';
  };

  const plataformaDestino = urlValido ? getPlataformaSugerida(tramite.url) : 'Agencia u Oficina Tributaria Presencial';

  return (
    <Modal
      open={!!tramite}
      onClose={onClose}
      ariaLabelledBy="tramite-title"
      maxWidth="max-w-2xl"
      hideHeader
      panelClassName="p-0 overflow-hidden rounded-sat-lg border border-sat-gris text-sat-texto flex flex-col max-h-[90vh]"
    >
      {/* Cabecera Institucional Accesible */}
      <div className="bg-sat-azul text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 border border-white/20 px-2.5 py-0.5 rounded-full text-white">
              {tramite.pillarName || 'SAT Trámite Oficial'}
            </span>
            <span className="text-xs text-white/90 font-medium">
              Área temática: {tramite.categoria}
            </span>
          </div>
          <h2 id="tramite-title" className="text-base sm:text-lg font-bold leading-tight">
            {tramite.tramite}
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-hidden focus:ring-2 focus:ring-white"
          aria-label="Cerrar ficha de trámite"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cuerpo de la Ficha en Pasos Cronológicos (Lenguaje Ciudadano) */}
      <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
        
        {/* Resumen del Trámite */}
        <div className="p-4 rounded-sat-md bg-sat-fondo-tenue border border-sat-gris space-y-2">
          <h3 className="font-bold text-sat-texto text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sat-azul shrink-0" /> Propósito y Descripción
          </h3>
          <p className="text-sat-texto-suave leading-relaxed text-xs sm:text-sm">
            {tramite.descripcion}
          </p>
          <div className="pt-2 border-t border-sat-gris/60 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-sat-texto font-medium">
              <UserCheck className="w-3.5 h-3.5 text-sat-azul" /> 
              Dirigido a: <strong className="font-semibold text-sat-texto">{tramite.perfilDestinatario || 'Personas y contribuyentes'}</strong>
            </span>
            <span className="flex items-center gap-1 text-sat-texto-suave">
              <Clock className="w-3.5 h-3.5 text-sat-azul" />
              Modalidad: <strong className="font-semibold text-sat-texto">{urlValido ? 'En Línea' : 'Presencial'}</strong>
            </span>
          </div>
        </div>

        {/* Flujo Cronológico de 3 Pasos */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-sat-azul flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Flujo Secuencial para Completar la Gestión
          </h3>

          {/* PASO 1: Requisitos Previos y Documentación */}
          <div className="p-4 rounded-sat-md border border-sat-gris bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sat-azul text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="font-bold text-sat-texto text-xs sm:text-sm">
                  Paso 1: Reúne los Requisitos Previos
                </h4>
              </div>
              <span className="text-[11px] text-sat-texto-suave font-medium">
                Marca lo que ya posees
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {requirementsList.map((req, idx) => {
                const isChecked = !!checkedReqs[idx];
                return (
                  <label
                    key={idx}
                    className={`flex w-full items-start gap-2.5 cursor-pointer p-2.5 rounded-sat-md border transition-colors ${
                      isChecked 
                        ? 'bg-sat-azul/5 border-sat-azul/40' 
                        : 'bg-sat-fondo-tenue/50 border-sat-gris hover:bg-sat-fondo-tenue'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleReq(idx)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#14649B]"
                    />
                    <span className={`text-xs leading-relaxed ${isChecked ? 'font-semibold text-sat-texto' : 'text-sat-texto-suave'}`}>
                      {req}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* PASO 2: Canal de Atención e Inicio del Trámite */}
          <div className="p-4 rounded-sat-md border border-sat-gris bg-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sat-azul text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h4 className="font-bold text-sat-texto text-xs sm:text-sm">
                Paso 2: Inicia la Gestión en el Sistema Oficial
              </h4>
            </div>
            
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Ingresa al canal correspondiente para completar los formularios y cargar la documentación requerida.
            </p>

            {urlValido ? (
              <div className="p-3 rounded-sat-md bg-sat-azul/5 border border-sat-azul/20 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-sat-azul uppercase tracking-wider block">
                    Canal Digital Oficial
                  </span>
                  <span className="text-xs font-semibold text-sat-texto">
                    {plataformaDestino}
                  </span>
                </div>
                <a
                  href={tramite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sat-azul hover:bg-sat-azul-oscuro text-white text-xs font-bold rounded-sat-md shadow-sat-sm transition-all inline-flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-sat-azul"
                >
                  <span>Iniciar Trámite Ahora</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="p-3 rounded-sat-md bg-sat-fondo-medio border border-sat-gris text-xs text-sat-texto-suave">
                Este servicio se gestiona presencialmente en Agencias u Oficinas Tributarias de la SAT. Recuerda agendar cita previa si es requerida.
              </div>
            )}
          </div>

          {/* PASO 3: Seguimiento y Constancia Electrónica */}
          <div className="p-4 rounded-sat-md border border-sat-gris bg-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sat-azul text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h4 className="font-bold text-sat-texto text-xs sm:text-sm">
                Paso 3: Descarga tu Constancia o Resolución
              </h4>
            </div>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Al finalizar la gestión, el sistema emitirá tu constancia electrónica oficial con código de verificación QR o enviará la resolución a tu correo registrado en Agencia Virtual.
            </p>
          </div>
        </div>

        {/* Sección Secundaria Colapsable: Fundamento Normativo y Base Legal */}
        <div className="rounded-sat-md border border-sat-gris overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setIsLegalExpanded(!isLegalExpanded)}
            className="w-full px-4 py-3 bg-sat-fondo-tenue hover:bg-sat-fondo-medio text-left flex items-center justify-between gap-2 transition-colors focus:outline-hidden focus:bg-sat-fondo-medio"
            aria-expanded={isLegalExpanded}
          >
            <span className="font-bold text-xs text-sat-texto flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sat-azul" />
              Fundamento Normativo y Base Legal
            </span>
            {isLegalExpanded ? (
              <ChevronUp className="w-4 h-4 text-sat-texto-suave" />
            ) : (
              <ChevronDown className="w-4 h-4 text-sat-texto-suave" />
            )}
          </button>

          {isLegalExpanded && (
            <div className="p-4 bg-white border-t border-sat-gris space-y-2 text-xs">
              <div className="text-sat-texto leading-relaxed">
                <span className="font-semibold block mb-0.5">Marco Jurídico Aplicable:</span>
                <p className="text-sat-texto-suave">
                  {tramite.baseLegal || 'Código Tributario (Decreto 6-91 del Congreso de la República de Guatemala) y normativa institucional vigente de la SAT.'}
                </p>
              </div>

              {(tramite.impactoOImportancia || tramite.nota) && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 mt-2">
                  <span className="font-bold block mb-0.5">Nota de Cumplimiento:</span>
                  <p>{tramite.impactoOImportancia || tramite.nota}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Footer con Acciones Accesibles */}
      <div className="bg-sat-fondo-tenue px-6 py-3.5 border-t border-sat-gris flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {urlValido && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              aria-live="polite"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#216E39]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir ficha</span>
          </Button>
        </div>

        {urlValido ? (
          <a
            href={tramite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-sat-azul hover:bg-sat-azul-oscuro text-white text-xs font-bold rounded-sat-md shadow-sat-sm transition-all flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-sat-azul"
          >
            <span>Ir a {plataformaDestino}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <p className="px-4 py-2 bg-sat-fondo-medio text-sat-texto-suave text-xs font-semibold rounded-sat-md border border-sat-gris flex items-center gap-1.5">
            <span>Atención en sede SAT</span>
          </p>
        )}
      </div>
    </Modal>
  );
};
