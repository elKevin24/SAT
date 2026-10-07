import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Users, 
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface PasoItem {
  numero: number;
  accion: string;
  pagina: string;
  ubicacion: string;
  url: string;
}

interface ProcesoGuiado {
  no: number;
  nombre: string;
  audiencia: string;
  etapa: string;
  paraQuien: string;
  categorias: string;
  totalPasos: number;
  totalPaginas: number;
  rutaPasosResumen: string[];
  pasos: PasoItem[];
}

interface GuidedProcessModalProps {
  proceso: ProcesoGuiado | null;
  onClose: () => void;
  onSelectTramiteUrl?: (url: string) => void;
}

export const GuidedProcessModal: React.FC<GuidedProcessModalProps> = ({
  proceso,
  onClose,
  onSelectTramiteUrl
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!proceso) return null;

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const progressPercent = Math.round(
    (Object.values(completedSteps).filter(Boolean).length / Math.max(1, proceso.totalPasos)) * 100
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proceso-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 text-slate-800 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-[#14649B] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shadow-xs">
              <Compass className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 border border-white/20 px-2 py-0.5 rounded text-white">
                  Etapa: {proceso.etapa || 'Proceso Core'}
                </span>
                <span className="text-xs text-sky-100">Audiencia: {proceso.audiencia}</span>
              </div>
              <h2 id="proceso-title" className="text-base sm:text-lg font-bold leading-snug">
                {proceso.nombre}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar guía del proceso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Nielsen H1: State visibility) */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs font-semibold text-slate-700">
            Destinatario: <span className="font-bold text-[#19324B]">{proceso.paraQuien}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-[#14649B]">{progressPercent}% completado</div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#14649B] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ruta oficial de {proceso.totalPasos} pasos recomendados por la SAT:
          </div>

          <div className="space-y-3">
            {proceso.pasos.map((paso, idx) => {
              const isDone = !!completedSteps[paso.numero];

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isDone 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Step Checkbox */}
                    <button
                      onClick={() => toggleStep(paso.numero)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isDone 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                      }`}
                      aria-label={`Marcar paso ${paso.numero} como completado`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : paso.numero}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="text-sm font-bold text-[#19324B]">
                          {paso.accion || `Paso ${paso.numero}`}
                        </div>
                        {paso.ubicacion && (
                          <span className="text-[10px] text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded self-start sm:self-auto">
                            {paso.ubicacion}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        Trámite o página sugerida: <span className="text-slate-800">{paso.pagina}</span>
                      </div>

                      {/* Direct access button */}
                      {paso.url && (
                        <div className="mt-2.5">
                          <a
                            href={paso.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#14649B] hover:underline"
                          >
                            <span>Ir al trámite en línea</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Categorías: {proceso.categorias}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#14649B] text-white rounded-xl text-xs font-bold hover:bg-[#11507C] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
