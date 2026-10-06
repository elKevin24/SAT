import React, { useState } from 'react';
import { SegmentId } from './UserSegmentCards';

interface TopicItem {
  id: string;
  title: string;
  desc: string;
  isPermanentConsultas?: boolean;
  url: string;
}

const TOPICS_BY_SEGMENT: Record<SegmentId, { label: string; primaryColor: string; hoverBg: string; hoverBorder: string; hoverShadow: string; topics: TopicItem[] }> = {
  contribuyentes: {
    label: 'Contribuyentes',
    primaryColor: '#14649B',
    hoverBg: 'hover:bg-[#14649B]',
    hoverBorder: 'hover:border-[#14649B]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.24)]',
    topics: [
      {
        id: 'con-consultas',
        title: 'Consultas y Verificadores en Línea',
        desc: 'Acceso directo a las herramientas web de verificación de omisos, búsqueda de NIT, estado de solicitudes y solvencias.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas/'
      },
      {
        id: 'con-rtu',
        title: 'Inscripción y Actualización en RTU Digital',
        desc: 'Realiza tu registro por primera vez o actualiza tus datos de contacto y domicilio fiscal sin acudir a una agencia.',
        url: 'https://portal.sat.gob.gt/portal/rtu-digital/'
      },
      {
        id: 'con-fel',
        title: 'Facturación Electrónica en Línea (FEL)',
        desc: 'Habilítate como emisor de facturas electrónicas y genera comprobantes de venta sin costo desde web o móvil.',
        url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
      },
      {
        id: 'con-declaraguate',
        title: 'Presentación y Pago en Declaraguate',
        desc: 'Completa los formularios electrónicos de IVA, ISR u otros impuestos y genera la boleta SAT-2000 para pagar en tu banco.',
        url: 'https://declaraguate.sat.gob.gt/'
      },
      {
        id: 'con-vehiculos',
        title: 'Impuesto de Circulación y Distintivos',
        desc: 'Consulta montos a pagar, descarga tu calcomanía electrónica e inicia el traspaso digital de vehículos.',
        url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/'
      },
      {
        id: 'con-solvencia',
        title: 'Emisión de Solvencia Fiscal (SOFI)',
        desc: 'Obtén la constancia oficial que acredita que no posees deudas tributarias ante la administración.',
        url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/'
      }
    ]
  },
  comercio_exterior: {
    label: 'Operadores de Comercio Exterior',
    primaryColor: '#0284C7',
    hoverBg: 'hover:bg-[#0284C7]',
    hoverBorder: 'hover:border-[#0284C7]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.24)]',
    topics: [
      {
        id: 'ce-consultas',
        title: 'Consultas Aduaneras y DUCA',
        desc: 'Herramientas de consulta arancelaria, verificación de declaraciones aduaneras y estado de tránsitos internacionales.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/aduanas/'
      },
      {
        id: 'ce-conceptos',
        title: 'Clasificación y Arancel Integrado',
        desc: 'Revisa la nomenclatura oficial del Sistema Arancelario Centroamericano y las tarifas aplicables por mercancía.',
        url: 'https://portal.sat.gob.gt/portal/arancel-integrado/'
      },
      {
        id: 'ce-facilitacion',
        title: 'Programas de Facilitación del Comercio',
        desc: 'Procedimientos ágiles de despacho aduanero conjunto y mecanismos para reducir tiempos en frontera.',
        url: 'https://portal.sat.gob.gt/portal/facilitacion-comercio/'
      },
      {
        id: 'ce-miad',
        title: 'Mesa Integral de Aduanas (MIAD)',
        desc: 'Canal de atención directa y resolución técnica de consultas especializadas para auxiliares y operadores.',
        url: 'https://portal.sat.gob.gt/portal/miad/'
      },
      {
        id: 'ce-oea',
        title: 'Operador Económico Autorizado (OEA)',
        desc: 'Requisitos y beneficios para certificar tu empresa como un socio comercial seguro y confiable en la cadena logística.',
        url: 'https://portal.sat.gob.gt/portal/oea/'
      },
      {
        id: 'ce-defraudacion',
        title: 'Prevención de Defraudación y Contrabando',
        desc: 'Líneas directas de reporte confidencial y normativas del Consejo Interinstitucional contra el Contrabando (COINCON).',
        url: 'https://portal.sat.gob.gt/portal/lucha-contra-el-contrabando/'
      }
    ]
  },
  profesionales: {
    label: 'Profesionales',
    primaryColor: '#4D8014',
    hoverBg: 'hover:bg-[#4D8014]',
    hoverBorder: 'hover:border-[#4D8014]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.24)]',
    topics: [
      {
        id: 'prof-consultas',
        title: 'Consultas para Profesionales y Terceros',
        desc: 'Validación de títulos universitarios, timbres fiscales cancelados y verificación de acreditación de contadores.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas-profesionales/'
      },
      {
        id: 'prof-contadores',
        title: 'Registro de Peritos Contadores y Auditores',
        desc: 'Inscripción oficial ante el registro de contadores y proceso de nombramiento o acreditación para llevar libros.',
        url: 'https://portal.sat.gob.gt/portal/peritos-contadores/'
      },
      {
        id: 'prof-titulos',
        title: 'Registro de Títulos y Pago de Timbres',
        desc: 'Habilita tu grado universitario ante la SAT pagando la tarifa de timbres fiscales correspondiente para ejercer.',
        url: 'https://portal.sat.gob.gt/portal/habilitacion-titulos/'
      },
      {
        id: 'prof-gestores',
        title: 'Acreditación de Gestores y Auxiliares',
        desc: 'Presentación de poderes y mandatos para realizar trámites en representación de terceros en oficinas tributarias.',
        url: 'https://portal.sat.gob.gt/portal/gestores-tributarios/'
      },
      {
        id: 'prof-criterios',
        title: 'Criterios Tributarios Institucionales',
        desc: 'Consulta resoluciones y directrices técnicas oficiales aprobadas por el Directorio de SAT.',
        url: 'https://portal.sat.gob.gt/portal/criterios-tributarios/'
      }
    ]
  },
  organismos_especiales: {
    label: 'Organismos Especiales',
    primaryColor: '#C25E00',
    hoverBg: 'hover:bg-[#C25E00]',
    hoverBorder: 'hover:border-[#C25E00]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.24)]',
    topics: [
      {
        id: 'org-consultas',
        title: 'Consultas de Entes Exentos y Estado',
        desc: 'Verificación del estatus de resoluciones de exención y autenticidad de constancias electrónicas.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas-exenciones/'
      },
      {
        id: 'org-exenciones',
        title: 'Reconocimiento de Exenciones Tributarias',
        desc: 'Guía y base legal para entidades no lucrativas, diplomáticas, religiosas y educativas reconocidas por ley.',
        url: 'https://portal.sat.gob.gt/portal/entes-exentos/'
      },
      {
        id: 'org-constancias',
        title: 'Constancias de Adquisición de Insumos',
        desc: 'Genera y entrega constancias de exención del IVA para compras institucionales exentas de impuestos.',
        url: 'https://portal.sat.gob.gt/portal/constancias-exencion/'
      },
      {
        id: 'org-estado',
        title: 'Sector Público y Municipalidades',
        desc: 'Obligaciones de retención del IVA y compras gubernamentales en coordinación con Guatecompras.',
        url: 'https://portal.sat.gob.gt/portal/sector-publico/'
      }
    ]
  }
};

