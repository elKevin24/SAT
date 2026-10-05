export type MacroGrupoId = 'comercio_exterior' | 'contribuyentes' | 'profesionales';

export type CicloVidaId = 
  | 'inscripcion' 
  | 'fel' 
  | 'declaracion' 
  | 'solvencias' 
  | 'despacho' 
  | 'vehicular' 
  | 'cese';

export interface SubgrupoOption {
  id: string;
  nombre: string;
  descripcion: string;
  grupoNumero?: number;
  paginasBase: number;
  reglaOptimizacion?: string;
  tipo: 'grupo_5' | 'grupo_8' | 'general';
}

export interface MacroGrupoOption {
  id: MacroGrupoId;
  nombre: string;
  descripcion: string;
  subgrupos: SubgrupoOption[];
}

export interface CicloVidaOption {
  id: CicloVidaId;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface FichaTramite {
  id: string;
  titulo: string;
  sistemaOficial: string;
  sistemaTipo: 'declaraguate' | 'agencia_virtual' | 'rtu' | 'sofi' | 'miad' | 'fel' | 'oea' | 'duca';
  formularioOficial: string;
  macrogrupo: MacroGrupoId;
  grupoNumero?: number;
  grupoNombre: string;
  categoriaInterna: string;
  macroproceso: CicloVidaId;
  audienciasIds: string[];
  reglaOptimizacionTexto: string;
  reglaTipo: 'universal_5' | 'universal_8' | 'compartida' | 'exclusiva' | 'general';
  resumenEjecutivo: string;
  costo: string;
  plazoLegal: string;
  enlaceTransaccional: string;
  requisitosPorPerfil: {
    perfilId: string;
    perfilEtiqueta: string;
    items: string[];
  }[];
  pasos: {
    numero: number;
    titulo: string;
    detalle: string;
    tiempoEstimado: string;
  }[];
  marcoNormativo: {
    ley: string;
    articulo: string;
    detalle: string;
  }[];
  faqs: {
    pregunta: string;
    respuesta: string;
  }[];
}

export const MACROGRUPOS_DATA: MacroGrupoOption[] = [
  {
    id: 'comercio_exterior',
    nombre: 'Operadores de Comercio Exterior',
    descripcion: 'Gestión aduanera, operaciones de importación, exportación y auxiliares de la función pública.',
    subgrupos: [
      // No. Grupo 5: Importadores y Exportadores
      {
        id: 'importadores',
        nombre: 'Importadores',
        descripcion: 'Personas individuales y jurídicas con registro activo en el Padrón de Importadores.',
        grupoNumero: 5,
        paginasBase: 45,
        reglaOptimizacion: '41 páginas universales compartidas con OEA y Exportadores',
        tipo: 'grupo_5'
      },
      {
        id: 'oea',
        nombre: 'Operador Económico Autorizado (OEA)',
        descripcion: 'Empresas certificadas bajo estándares internacionales de seguridad en la cadena logística.',
        grupoNumero: 5,
        paginasBase: 46,
        reglaOptimizacion: '41 páginas compartidas + 5 específicas OEA (Carril express y simplificación)',
        tipo: 'grupo_5'
      },
      {
        id: 'exportadores',
        nombre: 'Exportadores',
        descripcion: 'Productores y comercializadores acreditados en regímenes aduaneros definitivos y especiales.',
        grupoNumero: 5,
        paginasBase: 44,
        reglaOptimizacion: '41 páginas compartidas con Importadores y OEA',
        tipo: 'grupo_5'
      },
      // No. Grupo 8: Auxiliares de la Función Pública
      {
        id: 'courier',
        nombre: 'Empresas de Entrega Rápida o Courier',
        descripcion: 'Operadores autorizados para el despacho expreso internacional de envíos y paquetes.',
        grupoNumero: 8,
        paginasBase: 48,
        reglaOptimizacion: '45 páginas universales del Grupo 8 + 3 específicas de manifiesto expreso',
        tipo: 'grupo_8'
      },
      {
        id: 'consolidadores',
        nombre: 'Consolidadores y Desconsolidadores de Carga',
        descripcion: 'Auxiliares acreditados para el agrupamiento y desconsolidación de documentos y mercancías.',
        grupoNumero: 8,
        paginasBase: 47,
        reglaOptimizacion: '45 páginas universales del Grupo 8 + 2 de manifiesto consolidador',
        tipo: 'grupo_8'
      },
      {
        id: 'almacenes_fiscales',
        nombre: 'Almacenes Fiscales',
        descripcion: 'Recintos habilitados para la custodia de mercancías bajo régimen de depósito fiscal.',
        grupoNumero: 8,
        paginasBase: 45,
        reglaOptimizacion: '45 páginas universales del Grupo 8 compartidas de control aduanero',
        tipo: 'grupo_8'
      },
      {
        id: 'almacenadoras',
        nombre: 'Almacenadoras Generales de Depósito',
        descripcion: 'Entidades facultadas para emitir certificados de depósito y bonos de prenda.',
        grupoNumero: 8,
        paginasBase: 45,
        reglaOptimizacion: '45 páginas universales del Grupo 8 compartidas de control aduanero',
        tipo: 'grupo_8'
      },
      {
        id: 'depositos_aduaneros',
        nombre: 'Depósitos Aduaneros Temporales (DAT)',
        descripcion: 'Instalaciones para la permanencia provisional de mercancías pendientes de destinación.',
        grupoNumero: 8,
        paginasBase: 45,
        reglaOptimizacion: '45 páginas universales del Grupo 8 compartidas de control aduanero',
        tipo: 'grupo_8'
      },
      {
        id: 'zdeep',
        nombre: 'Zonas de Desarrollo Económico Especial Público (ZDEEP)',
        descripcion: 'Áreas geográficas delimitadas con incentivos y tratamiento aduanero preferencial.',
        grupoNumero: 8,
        paginasBase: 45,
        reglaOptimizacion: '45 páginas universales del Grupo 8 compartidas de control aduanero',
        tipo: 'grupo_8'
      },
      {
        id: 'agentes_aduaneros',
        nombre: 'Agentes Aduaneros',
        descripcion: 'Profesionales autorizados para representar legalmente a terceros ante la aduana.',
        grupoNumero: 8,
        paginasBase: 50,
        reglaOptimizacion: '45 páginas universales del Grupo 8 + 5 de licencia y examen técnico',
        tipo: 'grupo_8'
      },
      {
        id: 'transportistas',
        nombre: 'Transportistas Aduaneros',
        descripcion: 'Empresas de transporte terrestre, marítimo y aéreo autorizadas para tránsitos aduaneros.',
        grupoNumero: 8,
        paginasBase: 48,
        reglaOptimizacion: '45 páginas universales del Grupo 8 + 3 de marchamos y registro de unidades',
        tipo: 'grupo_8'
      },
      {
        id: 'apoderado_aduanero',
        nombre: 'Apoderados Especiales Aduaneros',
        descripcion: 'Representantes exclusivos de personas jurídicas para despachos directos de mercancías.',
        grupoNumero: 8,
        paginasBase: 45,
        reglaOptimizacion: '45 páginas universales del Grupo 8 compartidas de control aduanero',
        tipo: 'grupo_8'
      }
    ]
  },
  {
    id: 'contribuyentes',
    nombre: 'Contribuyentes Generales',
    descripcion: 'Personas individuales, pequeños contribuyentes, sociedades mercantiles y entidades exentas.',
    subgrupos: [
      {
        id: 'persona_individual',
        nombre: 'Personas Individuales y Asalariados',
        descripcion: 'Servicios técnicos, profesionales bajo relación de dependencia y actividades personales.',
        paginasBase: 38,
        tipo: 'general'
      },
      {
        id: 'pequeno_contribuyente',
        nombre: 'Pequeño Contribuyente (5% e Integrados)',
        descripcion: 'Facturación anual hasta Q150,000.00 en régimen simplificado de tarifa única.',
        paginasBase: 40,
        tipo: 'general'
      },
      {
        id: 'regimen_general',
        nombre: 'Régimen General de IVA y Utilidades',
        descripcion: 'Empresas y sociedades inscritas en el 12% de IVA y régimen sobre utilidades u opcional.',
        paginasBase: 52,
        tipo: 'general'
      },
      {
        id: 'exentos_retenciones',
        nombre: 'Agentes de Retención y Entidades Exentas',
        descripcion: 'Organizaciones no gubernamentales, iglesias, entidades públicas y agentes retenedores.',
        paginasBase: 36,
        tipo: 'general'
      }
    ]
  },
  {
    id: 'profesionales',
    nombre: 'Profesionales y Servicios Notariales',
    descripcion: 'Abogados, notarios, contadores públicos y peritos con obligaciones tributarias específicas.',
    subgrupos: [
      {
        id: 'notarios',
        nombre: 'Abogados y Notarios Habilitados',
        descripcion: 'Gestión y adquisición de timbres fiscales, papel de protocolo y constancias ante el CANG.',
        paginasBase: 42,
        tipo: 'general'
      },
      {
        id: 'contadores',
        nombre: 'Contadores Públicos y Peritos Contadores',
        descripcion: 'Acreditación y registro en el padrón de contadores de SAT para emisión de dictámenes.',
        paginasBase: 39,
        tipo: 'general'
      }
    ]
  }
];

export const CICLOS_VIDA_DATA: CicloVidaOption[] = [
  {
    id: 'inscripcion',
    nombre: 'Inscripción y Habilitación',
    descripcion: 'Alta en registros, actualización de RTU Digital, acreditación de perfiles y padrones.',
    icono: 'UserCheck'
  },
  {
    id: 'fel',
    nombre: 'Facturación FEL',
    descripcion: 'Habilitación de emisores, anulación de DTE, certificación y consultas de facturas electrónicas.',
    icono: 'FileText'
  },
  {
    id: 'declaracion',
    nombre: 'Declaración y Pago',
    descripcion: 'Presentación de declaraciones juradas, formularios Declaraguate y liquidación bancaria.',
    icono: 'CreditCard'
  },
  {
    id: 'solvencias',
    nombre: 'Solvencias y Constancias',
    descripcion: 'Emisión electrónica de Solvencia Fiscal, SOFI, constancias de RTU y certificados oficiales.',
    icono: 'ShieldCheck'
  },
  {
    id: 'despacho',
    nombre: 'Despacho Aduanero',
    descripcion: 'DUCA, transmisión de manifiestos, marchamo MIAD, selectivo y levante de mercancías.',
    icono: 'Ship'
  },
  {
    id: 'vehicular',
    nombre: 'Gestión Vehicular Unificada',
    descripcion: 'Ficha consolidada: Calcomanía SAT-4091, traspasos en línea y reposición de distintivos.',
    icono: 'Car'
  },
  {
    id: 'cese',
    nombre: 'Cese y Modificación',
    descripcion: 'Cese temporal o definitivo de actividades, actualización de regímenes y cierre de sucursales.',
    icono: 'PowerOff'
  }
];

export const FICHAS_CATALOGO_DATA: FichaTramite[] = [
  // =========================================================================
  // COMERCIO EXTERIOR: GRUPO 5 - UNIVERSALES (41 compartidas de 48)
  // =========================================================================
  {
    id: 'tram-ce-01',
    titulo: 'Transmitir Declaración Única Centroamericana (DUCA)',
    sistemaOficial: 'Sistema Aduanero Integrado / DUCA',
    sistemaTipo: 'duca',
    formularioOficial: 'DUCA-D / DUCA-T Electrónica',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 5,
    grupoNombre: 'No. Grupo 5: Importadores y Exportadores',
    categoriaInterna: 'Operaciones Aduaneras Base',
    macroproceso: 'despacho',
    audienciasIds: ['importadores', 'exportadores', 'oea', 'agentes_aduaneros'],
    reglaOptimizacionTexto: '41/48 Universal Grupo 5: Consumida por igual por Importadores, Exportadores y OEA',
    reglaTipo: 'universal_5',
    resumenEjecutivo: 'Presenta tu declaración aduanera electrónica para el despacho definitivo o tránsito internacional de mercancías, con validación inmediata en el sistema informático de la SAT.',
    costo: 'Gratuito (Solo aranceles e impuestos aplicables DAI/IVA)',
    plazoLegal: 'Validación en línea inmediata (24/7). Selectivo aduanero según perfil de riesgo.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'importadores',
        perfilEtiqueta: 'Importadores Registrados',
        items: [
          'Contar con NIT activo y solvente en el RTU Digital.',
          'Estar inscrito y habilitado en el Padrón de Importadores de la SAT.',
          'Factura comercial electrónica o documento de valor equivalente.',
          'Documento de transporte internacional (B/L, Carta de Porte o Guía Aérea).',
          'Póliza o certificado de seguro y declaración del valor en aduana.'
        ]
      },
      {
        perfilId: 'exportadores',
        perfilEtiqueta: 'Exportadores Acreditados',
        items: [
          'Registro activo en la Ventanilla Única para las Exportaciones (VUPE).',
          'Factura electrónica FEL emitida en régimen de exportación.',
          'Certificado de origen o declaración jurada según el tratado de libre comercio.',
          'Documento de embarque o guía terrestre debidamente transmitida.'
        ]
      },
      {
        perfilId: 'oea',
        perfilEtiqueta: 'Operador Económico Autorizado (OEA)',
        items: [
          'Certificación vigente OEA-GT en estado activo.',
          'Transmisión electrónica anticipada con carril express habilitado.',
          'Presentación simplificada con garantía global de levante inmediato.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Digitar los datos de la mercancía',
        detalle: 'Ingresa al sistema de aduanas con tu usuario y contraseña, y completa las casillas de la DUCA con el valor FOB, flete, seguro y código arancelario.',
        tiempoEstimado: '15 minutos'
      },
      {
        numero: 2,
        titulo: 'Adjuntar documentos de soporte digitalizados',
        detalle: 'Sube en formato PDF legible la factura comercial, documento de transporte y permisos no arancelarios obligatorios.',
        tiempoEstimado: '10 minutos'
      },
      {
        numero: 3,
        titulo: 'Generar la boleta de pago o liquidar en línea',
        detalle: 'Liquida los tributos aduaneros vía bancaSAT o mediante cuenta corriente con cargo automatizado.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 4,
        titulo: 'Obtener el resultado del semáforo aduanero',
        detalle: 'El sistema emite el resultado del análisis de riesgo: verde (levante inmediato), amarillo (revisión documental) o rojo (reconocimiento físico).',
        tiempoEstimado: 'Inmediato'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Código Aduanero Uniforme Centroamericano (CAUCA IV)',
        articulo: 'Artículos 77 y 78',
        detalle: 'Obligación y formalidades de la declaración de mercancías transmitida por medios electrónicos.'
      },
      {
        ley: 'Reglamento del CAUCA (RECAUCA IV)',
        articulo: 'Artículos 317 al 325',
        detalle: 'Estructura técnica, documentos de sustento y plazos de validez de la DUCA.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Puedo rectificar la DUCA una vez pagada?',
        respuesta: 'Sí, puedes presentar una solicitud de rectificación electrónica en la Agencia Virtual antes del despacho o vía expediente técnico según el Art. 334 del RECAUCA.'
      },
      {
        pregunta: '¿Qué ventaja tiene un Operador Económico Autorizado (OEA)?',
        respuesta: 'Las empresas OEA cuentan con menor índice de selectivo físico y atención prioritaria en aduanas terrestres, marítimas y aeroportuarias.'
      }
    ]
  },
  {
    id: 'tram-ce-02',
    titulo: 'Obtener Solvencia Fiscal Electrónica (SOFI)',
    sistemaOficial: 'Sistema SOFI / Agencia Virtual',
    sistemaTipo: 'sofi',
    formularioOficial: 'Certificado Electrónico SOFI',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 5,
    grupoNombre: 'No. Grupo 5: Importadores y Exportadores',
    categoriaInterna: 'Solvencias y Habilitaciones',
    macroproceso: 'solvencias',
    audienciasIds: ['importadores', 'exportadores', 'oea', 'courier', 'consolidadores', 'agentes_aduaneros', 'transportistas', 'persona_individual', 'regimen_general'],
    reglaOptimizacionTexto: 'Universal Multi-Grupo: Requisito permanente para despachos y contrataciones del Estado',
    reglaTipo: 'universal_5',
    resumenEjecutivo: 'Descarga al instante tu constancia oficial con código QR y firma electrónica avanzada que acredita que estás al día en el cumplimiento de todas tus obligaciones tributarias y aduaneras.',
    costo: 'Gratuito',
    plazoLegal: 'Emisión inmediata en línea (Vigencia legal de 30 días calendario).',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'comercio_exterior',
        perfilEtiqueta: 'Operadores de Comercio Exterior',
        items: [
          'No tener omisos en declaraciones de IVA, ISR ni tributos al comercio exterior.',
          'Tener ratificados los datos del RTU Digital en el año en curso.',
          'Garantía aduanera vigente en caso de ser auxiliar de la función pública.'
        ]
      },
      {
        perfilId: 'general',
        perfilEtiqueta: 'Contribuyentes Generales',
        items: [
          'Estar al día en el pago de declaraciones mensuales y trimestrales.',
          'Domicilio fiscal y correo electrónico notificados y confirmados.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Ingresar a la Agencia Virtual',
        detalle: 'Inicia sesión con tu NIT y contraseña en el portal oficial de la SAT.',
        tiempoEstimado: '2 minutos'
      },
      {
        numero: 2,
        titulo: 'Seleccionar Servicios Tributarios > Solvencia Fiscal',
        detalle: 'El sistema valida automáticamente en tiempo real tus obligaciones vigentes.',
        tiempoEstimado: '1 minuto'
      },
      {
        numero: 3,
        titulo: 'Descargar el certificado en PDF con código QR',
        detalle: 'Guarda o imprime el documento para adjuntarlo a tus gestiones aduaneras o comerciales.',
        tiempoEstimado: 'Inmediato'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Código Tributario, Decreto Número 6-91',
        articulo: 'Artículo 57 "A"',
        detalle: 'Regulación legal y efectos de la solvencia fiscal electrónica emitida por la SAT.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Por qué el sistema no me genera la Solvencia Fiscal?',
        respuesta: 'Si tienes declaraciones omitidas, cuotas de convenios pendientes o no has actualizado tu RTU este año, el sistema te indicará con precisión qué gestión debes regularizar primero.'
      }
    ]
  },
  {
    id: 'tram-ce-03',
    titulo: 'Inscribir y Actualizar RTU Digital para Comercio Exterior',
    sistemaOficial: 'RTU Digital / Agencia Virtual',
    sistemaTipo: 'rtu',
    formularioOficial: 'Formulario Electrónico RTU Digital',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 5,
    grupoNombre: 'No. Grupo 5: Importadores y Exportadores',
    categoriaInterna: 'Registro de Contribuyentes y Operadores',
    macroproceso: 'inscripcion',
    audienciasIds: ['importadores', 'exportadores', 'oea', 'courier', 'consolidadores', 'agentes_aduaneros'],
    reglaOptimizacionTexto: '41/48 Universal Grupo 5: Base registral indispensable para todo acto de comercio',
    reglaTipo: 'universal_5',
    resumenEjecutivo: 'Ratifica tus actividades económicas, activa las características tributarias especiales de comercio exterior y mantén tu domicilio fiscal actualizado ante la administración.',
    costo: 'Gratuito',
    plazoLegal: 'Validación inmediata o máximo 24 horas si requiere revisión documental.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'individual',
        perfilEtiqueta: 'Persona Individual',
        items: [
          'DPI vigente del titular.',
          'Factura reciente de servicios básicos (agua, luz o teléfono) del domicilio fiscal.',
          'Actividad económica codificada según clasificador internacional CIIU.'
        ]
      },
      {
        perfilId: 'juridica',
        perfilEtiqueta: 'Persona Jurídica (Empresas y Sociedades)',
        items: [
          'Nombramiento vigente del Representante Legal inscrito en el Registro Mercantil.',
          'Testimonio de escritura constitutiva de sociedad debidamente razonado.',
          'DPI vigente del Representante Legal acreditado.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Acceder al formulario de actualización',
        detalle: 'Entra a tu Agencia Virtual y selecciona RTU Digital > Actualización de Datos.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 2,
        titulo: 'Revisar datos y confirmar características de Comercio Exterior',
        detalle: 'Verifica la casilla de Importador o Exportador habitual.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 3,
        titulo: 'Firmar electrónicamente y enviar la solicitud',
        detalle: 'Recibirás el código de confirmación en tu correo institucional vinculado.',
        tiempoEstimado: '2 minutos'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Ley de Actualización Tributaria, Decreto 10-2012',
        articulo: 'Artículo 120',
        detalle: 'Obligatoriedad de mantener actualizados los datos del Registro Tributario Unificado.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Cada cuánto tiempo debo ratificar mi RTU Digital?',
        respuesta: 'Debes ratificarlo al menos una vez al año de forma obligatoria, o dentro de los 30 días posteriores a cualquier cambio en tu información fiscal o mercantil.'
      }
    ]
  },
  // =========================================================================
  // COMERCIO EXTERIOR: GRUPO 5 - EXCLUSIVAS (3 específicas)
  // =========================================================================
  {
    id: 'tram-ce-04',
    titulo: 'Solicitar Certificación Operador Económico Autorizado (OEA-GT)',
    sistemaOficial: 'Programa OEA Guatemala / Intendencia de Aduanas',
    sistemaTipo: 'oea',
    formularioOficial: 'Solicitud Oficial de Calificación OEA-GT',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 5,
    grupoNombre: 'No. Grupo 5: Importadores y Exportadores',
    categoriaInterna: 'Certificaciones de Alta Seguridad',
    macroproceso: 'inscripcion',
    audienciasIds: ['oea'],
    reglaOptimizacionTexto: 'Exclusiva OEA (1 de 3 exclusivas del Grupo 5): No aplica a importadores comunes',
    reglaTipo: 'exclusiva',
    resumenEjecutivo: 'Certifica a tu empresa como un socio de confianza en la cadena de suministro internacional y obtén beneficios de canal verde preferencial y simplificación aduanera.',
    costo: 'Gratuito',
    plazoLegal: '60 a 90 días hábiles (incluye auditoría in situ y validación de estándares de seguridad).',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/operador-economico-autorizado-guatemala/',
    requisitosPorPerfil: [
      {
        perfilId: 'oea',
        perfilEtiqueta: 'Empresa Solicitante de Certificación OEA',
        items: [
          'Tres años consecutivos de operaciones aduaneras demostrables en Guatemala.',
          'Historial impecable de cumplimiento tributario, aduanero y judicial.',
          'Sistema de gestión de seguridad de la cadena de suministro documentado.',
          'Estados financieros auditados de los últimos tres ejercicios fiscales.',
          'Plan de contingencias, seguridad física perimetral y trazabilidad de carga.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Completar la autoevaluación de seguridad',
        detalle: 'Descarga y llena la matriz de autodiagnóstico sobre los estándares mínimos de seguridad logística.',
        tiempoEstimado: '1 semana'
      },
      {
        numero: 2,
        titulo: 'Presentar el expediente formal ante la SAT',
        detalle: 'Ingresa la solicitud digitalizada con las políticas de seguridad y manuales de procedimiento.',
        tiempoEstimado: '1 día'
      },
      {
        numero: 3,
        titulo: 'Atender la auditoría técnica presencial',
        detalle: 'Especialistas de la Intendencia de Aduanas verifican las instalaciones, sistemas y personal.',
        tiempoEstimado: '2 semanas'
      },
      {
        numero: 4,
        titulo: 'Recepción de la resolución de acreditación OEA',
        detalle: 'La SAT emite la resolución formal y la entrega del distintivo y código OEA-GT.',
        tiempoEstimado: 'Resolución final'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Resolución de Directorio SAT 07-2010 y 02-2020',
        articulo: 'Normativa OEA-GT',
        detalle: 'Creación, estándares técnicos y prerrogativas del Operador Económico Autorizado de Guatemala.'
      }
    ],
    faqs: [
      {
        pregunta: '¿La certificación OEA tiene reconocimiento en otros países?',
        respuesta: 'Sí, Guatemala mantiene Acuerdos de Reconocimiento Mutuo (ARM) con países de Centroamérica, México, Estados Unidos y la Unión Europea.'
      }
    ]
  },
  {
    id: 'tram-ce-05',
    titulo: 'Gestionar Devolución de Crédito Fiscal para Exportadores',
    sistemaOficial: 'Agencia Virtual / Régimen Especial Electrónico',
    sistemaTipo: 'agencia_virtual',
    formularioOficial: 'Declaraguate SAT-2157 / SAT-2159',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 5,
    grupoNombre: 'No. Grupo 5: Importadores y Exportadores',
    categoriaInterna: 'Beneficios Tributarios a la Exportación',
    macroproceso: 'declaracion',
    audienciasIds: ['exportadores', 'oea'],
    reglaOptimizacionTexto: 'Compartida (Exportadores y OEA): Beneficio exclusivo por venta de bienes al exterior',
    reglaTipo: 'compartida',
    resumenEjecutivo: 'Solicita la restitución del Impuesto al Valor Agregado pagado en insumos y bienes de capital vinculados directamente con tus exportaciones definitivas.',
    costo: 'Gratuito',
    plazoLegal: '30 días hábiles (Régimen Electrónico) o según dictamen técnico fiscal.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'exportadores',
        perfilEtiqueta: 'Exportadores Habituales',
        items: [
          'Registro vigente en el Régimen Especial de Devolución de Crédito Fiscal.',
          'Facturas de exportación transmitidas en FEL con cobro en divisas bancarias.',
          'Libro de compras y ventas al día con retenciones practicadas.',
          'Dictamen emitido por Contador Público y Auditor independiente.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Conciliar las facturas de compras y exportaciones',
        detalle: 'Verifica que el crédito fiscal corresponda a insumos directamente relacionados con la producción exportada.',
        tiempoEstimado: '3 días'
      },
      {
        numero: 2,
        titulo: 'Llenar el formulario en Declaraguate',
        detalle: 'Genera el formulario SAT-2157 y congela la solicitud con el informe del contador.',
        tiempoEstimado: '30 minutos'
      },
      {
        numero: 3,
        titulo: 'Seguimiento y acreditación bancaria',
        detalle: 'La SAT valida los DTE y emite la orden de acreditación a tu cuenta monetaria del sistema bancario.',
        tiempoEstimado: '30 días hábiles'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Ley del Impuesto al Valor Agregado, Decreto 27-92',
        articulo: 'Artículos 23, 23 "A" y 24',
        detalle: 'Procedimiento, requisitos y plazos para la devolución de crédito fiscal a exportadores.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Puedo solicitar la devolución mediante el Régimen Electrónico de Factura FEL?',
        respuesta: 'Sí, las empresas que emiten el 100% de sus operaciones en FEL acceden al canal abreviado de devolución en un plazo no mayor a 30 días hábiles.'
      }
    ]
  },
  // =========================================================================
  // COMERCIO EXTERIOR: GRUPO 8 - AUXILIARES (45 universales de 50)
  // =========================================================================
  {
    id: 'tram-ce-06',
    titulo: 'Inscribir y Renovar Auxiliares de la Función Pública Aduanera',
    sistemaOficial: 'Registro de Auxiliares / Intendencia de Aduanas',
    sistemaTipo: 'agencia_virtual',
    formularioOficial: 'Solicitud Electrónica de Auxiliares SAT',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 8,
    grupoNombre: 'No. Grupo 8: Auxiliares de la Función Pública',
    categoriaInterna: 'Acreditación y Registro de Auxiliares',
    macroproceso: 'inscripcion',
    audienciasIds: [
      'courier', 'consolidadores', 'almacenes_fiscales', 'almacenadoras',
      'depositos_aduaneros', 'zdeep', 'agentes_aduaneros', 'transportistas', 'apoderado_aduanero'
    ],
    reglaOptimizacionTexto: '45/50 Universal Grupo 8: Consumido exactamente igual por los 9 subgrupos de auxiliares',
    reglaTipo: 'universal_8',
    resumenEjecutivo: 'Gestiona tu código de auxiliar, actualiza tu fianza o garantía bancaria de caución y mantén vigente tu autorización para operar en las aduanas de la República.',
    costo: 'Gratuito ante la SAT (Costo comercial de la fianza según entidad aseguradora)',
    plazoLegal: '15 días hábiles a partir de la entrega de la fianza conforme.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'auxiliares_todos',
        perfilEtiqueta: 'Requisitos Base de los 9 Subgrupos del Grupo 8',
        items: [
          'RTU Digital activo y solvente en todas las obligaciones fiscales.',
          'Póliza de fianza o garantía bancaria a favor de la SAT por el monto fijado en el RECAUCA.',
          'Contar con Firma Electrónica Avanzada (FEA) vigente.',
          'Infraestructura técnica para transmisión electrónica de datos compatible con los sistemas aduaneros.',
          'Constancia de carencia de antecedentes penales y policíacos de los administradores y socios.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Presentar la solicitud electrónica en Agencia Virtual',
        detalle: 'Ingresa al módulo de Auxiliares y carga los datos de tu empresa y giro aduanero.',
        tiempoEstimado: '15 minutos'
      },
      {
        numero: 2,
        titulo: 'Entregar la póliza de fianza original',
        detalle: 'Presenta en la Intendencia de Aduanas la póliza emitida por afianzadora autorizada.',
        tiempoEstimado: '1 día'
      },
      {
        numero: 3,
        titulo: 'Habilitación de credenciales y código de transmisión',
        detalle: 'La SAT activa tu código de auxiliar en el sistema informático para transmitir manifiestos y trámites.',
        tiempoEstimado: '5 días hábiles'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Código Aduanero Uniforme Centroamericano (CAUCA IV)',
        articulo: 'Artículos 18 al 27',
        detalle: 'Definición, derechos, obligaciones y régimen de garantías de los Auxiliares de la Función Pública.'
      },
      {
        ley: 'Reglamento del CAUCA (RECAUCA IV)',
        articulo: 'Artículos 76 al 85',
        detalle: 'Montos de las garantías caucionadas y procedimiento de inscripción anual.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Cuándo vence la fianza de los Auxiliares de la Función Pública?',
        respuesta: 'Las fianzas deben renovarse anualmente antes del 31 de marzo de cada año fiscal para evitar la suspensión automática en el sistema aduanero.'
      }
    ]
  },
  {
    id: 'tram-ce-07',
    titulo: 'Transmitir Manifiesto de Carga y Marchamo Electrónico (MIAD)',
    sistemaOficial: 'Sistema MIAD / Control de Tránsitos Aduaneros',
    sistemaTipo: 'miad',
    formularioOficial: 'Manifiesto Electrónico MIAD / DUCA-T',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 8,
    grupoNombre: 'No. Grupo 8: Auxiliares de la Función Pública',
    categoriaInterna: 'Control y Tránsito de Carga',
    macroproceso: 'despacho',
    audienciasIds: ['transportistas', 'courier', 'consolidadores', 'agentes_aduaneros'],
    reglaOptimizacionTexto: 'Compartida Grupo 8: Aplicable a empresas que movilizan carga en territorio aduanero',
    reglaTipo: 'compartida',
    resumenEjecutivo: 'Registra la información anticipada del medio de transporte, asocia los dispositivos de precinto electrónico MIAD y garantiza el inicio de ruta monitoreado.',
    costo: 'Gratuito',
    plazoLegal: 'Transmisión obligatoria previa a la llegada a frontera o puerto (Inmediata en línea).',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'transportistas',
        perfilEtiqueta: 'Transportistas Aduaneros',
        items: [
          'Vehículo y cabezal registrados en el padrón de unidades de transporte de SAT.',
          'Conductor registrado con licencia vigente y enrolamiento biométrico.',
          'Dispositivo de precinto electrónico MIAD activo y con batería suficiente.'
        ]
      },
      {
        perfilId: 'courier',
        perfilEtiqueta: 'Courier y Paquetería Expresa',
        items: [
          'Manifiesto de entrega rápida con detalle de guías hijas y consignatarios finales.',
          'Consolidación de bultos bajo precinto oficial autorizado.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Registrar la unidad y conductor en el sistema MIAD',
        detalle: 'Verifica que la placa del cabezal y remolque figuren en estado activo.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 2,
        titulo: 'Asociar el número de precinto o marchamo satelital',
        detalle: 'Escanea el código de barras del marchamo y vincúlalo a la DUCA-T.',
        tiempoEstimado: '3 minutos'
      },
      {
        numero: 3,
        titulo: 'Obtener el código de autorización de ruta',
        detalle: 'El sistema valida la ruta fiscal autorizada y el tiempo máximo de tránsito.',
        tiempoEstimado: 'Inmediato'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Reglamento del CAUCA (RECAUCA IV)',
        articulo: 'Artículos 393 al 405',
        detalle: 'Operaciones de tránsito aduanero comunitario, plazos y rutas fiscales obligatorias.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Qué ocurre si un camión se desvía de la ruta fiscal autorizada?',
        respuesta: 'El sistema MIAD emite una alerta satelital en tiempo real al Centro de Monitoreo Aduanero de la SAT para activar los Puestos de Control Interinstitucional (PCI).'
      }
    ]
  },
  {
    id: 'tram-ce-08',
    titulo: 'Obtener Licencia de Agente Aduanero',
    sistemaOficial: 'Departamento de Normativa Aduanera',
    sistemaTipo: 'agencia_virtual',
    formularioOficial: 'Expediente de Convocatoria Oficial de Agentes Aduaneros',
    macrogrupo: 'comercio_exterior',
    grupoNumero: 8,
    grupoNombre: 'No. Grupo 8: Auxiliares de la Función Pública',
    categoriaInterna: 'Licencias Profesionales Especializadas',
    macroproceso: 'inscripcion',
    audienciasIds: ['agentes_aduaneros'],
    reglaOptimizacionTexto: 'Exclusiva Agente Aduanero (1 de las 5 variaciones técnicas del Grupo 8)',
    reglaTipo: 'exclusiva',
    resumenEjecutivo: 'Obtén la patente y credencial oficial emitida por el Directorio de la SAT para ejercer la representación técnica y jurídica aduanera en todo el país.',
    costo: 'Gratuito el proceso de examen de suficiencia',
    plazoLegal: 'Conforme cronograma de convocatoria pública oficial anual.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agentes-aduaneros/',
    requisitosPorPerfil: [
      {
        perfilId: 'agentes_aduaneros',
        perfilEtiqueta: 'Aspirantes a Agente Aduanero',
        items: [
          'Ser guatemalteco de origen y encontrarse en el pleno ejercicio de sus derechos civiles.',
          'Título profesional universitario afín al comercio exterior, aduanas o derecho.',
          'Aprobar el examen de competencia técnica aduanera convocado por la SAT.',
          'Acreditar solvencia fiscal y no tener sanciones aduaneras previas.',
          'Constitución de la fianza oficial de caución conforme al RECAUCA.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Inscripción en la convocatoria pública anual',
        detalle: 'Presenta el expediente de méritos cuando la SAT publique las bases oficiales.',
        tiempoEstimado: '1 semana'
      },
      {
        numero: 2,
        titulo: 'Sustentación del examen técnico aduanero',
        detalle: 'Evaluación presencial sobre valoración aduanera, aranceles, tratados y CAUCA/RECAUCA.',
        tiempoEstimado: '1 día'
      },
      {
        numero: 3,
        titulo: 'Aprobación por Directorio y entrega de patente',
        detalle: 'Publicación en el Diario Oficial e inscripción en el registro de auxiliares de SAT.',
        tiempoEstimado: '30 días hábiles'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Código Aduanero Uniforme Centroamericano (CAUCA IV)',
        articulo: 'Artículos 21 al 25',
        detalle: 'Requisitos específicos, responsabilidades solidarias y habilitación de Agentes Aduaneros.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Los agentes aduaneros pueden tener apoderados?',
        respuesta: 'Sí, pueden autorizar asistentes y mandatarios para ventanilla aduanera conforme al Art. 90 del RECAUCA.'
      }
    ]
  },
  // =========================================================================
  // GESTIÓN VEHICULAR UNIFICADA (Depuración de micro-trámites en ficha canónica)
  // =========================================================================
  {
    id: 'tram-veh-01',
    titulo: 'Gestionar Distintivos, Calcomanía y Traspaso de Vehículos',
    sistemaOficial: 'Registro Fiscal de Vehículos / Declaraguate',
    sistemaTipo: 'declaraguate',
    formularioOficial: 'Declaraguate SAT-4091 / SAT-8611 (Vehículos)',
    macrogrupo: 'contribuyentes',
    grupoNombre: 'Registro Fiscal de Vehículos Unificado',
    categoriaInterna: 'Trámites Vehiculares Consolidados',
    macroproceso: 'vehicular',
    audienciasIds: ['persona_individual', 'pequeno_contribuyente', 'regimen_general', 'importadores'],
    reglaOptimizacionTexto: 'Ficha Canónica Unificada: Consolida calcomanía anual, reposición de placas y traspasos',
    reglaTipo: 'general',
    resumenEjecutivo: 'Realiza en un solo lugar todas las gestiones de tu vehículo: paga el impuesto de circulación anual (ISCV), transfiere la propiedad en línea o tramita reposiciones de placas y títulos.',
    costo: 'Calcomanía según valor de tabla oficial / Traspaso Q120.00 / Reposición distintivo Q60.00',
    plazoLegal: 'Inmediato en línea para calcomanía y traspaso electrónico con notario.',
    enlaceTransaccional: 'https://declaraguate.sat.gob.gt',
    requisitosPorPerfil: [
      {
        perfilId: 'calcomania',
        perfilEtiqueta: 'Pago de Calcomanía Anual (ISCV SAT-4091)',
        items: [
          'Número de placa del vehículo y NIT del propietario registrado.',
          'No registrar multas de tránsito pendientes en municipalidades integradas (PNC/Emetra/Emixtra).',
          'Tener solvente el impuesto sobre circulación de años anteriores.'
        ]
      },
      {
        perfilId: 'traspaso',
        perfilEtiqueta: 'Traspaso de Vehículo en Línea con Notario',
        items: [
          'Vendedor y comprador con Agencia Virtual activa y RTU ratificado.',
          'Legalización notarial de firmas en el título de propiedad digital.',
          'Pago del impuesto al valor agregado (IVA) de traspaso según modelo y año.'
        ]
      },
      {
        perfilId: 'reposicion',
        perfilEtiqueta: 'Reposición de Placas por Pérdida o Deterioro',
        items: [
          'Denuncia presentada ante el Ministerio Público (MP) o Policía Nacional Civil (PNC).',
          'Estar solvente del impuesto de circulación del año en curso.',
          'Revisión física de la unidad en agencia tributaria con expertaje DEIC.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Seleccionar la modalidad vehicular requerida',
        detalle: 'Elige si deseas pagar el impuesto de circulación (SAT-4091) o gestionar un traspaso (SAT-8611).',
        tiempoEstimado: '2 minutos'
      },
      {
        numero: 2,
        titulo: 'Ingresar los datos del vehículo y congelar boleta',
        detalle: 'El sistema calcula automáticamente la tarifa y genera la boleta SAT-2000.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 3,
        titulo: 'Pagar en banca en línea y descargar el distintivo',
        detalle: 'Una vez cancelado, descarga de inmediato la calcomanía electrónica con código de verificación QR.',
        tiempoEstimado: '3 minutos'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos, Dto. 70-94',
        articulo: 'Artículos 9, 10 y 29',
        detalle: 'Tasas impositivas, fechas límite de pago y formalidades de transferencia de dominio.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Cuándo vence el plazo para pagar la calcomanía vehicular sin multa?',
        respuesta: 'El plazo legal finaliza el 31 de julio de cada año. Posterior a esa fecha aplica 100% de multa e intereses resarcitorios.'
      },
      {
        pregunta: '¿Es necesario portar la calcomanía impresa en el parabrisas?',
        respuesta: 'No es obligatorio pegarla en el vidrio, pero el conductor debe portarla de forma impresa o digital en el vehículo para revisiones de la autoridad de tránsito.'
      }
    ]
  },
  // =========================================================================
  // PROFESIONALES: NOTARIOS (Especies Fiscales y Timbres)
  // =========================================================================
  {
    id: 'tram-prof-01',
    titulo: 'Comprar Especies Fiscales y Papel de Protocolo',
    sistemaOficial: 'Declaraguate / Agencias Tributarias SAT',
    sistemaTipo: 'declaraguate',
    formularioOficial: 'Declaraguate SAT-7130 (Especies Fiscales)',
    macrogrupo: 'profesionales',
    grupoNombre: 'Servicios Profesionales Especializados',
    categoriaInterna: 'Especies Fiscales y Notariado',
    macroproceso: 'declaracion',
    audienciasIds: ['notarios'],
    reglaOptimizacionTexto: 'Exclusiva Notarios Habilitados y Patentados Autorizados',
    reglaTipo: 'exclusiva',
    resumenEjecutivo: 'Adquiere timbres fiscales notariales y lotes oficiales de Papel Sellado Especial para Protocolos para tu ejercicio notarial, con asignación electrónica de quinquenio.',
    costo: 'Q10.00 por hoja de papel de protocolo / Timbres según denominación facial',
    plazoLegal: 'Entrega presencial inmediata en agencias tributarias previa boleta pagada.',
    enlaceTransaccional: 'https://declaraguate.sat.gob.gt',
    requisitosPorPerfil: [
      {
        perfilId: 'notario_titular',
        perfilEtiqueta: 'Notario Titular',
        items: [
          'Colegiado activo en el Colegio de Abogados y Notarios de Guatemala (CANG).',
          'RTU Digital ratificado en el año en curso con característica de Notario activa.',
          'Boleta pagada de Declaraguate SAT-7130.',
          'DPI original vigente y sello profesional para firmar y sellar constancia.'
        ]
      },
      {
        perfilId: 'tercero_autorizado',
        perfilEtiqueta: 'Tercero Autorizado (Procurador)',
        items: [
          'Carta de autorización en original firmada y sellada por el Notario titular.',
          'Fotocopia de DPI y carné de colegiado del Notario titular.',
          'DPI original y copia de la persona delegada que retira las especies.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Llenar formulario SAT-7130 en Declaraguate',
        detalle: 'Indica la cantidad de hojas de protocolo (lotes de 50) y los timbres fiscales requeridos.',
        tiempoEstimado: '10 minutos'
      },
      {
        numero: 2,
        titulo: 'Congelar formulario y pagar boleta SAT-2000',
        detalle: 'Paga en bancaSAT o ventanilla bancaria autorizada.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 3,
        titulo: 'Retirar en cualquier agencia tributaria de SAT',
        detalle: 'Validación biométrica y entrega de las especies con la razón de correlativos de quinquenio.',
        tiempoEstimado: '15 minutos'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Dto. 37-92',
        articulo: 'Artículos 5, 24 y 28',
        detalle: 'Valores faciales, tarifa de papel de protocolo y 10% de comisión legal notarial en especie.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Cuántas hojas incluye el lote de protocolo?',
        respuesta: 'El lote base es de 50 hojas (Q500.00) y se entregan 5 hojas adicionales sin costo por concepto de comisión legal notarial (total 55 hojas).'
      }
    ]
  },
  // =========================================================================
  // CONTRIBUYENTES: FACTURACIÓN ELECTRÓNICA (FEL)
  // =========================================================================
  {
    id: 'tram-fel-01',
    titulo: 'Habilitar y Emitir Factura Electrónica en Línea (FEL)',
    sistemaOficial: 'Régimen FEL / Agencia Virtual y App FEL',
    sistemaTipo: 'fel',
    formularioOficial: 'Habilitación de Emisor FEL en Agencia Virtual',
    macrogrupo: 'contribuyentes',
    grupoNombre: 'Sistema de Facturación Electrónica',
    categoriaInterna: 'Comprobantes Fiscales Digitales',
    macroproceso: 'fel',
    audienciasIds: ['persona_individual', 'pequeno_contribuyente', 'regimen_general', 'importadores', 'exportadores', 'notarios'],
    reglaOptimizacionTexto: 'Universal de Facturación: Aplica a todo emisor de comprobantes tributarios',
    reglaTipo: 'general',
    resumenEjecutivo: 'Habilítate gratis como emisor de Documentos Tributarios Electrónicos (DTE) y emite facturas, notas de crédito y recibos desde tu computadora o teléfono móvil.',
    costo: 'Gratuito mediante la aplicación de SAT (Agencia Virtual o App FEL)',
    plazoLegal: 'Habilitación y emisión inmediata en línea (24/7).',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'emisor_fel',
        perfilEtiqueta: 'Requisitos de Emisor FEL',
        items: [
          'Tener usuario activo de Agencia Virtual en SAT.',
          'RTU Digital ratificado en el año en curso.',
          'Estar al día en la presentación de declaraciones tributarias.',
          'Establecimiento comercial activo en el RTU.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Aceptar términos de emisor en Agencia Virtual',
        detalle: 'Ingresa a Servicios Tributarios > Factura Electrónica FEL > Habilitarse como emisor.',
        tiempoEstimado: '3 minutos'
      },
      {
        numero: 2,
        titulo: 'Crear frase de seguridad y firma electrónica',
        detalle: 'La SAT genera automáticamente y sin costo tu certificado de firma electrónica.',
        tiempoEstimado: '2 minutos'
      },
      {
        numero: 3,
        titulo: 'Comenzar a emitir facturas con código QR',
        detalle: 'Genera tus facturas desde la web o la App Móvil FEL y envíalas por correo o WhatsApp a tus clientes.',
        tiempoEstimado: 'Inmediato'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Acuerdo de Directorio SAT 13-2018',
        articulo: 'Régimen FEL',
        detalle: 'Reglamento general del Régimen de Factura Electrónica en Línea (FEL).'
      }
    ],
    faqs: [
      {
        pregunta: '¿Tiene algún costo emitir facturas en el sistema FEL de la SAT?',
        respuesta: 'No, el sistema de Agencia Virtual y la App FEL de SAT son 100% gratuitos y no requieren contratar certificadores privados.'
      }
    ]
  },
  // =========================================================================
  // CONTRIBUYENTES: DECLARACIÓN Y PAGO DEL IVA (Declaraguate)
  // =========================================================================
  {
    id: 'tram-dec-01',
    titulo: 'Presentar Declaración y Pago del Impuesto al Valor Agregado (IVA)',
    sistemaOficial: 'Declaraguate / BancaSAT',
    sistemaTipo: 'declaraguate',
    formularioOficial: 'Declaraguate SAT-2237 (General) / SAT-2046 (Pequeño Contribuyente)',
    macrogrupo: 'contribuyentes',
    grupoNombre: 'Declaraciones Tributarias Periódicas',
    categoriaInterna: 'Obligaciones Mensuales del IVA',
    macroproceso: 'declaracion',
    audienciasIds: ['pequeno_contribuyente', 'regimen_general', 'persona_individual', 'notarios', 'contadores', 'importadores', 'exportadores'],
    reglaOptimizacionTexto: 'Universal de Declaración: Obligación mensual para todos los contribuyentes inscritos en IVA',
    reglaTipo: 'general',
    resumenEjecutivo: 'Liquida y paga mensualmente el Impuesto al Valor Agregado según tu régimen (5% tarifa simplificada para Pequeño Contribuyente o 12% con débito y crédito fiscal en Régimen General).',
    costo: 'Gratuito el formulario / Impuesto determinado según operaciones declaradas',
    plazoLegal: 'Durante el mes calendario siguiente al del período impositivo que se declara.',
    enlaceTransaccional: 'https://declaraguate.sat.gob.gt',
    requisitosPorPerfil: [
      {
        perfilId: 'pequeno_contribuyente',
        perfilEtiqueta: 'Régimen de Pequeño Contribuyente (5%)',
        items: [
          'Facturación electrónica FEL emitida en el mes a declarar.',
          'Formulario SAT-2046 generado en Declaraguate.',
          'Facturación total que no exceda el límite anual de Q150,000.00.'
        ]
      },
      {
        perfilId: 'regimen_general',
        perfilEtiqueta: 'Régimen General del IVA (12%)',
        items: [
          'Libro de Compras y Libro de Ventas habilitados y al día.',
          'Detalle de DTEs de crédito fiscal recibidos y validados en FEL.',
          'Formulario SAT-2237 generado en Declaraguate.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Completar el formulario en Declaraguate',
        detalle: 'Ingresa al portal Declaraguate y selecciona el formulario SAT-2046 o SAT-2237 con tu NIT.',
        tiempoEstimado: '5 minutos'
      },
      {
        numero: 2,
        titulo: 'Validar y congelar la declaración',
        detalle: 'Verifica los montos de ventas y compras gravadas y presiona "Congelar" para generar la boleta SAT-2000.',
        tiempoEstimado: '2 minutos'
      },
      {
        numero: 3,
        titulo: 'Pagar o presentar a través de banca en línea',
        detalle: 'Accede a tu bancaSAT o ventanilla bancaria con el número de boleta SAT-2000 y confirma la presentación.',
        tiempoEstimado: 'Inmediato'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Ley del Impuesto al Valor Agregado, Decreto 27-92',
        articulo: 'Artículos 40 y 49',
        detalle: 'Periodicidad de pago mensual, tarifa del pequeño contribuyente y liquidación definitiva del crédito fiscal.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Debo presentar el formulario si no tuve ventas en el mes?',
        respuesta: 'Sí, es obligatorio presentar la declaración con valor cero (Q0.00) dentro del plazo para no incurrir en sanción por omisión formal.'
      }
    ]
  },
  // =========================================================================
  // CESE Y MODIFICACIÓN: CESE DE ACTIVIDADES O CANCELACIÓN DE REGISTRO
  // =========================================================================
  {
    id: 'tram-ces-01',
    titulo: 'Solicitar Cese Temporal o Definitivo de Actividades Comerciales',
    sistemaOficial: 'Agencia Virtual / RTU Digital',
    sistemaTipo: 'rtu',
    formularioOficial: 'Solicitud Electrónica de Cese de Actividades (RTU)',
    macrogrupo: 'contribuyentes',
    grupoNombre: 'Cese y Modificación de Actividades',
    categoriaInterna: 'Cierre y Deshabilitación Registral',
    macroproceso: 'cese',
    audienciasIds: ['persona_individual', 'pequeno_contribuyente', 'regimen_general', 'importadores', 'exportadores', 'courier', 'consolidadores'],
    reglaOptimizacionTexto: 'Universal de Ciclo de Vida: Proceso oficial para suspender o clausurar operaciones fiscales',
    reglaTipo: 'general',
    resumenEjecutivo: 'Gestiona en línea la suspensión temporal o el cese definitivo de tus obligaciones tributarias, cierre de establecimientos o disolución societaria ante la administración tributaria.',
    costo: 'Gratuito',
    plazoLegal: '30 días hábiles para resolución y finiquito tras verificación de no omisos.',
    enlaceTransaccional: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    requisitosPorPerfil: [
      {
        perfilId: 'individual',
        perfilEtiqueta: 'Personas Individuales (Cese de Negocio)',
        items: [
          'Estar solvente de todas las declaraciones hasta la fecha del cese.',
          'Anulación o inactivación de documentos pendientes en FEL.',
          'Presentación del inventario final de existencias si aplica.'
        ]
      },
      {
        perfilId: 'juridica',
        perfilEtiqueta: 'Personas Jurídicas (Disolución y Liquidación)',
        items: [
          'Inscripción de la disolución en el Registro Mercantil.',
          'Nombramiento y credencial del Liquidador inscrito.',
          'Balance general final de liquidación firmado por Perito Contador.'
        ]
      }
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Revisión y liquidación de omisos previos',
        detalle: 'Verifica en tu Agencia Virtual que no existan declaraciones pendientes de períodos anteriores.',
        tiempoEstimado: '10 minutos'
      },
      {
        numero: 2,
        titulo: 'Ingresar solicitud de cese en RTU Digital',
        detalle: 'Selecciona la opción de Cese Temporal (hasta 1 año) o Cese Definitivo y adjunta la documentación de respaldo.',
        tiempoEstimado: '15 minutos'
      },
      {
        numero: 3,
        titulo: 'Resolución de finiquito y constancia de cese',
        detalle: 'La SAT valida la liquidación y emite la Constancia de Cese Oficial con firma electrónica avanzada.',
        tiempoEstimado: '5 a 15 días hábiles'
      }
    ],
    marcoNormativo: [
      {
        ley: 'Código Tributario, Decreto 6-91',
        articulo: 'Artículo 120 numeral 4',
        detalle: 'Procedimiento de aviso de cese de actividades y prescripción de obligaciones tributarias.'
      }
    ],
    faqs: [
      {
        pregunta: '¿Puedo reactivar mis actividades tras un cese temporal?',
        respuesta: 'Sí, dentro del plazo de 1 año puedes reactivar tu RTU Digital inmediatamente desde tu Agencia Virtual sin multas ni cobros adicionales.'
      }
    ]
  }
];

// Matriz completa de conjugación en formato TSV como entrega formal
export const MATRIZ_CONJUGACION_TSV = `Macrogrupo\tNo. Grupo\tGrupo\tCategoría Interna\tMacroproceso (Ciclo de Vida)\tTrámite Específico\tRegla de Negocio / Alcance Operativo
Operadores de Comercio Exterior\t5\tImportadores y Exportadores\tOperaciones Aduaneras Base\tDespacho y Operaciones Aduaneras\tTransmitir Declaración Única Centroamericana (DUCA)\t41/48 Universal Grupo 5: Compartida por Importadores, Exportadores y OEA
Operadores de Comercio Exterior\t5\tImportadores y Exportadores\tSolvencias y Habilitaciones\tSolvencias, Constancias y Certificaciones\tObtener Solvencia Fiscal Electrónica (SOFI)\tUniversal Multi-Grupo: Requisito permanente para despachos y contrataciones
Operadores de Comercio Exterior\t5\tImportadores y Exportadores\tRegistro de Operadores\tInscripción, Registro y Habilitación\tInscribir y Actualizar RTU Digital para Comercio Exterior\t41/48 Universal Grupo 5: Base registral indispensable para todo acto de comercio
Operadores de Comercio Exterior\t5\tImportadores y Exportadores\tCertificaciones de Alta Seguridad\tInscripción, Registro y Habilitación\tSolicitar Certificación Operador Económico Autorizado (OEA-GT)\tExclusiva OEA (1 de 3 exclusivas del Grupo 5): Auditoría de seguridad de cadena logística
Operadores de Comercio Exterior\t5\tImportadores y Exportadores\tBeneficios Tributarios\tDeclaración, Liquidación y Pago\tGestionar Devolución de Crédito Fiscal para Exportadores\tCompartida (Exportadores y OEA): Beneficio de restitución por exportación de bienes
Operadores de Comercio Exterior\t8\tAuxiliares de la Función Pública\tAcreditación y Registro\tInscripción, Registro y Habilitación\tInscribir y Renovar Auxiliares de la Función Pública Aduanera\t45/50 Universal Grupo 8: Consumido exactamente igual por los 9 subgrupos
Operadores de Comercio Exterior\t8\tAuxiliares de la Función Pública\tControl y Tránsito de Carga\tDespacho y Operaciones Aduaneras\tTransmitir Manifiesto de Carga y Marchamo Electrónico (MIAD)\tCompartida Grupo 8: Aplicable a empresas que movilizan carga en territorio aduanero
Operadores de Comercio Exterior\t8\tAuxiliares de la Función Pública\tLicencias Especializadas\tInscripción, Registro y Habilitación\tObtener Licencia de Agente Aduanero\tExclusiva Agente Aduanero (1 de las 5 variaciones técnicas del Grupo 8)
Contribuyentes Generales\t1\tRegistro Fiscal de Vehículos\tTrámites Vehiculares Consolidados\tGestión Vehicular Unificada\tGestionar Distintivos, Calcomanía y Traspaso de Vehículos\tFicha Canónica Unificada: Consolida calcomanía anual, reposición y traspasos
Profesionales\t3\tServicios Profesionales\tEspecies Fiscales y Notariado\tDeclaración, Liquidación y Pago\tComprar Especies Fiscales y Papel de Protocolo\tExclusiva Notarios Habilitados y Patentados Autorizados con entrega presencial
Contribuyentes Generales\t1\tSistema de Facturación\tComprobantes Fiscales Digitales\tFacturación FEL\tHabilitar y Emitir Factura Electrónica en Línea (FEL)\tUniversal de Facturación: Aplica a todo emisor de comprobantes tributarios
Contribuyentes Generales\t1\tDeclaraciones Periódicas\tObligaciones Mensuales del IVA\tDeclaración, Liquidación y Pago\tPresentar Declaración y Pago del Impuesto al Valor Agregado (IVA)\tUniversal de Declaración: Obligación mensual para todos los contribuyentes inscritos en IVA
Contribuyentes Generales\t1\tCese y Modificación\tCierre y Deshabilitación Registral\tCese y Modificación\tSolicitar Cese Temporal o Definitivo de Actividades Comerciales\tUniversal de Ciclo de Vida: Proceso oficial para suspender o clausurar operaciones fiscales`;
