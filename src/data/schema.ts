/**
 * Contrato de datos del Portal SAT.
 * Fuerte declarativo para todo el catálogo (allTramites.json / allProcesos.json)
 * y validación runtime para detectar deriva entre ETL y frontend.
 */

export const PILLARS = ['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'] as const;
export type PillarType = (typeof PILLARS)[number];

export type EtapaAtoId = 'empezar' | 'operar' | 'consultar' | 'modificar_cerrar' | 'normativa';
export type TipoInteraccionId = 'servicio_transaccional' | 'consulta_datos' | 'guia_informativa' | 'descarga_recurso';
export type TipologiaContenidoId =
  | 'tramite_interactivo'
  | 'guia_requisitos'
  | 'guia_informativa'
  | 'consulta_buscador'
  | 'normativa_criterio'
  | 'contenido_multimedia'
  | 'recurso_descargable'
  | 'aviso_operativo';

export interface TramiteItem {
  id: string;
  codigo?: string;
  pillar: PillarType;
  pillarName: string;

  // Estructura Estrictamente Numérica N1–N5 (Regla 1)
  nivel1: string;
  orden_n1: number;
  nivel2: string;
  orden_n2: number;
  nivel3: string;
  orden_n3?: number | string;
  nivel4: string;
  orden_n4?: number | string;
  nivel5: string;
  orden_n5?: number | string;
  orden_contenido?: number | null;

  // Denominación Oficial de la Gestión (Regla 12)
  gestion: string;
  nombreActual?: string;
  descripcion: string;
  url: string;

  // Compatibilidad legacy e hidratación en runtime
  tramite?: string;
  categoria?: string;
  subcategoria?: string;
  categoriaId?: string;
  subcategoriaId?: string;

  // Metadatos operativos y taxonomía extendida
  migaBreadcrumb?: string;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  nota?: string;
  grupoNo?: number;
  grupoNombre?: string;
  etapaAto?: EtapaAtoId;
  etapaAtoLabel?: string;
  tipoInteraccion?: TipoInteraccionId;
  tipoInteraccionLabel?: string;
  tipologiaContenido?: TipologiaContenidoId;
  tipologiaContenidoLabel?: string;
  plataformaSistema?: string;
  plataformaSistemaLabel?: string;
  canalAtencion?: string;
  esBrecha?: boolean;
  subfamiliaAduanera?: string;
  familiaAduanera?: string;
  actorEspecifico?: string;
  controlAuditoria?: string;
  baseLegal?: string;
  formulario?: string;
  requisitos?: string[];
  pasos?: string[];
  familias_ids?: string[];
  familiaTematica?: string;
  rutasProceso?: {
    procesoNo: number;
    procesoNombre: string;
    pasoNo: number;
    pasoAccion: string;
  }[];
  codigos_legacy?: string[];
}

export interface ProcesoPaso {
  numero: number;
  accion: string;
  pagina?: string;
  ubicacion?: string;
  url?: string;
}

export interface ProcesoGuiado {
  no: number;
  nombre: string;
  audiencia?: string;
  etapa?: string;
  paraQuien?: string;
  categorias?: string;
  totalPasos?: number;
  totalPaginas?: number;
  rutaPasosResumen?: string[];
  pasos?: ProcesoPaso[];
}

export interface ContenidoUbicacion {
  tramiteId: string;
  segmentoId: string;
}

export interface ContenidoAudiencia {
  tramiteId?: string;
  segmentoId: string;
  segmentoNombre?: string;
  categoria?: string;
  subcategoria?: string;
  tema?: string;
  subtema?: string;
  actorEspecifico?: string;
  migaBreadcrumb?: string;
}

export interface ProcesoRutaReferencia {
  procesoNo: number;
  procesoNombre?: string;
  pasoNo: number;
  pasoAccion?: string;
}