interface PopularTopicsTabsProps {
  onOpenConsultasModal: (segmentId: SegmentId) => void;
  onSelectTopicUrl?: (url: string) => void;
}

export const PopularTopicsTabs: React.FC<PopularTopicsTabsProps> = ({
  onOpenConsultasModal,
  onSelectTopicUrl
}) => {
  const [activeTab, setActiveTab] = useState<SegmentId>('contribuyentes');

  const currentSegmentData = TOPICS_BY_SEGMENT[activeTab];

  return (
    <section className="py-8 bg-white border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <h3 className="text-xl font-extrabold text-[#19324B] tracking-tight">
                Temas Más Consultados
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Servicios y temas con mayor demanda ciudadana según tu grupo de interés.
            </p>
          </div>

          {/* Segment Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {(Object.keys(TOPICS_BY_SEGMENT) as SegmentId[]).map((segId) => {
              const isActive = activeTab === segId;
              return (
                <button
                  key={segId}
                  onClick={() => setActiveTab(segId)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-[#14649B] shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {TOPICS_BY_SEGMENT[segId].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics Grid con solo Título y Descripción con UX writing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSegmentData.topics.map((topic) => {
            const isConsultas = topic.isPermanentConsultas;

            return (
              <div
                key={topic.id}
                onClick={() => {
                  if (isConsultas) {
                    onOpenConsultasModal(activeTab);
                  } else if (onSelectTopicUrl) {
                    onSelectTopicUrl(topic.url);
                  } else {
                    window.open(topic.url, '_blank');
                  }
                }}
                className={`p-5 rounded-[16px] border border-[#DCDCDC] ${currentSegmentData.hoverBorder} ${currentSegmentData.hoverBg} ${currentSegmentData.hoverShadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-0.5`}
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-white transition-colors leading-tight mb-2">
                    {topic.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between text-xs font-bold text-[#14649B] group-hover:text-white transition-colors">
                  <span>{isConsultas ? 'Abrir herramientas web' : 'Ver requisitos y detalles'}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
