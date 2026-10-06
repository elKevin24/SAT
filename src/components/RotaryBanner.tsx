import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface BannerItem {
  id: number;
  tag: string;
  title: string;
  description: string; // Max 120 characters per Nielsen UX guidelines
  ctaLabel: string;
  ctaUrl: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 1,
    tag: 'Atención al Contribuyente',
    title: 'Facilitamos tu cumplimiento voluntario',
    description: 'Ampliamos el horario de atención de nuestro Contact Center 1550 y canales de asistencia virtual.',
    ctaLabel: 'Más información',
    ctaUrl: 'https://portal.sat.gob.gt/portal/contact-center/'
  },
  {
    id: 2,
    tag: 'Facturación Electrónica',
    title: 'Emite tus facturas FEL sin costo desde tu celular',
    description: 'Genera y anula DTEs gratis con la App SAT FEL disponible para Android e iOS en pocos clics.',
    ctaLabel: 'Conoce SAT FEL',
    ctaUrl: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
  },
  {
    id: 3,
    tag: 'Actualización RTU',
    title: 'Mantén tus datos actualizados en RTU Digital',
    description: 'Realiza tu actualización anual obligatoria en línea sin hacer filas ni presentar copias en papel.',
    ctaLabel: 'Ir al RTU',
    ctaUrl: 'https://portal.sat.gob.gt/portal/rtu-digital/'
  }
];

export const RotaryBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = BANNERS[currentIdx];

  return (
    <div className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-slate-50 border border-[#DCDCDC] rounded-[16px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs overflow-hidden"
          role="region"
          aria-label="Banner informativo rotativo"
        >
          {/* Banner Text (Max 120 chars) */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-[#14649B] uppercase tracking-wider bg-blue-100/70 px-2.5 py-0.5 rounded">
                {current.tag}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {currentIdx + 1} de {BANNERS.length}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#19324B] leading-tight">
              {current.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {current.description}
            </p>
          </div>

          {/* Action button & Carousel controls */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={current.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#14649B] hover:bg-[#11507C] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>{current.ctaLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Dots navigation */}
            <div className="flex items-center gap-1.5">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIdx ? 'w-5 bg-[#14649B]' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir al banner ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
