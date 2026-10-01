import React, { useState } from 'react';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

type PillarType = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface TramiteItem {
  id: string;
  pillar: PillarType;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tramite: string;
  url: string;
  descripcion: string;
  baseLegal?: string;
  formulario?: string;
  requisitosPorModalidad?: {
    modalidad: string;
    requisitos: string[];
  }[];
  requisitos?: string[];
  pasos?: string[];
  notasImportantes?: string[];
  puntosMenu?: {
    id: string;
    titulo: string;
  }[];
}

const TRAMITES_DATA: TramiteItem[] = [
  // 3. Profesionales -> Notarios y Abogados -> Especies Fiscales (Gestiones oficiales)
  {
    id: 'prof-6',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Venta de Especies Fiscales a Notarios y Patentados',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/venta-de-especies-fiscales-a-notarios-y-patentados/',
    formulario: 'Declaraguate SAT-7130 (Impuesto de Timbres Fiscales y Papel Sellado Especial para Protocolos)',
    baseLegal: 'Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto Número 37-92 del Congreso de la República y su Reglamento.',
    descripcion: 'Adquirir timbres fiscales y hojas de Papel Sellado Especial para Protocolos para el ejercicio notarial o como persona autorizada con patente de venta.',
    puntosMenu: [
      { id: 'requisitos-notario', titulo: 'Notario Titular (Requisitos)' },
      { id: 'requisitos-tercero', titulo: 'Tercero Autorizado (Requisitos)' },
      { id: 'requisitos-patentados', titulo: 'Patentados (Requisitos)' },
      { id: 'pasos', titulo: 'Procedimiento y pasos' },
      { id: 'formulario', titulo: 'Formulario Declaraguate SAT-7130' },
      { id: 'notas', titulo: 'Tarifas y notas importantes' },
      { id: 'base-legal', titulo: 'Base legal y normativa' },
      { id: 'agencias', titulo: 'Retiro en Agencias SAT' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
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
    id: 'prof-6b',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Pago de Timbres Fiscales en Tarifas Específicas vía Electrónica',
    url: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    formulario: 'Declaraguate SAT-7121 / Razón Electrónica en Agencia Virtual',
    baseLegal: 'Artículo 5 de la Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto 37-92.',
    descripcion: 'Realizar el pago del impuesto de timbres fiscales en tarifas específicas mediante razón electrónica en la Agencia Virtual, sin adherir estampillas físicas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Procedimiento y pasos' },
      { id: 'formulario', titulo: 'Formulario oficial SAT' },
      { id: 'notas', titulo: 'Tarifas y notas importantes' },
      { id: 'base-legal', titulo: 'Base legal y normativa' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Contar con usuario activo y contraseña en Agencia Virtual SAT.',
      'Mantener el RTU actualizado y ratificado en el año en curso.',
      'Contar con cuenta bancaria habilitada para banca en línea o generar boleta SAT-2000.',
      'Identificar el acto, contrato o documento afecto a la tarifa específica del impuesto.'
    ],
    pasos: [
      'Ingresar a la Agencia Virtual de la SAT con NIT y contraseña.',
      'Acceder a la sección de Servicios Tributarios > Pago de Timbres Fiscales Tarifas Específicas.',
      'Seleccionar el tipo de documento (actas notariales, contratos de arrendamiento, testimonios, etc.).',
      'Generar la razón electrónica de pago e ingresar los datos del acto o contrato.',
      'Efectuar el pago electrónico y descargar la constancia con código QR de verificación para adjuntar al documento.'
    ],
    notasImportantes: [
      'La razón electrónica de pago sustituye legalmente la adherencia de timbres físicos según las disposiciones de la SAT.',
      'El código QR permite a cualquier entidad o registro público validar la autenticidad e inmediatez del pago tributario.'
    ]
  },
  {
    id: 'prof-6c',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Inscripción y Autorización de Nuevos Patentados para Expendio',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Solicitud de Patente de Especies Fiscales SAT',
    baseLegal: 'Reglamento de la Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos.',
    descripcion: 'Solicitar la patente oficial ante la SAT para personas individuales o jurídicas que deseen dedicarse al expendio y comercialización de timbres fiscales.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Procedimiento y pasos' },
      { id: 'notas', titulo: 'Comisiones y notas importantes' },
      { id: 'base-legal', titulo: 'Base legal y normativa' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Estar inscrito en el RTU y al día en el cumplimiento de obligaciones tributarias.',
      'Presentar DPI original y copia del solicitante o representante legal.',
      'Presentar constancia de carencia de antecedentes penales y policiales recientes.',
      'Presentar comprobante de domicilio del local o establecimiento donde se realizará la venta.'
    ],
    pasos: [
      'Presentar la solicitud de patente en cualquier Centro de Atención Tributaria.',
      'Aportar la documentación de soporte y suscribir el acta de compromiso de expendio.',
      'Recibir la resolución de autorización y el carné oficial de patentado de la SAT.'
    ],
    notasImportantes: [
      'Los patentados autorizados obtienen el porcentaje de comisión legal fijado en la Ley de Timbres Fiscales.',
      'El carné de patentado debe renovarse anualmente o ante cualquier cambio de local.'
    ]
  },
  {
    id: 'prof-6d',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Devolución o Canje de Especies Fiscales Deterioradas',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/venta-de-especies-fiscales-a-notarios-y-patentados/',
    formulario: 'Memorial de Canje y Devolución de Especies Fiscales',
    baseLegal: 'Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto 37-92.',
    descripcion: 'Gestionar el canje de hojas de Papel de Protocolo o timbres fiscales que presenten errores tipográficos, daño físico o deterioro no imputable.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Procedimiento y pasos' },
      { id: 'base-legal', titulo: 'Base legal y normativa' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Presentar las hojas de papel de protocolo o timbres físicos dañados en su totalidad.',
      'Presentar memorial firmado y sellado por el Notario o Patentado exponiendo el motivo del canje.',
      'Presentar Documento Personal de Identificación (DPI) y carné de colegiado activo.'
    ],
    pasos: [
      'Acudir al departamento de recaudación en oficinas tributarias regionales o metropolitanas.',
      'Entregar el memorial y las especies físicas objeto del canje para peritaje de autenticidad.',
      'Recibir la resolución y la entrega de las nuevas especies fiscales en reposición.'
    ]
  },

  // 3. Profesionales -> Notarios y Abogados -> Práctica Profesional y Registro
  {
    id: 'prof-1',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Activación de abogados',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/activacion-de-abogados/',
    formulario: 'Agencia Virtual SAT / Módulo RTU',
    baseLegal: 'Código de Notariado, Decreto 314 y Ley Orgánica de la SAT.',
    descripcion: 'Activar la calidad de profesional del derecho en la Agencia Virtual de la SAT para realizar traspasos electrónicos de vehículos y gestiones notariales digitales.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de activación' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
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
    id: 'prof-2a',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Inscripción de Abogado y Notario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Solicitud de Inscripción Profesional SAT',
    baseLegal: 'Decreto 1-98 del Congreso de la República, Ley Orgánica de la SAT.',
    descripcion: 'Registrar por primera vez la calidad profesional de Abogado y Notario en la base de datos oficial de la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de inscripción' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Presentar Documento Personal de Identificación (DPI) en original y copia legible.',
      'Presentar constancia vigente de colegiado activo emitida por el CANG.',
      'Presentar título profesional registrado ante la Contraloría General de Cuentas y USAC.'
    ],
    pasos: [
      'Presentar la solicitud inicial en oficinas tributarias o agencias virtuales habilitadas.',
      'Validar los datos profesionales con el operador de ventanilla.',
      'Recibir la confirmación de inscripción y constancia oficial.'
    ]
  },
  {
    id: 'prof-2b',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Actualización de Abogado y Notario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Actualización en Agencia Virtual',
    baseLegal: 'Código Tributario de Guatemala.',
    descripcion: 'Actualizar datos profesionales, dirección de notaría o estado colegiado ante la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de actualización' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Presentar constancia reciente de Colegiado Activo emitida por el CANG.',
      'Contar con usuario activo en Agencia Virtual SAT.',
      'Presentar DPI vigente del profesional.'
    ],
    pasos: [
      'Ingresar al módulo de actualización de profesionales en Agencia Virtual SAT.',
      'Cargar la constancia vigente de colegiado activo.',
      'Confirmar los cambios en los datos de contacto y firma digital.'
    ]
  },
  {
    id: 'prof-3',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Confirmación de Huella en el Registro',
    url: 'https://portal.sat.gob.gt/portal/sin-categoria/requisitos-de-actualizacion-de-impresion-dactilar-para-abogados-y-notarios-que-realizan-traspasos-electronicos-a-traves-de-agencia-virtual/',
    formulario: 'Registro Biométrico Presencial',
    descripcion: 'Realizar el registro dactilar biométrico para autorizar traspasos electrónicos de vehículos en línea.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos para el registro' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Presentarse físicamente el profesional notario.',
      'Presentar DPI original vigente.',
      'Presentar carné de colegiado activo.'
    ],
    pasos: [
      'Acudir al Centro de Atención Tributaria con cita previa.',
      'Efectuar la captura biométrica de huellas dactilares.',
      'Firmar el consentimiento y obtener la activación inmediata.'
    ]
  },

  // 3. Profesionales -> Notarios y Abogados -> Gestiones Vehiculares
  {
    id: 'prof-4',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Gestiones Vehiculares',
    tramite: 'Aviso de Legalización de Firmas en Certificado de Propiedad',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/aviso-de-legalizacion-de-firmas-en-certificado-de-propiedad-de-vehiculos/',
    formulario: 'Aviso Electrónico de Notario SAT',
    descripcion: 'Presentar el aviso notarial formal sobre legalización de firmas en certificados de propiedad automotor.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos para presentar aviso' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Contar con certificado de propiedad con firmas legalizadas por Notario.',
      'Adherir timbres notariales y fiscales correspondientes.'
    ],
    pasos: [
      'Generar el aviso electrónico a través de la Agencia Virtual SAT.',
      'Adjuntar comprobantes y registrar el número de legalización.'
    ]
  },
  {
    id: 'prof-5',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Gestiones Vehiculares',
    tramite: 'Traspaso Electrónico con Anexo Declaraguate',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-electronico-de-vehiculos-por-notario-con-anexo-del-certificado-de-propiedad-emitido-via-declaraguate-en-agencia-virtual/',
    formulario: 'Declaraguate SAT-8611',
    descripcion: 'Efectuar el traspaso electrónico de vehículos de forma 100% digital con validación de Declaraguate.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos del traspaso' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: [
      'Contar con formulario SAT-8611 pagado en Declaraguate.',
      'Completar el reconocimiento biométrico del notario y partes interesadas.'
    ],
    pasos: [
      'Ingresar al módulo de Traspaso Electrónico en Agencia Virtual.',
      'Verificar los datos del comprador y vendedor.',
      'Autorizar la transferencia de dominio y generar el nuevo distintivo digital.'
    ]
  },

  // 3. Profesionales -> Gestores Tributarios
  {
    id: 'prof-7',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Gestores Tributarios',
    subcategoria: 'Gafetes y Acreditaciones',
    tramite: 'Renovación de Gafete de Gestor Tributario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-informacion-y-renovacion-del-gafete-de-gestor-tributario-y-o-auxiliar-de-gestor-tributario/',
    descripcion: 'Renovar el gafete y acreditación oficial para actuar como gestor tributario autorizado ante la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos para renovación' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Presentar constancia de carencia de antecedentes penales y policiales', 'Presentar DPI vigente'],
    pasos: ['Completar el formulario de renovación en el portal SAT.']
  },

  // 1. Contribuyentes
  {
    id: 'con-1a',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Inscripción y RTU',
    tramite: 'Inscripción en el RTU Digital',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    descripcion: 'Solicitar el Número de Identificación Tributaria (NIT) y realizar el alta inicial en el RTU Digital.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de solicitud' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Adjuntar Documento Personal de Identificación (DPI) escaneado', 'Adjuntar comprobante de domicilio o factura de servicios recientes'],
    pasos: ['Ingresar a la opción de Solicitud de NIT en el portal SAT.', 'Completar el formulario digital y validar el correo electrónico.', 'Recibir la confirmación del NIT y activar el usuario de Agencia Virtual.']
  },
  {
    id: 'con-1b',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Inscripción y RTU',
    tramite: 'Actualización en el RTU Digital',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    descripcion: 'Actualizar o ratificar datos en el Registro Tributario Unificado digital.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de actualización' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Contar con acceso activo a Agencia Virtual', 'Adjuntar documento que soporte el cambio de datos'],
    pasos: ['Iniciar sesión en Agencia Virtual SAT.', 'Ingresar a Servicios > RTU > Actualización de Datos.', 'Confirmar los datos y descargar la constancia del RTU Digital.']
  },
  {
    id: 'con-2',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Facturación Electrónica (FEL)',
    tramite: 'Habilitación como Emisor FEL',
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-en-linea-fel/',
    descripcion: 'Habilitarse gratuitamente para emitir facturas electrónicas en línea desde la Agencia Virtual.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de habilitación' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Mantener el RTU actualizado', 'Contar con afiliación al régimen de IVA correspondiente'],
    pasos: ['Ingresar a Agencia Virtual SAT.', 'Generar la firma electrónica gratuita y activar la emisión de facturas electrónicas.']
  },

  // 2. Comercio Exterior
  {
    id: 'com-1',
    pillar: 'comercio_exterior',
    pillarName: '2. Comercio Exterior',
    categoria: 'Importadores y Exportadores',
    subcategoria: 'Aduanas',
    tramite: 'Habilitación como Operador Económico Autorizado (OEA)',
    url: 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
    descripcion: 'Certificar operaciones aduaneras bajo los estándares de seguridad y agilidad logística del Operador Económico Autorizado.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de certificación' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Demostrar historial de cumplimiento tributario y aduanero impecable', 'Cumplir estándares de seguridad física en almacenes e instalaciones'],
    pasos: ['Presentar la solicitud formal ante la Intendencia de Aduanas.']
  },

  // 4. Organismos Especiales
  {
    id: 'org-1',
    pillar: 'organismos_especiales',
    pillarName: '4. Organismos Especiales',
    categoria: 'Entidades No Lucrativas (ONG)',
    subcategoria: 'Exenciones Fiscales',
    tramite: 'Solicitud de Exención de IVA e ISR para ONG',
    url: 'https://portal.sat.gob.gt/portal/exenciones-ongs/',
    descripcion: 'Solicitar el reconocimiento formal de exención tributaria para asociaciones o fundaciones sin fines de lucro.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Requisitos obligatorios' },
      { id: 'pasos', titulo: 'Pasos de solicitud' },
      { id: 'enlace', titulo: 'Enlace oficial SAT' }
    ],
    requisitos: ['Presentar escritura constitutiva debidamente registrada', 'Presentar constancia de inscripción en el Registro de Personas Jurídicas'],
    pasos: ['Presentar el expediente en la gerencia regional tributaria correspondiente.']
  }
];

