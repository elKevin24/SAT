export type PillarType = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'entes_exentos';

export interface SubgrupoInfo {
  nombre: string;
  cantidadTemas?: number;
  desc?: string;
}

export interface GrupoInfo {
  no: number;
  nombre: string;
  cantidadTemas: number;
  pillar: PillarType;
  desc?: string;
  subgrupos: SubgrupoInfo[];
}

export interface PillarConfigItem {
  id: PillarType;
  name: string;
  desc: string;
  temasTotales: string;
  badgeLabel: string;
  primaryColor: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  circleClasses: string;
  actionTextClass: string;
  activeIndicatorColor: string;
}

export interface TramiteItem {
  id: string;
  pillar: PillarType;
  pillarName: string;
  categoria: string; // Grupo Oficial (ej. 'NIT sin Obligaciones', 'Pequeños Contribuyentes', etc.)
  subcategoria: string; // Subgrupo Oficial (ej. 'Inscripción y Actualización en RTU', etc.)
  subgrupoInterno?: string; // Subgrupo (Categoría Interna) ej. 'General'
  tema?: string; // Tema oficial
  subtema?: string; // Subtema oficial
  nombreActual?: string; // Página / Trámite (nombre actual)
  origenClasificacion?: string; // Origen de la clasificación
  grupoNo?: number;
  tipoSubtema?: string; // ej. 'Inscripción', 'Actualización', 'Acceso a Plataforma', etc.
  moduloRequisitos?: string; // ej. 'Requisitos para la Inscripción RTU'
  ubicacionPortalActual?: string; // Sección actual del menú
  tramite: string; // Nombre de trámite sugerido
  url: string;
  descripcion: string;
  perfilDestinatario?: string; // Usado por (según Grupos y categorías)
  impactoOImportancia?: string; // Motivo / referencia
  recomendacionUX?: string; // Nota / Revisar
  baseLegal?: string;
  formulario?: string;
  requisitosPorModalidad?: {
    modalidad: string;
    requisitos: string[];
  }[];
  requisitos?: string[];
  pasos?: string[];
  notasImportantes?: string[];
  puntosMenu: {
    id: string;
    titulo: string;
  }[];
}

export const PILLARS_CONFIG: PillarConfigItem[] = [
  { 
    id: 'contribuyentes', 
    name: 'Contribuyentes', 
    desc: 'Información y servicios tributarios para personas y empresas.',
    temasTotales: '4 Grupos · 120 Temas',
    badgeLabel: '4 Grupos',
    primaryColor: '#14649B',
    cardHoverBorder: 'hover:border-[#14649B]',
    cardHoverBg: 'hover:bg-[#14649B]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(20,100,155,0.28)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#14649B]/10 text-[#14649B] group-hover:bg-white group-hover:text-[#14649B]',
    actionTextClass: 'text-[#14649B] group-hover:text-white',
    activeIndicatorColor: '#14649B'
  },
  { 
    id: 'comercio_exterior', 
    name: 'Operadores de Comercio Exterior', 
    desc: 'Servicios e información aduanera para la importación, exportación y logística.',
    temasTotales: '8 Categorías · 150 Trámites',
    badgeLabel: '8 Categorías',
    primaryColor: '#0284C7',
    cardHoverBorder: 'hover:border-[#0284C7]',
    cardHoverBg: 'hover:bg-[#0284C7]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(2,132,199,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#0284C7]/15 text-[#0284C7] group-hover:bg-white group-hover:text-[#0284C7]',
    actionTextClass: 'text-[#0284C7] group-hover:text-white',
    activeIndicatorColor: '#0284C7'
  },
  { 
    id: 'profesionales', 
    name: 'Profesionales', 
    desc: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
    temasTotales: '5 Categorías · 45 Trámites',
    badgeLabel: '5 Categorías',
    primaryColor: '#4D8014',
    cardHoverBorder: 'hover:border-[#4D8014]',
    cardHoverBg: 'hover:bg-[#4D8014]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(77,128,20,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#4D8014]/15 text-[#2D5A0C] group-hover:bg-white group-hover:text-[#4D8014]',
    actionTextClass: 'text-[#2D5A0C] group-hover:text-white',
    activeIndicatorColor: '#4D8014'
  },
  { 
    id: 'entes_exentos', 
    name: 'Entes Exentos', 
    desc: 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
    temasTotales: '5 Categorías · 79 Trámites',
    badgeLabel: '5 Categorías',
    primaryColor: '#C25E00',
    cardHoverBorder: 'hover:border-[#C25E00]',
    cardHoverBg: 'hover:bg-[#C25E00]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(194,94,0,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#C25E00]/15 text-[#8A3B00] group-hover:bg-white group-hover:text-[#C25E00]',
    actionTextClass: 'text-[#8A3B00] group-hover:text-white',
    activeIndicatorColor: '#C25E00'
  }
];

