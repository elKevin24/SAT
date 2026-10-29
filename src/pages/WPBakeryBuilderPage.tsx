import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Search,
  ArrowLeft,
  ArrowRight,
  FileCode2,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  FolderTree,
  Paintbrush,
  Square,
  CheckSquare,
  Download
} from 'lucide-react';
import rawTramites from '../data/allTramites.json';
import { assertTramites, TramiteItem } from '../data/schema';
import { compareCanonicalTramiteOrder } from '../data/categoryOrder';
import wpCssRaw from '../../docs/diseno-normativa/sat-design-system-wpbakery.css?raw';
import wpHomeRaw from '../../docs/plantillas-wpbakery/HOME_portada-portal-sat.txt?raw';
import wpSolicitarNitRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_solicitar-nit.txt?raw';
import wpActualizarRtuRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_actualizar-rtu.txt?raw';
import wpFelRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_factura-electronica-fel.txt?raw';
import wpSolvenciaRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_solvencia-fiscal.txt?raw';
import wpTraspasoRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_traspaso-vehiculos.txt?raw';
import wpPadronImpRaw from '../../docs/plantillas-wpbakery/procesos-conectados/G_padron-importadores.txt?raw';
import wpXmlOlas012Raw from '../../docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml?raw';
import wpXmlAll160Raw from '../../docs/plantillas-wpbakery/wordpress-import-completo-160.xml?raw';
import wpXmlCgN3Raw from '../../docs/plantillas-wpbakery/wordpress-import-contribuyente-general-n3.xml?raw';
import wpXmlCgCompletoRaw from '../../docs/plantillas-wpbakery/wordpress-import-contribuyente-general-completo.xml?raw';
import wpXmlOceRestanteRaw from '../../docs/plantillas-wpbakery/wordpress-import-comercio-exterior-restante.xml?raw';
import wpXmlOceCompletoRaw from '../../docs/plantillas-wpbakery/wordpress-import-comercio-exterior-completo.xml?raw';

const allTramites = assertTramites(rawTramites);

const N1_SLUGS: Record<string, string> = {
  Contribuyentes: 'contribuyentes',
  'Operadores de Comercio Exterior': 'operadores-de-comercio-exterior',
  Profesionales: 'profesionales',
  'Entes Exentos': 'entes-exentos',
};

const CSS_CLASS_BY_N1: Record<string, string> = {
  Contribuyentes: 'sat-seccion-contribuyentes',
  'Operadores de Comercio Exterior': 'sat-seccion-comercio-exterior',
  Profesionales: 'sat-seccion-profesionales',
  'Entes Exentos': 'sat-seccion-entes-exentos',
};

const HOVER_COLOR_BY_N1: Record<string, string> = {
  Contribuyentes: '#14649B',
  'Operadores de Comercio Exterior': '#0284C7',
  Profesionales: '#4D8014',
  'Entes Exentos': '#C25E00',
};

export function getPageSpecificCss(n1: string, _pageTitle?: string): string {
  const hoverColor = HOVER_COLOR_BY_N1[n1] || '#14649B';
  const sectionClass = CSS_CLASS_BY_N1[n1] || 'sat-seccion-contribuyentes';
  const shadowColor =
    n1 === 'Contribuyentes'
      ? 'rgba(20, 100, 155, 0.22)'
      : n1 === 'Operadores de Comercio Exterior'
      ? 'rgba(2, 132, 199, 0.22)'
      : n1 === 'Profesionales'
      ? 'rgba(77, 128, 20, 0.22)'
      : 'rgba(194, 94, 0, 0.22)';

  const headerTitle =
    n1 === 'Contribuyentes'
      ? 'SECCIÓN CONTRIBUYENTES (AZUL SAT #14649B)'
      : `SECCIÓN ${n1.toUpperCase()} (${hoverColor})`;

  return `/* ==================================================
   ${headerTitle}
   ================================================== */

/* 0. Contenedor centrado idéntico al diseño original (independiente de Elementor Full Width) */
.wpb-content-wrapper,
.entry-content {
    max-width: 1200px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    box-sizing: border-box !important;
}

/* 1. La Fila: obliga a las 3 columnas a alinearse en una sola línea horizontal recta */
.${sectionClass}.vc_row {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: stretch !important;
    margin-left: -8px !important;
    margin-right: -8px !important;
}

/* 2. Cada Columna de WPBakery: 33.33% de ancho exacto (3 columnas por fila) */
.${sectionClass} > .vc_column_container {
    display: flex !important;
    flex-direction: column !important;
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
    width: 33.333333% !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    margin-bottom: 16px !important;
    box-sizing: border-box !important;
}

/* Responsivo: 2 columnas en Tablet */
@media (max-width: 991px) {
    .${sectionClass} > .vc_column_container {
        flex: 0 0 50% !important;
        max-width: 50% !important;
        width: 50% !important;
    }
}

/* Responsivo: 1 columna en Celular */
@media (max-width: 640px) {
    .${sectionClass} > .vc_column_container {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        width: 100% !important;
    }
}

/* 3. Contenedores internos de WPBakery: estirar al 100% */
.${sectionClass} .vc_column-inner,
.${sectionClass} .wpb_wrapper {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}

/* 4. Estructura de Info Box: ocupar todo el ancho disponible de la columna */
.${sectionClass} .aio-icon-component,
.${sectionClass} .aio-icon-box-link {
    display: flex !important;
    flex: 1 1 auto !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* 5. La Tarjeta SAT Oficial (Ancha, fondo gris suave, sin bordes) */
.${sectionClass} .aio-icon-box {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    position: relative !important;

    width: 100% !important;
    height: 100% !important;
    min-height: 140px !important;

    background-color: #F4F6F9 !important; /* Gris suave oficial */
    border: none !important;              /* Cero bordes */
    border-radius: 12px !important;       /* Esquinas redondas */
    padding: 22px 24px !important;
    margin: 0 !important;
    box-sizing: border-box !important;

    cursor: pointer !important;
    user-select: none !important;

    /* Animación suave */
    transition: transform 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease !important;
}

/* 6. Hover Azul Oficial de Contribuyentes (#14649B) */
.${sectionClass} .aio-icon-box:hover {
    background-color: ${hoverColor} !important; /* Azul SAT Oficial */
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 24px ${shadowColor} !important;
}

/* 7. Cabecera y Chevron Oficial a la derecha */
.${sectionClass} .aio-icon-header {
    margin: 0 !important;
    padding-right: 24px !important;
    text-align: left !important;
}

.${sectionClass} .aio-icon-box::after {
    content: "" !important;
    position: absolute !important;
    top: 24px !important;
    right: 22px !important;
    width: 18px !important;
    height: 18px !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-size: contain !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E") !important;
    transition: background-image 0.2s ease !important;
}

.${sectionClass} .aio-icon-box:hover::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E") !important;
}

/* 8. Título Institucional */
.${sectionClass} .aio-icon-title {
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
    font-family: "Gotham", "Montserrat", sans-serif, -apple-system !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    line-height: 1.35 !important;
    color: #19324B !important;
    transition: color 0.25s ease !important;
}

/* 9. Descripción en Lenguaje Claro */
.${sectionClass} .aio-icon-description {
    margin-top: 8px !important;
    padding: 0 !important;
    text-align: left !important;
    font-family: "Gotham", "Montserrat", sans-serif, -apple-system !important;
    font-size: 12.5px !important;
    line-height: 1.55 !important;
    color: #475569 !important;
    flex-grow: 1 !important;
    transition: color 0.25s ease !important;
}

/* 10. Textos a blanco puro en Hover */
.${sectionClass} .aio-icon-box:hover .aio-icon-title {
    color: #FFFFFF !important;
}
.${sectionClass} .aio-icon-box:hover .aio-icon-description {
    color: rgba(255, 255, 255, 0.92) !important;
}`;
}

