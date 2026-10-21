/**
 * MODELO INTERNO DE RELACIONES DE CONTENIDO, GRAFOS TEMÁTICOS Y POLIJERARQUÍA (PORTAL SAT)
 * 
 * Capas de relación implementadas:
 * - Capa A (Proceso / Taxpayer Journey): Prerrequisitos mandatorios, siguientes pasos del ciclo ATO y herramientas de apoyo.
 * - Capa B (Familias Temáticas): Ecosistemas de servicios afines (FEL, RTU, Vehículos, DUCAs, etc.).
 * 
 * NOTA DE GOBERNANZA:
 * Este modelo es estrictamente interno y programático (para el asistente virtual RITA,
 * motores de búsqueda, inspectores avanzados y endpoints de consulta).
 * NO se proyecta en las tarjetas de trámite ciudadanas para evitar sobrecarga cognitiva
 * y preservar la simplicidad de la navegación principal.
 */

import { TramiteItem, EtapaAtoId, TipoInteraccionId } from './schema';

// --- 1. DEFINICIÓN DE FAMILIAS TEMÁTICAS CANÓNICAS (CAPA B) ---

export type FamiliaTematicaId =
  | 'fel'
  | 'vehiculos'
  | 'rtu-digital'
  | 'ducas'
  | 'solvencia-fiscal'
  | 'maquilas-29-89'
  | 'zdeep'
  | 'afpa'
  | 'agencia-virtual'
  | 'exenciones';

export interface FamiliaTematicaMeta {
  id: FamiliaTematicaId;
  codigo: string;
  nombre: string;
  descripcion: string;
  icon: string;
  color: string;
}

export const FAMILIAS_TEMATICAS: Record<FamiliaTematicaId, FamiliaTematicaMeta> = {
  'fel': {
    id: 'fel',
    codigo: 'FAM-01',
    nombre: 'Factura Electrónica en Línea (FEL)',
    descripcion: 'Ecosistema de emisión, anulación, certificación y verificación de Documentos Tributarios Electrónicos (DTE).',
    icon: 'FileSpreadsheet',
    color: '#0284C7'
  },
  'vehiculos': {
    id: 'vehiculos',
    codigo: 'FAM-02',
    nombre: 'Registro Fiscal de Vehículos (RFV)',
    descripcion: 'Inscripción, traspasos electrónicos (TEV), pago de ISCV, distintivos y trámites de parque vehicular.',
    icon: 'Car',
    color: '#10B981'
  },
  'rtu-digital': {
    id: 'rtu-digital',
    codigo: 'FAM-03',
    nombre: 'Registro Tributario Unificado (RTU) Digital',
    descripcion: 'Inscripción inicial de NIT, actualización periódica de datos, ratificación de domicilio y cese de actividades.',
    icon: 'UserCheck',
    color: '#14649B'
  },
  'ducas': {
    id: 'ducas',
    codigo: 'FAM-04',
    nombre: 'Declaraciones Aduaneras (DUCAs)',
    descripcion: 'Transmisión y gestión de DUCA-F, DUCA-D, DUCA-T, anticipadas, rectificaciones y manifiestos de carga.',
    icon: 'Ship',
    color: '#0EA5E9'
  },
  'solvencia-fiscal': {
    id: 'solvencia-fiscal',
    codigo: 'FAM-05',
    nombre: 'Solvencias y Convenios de Pago',
    descripcion: 'Emisión electrónica de solvencia fiscal, reconocimientos de deuda y facilidades de pago en cuotas.',
    icon: 'ShieldCheck',
    color: '#059669'
  },
  'maquilas-29-89': {
    id: 'maquilas-29-89',
    codigo: 'FAM-06',
    nombre: 'Regímenes Especiales y Maquilas (Dto. 29-89)',
    descripcion: 'Perfeccionamiento activo, cuenta corriente de importaciones temporales, fianzas y descargos aduaneros.',
    icon: 'Factory',
    color: '#8B5CF6'
  },
  'zdeep': {
    id: 'zdeep',
    codigo: 'FAM-07',
    nombre: 'Zonas de Desarrollo Económico Especial Público (ZDEEP)',
    descripcion: 'Operaciones para empresas administradoras y usuarias dentro del régimen ZDEEP y Zonas Francas.',
    icon: 'Building2',
    color: '#6366F1'
  },
  'afpa': {
    id: 'afpa',
    codigo: 'FAM-08',
    nombre: 'Auxiliares de la Función Pública Aduanera (AFPA)',
    descripcion: 'Agentes aduaneros, transportistas, depositarios, couriers: carnetización, garantías y firma electrónica PKI.',
    icon: 'BadgeCheck',
    color: '#D97706'
  },
  'agencia-virtual': {
    id: 'agencia-virtual',
    codigo: 'FAM-09',
    nombre: 'Agencia Virtual y Servicios Remotos',
    descripcion: 'Solicitud de acceso, recuperación de contraseña, buzón tributario y habilitación de gestiones en línea.',
    icon: 'KeyRound',
    color: '#2563EB'
  },
  'exenciones': {
    id: 'exenciones',
    codigo: 'FAM-10',
    nombre: 'Franquicias y Exenciones Tributarias',
    descripcion: 'Exención del IVA e IPRIMA para diplomáticos, misiones internacionales, iglesias y entidades sin fines de lucro.',
    icon: 'Award',
    color: '#EC4899'
  }
};

