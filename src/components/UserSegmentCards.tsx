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
    desc: 'Personas sin negocio (primer NIT), pequeños contribuyentes, régimen general (IVA e ISR) y contribuyentes especiales.',
    tone: 'azul'
  },
  {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    desc: 'Importadores, exportadores, auxiliares de la función pública (AFPA), agentes, transportistas y depósitos aduaneros.',
    tone: 'celeste'
  },
  {
    id: 'profesionales',
    name: 'Profesionales',
    desc: 'Peritos contadores, auditores, abogados, notarios y gestores tributarios acreditados ante la SAT.',
    tone: 'verde'
  },
  {
    id: 'entes_exentos',
    name: 'Entes Exentos',
    desc: 'Entidades del Estado, municipalidades, universidades, colegios, iglesias y organizaciones no lucrativas exentas por ley.',
    tone: 'naranja'
  }
];

interface UserSegmentCardsProps {
  selectedSegment: SegmentId | null;
  onSelectSegment: (segmentId: SegmentId, category?: string) => void;
}

export const UserSegmentCards: React.FC<UserSegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment
}) => {
  return (
    <section className="py-6 sm:py-8 bg-white" aria-labelledby="segmentation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="space-y-1">
          <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
            Arquitectura por Grupos de Interés
          </span>
          <h2 id="segmentation-heading" className="text-xl sm:text-2xl font-black text-[#19324B] tracking-tight">
            Selecciona tu ámbito de gestión tributaria o aduanera
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Accede a los requisitos oficiales, trámites en línea, verificadores en base de datos y normativa aplicable a tu personería.
          </p>
        </div>

        {/* Las 4 Tarjetas: Surface interactiva del design system con tono de segmento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
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
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
