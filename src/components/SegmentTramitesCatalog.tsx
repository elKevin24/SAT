import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { SegmentId } from './UserSegmentCards';
import { Card, type CardTone } from './ui/Card';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { SidebarNav, type SidebarCategory } from './ui/SidebarNav';
import { Alert } from './ui/Alert';
import type { EtapaAtoId, TipoInteraccionId } from '../data/portalMasterTaxonomy';
import type { TramiteItem } from '../data/schema';
import { OFFICIAL_CATEGORY_ORDER, subcategoryOrderFor, compareByCategoryOrder, compareCanonicalTramiteOrder } from '../data/categoryOrder';
import { categoriaId, subcategoriaId } from '../data/taxonomy';

export type { TramiteItem } from '../data/schema';

interface SegmentTramitesCatalogProps {
  segmentId: SegmentId;
  initialCategory?: string;
  initialSubcategory?: string | null;
  initialEtapaAto?: EtapaAtoId | 'todas';
  initialTipoInteraccion?: TipoInteraccionId | 'todos';
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToHome: () => void;
  onSwitchSegment: (segId: SegmentId) => void;
}

const SEGMENT_METADATA: Record<SegmentId, {
  title: string;
  shortTitle: string;
  desc: string;
  color: string;
}> = {
  contribuyentes: {
    title: 'Contribuyentes',
    shortTitle: 'Contribuyentes',
    desc: 'Información y servicios tributarios para personas y empresas.',
    color: '#14649B'
  },
  comercio_exterior: {
    title: 'Operadores de Comercio Exterior',
    shortTitle: 'Comercio Exterior',
    desc: 'Servicios e información aduanera para la importación, exportación y logística.',
    color: '#0284C7'
  },
  profesionales: {
    title: 'Profesionales',
    shortTitle: 'Profesionales',
    desc: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
    color: '#4D8014'
  },
  entes_exentos: {
    title: 'Entes Exentos',
    shortTitle: 'Entes Exentos',
    desc: 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
    color: '#C25E00'
  }
};

const SEGMENT_CARD_TONE: Record<SegmentId, CardTone> = {
  contribuyentes: 'azul',
  comercio_exterior: 'celeste',
  profesionales: 'verde',
  entes_exentos: 'naranja'
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'NIT sin Obligaciones': 'Personas individuales, estudiantes y graduados sin actividad económica que requieren NIT para gestiones civiles, cuentas bancarias, títulos y remesas.',
  'Pequeños Contribuyentes': 'Régimen simplificado con tarifa definitiva del 5% hasta Q150,000 anuales y actividades agropecuarias especiales.',
  'Contribuyente General': 'Personas y empresas con obligaciones generales de IVA e ISR, facturación electrónica, asalariados y gestión vehicular.',
  'Contribuyentes Especiales': 'Medianos y grandes contribuyentes sujetos a control diferenciado y gerencias de fiscalización tributaria intensiva.',
  'Importadores y Exportadores': 'Gestiones tributarias y aduaneras comunes: RTU Digital, solvencia fiscal habilitante, declaraciones DUCA y aranceles.',
  'Importadores': 'Padrón de importadores de la SAT, declaraciones DUCA-D, valoración aduanera, IPRIMA y rescate de mercancías en abandono.',
  'Exportadores': 'Padrón de exportadores, declaraciones simplificadas y complementarias, listas de embarque y devolución de crédito fiscal del IVA.',
  'Operador Económico Autorizado (OEA)': 'Certificación de seguridad en la cadena logística, carriles preferenciales de despacho y facilitación en contingencias.',
  'Agentes Aduaneros': 'Auxiliares autorizados para el despacho oficial, acreditación de carné, firma electrónica y representación aduanera.',
  'Apoderados Especiales Aduaneros': 'Representantes con mandato legal aduanero, requisitos de renovación, carné de identificación y seguros de caución.',
  'Empresas de Entrega Rápida o Courier': 'Empresas de paquetería expresa internacional, manifiestos courier, despacho simplificado y franquicias no comerciales.',
  'Consolidadores y Desconsolidadores de Carga': 'Transmisión de mensajes CUSCAR, desconsolidación de conocimientos de embarque (B/L, AWB) y justificación de bultos.',
  'Transportistas Aduaneros': 'Empresas de transporte internacional, medios de carga, marchamo satelital RFID, declaraciones DUCA-T y régimen ATC.',
  'Depósitos Aduaneros': 'Almacenes fiscales, almacenadoras generales de depósito (Decreto 1236) y depósitos aduaneros temporales (DAT).',
  'ZDEEP - Entidades Administradoras': 'Habilitación de recintos perimetrales, garitas de control aduanero y administración de Zonas de Desarrollo Económico Especial Público.',
  'ZDEEP - Empresas Usuarias': 'Empresas calificadas dentro de ZDEEP: ingreso y egreso de carga, materias primas, transformación y exenciones tributarias.',
  'Abogados y Notarios': 'Habilitación profesional ante la SAT, adquisición de Papel Sellado Especial para Protocolos y timbres fiscales, traspasos electrónicos y avisos notariales obligatorios.',
  'Peritos Contadores': 'Inscripción y actualización de contadores autorizados ante la SAT para llevar contabilidades formales.',
  'Auditores': 'Habilitación para dictámenes fiscales, auditorías tributarias y gestiones de devolución de crédito fiscal.',
  'Gestores Tributarios': 'Acreditación de gestores y personas autorizadas para tramitar ante agencias de la SAT.',
  'Servicios Profesionales': 'Profesionales liberales independientes, emisión de facturas y pago de timbres profesionales.',
  'Entidades del Estado': 'Ministerios, dependencias públicas y secretarías con retenciones tributarias y exenciones oficiales.',
  'Constitucionales': 'Universidades, centros educativos y misiones diplomáticas exentas de tributos por mandato constitucional.',
  'No Lucrativos': 'Asociaciones, fundaciones, cooperativas e iglesias con reconocimiento de exención de impuestos.',
  'Municipalidades': 'Gobiernos locales y empresas municipales con gestiones tributarias y acreditaciones ante SAT.',
  'Decreto': 'Entidades beneficiarias de incentivos fiscales y exenciones específicas normadas por decreto legislativo.'
};