const CURATED_DESCRIPTIONS: Record<string, string> = {
  'Sin Obligaciones': 'Obtén tu primer Número de Identificación Tributaria (NIT), actualiza tus datos personales, emite tu Solvencia Fiscal o registra tu título universitario sin tener negocio activo.',
  'Pequeños Contribuyentes': 'Factura Electrónica en Línea (FEL), declaraciones mensuales del 5%, régimen electrónico y facilidades para productores del sector primario.',
  'Contribuyente General': 'Inscripción y actualización en el Registro Tributario Unificado (RTU), Factura Electrónica en Línea (FEL), declaraciones de IVA e ISR, vehículos y servicios al contribuyente.',
  'Contribuyentes Especiales': 'Atención especializada en gerencias diferenciadas, informes de precios de transferencia, estados financieros auditados y cumplimiento corporativo.',
  Importadores: 'Inscripción en el padrón de importadores, Declaración Única Centroamericana (DUCA - Aduanas), despacho, levante e importación de vehículos.',
  Exportadores: 'Padrón de exportadores, declaraciones aduaneras de embarque y solicitud de devolución de crédito fiscal del Impuesto al Valor Agregado (IVA).',
  'Operador Económico Autorizado (OEA)': 'Certificación en seguridad logística de la cadena de suministro y beneficios de facilitación aduanera.',
  'Auxiliares de la Función Pública Aduanera (AFPA)': 'Habilitación, carnés, fianzas y operaciones para agentes aduaneros, apoderados, depósitos, couriers y transportistas.',
  'Regímenes Territoriales y Zonas Especiales': 'Operación aduanera y fiscal para empresas calificadas bajo Maquilas (Decreto 29-89) y Zonas de Desarrollo Económico Especial Público (ZDEEP).',
  'Normativa y Operaciones Aduaneras Generales': 'Consulta del Sistema Arancelario Centroamericano (SAC), acuerdos comerciales, prevención de contrabando, criterios técnicos y modernización aduanera.',
  'Abogados y Notarios': 'Habilitación notarial, compra de papel sellado de protocolo, timbres fiscales, traspaso electrónico vehicular (e-Traspaso) y avisos notariales.',
  'Peritos Contadores': 'Inscripción y actualización en el registro de peritos contadores, autorización de libros contables y consultas de retenciones.',
  Auditores: 'Habilitación de Contador Público y Auditor (CPA), emisión de dictámenes de crédito fiscal y solvencia para auditorías tributarias.',
  'Gestores Tributarios': 'Acreditación oficial, emisión y renovación anual de carnés y gafetes para realizar gestiones en representación de terceros.',
  'Servicios Profesionales': 'Facturación electrónica por honorarios, actualización de actividad profesional en el Registro Tributario Unificado (RTU), consultas vinculantes y sistemas de retención.',
  'Entidades del Estado': 'Unidades ejecutoras estatales en el Registro Tributario Unificado (RTU), Factura Electrónica en Línea (FEL), retenciones en compras públicas, solvencias y parque vehicular oficial.',
  Constitucionales: 'Registro, exenciones de impuestos, constancias y vehículos para centros educativos, universidades, iglesias y confederaciones deportivas.',
  'No Lucrativos': 'Inscripción en el Registro Tributario Unificado (RTU), reconocimiento de exención de impuestos, constancias de exención del IVA (CIVA) y actualización de asociaciones.',
  Municipalidades: 'Registro de corporaciones municipales y autoridades ediles en el Registro Tributario Unificado (RTU), exención para flotillas municipales y solvencias institucionales.',
  Decreto: 'Exenciones y franquicias para misiones diplomáticas, organismos internacionales, cooperativas, partidos políticos y donaciones oficiales.',
  'Registro y Padrón de Importadores': 'Inscripción y activación en el padrón de importadores, requisitos previos para importar mercancías y guías del Programa de Modernización Integral Aduanera (MIAD).',
  'Declaraciones Aduaneras y DUCAs': 'Preparación de documentos de soporte, transmisión de la Declaración Única Centroamericana (DUCA - Aduanas), pólizas con fianza y verificación de pago en línea.',
  'Despacho Aduanero, Levante y Selectivo': 'Gestiones anticipadas, consulta del semáforo de selectivo aduanero, puestos de control interinstitucional (PCI) y operaciones de levante en recinto.',
  'Importación y Nacionalización de Vehículos': 'Requisitos para ingresar vehículos por aduana, permisos de internación temporal, consulta de tablas de valores imponibles y cálculo del Impuesto al Valor Agregado (IVA).',
  'Mercancías en Abandono, Depósitos y Franquicias': 'Solicitudes de franquicia electrónica, declaración regional de viajero, rescate de mercancías en abandono tácito y devolución de depósitos aduanales.',
  'Padrón y Registro de Exportadores': 'Inscripción en el padrón de exportadores, permisos de exportación temporal u ocasional y registro ante la Ventanilla Única para las Exportaciones (VUPE).',
  'Declaraciones Aduaneras y Embarques': 'Transmisión de declaraciones simplificadas y complementarias de exportación (DUCA), control de listas de embarque y cierre de operaciones aduaneras.',
  'Devolución de Crédito Fiscal': 'Inscripción y solicitud de devolución de crédito fiscal del Impuesto al Valor Agregado (IVA) para exportadores en régimen especial, optativo, general y en línea.',
  'Agentes Aduaneros': 'Autorización, actualización anual, fianzas de garantía, emisión de carné e instalación del componente de firma electrónica para agentes aduaneros.',
  'Apoderados Especiales Aduaneros': 'Acreditación para representar a empresas e instituciones ante el servicio aduanero, constitución de garantías, operaciones de despacho y normativa técnica.',
  'Depósitos Aduaneros': 'Habilitación y renovación de depósitos aduaneros públicos, privados y temporales, almacenes fiscales, control de inventarios, saldos afianzados y normativa.',
  'Empresas de Entrega Rápida o Courier': 'Requisitos de habilitación, constitución de garantías y transmisión de manifiestos expresos para empresas de entrega rápida o courier.',
  'Transportistas Aduaneros': 'Registro de medios de transporte y contenedores bajo el Régimen de Admisión Temporal de Contenedores (ATC), manifiestos de carga (CUSCAR) y marchamo electrónico.',
  'Maquilas (Decreto 29-89)': 'Inscripción de resolución del Ministerio de Economía (MINECO), fianzas, operación de cuentas corrientes de insumos, descargos y tratamiento de desperdicios.',
  'Zonas de Desarrollo Económico Especial Público (ZDEEP)': 'Habilitación de zonas especiales y empresas usuarias, control de ingreso y egreso de carga en garita, operación en zonas francas y marco normativo.',
  'Arancel Centroamericano (SAC) y Permisos': 'Consulta del Sistema Arancelario Centroamericano (SAC) integrado, contingentes arancelarios, permisos no arancelarios y valoración de mercancías.',
  'Acuerdos Comerciales y Facilitación': 'Tratados de libre comercio vigentes, certificación de origen de mercancías, resoluciones anticipadas y programas de facilitación del comercio exterior.',
  'Prevención de Contrabando y Defraudación': 'Denuncias confidenciales, control en puestos interinstitucionales y acciones del Consejo Interinstitucional para la Prevención y Combate a la Defraudación Fiscal y al Contrabando Aduanero (COINCON).',
  'Consultas Técnicas, Recursos y Valoración': 'Consultas técnicas vinculantes sobre clasificación arancelaria y origen, seguimiento de expedientes aduaneros y presentación de recursos administrativos.',
  'Modernización e Infraestructura Aduanera': 'Avances del Programa de Modernización Integral Aduanera (MIAD), puestos fronterizos integrados, tecnología de revisión no intrusiva y estadísticas de comercio exterior.',
  'Preparación y Documentos de Soporte': 'Declaración del valor en aduana de las mercancías y manual operativo para la digitalización de documentos de soporte bajo Aduana sin Papeles.',
  'Transmisión de la Declaración de Mercancías': 'Transmisión electrónica de la Declaración Única Centroamericana (DUCA), pólizas de importación general y declaraciones caucionadas con fianza.',
  'Verificación y Seguimiento de Declaraciones': 'Consulta en línea del estado de pago y validación de declaraciones centroamericanas (DUCA-F y FAUCA) en el país de destino.',
  'Gestiones anticipadas': 'Presentación anticipada de declaraciones para análisis de riesgo, entrega de documentos de envíos parciales y solicitud de distintivos de control.',
  'Puestos de control, trazabilidad y facilitación': 'Verificación de mercancías en Puestos de Control Interinstitucional (PCI), trazabilidad de despachos y medidas de facilitación operativa.',
  'Operaciones en recinto, selectivo y levante': 'Consulta en tiempo real del semáforo de selectivo aduanero, programación de revisión física en rampa y seguimiento de expedientes en aduana.',
  'Gestiones de importación y registro': 'Requisitos y documentos para importar vehículos nuevos o usados, liquidación de pólizas y permisos de internación temporal para turistas.',
  'Tablas de valores y cálculo de impuestos': 'Consulta en línea de las tablas oficiales de valores imponibles para vehículos usados y cálculo del Impuesto al Valor Agregado (IVA) de importación.',
  'Franquicias y menor cuantía': 'Solicitud de franquicias electrónicas exentas de tributos, Declaración Jurada Regional de Viajero y despacho simplificado de menor cuantía.',
  'Rescate de mercancías y devoluciones': 'Recuperación de mercancías en abandono tácito, recepción de seguros de caución y devolución de depósitos o tributos arancelarios pagados en exceso.',
  'Acreditación, Garantías y Habilitación': 'Autorización para actuar como apoderado especial aduanero, renovación de fianzas operativas, emisión de carné y solvencia fiscal anual.',
  'Operaciones de Despacho y Consultas': 'Transmisión de declaraciones aduaneras (DUCA), consulta de retenciones y liberaciones en rampa y seguimiento de expedientes en gestión aduanera.',
  'Procedimientos, Normativa y Capacitación': 'Guías operativas, legislación aduanera aplicable, programas de capacitación técnica y atención de audiencias o recursos administrativos.',
  'Habilitación de recintos y garantías': 'Requisitos para autorizar y delimitar recintos de depósito aduanero, constitución de seguros de caución, renovación anual y solvencia fiscal.',
  'Habilitación y garantías': 'Renovación de operaciones para almacenes generales de depósito, registro de títulos de crédito afianzados, pólizas de caución y carné de auxiliar.',
  'Almacenes Fiscales': 'Requisitos de autorización, control de inventarios y operación aduanera para almacenes fiscales vinculados a almacenes generales de depósito.',
  'Normativa y asistencia': 'Marco legal aplicable (CAUCA, RECAUCA y leyes especiales), guías operativas de aduanas, capacitaciones y resolución de dudas frecuentes.',
  'Operación y control de mercancías': 'Control de descarga y recepción de bultos, admisión temporal de contenedores, cobro por permanencia y consultas de selectivo y rampa.',
  'Operación y saldos afianzados': 'Reporte electrónico de saldos y existencias afianzadas, declaraciones DUCA, consulta de convenios de pago y requerimientos del Programa MIAD.',
  'Equipo de Carga y Contenedores – Régimen ATC': 'Registro y control de contenedores bajo el Régimen de Admisión Temporal de Contenedores (ATC), prórrogas de permanencia y solvencia de fianzas.',
  'Despacho y Operaciones en Recintos': 'Consultas operativas de arribo, retención y liberación en rampa, estado de sistemas informáticos de aduanas y seguimiento de expedientes.',
  'Manifiestos de Carga y CUSCAR': 'Transmisión electrónica del manifiesto de carga (CUSCAR), guías de tránsito internacional y lineamientos del Programa de Modernización Integral Aduanera (MIAD).',
  'Monitoreo en Ruta y Marchamo Electrónico': 'Control de tránsitos aduaneros mediante marchamo electrónico con GPS, rutas fiscales autorizadas y tiempos de recorrido entre aduanas.',
  'Infracciones y Defensa Aduanera': 'Legislación aduanera aplicable al transporte de carga y procedimientos para atender audiencias, sanciones y recursos administrativos.',
  'Inscripción y garantías': 'Registro de la resolución de calificación del Ministerio de Economía (MINECO), apertura de cuenta corriente de insumos y validación de pólizas de fianza.',
  'Operación y descargos': 'Transmisión de declaraciones de admisión temporal (DUCA), descargo periódico de cuentas corrientes insumo-producto y traspasos entre empresas calificadas.',
  'Cierre, desperdicios y normativa': 'Destrucción, donación o nacionalización de desperdicios de maquila, cancelación de cuenta corriente, liberación de fianzas y compendio del Decreto 29-89.',
  'Habilitación e infraestructura': 'Requisitos para delimitar y habilitar polígonos de Zonas de Desarrollo Económico Especial Público (ZDEEP), control de garitas y solvencia fiscal.',
  'Registro y habilitación de empresas': 'Inscripción de empresas usuarias calificadas en ZDEEP, habilitación en Factura Electrónica en Línea (FEL), solvencia fiscal y consulta de expedientes.',
  'Operación y control de carga': 'Control aduanero de ingreso y egreso de carga en garitas de ZDEEP, rutas fiscales, Puestos de Control Interinstitucional (PCI) y consultas de manifiestos.',
  'Operación y control en zonas francas': 'Declaraciones anticipadas y definitivas (DUCA), traslados de mercancías hacia y desde zonas especiales y control de inventarios de transformación.',
  'Consultas técnicas y criterios vinculantes': 'Solicitud de criterios técnicos vinculantes sobre clasificación arancelaria, valoración aduanera y normas de origen de las mercancías.',
  'Gestiones generales del operador': 'Servicios transversales de consulta de expedientes aduaneros, estado de declaraciones, facilidades de pago y monitoreo de sistemas informáticos.',
  'Recursos administrativos y defensa aduanera': 'Presentación de recursos de revisión y apelación, atención de audiencias de ajuste y defensa técnica ante la Intendencia de Aduanas.',
  'Infraestructura y puestos fronterizos': 'Operación en aduanas integradas y periféricas, Puestos de Control Interinstitucional (PCI) y modernización de infraestructura fronteriza.',
  'Tecnología y revisión no intrusiva': 'Equipos de inspección por rayos X y revisión no intrusiva, integración tecnológica en recintos y lineamientos del Programa MIAD.',
  'Transparencia, repositorio y estadísticas': 'Boletines estadísticos de recaudación y comercio exterior, repositorio documental de procedimientos aduaneros y portales de transparencia.',
};