export const GRUPOS_CONFIG: GrupoInfo[] = [
  // Contribuyentes
  {
    no: 1,
    nombre: 'NIT sin Obligaciones',
    cantidadTemas: 10,
    pillar: 'contribuyentes',
    desc: 'Personas individuales, estudiantes y graduados sin actividad económica que requieren NIT para actos civiles, cuentas bancarias, cobro de remesas, registro de títulos y acceso a información pública (cero trabajadores asalariados).',
    subgrupos: [
      { nombre: 'Inscripción de NIT', cantidadTemas: 2, desc: 'Solicitud de primer NIT y actualización de datos de identificación personal.' },
      { nombre: 'Títulos Universitarios', cantidadTemas: 2, desc: 'Registro y habilitación de títulos para ejercer y verificación digital mediante código QR.' },
      { nombre: 'Información Pública', cantidadTemas: 2, desc: 'Solicitud formal y consulta de información pública de oficio de la SAT conforme al Decreto 57-2008.' },
      { nombre: 'Servicios en Línea y Solvencias', cantidadTemas: 4, desc: 'Agencia Virtual, consulta de expedientes, Solvencia Fiscal en línea y cita previa.' }
    ]
  },
  {
    no: 2,
    nombre: 'Pequeños Contribuyentes',
    cantidadTemas: 39,
    pillar: 'contribuyentes',
    desc: 'Régimen simplificado de tributación del 5% y actividades agropecuarias especiales primarias y pecuarias.',
    subgrupos: [
      { nombre: 'Pequeño Contribuyente', cantidadTemas: 39, desc: 'Facturación mensual máxima de Q150,000 anuales con tarifa del 5% definitiva.' },
      { nombre: 'Primario', cantidadTemas: 39, desc: 'Régimen especial agropecuario para productores primarios de granos y vegetales.' },
      { nombre: 'Pecuario', cantidadTemas: 39, desc: 'Régimen especial agropecuario para actividades de ganadería, avicultura y crianza.' }
    ]
  },
  {
    no: 3,
    nombre: 'Contribuyente General',
    cantidadTemas: 295,
    pillar: 'contribuyentes',
    desc: 'Personas individuales y jurídicas con obligaciones tributarias generales, IVA (12%), regímenes de ISR, vehículos como propietarios, facturación y servicios del RTU.',
    subgrupos: [
      { nombre: 'RTU e Inscripción', cantidadTemas: 48, desc: 'Inscripción de sociedades, actualización de datos, nombramientos de representantes y cese de negocios.' },
      { nombre: 'Obligaciones y Regímenes', cantidadTemas: 41, desc: 'Declaraciones de impuestos, regímenes tributarios, facturación electrónica FEL y autorizaciones.' },
      { nombre: 'Registro Fiscal de Vehículos', cantidadTemas: 75, desc: 'Inscripción, traspasos, distintivos, impuesto de circulación ISCV, modificaciones y consultas vehiculares.' },
      { nombre: 'Capacitación y Cultura Tributaria', cantidadTemas: 60, desc: 'Cursos por impuesto, herramientas electrónicas, calendario, biblioteca virtual y formación ciudadana.' },
      { nombre: 'Devoluciones y Créditos Fiscales', cantidadTemas: 22, desc: 'Devolución de ISR asalariados/empresas, IVA crédito fiscal, pagos indebidos y en exceso.' },
      { nombre: 'Servicios al Contribuyente', cantidadTemas: 33, desc: 'Constancias del RTU, libros contables, Agencia Virtual, citas presenciales y correcciones de formularios.' },
      { nombre: 'Consultas y Verificadores', cantidadTemas: 16, desc: 'Verificadores públicos de documentos, solvencias, consultas tributarias y atención de quejas.' }
    ]
  },
  {
    no: 4,
    nombre: 'Contribuyentes Especiales',
    cantidadTemas: 36,
    pillar: 'contribuyentes',
    desc: 'Gerencias de Medianos y Grandes Contribuyentes Especiales con control tributario diferenciado.',
    subgrupos: [
      { nombre: 'Medianos', cantidadTemas: 32, desc: 'Gerencia de Medianos Contribuyentes Especiales y fiscalización preventiva.' },
      { nombre: 'Grandes', cantidadTemas: 32, desc: 'Gerencia de Grandes Contribuyentes Especiales, precios de transferencia y auditorías.' },
      { nombre: 'Rep. Legales', cantidadTemas: 36, desc: 'Representación legal y apoderados ante gerencias de contribuyentes especiales.' }
    ]
  },

  // Operadores de Comercio Exterior
  {
    no: 5,
    nombre: 'Importadores y Exportadores',
    cantidadTemas: 80,
    pillar: 'comercio_exterior',
    desc: 'Operaciones aduaneras de importación, exportación, certificación OEA y normativa arancelaria.',
    subgrupos: [
      { nombre: 'Importadores', cantidadTemas: 58, desc: 'Padrón de importadores, declaraciones DUCA, aranceles DAI, levante aduanero y nacionalización de vehículos.' },
      { nombre: 'Exportadores', cantidadTemas: 21, desc: 'Padrón de exportadores, declaraciones aduaneras y devolución de crédito fiscal del IVA.' },
      { nombre: 'OEA', cantidadTemas: 1, desc: 'Programa de Operador Económico Autorizado y certificación de seguridad en la cadena logística.' }
    ]
  },
  {
    no: 8,
    nombre: 'Auxiliares de la Función Pública Aduanera',
    cantidadTemas: 70,
    pillar: 'comercio_exterior',
    desc: 'Personas individuales o jurídicas autorizadas que colaboran en la gestión, transporte y custodia aduanera oficial.',
    subgrupos: [
      { nombre: 'Transportistas', cantidadTemas: 13, desc: 'Admisión temporal de equipo de carga (ATC), manifiestos CUSCAR y marchamo electrónico.' },
      { nombre: 'Agentes Aduaneros', cantidadTemas: 7, desc: 'Acreditación oficial, componente ActiveX PKI/DUA y representación aduanera.' },
      { nombre: 'Normativa y Aranceles', cantidadTemas: 46, desc: 'Sistema Arancelario Centroamericano (SAC), facilitación comercial, modernización y prevención de contrabando.' },
      { nombre: 'Courier', cantidadTemas: 3, desc: 'Empresas de entrega rápida, paquetería expresa internacional y despacho simplificado.' },
      { nombre: 'Almacenes Fiscales', cantidadTemas: 1, desc: 'Depósitos aduaneros temporales, almacenadoras y recintos bajo custodia fiscal.' }
    ]
  },

  // Profesionales
  {
    no: 7,
    nombre: 'Profesionales y Terceras Personas',
    cantidadTemas: 45,
    pillar: 'profesionales',
    desc: 'Habilitación y gestiones para abogados y notarios, peritos contadores, auditores (CPA), gestores tributarios y servicios profesionales.',
    subgrupos: [
      { nombre: 'Abogados y Notarios', cantidadTemas: 17, desc: 'Papel Sellado de Protocolos, timbres fiscales, traspasos electrónicos (TEV) y avisos notariales obligatorios.' },
      { nombre: 'Peritos Contadores', cantidadTemas: 11, desc: 'Inscripción en RTU, habilitación en Agencia Virtual, Libro Electrónico Tributario (LET) y retenciones.' },
      { nombre: 'Gestores Tributarios', cantidadTemas: 8, desc: 'Acreditación oficial, requisitos de carné, renovación de gafetes y verificación en línea.' },
      { nombre: 'Servicios Profesionales', cantidadTemas: 5, desc: 'Facturación de honorarios, retenciones en la fuente, consultas jurídicas y actualización.' },
      { nombre: 'Auditores', cantidadTemas: 4, desc: 'Habilitación de Contadores Públicos y Auditores (CPA) y dictámenes de crédito fiscal.' }
    ]
  },

  // Entes Exentos
  {
    no: 6,
    nombre: 'Exentos',
    cantidadTemas: 53,
    pillar: 'entes_exentos',
    desc: 'Entidades exentas constitucionales, no lucrativas, por decreto de fomento y corporaciones municipales.',
    subgrupos: [
      { nombre: 'Constitucionales', cantidadTemas: 18, desc: 'Centros educativos, universidades privadas y entidades de la Iglesia Católica.' },
      { nombre: 'Decreto', cantidadTemas: 16, desc: 'Entidades y proyectos beneficiarios de leyes especiales de fomento y cooperativas.' },
      { nombre: 'No Lucrativos', cantidadTemas: 14, desc: 'Fundaciones, asociaciones benéficas, ONGs, OPF y sindicatos.' },
      { nombre: 'Municipalidades', cantidadTemas: 5, desc: 'Gobiernos locales, exenciones del IVA (CIVA) y patrimonio municipal.' }
    ]
  },
  {
    no: 9,
    nombre: 'Entidades del Estado',
    cantidadTemas: 26,
    pillar: 'entes_exentos',
    desc: 'Ministerios, dependencias del Estado, Organismo Judicial, Ministerio Público y SENABED.',
    subgrupos: [
      { nombre: 'Entidades del Estado', cantidadTemas: 26, desc: 'Acreditación en RTU estatal, gestión vehicular oficial, exenciones y órdenes de autoridad judicial.' }
    ]
  }
];