const SUBCATEGORY_DESCRIPTIONS: Record<string, string> = {
  // Áreas Funcionales Oficiales de Comercio Exterior
  'Registro y acreditación': 'Gestiones de inscripción, acreditación oficial, solvencia fiscal, carnés y entrega de pólizas de fianza.',
  'Operaciones y gestiones': 'Gestiones del día a día: transmisión de declaraciones DUCA, manifiestos de carga, pagos y permisos aduaneros.',
  'Consultas y seguimiento': 'Trazabilidad de operaciones: selectivo en aduanas, rampa de revisión, retenciones, expedientes y control de inventarios.',
  'Normativa y recursos': 'Marco legal aduanero, CAUCA, RECAUCA, guías técnicas de sistemas, manuales y capacitaciones oficiales.',

  // Comercio Exterior: Importadores
  'Registro y Padrón de Importadores': 'Inscripción en el Padrón de Importadores de la SAT, requisitos previos por vía aérea o marítima y normativa aduanera aplicable.',
  'Declaraciones Aduaneras y DUCAs': 'Transmisión y gestión de DUCA-F, DUCA-D, DUA-GT, FYDUCA, declaraciones con fianza aduanera y declaración de valor.',
  'Importación y Nacionalización de Vehículos': 'Liquidación de tributos, tablas de valores IPRIMA e IVA de importación, alzas y comprobación de valor vehicular.',
  'Placas y Distintivos de Distribuidor': 'Solicitud y reposición de placas de distribuidor, contraseñas de circulación, tarjetas y primer certificado de propiedad.',
  'Despacho Aduanero, Levante y Selectivo': 'Gestión de análisis de riesgo, selectivo aduanero verde/rojo, despacho anticipado, estudios de tiempos y entrega de envíos parciales.',
  'Mercancías en Abandono, Depósitos y Franquicias': 'Rescate de mercancías en abandono aduanero, restitución de depósitos SAT-8011, franquicias electrónicas y devoluciones DAI/IVA.',

  // Comercio Exterior: Exportadores
  'Padrón y Registro de Exportadores': 'Inscripción como exportador habitual en Agencia Virtual, actualización de datos, bajas y formulario oficial SAT-2125.',
  'Devolución de Crédito Fiscal': 'Inscripción y gestiones en Régimen Especial y Optativo de devolución de IVA, solicitudes electrónicas y verificaciones.',
  'Declaraciones Aduaneras y Embarques': 'Autorización de listas de embarque de exportación, declaraciones provisionales, complementarias y selectivo aduanero.',

  // Comercio Exterior: Transportistas
  'Registro de Equipos y Admisión Temporal (ATC)': 'Admisión temporal de equipo de carga terrestre internacional, ampliación de plazos, cierre de operaciones y devolución.',
  'Manifiestos de Carga (CUSCAR) y Tránsito': 'Transmisión de manifiestos electrónicos, consulta de tránsitos aduaneros pendientes, asignación de rampas y cartas de ingreso.',
  'Marchamo Electrónico y Control de Rutas': 'Monitoreo satelital en ruta fiscal mediante marchamo electrónico, inventario de áreas autorizadas y sanciones aduaneras.',

  // Comercio Exterior: Agentes Aduaneros
  'Habilitación y Registro de Auxiliares': 'Acreditación oficial, renovación de carné de Auxiliar de la Función Pública Aduanera y manual de usuario.',
  'Sistemas Informáticos y Despacho Aduanero': 'Configuración de componente ActiveX PKI/DUA, expediente digital aduanero, videovigilancia y capacitaciones DUCA.',

  // Comercio Exterior: Normativa y Aranceles
  'Arancel Centroamericano (SAC) y Permisos': 'Consulta del Sistema Arancelario Centroamericano (SAC), arancel integrado, permisos no arancelarios y notas explicativas.',
  'Acuerdos Comerciales y Facilitación': 'Tratados de libre comercio, normas de origen, valoración de mercancías y estrategia centroamericana de facilitación.',
  'Prevención de Contrabando y Defraudación': 'Denuncias ante COCONAD, política nacional contra la defraudación y contrabando y operativos interinstitucionales.',
  'Modernización e Infraestructura Aduanera': 'Proyectos de puestos fronterizos, Aduana Central (Complejo Lavarreda), tecnología RFID y equipos de inspección no intrusiva.',
  'Consultas Técnicas, Recursos y Valoración': 'Consultas técnicas aduaneras por escrito, recursos de revocatoria aduanera, compensaciones y subastas públicas.',

  // Comercio Exterior: Auxiliares especializados
  'Certificación y Operaciones OEA': 'Proceso de habilitación como Operador Económico Autorizado, auditorías de seguridad en cadena logística e instructivos.',
  'Envíos Rápidos y Paquetería': 'Normativa y procedimientos especiales para empresas de mensajería internacional courier y franquicias.',
  'Depósitos y Almacenes Fiscales': 'Régimen de almacenamiento bajo control fiscal aduanero, cobro por permanencia y trazabilidad de mercancías.',

  // Abogados y Notarios (4 Subtemas oficiales)
  'Habilitación y Registro Profesional': 'Inscripción y actualización en RTU como Abogado y Notario (CANG), registro de huella biométrica y activación en Agencia Virtual.',
  'Timbres Fiscales y Papel Sellado de Protocolo': 'Compra de Papel Sellado Especial para Protocolos (SAT-7130), timbres fiscales, razón electrónica en línea y retiro por procurador.',
  'Traspaso Electrónico Vehicular (e-Traspaso)': 'Habilitación en sistema TEV con firma electrónica avanzada, formalización notarial de compraventa y envío de expedientes digitales.',
  'Avisos Notariales ante la SAT': 'Presentación obligatoria de avisos de legalización de firmas, transferencias de dominio vehicular y calendario de plazos legales.',

  // Profesionales: Peritos Contadores
  'Habilitación y Registro de Perito Contador': 'Inscripción en RTU, habilitación de perito contador en Agencia Virtual, actualización y aviso de cese.',
  'Consultas, Retenciones y Libros Contables': 'Libro Electrónico Tributario (LET), planilla del IVA en FEL, consulta de retenciones y autoliquidación.',

  // Profesionales: Auditores (CPA)
  'Habilitación y Registro de Auditor (CPA)': 'Inscripción y actualización de Contadores Públicos y Auditores habilitados ante la SAT.',
  'Dictámenes de Crédito Fiscal y Auditoría': 'Registro de contadores y auditores autorizados para emitir dictámenes especiales de devolución de crédito fiscal.',

  // Profesionales: Gestores Tributarios
  'Acreditación y Carné Oficial de Gestor': 'Requisitos de inscripción, resoluciones oficiales, manual de herramientas y acreditación de gestores y auxiliares.',
  'Renovación y Gestión de Gafetes': 'Actualización de datos, reposición de gafetes oficiales, renovación anual y verificación pública de gestores activos.',

  // Profesionales: Servicios Profesionales
  'Facturación por Honorarios y Formularios': 'Emisión de facturas por servicios profesionales, retenciones aplicables y acceso a formularios de impuestos.',
  'Actualización de Actividad y RTU': 'Actualización de datos de actividad económica profesional y notificaciones en Agencia Virtual.',
  'Consultas Jurídico Tributarias': 'Procedimientos formales para plantear consultas jurídicas tributarias a la SAT y orientación legal.',
  'Sistemas de Retención en la Fuente': 'Operación en sistemas de retenciones web, retenciones de confianza y acreditaciones impositivas.',

  // Contribuyentes: Pequeños Contribuyentes
  'Régimen de Pequeño Contribuyente': 'Inscripción, facturación FEL, declaración mensual de tarifa fija del 5% y consulta de estado de NIT.',
  'Régimen Agropecuario y Productores': 'Régimen especial para productores agropecuarios, artesanales y de reciclaje con tarifas reducidas.',

  // Contribuyentes: Especiales
  'Gerencias Especiales y Control Tributario': 'Gestiones diferenciadas ante las gerencias de medianos y grandes contribuyentes especiales y agentes de retención.',
  'Declaraciones e Informes Especiales': 'Declaraciones de ISR transporte internacional, alcoholes y bebidas, e informes electrónicos de compras y ventas.',
  'Capacitación y Orientación Diferenciada': 'Cursos especializados para agentes de retención y normativa para contribuyentes bajo control intensivo.',

  // Organismos Especiales
  'Centros Educativos y Universidades': 'Inscripción y actualización en RTU de universidades y colegios, exenciones y actividades formativas.',
  'Iglesias y Comunidades Religiosas': 'Registro y actualización de entidades religiosas y reconocimiento de exención tributaria.',
  'Registro y Exenciones Municipales': 'Inscripción de municipalidades, actualización y emisión de constancias de exención del IVA (CIVA).',
  'Vehículos y Patrimonio Municipal': 'Gestión de placas oficiales, traspasos adjudicados y bajas de vehículos de corporaciones municipales.',
  'Vehículos por orden de autoridad (Ministerio Público / Organismo Judicial)': 'Bajas, reactivaciones y traspasos ordenados por tribunales judiciales o fiscalías.',
  'Gestión institucional y RTU estatal': 'Acreditación de dependencias de ministerios, entes descentralizados y nombramientos de representantes públicos.',

  // NIT sin Obligaciones
  'Inscripción de NIT': 'Solicitud de inscripción al Número de Identificación Tributaria (NIT) para personas individuales sin actividad mercantil y actualización de datos de identificación.',
  'Servicios en Línea y Solvencias': 'Habilitación de Agencia Virtual, solicitud de Solvencia Fiscal, cita previa y consulta de expedientes.',
  'Títulos Universitarios': 'Registro de títulos a nivel medio y universitario para habilitación profesional y consulta con código QR.',
  'Información Pública': 'Solicitud formal y consulta de información pública de oficio de la SAT conforme al Decreto 57-2008.',
  'Pequeño Contribuyente': 'Inscripción en régimen de pequeño contribuyente, emisión de factura electrónica FEL y declaración mensual SAT-2046.',
  'Primario': 'Régimen especial agropecuario para productores primarios de granos, hortalizas y frutas sin intermediarios.',
  'Pecuario': 'Régimen especial agropecuario para actividades de ganadería, avicultura y crianza de animales.',
  'RTU e Inscripción': 'Inscripción de sociedades mercantiles, actualización de datos, nombramientos de representantes y cese de actividades.',
  'Obligaciones y Regímenes': 'Declaraciones juradas de IVA e ISR, retenciones, facturación FEL y autorizaciones de regímenes contables.',
  'Registro Fiscal de Vehículos': 'Inscripción de vehículos, e-traspasos, calcomanías, pago de impuesto de circulación ISCV y placas.',
  'Capacitación y Cultura Tributaria': 'Cursos virtuales por impuesto, herramientas electrónicas, biblioteca tributaria y formación ciudadana.',
  'Devoluciones y Créditos Fiscales': 'Solicitud de devolución de crédito fiscal de IVA, devolución de ISR para asalariados y pagos indebidos.',
  'Servicios al Contribuyente': 'Constancias del RTU, habilitación de libros contables, atención de citas y corrección de formularios.',
  'Consultas y Verificadores': 'Verificadores públicos de solvencias, documentos con firma electrónica y consulta de omisos.'
};