const SOLICITAR_NIT_IDS = new Set(['SAT-GES-0001', 'SAT-GES-0011', 'SAT-GES-0049', 'SAT-GES-0050', 'SAT-GES-0051']);
const ACTUALIZAR_RTU_IDS = new Set([
  'SAT-GES-0002', 'SAT-GES-0040', 'SAT-GES-0054', 'SAT-GES-0068', 'SAT-GES-0069',
  'SAT-GES-0070', 'SAT-GES-0071', 'SAT-GES-0072', 'SAT-GES-0073', 'SAT-GES-0074',
  'SAT-GES-0075', 'SAT-GES-0076', 'SAT-GES-0115', 'SAT-GES-0118',
]);
const FEL_IDS = new Set(['SAT-GES-0319', 'SAT-GES-0498', 'SAT-GES-0581']);
const SOLVENCIA_FISCAL_IDS = new Set(['SAT-GES-0005', 'SAT-GES-0336', 'SAT-GES-0337']);
const TRASPASO_VEHICULOS_IDS = new Set(['SAT-GES-0269', 'SAT-GES-0318', 'SAT-GES-0568']);
const PADRON_IMPORTADORES_IDS = new Set(['SAT-GES-0344']);

function resolveLeafCardUrl(t: TramiteItem): { url: string; targetBlank: boolean } {
  const cid = t.id || t.codigo || '';
  if (SOLICITAR_NIT_IDS.has(cid)) return { url: '/solicitar-nit/', targetBlank: false };
  if (ACTUALIZAR_RTU_IDS.has(cid)) return { url: '/actualizar-rtu/', targetBlank: false };
  if (FEL_IDS.has(cid)) return { url: '/factura-electronica-fel/', targetBlank: false };
  if (SOLVENCIA_FISCAL_IDS.has(cid)) return { url: '/solvencia-fiscal/', targetBlank: false };
  if (TRASPASO_VEHICULOS_IDS.has(cid)) return { url: '/traspaso-vehiculos/', targetBlank: false };
  if (PADRON_IMPORTADORES_IDS.has(cid)) return { url: '/padron-importadores/', targetBlank: false };
  const url = t.url || '';
  return { url, targetBlank: Boolean(url) };
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

function cleanText(text: string): string {
  return (text || '')
    .replace(/\bTramitar\b/g, 'Gestionar')
    .replace(/\btramitar\b/g, 'gestionar')
    .replace(/\bTrámites\b/g, 'Gestiones')
    .replace(/\btrámites\b/g, 'gestiones')
    .replace(/\bTrámite\b/g, 'Gestión')
    .replace(/\btrámite\b/g, 'gestión')
    .replace(/"/g, '&quot;')
    .trim();
}

function isEmptyLevel(v?: string | null): boolean {
  if (!v) return true;
  const s = v.trim();
  return s === '' || s === '—' || s === '–' || s === '-';
}

function getNodeDesc(title: string, children: TramiteItem[]): string {
  if (CURATED_DESCRIPTIONS[title]) {
    return CURATED_DESCRIPTIONS[title];
  }
  const sample = children
    .slice(0, 3)
    .map(c => c.gestion || c.nombreActual || '')
    .filter(Boolean);
  if (sample.length > 0) {
    return `Incluye gestiones como: ${sample.join(', ')}.`;
  }
  return `Consulta los requisitos oficiales, pasos y servicios en línea para ${title}.`;
}

function encodeVcLink(url: string, targetBlank: boolean, basePath = ''): string {
  if (!url) return '';
  const cleanBase = basePath.trim().replace(/\/+$/, '');
  const isInternal = url.startsWith('/') && !url.startsWith('//');
  const fullUrl = isInternal
    ? `https://prototipo.sat.gob.gt${cleanBase}${url}`
    : url;
  if (isInternal && !targetBlank) {
    return `url:${encodeURIComponent(fullUrl)}`;
  }
  const enc = encodeURIComponent(fullUrl);
  return `url:${enc}||${targetBlank ? 'target:%20_blank|' : '|'}`;
}

export type CardShortcodeMode = 'bsf' | 'vc_core';

function applyBasePathAndModeToShortcode(
  shortcode: string,
  basePath: string,
  cardMode: CardShortcodeMode
): string {
  const cleanBase = basePath.trim().replace(/\/+$/, '');
  let out = shortcode;
  if (cleanBase) {
    const encBase = encodeURI(cleanBase).replace(/\//g, '%2F');
    out = out
      .replace(/link="url:%2F/g, `link="url:${encBase}%2F`)
      .replace(/link="url:\//g, `link="url:${cleanBase}/`);
  }
  if (cardMode === 'vc_core') {
    out = out.replace(
      /\[bsf-info-box[^\]]*title="([^"]*)"[^\]]*link="([^"]*)"[^\]]*\]([\s\S]*?)\[\/bsf-info-box\]/g,
      (_match, title: string, linkAttr: string, desc: string) => {
        let href = '#';
        let isBlank = false;
        if (linkAttr && linkAttr.startsWith('url:')) {
          const parts = linkAttr.slice(4).split('|');
          try {
            href = decodeURIComponent(parts[0] || '#');
          } catch {
            href = parts[0] || '#';
          }
          isBlank = linkAttr.includes('_blank');
        }
        const targetAttr = isBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `[vc_column_text el_class="sat-card"]<h3 class="sat-card-title"><a href="${href}"${targetAttr}>${title}</a></h3><p class="sat-card-desc">${desc}</p>[/vc_column_text]`;
      }
    );
  }
  return out;
}

function buildPageShortcode(
  cards: { title: string; desc: string; url: string; targetBlank: boolean }[],
  n1: string,
  _heading: string,
  _leadText: string,
  includeUrls: boolean,
  basePath = '',
  cardMode: CardShortcodeMode = 'bsf'
): string {
  const breadcrumb =
    '[vc_row][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]';

  const cols = cards
    .map((c, idx) => {
      const linkVal = includeUrls && c.url ? encodeVcLink(c.url, c.targetBlank, basePath) : '';
      const offsetAttr = idx === 0 ? ' offset="vc_col-xl-inherit vc_col-lg-inherit vc_col-md-4 vc_col-sm-inherit"' : '';
      return `[vc_column width="1/3"${offsetAttr}][bsf-info-box icon_size="32" title="${cleanText(c.title)}" read_more="box" link="${linkVal}"]${cleanText(c.desc)}[/bsf-info-box][/vc_column]`;
    })
    .join('');

  const sectionClass = CSS_CLASS_BY_N1[n1] || 'sat-seccion-contribuyentes';
  const raw = `${breadcrumb}[vc_section][vc_row gap="0px" el_class="${sectionClass}"]${cols}[/vc_row][/vc_section]`;
  return applyBasePathAndModeToShortcode(raw, '', cardMode);
}

export type OlaId = 'Todas' | 'Ola 0 (Portada + Universales)' | 'Ola 1 (Nivel 1)' | 'Ola 2 (Nivel 2)' | 'Ola 3 (Nivel 3)' | 'Ola 4 (Nivel 4)' | 'Ola 5 (Nivel 5)';

export interface WpPageTemplate {
  id: string;
  wave: OlaId;
  waveOrder: number;
  title: string;
  wpSlugOnly: string;
  levelLabel: 'Portada' | 'Proceso Conectado' | 'Nivel 1' | 'Nivel 2' | 'Nivel 3' | 'Nivel 4' | 'Nivel 5';
  n1: string;
  wpPath: string;
  parentPage: string;
  breadcrumbTrail: string;
  filePath: string;
  leadText: string;
  cards: { title: string; desc: string; url: string; targetBlank: boolean }[];
  staticShortcode?: string;
}

function buildAllWpPages(items: TramiteItem[]): WpPageTemplate[] {
  const sorted = [...items].sort(compareCanonicalTramiteOrder);
  const pages: WpPageTemplate[] = [
    {
      id: 'home-portada',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Inicio (Portada Portal SAT)',
      wpSlugOnly: 'inicio',
      levelLabel: 'Portada',
      n1: 'Contribuyentes',
      wpPath: '/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio',
      filePath: 'docs/plantillas-wpbakery/HOME_portada-portal-sat.txt',
      leadText: 'Gestiones, requisitos oficiales y servicios tributarios y aduaneros en línea.',
      cards: [
        { title: 'Contribuyentes', desc: 'Información y servicios tributarios para personas y empresas. Registro Tributario Unificado (RTU), pequeños contribuyentes, régimen general y vehículos.', url: '/contribuyentes/', targetBlank: false },
        { title: 'Operadores de Comercio Exterior', desc: 'Servicios e información aduanera. Importación, exportación, padrones, auxiliares de la función pública (AFPA) y declaraciones DUCA.', url: '/operadores-de-comercio-exterior/', targetBlank: false },
        { title: 'Profesionales', desc: 'Herramientas especializadas para auxiliares y profesionales tributarios. Abogados, notarios, peritos contadores, auditores y gestores.', url: '/profesionales/', targetBlank: false },
        { title: 'Entes Exentos', desc: 'Gestiones y normativa para entidades del Estado, centros educativos, misiones diplomáticas, ONGs y municipalidades.', url: '/entes-exentos/', targetBlank: false },
      ],
      staticShortcode: wpHomeRaw,
    },
    {
      id: 'proceso-solicitar-nit',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Solicitar Número de Identificación Tributaria (NIT)',
      wpSlugOnly: 'solicitar-nit',
      levelLabel: 'Proceso Conectado',
      n1: 'Contribuyentes',
      wpPath: '/solicitar-nit/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Solicitar Número de Identificación Tributaria (NIT)',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_solicitar-nit.txt',
      leadText: 'Obtén por primera vez tu Número de Identificación Tributaria (NIT) y activa tu usuario de Agencia Virtual en 3 pasos conectados (100% sin [vc_raw_html]).',
      cards: [
        { title: '1. Requisitos (4 Modalidades + Regla DPI Físico)', desc: 'Verifica los documentos según tu modalidad. No se acepta constancia emitida por el Registro Nacional de las Personas (RENAP).', url: '/solicitar-nit/#paso-1-requisitos', targetBlank: false },
        { title: '2. Solicitar Gestión (Formulario RTU Digital)', desc: 'Acceso directo al formulario electrónico oficial de inscripción de NIT (app.c.sat.gob.gt/rtu/formulario-inscripcion).', url: 'https://app.c.sat.gob.gt/rtu/formulario-inscripcion', targetBlank: true },
        { title: '3. Solicitar Cita (Sistema de Cita Validada + Manual PDF)', desc: 'Programa tu cita presencial con tu CUI (DPI) y correo registrado, o descarga el manual oficial en PDF.', url: 'https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal', targetBlank: true },
      ],
      staticShortcode: wpSolicitarNitRaw,
    },
    {
      id: 'proceso-actualizar-rtu',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Actualizar o Ratificar Datos en el RTU Digital',
      wpSlugOnly: 'actualizar-rtu',
      levelLabel: 'Proceso Conectado',
      n1: 'Contribuyentes',
      wpPath: '/actualizar-rtu/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Actualizar o Ratificar Datos en el RTU Digital',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_actualizar-rtu.txt',
      leadText: 'Actualiza tu dirección fiscal, establecimientos, afiliaciones o contador, consulta el estado e imprime tu Constancia de RTU en 3 pasos conectados (100% sin [vc_raw_html]).',
      cards: [
        { title: '1. Requisitos según tu caso (Plazo 30 días Art. 94)', desc: '4 escenarios ciudadanos y regla oficial de Factura de Servicios (solo digitar serie y número sin adjuntar archivo).', url: '/actualizar-rtu/#paso-1-requisitos-rtu', targetBlank: false },
        { title: '2. Realizar Actualización en Agencia Virtual SAT', desc: 'Ruta paso a paso dentro de Agencia Virtual (Servicios › RTU › Actualizar Datos) y manuales PDF oficiales.', url: 'https://farm3.sat.gob.gt/menu/login.jsf', targetBlank: true },
        { title: '3. Estado, Constancia de RTU y Cita Validada', desc: 'Tarjetas directas para consultar estado de gestión RTU, imprimir Constancia con QR o programar cita.', url: 'https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal', targetBlank: true },
      ],
      staticShortcode: wpActualizarRtuRaw,
    },
    {
      id: 'proceso-fel',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Habilitación y Emisión de Factura Electrónica en Línea (FEL)',
      wpSlugOnly: 'factura-electronica-fel',
      levelLabel: 'Proceso Conectado',
      n1: 'Contribuyentes',
      wpPath: '/factura-electronica-fel/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Habilitación y Emisión de Factura Electrónica en Línea (FEL)',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_factura-electronica-fel.txt',
      leadText: 'Habilítate como emisor en el régimen FEL, genera tu contraseña de firma electrónica gratuita y emite o verifica DTE en 3 pasos conectados.',
      cards: [
        { title: '1. Requisitos Previos en el RTU', desc: 'Usuario activo de Agencia Virtual, datos ratificados en el RTU Digital y al menos un establecimiento comercial activo.', url: '/factura-electronica-fel/#paso-1-requisitos-fel', targetBlank: false },
        { title: '2. Habilitarse como Emisor y Certificar DTE', desc: 'Acceso directo a Agencia Virtual SAT para habilitarse como emisor FEL y emitir facturas electrónicas.', url: 'https://farm3.sat.gob.gt/menu/login.jsf', targetBlank: true },
        { title: '3. Verificador Integrado de DTE y Planilla IVA-FEL', desc: 'Comprueba la validez de cualquier factura electrónica o consulta tu Planilla de IVA-FEL.', url: 'https://portal.sat.gob.gt/portal/verificador-integrado/', targetBlank: true },
      ],
      staticShortcode: wpFelRaw,
    },
    {
      id: 'proceso-solvencia-fiscal',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Solicitud y Emisión de Solvencia Fiscal en Línea',
      wpSlugOnly: 'solvencia-fiscal',
      levelLabel: 'Proceso Conectado',
      n1: 'Contribuyentes',
      wpPath: '/solvencia-fiscal/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Solicitud y Emisión de Solvencia Fiscal en Línea',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_solvencia-fiscal.txt',
      leadText: 'Verifica tus obligaciones al día, genera el formulario SAT-8421 en Declaraguate y descarga tu Solvencia Fiscal con QR en 3 pasos conectados.',
      cards: [
        { title: '1. Requisitos y Consulta de Omisos', desc: 'Verifica en Agencia Virtual que no tengas declaraciones pendientes ni inconsistencias en el RTU antes de pagar.', url: '/solvencia-fiscal/#paso-1-requisitos-solvencia', targetBlank: false },
        { title: '2. Llenar Formulario SAT-8421 en Declaraguate', desc: 'Genera la boleta SAT-2000 por Q 30.00 en la sección 9. Varios de Declaraguate.', url: 'https://declaraguate.sat.gob.gt/', targetBlank: true },
        { title: '3. Descargar e Imprimir Solvencia Fiscal en PDF', desc: 'Descarga tu Solvencia Fiscal firmada electrónicamente o verifica su autenticidad en línea.', url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/', targetBlank: true },
      ],
      staticShortcode: wpSolvenciaRaw,
    },
    {
      id: 'proceso-traspaso-vehiculos',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Traspaso Electrónico de Vehículos en Línea (e-Traspaso)',
      wpSlugOnly: 'traspaso-vehiculos',
      levelLabel: 'Proceso Conectado',
      n1: 'Contribuyentes',
      wpPath: '/traspaso-vehiculos/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Traspaso Electrónico de Vehículos en Línea (e-Traspaso)',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_traspaso-vehiculos.txt',
      leadText: 'Realiza la transferencia de propiedad de vehículos por medio de Notario autorizado y descarga los nuevos distintivos electrónicos en 3 pasos conectados.',
      cards: [
        { title: '1. Requisitos y Solvencia del Impuesto de Circulación (ISCV)', desc: 'Verifica que el vehículo esté al día en el ISCV y reúne el Certificado de Propiedad, Tarjeta de Circulación y DPI.', url: '/traspaso-vehiculos/#paso-1-requisitos-traspaso', targetBlank: false },
        { title: '2. Pago de IVA e ISCV en Declaraguate y Gestión Notarial', desc: 'Formularios SAT-2311 y SAT-8611 en Declaraguate y formalización electrónica por Notario.', url: 'https://declaraguate.sat.gob.gt/', targetBlank: true },
        { title: '3. Descargar Nueva Tarjeta de Circulación y Certificado', desc: 'Descarga los distintivos electrónicos actualizados desde Agencia Virtual del nuevo propietario.', url: 'https://farm3.sat.gob.gt/menu/login.jsf', targetBlank: true },
      ],
      staticShortcode: wpTraspasoRaw,
    },
    {
      id: 'proceso-padron-importadores',
      wave: 'Ola 0 (Portada + Universales)',
      waveOrder: 0,
      title: 'Inscripción y Activación en el Padrón de Importadores',
      wpSlugOnly: 'padron-importadores',
      levelLabel: 'Proceso Conectado',
      n1: 'Operadores de Comercio Exterior',
      wpPath: '/padron-importadores/',
      parentPage: '— (Sin superior)',
      breadcrumbTrail: 'Inicio › Inscripción y Activación en el Padrón de Importadores',
      filePath: 'docs/plantillas-wpbakery/procesos-conectados/G_padron-importadores.txt',
      leadText: 'Habilita tu registro aduanero como importador ante la Intendencia de Aduanas de la SAT para transmitir declaraciones DUCA en 3 pasos conectados.',
      cards: [
        { title: '1. Requisitos Tributarios, Bancarios y de Domicilio', desc: 'RTU actualizado, contrato activo de BancaSAT y coordenadas/fotografías de domicilio fiscal y bodegas.', url: '/padron-importadores/#paso-1-requisitos-importador', targetBlank: false },
        { title: '2. Inscribirse en el Padrón dentro de Agencia Virtual', desc: 'Registra capítulos SAC y solicitud electrónica en Agencia Virtual › Servicios › Aduanas › Padrón de Importadores.', url: 'https://farm3.sat.gob.gt/menu/login.jsf', targetBlank: true },
        { title: '3. Manuales Oficiales y Asociación de Agentes Aduaneros', desc: 'Consulta guías paso a paso y explora todas las gestiones de Importadores.', url: '/operadores-de-comercio-exterior/importadores/', targetBlank: false },
      ],
      staticShortcode: wpPadronImpRaw,
    },
  ];

  const n1Map = new Map<string, TramiteItem[]>();
  sorted.forEach(t => {
    const n1 = t.nivel1 || 'Contribuyentes';
    if (!n1Map.has(n1)) n1Map.set(n1, []);
    n1Map.get(n1)!.push(t);
  });

  n1Map.forEach((n1Items, n1) => {
    const n1Slug = N1_SLUGS[n1] || toSlug(n1);
    const n2Map = new Map<string, TramiteItem[]>();
    n1Items.forEach(t => {
      const n2 = t.nivel2 || 'General';
      if (!n2Map.has(n2)) n2Map.set(n2, []);
      n2Map.get(n2)!.push(t);
    });

    const n1Cards = Array.from(n2Map.entries()).map(([n2, n2Items]) => ({
      title: n2,
      desc: getNodeDesc(n2, n2Items),
      url: `/${n1Slug}/${toSlug(n2)}/`,
      targetBlank: false,
    }));

    pages.push({
      id: `n1-${n1Slug}`,
      wave: 'Ola 1 (Nivel 1)',
      waveOrder: 1,
      title: n1,
      wpSlugOnly: n1Slug,
      levelLabel: 'Nivel 1',
      n1,
      wpPath: `/${n1Slug}/`,
      parentPage: '— (Sin superior)',
      breadcrumbTrail: `Inicio › ${n1}`,
      filePath: `docs/plantillas-wpbakery/${n1Slug}/N1_${n1Slug}.txt`,
      leadText: `Selecciona una opción de Nivel 2 dentro de ${n1}.`,
      cards: n1Cards,
      staticShortcode:
        n1 === 'Contribuyentes'
          ? '[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row][vc_section][vc_row gap="0px" el_class="sat-seccion-contribuyentes"][vc_column width="1/2" offset="vc_col-xl-inherit vc_col-lg-inherit vc_col-md-6 vc_col-sm-inherit"][bsf-info-box icon_type="none" title="NIT sin Obligaciones" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2Fsin-obligaciones%2F"]Gestiones y servicios de identificación tributaria para personas sin actividad comercial.[/bsf-info-box][/vc_column][vc_column width="1/2"][bsf-info-box icon_size="32" title="Pequeños Contribuyentes" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2Fpequenos-contribuyentes%2F"]Información y obligaciones para pequeños negocios y régimen simplificado.[/bsf-info-box][/vc_column][vc_column width="1/2"][bsf-info-box icon_size="32" title="Contribuyente General" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2Fcontribuyente-general%2F"]Declaración y pago de IVA General, pagos de ISR, RTU Digital, facturación FEL, libros contables y vehículos.[/bsf-info-box][/vc_column][vc_column width="1/2"][bsf-info-box icon_size="32" title="Contribuyentes Especiales" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2Fcontribuyentes-especiales%2F"]Servicios y gestiones tributarias para empresas con atención diferenciada.[/bsf-info-box][/vc_column][/vc_row][/vc_section]'
          : undefined,
    });

    n2Map.forEach((n2Items, n2) => {
      const n2Slug = toSlug(n2);
      const n3Map = new Map<string, TramiteItem[]>();
      n2Items.forEach(t => {
        if (!isEmptyLevel(t.nivel3)) {
          const n3 = t.nivel3!.trim();
          if (!n3Map.has(n3)) n3Map.set(n3, []);
          n3Map.get(n3)!.push(t);
        }
      });

      if (n3Map.size === 0) {
        const leafCards = n2Items.map(t => {
          const { url, targetBlank } = resolveLeafCardUrl(t);
          return {
            title: t.gestion || t.nombreActual || '',
            desc: t.descripcion || '',
            url,
            targetBlank,
          };
        });

        pages.push({
          id: `n2-${n1Slug}-${n2Slug}`,
          wave: 'Ola 2 (Nivel 2)',
          waveOrder: 2,
          title: n2,
          wpSlugOnly: n2Slug,
          levelLabel: 'Nivel 2',
          n1,
          wpPath: `/${n1Slug}/${n2Slug}/`,
          parentPage: n1,
          breadcrumbTrail: `Inicio › ${n1} › ${n2}`,
          filePath: `docs/plantillas-wpbakery/${n1Slug}/N2_${n2Slug}.txt`,
          leadText: getNodeDesc(n2, n2Items),
          cards: leafCards,
        });
      } else {
        const n2Cards = Array.from(n3Map.entries()).map(([n3, n3Items]) => ({
          title: n3,
          desc: getNodeDesc(n3, n3Items),
          url: `/${n1Slug}/${n2Slug}/${toSlug(n3)}/`,
          targetBlank: false,
        }));

        pages.push({
          id: `n2-${n1Slug}-${n2Slug}`,
          wave: 'Ola 2 (Nivel 2)',
          waveOrder: 2,
          title: n2,
          wpSlugOnly: n2Slug,
          levelLabel: 'Nivel 2',
          n1,
          wpPath: `/${n1Slug}/${n2Slug}/`,
          parentPage: n1,
          breadcrumbTrail: `Inicio › ${n1} › ${n2}`,
          filePath: `docs/plantillas-wpbakery/${n1Slug}/N2_${n2Slug}.txt`,
          leadText: getNodeDesc(n2, n2Items),
          cards: n2Cards,
        });

        n3Map.forEach((n3Items, n3) => {
          const n3Slug = toSlug(n3);
          const n4Map = new Map<string, TramiteItem[]>();
          n3Items.forEach(t => {
            if (!isEmptyLevel(t.nivel4)) {
              const n4 = t.nivel4!.trim();
              if (!n4Map.has(n4)) n4Map.set(n4, []);
              n4Map.get(n4)!.push(t);
            }
          });

          if (n4Map.size === 0) {
            const leafCards = n3Items.map(t => {
              const { url, targetBlank } = resolveLeafCardUrl(t);
              return {
                title: t.gestion || t.nombreActual || '',
                desc: t.descripcion || '',
                url,
                targetBlank,
              };
            });

            pages.push({
              id: `n3-${n1Slug}-${n2Slug}-${n3Slug}`,
              wave: 'Ola 3 (Nivel 3)',
              waveOrder: 3,
              title: n3,
              wpSlugOnly: n3Slug,
              levelLabel: 'Nivel 3',
              n1,
              wpPath: `/${n1Slug}/${n2Slug}/${n3Slug}/`,
              parentPage: n2,
              breadcrumbTrail: `Inicio › ${n1} › ${n2} › ${n3}`,
              filePath: `docs/plantillas-wpbakery/${n1Slug}/${n2Slug}/N3_${n3Slug}.txt`,
              leadText: getNodeDesc(n3, n3Items),
              cards: leafCards,
            });
          } else {
            const n3Cards = Array.from(n4Map.entries()).map(([n4, n4Items]) => ({
              title: n4,
              desc: getNodeDesc(n4, n4Items),
              url: `/${n1Slug}/${n2Slug}/${n3Slug}/${toSlug(n4)}/`,
              targetBlank: false,
            }));

            pages.push({
              id: `n3-${n1Slug}-${n2Slug}-${n3Slug}`,
              wave: 'Ola 3 (Nivel 3)',
              waveOrder: 3,
              title: n3,
              wpSlugOnly: n3Slug,
              levelLabel: 'Nivel 3',
              n1,
              wpPath: `/${n1Slug}/${n2Slug}/${n3Slug}/`,
              parentPage: n2,
              breadcrumbTrail: `Inicio › ${n1} › ${n2} › ${n3}`,
              filePath: `docs/plantillas-wpbakery/${n1Slug}/${n2Slug}/N3_${n3Slug}.txt`,
              leadText: getNodeDesc(n3, n3Items),
              cards: n3Cards,
            });

            n4Map.forEach((n4Items, n4) => {
              const n4Slug = toSlug(n4);
              const n5Map = new Map<string, TramiteItem[]>();
              n4Items.forEach(t => {
                if (!isEmptyLevel(t.nivel5)) {
                  const n5 = t.nivel5!.trim();
                  if (!n5Map.has(n5)) n5Map.set(n5, []);
                  n5Map.get(n5)!.push(t);
                }
              });

              const useN5 = n4Items.length >= 11 && n5Map.size >= 2;

              if (!useN5) {
                const leafCards = n4Items.map(t => {
                  const { url, targetBlank } = resolveLeafCardUrl(t);
                  return {
                    title: t.gestion || t.nombreActual || '',
                    desc: t.descripcion || '',
                    url,
                    targetBlank,
                  };
                });

                pages.push({
                  id: `n4-${n1Slug}-${n2Slug}-${n3Slug}-${n4Slug}`,
                  wave: 'Ola 4 (Nivel 4)',
                  waveOrder: 4,
                  title: n4,
                  wpSlugOnly: n4Slug,
                  levelLabel: 'Nivel 4',
                  n1,
                  wpPath: `/${n1Slug}/${n2Slug}/${n3Slug}/${n4Slug}/`,
                  parentPage: n3,
                  breadcrumbTrail: `Inicio › ${n1} › ${n2} › ${n3} › ${n4}`,
                  filePath: `docs/plantillas-wpbakery/${n1Slug}/${n2Slug}/${n3Slug}/N4_${n4Slug}.txt`,
                  leadText: getNodeDesc(n4, n4Items),
                  cards: leafCards,
                });
              } else {
                const n4Cards = Array.from(n5Map.entries()).map(([n5, n5Items]) => ({
                  title: n5,
                  desc: getNodeDesc(n5, n5Items),
                  url: `/${n1Slug}/${n2Slug}/${n3Slug}/${n4Slug}/${toSlug(n5)}/`,
                  targetBlank: false,
                }));

                pages.push({
                  id: `n4-${n1Slug}-${n2Slug}-${n3Slug}-${n4Slug}`,
                  wave: 'Ola 4 (Nivel 4)',
                  waveOrder: 4,
                  title: n4,
                  wpSlugOnly: n4Slug,
                  levelLabel: 'Nivel 4',
                  n1,
                  wpPath: `/${n1Slug}/${n2Slug}/${n3Slug}/${n4Slug}/`,
                  parentPage: n3,
                  breadcrumbTrail: `Inicio › ${n1} › ${n2} › ${n3} › ${n4}`,
                  filePath: `docs/plantillas-wpbakery/${n1Slug}/${n2Slug}/${n3Slug}/N4_${n4Slug}.txt`,
                  leadText: getNodeDesc(n4, n4Items),
                  cards: n4Cards,
                });

                n5Map.forEach((n5Items, n5) => {
                  const n5Slug = toSlug(n5);
                  const leafCards = n5Items.map(t => {
                    const { url, targetBlank } = resolveLeafCardUrl(t);
                    return {
                      title: t.gestion || t.nombreActual || '',
                      desc: t.descripcion || '',
                      url,
                      targetBlank,
                    };
                  });

                  pages.push({
                    id: `n5-${n1Slug}-${n2Slug}-${n3Slug}-${n4Slug}-${n5Slug}`,
                    wave: 'Ola 5 (Nivel 5)',
                    waveOrder: 5,
                    title: n5,
                    wpSlugOnly: n5Slug,
                    levelLabel: 'Nivel 5',
                    n1,
                    wpPath: `/${n1Slug}/${n2Slug}/${n3Slug}/${n4Slug}/${n5Slug}/`,
                    parentPage: n4,
                    breadcrumbTrail: `Inicio › ${n1} › ${n2} › ${n3} › ${n4} › ${n5}`,
                    filePath: `docs/plantillas-wpbakery/${n1Slug}/${n2Slug}/${n3Slug}/${n4Slug}/N5_${n5Slug}.txt`,
                    leadText: getNodeDesc(n5, n5Items),
                    cards: leafCards,
                  });
                });
              }
            });
          }
        });
      }
    });
  });

  return pages.sort((a, b) => a.waveOrder - b.waveOrder);
}

const STORAGE_KEY = 'sat_wpbakery_created_pages_v1';

export const WPBakeryBuilderPage: React.FC = () => {
  const allPages = useMemo(() => buildAllWpPages(allTramites), []);
  const [selectedPageId, setSelectedPageId] = useState<string>(allPages[0].id);
  const [search, setSearch] = useState('');
  const [filterWave, setFilterWave] = useState<OlaId>('Todas');
  const [filterN1, setFilterN1] = useState<string>('Todos');
  const [includeUrls, setIncludeUrls] = useState(true);
  const [cardMode, setCardMode] = useState<CardShortcodeMode>('bsf');
  const [basePath, setBasePath] = useState<string>(() => {
    try {
      return localStorage.getItem('sat_wpbakery_base_path_v3') ?? '';
    } catch {
      return '';
    }
  });
  const [activeTab, setActiveTab] = useState<'shortcode' | 'preview' | 'css' | 'xml'>('shortcode');
  const [cssMode, setCssMode] = useState<'page' | 'global'>('page');
  const [showXmlCode, setShowXmlCode] = useState(false);
  const cgPages = useMemo(
    () => allPages.filter(p => p.wpPath.startsWith('/contribuyentes/contribuyente-general/')),
    [allPages]
  );
  const [selectedCgPageId, setSelectedCgPageId] = useState<string>(
    () => allPages.find(p => p.wpSlugOnly === 'declaraciones-pagos-y-solvencias')?.id || allPages[0].id
  );
  const [avoidDuplicateDate, setAvoidDuplicateDate] = useState(true);
  const [copiedType, setCopiedType] = useState<
    'shortcode' | 'css' | 'slug' | 'title' | 'parent' | 'template' | 'xml' | null
  >(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
    } catch {
      // ignore storage errors
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('sat_wpbakery_base_path_v3', basePath);
    } catch {
      // ignore storage errors
    }
  }, [basePath]);

  const toggleCompleted = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredPages = useMemo(() => {
    return allPages.filter(p => {
      if (filterWave !== 'Todas' && p.wave !== filterWave) return false;
      if (filterN1 !== 'Todos' && p.n1 !== filterN1) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.wpPath.toLowerCase().includes(q) ||
        p.parentPage.toLowerCase().includes(q) ||
        p.levelLabel.toLowerCase().includes(q)
      );
    });
  }, [allPages, filterWave, filterN1, search]);

  const currentPage = useMemo(
    () => allPages.find(p => p.id === selectedPageId) || allPages[0],
    [allPages, selectedPageId]
  );

  const currentFilteredIndex = useMemo(
    () => filteredPages.findIndex(p => p.id === currentPage.id),
    [filteredPages, currentPage.id]
  );

  const handlePrevNext = (delta: number) => {
    if (filteredPages.length === 0) return;
    const nextIdx = Math.min(Math.max(currentFilteredIndex + delta, 0), filteredPages.length - 1);
    setSelectedPageId(filteredPages[nextIdx].id);
  };

  const currentShortcode = useMemo(() => {
    if (currentPage.staticShortcode) {
      return applyBasePathAndModeToShortcode(currentPage.staticShortcode, basePath, cardMode);
    }
    return buildPageShortcode(
      currentPage.cards,
      currentPage.n1,
      currentPage.title,
      currentPage.leadText,
      includeUrls,
      basePath,
      cardMode
    );
  }, [currentPage, includeUrls, basePath, cardMode]);

  const currentPageCss = useMemo(() => {
    return getPageSpecificCss(currentPage.n1, currentPage.title);
  }, [currentPage.n1, currentPage.title]);

  const selectedCgPage = useMemo(
    () => cgPages.find(p => p.id === selectedCgPageId) || cgPages[0] || currentPage,
    [cgPages, selectedCgPageId, currentPage]
  );

  const currentPageSingleXml = useMemo(() => {
    const page = selectedCgPage;
    const shortcode = page.staticShortcode
      ? applyBasePathAndModeToShortcode(page.staticShortcode, basePath, cardMode)
      : buildPageShortcode(page.cards, page.n1, page.title, page.leadText, includeUrls, basePath, cardMode);
    const pageCss = getPageSpecificCss(page.n1, page.title);
    // Unique timestamp avoids WordPress "Page already exists" check (which matches title + post_date)
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const localDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const gmtDateStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const pubDateStr = now.toUTCString();
    const postDateLocal = avoidDuplicateDate ? localDateStr : '2026-10-27 19:56:41';
    const postDateGmt = avoidDuplicateDate ? gmtDateStr : '2026-10-28 01:56:41';
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>Portal SAT Guatemala — Prueba 1 Página Contribuyente General (${page.title})</title>
  <link>https://prototipo.sat.gob.gt</link>
  <description>Prueba unitaria de importación WPBakery + The7 Classic (1 sola página de Contribuyente General)</description>
  <pubDate>${pubDateStr}</pubDate>
  <language>es-GT</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>https://prototipo.sat.gob.gt</wp:base_site_url>
  <wp:base_blog_url>https://prototipo.sat.gob.gt</wp:base_blog_url>
  <wp:author>
    <wp:author_id>1</wp:author_id>
    <wp:author_login><![CDATA[admin]]></wp:author_login>
    <wp:author_email><![CDATA[webmaster@sat.gob.gt]]></wp:author_email>
    <wp:author_display_name><![CDATA[SAT Guatemala]]></wp:author_display_name>
  </wp:author>
  <item>
    <title>${page.title}</title>
    <link>https://prototipo.sat.gob.gt${basePath}${page.wpPath}</link>
    <pubDate>${pubDateStr}</pubDate>
    <dc:creator><![CDATA[admin]]></dc:creator>
    <guid isPermaLink="false">https://prototipo.sat.gob.gt/?page_slug=${page.wpSlugOnly}-${postDateLocal.replace(/[^0-9]/g, '')}</guid>
    <description></description>
    <content:encoded><![CDATA[${shortcode}]]></content:encoded>
    <excerpt:encoded><![CDATA[]]></excerpt:encoded>
    <wp:post_id>0</wp:post_id>
    <wp:post_date><![CDATA[${postDateLocal}]]></wp:post_date>
    <wp:post_date_gmt><![CDATA[${postDateGmt}]]></wp:post_date_gmt>
    <wp:comment_status><![CDATA[closed]]></wp:comment_status>
    <wp:ping_status><![CDATA[closed]]></wp:ping_status>
    <wp:post_name><![CDATA[${page.wpSlugOnly}]]></wp:post_name>
    <wp:status><![CDATA[publish]]></wp:status>
    <wp:post_parent>0</wp:post_parent>
    <wp:menu_order>1</wp:menu_order>
    <wp:post_type><![CDATA[page]]></wp:post_type>
    <wp:post_password><![CDATA[]]></wp:post_password>
    <wp:is_sticky>0</wp:is_sticky>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>
      <wp:meta_value><![CDATA[elementor_header_footer]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_dt_sidebar_position]]></wp:meta_key>
      <wp:meta_value><![CDATA[disabled]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_dt_header_title]]></wp:meta_key>
      <wp:meta_value><![CDATA[disabled]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wpb_vc_js_status]]></wp:meta_key>
      <wp:meta_value><![CDATA[true]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wpb_post_custom_css]]></wp:meta_key>
      <wp:meta_value><![CDATA[${pageCss}]]></wp:meta_value>
    </wp:postmeta>
  </item>
