import rawMasterData from './allTramites.json';

export type MacrogrupoId = 
  | 'contribuyentes'
  | 'comercio_exterior'
  | 'profesionales'
  | 'entes_exentos';

export type GrupoOficialNo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EtapaAtoId = 
  | 'empezar'
  | 'operar'
  | 'consultar'
  | 'modificar_cerrar'
  | 'normativa';

export type TipoInteraccionId = 
  | 'servicio_transaccional'
  | 'consulta_datos'
  | 'guia_informativa'
  | 'descarga_recurso';

export type TipologiaContenidoId =
  | 'tramite_interactivo'
  | 'guia_requisitos'
  | 'consulta_buscador'
  | 'normativa_criterio'
  | 'recurso_descargable'
  | 'aviso_operativo';

export interface PortalMasterItem {
  id: string;
  pillar: string;
  pillarName: string;
  macroGrupo?: string;
  grupoNo?: number;
  grupoNombre?: string;
  nivel1_segmento?: string;
  nivel2_area?: string;
  nivel3_subarea?: string;
  nivel4_tema?: string;
  nivel5_tramite?: string;
  nivel5_contenido_servicio?: string;
  familiaAduanera?: string;
  subfamiliaAduanera?: string;
  actorEspecifico?: string;
  categoria: string;
  subcategoria: string;
  tema?: string;
  subtema?: string;
  etapaAto?: EtapaAtoId;
  etapaAtoLabel?: string;
  tipoInteraccion?: TipoInteraccionId;
  tipoInteraccionLabel?: string;
  tipologiaContenido?: TipologiaContenidoId;
  tipologiaContenidoLabel?: string;
  plataformaSistema?: string;
  plataformaSistemaLabel?: string;
  canalAtencion?: string;
  rutasProceso?: {
    procesoNo: number;
    procesoNombre: string;
    pasoNo: number;
    pasoAccion: string;
  }[];
  tramite: string;
  nombreActual?: string;
  descripcion: string;
  url: string;
  esBrecha?: boolean;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  seccionActual?: string;
  nota?: string;
}

export const ETAPAS_ATO_CONFIG: {
  id: EtapaAtoId;
  label: string;
  shortLabel: string;
  desc: string;
  badgeColor: string;
}[] = [
  {
    id: 'empezar',
    label: 'Empezar y registrarse',
    shortLabel: 'Empezar',
    desc: 'Obtención de NIT, inscripción en RTU, habilitación en padrones y autorizaciones iniciales.',
    badgeColor: '#14649B'
  },
  {
    id: 'operar',
    label: 'Operación y declaraciones',
    shortLabel: 'Operación',
    desc: 'Emisión de facturas FEL, declaraciones mensuales de impuestos, DUCA y retenciones.',
    badgeColor: '#0284C7'
  },
  {
    id: 'consultar',
    label: 'Consultas y herramientas',
    shortLabel: 'Consultas',
    desc: 'Verificadores públicos, solvencia fiscal, semáforo de rampa, CUI a NIT y arancel SAC.',
    badgeColor: '#059669'
  },
  {
    id: 'modificar_cerrar',
    label: 'Modificaciones y cierre',
    shortLabel: 'Cambios y Cierre',
    desc: 'Actualización de datos, traspaso de vehículos, cambio de régimen, suspensión y cese de negocio.',
    badgeColor: '#C25E00'
  },
  {
    id: 'normativa',
    label: 'Normativa y asistencia',
    shortLabel: 'Normativa',
    desc: 'Marco legal, resoluciones, devolución de crédito fiscal, capacitaciones y atención ciudadana.',
    badgeColor: '#7C3AED'
  }
];

