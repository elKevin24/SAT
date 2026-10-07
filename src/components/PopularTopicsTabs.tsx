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
        title: 'Verificadores y Consultas en Línea',
        desc: 'Consulta si tienes declaraciones pendientes, verifica tu número de NIT, revisa el estado de tu trámite en Agencia Virtual y genera tu solvencia fiscal.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas/'
      },
      {
        id: 'con-rtu',
        title: 'Número de Identificación Tributaria (NIT)',
        desc: 'Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos, consultar su NIT y qué hacer si ha sido utilizado de forma indebida.',
        url: 'https://portal.sat.gob.gt/portal/rtu-digital/'
      },
      {
        id: 'con-fel',
        title: 'Facturación Electrónica en Línea (FEL)',
        desc: 'Aprende a emitir facturas electrónicas gratuitas desde la web o con la App SAT FEL, y entrega comprobantes válidos a tus clientes.',
        url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/'
      },
      {
        id: 'con-declaraguate',
        title: 'Declaración y Pago de Impuestos (Declaraguate)',
        desc: 'Llena tus formularios de IVA mensual o Impuesto Sobre la Renta (ISR) y genera tu boleta SAT-2000 para pagar desde la banca en línea.',
        url: 'https://declaraguate.sat.gob.gt/'
      },
      {
        id: 'con-vehiculos',
        title: 'Impuesto de Circulación y Calcomanía Vehicular',
        desc: 'Consulta cuánto debes pagar por tu vehículo, imprime tu calcomanía anual o inicia el traspaso electrónico de propiedad.',
        url: 'https://portal.sat.gob.gt/portal/consulta-de-vehiculos/'
      },
      {
        id: 'con-solvencia',
        title: 'Certificado de Solvencia Fiscal en Línea',
        desc: 'Descarga al instante la constancia digital que demuestra que no tienes deudas ni declaraciones pendientes con el Estado.',
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
        title: 'Consultas de Aduanas y Declaraciones (DUCA)',
        desc: 'Verifica el estado de tus declaraciones de aduanas, consulta aranceles vigentes y da seguimiento a tránsitos de mercancías.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/aduanas/'
      },
      {
        id: 'ce-conceptos',
        title: 'Arancel e Impuestos de Importación',
        desc: 'Conoce los códigos arancelarios y el porcentaje de impuestos que aplican a tus productos según el Sistema Arancelario Centroamericano.',
        url: 'https://portal.sat.gob.gt/portal/arancel-integrado/'
      },
      {
        id: 'ce-facilitacion',
        title: 'Paso Ágil y Facilitación de Comercio',
        desc: 'Descubre los procesos de despacho aduanero conjunto entre aduanas de Guatemala y países vecinos para agilizar tus envíos.',
        url: 'https://portal.sat.gob.gt/portal/facilitacion-comercio/'
      },
      {
        id: 'ce-miad',
        title: 'Mesa Integral de Atención en Aduanas (MIAD)',
        desc: 'Atención personalizada para importadores, exportadores y agentes que necesiten soporte técnico sobre procesos aduaneros.',
        url: 'https://portal.sat.gob.gt/portal/miad/'
      },
      {
        id: 'ce-oea',
        title: 'Certificación de Empresa Segura (OEA)',
        desc: 'Requisitos y beneficios para certificar tu empresa como Operador Económico Autorizado y obtener paso prioritario en aduanas.',
        url: 'https://portal.sat.gob.gt/portal/oea/'
      },
      {
        id: 'ce-defraudacion',
        title: 'Lucha contra el Contrabando y Denuncias',
        desc: 'Reporta de forma confidencial el ingreso ilegal de mercancías ante el Consejo Interinstitucional contra el Contrabando (COINCON).',
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
        title: 'Consultas y Verificación Profesional',
        desc: 'Comprueba el registro de colegiados activos, pago de timbres fiscales y vigencia de poderes legales de representación.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas-profesionales/'
      },
      {
        id: 'prof-contadores',
        title: 'Inscripción de Peritos Contadores y Auditores',
        desc: 'Habilítate ante la SAT para llevar la contabilidad de empresas, autorizar libros contables y firmar estados financieros.',
        url: 'https://portal.sat.gob.gt/portal/peritos-contadores/'
      },
      {
        id: 'prof-titulos',
        title: 'Registro de Título Universitario y Timbres',
        desc: 'Acredita tu licenciatura o grado superior ante la SAT pagando la tarifa única de timbres fiscales para poder ejercer tu profesión.',
        url: 'https://portal.sat.gob.gt/portal/habilitacion-titulos/'
      },
      {
        id: 'prof-gestores',
        title: 'Acreditación de Gestores Tributarios',
        desc: 'Registra tus poderes y autorizaciones notariales para gestionar trámites presenciales en nombre de tus clientes.',
        url: 'https://portal.sat.gob.gt/portal/gestores-tributarios/'
      },
      {
        id: 'prof-etraspaso',
        title: 'Traspaso Electrónico Notarial (e-Traspaso)',
        desc: 'Autenticación digital de firmas y traspaso inmediato de vehículos en Agencia Virtual Notarial con firma electrónica avanzada.',
        url: 'https://portal.sat.gob.gt/portal/traspaso-electronico-notarial/'
      },
      {
        id: 'prof-criterios',
        title: 'Criterios Legales e Interpretaciones de SAT',
        desc: 'Consulta resoluciones y directrices técnicas oficiales aprobadas por el Directorio de SAT.',
        url: 'https://portal.sat.gob.gt/portal/criterios-tributarios/'
      }
    ]
  },
  entes_exentos: {
    label: 'Entes Exentos',
    primaryColor: '#C25E00',
    hoverBg: 'hover:bg-[#C25E00]',
    hoverBorder: 'hover:border-[#C25E00]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.24)]',
    topics: [
      {
        id: 'org-consultas',
        title: 'Verificación de Exenciones y Constancias',
        desc: 'Consulta la vigencia de resoluciones de exención y valida constancias electrónicas emitidas para compras sin impuestos.',
        isPermanentConsultas: true,
        url: 'https://portal.sat.gob.gt/portal/consultas-exenciones/'
      },
      {
        id: 'org-exenciones',
        title: 'Reconocimiento de Exención de Impuestos',
        desc: 'Guía para solicitar el reconocimiento fiscal si eres una ONG, iglesia, cooperativa, universidad o entidad diplomática.',
        url: 'https://portal.sat.gob.gt/portal/entes-exentos/'
      },
      {
        id: 'org-constancias',
        title: 'Constancia para Compras sin IVA',
        desc: 'Genera las constancias oficiales que debes entregar a tus proveedores para adquirir insumos y bienes libres de IVA.',
        url: 'https://portal.sat.gob.gt/portal/constancias-exencion/'
      },
      {
        id: 'org-estado',
        title: 'Sector Público y Municipalidades',
        desc: 'Trámites de retenciones de impuestos y rendición de cuentas para ministerios, secretarías y municipalidades de Guatemala.',
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
    <section className="py-6 bg-white border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <h3 className="text-lg sm:text-xl font-extrabold text-[#19324B] tracking-tight">
                Temas Más Consultados
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Encuentra los trámites más solicitados según tu perfil, explicados paso a paso.
            </p>
          </div>

          {/* Segment Tabs con nombres exactos del mapa oficial */}
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

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
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
                className={`p-4 sm:p-5 rounded-[16px] border border-[#DCDCDC] ${currentSegmentData.hoverBorder} ${currentSegmentData.hoverBg} ${currentSegmentData.hoverShadow} transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-0.5`}
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#19324B] group-hover:text-white transition-colors leading-snug mb-1.5">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
