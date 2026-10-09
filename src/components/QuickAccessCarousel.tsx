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
    desc: 'Obtén tu Número de Identificación Tributaria para empleo, bancos o abrir tu negocio.',
    url: '#/solicitar-nit'
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
    <section className="py-6 bg-sat-fondo-tenue border-b border-sat-gris">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado y controles */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sat-azul" />
              <h3 className="text-base sm:text-lg font-extrabold text-sat-azul-oscuro tracking-tight">
                Accesos Rápidos y Consultas Clave
              </h3>
            </div>
            <p className="text-xs text-sat-texto-suave mt-0.5">
              Servicios en línea y verificadores más utilizados para resolver tus gestiones frecuentes.
            </p>
          </div>

          {/* Flechas de carrusel */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-2 rounded-sat-sm border border-sat-gris bg-sat-blanco text-sat-texto-suave hover:bg-sat-fondo-medio disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
              aria-label="Ver accesos anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= QUICK_ITEMS.length}
              className="p-2 rounded-sat-sm border border-sat-gris bg-sat-blanco text-sat-texto-suave hover:bg-sat-fondo-medio disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
              aria-label="Ver más accesos"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Tarjetas compactas sin footer redundante */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {visibleItems.map((item) => {
            const isInternal = item.url.startsWith('#');
            return (
              <a
                key={item.id}
                href={item.url}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                onClick={() => {
                  if (onSelectQuickAction) onSelectQuickAction(item);
                }}
                className="group bg-sat-blanco rounded-sat-lg border border-sat-gris hover:border-sat-azul hover:bg-sat-azul hover:shadow-sat-md p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 text-left cursor-pointer min-h-[110px]"
              >
                <div>
                  <div className="text-xs font-bold text-sat-azul-oscuro group-hover:text-white leading-snug transition-colors mb-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-sat-texto-suave group-hover:text-white/90 transition-colors line-clamp-3 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