export const SegmentTramitesCatalog: React.FC<SegmentTramitesCatalogProps> = ({
  segmentId,
  initialCategory,
  initialSubcategory,
  initialEtapaAto = 'todas',
  initialTipoInteraccion = 'todos',
  allTramites,
  onSelectTramite,
  onBackToHome,
  onSwitchSegment
}) => {
  const [internalQuery, setInternalQuery] = useState('');

  // Categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory && initialCategory !== 'Todas las categorías' ? initialCategory : null
  );

  // Subcategoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory || null);

  useEffect(() => {
    if (initialCategory && initialCategory !== 'Todas las categorías') {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory(null);
    }
    if (initialSubcategory !== undefined) {
      setSelectedSubcategory(initialSubcategory || null);
    }
  }, [initialCategory, initialSubcategory, segmentId]);

  // Sincronización con window.location.hash para Deep Linking en GitHub Pages
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('segmento', segmentId);
    if (selectedCategory) params.set('categoria', categoriaId(segmentId, selectedCategory));
    if (selectedCategory && selectedSubcategory) {
      params.set('subcategoria', subcategoriaId(categoriaId(segmentId, selectedCategory), selectedSubcategory));
    }

    const targetHash = '#/catalogo?' + params.toString();
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [segmentId, selectedCategory, selectedSubcategory]);

  const meta = SEGMENT_METADATA[segmentId];
  const cardTone = SEGMENT_CARD_TONE[segmentId];

  // Trámites del segmento actual (leídos directamente de allTramites consolidado)
  const segmentTramites = useMemo(() => {
    return allTramites.filter(t => t.pillar === segmentId);
  }, [allTramites, segmentId]);

  // Categorías disponibles dentro del segmento actual
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    segmentTramites.forEach(t => {
      if (t.categoria) set.add(t.categoria);
    });
    const orderList = OFFICIAL_CATEGORY_ORDER[segmentId] || [];
    return Array.from(set).sort((a, b) => {
      const idxA = orderList.indexOf(a);
      const idxB = orderList.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [segmentTramites, segmentId]);

  // Subcategorías disponibles dentro de la categoría seleccionada
const subcategoriesList = useMemo(() => {
    if (!selectedCategory) return [];
    const inCurrentCategory = segmentTramites.filter(t => t.categoria === selectedCategory);
    const set = new Set<string>();
    inCurrentCategory.forEach(t => {
      if (t.subcategoria) set.add(t.subcategoria);
    });

    const orderList = subcategoryOrderFor(selectedCategory);
    return Array.from(set).sort((a, b) => compareByCategoryOrder(orderList, a, b));
  }, [segmentTramites, selectedCategory]);

  // Lista estructurada de categorías y subcategorías para el Sidebar contextual
  const sidebarCategories = useMemo<SidebarCategory[]>(() => {
    return categoriesList.map((catName) => {
      const subs = Array.from(
        new Set(
          segmentTramites
            .filter((t) => t.categoria === catName && t.subcategoria && t.subcategoria !== catName)
            .map((t) => t.subcategoria)
        )
      ).sort();
      return {
        name: catName,
        count: segmentTramites.filter((t) => t.categoria === catName).length,
        subcategories: subs,
      };
    });
  }, [categoriesList, segmentTramites]);

  // Trámites finales (filtrados por subcategoría o búsqueda directa)
  // Regla de Umbral de Densidad: categorías con subcategoría única o compactada exponen sus trámites directamente
  const currentTramites = useMemo(() => {
    let list: TramiteItem[] = [];

    if (internalQuery.trim()) {
      const q = internalQuery.toLowerCase();
      list = segmentTramites.filter(t =>
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.tramite && t.tramite.toLowerCase().includes(q)) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(q)) ||
        (t.subcategoria && t.subcategoria.toLowerCase().includes(q)) ||
        (t.categoria && t.categoria.toLowerCase().includes(q))
      );
    } else if (selectedCategory) {
      if (selectedSubcategory) {
        list = segmentTramites.filter(
          t => t.categoria === selectedCategory && t.subcategoria === selectedSubcategory
        );
      } else if (subcategoriesList.length <= 1) {
        // Regla de Umbral de Densidad: categoría compactada muestra sus trámites directamente
        list = segmentTramites.filter(t => t.categoria === selectedCategory);
      } else {
        return [];
      }
    } else {
      return [];
    }

    // Ordenamiento canónico oficial (orden_n1..orden_n5, orden_contenido y ciclo de vida ATO)
    return [...list].sort(compareCanonicalTramiteOrder);
  }, [segmentTramites, selectedCategory, selectedSubcategory, subcategoriesList, internalQuery]);

  // Navegación limpia de migas de pan
  const handleResetToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setInternalQuery('');
  };

  const handleResetToSubcategories = () => {
    setSelectedSubcategory(null);
    setInternalQuery('');
  };

  // Renderizador unificado de tarjeta de gestión con diseño Plain Language y badges oficiales
  const renderTramiteCard = (tramite: TramiteItem) => {
    const badges = (
      <>
        {tramite.tipoInteraccion && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:bg-white/20 group-hover:text-white ${
            tramite.tipoInteraccion === 'servicio_transaccional'
              ? 'bg-sat-azul/10 text-sat-azul border border-sat-azul/20'
              : tramite.tipoInteraccion === 'consulta_datos'
                ? 'bg-[#059669]/10 text-[#059669] border border-[#059669]/20'
                : tramite.tipoInteraccion === 'descarga_recurso'
                  ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20'
                  : 'bg-sat-fondo-medio/70 text-sat-texto-suave border border-sat-gris/60'
          }`}>
            {tramite.tipoInteraccion === 'servicio_transaccional' && 'Gestión en Línea'}
            {tramite.tipoInteraccion === 'consulta_datos' && 'Consulta BD'}
            {tramite.tipoInteraccion === 'guia_informativa' && 'Guía'}
            {tramite.tipoInteraccion === 'descarga_recurso' && 'Descarga'}
          </span>
        )}

        {tramite.esBrecha && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#C25E00]/10 text-[#C25E00] border border-[#C25E00]/30 transition-colors group-hover:bg-white group-hover:text-[#C25E00]">
            Propuesta normativa SAT
          </span>
        )}
      </>
    );

    return (
      <Card
        key={tramite.id}
        title={tramite.tramite}
        description={tramite.descripcion}
        tone={cardTone}
        headingLevel="h3"
        onClick={() => onSelectTramite(tramite)}
        badges={badges}
        footer={
          <>
            <span className="truncate flex items-center gap-1.5 font-mono text-[11px] text-sat-texto-suave">
              <span className="font-bold text-sat-azul-oscuro">{tramite.id}</span>
              <span aria-hidden="true" className="text-sat-gris">·</span>
              <span className="truncate">{tramite.categoria} {tramite.subcategoria ? `› ${tramite.subcategoria}` : ''}</span>
            </span>
            <span className="font-bold flex items-center gap-1 shrink-0 text-xs">
              Ver detalle →
            </span>
          </>
        }
      />
    );
  };

  return (
    <div className="pt-2.5 sm:pt-3.5 pb-8 bg-white min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">

        {/* -----------------------------------------------------------------
         * MIGA DE PAN LIMPIA (Componente oficial Breadcrumbs SAT)
         * ----------------------------------------------------------------- */}
        <div className="pb-2 sm:pb-2.5 border-b border-sat-gris">
          <Breadcrumbs
            includeHome
            onHomeClick={onBackToHome}
            items={[
              {
                label: meta.title,
                onClick: handleResetToCategories,
                isCurrent: !selectedCategory && !internalQuery,
              },
              ...(selectedCategory
                ? [
                    {
                      label: selectedCategory,
                      onClick: handleResetToSubcategories,
                      isCurrent: (!selectedSubcategory || selectedSubcategory === selectedCategory || subcategoriesList.length <= 1) && !internalQuery,
                    },
                  ]
                : []),
              ...(selectedSubcategory && selectedSubcategory !== selectedCategory && subcategoriesList.length > 1
                ? [
                    {
                      label: selectedSubcategory,
                      isCurrent: true,
                    },
                  ]
                : []),
            ]}
          />
        </div>

        {/* -----------------------------------------------------------------
         * CABECERA DEL SEGMENTO CON BUSCADOR
         * ----------------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {meta.shortTitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">
              {internalQuery
                ? `Resultados para "${internalQuery}"`
                : (selectedSubcategory && selectedSubcategory !== selectedCategory && subcategoriesList.length > 1)
                  ? selectedSubcategory
                  : selectedCategory
                    ? selectedCategory
                    : meta.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-3xl leading-relaxed">
              {internalQuery
                ? `Gestiones encontradas en ${meta.shortTitle}.`
                : (selectedSubcategory && selectedSubcategory !== selectedCategory && subcategoriesList.length > 1)
                  ? (SUBCATEGORY_DESCRIPTIONS[selectedSubcategory] || 'Selecciona la gestión para ver sus requisitos y pasos normados.')
                  : selectedCategory
                    ? (CATEGORY_DESCRIPTIONS[selectedCategory] || meta.desc)
                    : meta.desc}
            </p>
          </div>

          {/* Buscador reactivo dentro del segmento */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              placeholder="Buscar en este segmento..."
              aria-label={`Buscar gestiones en ${meta.shortTitle}`}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-sat-gris rounded-xl focus:border-sat-azul focus:ring-1 focus:ring-sat-azul outline-none"
            />
          </div>
        </div>

        {/* -----------------------------------------------------------------
         * VISTA 1: BÚSQUEDA DIRECTA (Si el usuario escribió algo en el input)
         * ----------------------------------------------------------------- */}
        {internalQuery.trim() ? (
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-sat-gris">
              <h2 className="text-sm font-bold text-sat-azul-oscuro">
                Gestiones coincidentes ({currentTramites.length})
              </h2>
              <button
                onClick={() => setInternalQuery('')}
                className="text-xs font-bold text-sat-azul hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>

            {currentTramites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {currentTramites.map(renderTramiteCard)}
              </div>
            ) : (
              <Alert tone="info" title="No se encontraron gestiones">
                Intenta buscar con otros términos como NIT, RTU, Vehículos, DUCA o Facturas.
              </Alert>
            )}
          </div>
        ) : (
          /* -----------------------------------------------------------------
           * NAVEGACIÓN JERÁRQUICA EN TARJETAS (LEY DE MILLER)
           * ----------------------------------------------------------------- */
          <>
            {/* =============================================================
             * VISTA DE CATEGORÍAS / CLASIFICACIONES (Sin títulos redundantes)
             * ============================================================= */}
            {!selectedCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {categoriesList.map((catName) => {
                  const desc = CATEGORY_DESCRIPTIONS[catName] || 'Explora las gestiones y obligaciones agrupadas en esta clasificación oficial.';

                  return (
                    <Card
                      key={catName}
                      title={catName}
                      description={desc}
                      tone={cardTone}
                      headingLevel="h2"
                      onClick={() => {
                        setSelectedCategory(catName);
                        setSelectedSubcategory(null);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* =============================================================
             * VISTA PROFUNDA: SIDEBAR CONTEXTUAL + CONTENIDO (NIVEL 4+)
             * ============================================================= */}
            {selectedCategory && (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <SidebarNav
                  segmentTitle={meta.title}
                  segmentShortTitle={meta.shortTitle}
                  segmentColor={meta.color}
                  categories={sidebarCategories}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory(null);
                  }}
                  onSelectSubcategory={(cat, sub) => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory(sub);
                  }}
                  onResetToSegment={handleResetToCategories}
                />

                <div className="flex-1 min-w-0 w-full">
                  {!selectedSubcategory && subcategoriesList.length > 1 ? (
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                          Subtemas de {selectedCategory} ({subcategoriesList.length})
                        </h2>
                        <button
                          onClick={handleResetToCategories}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Volver a {meta.shortTitle}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
                        {subcategoriesList.map((subName) => {
                          const desc = SUBCATEGORY_DESCRIPTIONS[subName] || 'Consulta las gestiones específicas y requisitos correspondientes.';

                          return (
                            <Card
                              key={subName}
                              title={subName}
                              description={desc}
                              tone={cardTone}
                              headingLevel="h3"
                              onClick={() => setSelectedSubcategory(subName)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                          Servicios y gestiones ({currentTramites.length})
                        </h2>
                        {subcategoriesList.length > 1 ? (
                          <button
                            onClick={handleResetToSubcategories}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Volver a subtemas</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleResetToCategories}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Volver a {meta.shortTitle}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
                        {currentTramites.map(renderTramiteCard)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
