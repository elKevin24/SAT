import React, { useState } from 'react';
import { 
  CreditCard, 
  HelpCircle, 
  Printer, 
  FileSpreadsheet, 
  Calendar, 
  AlertCircle, 
  Car, 
  ShieldCheck, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface QuickAccessItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  url: string;
  isExternal?: boolean;
  category: string;
}

const QUICK_ITEMS: QuickAccessItem[] = [
  {
    id: 'solicitar-nit',
    title: 'Solicitar NIT',
    desc: 'Inscripción digital por primera vez',
    icon: CreditCard,
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/inscripcion-solicitud-de-nit/',
    category: 'RTU Digital'
  },
  {
    id: 'cual-es-mi-nit',
    title: '¿Cuál es mi NIT?',
    desc: 'Consulta tu número de NIT con tu CUI/DPI',
    icon: HelpCircle,
    url: 'https://portal.sat.gob.gt/portal/consulta-cui-nit/',
    category: 'Consultas'
  },
  {
    id: 'imprimir-rtu',
    title: 'Imprimir RTU',
    desc: 'Descarga tu constancia de RTU actualizada',
    icon: Printer,
    url: 'https://portal.sat.gob.gt/portal/constancia-rtu/',
    category: 'RTU Digital'
  },
  {
    id: 'fel',
    title: 'FEL',
    desc: 'Factura Electrónica en Línea y DTEs',
    icon: FileSpreadsheet,
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/',
    category: 'Facturación'
  },
  {
    id: 'calendario-tributario',
    title: 'Calendario Tributario',
    desc: 'Fechas de vencimiento y pagos',
    icon: Calendar,
    url: 'https://portal.sat.gob.gt/portal/calendario-tributario/',
    category: 'Obligaciones'
  },
  {
    id: 'omisos',
    title: 'Omisos',
    desc: 'Verifica declaraciones pendientes',
    icon: AlertCircle,
    url: 'https://portal.sat.gob.gt/portal/consulta-de-omisos/',
    category: 'Consultas'
  },
  {
    id: 'consultar-vehiculos',
    title: 'Consultar Vehículos',
    desc: 'Impuesto de Circulación e IPRT',
    icon: Car,
    url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/',
    category: 'Vehicular'
  },
  {
    id: 'solvencia-fiscal',
    title: 'Solvencia Fiscal',
    desc: 'Genera tu certificación SOFI',
    icon: ShieldCheck,
    url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/',
    category: 'Certificaciones'
  },
  {
    id: 'validar-documentos',
    title: 'Validar Documentos',
    desc: 'Verificación de firmas y constancias con QR',
    icon: FileCheck,
    url: 'https://portal.sat.gob.gt/portal/verificador-de-documentos/',
    category: 'Seguridad'
  }
];

interface QuickAccessCarouselProps {
  onSelectQuickAction?: (item: QuickAccessItem) => void;
}

export const QuickAccessCarousel: React.FC<QuickAccessCarouselProps> = ({ onSelectQuickAction }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 7; // Exact 7 visible items per Nielsen / Miller law on desktop

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(QUICK_ITEMS.length - itemsPerPage, prev + 1));
  };

  const visibleItems = QUICK_ITEMS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Controls Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
              <h3 className="text-base sm:text-lg font-extrabold text-[#19324B] tracking-tight">
                Accesos Rápidos
              </h3>
              <span className="hidden sm:inline text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                Procesos centrales SAT (BM)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Herramientas transaccionales y de consulta más utilizadas por los contribuyentes.
            </p>
          </div>

          {/* Carousel arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
              aria-label="Ver accesos anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= QUICK_ITEMS.length}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
              aria-label="Ver más accesos"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Visible Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onSelectQuickAction) {
                    onSelectQuickAction(item);
                  }
                }}
                className="group bg-white rounded-xl border border-slate-200 hover:border-[#14649B] p-3.5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50/70 text-[#14649B] group-hover:bg-[#14649B] group-hover:text-white flex items-center justify-center mb-2.5 transition-colors shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#19324B] group-hover:text-[#14649B] leading-tight transition-colors line-clamp-2 min-h-[2rem] flex items-center justify-center">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {item.category}
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
