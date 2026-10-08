import React, { useState } from 'react';
import { Card } from './ui/Card';
import type { ProcesoGuiado } from '../data/schema';

interface GuidedProcessesSectionProps {
  procesos: ProcesoGuiado[];
  onSelectProceso: (proceso: ProcesoGuiado) => void;
}

export const GuidedProcessesSection: React.FC<GuidedProcessesSectionProps> = ({
  procesos,
  onSelectProceso
}) => {
  const [activeStage, setActiveStage] = useState<string>('Todos');

  const stages = [
    { id: 'Todos', label: 'Todos los Procesos' },
    { id: 'Empezar', label: 'Iniciar Trámite o Negocio' },
    { id: 'Cumplir', label: 'Declarar y Facturar' },
    { id: 'Cambiar', label: 'Actualizar Datos' },
    { id: 'Cesar/Cerrar', label: 'Cerrar o Dar de Baja' }
  ];

  const filtered = activeStage === 'Todos'
    ? procesos
    : procesos.filter(p => p.etapa && p.etapa.toLowerCase().includes(activeStage.toLowerCase().split('/')[0]));

  return (
    <section className="py-8 bg-slate-50 border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y Filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider block mb-0.5">
              Guías Paso a Paso para Ciudadanos
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#19324B] tracking-tight">
              Rutas Guiadas de Trámites y Cumplimiento
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Instrucciones directas para completar tus gestiones de inicio a fin sin perderte entre leyes.
            </p>
          </div>

          {/* Filtros de etapas en lenguaje claro */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#DCDCDC] overflow-x-auto no-scrollbar">
            {stages.map((stg) => {
              const isActive = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#14649B] text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {stg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Process Cards Grid compacto sin footer de acción redundante */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {filtered.slice(0, 9).map((p) => (
            <Card
              key={p.no}
              title={p.nombre}
              description={`Guía paso a paso para ${(p.paraQuien ?? 'ti').toLowerCase()}. Te orienta con los requisitos previos y el acceso directo al sistema oficial de la SAT.`}
              tone="azul"
              headingLevel="h4"
              onClick={() => onSelectProceso(p)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