export const TIPOS_INTERACCION_MASTER_CONFIG: Record<TipoInteraccionId, {
  id: TipoInteraccionId;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  desc: string;
}> = {
  servicio_transaccional: {
    id: 'servicio_transaccional',
    label: 'Trámite / Aplicativo en Línea',
    badgeBg: 'bg-[#14649B]/10',
    badgeText: 'text-[#14649B]',
    badgeBorder: 'border-[#14649B]/20',
    desc: 'Servicio web transaccional donde se declaran impuestos, transmiten DUCAs o tramitan gestiones.'
  },
  consulta_datos: {
    id: 'consulta_datos',
    label: 'Consulta a Base de Datos',
    badgeBg: 'bg-[#059669]/10',
    badgeText: 'text-[#059669]',
    badgeBorder: 'border-[#059669]/20',
    desc: 'Búsqueda en tiempo real sin iniciar expediente: rampa aduanera, solvencias, verificador de DTE.'
  },
  guia_informativa: {
    id: 'guia_informativa',
    label: 'Guía Informativa / Texto',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    desc: 'Ficha explicativa con requisitos oficiales, instructivo paso a paso o marco normativo.'
  },
  descarga_recurso: {
    id: 'descarga_recurso',
    label: 'Descarga / Software',
    badgeBg: 'bg-[#7C3AED]/10',
    badgeText: 'text-[#7C3AED]',
    badgeBorder: 'border-[#7C3AED]/20',
    desc: 'Instaladores, componentes criptográficos (ActiveX PKI/DUA), formularios o plantillas descargables.'
  }
};

export const GRUPOS_OFICIALES_MASTER: {
  no: GrupoOficialNo;
  nombre: string;
  macrogrupo: MacrogrupoId;
  desc: string;
}[] = [
  {
    no: 1,
    nombre: 'NIT sin Obligaciones',
    macrogrupo: 'contribuyentes',
    desc: 'Personas individuales sin actividad económica mercantil (estudiantes, remesas, actos civiles y títulos).'
  },
  {
    no: 2,
    nombre: 'Pequeños Contribuyentes',
    macrogrupo: 'contribuyentes',
    desc: 'Personas y negocios con ventas anuales hasta Q150,000 (tarifa fija 5% de IVA o régimen agropecuario).'
  },
  {
    no: 3,
    nombre: 'Contribuyente General',
    macrogrupo: 'contribuyentes',
    desc: 'Personas y empresas en régimen general del IVA (12%) e ISR, asalariados y gestión vehicular de propietarios.'
  },
  {
    no: 4,
    nombre: 'Contribuyentes Especiales',
    macrogrupo: 'contribuyentes',
    desc: 'Medianas y grandes empresas con alta recaudación bajo control gerencial diferenciado.'
  },
  {
    no: 5,
    nombre: 'Importadores y Exportadores',
    macrogrupo: 'comercio_exterior',
    desc: 'Operadores comerciales, exportadores, compras en línea por internet y viajeros internacionales.'
  },
  {
    no: 6,
    nombre: 'Exentos',
    macrogrupo: 'entes_exentos',
    desc: 'Universidades, centros educativos, iglesias, fundaciones y entidades con beneficio de compra exenta por ley.'
  },
  {
    no: 7,
    nombre: 'Profesionales',
    macrogrupo: 'profesionales',
    desc: 'Peritos contadores, auditores, abogados, notarios y gestores que asesoran o gestionan por terceros.'
  },
  {
    no: 8,
    nombre: 'Auxiliares de la Función Pública Aduanera (AFPA)',
    macrogrupo: 'comercio_exterior',
    desc: 'Agentes aduaneros, apoderados, transportistas de carga, depósitos aduaneros, almacenes fiscales y ZDEEP.'
  },
  {
    no: 9,
    nombre: 'Entidades del Estado',
    macrogrupo: 'entes_exentos',
    desc: 'Ministerios, dependencias del Estado, municipalidades y entidades autónomas sujetas a normativa especial.'
  }
];

export const PORTAL_MASTER_DATA: PortalMasterItem[] = rawMasterData as unknown as PortalMasterItem[];

/**
 * Filtro flexible de trámites para el portal
 */
export function queryPortalItems(params: {
  macrogrupo?: MacrogrupoId;
  grupoNo?: GrupoOficialNo;
  etapaAto?: EtapaAtoId;
  tipoInteraccion?: TipoInteraccionId;
  search?: string;
}): PortalMasterItem[] {
  return PORTAL_MASTER_DATA.filter(item => {
    if (params.macrogrupo && item.pillar !== params.macrogrupo) return false;
    if (params.grupoNo && item.grupoNo !== params.grupoNo) return false;
    if (params.etapaAto && item.etapaAto !== params.etapaAto) return false;
    if (params.tipoInteraccion && item.tipoInteraccion !== params.tipoInteraccion) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      const match = item.tramite.toLowerCase().includes(q) ||
                    item.descripcion.toLowerCase().includes(q) ||
                    item.categoria.toLowerCase().includes(q) ||
                    (item.grupoNombre && item.grupoNombre.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}