export interface ContenidoUnicoItem {
  id: string;
  codigo: string;
  idOriginal: string;
  titulo: string;
  nombreActual?: string;
  descripcion: string;
  url: string;
  tipoInteraccion?: TipoInteraccionId;
  tipoInteraccionLabel?: string;
  tipologiaContenido?: TipologiaContenidoId;
  tipologiaContenidoLabel?: string;
  plataformaSistema?: string;
  plataformaSistemaLabel?: string;
  canalAtencion?: string;
  etapaAto?: EtapaAtoId;
  etapaAtoLabel?: string;
  baseLegal?: string;
  esBrecha?: boolean;
  esTransversal: boolean;
  totalAudiencias: number;
  tramiteIds: string[];
  ubicaciones?: ContenidoUbicacion[];
  audiencias?: ContenidoAudiencia[];
  segmentosAplicables: string[];
  categoriasAplicables?: string[];
  perfilDestinatario?: string;
  rutasProceso?: ProcesoRutaReferencia[];
  familias_ids?: string[];
  familiaTematica?: string;
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isHttpUrl(value: unknown): boolean {
  return typeof value === 'string' && /^https?:\/\/\S+$/i.test(value.trim());
}

const REQUIRED_TRAMITE_FIELDS: { field: keyof TramiteItem; label: string }[] = [
  { field: 'id', label: 'id' },
  { field: 'pillar', label: 'pillar' },
  { field: 'pillarName', label: 'pillarName' },
  { field: 'nivel1', label: 'nivel1' },
  { field: 'nivel2', label: 'nivel2' },
  { field: 'nivel3', label: 'nivel3' },
  { field: 'gestion', label: 'gestion' },
  { field: 'descripcion', label: 'descripcion' },
  { field: 'url', label: 'url' },
];

export function collectTramiteErrors(data: unknown): string[] {
  if (!Array.isArray(data)) return ['allTramites: se esperaba un arreglo'];
  const errors: string[] = [];
  const seenIds = new Set<string>();

  data.forEach((item, index) => {
    const where = `allTramites[${index}]`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${where}: no es un objeto`);
      return;
    }
    const t = item as Record<string, unknown>;

    REQUIRED_TRAMITE_FIELDS.forEach(({ field, label }) => {
      const value = t[field];
      if (field === 'url') {
        if (!isHttpUrl(value)) errors.push(`${where}.url: inválida (${String(value)})`);
        return;
      }
      if (field === 'pillar' && !PILLARS.includes(value as PillarType)) {
        errors.push(`${where}.pillar: valor no soportado "${String(value)}"`);
        return;
      }
      if (!isNonEmptyString(value)) {
        const tipo = value == null ? 'ausente' : `tipo ${typeof value}`;
        errors.push(`${where}.${label}: ${tipo}`);
      }
    });

    const id = t.id;
    if (isNonEmptyString(id)) {
      if (seenIds.has(id)) errors.push(`${where}.id: duplicado "${id}"`);
      seenIds.add(id);
    }
  });

  return errors;
}

export function collectProcesoErrors(data: unknown): string[] {
  if (!Array.isArray(data)) return ['allProcesos: se esperaba un arreglo'];
  const errors: string[] = [];

  data.forEach((item, index) => {
    const where = `allProcesos[${index}]`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${where}: no es un objeto`);
      return;
    }
    const p = item as Record<string, unknown>;
    if (!isNonEmptyString(p.nombre)) errors.push(`${where}.nombre: ausente`);
    if (typeof p.no !== 'number') errors.push(`${where}.no: ausente`);

    if (!Array.isArray(p.pasos)) {
      errors.push(`${where}.pasos: se esperaba un arreglo`);
      return;
    }
    p.pasos.forEach((paso, pasoIndex) => {
      const stepWhere = `${where}.pasos[${pasoIndex}]`;
      if (typeof paso !== 'object' || paso === null) {
        errors.push(`${stepWhere}: no es un objeto`);
        return;
      }
      const ps = paso as Record<string, unknown>;
      if (typeof ps.numero !== 'number' || !Number.isInteger(ps.numero) || ps.numero < 1) {
        errors.push(`${stepWhere}.numero: se esperaba un entero ≥ 1, se obtuvo ${String(ps.numero)}`);
      }
      if (!isNonEmptyString(ps.accion)) errors.push(`${stepWhere}.accion: ausente`);
      if (ps.url !== undefined && !isHttpUrl(ps.url)) errors.push(`${stepWhere}.url: inválida (${String(ps.url)})`);
    });
  });

  return errors;
}