// --- 2. RELACIONES DE PROCESO (CAPA A - TAXPAYER JOURNEY) ---

export type TipoRelacionProceso = 'prerrequisito' | 'siguiente_paso' | 'herramienta_apoyo' | 'normativa_asociada';

export interface RelacionProcesoItem {
  origenCodigo: string;
  destinoCodigo: string;
  tipo: TipoRelacionProceso;
  justificacion: string;
}

/**
 * Matriz Curada de Relaciones de Proceso Fundamentales de la Administración Tributaria.
 * Se rige por los códigos canónicos SAT-GES-####.
 */
export const RELACIONES_PROCESO_CANONICAS: RelacionProcesoItem[] = [
  // Ciclo RTU y Agencia Virtual
  {
    origenCodigo: 'SAT-GES-0003', // Solicitud y Activación de Agencia Virtual
    destinoCodigo: 'SAT-GES-0001', // Solicitar NIT
    tipo: 'prerrequisito',
    justificacion: 'Es indispensable contar con NIT activo para solicitar usuario de Agencia Virtual.'
  },
  {
    origenCodigo: 'SAT-GES-0319', // Factura Electrónica en Línea (FEL)
    destinoCodigo: 'SAT-GES-0003', // Agencia Virtual
    tipo: 'prerrequisito',
    justificacion: 'La habilitación como emisor de FEL se gestiona desde el portal de Agencia Virtual.'
  },
  {
    origenCodigo: 'SAT-GES-0005', // Solicitud y Emisión de Solvencia Fiscal en Línea
    destinoCodigo: 'SAT-GES-0003', // Agencia Virtual
    tipo: 'prerrequisito',
    justificacion: 'La solvencia fiscal digital requiere ingreso autenticado a Agencia Virtual.'
  },

  // Ciclo Vehicular (TEV)
  {
    origenCodigo: 'SAT-GES-0274', // Entregar documentos del traspaso electrónico en Agencia Virtual
    destinoCodigo: 'SAT-GES-0003', // Agencia Virtual
    tipo: 'prerrequisito',
    justificacion: 'Tanto comprador como vendedor deben poseer Agencia Virtual para aprobar el traspaso.'
  },
  {
    origenCodigo: 'SAT-GES-0275', // Enviar documentos digitales del traspaso electrónico (TEV)
    destinoCodigo: 'SAT-GES-0274', // Entregar documentos del traspaso
    tipo: 'prerrequisito',
    justificacion: 'Paso operativo complementario del proceso de Traspaso Electrónico de Vehículos.'
  },

  // Ciclo Comercio Exterior y DUCAs
  {
    origenCodigo: 'SAT-GES-0358', // Consulta de Pago de DUCA-F en País de Destino
    destinoCodigo: 'SAT-GES-0359', // Consulta y Verificación de Declaraciones DUCA-F / FAUCA
    tipo: 'herramienta_apoyo',
    justificacion: 'Herramienta de verificación de estatus financiero antes del levante de mercancías.'
  },

  // Siguiente Paso ATO (Pequeños Contribuyentes a Operar)
  {
    origenCodigo: 'SAT-GES-0015', // Autorizar documentos para pequeños contribuyentes
    destinoCodigo: 'SAT-GES-0319', // Factura Electrónica en Línea (FEL)
    tipo: 'siguiente_paso',
    justificacion: 'Tras registrarse como pequeño contribuyente, el siguiente paso obligatorio es emitir en FEL.'
  }
];

