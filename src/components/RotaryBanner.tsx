import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Headphones, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface BannerItem {
  id: number;
  tag: string;
  title: string;
  description: string; // Max 120 characters per Nielsen UX guidelines
  ctaLabel: string;
  ctaUrl: string;
  icon: React.ElementType;
}

const BANNERS: BannerItem[] = [
  {
    id: 1,
    tag: 'Atención al Contribuyente',
    title: 'Facilitamos tu cumplimiento voluntario',
    description: 'Ampliamos el horario de atención de nuestro Contact Center 1550 y canales de asistencia virtual.',
    ctaLabel: 'Más información',
    ctaUrl: 'https://portal.sat.gob.gt/portal/contact-center/',
    icon: Headphones
  },
  {
    id: 2,
    tag: 'Facturación Electrónica',
    title: 'Emite tus facturas FEL sin costo desde tu celular',
    description: 'Genera y anula DTEs gratis con la App SAT FEL disponible para Android e iOS en pocos clics.',
    ctaLabel: 'Conoce SAT FEL',
    ctaUrl: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/',
    icon: Sparkles
  },
  {
    id: 3,
    tag: 'Actualización RTU',
    title: 'Mantén tus datos actualizados en RTU Digital',
    description: 'Realiza tu actualización anual obligatoria en línea sin hacer filas ni presentar copias en papel.',
    ctaLabel: 'Ir al RTU',
    ctaUrl: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    icon: ShieldCheck
  }
];

export const RotaryBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 6 seconds if not paused by mouse hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = BANNERS[currentIdx];
  const Icon = current.icon;

  return (
    <div className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-gradient-to-r from-[#14649B]/10 via-[#19AFE1]/10 to-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs overflow-hidden"
          role="region"
          aria-label="Banner informativo rotativo"
        >
          {/* Visual support icon (~10% banner area) */}
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#14649B] text-white items-center justify-center shrink-0 shadow-md">
            <Icon className="w-7 h-7" />
          </div>

          {/* Banner Text (Max 120 chars) */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#14649B] uppercase tracking-wider bg-blue-100/60 px-2.5 py-0.5 rounded-full">
                {current.tag}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {currentIdx + 1} de {BANNERS.length}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#19324B] leading-tight">
              {current.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {current.description}
            </p>
          </div>

          {/* Action button & Carousel controls */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={current.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#14649B] hover:bg-[#11507C] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
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
