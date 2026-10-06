import React, { useState } from 'react';
import { SegmentId } from './UserSegmentCards';

interface TopicItem {
  id: string;
  title: string;
  desc: string;
  isPermanentConsultas?: boolean;
  category: string;
  url: string;
}

const TOPICS_BY_SEGMENT: Record<SegmentId, { label: string; topics: TopicItem[] }> = {
  contribuyentes: {
    label: 'Contribuyentes',
    topics: [
      {
        id: 'con-consultas',
        title: 'Consultas Transaccionales',
        desc: 'Catálogo oficial de verificadores, omisos, NIT y solvencias.',
        isPermanentConsultas: true,
        category: 'Consultas Web',
        url: 'https://portal.sat.gob.gt/portal/consultas/'
      },
      {
        id: 'con-rtu',
        title: 'RTU Digital y Actualización',
        desc: 'Inscripción y actualización obligatoria de datos anuales.',
        category: 'Registro',
        url: 'https://portal.sat.gob.gt/portal/rtu-digital/'
      },
      {
        id: 'con-fel',
        title: 'Emisión de Facturas FEL',
        desc: 'Régimen de Factura Electrónica en Línea sin costo.',
        category: 'Facturación',
        url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
      },
      {
        id: 'con-declaraguate',
        title: 'Llenado y Pago en Declaraguate',
        desc: 'Formularios SAT-2000, IVA mensual e ISR trimestral.',
        category: 'Declaraciones',
        url: 'https://declaraguate.sat.gob.gt/'
      },
      {
        id: 'con-vehiculos',
        title: 'Impuesto de Circulación (ISCV)',
        desc: 'Consulta de calcomanía electrónica y traspaso de vehículos.',
        category: 'Vehículos',
        url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/'
      },
      {
        id: 'con-solvencia',
        title: 'Solvencia Fiscal (SOFI)',
        desc: 'Certificación electrónica de solvencia libre de adeudos.',
        category: 'Certificaciones',
        url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/'
      }
    ]
  },
  comercio_exterior: {
    label: 'Operadores de Comercio Exterior',
    topics: [
      {
        id: 'ce-consultas',
        title: 'Consultas Aduanas & DUCA',
        desc: 'Catálogo de consultas arancelarias, manifiestos y DUCA.',
        isPermanentConsultas: true,
        category: 'Consultas Aduaneras',
        url: 'https://portal.sat.gob.gt/portal/aduanas/'
      },
      {
        id: 'ce-conceptos',
        title: 'Conceptos Generales y Arancel',
        desc: 'Sistema Arancelario Centroamericano (SAC) y clasificaciones.',
        category: 'Normativa',
        url: 'https://portal.sat.gob.gt/portal/arancel-integrado/'
      },
      {
        id: 'ce-facilitacion',
        title: 'Facilitación del Comercio',
        desc: 'Medidas de agilización aduanera y despacho conjunto.',
        category: 'Procesos',
        url: 'https://portal.sat.gob.gt/portal/facilitacion-comercio/'
      },
      {
        id: 'ce-miad',
        title: 'Mesa Integral de Aduanas (MIAD)',
        desc: 'Atención especializada para operadores de comercio exterior.',
        category: 'Atención',
        url: 'https://portal.sat.gob.gt/portal/miad/'
      },
      {
        id: 'ce-oea',
        title: 'Operador Económico Autorizado (OEA)',
        desc: 'Certificación de seguridad de la cadena logística internacional.',
        category: 'Certificación',
        url: 'https://portal.sat.gob.gt/portal/oea/'
      },
      {
        id: 'ce-defraudacion',
        title: 'Lucha contra la Defraudación y Contrabando',
        desc: 'COINCON y denuncias confidenciales de contrabando aduanero.',
        category: 'Fiscalización',
        url: 'https://portal.sat.gob.gt/portal/lucha-contra-el-contrabando/'
      }
    ]
  },
  profesionales: {
    label: 'Profesionales',
    topics: [
      {
        id: 'prof-consultas',
        title: 'Consultas para Profesionales',
        desc: 'Verificación de títulos universitarios, colegiados y poderes.',
        isPermanentConsultas: true,
        category: 'Consultas Colegiados',
        url: 'https://portal.sat.gob.gt/portal/consultas-profesionales/'
      },
      {
        id: 'prof-contadores',
        title: 'Habilitación de Peritos Contadores y Auditores',
        desc: 'Registro ante SAT y acreditación de libros contables.',
        category: 'Contadores',
        url: 'https://portal.sat.gob.gt/portal/peritos-contadores/'
      },
      {
        id: 'prof-titulos',
        title: 'Registro de Títulos Universitarios y Timbres',
        desc: 'Habilitación oficial y pago de timbres fiscales por QR.',
        category: 'Títulos',
        url: 'https://portal.sat.gob.gt/portal/habilitacion-titulos/'
      },
      {
        id: 'prof-gestores',
        title: 'Acreditación de Gestores Tributarios',
        desc: 'Poderes de representación y mandatos ante agencias SAT.',
        category: 'Gestores',
        url: 'https://portal.sat.gob.gt/portal/gestores-tributarios/'
      },
      {
        id: 'prof-criterios',
        title: 'Criterios Tributarios Institucionales',
        desc: 'Doctrina y resoluciones emitidas por el Directorio de SAT.',
        category: 'Doctrina Legal',
        url: 'https://portal.sat.gob.gt/portal/criterios-tributarios/'
      }
    ]
  },
  organismos_especiales: {
    label: 'Organismos Especiales',
    topics: [
      {
        id: 'org-consultas',
        title: 'Consultas Entes Exentos',
        desc: 'Verificación de exenciones vigentes y constancias electrónicas.',
        isPermanentConsultas: true,
        category: 'Consultas Exenciones',
        url: 'https://portal.sat.gob.gt/portal/consultas-exenciones/'
      },
      {
        id: 'org-exenciones',
        title: 'Régimen de Exenciones Tributarias',
        desc: 'Entidades religiosas, educativas, diplomáticas y ONG.',
        category: 'Exenciones',
        url: 'https://portal.sat.gob.gt/portal/entes-exentos/'
      },
      {
        id: 'org-constancias',
        title: 'Constancias de Adquisición de Insumos',
        desc: 'Emisión y validación de constancias de exención del IVA.',
        category: 'Constancias',
        url: 'https://portal.sat.gob.gt/portal/constancias-exencion/'
      },
      {
        id: 'org-estado',
        title: 'Sector Público y Municipalidades',
        desc: 'Cumplimiento de retenciones y compras gubernamentales.',
        category: 'Sector Público',
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
              Contenido de mayor frecuencia mensual por grupo de interés (conforme a la Ley de Miller UX).
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

        {/* Topics Grid without icons */}
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
                className={`p-5 rounded-[16px] border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isConsultas
                    ? 'bg-blue-50/50 border-[#14649B]/30 hover:border-[#14649B] shadow-xs hover:shadow-md'
                    : 'bg-white border-[#DCDCDC] hover:border-[#14649B] shadow-xs hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span 
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                        isConsultas 
                          ? 'bg-[#14649B] text-white' 
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {topic.category}
                    </span>
                    {isConsultas && (
                      <span className="text-[10px] font-bold text-[#14649B]">
                        Catálogo Directo
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors leading-tight mb-2">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#14649B]">
                  <span>{isConsultas ? 'Abrir herramientas web' : 'Ver requisitos y detalles'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
