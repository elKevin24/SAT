/**
 * Órdenes oficiales de presentación de categorías y subcategorías.
 * Contrato estable para la unión por nombre entre UI y allTramites.json.
 * Validado por tests/data-contract.spec.ts para detectar deriva de nombres.
 */

import { PillarType, TramiteItem } from './schema';

export const OFFICIAL_CATEGORY_ORDER: Record<PillarType, string[]> = {
  contribuyentes: [
    'Sin Obligaciones',
    'Pequeños Contribuyentes',
    'Contribuyente General',
    'Contribuyentes Especiales',
  ],
  comercio_exterior: [
    'Importadores',
    'Exportadores',
    'Operador Económico Autorizado (OEA)',
    'Auxiliares de la Función Pública Aduanera (AFPA)',
    'Regímenes Territoriales y Zonas Especiales',
    'Normativa y Operaciones Aduaneras Generales',
  ],
  profesionales: [
    'Abogados y Notarios',
    'Peritos Contadores',
    'Auditores',
    'Gestores Tributarios',
    'Servicios Profesionales',
  ],
  entes_exentos: [
    'Entidades del Estado',
    'Constitucionales',
    'No Lucrativos',
    'Municipalidades',
    'Decreto',
  ],
};

/** Ciclo de vida homogeneizado para categorías genéricas. */
const GENERIC_LIFECYCLE_ORDER = [
  'Registro y acreditación',
  'Operaciones y trámites',
  'Consultas y seguimiento',
  'Normativa y recursos',
];

/** Categorías cuyas subcategorías son exactamente las 4 genéricas del ciclo de vida. */
const GENERIC_LIFECYCLE_CATEGORIES = new Set<string>();

const SPECIFIC_SUBCATEGORY_ORDER: Record<string, string[]> = {
  // Categorias compactadas: el subconjunto es la propia categoria (nivel3 = —).
  'Sin Obligaciones': ['Sin Obligaciones'],
  'Contribuyente General': [
    'Inscripción y actualización en el RTU',
    'Facturación electrónica y documentos tributarios',
    'Declaraciones, pagos y solvencias',
    'Devoluciones y créditos fiscales',
    'Regímenes tributarios',
    'Vehículos (como propietario)',
    'Servicios y gestiones al contribuyente',
    'Cultura tributaria y capacitación',
  ],
  'Pequeños Contribuyentes': [
    'Régimen de Pequeño Contribuyente',
    'Régimen Agropecuario y Productores',
  ],
  'Contribuyentes Especiales': [
    'Gerencias Especiales y Control Tributario',
    'Declaraciones e Informes Especiales',
    'Capacitación y Orientación Diferenciada',
  ],
  'Abogados y Notarios': [
    'Habilitación y Registro Notarial',
    'Timbres Fiscales y Papel Sellado de Protocolo',
    'Traspaso Electrónico Vehicular (e-Traspaso)',
    'Avisos Notariales y Fe Pública',
  ],
  'Peritos Contadores': [
    'Habilitación y Registro de Perito Contador',
    'Consultas, Retenciones y Libros Contables',
  ],
  'Auditores': [
    'Habilitación y Registro de Auditor (CPA)',
    'Dictámenes de Crédito Fiscal y Auditoría',
  ],
  'Gestores Tributarios': [
    'Acreditación y Carné Oficial de Gestor',
    'Renovación y Gestión de Gafetes',
  ],
  'Servicios Profesionales': [
    'Facturación por Honorarios y Formularios',
    'Actualización de Actividad y RTU',
    'Consultas Jurídico Tributarias',
    'Sistemas de Retención y Cumplimiento',
  ],
  'Importadores': [
    'Registro y Padrón de Importadores',
    'Declaraciones Aduaneras y DUCAs',
    'Despacho Aduanero, Levante y Selectivo',
    'Importación y Nacionalización de Vehículos',
    'Mercancías en Abandono, Depósitos y Franquicias',
  ],
  'Exportadores': [
    'Padrón y Registro de Exportadores',
    'Declaraciones Aduaneras y Embarques',
    'Devolución de Crédito Fiscal',
  ],
  'Operador Económico Autorizado (OEA)': [
    'Operador Económico Autorizado (OEA)',
  ],
  'Auxiliares de la Función Pública Aduanera (AFPA)': [
    'Agentes Aduaneros',
    'Apoderados Especiales Aduaneros',
    'Depósitos Aduaneros',
    'Empresas de Entrega Rápida o Courier',
    'Transportistas Aduaneros',
  ],
  'Regímenes Territoriales y Zonas Especiales': [
    'Maquilas (Decreto 29-89)',
    'Zonas de Desarrollo Económico Especial Público (ZDEEP)',
  ],
  'Normativa y Operaciones Aduaneras Generales': [
    'Arancel Centroamericano (SAC) y Permisos',
    'Acuerdos Comerciales y Facilitación',
    'Prevención de Contrabando y Defraudación',
    'Consultas Técnicas, Recursos y Valoración',
    'Modernización e Infraestructura Aduanera',
  ],
  'Entidades del Estado': [
    'Registro Institucional y RTU Estatal',
    'Facturación FEL, Retenciones y Operaciones',
    'Parque Vehicular Oficial y de Autoridad',
    'Control Interno, Solvencias y Normativa',
  ],
  'Constitucionales': [
    'Centros Educativos y Universidades (Arts. 73 y 88)',
    'Iglesias y Deporte Federado (Arts. 37 y 92)',
    'Vehículos, Solvencias y Asistencia Institucional',
  ],
  'No Lucrativos': [
    'Inscripción y RTU de Organizaciones No Lucrativas',
    'Exenciones CIVA, Actualización y Cierre de Operaciones',
  ],
  'Municipalidades': [
    'Municipalidades',
  ],
  'Decreto': [
    'Misiones Diplomáticas y Organismos Internacionales',
    'Cooperativas, Partidos Políticos y Exenciones Especiales',
    'Donaciones Oficiales y Despacho Aduanero',
  ],
};

