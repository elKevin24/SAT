import React from 'react';
import { Card, type CardTone } from './ui/Card';

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
}

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment,
}) => {
  return (
    <section className="py-4 sm:py-5 bg-white" aria-labelledby="segmentation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">

        <div>
          <h2 id="segmentation-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
            Selecciona tu grupo de interés
          </h2>
          <p className="text-xs sm:text-sm text-sat-texto-suave mt-1">
            Accede a los requisitos oficiales, gestiones en línea, verificadores en base de datos y normativa aplicable a tu personería.
          </p>
        </div>

        {/* Las 4 Tarjetas: Surface interactiva del design system con tono de segmento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SEGMENTS.map((p) => {
            const isSelected = selectedSegment === p.id;

            return (
              <Card
                key={p.id}
                tone={p.tone}
                title={p.name}
                description={p.desc}
                selected={isSelected}
                onClick={() => onSelectSegment(p.id)}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