// --- 3. CONSTRUCTOR DEL GRAFO DE RELACIONES ---

export interface TramiteResumen {
  id: string;
  codigo: string;
  titulo: string;
  url: string;
  pillar: string;
  etapaAto?: EtapaAtoId;
  etapaAtoLabel?: string;
  tipoInteraccion?: TipoInteraccionId;
  tipoInteraccionLabel?: string;
  familias_ids: FamiliaTematicaId[];
}

export interface RelationshipGraph {
  getPrerrequisitos: (codigoOId: string) => Array<{ tramite: TramiteResumen; justificacion: string }>;
  getSiguientesPasos: (codigoOId: string) => Array<{ tramite: TramiteResumen; justificacion: string }>;
  getHerramientasApoyo: (codigoOId: string) => Array<{ tramite: TramiteResumen; justificacion: string }>;
  getGestionesFamilia: (familiaId: FamiliaTematicaId, options?: { limit?: number; excludeCodigo?: string }) => TramiteResumen[];
  getGrafoRelaciones: (codigoOId: string) => {
    tramite: TramiteResumen;
    prerrequisitos: Array<{ tramite: TramiteResumen; justificacion: string }>;
    siguientesPasos: Array<{ tramite: TramiteResumen; justificacion: string }>;
    herramientasApoyo: Array<{ tramite: TramiteResumen; justificacion: string }>;
    familias: FamiliaTematicaMeta[];
    gestionesRelacionadasFamilia: TramiteResumen[];
  } | null;
}

function toResumen(item: TramiteItem): TramiteResumen {
  return {
    id: item.id,
    codigo: item.codigo || item.id,
    titulo: item.gestion || item.tramite || item.nombreActual || 'Gestión Oficial',
    url: item.url,
    pillar: item.pillar,
    etapaAto: item.etapaAto,
    etapaAtoLabel: item.etapaAtoLabel,
    tipoInteraccion: item.tipoInteraccion,
    tipoInteraccionLabel: item.tipoInteraccionLabel,
    familias_ids: (item.familias_ids || []) as FamiliaTematicaId[]
  };
}

