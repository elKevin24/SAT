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
  ShieldCheck
} from 'lucide-react';
import { Button } from './ui/Button';

interface TramiteItem {
  id: string;
  pillar: string;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tema?: string;
  subtema?: string;
  nombreActual?: string;
  tramite: string;
  descripcion: string;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  seccionActual?: string;
  url: string;
  nota?: string;
  baseLegal?: string;
  formulario?: string;
  requisitos?: string[];
  pasos?: string[];
}

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

  // Sample or extracted default requirements if not explicit
  const defaultRequirements = [
    'Documento Personal de Identificación (DPI) vigente en original o copia legible.',
    'Estar activo y con datos actualizados en el Registro Tributario Unificado (RTU Digital).',
    'Contar con usuario activo y acceso validado en Agencia Virtual SAT.',
    'No tener declaraciones ni pagos tributarios pendientes de presentar.'
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tramite-title"
    >
      <div 
        className="bg-white rounded-sat-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-sat-gris text-sat-texto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-sat-azul text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 border border-white/20 px-2.5 py-0.5 rounded-full text-white">
                {tramite.pillarName || 'SAT Trámite Oficial'}
              </span>
              <span className="text-xs text-white/80">
                {tramite.categoria}
              </span>
            </div>
            <h2 id="tramite-title" className="text-base sm:text-lg font-bold leading-tight">
              {tramite.tramite}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Cerrar ficha de trámite"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Descripción General */}
          <div className="p-4 rounded-sat-md bg-sat-fondo-tenue border border-sat-gris">
            <h3 className="font-bold text-sat-texto text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sat-azul" /> Propósito y Descripción
            </h3>
            <p className="text-sat-texto-suave leading-relaxed text-xs sm:text-sm">
              {tramite.descripcion}
            </p>
          </div>

          {/* Perfil Destinatario y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-sat-md border border-sat-gris bg-white">
              <span className="font-bold text-sat-texto-suave block mb-0.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-sat-azul" /> ¿A quién va dirigido?
              </span>
              <span className="font-semibold text-sat-texto">
                {tramite.perfilDestinatario || 'Contribuyentes y público en general'}
              </span>
            </div>
            <div className="p-3.5 rounded-sat-md border border-sat-gris bg-white">
              <span className="font-bold text-sat-texto-suave block mb-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#216E39]" /> Sección en el Portal
              </span>
              <span className="font-semibold text-sat-texto">
                {tramite.seccionActual || `${tramite.categoria} › ${tramite.subcategoria}`}
              </span>
            </div>
          </div>

          {/* Checklist de Requisitos Interactivo (Nielsen H6) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sat-texto text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-sat-azul" /> Checklist de Requisitos Previos
              </h3>
              <span className="text-[11px] text-sat-texto-suave">
                Marca los que ya posees
              </span>
            </div>
            
            <div className="space-y-2">
              {requirementsList.map((req, idx) => {
                const isChecked = !!checkedReqs[idx];
                return (
                  <label
                    key={idx}
                    className={`flex w-full items-start gap-2.5 cursor-pointer p-3 rounded-sat-md border transition-colors ${
                      isChecked 
                        ? 'bg-sat-azul/5 border-sat-azul/40' 
                        : 'bg-white border-sat-gris hover:bg-sat-fondo-tenue'
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

          {/* Base Legal y Notas */}
          {(tramite.impactoOImportancia || tramite.nota) && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900">
              <div className="font-bold mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Referencia Normativa y Recomendación:
              </div>
              <p>{tramite.impactoOImportancia || tramite.nota}</p>
            </div>
          )}

        </div>

        {/* Footer with actions */}
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
              <span>Imprimir</span>
            </Button>
          </div>

          {urlValido ? (
            <a
              href={tramite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-sat-azul hover:bg-sat-azul-oscuro text-white text-xs font-bold rounded-sat-md shadow-sat-sm transition-all flex items-center gap-1.5"
            >
              <span>Realizar trámite en línea</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <p className="px-4 py-2 bg-sat-fondo-medio text-sat-texto-suave text-xs font-semibold rounded-sat-md border border-sat-gris flex items-center gap-1.5">
              <span>Trámite disponible en sede de la SAT</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
