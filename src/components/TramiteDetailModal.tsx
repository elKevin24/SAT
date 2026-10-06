import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Printer, 
  BookOpen, 
  FileText, 
  UserCheck, 
  Info, 
  CheckSquare, 
  Square,
  ShieldCheck
} from 'lucide-react';

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 text-slate-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#14649B] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-sky-100">
                {tramite.pillarName || 'SAT Trámite Oficial'}
              </span>
              <span className="text-xs text-sky-100">
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#14649B]" /> Propósito y Descripción
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {tramite.descripcion}
            </p>
          </div>

          {/* Perfil Destinatario y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#14649B]" /> ¿A quién va dirigido?
              </span>
              <span className="font-semibold text-slate-800">
                {tramite.perfilDestinatario || 'Contribuyentes y público en general'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sección en el Portal
              </span>
              <span className="font-semibold text-slate-800">
                {tramite.seccionActual || `${tramite.categoria} › ${tramite.subcategoria}`}
              </span>
            </div>
          </div>

          {/* Checklist de Requisitos Interactivo (Nielsen H6) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#14649B]" /> Checklist de Requisitos Previos
              </h3>
              <span className="text-[11px] text-slate-500">
                Marca los que ya posees
              </span>
            </div>
            
            <div className="space-y-2">
              {requirementsList.map((req, idx) => {
                const isChecked = !!checkedReqs[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleReq(idx)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
                      isChecked 
                        ? 'bg-blue-50/60 border-blue-300 text-slate-800' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-[#14649B]">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#14649B]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={`text-xs ${isChecked ? 'font-semibold text-slate-900' : ''}`}>
                      {req}
                    </span>
                  </button>
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
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {urlValido && (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
            </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          </div>

          {urlValido ? (
            <a
              href={tramite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#14649B] hover:bg-[#11507C] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Realizar trámite en línea</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <p className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5">
              <span>Trámite disponible en sede de la SAT</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
