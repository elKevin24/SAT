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
    { id: 'Empezar', label: 'Iniciar Gestión o Negocio' },
    { id: 'Cumplir', label: 'Declarar y Facturar' },
    { id: 'Cambiar', label: 'Actualizar Datos' },
    { id: 'Cesar/Cerrar', label: 'Cerrar o Dar de Baja' }
  ];

  const filtered = activeStage === 'Todos'
    ? procesos
    : procesos.filter(p => p.etapa && p.etapa.toLowerCase().includes(activeStage.toLowerCase().split('/')[0]));

  return (
    <section className="py-6 sm:py-8 bg-sat-fondo-tenue border-b border-sat-gris">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y Filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider block mb-0.5">
              Guías Paso a Paso para Ciudadanos
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-sat-azul-oscuro tracking-tight">
              Rutas Guiadas de Gestiones y Cumplimiento
            </h3>
            <p className="text-xs sm:text-sm text-sat-texto-suave mt-0.5">
              Instrucciones directas para completar tus gestiones de inicio a fin sin perderte entre leyes.
            </p>
          </div>

          {/* Filtros de etapas en lenguaje claro */}
          <div className="flex items-center gap-1.5 p-1 bg-sat-blanco rounded-sat-md border border-sat-gris overflow-x-auto no-scrollbar">
            {stages.map((stg) => {
              const isActive = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 rounded-sat-sm text-xs font-bold transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul ${
                    isActive 
                      ? 'bg-sat-azul text-white shadow-sat-sm' 
                      : 'text-sat-texto-suave hover:text-sat-azul hover:bg-sat-fondo-medio'
                  }`}
                >
                  {stg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Process Cards Grid compacto sin footer de acción redundante */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