</channel>
</rss>`;
  }, [selectedCgPage, includeUrls, basePath, cardMode, avoidDuplicateDate]);

  const handleCopy = (text: string, type: 'shortcode' | 'css' | 'slug' | 'title' | 'parent' | 'template') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const handleDownloadXml = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hoverColor = HOVER_COLOR_BY_N1[currentPage.n1] || '#14649B';

  const waveCounts: { wave: OlaId; label: string; total: number }[] = [
    { wave: 'Todas', label: `Todas (${allPages.length})`, total: allPages.length },
    { wave: 'Ola 0 (Portada + Universales)', label: 'Ola 0: Portada + 6 Procesos (7)', total: 7 },
    { wave: 'Ola 1 (Nivel 1)', label: 'Ola 1: Nivel 1 (4)', total: 4 },
    { wave: 'Ola 2 (Nivel 2)', label: 'Ola 2: Nivel 2 (20)', total: 20 },
    { wave: 'Ola 3 (Nivel 3)', label: 'Ola 3: Nivel 3 (53)', total: 53 },
    { wave: 'Ola 4 (Nivel 4)', label: 'Ola 4: Nivel 4 (76)', total: 76 },
    { wave: 'Ola 5 (Nivel 5)', label: `Ola 5: Nivel 5 (${allPages.filter(p => p.wave === 'Ola 5 (Nivel 5)').length})`, total: allPages.filter(p => p.wave === 'Ola 5 (Nivel 5)').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Institucional */}
      <header className="bg-[#003865] text-white border-b border-sky-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Portal SAT
            </a>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">
                  Planificador de Páginas, Enlaces y Breadcrumbs — WordPress + WPBakery
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3" />
                  100% Cero [vc_raw_html]
                </span>
              </div>
              <p className="text-xs text-sky-200">
                160 páginas jerárquicas con `[dt_breadcrumbs]` y `link=&quot;url:...&quot;` listos (creación manual por Olas o importador XML opcional)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-xs bg-white/10 px-3 py-1.5 rounded-lg font-semibold">
              Progreso: <span className="text-emerald-300 font-bold">{completedIds.size}</span> / {allPages.length}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('xml')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              Opción Importador XML
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('css');
                handleCopy(wpCssRaw, 'css');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              {copiedType === 'css' ? <Check className="w-4 h-4" /> : <Paintbrush className="w-4 h-4" />}
              {copiedType === 'css' ? 'CSS Oficial Copiado' : 'Copiar CSS Global (The7)'}
            </button>
          </div>
        </div>
      </header>

      {/* Selector de Olas de Creación (De Padres a Hijos) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600 mr-1">
              Orden de creación (Padres → Hijos):
            </span>
            {waveCounts.map(w => (
              <button
                key={w.wave}
                type="button"
                onClick={() => setFilterWave(w.wave)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterWave === w.wave
                    ? 'bg-[#003865] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Principal: Sidebar de 160 páginas + Panel de Trabajo */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista Secuencial de Páginas */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-[#14649B]" />
                Páginas en esta Ola ({filteredPages.length})
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Marca las ya creadas
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar título, página superior o slug..."
                aria-label="Buscar plantilla de página WPBakery"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {['Todos', 'Contribuyentes', 'Operadores de Comercio Exterior', 'Profesionales', 'Entes Exentos'].map(seg => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setFilterN1(seg)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    filterN1 === seg
                      ? 'bg-[#14649B] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {seg === 'Operadores de Comercio Exterior' ? 'Comercio Exterior' : seg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredPages.map(page => {
              const isSelected = page.id === currentPage.id;
              const isDone = completedIds.has(page.id);
              return (
                <div
                  key={page.id}
                  className={`w-full text-left px-3.5 py-3 transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-sky-50/90 border-l-4 border-[#14649B]'
                      : isDone
                        ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                        : 'hover:bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={e => toggleCompleted(page.id, e)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 shrink-0 cursor-pointer"
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como página ya creada en WordPress'}
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPageId(page.id)}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-800">
                        {page.levelLabel}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 truncate max-w-[165px]">
                        {page.wpSlugOnly}
                      </span>
                    </div>
                    <div className={`text-xs font-bold line-clamp-1 mt-0.5 ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {page.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Superior: <strong className="font-semibold text-slate-700">{page.parentPage}</strong>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Columna Derecha: Ficha Paso a Paso para Crear la Página en WordPress */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#003865] text-white">
                    {currentPage.wave}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Plantilla: <code className="font-mono text-slate-700">{currentPage.filePath}</code>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#003865]">
                  {currentPage.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={currentFilteredIndex <= 0}
                  onClick={() => handlePrevNext(-1)}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  title="Página anterior de la lista"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentFilteredIndex >= filteredPages.length - 1}
                  onClick={() => handlePrevNext(1)}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  title="Siguiente página de la lista"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompleted(currentPage.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                    completedIds.has(currentPage.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {completedIds.has(currentPage.id) ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                  {completedIds.has(currentPage.id) ? 'Creada' : 'Marcar Creada'}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(currentShortcode, 'shortcode')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003865] hover:bg-[#14649B] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {copiedType === 'shortcode' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copiedType === 'shortcode' ? '¡Shortcode Copiado!' : '4. Copiar Shortcode'}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(currentPageCss, 'css')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  title="Copiar CSS para WPBakery Page Settings › Custom CSS (Opción 2)"
                >
                  {copiedType === 'css' ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  {copiedType === 'css' ? '¡CSS Copiado!' : '5. Copiar CSS (Opción 2)'}
                </button>
              </div>
            </div>

            {/* 5 Atributos Clave de la Página en WordPress (Página Superior & Plantilla Elementor Full Width) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      1. Título de la Página
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentPage.title, 'title')}
                      className="text-[11px] font-semibold text-[#14649B] hover:underline cursor-pointer"
                    >
                      {copiedType === 'title' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <div className="mt-1 font-bold text-slate-900 line-clamp-2" title={currentPage.title}>
                    {currentPage.title}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Encabezado H1</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-900">
                      2. Página Superior
                    </span>
                    {currentPage.parentPage !== '— (Sin superior / Principal)' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(currentPage.parentPage, 'parent')}
                        className="text-[11px] font-semibold text-amber-900 hover:underline cursor-pointer"
                      >
                        {copiedType === 'parent' ? 'Copiado' : 'Copiar'}
                      </button>
                    )}
                  </div>
                  <div className="mt-1 font-bold text-amber-950 line-clamp-2" title={currentPage.parentPage}>
                    {currentPage.parentPage}
                  </div>
                </div>
                <span className="text-[10px] text-amber-800 font-semibold mt-1">
                  Atributos de página › Superior
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-indigo-900">
                      3. Plantilla de Página
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Elementor Full Width', 'template')}
                      className="text-[11px] font-semibold text-indigo-700 hover:underline cursor-pointer"
                    >
                      {copiedType === 'template' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <div className="mt-1 font-bold text-indigo-950">
                    Elementor Full Width
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-indigo-800 mt-1 font-medium">
                  <span>Atributos › Plantilla</span>
                  <span className="font-mono text-[9px] bg-indigo-100 text-indigo-900 px-1 py-0.5 rounded">Full Width</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      4. Slug / Enlace
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentPage.wpSlugOnly, 'slug')}
                      className="text-[11px] font-semibold text-[#14649B] hover:underline cursor-pointer"
                    >
                      {copiedType === 'slug' ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <code className="mt-1 block font-mono font-bold text-[#003865] truncate">
                    {currentPage.wpSlugOnly}
                  </code>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Enlace permanente</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-emerald-900 font-mono">
                    URL Canónica Final
                  </span>
                  <code className="mt-1 block font-mono font-bold text-emerald-950 break-all text-[11px]">
                    {currentPage.wpPath}
                  </code>
                </div>
                <span className="text-[10px] text-emerald-800 font-semibold mt-1">
                  Coincidencia 100% canónica
                </span>
              </div>
            </div>

            {/* Demostración de la Miga de Pan ([dt_breadcrumbs]) y Plantilla */}
            <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-[#003865] mr-2">
                  Breadcrumb Automático (`[dt_breadcrumbs]` en línea 1):
                </span>
                <span className="font-medium text-slate-800">
                  {currentPage.breadcrumbTrail}
                </span>
              </div>
              <span className="text-[11px] text-sky-950 font-medium bg-sky-100/80 px-2 py-1 rounded-lg">
                Encadenado por <strong>Página Superior</strong> con plantilla <strong>Elementor Full Width</strong> (100% full-width sin barra lateral)
              </span>
            </div>

            {/* Selector de Pestañas de Trabajo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('shortcode')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'shortcode'
                      ? 'bg-white text-[#003865] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  Shortcode con Enlaces y Breadcrumb
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-white text-[#003865] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Tarjetas e Hijos que Enlaza ({currentPage.cards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('xml')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'xml'
                      ? 'bg-white text-[#003865] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Opción Importador XML (WXR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('css')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'css'
                      ? 'bg-white text-[#003865] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  CSS Oficial The7
                </button>
              </div>

              {activeTab === 'shortcode' && (
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span>Modo Tarjeta:</span>
                    <select
                      value={cardMode}
                      onChange={e => setCardMode(e.target.value as CardShortcodeMode)}
                      aria-label="Modo de shortcode para tarjetas"
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#14649B]"
                    >
                      <option value="bsf">Ultimate Addons ([bsf-info-box])</option>
                      <option value="vc_core">Fallback WPBakery Core ([vc_column_text])</option>
                    </select>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span>Subcarpeta WP (opcional):</span>
                    <input
                      type="text"
                      value={basePath}
                      onChange={e => setBasePath(e.target.value)}
                      placeholder="/ (raíz por defecto)"
                      aria-label="Prefijo de subcarpeta en WordPress"
                      className="w-36 px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#14649B]"
                    />
                  </label>
                  {!currentPage.staticShortcode && (
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeUrls}
                        onChange={e => setIncludeUrls(e.target.checked)}
                        className="rounded border-slate-300 text-[#003865] focus:ring-[#003865]"
                      />
                      Incluir enlaces (`link=&quot;url:...&quot;`)
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la Pestaña Activa */}
          {activeTab === 'shortcode' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Línea 1 incluye <code className="font-mono font-bold text-[#003865]">[dt_breadcrumbs]</code> y cada tarjeta <code className="font-mono font-bold text-[#003865]">[bsf-info-box]</code> ya lleva su <code className="font-mono font-bold text-emerald-700">link=&quot;url:...&quot;</code> puesto.
                </span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold">
                  0 bloques [vc_raw_html]
                </span>
              </div>
              <textarea
                readOnly
                value={currentShortcode}
                aria-label="Código Shortcode WPBakery listo para pegar"
                className="w-full h-[430px] font-mono text-xs leading-relaxed p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <p className="text-xs italic text-slate-500 mb-2">
                  {currentPage.breadcrumbTrail}
                </p>
                <h3 className="text-2xl font-bold text-[#003865]">
                  {currentPage.title}
                </h3>
                {currentPage.leadText && (
                  <p className="text-sm text-slate-600 mt-1">
                    {currentPage.leadText}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPage.cards.map((card, idx) => (
                  <a
                    key={idx}
                    href={card.url || '#'}
                    target={card.targetBlank ? '_blank' : '_self'}
                    rel={card.targetBlank ? 'noopener noreferrer' : undefined}
                    onClick={e => {
                      if (!card.targetBlank) {
                        e.preventDefault();
                        const match = allPages.find(p => p.wpPath === card.url);
                        if (match) setSelectedPageId(match.id);
                      }
                    }}
                    style={{ '--hover-bg': hoverColor } as React.CSSProperties}
                    className="group relative flex flex-col justify-start bg-[#F4F6F9] border-0 rounded-[12px] p-[22px_24px] min-h-[140px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:bg-[var(--hover-bg)]"
                  >
                    {/* Chevron institucional a la derecha */}
                    <div className="absolute top-[22px] right-[20px] w-[18px] height-[18px] text-[#94A3B8] group-hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>

                    <div className="pr-6">
                      <h4 className="text-[16px] font-bold text-[#19324B] group-hover:text-white leading-[1.35] mb-2 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[12.5px] text-[#475569] group-hover:text-white/95 leading-[1.55] transition-colors flex-grow">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 group-hover:border-white/20 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-white/80">
                      <span className="truncate">{card.url}</span>
                      {card.targetBlank && <ExternalLink className="w-3 h-3 shrink-0 ml-1" />}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'xml' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#003865]">
                  Opción Aceleradora: Paquetes XML de Importación Nativa de WordPress (WXR 1.2)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Si en el menú izquierdo de tu WordPress tienes acceso a <strong>Herramientas › Importar › WordPress</strong>, puedes subir cualquiera de estos archivos XML oficiales. Ya traen preconfigurados de fábrica la <strong>Página Superior (`post_parent`)</strong>, la <strong>Plantilla Elementor Full Width (`elementor_header_footer`)</strong>, el <strong>CSS de WPBakery (`_wpb_post_custom_css`)</strong>, el <strong>Slug (`post_name`)</strong>, el <strong>Breadcrumb (`[dt_breadcrumbs]`)</strong> y los <strong>Shortcodes WPBakery (0% `[vc_raw_html]`)</strong> en un solo paso. Si no usas el importador, el planificador superior te indica exactamente qué valores elegir en cada página.
                </p>
              </div>

              {/* Prueba Unitaria: 1 Sola Página bajo Contribuyente General */}
              <div className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 space-y-4 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700 text-white">
                        Prueba de 1 Sola Página (Rama Contribuyente General)
                      </span>
                      <span className="text-xs font-bold text-emerald-950 font-mono">
                        Slug: {selectedCgPage.wpSlugOnly}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Superior en WP: <strong>{selectedCgPage.parentPage}</strong>
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-emerald-950">
                      Elige 1 página de Contribuyente General para probar la importación:
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadXml(
                          currentPageSingleXml,
                          `wordpress-import-1-pagina-${selectedCgPage.wpSlugOnly}.xml`
                        )
                      }
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      Descargar XML (1 Página)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(currentPageSingleXml);
                        setCopiedType('xml');
                        setTimeout(() => setCopiedType(null), 2500);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-950 font-bold text-xs cursor-pointer transition-colors"
                      title="Copiar XML de 1 sola página al portapapeles"
                    >
                      {copiedType === 'xml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'xml' ? '¡Copiado!' : 'Copiar XML (1 Pág)'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-emerald-200/80">
                  <div className="md:col-span-7">
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      Página de «Contribuyente General» a incluir en el XML ({cgPages.length} disponibles):
                    </label>
                    <select
                      value={selectedCgPage.id}
                      onChange={e => {
                        setSelectedCgPageId(e.target.value);
                        setSelectedPageId(e.target.value);
                      }}
                      aria-label="Seleccionar página de Contribuyente General para exportar en XML"
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-emerald-400 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {cgPages.map(p => (
                        <option key={p.id} value={p.id}>
                          [{p.levelLabel}] {p.title} ({p.cards.length} tarjetas) — Superior: {p.parentPage}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-5 flex flex-col gap-1.5 text-xs text-emerald-950">
                    <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avoidDuplicateDate}
                        onChange={e => setAvoidDuplicateDate(e.target.checked)}
                        className="rounded border-emerald-400 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>Evitar bloqueo «already exists» (fecha única)</span>
                    </label>
                    <span className="text-[11px] text-slate-600">
                      Prefijo de enlaces actual: <code className="font-mono font-bold text-emerald-900">{basePath || '/'}</code> (ajustado para <code className="font-mono">prototipo.sat.gob.gt/portal</code>)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rama Completa: Contribuyente General (44 Páginas: Nivel 2 + 8 Nivel 3 + 35 Nivel 4) */}
              <div className="p-5 rounded-2xl border-2 border-[#003865] bg-sky-50/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#003865] text-white">
                      Menú Completo de Contribuyente General (77 Páginas: N2 + N3 + N4 + N5)
                    </span>
                    <span className="text-xs font-bold text-[#14649B]">
                      1 Nivel 2 + 8 Nivel 3 + 35 Nivel 4 + 33 Nivel 5 (298 gestiones conectadas)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#003865]">
                    Paquete XML Completo de Contribuyente General (`wordpress-import-contribuyente-general-completo.xml`)
                  </h4>
                  <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                    Importa de una sola vez <strong>todo el árbol de Contribuyente General</strong> con su jerarquía padre-hijo (`post_parent`) ya enlazada entre las 8 subcategorías de Nivel 3 y sus 35 páginas de Nivel 4, con el contenedor centrado `1200px` y el CSS aprobado.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlCgCompletoRaw, basePath, cardMode),
                        'wordpress-import-contribuyente-general-completo.xml'
                      )
                    }
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003865] hover:bg-[#14649B] text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Menú Completo CG (77 Págs: N2 a N5)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        applyBasePathAndModeToShortcode(wpXmlCgCompletoRaw, basePath, cardMode)
                      );
                      setCopiedType('xml');
                      setTimeout(() => setCopiedType(null), 2500);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-sky-300 bg-white hover:bg-sky-100 text-[#003865] font-bold text-xs cursor-pointer transition-colors"
                    title="Copiar XML completo de Contribuyente General (77 páginas)"
                  >
                    {copiedType === 'xml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'xml' ? '¡Copiado!' : 'Copiar XML (77 Págs)'}</span>
                  </button>
                </div>
              </div>

              {/* Rama Operadores de Comercio Exterior (Restante: 49 Páginas sin Importadores + Completo: 65 Páginas) */}
              <div className="p-5 rounded-2xl border-2 border-[#0284C7] bg-sky-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0284C7] text-white">
                      Operadores de Comercio Exterior (49 Páginas Restantes / 65 Completas)
                    </span>
                    <span className="text-xs font-bold text-[#0369A1]">
                      Exportadores + OEA + AFPA + Zonas Especiales + Normativa (Excluye Importadores SAT-GES-0341..0394)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#003865]">
                    Paquete XML de Comercio Exterior (`wordpress-import-comercio-exterior-restante.xml`)
                  </h4>
                  <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                    Importa las <strong>49 páginas restantes de Comercio Exterior</strong> (Exportadores, OEA, Auxiliares AFPA, Maquilas/ZDEEP y Normativa) conectadas automáticamente bajo <em>«Operadores de Comercio Exterior»</em>, sin duplicar la rama ya construida de <em>Importadores</em> (`SAT-GES-0341` a `SAT-GES-0394`). Incluye contenedor centrado `1200px` y hover azul aduanas (`#0284C7`).
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlOceRestanteRaw, basePath, cardMode),
                        'wordpress-import-comercio-exterior-restante.xml'
                      )
                    }
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Restante sin Importadores (49 Págs)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlOceCompletoRaw, basePath, cardMode),
                        'wordpress-import-comercio-exterior-completo.xml'
                      )
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-sky-400 bg-white hover:bg-sky-100 text-[#003865] font-bold text-xs cursor-pointer transition-colors"
                    title="Descargar árbol completo de Comercio Exterior (65 páginas incluyendo Importadores)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Completo (65 Págs)</span>
                  </button>
                </div>
              </div>

              {/* Prueba Controlada: Contribuyente General */}
              <div className="p-5 rounded-2xl border-2 border-sat-azul bg-sat-fondo-tenue flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sat-azul text-white">
                      Prueba Controlada (Solo Contribuyente General)
                    </span>
                    <span className="text-xs font-bold text-sat-texto-suave">8 Subcategorías N3</span>
                  </div>
                  <h4 className="text-base font-bold text-sat-azul-oscuro">
                    Paquete XML para Contribuyente General
                  </h4>
                  <p className="text-xs text-sat-texto-suave max-w-2xl leading-relaxed">
                    Crea únicamente las 8 subcategorías principales bajo tu página existente <em>«Contribuyente General»</em>. Si tu navegador bloquea la descarga automática, usa el botón «Copiar XML» para pegarlo en un archivo bloc de notas.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlCgN3Raw, basePath, cardMode),
                        'wordpress-import-contribuyente-general-n3.xml'
                      )
                    }
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sat-azul hover:bg-sat-azul-oscuro text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Descargar XML (38 KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        applyBasePathAndModeToShortcode(wpXmlCgN3Raw, basePath, cardMode)
                      );
                      setCopiedType('xml');
                      setTimeout(() => setCopiedType(null), 2500);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-sat-gris bg-white hover:bg-sat-fondo-medio text-sat-azul-oscuro font-bold text-xs cursor-pointer transition-colors"
                    title="Copiar código XML completo al portapapeles"
                  >
                    {copiedType === 'xml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'xml' ? '¡Copiado!' : 'Copiar XML'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowXmlCode(prev => !prev)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                    title="Ver o inspeccionar el código XML completo"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>{showXmlCode ? 'Ocultar XML' : 'Ver XML'}</span>
                  </button>
                </div>
              </div>

              {showXmlCode && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono font-bold text-sky-400">
                      wordpress-import-contribuyente-general-n3.xml (38 KB, WXR 1.2)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Puedes seleccionar todo (Ctrl+A), copiar y guardar en un archivo .xml
                    </span>
                  </div>
                  <textarea
                    readOnly
                    value={applyBasePathAndModeToShortcode(wpXmlCgN3Raw, basePath, cardMode)}
                    aria-label="Contenido XML WXR de Contribuyente General"
                    className="w-full h-80 font-mono text-xs leading-relaxed p-3 rounded-lg bg-black/60 text-slate-100 border border-slate-700 focus:outline-none"
                    onClick={e => (e.target as HTMLTextAreaElement).select()}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 mb-2">
                      Paquete Troncal (31 Páginas)
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Olas 0, 1 y 2 (`wordpress-import-olas-0-1-2.xml`)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Crea la Portada, las 6 páginas de Procesos Conectados (`/solicitar-nit/`, `/actualizar-rtu/`, `/factura-electronica-fel/`, `/solvencia-fiscal/`, `/traspaso-vehiculos/`, `/padron-importadores/`), las 4 páginas de Nivel 1 y las 20 páginas de Nivel 2.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlOlas012Raw, basePath, cardMode),
                        'wordpress-import-olas-0-1-2.xml'
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003865] hover:bg-[#14649B] text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar XML Olas 0–2 (31 páginas)
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-950 mb-2">
                      Catálogo Completo (160 Páginas)
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Olas 0 a 4 Completas (`wordpress-import-completo-160.xml`)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Crea de una vez las 160 páginas completas (Portada + 6 Procesos Conectados + Nivel 1 a Nivel 4) con toda su jerarquía padre-hijo conectada.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadXml(
                        applyBasePathAndModeToShortcode(wpXmlAll160Raw, basePath, cardMode),
                        'wordpress-import-completo-160.xml'
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar XML Completo (160 páginas)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCssMode('page')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      cssMode === 'page'
                        ? 'bg-white text-[#003865] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Opción 2: CSS de esta Página (Page Settings)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCssMode('global')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      cssMode === 'global'
                        ? 'bg-white text-[#003865] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-500" />
                    Opción 1: CSS Global (The7 / Personalizar)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(cssMode === 'page' ? currentPageCss : wpCssRaw, 'css')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#003865] hover:bg-[#14649B] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'css' ? '¡Copiado!' : cssMode === 'page' ? 'Copiar CSS de esta Página' : 'Copiar CSS Global'}
                </button>
              </div>

              {cssMode === 'page' ? (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold">
                      ¿Dónde se pega en WPBakery? (Opción 2 para «{currentPage.title}»)
                    </span>
                    <p className="text-[11px] text-amber-900">
                      Al editar la página con WPBakery, haz clic arriba en el ícono del <strong>Engranaje / Tuerca (`Page Settings`)</strong> › pestaña <strong>Custom CSS</strong> › pega este bloque y guarda.
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-mono font-bold px-2 py-1 rounded bg-amber-200/60 text-amber-900">
                    Hover: {HOVER_COLOR_BY_N1[currentPage.n1] || '#14649B'}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950">
                  <span className="font-bold">¿Dónde se pega el CSS Global? (Opción 1):</span>
                  <p className="text-[11px] text-sky-900 mt-0.5">
                    Se pega una única vez en <strong>The7 › Theme Options › Advanced › Custom CSS</strong> (o en <em>Apariencia › Personalizar › CSS adicional</em>). Aplica automáticamente a todas las páginas del portal.
                  </p>
                </div>
              )}

              <textarea
                readOnly
                value={cssMode === 'page' ? currentPageCss : wpCssRaw}
                aria-label="Código CSS listo para pegar en WordPress"
                className="w-full h-[400px] font-mono text-xs leading-relaxed p-4 rounded-xl bg-slate-900 text-emerald-200 border border-slate-800 focus:outline-none"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
