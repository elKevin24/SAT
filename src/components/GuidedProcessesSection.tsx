import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Filter,
  Users
} from 'lucide-react';

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
  pasos: any[];
}

interface GuidedProcessesSectionProps {
  procesos: ProcesoGuiado[];
  onSelectProceso: (proceso: ProcesoGuiado) => void;
}

export const GuidedProcessesSection: React.FC<GuidedProcessesSectionProps> = ({
  procesos,
  onSelectProceso
}) => {
  const [activeStage, setActiveStage] = useState<string>('Todos');

  const stages = ['Todos', 'Empezar', 'Cumplir', 'Cambiar', 'Cesar/Cerrar'];

  const filtered = activeStage === 'Todos'
    ? procesos
    : procesos.filter(p => p.etapa && p.etapa.toLowerCase().includes(activeStage.toLowerCase().split('/')[0]));

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" /> Procesos Core Guiados
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#19324B] tracking-tight">
              Rutas y Ciclos de Vida del Contribuyente
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guías paso a paso para resolver tus trámites sin perderte entre normas o requisitos.
            </p>
          </div>

          {/* Stage filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto no-scrollbar shadow-2xs">
            {stages.map((stg) => {
              const isActive = activeStage === stg;
              return (
                <button
                  key={stg}
                  onClick={() => setActiveStage(stg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#14649B] text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {stg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 9).map((p) => (
            <div
              key={p.no}
              onClick={() => onSelectProceso(p)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7] p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100">
                    {p.etapa || 'Proceso Core'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {p.totalPasos} pasos
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-[#0284C7] transition-colors leading-snug mb-1.5">
                  {p.nombre}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                  <span className="font-semibold text-slate-700">Para:</span> {p.paraQuien}
                </p>

                {/* Micro preview of steps */}
                {p.rutaPasosResumen && p.rutaPasosResumen.length > 0 && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                    {p.rutaPasosResumen.slice(0, 2).map((paso, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{paso}</span>
                      </div>
                    ))}
                    {p.rutaPasosResumen.length > 2 && (
                      <div className="text-[10px] text-slate-400 font-medium pl-4">
                        + {p.rutaPasosResumen.length - 2} pasos adicionales...
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0284C7]">
                <span>Ver ruta paso a paso</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
