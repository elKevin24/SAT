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
  | 'consulta_buscador'
  | 'normativa_criterio'
  | 'recurso_descargable'
  | 'aviso_operativo';

export interface TramiteItem {
  id: string;
  pillar: PillarType;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tramite: string;
  descripcion: string;
  url: string;
  categoriaId?: string;
  subcategoriaId?: string;

  macroGrupo?: string;
  tema?: string;
  subtema?: string;
  nombreActual?: string;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  seccionActual?: string;
  nota?: string;
  grupoNo?: number;
  grupoNombre?: string;
  etapaAto?: EtapaAtoId;
  etapaAtoLabel?: string;
  tipoInteraccion?: TipoInteraccionId;
  tipoInteraccionLabel?: string;
  tipologiaContenido?: TipologiaContenidoId;
  tipologiaContenidoLabel?: string;
  esBrecha?: boolean;
  subfamiliaAduanera?: string;
  actorEspecifico?: string;
  nivel1_segmento?: string;
  nivel2_area?: string;
  nivel3_subarea?: string;
  nivel4_tema?: string;
  nivel5_tramite?: string;
  segmento?: string;
  regimenArea?: string;
  grupoActor?: string;
  materiaTema?: string;
  subtemaGestion?: string;
  migaBreadcrumb?: string;
  controlAuditoria?: string;
  baseLegal?: string;
  formulario?: string;
  requisitos?: string[];
  pasos?: string[];
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
  { field: 'categoria', label: 'categoria' },
  { field: 'subcategoria', label: 'subcategoria' },
  { field: 'tramite', label: 'tramite' },
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
  return raw as TramiteItem[];
}

export function assertProcesos(raw: unknown): ProcesoGuiado[] {
  const errors = collectProcesoErrors(raw);
  if (errors.length > 0) throw formatErrors('allProcesos.json', errors);
  return raw as ProcesoGuiado[];
}