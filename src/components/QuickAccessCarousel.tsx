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
    title: 'Solicitar NIT por primera vez',
    desc: 'Obtén tu Número de Identificación Tributaria para trámites de trabajo, bancos o abrir tu negocio.',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/inscripcion-solicitud-de-nit/'
  },
  {
    id: 'cual-es-mi-nit',
    title: 'Consultar mi NIT con DPI',
    desc: 'Verifica tu número de NIT asignado ingresando los 13 dígitos de tu Documento Personal de Identificación (DPI).',
    url: 'https://portal.sat.gob.gt/portal/consulta-cui-nit/'
  },
  {
    id: 'imprimir-rtu',
    title: 'Descargar Constancia de RTU',
    desc: 'Obtén en formato digital la constancia oficial de tus datos actualizados en el Registro Tributario Unificado.',
    url: 'https://portal.sat.gob.gt/portal/constancia-rtu/'
  },
  {
    id: 'fel',
    title: 'Facturación Electrónica (FEL)',
    desc: 'Emite facturas y notas de crédito electrónicas de forma gratuita desde la web o con la aplicación en tu celular.',
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
  },
  {
    id: 'calendario-tributario',
    title: 'Fechas de Pago y Calendario',
    desc: 'Revisa las fechas límite del mes para presentar y pagar tus declaraciones de IVA, ISR u otros impuestos.',
    url: 'https://portal.sat.gob.gt/portal/calendario-tributario/'
  },
  {
    id: 'omisos',
    title: 'Consultar Pagos Pendientes',
    desc: 'Verifica si tienes declaraciones no presentadas o pagos pendientes para mantenerte al día ante la SAT.',
    url: 'https://portal.sat.gob.gt/portal/consulta-de-omisos/'
  },
  {
    id: 'consultar-vehiculos',
    title: 'Impuesto de Vehículos y Calcomanía',
    desc: 'Consulta el monto del Impuesto de Circulación, realiza el pago e imprime tu calcomanía electrónica.',
    url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/'
  },
  {
    id: 'solvencia-fiscal',
    title: 'Solvencia Fiscal en Línea (SOFI)',
    desc: 'Genera el certificado oficial que comprueba que estás solvente y al día con todas tus obligaciones.',
    url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/'
  },
  {
    id: 'validar-documentos',
    title: 'Verificar Firmas y Documentos QR',
    desc: 'Comprueba la autenticidad de resoluciones, constancias y firmas electrónicas emitidas por la SAT.',
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
    <section className="py-5 bg-slate-50 border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y controles */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <h3 className="text-base font-extrabold text-[#19324B] tracking-tight">
                Accesos Rápidos y Consultas Clave
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Servicios en línea y verificadores más utilizados para resolver tus trámites frecuentes.
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

        {/* 7 Tarjetas compactas sin footer redundante */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {visibleItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onSelectQuickAction) onSelectQuickAction(item);
              }}
              className="group bg-white rounded-[14px] border border-[#DCDCDC] hover:border-[#14649B] hover:bg-[#14649B] hover:shadow-[0_10px_20px_rgba(20,100,155,0.22)] p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 text-left"
            >
              <div>
                <div className="text-xs font-bold text-[#19324B] group-hover:text-white leading-snug transition-colors mb-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-600 group-hover:text-white/85 transition-colors line-clamp-3 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
