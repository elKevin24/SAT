/**
 * Órdenes oficiales de presentación de categorías y subcategorías.
 * Contrato estable para la unión por nombre entre UI y allTramites.json.
 * Validado por tests/data-contract.spec.ts para detectar deriva de nombres.
 */

import { PillarType } from './schema';

export const OFFICIAL_CATEGORY_ORDER: Record<PillarType, string[]> = {
  contribuyentes: [
    'NIT sin Obligaciones',
    'Pequeños Contribuyentes',
    'Contribuyentes Especiales',
  ],
  comercio_exterior: [
    'Importadores y Exportadores',
    'Importadores',
    'Exportadores',
    'Operador Económico Autorizado (OEA)',
    'Agentes Aduaneros',
    'Apoderados Especiales Aduaneros',
    'Empresas de Entrega Rápida o Courier',
    'Consolidadores y Desconsolidadores de Carga',
    'Transportistas Aduaneros',
    'Depósitos Aduaneros',
    'ZDEEP - Entidades Administradoras',
    'ZDEEP - Empresas Usuarias',
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

/** Ciclo de vida homogeneizado para las categorías aduaneras (subcategorías genéricas). */
const GENERIC_LIFECYCLE_ORDER = [
  'Registro y acreditación',
  'Operaciones y trámites',
  'Consultas y seguimiento',
  'Normativa y recursos',
];

/** Categorías cuyas subcategorías son exactamente las 4 genéricas del ciclo de vida. */
const GENERIC_LIFECYCLE_CATEGORIES = new Set([
  'Apoderados Especiales Aduaneros',
  'Depósitos Aduaneros',
  'ZDEEP - Entidades Administradoras',
  'ZDEEP - Empresas Usuarias',
  'Importadores y Exportadores',
  'Exportadores',
  'Agentes Aduaneros',
  'Empresas de Entrega Rápida o Courier',
  'Importadores',
  'Consolidadores y Desconsolidadores de Carga',
  'Transportistas Aduaneros',
]);

const SPECIFIC_SUBCATEGORY_ORDER: Record<string, string[]> = {
  'NIT sin Obligaciones': [
    'Inscripción de NIT',
    'Servicios en Línea y Solvencias',
    'Títulos Universitarios',
    'Información Pública',
  ],
  'Pequeños Contribuyentes': [
    'Régimen de Pequeño Contribuyente',
    'Régimen Agropecuario y Productores',
  ],
  'Abogados y Notarios': [
    'Habilitación y Registro Profesional',
    'Timbres Fiscales y Papel Sellado de Protocolo',
    'Traspaso Electrónico Vehicular (e-Traspaso)',
    'Avisos Notariales ante la SAT',
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
    'Sistemas de Retención en la Fuente',
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