function formatErrors(kind: string, errors: string[]): Error {
  const visible = errors.slice(0, 25);
  const rest = errors.length - visible.length;
  const list = visible.map((e) => `  - ${e}`).join('\n');
  return new Error(`${kind}: ${errors.length} problema(s) de contrato:\n${list}${rest > 0 ? `\n  … y ${rest} más` : ''}`);
}

export function assertTramites(raw: unknown): TramiteItem[] {
  const errors = collectTramiteErrors(raw);
  if (errors.length > 0) throw formatErrors('allTramites.json', errors);
  const items = raw as TramiteItem[];
  items.forEach((t) => {
    // Hidratación de retrocompatibilidad para componentes UI y taxonomía
    if (!t.gestion) t.gestion = t.tramite || t.nombreActual || '';
    if (!t.tramite) t.tramite = t.gestion;
    if (!t.categoria) t.categoria = t.nivel2;
    if (!t.subcategoria) t.subcategoria = (t.nivel3 && t.nivel3 !== '—') ? t.nivel3 : t.nivel2;
  });
  return items;
}

export function assertProcesos(raw: unknown): ProcesoGuiado[] {
  const errors = collectProcesoErrors(raw);
  if (errors.length > 0) throw formatErrors('allProcesos.json', errors);
  return raw as ProcesoGuiado[];
}

export function collectContenidoUnicoErrors(data: unknown): string[] {
  if (!Array.isArray(data)) return ['catalogoContenidosUnicos: se esperaba un arreglo'];
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenCodigos = new Set<string>();

  data.forEach((item, index) => {
    const where = `catalogoContenidosUnicos[${index}]`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${where}: no es un objeto`);
      return;
    }
    const c = item as Record<string, unknown>;

    if (!isNonEmptyString(c.id)) errors.push(`${where}.id: ausente`);
    else {
      if (seenIds.has(c.id)) errors.push(`${where}.id: duplicado "${c.id}"`);
      seenIds.add(c.id);
    }

    if (!isNonEmptyString(c.codigo)) errors.push(`${where}.codigo: ausente`);
    else {
      if (seenCodigos.has(c.codigo)) errors.push(`${where}.codigo: duplicado "${c.codigo}"`);
      seenCodigos.add(c.codigo);
    }

    if (!isNonEmptyString(c.titulo)) errors.push(`${where}.titulo: ausente`);
    if (!isNonEmptyString(c.descripcion)) errors.push(`${where}.descripcion: ausente`);
    if (!isHttpUrl(c.url)) errors.push(`${where}.url: inválida (${String(c.url)})`);

    if (typeof c.esTransversal !== 'boolean') errors.push(`${where}.esTransversal: se esperaba booleano`);
    if (typeof c.totalAudiencias !== 'number' || c.totalAudiencias < 1) {
      errors.push(`${where}.totalAudiencias: se esperaba entero ≥ 1`);
    }

    if (!Array.isArray(c.tramiteIds) || c.tramiteIds.length === 0) {
      errors.push(`${where}.tramiteIds: se esperaba un arreglo no vacío de IDs de trámite`);
    } else if (c.tramiteIds.length !== c.totalAudiencias) {
      errors.push(`${where}.tramiteIds: la longitud (${c.tramiteIds.length}) no coincide con totalAudiencias (${c.totalAudiencias})`);
    }

    if (!Array.isArray(c.segmentosAplicables) || c.segmentosAplicables.length === 0) {
      errors.push(`${where}.segmentosAplicables: se esperaba un arreglo no vacío`);
    }
  });

  return errors;
}

export function assertContenidosUnicos(raw: unknown): ContenidoUnicoItem[] {
  const errors = collectContenidoUnicoErrors(raw);
  if (errors.length > 0) throw formatErrors('catalogoContenidosUnicos.json', errors);
  return raw as ContenidoUnicoItem[];
}