const PILLARS_CONFIG: { id: PillarType; name: string; desc: string }[] = [
  { id: 'contribuyentes', name: '1. Contribuyentes', desc: 'Personas individuales, asalariados y regímenes de inscripción tributaria.' },
  { id: 'comercio_exterior', name: '2. Comercio Exterior', desc: 'Gestiones aduaneras, importadores, exportadores y auxiliares.' },
  { id: 'profesionales', name: '3. Profesionales', desc: 'Notarios, abogados, gestores tributarios y agentes aduaneros.' },
  { id: 'organismos_especiales', name: '4. Organismos Especiales', desc: 'Entidades no lucrativas, ONGs y misiones diplomáticas.' }
];

export default function App() {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('profesionales');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Notarios y Abogados');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('Especies Fiscales');
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);
  
  // Accordion state in sidebar menu: ALL CLOSED BY DEFAULT
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const [menuSidebarOpen, setMenuSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPillarItems = TRAMITES_DATA.filter(i => i.pillar === selectedPillar);
  const currentCategoriaItems = currentPillarItems.filter(i => i.categoria === selectedCategoria);
  const currentSubcategoriaItems = currentCategoriaItems.filter(i => i.subcategoria === selectedSubcategoria);

  const categoriasInPillar = Array.from(new Set(currentPillarItems.map(i => i.categoria)));
  const subcategoriasInCategoria = Array.from(new Set(currentCategoriaItems.map(i => i.subcategoria)));

  const handleGoHome = () => {
    setLevel(1);
    setSelectedTramite(null);
    setOpenAccordionId(null);
    setMenuSidebarOpen(false);
  };

  const handleSelectPillar = (pillarId: PillarType) => {
    setSelectedPillar(pillarId);
    const pItems = TRAMITES_DATA.filter(i => i.pillar === pillarId);
    const firstCat = pItems[0]?.categoria || '';
    setSelectedCategoria(firstCat);
    const firstSub = pItems.filter(i => i.categoria === firstCat)[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setOpenAccordionId(null);
    setLevel(2);
    setMenuSidebarOpen(false);
  };

  const handleSelectCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const subItems = currentPillarItems.filter(i => i.categoria === cat);
    const firstSub = subItems[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setOpenAccordionId(null);
    setLevel(3);
    setMenuSidebarOpen(false);
  };

  const handleSelectSubcategoria = (sub: string) => {
    setSelectedSubcategoria(sub);
    const trms = currentCategoriaItems.filter(i => i.subcategoria === sub);
    const item = trms[0] || null;
    setSelectedTramite(item);
    // Menu accordions closed by default as instructed
    setOpenAccordionId(null);
    setLevel(4);
    setMenuSidebarOpen(true);
  };

  const handleSelectTramite = (item: TramiteItem) => {
    setSelectedTramite(item);
    setLevel(4);
    setMenuSidebarOpen(true);
  };

  // Toggle accordion in sidebar
  const handleToggleAccordion = (itemId: string) => {
    setOpenAccordionId(prev => (prev === itemId ? null : itemId));
  };

  // Smooth in-page scrolling function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#19324B] font-sans antialiased flex flex-col selection:bg-[#14649B] selection:text-white">
      
      {/* SAT Institutional Gradient Stripe (Manual SAT Design System Web v1.0) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#19324B] via-[#14649B] to-[#19AFE1]" />

      {/* Fixed Sticky Header Container (Height 72px for top header + Second Nav Bar) */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#DCDCDC] shadow-sm">
        
        {/* 1st Top Header: Height 72px */}
        <header className="h-[72px] flex items-center border-b border-[#DCDCDC]">
          <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-6">
            
            {/* Logo SAT: Confiable, Institucional, Moderno */}
            <div className="flex items-center gap-3.5 cursor-pointer group" onClick={handleGoHome}>
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[#19324B] group-hover:bg-[#14649B] flex items-center justify-center text-white font-black text-sm tracking-tight transition-colors shadow-sm">
                  SAT
                </div>
                {/* Subtle Institutional Orange Touch (#FFB806 warning accent) */}
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FFB806]" />
              </div>
              <div>
                <span className="text-[11px] text-[#14649B] uppercase tracking-wider block font-bold">Portal Institucional</span>
                <span className="text-sm font-extrabold text-[#19324B] tracking-tight leading-none">Superintendencia de Administración Tributaria</span>
              </div>
            </div>

            {/* Búsqueda: Input altura 48px, borde #DCDCDC, radio 8px, foco #14649B */}
            <div className="flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder="Buscar trámites, formularios o requisitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-4 pr-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-[#19324B] placeholder:text-slate-400 focus:outline-none focus:border-[#14649B] focus:ring-4 focus:ring-[#14649B]/15 transition-all"
              />
            </div>
          </div>
        </header>

        {/* 2nd Bar: Centered Contents (Menú, Inicio, and Pillars) */}
        <div className="bg-[#FFFFFF] px-8 py-2.5 flex items-center justify-center gap-6 overflow-x-auto text-sm font-medium">
          
          {/* Hamburger Menu button with ONLY the menu outline icon as requested */}
          <button 
            onClick={() => setMenuSidebarOpen(!menuSidebarOpen)}
            className="px-3.5 py-1.5 bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B] hover:text-[#14649B] rounded-lg font-bold shrink-0 transition-colors flex items-center gap-2 shadow-sm"
          >
            {menuSidebarOpen ? <X className="w-4 h-4 text-[#D9336E]" /> : <Menu className="w-4 h-4 text-[#14649B]" />}
            {menuSidebarOpen ? 'Cerrar Menú' : 'Menú'}
          </button>

          {/* Inicio button right after Menú */}
          <button 
            onClick={handleGoHome}
            className={`px-4 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
              level === 1 
                ? 'bg-[#14649B] text-white shadow-sm' 
                : 'bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B]'
            }`}
          >
            Inicio
          </button>

          {/* The 4 Macro Groups with official SAT Design System Colors */}
          <div className="flex items-center gap-6 text-sm whitespace-nowrap pl-4 border-l border-[#DCDCDC]">
            {PILLARS_CONFIG.map((p) => (
              <button 
                key={p.id}
                onClick={() => handleSelectPillar(p.id)}
                className={`relative py-1 transition-colors font-medium ${
                  selectedPillar === p.id && level > 1 
                    ? 'text-[#14649B] font-extrabold' 
                    : 'text-[#19324B]/80 hover:text-[#14649B]'
                }`}
              >
                {p.name}
                {selectedPillar === p.id && level > 1 && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14649B]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout: Context-Aware Lateral Menu + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* LATERAL MENU (ACORDEÓN DE GESTIONES CERRADO POR DEFECTO) */}
        {menuSidebarOpen && (
          <aside className="w-full md:w-80 border-r border-[#DCDCDC] p-6 space-y-6 shrink-0 bg-white md:sticky md:top-[124px] md:h-[calc(100vh-124px)] md:overflow-y-auto">
            
            {/* Nivel 1 Menu: Lista de Macro Grupos */}
            {level === 1 && (
              <div className="space-y-3">
                <div className="border-b border-[#DCDCDC] pb-2">
                  <h3 className="text-base font-extrabold text-[#19324B]">Grupos Tributarios</h3>
                </div>
                <ul className="space-y-1.5 border-l-2 border-[#DCDCDC] pl-2.5 text-sm">
                  {PILLARS_CONFIG.map((p) => (
                    <li key={p.id}>
                      <button 
                        onClick={() => handleSelectPillar(p.id)}
                        className={`text-left w-full py-1.5 px-1 rounded transition-colors ${
                          selectedPillar === p.id 
                            ? 'text-[#14649B] font-bold border-l-2 border-[#14649B] -ml-[12px] pl-2.5' 
                            : 'text-[#19324B] hover:text-[#14649B]'
                        }`}
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nivel 2 Menu: Categorías dentro del Pilar */}
            {level === 2 && (
              <div className="space-y-3">
                <div className="border-b border-[#DCDCDC] pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pilar activo</span>
                  <h3 className="text-base font-extrabold text-[#19324B]">
                    {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                  </h3>
                </div>
                <ul className="space-y-1.5 border-l-2 border-[#DCDCDC] pl-2.5 text-sm">
                  {categoriasInPillar.map((cat, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSelectCategoria(cat)}
                        className={`text-left w-full py-1.5 px-1 rounded transition-colors ${
                          selectedCategoria === cat 
                            ? 'text-[#14649B] font-bold border-l-2 border-[#14649B] -ml-[12px] pl-2.5' 
                            : 'text-[#19324B] hover:text-[#14649B]'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nivel 3 Menu: Subcategorías dentro de la Categoría */}
            {level === 3 && (
              <div className="space-y-3">
                <div className="border-b border-[#DCDCDC] pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Categoría activa</span>
                  <h3 className="text-base font-extrabold text-[#19324B]">{selectedCategoria}</h3>
                </div>
                <ul className="space-y-1.5 border-l-2 border-[#DCDCDC] pl-2.5 text-sm">
                  {subcategoriasInCategoria.map((sub, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSelectSubcategoria(sub)}
                        className={`text-left w-full py-1.5 px-1 rounded transition-colors ${
                          selectedSubcategoria === sub 
                            ? 'text-[#14649B] font-bold border-l-2 border-[#14649B] -ml-[12px] pl-2.5' 
                            : 'text-[#19324B] hover:text-[#14649B]'
                        }`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nivel 4 Menu: Minimalista con sólo Especies Fiscales y línea sutil dividiendo opciones */}
            {level === 4 && (
              <div className="space-y-2">
                
                {/* Header Contextual: Solo Especies Fiscales */}
                <div className="border-b border-[#DCDCDC]/60 pb-3">
                  <h3 className="text-base font-bold text-[#19324B] tracking-tight">
                    {selectedSubcategoria}
                  </h3>
                </div>

                {/* Acordeón de gestiones minimalista con línea sutil divisoria */}
                <div className="divide-y divide-[#DCDCDC]/60">
                  {currentSubcategoriaItems.map((item) => {
                    const isOpen = openAccordionId === item.id;
                    const isSelected = selectedTramite?.id === item.id;

                    return (
                      <div key={item.id} className="py-2.5">
                        {/* Botón de opción del menú con flecha sutil */}
                        <button
                          onClick={() => handleToggleAccordion(item.id)}
                          className="w-full flex items-center justify-between gap-3 text-left group transition-colors py-0.5"
                        >
                          <span className={`text-[12px] leading-snug transition-colors ${
                            isSelected 
                              ? 'text-[#14649B] font-bold' 
                              : 'text-slate-700 group-hover:text-[#14649B]'
                          }`}>
                            {item.tramite}
                          </span>
                          <span className="shrink-0 text-slate-400 group-hover:text-[#14649B]">
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#14649B]" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </span>
                        </button>

                        {/* Contenido desplegable sutil y sin cajas voluminosas */}
                        {isOpen && (
                          <div className="pt-2 pb-1 space-y-1.5 text-xs">
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {item.descripcion}
                            </p>
                            {item.formulario && (
                              <div className="text-[11px] text-[#14649B] font-medium">
                                {item.formulario}
                              </div>
                            )}
                            <button
                              onClick={() => handleSelectTramite(item)}
                              className={`text-[11px] font-bold transition-colors underline pt-0.5 block ${
                                isSelected 
                                  ? 'text-[#14649B] cursor-default' 
                                  : 'text-[#14649B] hover:text-[#19324B]'
                              }`}
                            >
                              {isSelected ? 'Gestión abierta en pantalla' : 'Abrir gestión'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Quick reset navigation */}
            <div className="pt-4 border-t border-[#DCDCDC]">
              <button 
                onClick={handleGoHome}
                className="text-xs text-[#14649B] hover:text-[#19324B] font-semibold underline"
              >
                Volver al Inicio
              </button>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN CONTENT: CARDS NAVIGATION UP TO 4TH LEVEL */}
        <main className="flex-1 p-8 md:p-12 space-y-8 bg-white">
          
          {/* Breadcrumbs: SAT Design System Web v1.0 standard */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <button onClick={handleGoHome} className="hover:text-[#14649B]">Inicio</button>
            {level >= 2 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <button onClick={() => { setLevel(2); setSelectedTramite(null); }} className="hover:text-[#14649B]">
                  {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                </button>
              </>
            )}
            {level >= 3 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <button onClick={() => { setLevel(3); setSelectedTramite(null); }} className="hover:text-[#14649B]">
                  {selectedCategoria}
                </button>
              </>
            )}
            {level >= 4 && (
              <>
                <span className="text-[#DCDCDC]">/</span>
                <span className="text-[#14649B] font-bold">{selectedSubcategoria}</span>
              </>
            )}
          </div>

          {/* ========================================================
              LEVEL 1: CARDS OF MACRO GROUPS (PILARES)
              ======================================================== */}
          {level === 1 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">Macro Grupos Oficiales</span>
                <h2 className="text-3xl font-black text-[#19324B] tracking-tight">Seleccionar un Grupo Tributario</h2>
                <p className="text-sm text-slate-600">Explorar los requisitos oficiales y gestionar los trámites en línea.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {PILLARS_CONFIG.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectPillar(p.id)}
                    className="p-6 bg-white border border-[#DCDCDC] rounded-[16px] hover:border-[#14649B] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors">{p.name}</h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                    <div className="text-xs font-bold text-[#14649B] pt-2">Explorar este pilar</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 2: CARDS OF CATEGORIES
              ======================================================== */}
          {level === 2 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  Categorías de {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                </span>
                <h2 className="text-3xl font-black text-[#19324B] tracking-tight">Seleccionar una Categoría</h2>
                <p className="text-sm text-slate-600">Elegir la categoría para consultar los trámites y gestiones correspondientes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categoriasInPillar.map((cat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectCategoria(cat)}
                    className="p-6 bg-white border border-[#DCDCDC] rounded-[16px] hover:border-[#14649B] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors">{cat}</h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">Acceder a las subcategorías y requisitos oficiales de {cat}.</p>
                    <div className="text-xs font-bold text-[#14649B] pt-2">Ver subcategorías</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 3: CARDS OF SUBCATEGORIES
              ======================================================== */}
          {level === 3 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  Subcategorías de {selectedCategoria}
                </span>
                <h2 className="text-3xl font-black text-[#19324B] tracking-tight">Seleccionar una Subcategoría</h2>
                <p className="text-sm text-slate-600">Seleccionar una opción para consultar los trámites disponibles y habilitar el menú lateral.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {subcategoriasInCategoria.map((sub, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectSubcategoria(sub)}
                    className="p-6 bg-white border border-[#DCDCDC] rounded-[16px] hover:border-[#14649B] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#19324B] group-hover:text-[#14649B] transition-colors">{sub}</h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F]" />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">Trámites y normativas vigentes correspondientes a {sub}.</p>
                    <div className="text-xs font-bold text-[#14649B] pt-2">Ver trámites</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 4: TRÁMITES & DETAIL (CON PUNTOS DE ESTA PÁGINA AQUÍ)
              ======================================================== */}
          {level === 4 && (
            <div className="space-y-8 max-w-3xl animate-fadeIn">
              
              {selectedTramite ? (
                <div className="space-y-8">
                  
                  {/* Título y Resumen del Trámite */}
                  <div className="space-y-3 border-b border-[#DCDCDC] pb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-[#19324B] tracking-tight">
                      {selectedTramite.tramite}
                    </h2>

                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {selectedTramite.descripcion}
                    </p>
                  </div>

                  {/* PUNTOS DE ESTA PÁGINA (EN LA PÁGINA MISMA, COMO FUE SOLICITADO) */}
                  {selectedTramite.puntosMenu && (
                    <div className="p-5 bg-slate-50 border border-[#DCDCDC] rounded-[16px] space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                          Puntos de esta página
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">Navegación de secciones</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedTramite.puntosMenu.map((punto) => (
                          <button
                            key={punto.id}
                            onClick={() => scrollToSection(punto.id)}
                            className="py-2 px-3 rounded-lg border border-[#DCDCDC] bg-white text-[#19324B] hover:text-[#14649B] hover:border-[#14649B] transition-colors font-medium flex items-center justify-between group text-left"
                          >
                            <span>{punto.titulo}</span>
                            <span className="text-slate-300 group-hover:text-[#14649B] text-xs">↓</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modality Points if present (Venta de Especies Fiscales) */}
                  {selectedTramite.requisitosPorModalidad && (
                    <div className="space-y-8">
                      
                      {/* Punto: Requisitos Notario Titular */}
                      <section id="requisitos-notario" className="scroll-mt-36 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Requisitos: Notario Titular</h3>
                        </div>
                        <p className="text-sm text-slate-600">Requisitos obligatorios para la adquisición directa por parte del profesional Notario habilitado.</p>
                        
                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[0]?.requisitos.map((req, idx) => (
                            <div key={idx} className="p-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-slate-700 leading-relaxed flex items-start gap-3">
                              <span className="w-2 h-2 rounded-full bg-[#14649B] shrink-0 mt-1.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Punto: Requisitos Tercero Autorizado */}
                      <section id="requisitos-tercero" className="scroll-mt-36 space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Requisitos: Tercero Autorizado (Procurador / Delegado)</h3>
                        </div>
                        <p className="text-sm text-slate-600">Documentación que debe presentar la persona designada por el Notario para realizar el retiro.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[1]?.requisitos.map((req, idx) => (
                            <div key={idx} className="p-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-slate-700 leading-relaxed flex items-start gap-3">
                              <span className="w-2 h-2 rounded-full bg-[#19AFE1] shrink-0 mt-1.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Punto: Requisitos Patentados */}
                      <section id="requisitos-patentados" className="scroll-mt-36 space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Requisitos: Patentados Autorizados</h3>
                        </div>
                        <p className="text-sm text-slate-600">Requisitos para personas individuales o jurídicas acreditadas con patente de expendio.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[2]?.requisitos.map((req, idx) => (
                            <div key={idx} className="p-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-slate-700 leading-relaxed flex items-start gap-3">
                              <span className="w-2 h-2 rounded-full bg-[#8CC63F] shrink-0 mt-1.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                    </div>
                  )}

                  {/* Standard requirements if no modality split */}
                  {!selectedTramite.requisitosPorModalidad && selectedTramite.requisitos && (
                    <section id="requisitos" className="scroll-mt-36 space-y-4">
                      <h3 className="text-xl font-bold text-[#19324B]">Requisitos obligatorios</h3>
                      <div className="space-y-2.5">
                        {selectedTramite.requisitos.map((req, idx) => (
                          <div key={idx} className="p-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-slate-700 leading-relaxed flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#14649B] shrink-0 mt-1.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Punto: Pasos del Trámite */}
                  {selectedTramite.pasos && (
                    <section id="pasos" className="scroll-mt-36 space-y-4 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Procedimiento y pasos para realizar el trámite</h3>
                      <div className="space-y-3">
                        {selectedTramite.pasos.map((paso, idx) => (
                          <div key={idx} className="p-4 bg-white border border-[#DCDCDC] rounded-lg text-sm text-slate-700 leading-relaxed flex items-start gap-3.5">
                            <span className="w-6 h-6 rounded-full bg-[#14649B] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{paso}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Punto: Formulario Declaraguate */}
                  {selectedTramite.formulario && (
                    <section id="formulario" className="scroll-mt-36 space-y-3 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Formulario oficial Declaraguate</h3>
                      <div className="p-5 bg-[#14649B]/5 border border-[#14649B]/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#14649B] text-base">{selectedTramite.formulario}</span>
                          <span className="text-xs font-bold text-white bg-[#14649B] px-2 py-0.5 rounded">En línea 24/7</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Generar de forma gratuita en el portal oficial de Declaraguate (declaraguate.sat.gob.gt). Al completarlo y congelarlo, se obtiene la boleta SAT-2000 para el pago electrónico o presencial en bancos del sistema.
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Punto: Notas Importantes y Tarifas */}
                  {selectedTramite.notasImportantes && (
                    <section id="notas" className="scroll-mt-36 space-y-4 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Tarifas y notas importantes</h3>
                      <div className="p-5 bg-amber-50/60 border border-[#FFB806]/50 rounded-[16px] space-y-2.5 text-sm text-slate-800">
                        {selectedTramite.notasImportantes.map((nota, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="text-[#FFB806] font-black text-base shrink-0">•</span>
                            <p className="leading-relaxed">{nota}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Punto: Base Legal */}
                  {selectedTramite.baseLegal && (
                    <section id="base-legal" className="scroll-mt-36 space-y-2 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Base legal y normativa aplicable</h3>
                      <div className="p-4 bg-slate-50 border border-[#DCDCDC] rounded-lg text-xs text-slate-600 leading-relaxed">
                        {selectedTramite.baseLegal}
                      </div>
                    </section>
                  )}

                  {/* Punto: Retiro en Agencias SAT */}
                  <section id="agencias" className="scroll-mt-36 space-y-3 pt-2">
                    <h3 className="text-xl font-bold text-[#19324B]">Retiro en Oficinas y Agencias Tributarias SAT</h3>
                    <div className="p-5 bg-white border border-[#DCDCDC] rounded-xl space-y-2 text-sm text-slate-700">
                      <p>
                        Efectuar la recepción de las especies fiscales y la razón electrónica de correlativos de Papel de Protocolo en cualquier oficina o agencia tributaria de la SAT a nivel nacional.
                      </p>
                      <div className="text-xs text-[#14649B] font-semibold pt-1">
                        Horario habitual: Lunes a viernes de 08:00 a 16:00 horas (sin cerrar al mediodía).
                      </div>
                    </div>
                  </section>

                  {/* Punto: Enlace Oficial SAT */}
                  <section id="enlace" className="scroll-mt-36 pt-4 border-t border-[#DCDCDC]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#19324B] text-white rounded-xl">
                      <div>
                        <h4 className="font-bold text-base">Portal Oficial SAT Guatemala</h4>
                        <p className="text-xs text-slate-300">Consultar los términos y condiciones directamente en el portal oficial.</p>
                      </div>
                      <a 
                        href={selectedTramite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs rounded-lg transition-all shadow-sm shrink-0"
                      >
                        Abrir trámite oficial en la SAT
                      </a>
                    </div>
                  </section>

                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-[#19324B]">Trámites en {selectedSubcategoria}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentSubcategoriaItems.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectTramite(item)}
                        className="p-6 bg-white border border-[#DCDCDC] rounded-[16px] hover:border-[#14649B] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all cursor-pointer space-y-2.5 group"
                      >
                        <h4 className="text-base font-bold text-[#19324B] group-hover:text-[#14649B]">{item.tramite}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.descripcion}</p>
                        <div className="text-xs font-bold text-[#14649B] pt-1">Ver trámite</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* Institutional SAT Footer conforming to Design System Web v1.0 */}
      <footer className="border-t border-[#DCDCDC] py-8 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Superintendencia de Administración Tributaria — SAT Guatemala. SAT Design System Web v1.0.
          </div>
          <div className="flex items-center gap-4 text-[#14649B] font-semibold">
            <a href="https://portal.sat.gob.gt" target="_blank" rel="noreferrer" className="hover:underline">Portal SAT</a>
            <span>·</span>
            <a href="https://declaraguate.sat.gob.gt" target="_blank" rel="noreferrer" className="hover:underline">Declaraguate</a>
            <span>·</span>
            <a href="https://portal.sat.gob.gt/portal/agencia-virtual/" target="_blank" rel="noreferrer" className="hover:underline">Agencia Virtual</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