export function buildRelationshipGraph(tramites: TramiteItem[]): RelationshipGraph {
  // Mapa por código canónico
  const tramitesByCodigo = new Map<string, TramiteItem>();
  tramites.forEach(item => {
    if (item.codigo) {
      tramitesByCodigo.set(item.codigo, item);
    }
    tramitesByCodigo.set(item.id, item);
  });

  // Índices de relaciones de proceso
  const prerrequisitosIndex = new Map<string, RelacionProcesoItem[]>();
  const siguientesPasosIndex = new Map<string, RelacionProcesoItem[]>();
  const herramientasIndex = new Map<string, RelacionProcesoItem[]>();

  RELACIONES_PROCESO_CANONICAS.forEach(rel => {
    if (rel.tipo === 'prerrequisito') {
      const list = prerrequisitosIndex.get(rel.origenCodigo) || [];
      list.push(rel);
      prerrequisitosIndex.set(rel.origenCodigo, list);

      // Inverso: el destino tiene al origen como siguiente paso
      const sigList = siguientesPasosIndex.get(rel.destinoCodigo) || [];
      sigList.push({
        origenCodigo: rel.destinoCodigo,
        destinoCodigo: rel.origenCodigo,
        tipo: 'siguiente_paso',
        justificacion: `Continuidad natural: tras completar esta gestión, corresponde tramitar ${rel.origenCodigo}.`
      });
      siguientesPasosIndex.set(rel.destinoCodigo, sigList);
    } else if (rel.tipo === 'siguiente_paso') {
      const list = siguientesPasosIndex.get(rel.origenCodigo) || [];
      list.push(rel);
      siguientesPasosIndex.set(rel.origenCodigo, list);
    } else if (rel.tipo === 'herramienta_apoyo') {
      const list = herramientasIndex.get(rel.origenCodigo) || [];
      list.push(rel);
      herramientasIndex.set(rel.origenCodigo, list);
    }
  });

  // Índice de Familias Temáticas
  const familiasTramitesIndex = new Map<FamiliaTematicaId, TramiteItem[]>();
  tramites.forEach(item => {
    const fIds = (item.familias_ids || []) as FamiliaTematicaId[];
    fIds.forEach(fId => {
      const current = familiasTramitesIndex.get(fId) || [];
      current.push(item);
      familiasTramitesIndex.set(fId, current);
    });
  });

  const getPrerrequisitos = (codigoOId: string): Array<{ tramite: TramiteResumen; justificacion: string }> => {
    const rels = prerrequisitosIndex.get(codigoOId) || [];
    return rels
      .map(rel => {
        const item = tramitesByCodigo.get(rel.destinoCodigo);
        return item ? { tramite: toResumen(item), justificacion: rel.justificacion } : null;
      })
      .filter((v): v is { tramite: TramiteResumen; justificacion: string } => v !== null);
  };

  const getSiguientesPasos = (codigoOId: string): Array<{ tramite: TramiteResumen; justificacion: string }> => {
    const rels = siguientesPasosIndex.get(codigoOId) || [];
    return rels
      .map(rel => {
        const item = tramitesByCodigo.get(rel.destinoCodigo);
        return item ? { tramite: toResumen(item), justificacion: rel.justificacion } : null;
      })
      .filter((v): v is { tramite: TramiteResumen; justificacion: string } => v !== null);
  };

  const getHerramientasApoyo = (codigoOId: string): Array<{ tramite: TramiteResumen; justificacion: string }> => {
    const rels = herramientasIndex.get(codigoOId) || [];
    return rels
      .map(rel => {
        const item = tramitesByCodigo.get(rel.destinoCodigo);
        return item ? { tramite: toResumen(item), justificacion: rel.justificacion } : null;
      })
      .filter((v): v is { tramite: TramiteResumen; justificacion: string } => v !== null);
  };

  const getGestionesFamilia = (
    familiaId: FamiliaTematicaId,
    options?: { limit?: number; excludeCodigo?: string }
  ): TramiteResumen[] => {
    const list = familiasTramitesIndex.get(familiaId) || [];
    const limit = options?.limit ?? 6;
    const exclude = options?.excludeCodigo;

    return list
      .filter(item => (exclude ? item.codigo !== exclude && item.id !== exclude : true))
      .slice(0, limit)
      .map(toResumen);
  };

  const getGrafoRelaciones = (codigoOId: string) => {
    const item = tramitesByCodigo.get(codigoOId);
    if (!item) return null;

    const familias = (item.familias_ids || []) as FamiliaTematicaId[];
    const familiasMeta = familias.map(f => FAMILIAS_TEMATICAS[f]).filter(Boolean);

    return {
      tramite: toResumen(item),
      prerrequisitos: getPrerrequisitos(codigoOId),
      siguientesPasos: getSiguientesPasos(codigoOId),
      herramientasApoyo: getHerramientasApoyo(codigoOId),
      familias: familiasMeta,
      gestionesRelacionadasFamilia: familias.length > 0 ? getGestionesFamilia(familias[0], { limit: 4, excludeCodigo: item.codigo }) : []
    };
  };

  return {
    getPrerrequisitos,
    getSiguientesPasos,
    getHerramientasApoyo,
    getGestionesFamilia,
    getGrafoRelaciones
  };
}
