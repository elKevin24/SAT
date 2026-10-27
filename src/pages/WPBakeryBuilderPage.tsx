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
  const fullUrl =
    cleanBase && url.startsWith('/') && !url.startsWith('//')
      ? `${cleanBase}${url}`
      : url;
  const enc = encodeURI(fullUrl);
  return `url:${enc}||${targetBlank ? 'target:%20_blank|' : '|'}`;
}

function applyBasePathToShortcode(shortcode: string, basePath: string): string {
  const cleanBase = basePath.trim().replace(/\/+$/, '');
  if (!cleanBase) return shortcode;
  const encBase = encodeURI(cleanBase).replace(/\//g, '%2F');
  return shortcode.replace(/link="url:%2F/g, `link="url:${encBase}%2F`);
}

function buildPageShortcode(
  cards: { title: string; desc: string; url: string; targetBlank: boolean }[],
  n1: string,
  heading: string,
  leadText: string,
  includeUrls: boolean,
  basePath = ''
): string {
  const breadcrumb =
    '[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]';
  const headerBlock =
    `[vc_row][vc_column][vc_custom_heading text="${cleanText(heading)}" font_container="tag:h1|font_size:28px|text_align:left|color:%23003865" use_theme_fonts="yes"]` +
    (leadText
      ? `[vc_custom_heading text="${cleanText(leadText)}" font_container="tag:p|font_size:15px|text_align:left|color:%23475569" use_theme_fonts="yes"]`
      : '') +
    '[vc_empty_space height="16px"][/vc_column][/vc_row]\n';

  const colWidth = cards.length === 2 || cards.length === 4 ? '1/2' : '1/3';
  const cols = cards
    .map(c => {
      const linkVal = includeUrls ? encodeVcLink(c.url, c.targetBlank, basePath) : '';
      return `[vc_column width="${colWidth}"][bsf-info-box icon_type="none" title="${cleanText(c.title)}" read_more="box" link="${linkVal}"]${cleanText(c.desc)}[/bsf-info-box][/vc_column]`;
    })
    .join('');

  const sectionClass = CSS_CLASS_BY_N1[n1] || 'sat-seccion-contribuyentes';
  return `${breadcrumb}\n${headerBlock}[vc_section][vc_row equal_height="yes" gap="15px" el_class="${sectionClass}"]${cols}[/vc_row][/vc_section]`;
}

export type OlaId = 'Todas' | 'Ola 0 (Portada + Universales)' | 'Ola 1 (Nivel 1)' | 'Ola 2 (Nivel 2)' | 'Ola 3 (Nivel 3)' | 'Ola 4 (Nivel 4)';

export interface WpPageTemplate {
  id: string;
  wave: OlaId;
  waveOrder: number;
  title: string;
  wpSlugOnly: string;
  levelLabel: 'Portada' | 'Proceso Conectado' | 'Nivel 1' | 'Nivel 2' | 'Nivel 3' | 'Nivel 4';
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
  const [basePath, setBasePath] = useState<string>(() => {
    try {
      return localStorage.getItem('sat_wpbakery_base_path_v1') || '';
    } catch {
      return '';
    }
  });
  const [activeTab, setActiveTab] = useState<'shortcode' | 'preview' | 'css' | 'xml'>('shortcode');
  const [copiedType, setCopiedType] = useState<'shortcode' | 'css' | 'slug' | 'title' | null>(null);
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
      localStorage.setItem('sat_wpbakery_base_path_v1', basePath);
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
      return applyBasePathToShortcode(currentPage.staticShortcode, basePath);
    }
    return buildPageShortcode(
      currentPage.cards,
      currentPage.n1,
      currentPage.title,
      currentPage.leadText,
      includeUrls,
      basePath
    );
  }, [currentPage, includeUrls, basePath]);

  const handleCopy = (text: string, type: 'shortcode' | 'css' | 'slug' | 'title') => {
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
                  {copiedType === 'shortcode' ? '¡Shortcode Copiado!' : '4. Copiar Shortcode WPBakery'}
                </button>
              </div>
            </div>

            {/* 4 Pasos Exactos para Crear la Página y Conectar su Enlace y Breadcrumb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
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
                <div className="mt-1 font-bold text-slate-900 line-clamp-2">
                  {currentPage.title}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="block text-[10px] font-bold uppercase text-amber-900">
                  2. Atributo «Página Superior»
                </span>
                <span className="mt-1 block font-bold text-amber-950 line-clamp-2">
                  {currentPage.parentPage}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    3. Slug en WordPress
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

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="block text-[10px] font-bold uppercase text-emerald-900">
                  URL Final Auto-Conectada
                </span>
                <code className="mt-1 block font-mono font-bold text-emerald-950 break-all text-[11px]">
                  {currentPage.wpPath}
                </code>
              </div>
            </div>

            {/* Demostración de la Miga de Pan ([dt_breadcrumbs]) según su nivel */}
            <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-[#003865] mr-2">
                  Breadcrumb Automático (`[dt_breadcrumbs]` en línea 1):
                </span>
                <span className="font-medium text-slate-800">
                  {currentPage.breadcrumbTrail}
                </span>
              </div>
              <span className="text-[11px] text-sky-900 font-semibold">
                Se genera automáticamente al elegir la Página Superior ({currentPage.levelLabel})
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

              <div
                className={`grid grid-cols-1 ${
                  currentPage.cards.length === 2 || currentPage.cards.length === 4
                    ? 'md:grid-cols-2'
                    : 'md:grid-cols-3'
                } gap-3.5`}
              >
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
                    className="group flex flex-col justify-between bg-white border border-[#DCDCDC] rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] hover:bg-[var(--hover-bg)] hover:border-[var(--hover-bg)] text-left"
                  >
                    <div>
                      <h4 className="text-[15px] font-bold text-[#19324B] group-hover:text-white leading-snug mb-2 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[13px] text-[#475569] group-hover:text-white/95 leading-relaxed transition-colors">
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-white/90">
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
                  Si en el menú izquierdo de tu WordPress tienes acceso a <strong>Herramientas › Importar › WordPress</strong>, puedes subir cualquiera de estos dos archivos XML oficiales para crear automáticamente las páginas con su <strong>Página Superior (`post_parent`)</strong>, su <strong>Slug (`post_name`)</strong>, su <strong>Breadcrumb (`[dt_breadcrumbs]`)</strong> y sus <strong>Shortcodes WPBakery (0% `[vc_raw_html]`)</strong> en un solo paso. Si no tienes acceso a esa opción, usa las pestañas por Olas de arriba para crearlas manualmente.
                </p>
              </div>

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
                        applyBasePathToShortcode(wpXmlOlas012Raw, basePath),
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
                        applyBasePathToShortcode(wpXmlAll160Raw, basePath),
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Pega esta hoja una única vez en <strong>The7 › Theme Options › Advanced › Custom CSS</strong> (o en <em>Apariencia › Personalizar › CSS adicional</em>).
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(wpCssRaw, 'css')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003865] text-white font-bold text-xs cursor-pointer"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'css' ? 'Copiado' : 'Copiar CSS'}
                </button>
              </div>
              <textarea
                readOnly
                value={wpCssRaw}
                aria-label="Hoja de estilos CSS oficial para WPBakery y The7"
                className="w-full h-[430px] font-mono text-xs leading-relaxed p-4 rounded-xl bg-slate-900 text-emerald-200 border border-slate-800 focus:outline-none"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
