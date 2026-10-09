import React from 'react';
import { Card, type CardTone } from './ui/Card';

import { Layers } from 'lucide-react';

export type SegmentId = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'entes_exentos';

interface SegmentDef {
  id: SegmentId;
  name: string;
  desc: string;
  tone: CardTone;
}

const SEGMENTS: SegmentDef[] = [
  {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    desc: 'Información y servicios tributarios para personas y empresas.',
    tone: 'azul'
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    desc: 'Servicios e información aduanera para la importación, exportación y logística.',
    tone: 'celeste'
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    desc: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
    tone: 'verde'
  },
  {
    id: 'entes_exentos',
    name: 'Entes Exentos',
    desc: 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
    tone: 'naranja'
  }
];

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId, category?: string) => void;
  onOpenFlowDiagram?: () => void;
}

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment,
  onOpenFlowDiagram
}) => {
  return (
    <section className="py-4 sm:py-5 bg-white" aria-labelledby="segmentation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Arquitectura por Grupos de Interés
            </span>
            <h2 id="segmentation-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
              Selecciona tu ámbito de gestión tributaria o aduanera
            </h2>
            <p className="text-xs sm:text-sm text-sat-texto-suave">
              Accede a los requisitos oficiales, gestiones en línea, verificadores en base de datos y normativa aplicable a tu personería.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            <a
              href="#/mapa"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sat-md text-xs font-bold text-white bg-sat-azul hover:bg-sat-azul-oscuro transition-all shadow-sat-sm focus:ring-2 focus:ring-sat-celeste focus:outline-none"
              aria-label="Ver mapa jerárquico oficial en página completa"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Ver Mapa Completo</span>
            </a>
            {onOpenFlowDiagram && (
              <button
                type="button"
                onClick={onOpenFlowDiagram}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-sat-md text-xs font-bold text-sat-azul bg-sat-azul/10 hover:bg-sat-azul/20 border border-sat-azul/20 transition-all shadow-sat-sm focus:ring-2 focus:ring-sat-azul focus:outline-none"
                aria-label="Abrir diagrama de flujo interactivo del portal en tarjetas conectadas"
              >
                <span>Modal Flotante</span>
              </button>
            )}
          </div>
        </div>

        {/* Las 4 Tarjetas: Surface interactiva del design system con tono de segmento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SEGMENTS.map((p) => {
            const isSelected = selectedSegment === p.id;

            return (
              <Card
                key={p.id}
                title={p.name}
                description={p.desc}
                tone={p.tone}
                onClick={() => onSelectSegment(p.id)}
                selected={isSelected}
                headingLevel="h3"
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