export const TRAMITES_DATA: TramiteItem[] = [
  // Contribuyentes -> NIT sin Obligaciones (Grupo 1)
  {
    id: 'con-nit-1',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Inscripción y Actualización en RTU',
    subgrupoInterno: 'General',
    tema: 'Inscripción y Actualización en RTU',
    subtema: 'Inscripción',
    nombreActual: 'Requisitos para la Inscripción RTU',
    grupoNo: 1,
    tipoSubtema: 'Inscripción',
    moduloRequisitos: 'Requisitos para la Inscripción RTU',
    ubicacionPortalActual: 'Requisitos de personas / empresas',
    tramite: 'Inscripción de NIT sin Obligaciones',
    url: 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/#1615485066841-639e67c5-51e3',
    formulario: 'Solicitud de NIT Digital / Portal Web SAT',
    descripcion: 'Solicitud y requisitos para la obtención electrónica de tu Número de Identificación Tributaria (NIT) sin obligaciones tributarias por primera vez; utilizado por estudiantes, jóvenes y personas individuales que lo requieren para realizar gestiones bancarias (apertura de cuentas de ahorro o monetarias), actos civiles y recepción de remesas familiares.',
    perfilDestinatario: 'Estudiantes, jóvenes y personas individuales (gestiones bancarias, remesas o actos civiles sin actividad mercantil)',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Trámite inicial obligatorio para trámites bancarios, acreditación estudiantil, recepción de remesas y actos civiles no tributarios.',
    recomendacionUX: 'Desvincular del listado de empresas/sociedades mercantiles; crear landing o ficha específica para personas individuales.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Perfil del solicitante y alcance' },
      { id: 'requisitos', titulo: 'Cumplir requisitos para inscripción RTU' },
      { id: 'pasos', titulo: 'Seguir pasos de inscripción digital' },
      { id: 'formulario', titulo: 'Completar solicitud en portal SAT' },
      { id: 'notas', titulo: 'Revisar notas importantes y alcance' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Documento Personal de Identificación (DPI) en original escaneado de ambos lados (para guatemaltecos mayores de edad).',
      'Pasaporte vigente completo y legible en archivo digitalizado (para personas extranjeras).',
      'Factura reciente de servicios (agua, luz o teléfono) en digital para validar la dirección del domicilio fiscal reportado.',
      'Dirección de correo electrónico personal activa y de uso exclusivo (para validación por código de seguridad).',
      'Para menores de edad: Certificación de Nacimiento de RENAP y DPI del padre, madre o tutor legal acreditado.'
    ],
    pasos: [
      'Ingresar al portal web de la SAT (portal.sat.gob.gt) y seleccionar la opción "Solicitud de NIT".',
      'Ingresar su correo electrónico personal y validar el código de seguridad enviado a su bandeja de entrada.',
      'Elegir el tipo de persona: "Persona Individual sin actividad económica / sin obligaciones afectas".',
      'Completar los datos de identificación personal, fecha de nacimiento, estado civil y ubicación del domicilio fiscal.',
      'Adjuntar los archivos digitales requeridos (DPI o pasaporte y comprobante de domicilio).',
      'Enviar la solicitud para revisión electrónica y recibir en su correo la confirmación de aprobación con su nuevo número de NIT.'
    ],
    notasImportantes: [
      'Trámite 100% en línea y gratuito. No requiere acudir a una agencia física si los documentos e identidad son validados automáticamente.',
      'El NIT sin obligaciones no genera responsabilidades periódicas de pago de IVA o ISR, pero permite realizar actos civiles como apertura de cuentas bancarias, escrituración de bienes y recepción de remesas.',
      'Ficha desvinculada del régimen corporativo: atiende directamente al ciudadano sin obligarlo a interactuar con requisitos de empresas o sociedades mercantiles.'
    ]
  },
  {
    id: 'con-nit-2',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Inscripción y Actualización en RTU',
    subgrupoInterno: 'General',
    tema: 'Inscripción y Actualización en RTU',
    subtema: 'Actualización',
    nombreActual: 'Requisitos para la Actualización RTU',
    grupoNo: 1,
    tipoSubtema: 'Actualización',
    moduloRequisitos: 'Requisitos para la Actualización RTU',
    ubicacionPortalActual: 'Requisitos de personas / empresas',
    tramite: 'Actualización de Datos y Transición a Con Obligaciones',
    url: 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/#1541621044169-4198d06d-693f',
    formulario: 'Agencia Virtual SAT / Módulo RTU Digital',
    baseLegal: 'Artículos 112 y 120 del Código Tributario, Decreto 6-91 del Congreso de la República.',
    descripcion: 'Requisitos y pasos para actualizar datos de identificación, domicilio fiscal o pasar al régimen con obligaciones tributarias.',
    perfilDestinatario: 'Personas que inician relación laboral o comercial',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Permite modificar datos personales o dar el salto formal a contribuyente afecto cuando la persona inicia actividades económicas.',
    recomendacionUX: "Aislar la opción de paso de 'sin obligaciones' a 'con obligaciones' sin obligar a navegar por requisitos corporativos.",
    puntosMenu: [
      { id: 'perfil', titulo: 'Perfil de actualización y transición' },
      { id: 'requisitos', titulo: 'Cumplir requisitos para actualización' },
      { id: 'pasos', titulo: 'Seguir pasos de transición en RTU' },
      { id: 'formulario', titulo: 'Ingresar a Agencia Virtual SAT' },
      { id: 'notas', titulo: 'Revisar notas sobre régimen tributario' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Usuario y contraseña activos en la Agencia Virtual de la SAT.',
      'Documento Personal de Identificación (DPI) en digital para validar datos personales.',
      'Comprobante de factura de servicios si se actualiza la dirección del domicilio fiscal.',
      'Para transición a régimen laboral o comercial: Definir la actividad económica específica y régimen de afiliación deseado (Pequeño Contribuyente, Régimen General o Asalariado).'
    ],
    pasos: [
      'Iniciar sesión en la Agencia Virtual de la SAT con su usuario (NIT) y contraseña.',
      'Acceder a la sección "Servicios" > "Registro Tributario Unificado (RTU)" > "Actualización de Datos".',
      'Modificar los campos que requieran actualización (domicilio fiscal, números de contacto o correo).',
      'Para pasar a régimen con obligaciones: En la sección de Actividades Económicas, activar la actividad comercial, profesional o laboral correspondiente.',
      'Seleccionar el régimen de impuestos aplicable (ej. Régimen de Pequeño Contribuyente del 5% o Asalariado).',
      'Confirmar los cambios con su contraseña y descargar de inmediato la nueva Constancia de RTU Digital actualizada.'
    ],
    notasImportantes: [
      'La actualización debe realizarse dentro de los 30 días hábiles posteriores a cualquier cambio de domicilio o inicio de actividades comerciales.',
      'Al activar una obligación comercial, se habilitará la emisión gratuita de Facturas Electrónicas en Línea (FEL) a través de la Agencia Virtual.'
    ]
  },
  {
    id: 'con-nit-3',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Sistemas Web y Seguridad',
    subgrupoInterno: 'General',
    tema: 'Sistemas Web y Seguridad',
    subtema: 'Acceso a Plataforma',
    nombreActual: 'Agencia Virtual',
    grupoNo: 1,
    tipoSubtema: 'Acceso a Plataforma',
    moduloRequisitos: 'Agencia Virtual',
    ubicacionPortalActual: 'Menú Principal / Sistemas',
    tramite: 'Solicitud y Activación de Agencia Virtual',
    url: 'https://farm3.sat.gob.gt/menu/login.jsf',
    formulario: 'Formulario Web de Solicitud de Agencia Virtual',
    baseLegal: 'Acuerdos de Directorio de la SAT que regulan el uso de servicios tributarios por medios electrónicos.',
    descripcion: 'Acceso a plataforma, activación de usuario, reinicio de contraseña y cambio de correo electrónico para personas sin obligaciones.',
    perfilDestinatario: 'Usuarios registrados con NIT',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Canal indispensable para descargar constancia de RTU, consultar datos personales y dar seguimiento a solicitudes web.',
    recomendacionUX: 'Es un sistema de autenticación directa; la ficha informativa debe explicar cómo obtener el acceso inicial.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Importancia del canal electrónico' },
      { id: 'requisitos', titulo: 'Cumplir requisitos para solicitar acceso' },
      { id: 'pasos', titulo: 'Seguir pasos de registro y activación' },
      { id: 'seguimiento', titulo: 'Paso de seguimiento: Consulta de estado de gestión' },
      { id: 'formulario', titulo: 'Llenar formulario en portal SAT' },
      { id: 'notas', titulo: 'Revisar notas sobre seguridad y acceso' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al acceso de Agencia Virtual' }
    ],
    requisitos: [
      'Contar con Número de Identificación Tributaria (NIT) asignado previamente.',
      'Documento Personal de Identificación (DPI) o pasaporte vigente en archivo digital legible.',
      'Fotografía tipo selfie sosteniendo el documento de identidad frente al rostro para validación biométrica.',
      'Cuenta de correo electrónico personal activa y de uso exclusivo.'
    ],
    pasos: [
      'Ingresar al portal oficial de la SAT y pulsar el botón "Solicitar Agencia Virtual".',
      'Ingresar su NIT y fecha de nacimiento para que el sistema localice su registro.',
      'Ingresar y confirmar su dirección de correo electrónico personal.',
      'Adjuntar la imagen de su DPI/Pasaporte y la fotografía de validación de identidad (selfie sosteniendo el documento).',
      'Enviar la solicitud y guardar el número de gestión recibido en pantalla y por correo.',
      'Una vez aprobada la solicitud, abrir el enlace recibido por correo para establecer su contraseña y acceder al sistema.',
      'Paso de seguimiento integrado: Dar seguimiento al expediente en "Consulta de Estado de Gestión de Agencia Virtual" para verificar si fue aceptado, rechazado o requiere subsanar requisitos.'
    ],
    notasImportantes: [
      'Paso de seguimiento integrado: La validación del estado del expediente no es un enlace huérfano; una vez enviada la solicitud o reseteo de clave, el contribuyente debe consultar periódicamente el "Estado de Gestión de Agencia Virtual" para validar si fue aceptada, rechazada o requiere subsanar requisitos.',
      'Canal de autenticación directa: Una vez aprobada y recibida la confirmación, el acceso inicial se realiza mediante el enlace seguro temporal enviado al correo electrónico registrado.',
      'El servicio de Agencia Virtual es gratuito y opera las 24 horas del día, los 365 días del año.'
    ]
  },
  {
    id: 'con-nit-4',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Consultas y Verificadores',
    subgrupoInterno: 'General',
    tema: 'Consultas y Verificadores',
    subtema: 'Seguimiento de Trámites',
    nombreActual: 'Estado de Gestión de Agencia Virtual',
    grupoNo: 1,
    tipoSubtema: 'Seguimiento de Trámites',
    moduloRequisitos: 'Estado de Gestión de Agencia Virtual',
    ubicacionPortalActual: 'Consultas Públicas',
    tramite: 'Consulta de Estado de Gestión de Agencia Virtual',
    url: 'https://portal.sat.gob.gt/portal/consulta-de-gestion-del-contribuyente/',
    formulario: 'Módulo de Consulta Pública de Gestiones SAT',
    baseLegal: 'Normativa institucional de atención y seguimiento a trámites electrónicos de la SAT.',
    descripcion: 'Herramienta de consulta para verificar el estado de aprobación de la solicitud de acceso a Agencia Virtual.',
    perfilDestinatario: 'Solicitantes de Agencia Virtual',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Permite validar si la solicitud de usuario o reseteo de clave fue aceptada, rechazada o requiere subsanar requisitos.',
    recomendacionUX: 'Debe integrarse como paso de seguimiento dentro de la ficha de Agencia Virtual, no como enlace huérfano.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Objetivo de la consulta en línea' },
      { id: 'requisitos', titulo: 'Requisitos para realizar la consulta' },
      { id: 'pasos', titulo: 'Seguir pasos de consulta en tiempo real' },
      { id: 'formulario', titulo: 'Ingresar al sistema de consulta' },
      { id: 'notas', titulo: 'Revisar estados posibles de gestión' },
      { id: 'base-legal', titulo: 'Consultar normativa aplicable' },
      { id: 'enlace', titulo: 'Ir a la consulta de estado en portal SAT' }
    ],
    requisitos: [
      'Número de gestión generado al solicitar la Agencia Virtual o reseteo de clave.',
      'Número de Identificación Tributaria (NIT) o Documento Personal de Identificación (DPI) del titular.'
    ],
    pasos: [
      'Ingresar al portal de la SAT en la sección "Consulta de Gestión del Contribuyente".',
      'Seleccionar el tipo de búsqueda: por número de gestión o por NIT/DPI.',
      'Ingresar el código de seguridad captcha en pantalla.',
      'Hacer clic en "Buscar" para consultar el estado actual del expediente.'
    ],
    notasImportantes: [
      'Estados oficiales del expediente: "En trámite" (en revisión documental por el analista tributario), "Aprobada" (usuario o reseteo activado; remitirse al correo electrónico), o "Rechazada" (se detalla el motivo de rechazo y las subsanaciones requeridas).',
      'Integración transaccional: Diseñado como paso consecuente y directo dentro del ciclo de vida de Agencia Virtual, permitiendo al solicitante validar el progreso sin acudir a una agencia física.',
      'No requiere pago ni autenticación previa, únicamente el número de gestión recibido al completar la solicitud o el NIT/DPI del titular.'
    ]
  },
  {
    id: 'con-nit-5',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Certificaciones y Solvencias',
    subgrupoInterno: 'General',
    tema: 'Certificaciones y Solvencias',
    subtema: 'Solvencias',
    nombreActual: 'Solvencia Fiscal en Línea',
    grupoNo: 1,
    tipoSubtema: 'Solvencias',
    moduloRequisitos: 'Solvencia Fiscal',
    ubicacionPortalActual: 'Consultas / Solvencias',
    tramite: 'Solicitud y Emisión de Solvencia Fiscal en Línea',
    url: 'https://portal.sat.gob.gt/portal/solvencia-fiscal/',
    formulario: 'Declaraguate SAT-8421 / Agencia Virtual',
    baseLegal: 'Artículo 57 "A" del Código Tributario, Decreto 6-91 del Congreso de la República.',
    descripcion: 'Consulta, pago y descarga del certificado electrónico que acredita la ausencia de adeudos tributarios ante la SAT para fines laborales o personales.',
    perfilDestinatario: 'Personas Individuales',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Exigida comúnmente a personas sin obligaciones para postulaciones laborales, trámites consulares/visas y contratos civiles.',
    recomendacionUX: 'Para este perfil la emisión es automática, salvo que existan registros históricos de omisos o adeudos en el ISCV.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Alcance de la solvencia fiscal' },
      { id: 'requisitos', titulo: 'Cumplir requisitos para solvencia' },
      { id: 'pasos', titulo: 'Seguir pasos de generación y pago' },
      { id: 'formulario', titulo: 'Llenar Declaraguate SAT-8421' },
      { id: 'notas', titulo: 'Revisar notas sobre vigencia y costo' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial de solvencia' }
    ],
    requisitos: [
      'Tener el NIT actualizado y ratificado en el RTU Digital en el año en curso.',
      'No tener omisos de declaraciones históricas ni adeudos pendientes en el Impuesto de Circulación de Vehículos (ISCV).',
      'Acceso a banca virtual o ventanilla bancaria para cancelar la tarifa de Q30.00.',
      'Cuenta en Agencia Virtual para descargar la solvencia oficial emitida.'
    ],
    pasos: [
      'Ingresar al portal Declaraguate (declaraguate.sat.gob.gt) y buscar el formulario SAT-8421 (Solicitud de Solvencia Fiscal).',
      'Ingresar el número de NIT y fecha de nacimiento.',
      'El sistema verifica en tiempo real que no existan incumplimientos.',
      'Congelar el formulario e imprimir la boleta SAT-2000 con el valor de Q30.00.',
      'Efectuar el pago por banca en línea o en ventanilla bancaria.',
      'Ingresar a su Agencia Virtual en Servicios > Constancias y Solvencias > Solvencia Fiscal (SOFI) para descargar el documento oficial en PDF con código QR.'
    ]
  },
  {
    id: 'con-nit-6',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Citas y Agencias',
    subgrupoInterno: 'General',
    tema: 'Citas y Agencias',
    subtema: 'Atención Presencial',
    nombreActual: 'Requisitos para la Atención a través de Cita',
    grupoNo: 1,
    tipoSubtema: 'Atención Presencial',
    moduloRequisitos: 'Requisitos para la Atención a través de Cita',
    ubicacionPortalActual: 'Requisitos trámites agencias',
    tramite: 'Cita Previa para Trámites Presenciales',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/cita-controlada/',
    formulario: 'Sistema de Citas Controladas SAT',
    baseLegal: 'Disposiciones administrativas y protocolos de atención al contribuyente de la SAT.',
    descripcion: 'Información, requisitos y agenda electrónica para programar atención física en agencias tributarias.',
    perfilDestinatario: 'Casos especiales (menores o extranjeros)',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Aplica a personas sin obligaciones únicamente en validaciones biométricas presenciales o trámites mediante representante legal.',
    recomendacionUX: 'Condicional: solo debe desplegarse como alternativa si el trámite inicial no logra completarse 100% en línea.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Condiciones de aplicación' },
      { id: 'requisitos', titulo: 'Requisitos para programar cita' },
      { id: 'pasos', titulo: 'Seguir pasos de agendamiento' },
      { id: 'formulario', titulo: 'Ingresar a plataforma de citas' },
      { id: 'notas', titulo: 'Revisar condiciones de atención presencial' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir a la plataforma de citas SAT' }
    ],
    requisitos: [
      'Número de NIT o CUI del solicitante.',
      'Documento Personal de Identificación (DPI) en original para presentarlo en ventanilla.',
      'Para extranjeros: Pasaporte original vigente.',
      'Para menores de edad: Certificado de nacimiento de RENAP y DPI original del representante legal.',
      'Correo electrónico activo para recibir la confirmación de la cita con código QR de acceso.'
    ],
    pasos: [
      'Acceder a la plataforma de Citas Controladas en el portal SAT.',
      'Seleccionar el tipo de trámite presencial que requiere realizar.',
      'Elegir el departamento, municipio y la agencia tributaria más conveniente.',
      'Seleccionar la fecha y hora disponible en el calendario de turnos.',
      'Confirmar los datos de contacto y descargar el comprobante de cita.',
      'Presentarse a la agencia elegida 10 minutos antes con su DPI y comprobante de cita en mano.'
    ]
  },
  {
    id: 'con-nit-7',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Transparencia y Ciudadanía',
    subgrupoInterno: 'General',
    tema: 'Transparencia y Ciudadanía',
    subtema: 'Acceso a Información',
    nombreActual: 'Acceso a la Información Pública',
    grupoNo: 1,
    tipoSubtema: 'Acceso a Información',
    moduloRequisitos: 'Acceso a la Información Pública',
    ubicacionPortalActual: 'Transparencia / Menú Principal',
    tramite: 'Solicitud de Información Pública (Ley de Acceso)',
    url: 'https://portal.sat.gob.gt/portal/libre-acceso-la-informacion-publica/',
    formulario: 'Formulario de Solicitud de Información Pública / Portal Web SAT',
    baseLegal: 'Decreto Número 57-2008 del Congreso de la República de Guatemala, Ley de Acceso a la Información Pública.',
    descripcion: 'Información, formularios y canales para solicitar información pública a la SAT (disponible en español, Kaqchikel, Q\'eqchi\' y K\'iche\').',
    perfilDestinatario: 'Ciudadanos en general y personas individuales',
    origenClasificacion: 'Decreto 57-2008 (Ley de Acceso a la Información Pública)',
    impactoOImportancia: 'Trámite ciudadano universal para requerir expedientes o datos amparados bajo la Ley de Acceso a la Información.',
    recomendacionUX: 'Servicio ciudadano no tributario. Mantener accesible desde perfil ciudadano y pie institucional.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Perfil y alcance ciudadano' },
      { id: 'requisitos', titulo: 'Requisitos para solicitar información' },
      { id: 'pasos', titulo: 'Pasos para tramitar la solicitud' },
      { id: 'formulario', titulo: 'Completar formulario de acceso' },
      { id: 'notas', titulo: 'Revisar notas sobre plazos e idiomas' },
      { id: 'base-legal', titulo: 'Consultar Decreto 57-2008' },
      { id: 'enlace', titulo: 'Ir al portal de Libre Acceso SAT' }
    ],
    requisitos: [
      'Documento Personal de Identificación (DPI) para guatemaltecos o Pasaporte vigente para extranjeros.',
      'Identificación clara y precisa de la información o expediente administrativo que se solicita.',
      'Dirección de correo electrónico personal o domicilio para recibir notificaciones y la entrega de la información.',
      'No es obligatorio motivar ni justificar la solicitud de información pública conforme al artículo 41 de la ley.'
    ],
    pasos: [
      'Ingresar al portal de Libre Acceso a la Información Pública de la SAT.',
      'Seleccionar el idioma de su preferencia para realizar la gestión (Español, Kaqchikel, Q\'eqchi\' o K\'iche\').',
      'Completar el formulario oficial en línea con sus datos de identificación y la descripción específica de los datos requeridos.',
      'Enviar la solicitud electrónica y guardar el comprobante con número de registro para seguimiento.',
      'Recibir la resolución formal y entrega de la información en un plazo máximo legal de 10 días hábiles (prorrogables excepcionalmente por 10 días más).'
    ],
    notasImportantes: [
      'Servicio completamente gratuito. Únicamente se cancelan costos de reproducción si se solicitan copias impresas o medios magnéticos.',
      'Pertinencia lingüística: Plataforma adaptada a los idiomas mayas mayoritarios (Kaqchikel, Q\'eqchi\' y K\'iche\') para garantizar el acceso universal.',
      'Trámite de naturaleza ciudadana no tributaria amparado en el Decreto 57-2008 del Congreso de la República.'
    ]
  },
  {
    id: 'con-nit-8',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'NIT sin Obligaciones',
    subcategoria: 'Habilitación Profesional',
    subgrupoInterno: 'General',
    tema: 'Habilitación Profesional',
    subtema: 'Registro y Pago de Timbres',
    nombreActual: 'Requisitos para el Registro y Habilitación de Títulos para Ejercer Profesión',
    grupoNo: 1,
    tipoSubtema: 'Registro y Pago de Timbres',
    moduloRequisitos: 'Requisitos para el Registro y Habilitación de Títulos para Ejercer Profesión',
    ubicacionPortalActual: 'Requisitos trámites agencias',
    tramite: 'Registro y Habilitación de Títulos Universitarios',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/registro-y-habilitacion-de-titulos-para-ejercer-profesion/',
    formulario: 'Declaraguate SAT-7130 / Pago de Impuesto de Timbres Fiscales',
    baseLegal: 'Decreto Número 37-92, Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos (Artículo 5, numeral 3).',
    descripcion: 'Requisitos, pasos, tarifas de timbres fiscales y documentos para registrar y habilitar títulos universitarios a nivel técnico, licenciatura, maestría o doctorado para ejercer la profesión.',
    perfilDestinatario: 'Graduados universitarios y profesionales colegiados activos',
    origenClasificacion: 'Análisis de arquitectura transaccional',
    impactoOImportancia: 'Ley de Timbres Fiscales y de Papel Sellado Especial para Protocolos (Art. 5, numeral 3)',
    recomendacionUX: 'Trámite operativo presencial/electrónico. Es el prerrequisito para afiliarse a Servicios Profesionales en el RTU y habilitar emisión FEL; debe enlazar con la Consulta de Títulos QR como herramienta de verificación.',
    puntosMenu: [
      { id: 'perfil', titulo: 'Perfil y prerrequisito profesional' },
      { id: 'requisitos', titulo: 'Requisitos para registrar títulos' },
      { id: 'pasos', titulo: 'Pasos de registro y habilitación' },
      { id: 'formulario', titulo: 'Llenar Declaraguate SAT-7130' },
      { id: 'verificador-qr', titulo: 'Consulta de Títulos QR (Herramienta)' },
      { id: 'notas', titulo: 'Revisar tarifas legales y colegiación' },
      { id: 'base-legal', titulo: 'Consultar Ley de Timbres Fiscales' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Documento Personal de Identificación (DPI) original y fotocopia legible del profesional.',
      'Título universitario en original (nivel técnico, licenciatura, maestría o doctorado) con los sellos y firmas de la universidad respectiva.',
      'Constancia de colegiado activo emitida por el colegio profesional correspondiente (vigente en el año en curso).',
      'Formulario Declaraguate SAT-7130 congelado y boleta SAT-2000 pagada por concepto de Impuesto de Timbres Fiscales.',
      'Para títulos extranjeros: Incorporación oficial aprobada por la Universidad de San Carlos de Guatemala (USAC) o reconocimiento según tratados internacionales.'
    ],
    pasos: [
      'Ingresar al portal Declaraguate (declaraguate.sat.gob.gt) y llenar el formulario SAT-7130 (Impuesto de Timbres Fiscales).',
      'Seleccionar el tipo de título a habilitar (Universitario nivel Licenciatura/Maestría/Doctorado: Q100.00; Nivel Técnico: Q25.00).',
      'Validar, congelar el formulario y pagar la boleta SAT-2000 en banca en línea o ventanilla bancaria.',
      'Agendar cita previa en la agencia tributaria SAT de su preferencia para la adhesión física del timbre o habilitación con sticker de seguridad y código QR.',
      'Presentar el título universitario original, DPI y comprobante de pago.',
      'El analista de SAT colocará el sticker de seguridad oficial con código QR y estampará el sello de registro en el reverso del título.',
      'Una vez habilitado el título, el profesional queda facultado para actualizar su RTU a régimen afecto (Servicios Profesionales) y activar la emisión de facturas FEL.'
    ],
    notasImportantes: [
      'Prerrequisito obligatorio de habilitación: Ningún graduado universitario puede emitir facturas por servicios profesionales ni colegiarse legalmente sin que su título cuente con el impuesto de timbres fiscales y el registro de la SAT.',
      'Tarifas por ley: Títulos universitarios de licenciatura, maestría o doctorado tributan Q100.00; títulos técnicos universitarios tributan Q25.00 según el Art. 5 num. 3 del Decreto 37-92.',
      'Verificación digital QR: La SAT incorpora un código QR seguro impreso en el sticker del título que permite a empleadores, clientes y entidades públicas verificar la autenticidad del registro en línea.'
    ]
  },

  // Contribuyentes -> Pequeños Contribuyentes (Grupo 2)
  {
    id: 'con-peq-1',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Pequeños Contribuyentes',
    subcategoria: 'Pequeño Contribuyente',
    grupoNo: 2,
    tramite: 'Inscripción al Régimen de Pequeño Contribuyente (5%)',
    url: 'https://portal.sat.gob.gt/portal/pequeno-contribuyente/',
    formulario: 'Agencia Virtual SAT / Módulo RTU Digital',
    baseLegal: 'Artículos 45 al 50 de la Ley del IVA, Decreto 27-92 del Congreso de la República.',
    descripcion: 'Inscripción y facturación electrónica bajo el régimen simplificado del 5% del IVA mensual.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de inscripción' },
      { id: 'pasos', titulo: 'Pasos para afiliarse' },
      { id: 'formulario', titulo: 'Formulario y facturación FEL' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Tener NIT activo y ratificado en el RTU.',
      'No superar el límite de facturación anual de Q150,000.00.',
      'Contar con usuario en Agencia Virtual y firma electrónica para emisión de FEL.'
    ],
    pasos: [
      'Ingresar a la Agencia Virtual en RTU > Actualización de Datos.',
      'Seleccionar el Régimen de Pequeño Contribuyente 5% mensual.',
      'Habilitar la emisión gratuita de Facturas Electrónicas en Línea (FEL).'
    ]
  },
  {
    id: 'con-peq-2',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Pequeños Contribuyentes',
    subcategoria: 'Primario',
    grupoNo: 2,
    tramite: 'Inscripción al Régimen Especial Agropecuario Productor Primario',
    url: 'https://portal.sat.gob.gt/portal/regimen-especial-contribuyente-agropecuario/',
    formulario: 'Declaraguate / Agencia Virtual SAT',
    baseLegal: 'Decreto 7-2019, Ley de Simplificación, Actualización e Incorporación Tributaria.',
    descripcion: 'Régimen especial para productores agropecuarios primarios con tarifa reducida sobre ventas brutas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos del sector primario' },
      { id: 'pasos', titulo: 'Pasos de registro' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Dedicarse exclusivamente a la producción y comercialización de productos agrícolas primarios sin proceso industrial.',
      'Monto máximo de ventas anuales de hasta 3 millones de quetzales.'
    ],
    pasos: [
      'Ingresar a Agencia Virtual y registrar la actividad agropecuaria primaria en el RTU.',
      'Solicitar la afiliación al Régimen Especial Agropecuario Primario.'
    ]
  },
  {
    id: 'con-peq-3',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Pequeños Contribuyentes',
    subcategoria: 'Pecuario',
    grupoNo: 2,
    tramite: 'Inscripción al Régimen Especial Pecuario',
    url: 'https://portal.sat.gob.gt/portal/regimen-especial-contribuyente-agropecuario/',
    formulario: 'Agencia Virtual SAT / Módulo RTU',
    baseLegal: 'Decreto 7-2019, Ley de Régimen Especial Agropecuario Pecuario.',
    descripcion: 'Régimen tributario para comercialización de ganado bovino, porcino, caprino y aves de corral.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos del sector pecuario' },
      { id: 'pasos', titulo: 'Pasos de registro' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Registro sanitario o acreditación del Ministerio de Agricultura, Ganadería y Alimentación (MAGA).',
      'Facturación dentro de los techos anuales fijados en la ley.'
    ],
    pasos: [
      'Ingresar al RTU Digital y registrar la actividad pecuaria.',
      'Activar el régimen y habilitar facturación electrónica pecuaria.'
    ]
  },

  // Contribuyentes -> Contribuyente General (Grupo 3)
  {
    id: 'con-gen-1',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Contribuyente General',
    subcategoria: 'Contribuyente General',
    grupoNo: 3,
    tramite: 'Afiliación al Régimen General del IVA e ISR',
    url: 'https://portal.sat.gob.gt/portal/afiliacion-al-regimen-general/',
    formulario: 'Declaraguate SAT-2000 / RTU Digital',
    baseLegal: 'Decreto 27-92 (Ley del IVA) y Decreto 10-2012 (Ley de Actualización Tributaria).',
    descripcion: 'Inscripción al régimen ordinario de IVA 12% con opción de ISR Sobre Utilidades (25%) o Simplificado (5% y 7%).',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de afiliación' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Inscripción de negocio o sociedad mercantil en el Registro Mercantil.',
      'Contar con Perito Contador o Auditor asignado en el RTU.'
    ],
    pasos: [
      'Ingresar a la Agencia Virtual e iniciar la actualización de regímenes.',
      'Seleccionar el régimen de ISR (Sobre Utilidades o Opcional Simplificado) e IVA General.'
    ]
  },
  {
    id: 'con-gen-2',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Contribuyente General',
    subcategoria: 'Rep. Legales',
    grupoNo: 3,
    tramite: 'Inscripción y Acreditación de Representante Legal',
    url: 'https://portal.sat.gob.gt/portal/representante-legal/',
    formulario: 'Agencia Virtual SAT / Módulo RTU',
    baseLegal: 'Código de Comercio de Guatemala y Código Tributario.',
    descripcion: 'Registro, actualización o revocación de nombramiento o mandato de representación legal ante la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos legales' },
      { id: 'pasos', titulo: 'Pasos de acreditación' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Acta notarial de nombramiento debidamente inscrita en el Registro Mercantil o Poder Notarial con razón del Archivo General de Protocolos.',
      'DPI vigente del representante legal y RTU ratificado.'
    ],
    pasos: [
      'Cargar el documento de representación en la Agencia Virtual.',
      'Validar los datos biométricos en línea o confirmar en agencia tributaria.'
    ]
  },

  // Contribuyentes -> Contribuyentes Especiales (Grupo 4)
  {
    id: 'con-esp-1',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Contribuyentes Especiales',
    subcategoria: 'Medianos',
    grupoNo: 4,
    tramite: 'Calificación de Mediano Contribuyente Especial',
    url: 'https://portal.sat.gob.gt/portal/gerencia-contribuyentes-especiales/',
    formulario: 'Resolución Administrativa de Notificación SAT',
    baseLegal: 'Ley Orgánica de la SAT y normativas de la Gerencia de Contribuyentes Especiales.',
    descripcion: 'Consulta y gestión de notificaciones de calificación como Mediano Contribuyente Especial de la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Criterios de calificación' },
      { id: 'pasos', titulo: 'Obligaciones del régimen' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Haber sido notificado por la resolución de la Superintendencia con base en volumen de ingresos brutos y recaudación fiscal.'
    ],
    pasos: [
      'Acceder a la Agencia Virtual en el buzón electrónico tributario.',
      'Confirmar la recepción de la cédula de notificación y asignar canales exclusivos de atención.'
    ]
  },
  {
    id: 'con-esp-2',
    pillar: 'contribuyentes',
    pillarName: 'Contribuyentes',
    categoria: 'Contribuyentes Especiales',
    subcategoria: 'Grandes',
    grupoNo: 4,
    tramite: 'Gestión ante Gerencia de Grandes Contribuyentes Especiales',
    url: 'https://portal.sat.gob.gt/portal/grandes-contribuyentes-especiales/',
    formulario: 'Buzón Tributario / Módulo Especiales',
    baseLegal: 'Disposiciones del Directorio de la SAT para Grandes Contribuyentes.',
    descripcion: 'Canal especializado de atención, auditorías electrónicas y precios de transferencia para Grandes Contribuyentes Especiales.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de gestión' },
      { id: 'pasos', titulo: 'Procedimiento de atención' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Calificación formal por la SAT como Gran Contribuyente Especial.',
      'Presentación obligatoria de anexos tributarios y estudios de precios de transferencia.'
    ],
    pasos: [
      'Ingresar al portal de la Gerencia de Grandes Contribuyentes.',
      'Coordinar gestiones mediante ejecutivo de cuenta asignado por la SAT.'
    ]
  },

  // Operadores de Comercio Exterior -> Importadores y Exportadores (Grupo 5)
  {
    id: 'com-imp-1',
    pillar: 'comercio_exterior',
    pillarName: 'Operadores de Comercio Exterior',
    categoria: 'Importadores y Exportadores',
    subcategoria: 'Importadores',
    grupoNo: 5,
    tramite: 'Inscripción en el Padrón de Importadores SAT',
    url: 'https://portal.sat.gob.gt/portal/requisitos-para-inscribirse-en-el-padron-de-importadores/',
    formulario: 'Agencia Virtual SAT / Módulo Aduanas',
    baseLegal: 'Código Aduanero Uniforme Centroamericano (CAUCA) y su Reglamento (RECAUCA).',
    descripcion: 'Habilitación electrónica en el padrón oficial de importadores para desaduanaje de mercancías en puertos y aduanas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de inscripción' },
      { id: 'pasos', titulo: 'Pasos de habilitación' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Estar inscrito y activo en el RTU con obligaciones afectas (Régimen General o Pequeño Contribuyente según el tipo de importación).',
      'No tener omisos de impuestos ni adeudos firmes con la SAT.',
      'Contar con usuario y contraseña activa en Agencia Virtual.'
    ],
    pasos: [
      'Ingresar a Agencia Virtual en Servicios > Aduanas > Padrón de Importadores.',
      'Solicitar la activación del estatus de importador.',
      'Aceptar los términos y recibir la confirmación electrónica inmediata.'
    ]
  },
  {
    id: 'com-oea-1',
    pillar: 'comercio_exterior',
    pillarName: 'Operadores de Comercio Exterior',
    categoria: 'Importadores y Exportadores',
    subcategoria: 'OEA',
    grupoNo: 5,
    tramite: 'Habilitarse como Operador Económico Autorizado (OEA)',
    url: 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
    formulario: 'Solicitud OEA Guatemala / Declaraguate',
    baseLegal: 'Marco Normativo SAFE de la Organización Mundial de Aduanas (OMA) y Acuerdos de Directorio SAT.',
    descripcion: 'Certificación voluntaria y gratuita de confiabilidad y seguridad en la cadena de suministro internacional para obtener beneficios aduaneros.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Criterios de elegibilidad' },
      { id: 'pasos', titulo: 'Fases de validación y certificación' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Historial de cumplimiento aduanero y tributario intachable en los últimos 3 años.',
      'Viabilidad financiera comprobada mediante estados financieros auditados.',
      'Sistema adecuado de gestión de registros comerciales y seguridad física en instalaciones.'
    ],
    pasos: [
      'Presentar la solicitud de autoevaluación OEA ante la Intendencia de Aduanas.',
      'Recibir la visita de auditoría y validación física de seguridad por auditores aduaneros.',
      'Obtener la resolución y certificado oficial OEA con beneficios de despacho ágil y canales prioritarios.'
    ]
  },
  {
    id: 'com-exp-1',
    pillar: 'comercio_exterior',
    pillarName: 'Operadores de Comercio Exterior',
    categoria: 'Importadores y Exportadores',
    subcategoria: 'Exportadores',
    grupoNo: 5,
    tramite: 'Inscripción y Registro en el Padrón de Exportadores',
    url: 'https://portal.sat.gob.gt/portal/exportadores/',
    formulario: 'Agencia Virtual SAT / Ventanilla Única de Exportación (VUPE)',
    baseLegal: 'Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila, Decreto 29-89.',
    descripcion: 'Inscripción en el padrón de exportadores para gozar de exención de aranceles de exportación y derecho a devolución de crédito fiscal.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de exportador' },
      { id: 'pasos', titulo: 'Pasos de registro' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Código de exportador emitido por la Ventanilla Única de Exportaciones (VUPE).',
      'Estar afiliado al Régimen General del IVA con RTU ratificado.'
    ],
    pasos: [
      'Gestionar el código de exportador en la VUPE (AGEXPORT).',
      'Vincular el código en la Agencia Virtual de la SAT en Servicios Aduaneros.'
    ]
  },

  // Operadores de Comercio Exterior -> Auxiliares de la Función Pública (Grupo 8)
  {
    id: 'com-aux-courier',
    pillar: 'comercio_exterior',
    pillarName: 'Operadores de Comercio Exterior',
    categoria: 'Auxiliares de la Función Pública',
    subcategoria: 'Courier',
    grupoNo: 8,
    tramite: 'Inscripción de Empresas de Entrega Rápida o Courier',
    url: 'https://portal.sat.gob.gt/portal/courier/',
    formulario: 'Solicitud de Auxiliar de la Función Pública Aduanera',
    baseLegal: 'Artículos 18 al 21 del Código Aduanero Uniforme Centroamericano (CAUCA).',
    descripcion: 'Autorización y registro de empresas de transporte urgente y paquetería rápida internacional bajo control aduanero.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de la empresa' },
      { id: 'pasos', titulo: 'Proceso de habilitación' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Constitución legal de sociedad mercantil con objeto de transporte expreso internacional.',
      'Constitución de fianza de cumplimiento a favor de la SAT por el monto regulado en ley.',
      'Disponer de infraestructura tecnológica conectada a los sistemas de la SAT.'
    ],
    pasos: [
      'Presentar la solicitud ante la Intendencia de Aduanas.',
      'Acreditar la póliza de fianza y realizar pruebas de transmisión de manifiestos electrónicos.',
      'Recibir la resolución de autorización e inicio de operaciones.'
    ]
  },
  {
    id: 'com-aux-agente',
    pillar: 'comercio_exterior',
    pillarName: 'Operadores de Comercio Exterior',
    categoria: 'Auxiliares de la Función Pública',
    subcategoria: 'Agentes Aduaneros',
    grupoNo: 8,
    tramite: 'Autorización y Habilitación de Agente Aduanero',
    url: 'https://portal.sat.gob.gt/portal/agente-aduanero/',
    formulario: 'Expediente de Calificación Profesional de Agente Aduanero',
    baseLegal: 'Artículos 22 al 28 del CAUCA y Reglamento RECAUCA.',
    descripcion: 'Habilitación profesional para ejercer como Agente Aduanero autorizado para tramitar despachos de importación y exportación.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos profesionales' },
      { id: 'pasos', titulo: 'Proceso de examen y fianza' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Aprobar el examen de suficiencia aduanera convocado por la SAT.',
      'Constituir fianza de responsabilidad profesional ante la administración tributaria.',
      'RTU actualizado sin omisos y colegiatura profesional si aplica.'
    ],
    pasos: [
      'Inscribirse a la convocatoria de examen de Agentes Aduaneros.',
      'Presentar la documentación de soporte y constituir la garantía aduanera.',
      'Recibir el carné y credenciales de acceso al sistema informático aduanero.'
    ]
  },

  // Profesionales -> Terceras Personas (Grupo 7)
  {
    id: 'prof-6',
    pillar: 'profesionales',
    pillarName: 'Profesionales',
    categoria: 'Terceras Personas',
    subcategoria: 'Abogados y Notarios',
    grupoNo: 7,
    tramite: 'Comprar Especies Fiscales',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/venta-de-especies-fiscales-a-notarios-y-patentados/',
    formulario: 'Declaraguate SAT-7130 (Impuesto de Timbres Fiscales y Papel Sellado Especial para Protocolos)',
    baseLegal: 'Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto Número 37-92 del Congreso de la República y su Reglamento.',
    descripcion: 'Adquirir timbres fiscales y hojas de Papel Sellado Especial para Protocolos para el ejercicio notarial o como persona autorizada con patente de venta.',
    puntosMenu: [
      { id: 'requisitos-notario', titulo: 'Cumplir requisitos como Notario Titular' },
      { id: 'requisitos-tercero', titulo: 'Acreditar a un Tercero Autorizado' },
      { id: 'requisitos-patentados', titulo: 'Cumplir requisitos como Patentado' },
      { id: 'pasos', titulo: 'Seguir los pasos del trámite' },
      { id: 'formulario', titulo: 'Llenar formulario Declaraguate SAT-7130' },
      { id: 'notas', titulo: 'Revisar tarifas y notas importantes' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'agencias', titulo: 'Retirar especies en agencias SAT' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitosPorModalidad: [
      {
        modalidad: 'Notario Titular',
        requisitos: [
          'Estar activo y solvente en el Colegio de Abogados y Notarios de Guatemala (CANG). La SAT valida la habilitación en línea en tiempo real.',
          'Contar con datos actualizados y ratificados en el Registro Tributario Unificado (RTU) digital en el año en curso.',
          'Tener activa la característica tributaria especial de Abogado y Notario en el RTU.',
          'Generar y pagar previamente el formulario Declaraguate SAT-7130.',
          'Presentar Documento Personal de Identificación (DPI) en original vigente y carné de colegiado activo para atención presencial.',
          'Presentar sello profesional de Abogado y Notario para firmar y sellar la constancia de entrega en la agencia.'
        ]
      },
      {
        modalidad: 'Tercero Autorizado (Delegado / Procurador)',
        requisitos: [
          'Presentar carta de autorización en original firmada y sellada por el Notario titular, indicando expresamente la cantidad de hojas de protocolo o timbres, formulario SAT-2000 y DPI de la persona delegada.',
          'Adjuntar fotocopia legible del DPI y carné de colegiado activo del Notario titular, debidamente firmadas.',
          'Presentar Documento Personal de Identificación (DPI) en original y fotocopia de la persona autorizada (procurador o gestor) que retira las especies.',
          'Presentar boleta de pago del formulario Declaraguate SAT-7130 cancelada en el sistema bancario.',
          'Verificar que el Notario titular se encuentre activo en el CANG y con su RTU ratificado.'
        ]
      },
      {
        modalidad: 'Patentados Autorizados',
        requisitos: [
          'Contar con patente vigente para el expendio y venta de especies fiscales emitida por la SAT.',
          'Mantener inscripción y RTU activo con régimen tributario al día.',
          'Generar y pagar el formulario Declaraguate SAT-7130 con el porcentaje de comisión legal autorizado.',
          'Presentar DPI original del titular o representante legal acreditado en la SAT.'
        ]
      }
    ],
    pasos: [
      'Ingresar al portal oficial Declaraguate (declaraguate.sat.gob.gt).',
      'Seleccionar el formulario SAT-7130 (Impuesto de Timbres Fiscales y Papel Sellado Especial para Protocolos) en la sección de Impuestos Específicos.',
      'Completar los datos del Notario o Patentado, la cantidad requerida de hojas de papel de protocolo (lotes de 50 hojas) y los valores faciales de timbres fiscales.',
      'Congelar el formulario e imprimir la boleta SAT-2000.',
      'Realizar el pago en banca en línea o en ventanilla de cualquier banco del sistema financiero.',
      'Presentarse en cualquier Oficina o Agencia Tributaria de la SAT para la validación biométrica, asignación de números correlativos oficiales y entrega de las especies.'
    ],
    notasImportantes: [
      'El Papel Sellado Especial para Protocolos tiene una tarifa oficial de Q10.00 por hoja y se adquiere en lotes de 50 hojas (el libro de protocolo de 55 hojas incluye las 5 hojas de comisión legal).',
      'La SAT emite automáticamente la razón electrónica de asignación de correlativos de quinquenio asignados al protocolo notarial.',
      'Si el profesional se encuentra inhabilitado por el CANG o no ha ratificado su RTU anual, el sistema Declaraguate bloqueará la emisión del formulario SAT-7130.',
      'Los timbres fiscales se emiten en pliegos de distintas denominaciones según la necesidad de los instrumentos públicos notariales.'
    ]
  },
  {
    id: 'prof-1',
    pillar: 'profesionales',
    pillarName: 'Profesionales',
    categoria: 'Terceras Personas',
    subcategoria: 'Abogados y Notarios',
    grupoNo: 7,
    tramite: 'Activar Calidad de Abogado y Notario en Agencia Virtual',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/activacion-de-abogados/',
    formulario: 'Agencia Virtual SAT / Módulo RTU',
    baseLegal: 'Código de Notariado, Decreto 314 y Ley Orgánica de la SAT.',
    descripcion: 'Activar la calidad de profesional del derecho en la Agencia Virtual de la SAT para realizar traspasos electrónicos de vehículos y gestiones notariales digitales.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de activación' },
      { id: 'formulario', titulo: 'Ingresar a Agencia Virtual SAT' },
      { id: 'base-legal', titulo: 'Consultar base legal' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: [
      'Estar activo y colegiado en el Colegio de Abogados y Notarios de Guatemala (CANG).',
      'Estar inscrito en el RTU de la SAT con las obligaciones tributarias al día (IVA, ISR).',
      'Poseer usuario y contraseña activa en Agencia Virtual SAT.',
      'Haber registrado la impresión dactilar (biométrico) en agencias u oficinas tributarias.'
    ],
    pasos: [
      'Iniciar sesión en la cuenta de Agencia Virtual SAT.',
      'Ingresar al menú de Servicios / Registro Tributario Unificado (RTU).',
      'Seleccionar la opción de Actualización o Activación de Calidad de Abogado y Notario.',
      'Ingresar el número de colegiado activo y adjuntar la documentación solicitada.',
      'Confirmar la solicitud para recibir la aprobación y habilitación en el sistema FEL y traspasos electrónicos.'
    ]
  },
  {
    id: 'prof-gestores',
    pillar: 'profesionales',
    pillarName: 'Profesionales',
    categoria: 'Terceras Personas',
    subcategoria: 'Gestores Tributarios',
    grupoNo: 7,
    tramite: 'Acreditación y Renovación de Gafete de Gestor Tributario',
    url: 'https://portal.sat.gob.gt/portal/gestores-tributarios/',
    formulario: 'Solicitud de Gestor Tributario SAT',
    baseLegal: 'Acuerdos de Directorio de la SAT sobre acreditación de gestores tributarios.',
    descripcion: 'Obtención, reposición o renovación del gafete oficial para comparecer ante agencias tributarias en representación de terceros.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de acreditación' },
      { id: 'pasos', titulo: 'Pasos para tramitar el gafete' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Constancia vigente de carencia de antecedentes penales y policiales.',
      'DPI vigente del solicitante y RTU actualizado.',
      'Aprobar el curso de inducción y capacitación tributaria impartido por el CENADOJ/SAT.'
    ],
    pasos: [
      'Ingresar al sistema de solicitud de gestores en el portal SAT.',
      'Adjuntar las constancias de antecedentes y fotografía formal tamaño cédula.',
      'Acudir a la cita para toma fotográfica digital y entrega del gafete con chip de seguridad.'
    ]
  },
  {
    id: 'prof-peritos',
    pillar: 'profesionales',
    pillarName: 'Profesionales',
    categoria: 'Terceras Personas',
    subcategoria: 'Peritos Contadores',
    grupoNo: 7,
    tramite: 'Inscripción y Ratificación de Perito Contador en el RTU',
    url: 'https://portal.sat.gob.gt/portal/peritos-contadores/',
    formulario: 'Agencia Virtual SAT / Módulo Contadores',
    baseLegal: 'Decreto 2450 del Congreso de la República, Normas de la Profesión Contable.',
    descripcion: 'Registro, actualización anual y firma electrónica para actuar como Perito Contador de personas individuales y jurídicas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de inscripción' },
      { id: 'pasos', titulo: 'Pasos de habilitación' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Título oficial de Perito Contador avalado por el Ministerio de Educación.',
      'Constancia de antecedentes penales y policiales vigentes.',
      'RTU ratificado y usuario de Agencia Virtual.'
    ],
    pasos: [
      'Ingresar a Agencia Virtual y seleccionar Servicios > Registro de Contadores.',
      'Adjuntar el título escaneado por ambos lados y antecedentes.',
      'Validar el estatus para habilitar la vinculación contable con contribuyentes.'
    ]
  },
  {
    id: 'prof-auditores',
    pillar: 'profesionales',
    pillarName: 'Profesionales',
    categoria: 'Terceras Personas',
    subcategoria: 'Auditores',
    grupoNo: 7,
    tramite: 'Habilitación de Contador Público y Auditor en Agencia Virtual',
    url: 'https://portal.sat.gob.gt/portal/auditores/',
    formulario: 'Módulo de Auditores SAT / Agencia Virtual',
    baseLegal: 'Ley de Colegiación Profesional Obligatoria, Decreto 72-2001.',
    descripcion: 'Habilitación de CPA colegiado activo para emisión de dictámenes fiscales, informes de auditoría y precios de transferencia.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de auditor' },
      { id: 'pasos', titulo: 'Pasos de registro' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Constancia vigente de colegiado activo emitida por el Colegio de Contadores Públicos y Auditores (CPA) o Colegio de Economistas.',
      'Firma electrónica avanzada activa.',
      'RTU actualizado sin omisos de impuestos.'
    ],
    pasos: [
      'Acceder a Agencia Virtual e ingresar los datos del número de colegiado activo.',
      'Validar la conexión en tiempo real con el padrón del colegio profesional.',
      'Habilitar el rol de auditor para carga de dictámenes fiscales electrónicos.'
    ]
  },

  // Entes Exentos -> Exentos (Grupo 6)
  {
    id: 'exe-const',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Exentos',
    subcategoria: 'Constitucionales',
    grupoNo: 6,
    tramite: 'Emisión de Constancia de Exención Tributaria Constitucional',
    url: 'https://portal.sat.gob.gt/portal/exenciones-constitucionales/',
    formulario: 'Agencia Virtual SAT / Solicitud de Constancia de Exención',
    baseLegal: 'Artículos 73, 88, 92 y 100 de la Constitución Política de la República de Guatemala.',
    descripcion: 'Reconocimiento y constancia oficial de exención tributaria para centros educativos, universidades y entidades amparadas en la Constitución.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos constitucionales' },
      { id: 'pasos', titulo: 'Pasos de emisión' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Estatutos o acuerdo de creación ministerial que acredite fines estrictamente educativos, culturales o universitarios.',
      'RTU actualizado de la entidad con nombramiento de representante legal vigente.'
    ],
    pasos: [
      'Ingresar al portal de la SAT en Servicios de Exenciones.',
      'Cargar la resolución de reconocimiento institucional.',
      'Descargar la Constancia Electrónica de Exención con código QR de verificación.'
    ]
  },
  {
    id: 'exe-nolucr',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Exentos',
    subcategoria: 'No Lucrativos',
    grupoNo: 6,
    tramite: 'Inscripción de Entidades No Lucrativas y Exención de ISR',
    url: 'https://portal.sat.gob.gt/portal/asociaciones-y-fundaciones-exentas/',
    formulario: 'Agencia Virtual / Expediente de Exención No Lucrativa',
    baseLegal: 'Artículo 8 de la Ley de Actualización Tributaria, Libro I del ISR, Decreto 10-2012.',
    descripcion: 'Solicitud del reconocimiento formal de exención de Impuesto Sobre la Renta para asociaciones, fundaciones y ONGs sin fines de lucro.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de la entidad' },
      { id: 'pasos', titulo: 'Procedimiento de resolución' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Escritura constitutiva y estatutos debidamente inscritos en el Registro de Personas Jurídicas (REPEJU).',
      'Cláusula expresa en estatutos que establezca que el patrimonio y rentas no se distribuirán entre los asociados en ningún caso.',
      'Libros contables autorizados al día.'
    ],
    pasos: [
      'Presentar la solicitud de exención a través de la Agencia Virtual o gerencia regional.',
      'Adjuntar la personería jurídica y balance general de apertura.',
      'Recibir la resolución formal de exención y constancia anual de no retención.'
    ]
  },
  {
    id: 'exe-zolic',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Exentos',
    subcategoria: 'ZOLIC',
    grupoNo: 6,
    tramite: 'Registro de Beneficiario Usuario en ZOLIC',
    url: 'https://portal.sat.gob.gt/portal/zolic/',
    formulario: 'Registro de Usuario ZOLIC / Módulo Aduanas',
    baseLegal: 'Decreto 22-73 del Congreso de la República, Ley Orgánica de ZOLIC.',
    descripcion: 'Inscripción y gestión de exenciones arancelarias e impositivas para usuarios autorizados en la Zona Libre de Industria y Comercio "Santo Tomás de Castilla".',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de usuario ZOLIC' },
      { id: 'pasos', titulo: 'Pasos de registro' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Contrato de arrendamiento o uso de instalaciones suscrito con la administración de ZOLIC.',
      'Resolución de calificación favorable emitida por la Junta Directiva de ZOLIC.',
      'RTU ratificado en régimen fiscal especial.'
    ],
    pasos: [
      'Presentar el contrato de ZOLIC ante la Intendencia de Aduanas y Recaudación de la SAT.',
      'Registrar la cuenta corriente aduanera para gozar de las exenciones de importación.'
    ]
  },
  {
    id: 'exe-muni',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Exentos',
    subcategoria: 'Municipalidades',
    grupoNo: 6,
    tramite: 'Gestión y Certificación de Exención para Municipalidades',
    url: 'https://portal.sat.gob.gt/portal/municipalidades-exentas/',
    formulario: 'Módulo Institucional / Constancias Municipales',
    baseLegal: 'Artículo 257 de la Constitución y Código Municipal, Decreto 12-2002.',
    descripcion: 'Emisión de constancias de exención tributaria y compras exentas para corporaciones municipales y sus empresas públicas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos municipales' },
      { id: 'pasos', titulo: 'Pasos de gestión' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Credencial vigente del Alcalde Municipal emitida por el Tribunal Supremo Electoral (TSE).',
      'Acta de toma de posesión del Concejo Municipal.',
      'NIT institucional de la municipalidad activo.'
    ],
    pasos: [
      'Ingresar al portal de atención a entidades públicas de la SAT.',
      'Actualizar la junta del concejo municipal y descargar la constancia de compras exentas.'
    ]
  },

  // Entes Exentos -> Entidades del Estado (Grupo 9)
  {
    id: 'est-oj',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Entidades del Estado',
    subcategoria: 'Organismo Judicial',
    grupoNo: 9,
    tramite: 'Trámites Institucionales y Retenciones del Organismo Judicial',
    url: 'https://portal.sat.gob.gt/portal/organismo-judicial/',
    formulario: 'Agencia Virtual Sector Público / RetenISR',
    baseLegal: 'Ley del Organismo Judicial y Ley Orgánica del Presupuesto.',
    descripcion: 'Gestión de retenciones impositivas, constancias de exención institucional y operaciones tributarias del Organismo Judicial.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos de dependencia' },
      { id: 'pasos', titulo: 'Pasos de gestión' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Acreditación de la Gerencia Financiera del Organismo Judicial.',
      'Uso de firma electrónica institucional autorizada.'
    ],
    pasos: [
      'Ingresar a la plataforma de entidades públicas de la SAT con credenciales institucionales.',
      'Emitir constancias de retención de IVA e ISR para proveedores del Estado.'
    ]
  },
  {
    id: 'est-mp',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Entidades del Estado',
    subcategoria: 'Ministerio Público',
    grupoNo: 9,
    tramite: 'Gestión Tributaria y Constancias del Ministerio Público',
    url: 'https://portal.sat.gob.gt/portal/ministerio-publico/',
    formulario: 'Portal Sector Público SAT',
    baseLegal: 'Ley Orgánica del Ministerio Público, Decreto 51-92.',
    descripcion: 'Gestión tributaria, retenciones a proveedores del sector público y constancias institucionales del Ministerio Público.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos' },
      { id: 'pasos', titulo: 'Procedimiento' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Acreditación de la Dirección de Administración Financiera del MP.'
    ],
    pasos: [
      'Acceder al módulo de sector público en la SAT y gestionar constancias oficiales.'
    ]
  },
  {
    id: 'est-senabed',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Entidades del Estado',
    subcategoria: 'SENABED / CONABED',
    grupoNo: 9,
    tramite: 'Gestión Fiscal de Bienes en Extinción de Dominio (SENABED)',
    url: 'https://portal.sat.gob.gt/portal/senabed/',
    formulario: 'Expediente Especial de Bienes Extinguidos SAT',
    baseLegal: 'Ley de Extinción de Dominio, Decreto 55-2010 del Congreso de la República.',
    descripcion: 'Trámites de traspaso, saneamiento tributario y exención de vehículos, inmuebles y bienes administrados por la SENABED.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos legales' },
      { id: 'pasos', titulo: 'Pasos de saneamiento' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Resolución judicial firme de extinción de dominio a favor del Estado.',
      'Oficio de solicitud suscrito por el Secretario General de la SENABED.'
    ],
    pasos: [
      'Ingresar el expediente de saneamiento de bienes extinguidos en la ventanilla especial de la SAT.',
      'Efectuar la exoneración de multas e intereses conforme a la ley y emitir nuevos distintivos a nombre del Estado.'
    ]
  },
  {
    id: 'est-pdh',
    pillar: 'entes_exentos',
    pillarName: 'Entes Exentos',
    categoria: 'Entidades del Estado',
    subcategoria: 'PDH',
    grupoNo: 9,
    tramite: 'Gestión Institucional de la Procuraduría de los Derechos Humanos',
    url: 'https://portal.sat.gob.gt/portal/pdh/',
    formulario: 'Módulo Sector Público SAT',
    baseLegal: 'Ley de la Comisión de Derechos Humanos del Congreso y del Procurador de los Derechos Humanos, Decreto 54-86.',
    descripcion: 'Gestión de retenciones, solvencias y administración tributaria institucional para la Procuraduría de los Derechos Humanos.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos institucionales' },
      { id: 'pasos', titulo: 'Procedimiento' },
      { id: 'enlace', titulo: 'Ir al portal oficial SAT' }
    ],
    requisitos: [
      'Acreditación oficial del Procurador de los Derechos Humanos y su director financiero.'
    ],
    pasos: [
      'Acceder a la plataforma de entidades descentralizadas y generar constancias de retención.'
    ]
  }
];
