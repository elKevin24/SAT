import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuickAccessItem {
  id: string;
  title: string;
  desc: string;
  url: string;
}

const QUICK_ITEMS: QuickAccessItem[] = [
  {
    id: 'solicitar-nit',
    title: 'Solicitar NIT',
    desc: 'Obtén tu Número de Identificación Tributaria por primera vez en línea.',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/inscripcion-solicitud-de-nit/'
  },
  {
    id: 'cual-es-mi-nit',
    title: 'Consultar mi NIT',
    desc: 'Recupera o verifica tu número de NIT ingresando tu Código Único de Identificación (CUI).',
    url: 'https://portal.sat.gob.gt/portal/consulta-cui-nit/'
  },
  {
    id: 'imprimir-rtu',
    title: 'Imprimir Constancia RTU',
    desc: 'Descarga tu constancia de inscripción o actualización en formato digital.',
    url: 'https://portal.sat.gob.gt/portal/constancia-rtu/'
  },
  {
    id: 'fel',
    title: 'Factura Electrónica FEL',
    desc: 'Emite y valida Documentos Tributarios Electrónicos de forma gratuita.',
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
  },
  {
    id: 'calendario-tributario',
    title: 'Calendario Tributario',
    desc: 'Revisa las fechas límite para presentar y pagar tus obligaciones fiscales.',
    url: 'https://portal.sat.gob.gt/portal/calendario-tributario/'
  },
  {
    id: 'omisos',
    title: 'Verificar Omisos',
    desc: 'Comprueba si tienes declaraciones o pagos pendientes ante la SAT.',
    url: 'https://portal.sat.gob.gt/portal/consulta-de-omisos/'
  },
  {
    id: 'consultar-vehiculos',
    title: 'Consultar Vehículos',
    desc: 'Paga el Impuesto de Circulación y descarga tu calcomanía electrónica.',
    url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/'
  },
  {
    id: 'solvencia-fiscal',
    title: 'Solvencia Fiscal',
    desc: 'Genera tu constancia de solvencia SOFI libre de deudas tributarias.',
    url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/'
  },
  {
    id: 'validar-documentos',
    title: 'Validar Documentos',
    desc: 'Comprueba la autenticidad de resoluciones y firmas electrónicas emitidas por SAT.',
    url: 'https://portal.sat.gob.gt/portal/verificador-de-documentos/'
  }
];

interface QuickAccessCarouselProps {
  onSelectQuickAction?: (item: QuickAccessItem) => void;
}

export const QuickAccessCarousel: React.FC<QuickAccessCarouselProps> = ({ onSelectQuickAction }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 7;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(QUICK_ITEMS.length - itemsPerPage, prev + 1));
  };

  const visibleItems = QUICK_ITEMS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-6 bg-slate-50 border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y controles */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <h3 className="text-base font-extrabold text-[#19324B] tracking-tight">
                Accesos Rápidos
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Herramientas de consulta y servicios transaccionales más utilizados.
            </p>
          </div>

          {/* Flechas de carrusel */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-1.5 rounded-lg border border-[#DCDCDC] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Ver accesos anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= QUICK_ITEMS.length}
              className="p-1.5 rounded-lg border border-[#DCDCDC] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Ver más accesos"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Tarjetas con solo Título y Descripción con UX writing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {visibleItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onSelectQuickAction) onSelectQuickAction(item);
              }}
              className="group bg-white rounded-[14px] border border-[#DCDCDC] hover:border-[#14649B] hover:bg-[#14649B] hover:shadow-[0_10px_20px_rgba(20,100,155,0.22)] p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 text-left"
            >
              <div>
                <div className="text-xs font-bold text-[#19324B] group-hover:text-white leading-snug transition-colors mb-1.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-600 group-hover:text-white/85 transition-colors line-clamp-3 leading-relaxed">
                  {item.desc}
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 group-hover:border-white/20 text-[11px] font-bold text-[#14649B] group-hover:text-white transition-colors flex items-center justify-between">
                <span>Acceder</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