export const OFFICIAL_SUBCATEGORY_ORDER: Record<string, string[]> = Object.keys(
  SPECIFIC_SUBCATEGORY_ORDER,
).reduce(
  (acc, category) => {
    acc[category] = orderForCategory(category);
    return acc;
  },
  {} as Record<string, string[]>,
);

function orderForCategory(category: string): string[] {
  const order: string[] = [];
  const specific = SPECIFIC_SUBCATEGORY_ORDER[category];
  if (specific) order.push(...specific);
  if (GENERIC_LIFECYCLE_CATEGORIES.has(category)) {
    order.push(...GENERIC_LIFECYCLE_ORDER);
  }
  return Array.from(new Set(order));
}

export function subcategoryOrderFor(category: string): string[] {
  return orderForCategory(category);
}

export function compareByCategoryOrder(list: string[], a: string, b: string): number {
  const idxA = list.indexOf(a);
  const idxB = list.indexOf(b);
  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;
  const aIsInsc = a.toLowerCase().includes('inscripci');
  const bIsInsc = b.toLowerCase().includes('inscripci');
  if (aIsInsc && !bIsInsc) return -1;
  if (!aIsInsc && bIsInsc) return 1;
  return a.localeCompare(b);
}

const ATO_CYCLE_ORDER: Record<string, number> = {
  empezar: 1,
  operar: 2,
  consultar: 3,
  modificar_cerrar: 4,
  normativa: 5,
};

/**
 * Comparador canónico determinista para trámites del catálogo.
 * Sigue la regla de gobernanza institucional:
 * 1. Columnas numéricas de la matriz de 25 columnas: orden_n1 a orden_n5.
 * 2. Índice relativo dentro del contenedor final (orden_contenido).
 * 3. Ciclo de vida ATO (1. Empezar -> 2. Operar -> 3. Consultar -> 4. Modificar -> 5. Normativa).
 * 4. Desempate alfabético por título.
 */
export function compareCanonicalTramiteOrder(a: TramiteItem, b: TramiteItem): number {
  const toNum = (v: unknown): number => (typeof v === 'number' ? v : (typeof v === 'string' && /^\d+$/.test(v) ? parseInt(v, 10) : 999));
  const o1A = toNum(a.orden_n1);
  const o1B = toNum(b.orden_n1);
  if (o1A !== o1B) return o1A - o1B;

  const o2A = toNum(a.orden_n2);
  const o2B = toNum(b.orden_n2);
  if (o2A !== o2B) return o2A - o2B;

  const o3A = toNum(a.orden_n3);
  const o3B = toNum(b.orden_n3);
  if (o3A !== o3B) return o3A - o3B;

  const o4A = toNum(a.orden_n4);
  const o4B = toNum(b.orden_n4);
  if (o4A !== o4B) return o4A - o4B;

  const o5A = toNum(a.orden_n5);
  const o5B = toNum(b.orden_n5);
  if (o5A !== o5B) return o5A - o5B;

  const ocA = toNum(a.orden_contenido);
  const ocB = toNum(b.orden_contenido);
  if (ocA !== ocB) return ocA - ocB;

  const atoA = a.etapaAto ? (ATO_CYCLE_ORDER[a.etapaAto] ?? 99) : 99;
  const atoB = b.etapaAto ? (ATO_CYCLE_ORDER[b.etapaAto] ?? 99) : 99;
  if (atoA !== atoB) return atoA - atoB;

  return (a.gestion || a.tramite || '').localeCompare(b.gestion || b.tramite || '');
}