import React, { useState } from 'react';

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
    <section className="py-10 bg-slate-50 border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y Filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider block mb-1">
              Procesos Core Guiados
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#19324B] tracking-tight">
              Rutas y Ciclos de Vida del Contribuyente
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Guías paso a paso para resolver tus trámites sin perderte entre normas o requisitos.
            </p>
          </div>

          {/* Filtros de etapas */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#DCDCDC] overflow-x-auto no-scrollbar">
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

        {/* Process Cards Grid con el estilo previo idéntico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 9).map((p) => (
            <div
              key={p.no}
              onClick={() => onSelectProceso(p)}
              className="group bg-white rounded-[16px] border border-[#DCDCDC] hover:border-[#14649B] hover:bg-[#14649B] hover:shadow-[0_12px_24px_rgba(20,100,155,0.24)] p-5 shadow-xs hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {p.etapa || 'Proceso Core'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-white/80 transition-colors">
                    {p.totalPasos} pasos
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-white transition-colors leading-snug mb-2">
                  {p.nombre}
                </h4>

                <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed line-clamp-2 mb-3">
                  <span className="font-semibold text-slate-800 group-hover:text-white">Para:</span> {p.paraQuien}
                </p>

                {/* Micro preview de pasos en texto limpio */}
                {p.rutaPasosResumen && p.rutaPasosResumen.length > 0 && (
                  <div className="p-3 bg-slate-50 group-hover:bg-white/10 rounded-xl border border-slate-100 group-hover:border-white/20 text-[11px] text-slate-600 group-hover:text-white/90 transition-colors space-y-1">
                    {p.rutaPasosResumen.slice(0, 2).map((paso, idx) => (
                      <div key={idx} className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14649B] group-hover:bg-white shrink-0" />
                        <span className="truncate">{paso}</span>
                      </div>
                    ))}
                    {p.rutaPasosResumen.length > 2 && (
                      <div className="text-[10px] text-slate-400 group-hover:text-white/70 font-medium pl-3.5">
                        + {p.rutaPasosResumen.length - 2} pasos adicionales...
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between text-xs font-bold text-[#14649B] group-hover:text-white transition-colors">
                <span>Ver ruta paso a paso</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
