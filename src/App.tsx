import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Check, Copy, Printer, ExternalLink, Search } from 'lucide-react';

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
  puntosMenu: {
    id: string;
    titulo: string;
  }[];
}

const TRAMITES_DATA: TramiteItem[] = [
  // 3. Profesionales -> Notarios y Abogados -> Especies Fiscales (Gestiones oficiales en verbos de acción / infinitivo)
  {
    id: 'prof-6',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
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
    id: 'prof-6b',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Pagar Timbres Fiscales en Línea',
    url: 'https://portal.sat.gob.gt/portal/agencia-virtual/',
    formulario: 'Declaraguate SAT-7121 / Razón Electrónica en Agencia Virtual',
    baseLegal: 'Artículo 5 de la Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto 37-92.',
    descripcion: 'Realizar el pago del impuesto de timbres fiscales en tarifas específicas mediante razón electrónica en la Agencia Virtual, sin adherir estampillas físicas.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir los pasos del procedimiento' },
      { id: 'formulario', titulo: 'Llenar formulario Declaraguate SAT-7121' },
      { id: 'notas', titulo: 'Revisar tarifas y notas importantes' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Inscribir Nuevos Patentados',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Solicitud de Patente de Especies Fiscales SAT',
    baseLegal: 'Reglamento de la Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos.',
    descripcion: 'Solicitar la patente oficial ante la SAT para personas individuales o jurídicas que deseen dedicarse al expendio y comercialización de timbres fiscales.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir los pasos de inscripción' },
      { id: 'formulario', titulo: 'Presentar formulario de solicitud' },
      { id: 'notas', titulo: 'Revisar comisiones y notas importantes' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Solicitar Canje de Especies',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/venta-de-especies-fiscales-a-notarios-y-patentados/',
    formulario: 'Memorial de Canje y Devolución de Especies Fiscales',
    baseLegal: 'Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Decreto 37-92.',
    descripcion: 'Gestionar el canje de hojas de Papel de Protocolo o timbres fiscales que presenten errores tipográficos, daño físico o deterioro no imputable.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos para el canje' },
      { id: 'pasos', titulo: 'Seguir los pasos de la devolución' },
      { id: 'formulario', titulo: 'Presentar memorial y formulario' },
      { id: 'base-legal', titulo: 'Consultar base legal y normativa' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    id: 'prof-2a',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Inscribir Calidad de Abogado y Notario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Solicitud de Inscripción Profesional SAT',
    baseLegal: 'Decreto 1-98 del Congreso de la República, Ley Orgánica de la SAT.',
    descripcion: 'Registrar por primera vez la calidad profesional de Abogado y Notario en la base de datos oficial de la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de inscripción' },
      { id: 'formulario', titulo: 'Llenar formulario de solicitud' },
      { id: 'base-legal', titulo: 'Consultar base legal' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Actualizar Datos de Abogado y Notario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    formulario: 'Actualización en Agencia Virtual',
    baseLegal: 'Código Tributario de Guatemala.',
    descripcion: 'Actualizar datos profesionales, dirección de notaría o estado colegiado ante la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de actualización' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Confirmar Huella Dactilar en el Registro',
    url: 'https://portal.sat.gob.gt/portal/sin-categoria/requisitos-de-actualizacion-de-impresion-dactilar-para-abogados-y-notarios-que-realizan-traspasos-electronicos-a-traves-de-agencia-virtual/',
    formulario: 'Registro Biométrico Presencial',
    descripcion: 'Realizar el registro dactilar biométrico para autorizar traspasos electrónicos de vehículos en línea.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos para el registro' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Presentar Aviso de Legalización de Firmas en Certificado de Propiedad',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/aviso-de-legalizacion-de-firmas-en-certificado-de-propiedad-de-vehiculos/',
    formulario: 'Aviso Electrónico de Notario SAT',
    descripcion: 'Presentar el aviso notarial formal sobre legalización de firmas en certificados de propiedad automotor.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos para presentar aviso' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Efectuar Traspaso Electrónico con Anexo Declaraguate',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-electronico-de-vehiculos-por-notario-con-anexo-del-certificado-de-propiedad-emitido-via-declaraguate-en-agencia-virtual/',
    formulario: 'Declaraguate SAT-8611',
    descripcion: 'Efectuar el traspaso electrónico de vehículos de forma 100% digital con validación de Declaraguate.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos del traspaso' },
      { id: 'formulario', titulo: 'Llenar Declaraguate SAT-8611' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Renovar Gafete de Gestor Tributario',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-informacion-y-renovacion-del-gafete-de-gestor-tributario-y-o-auxiliar-de-gestor-tributario/',
    descripcion: 'Renovar el gafete y acreditación oficial para actuar como gestor tributario autorizado ante la SAT.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos para renovación' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Inscribirse en el RTU Digital',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    descripcion: 'Solicitar el Número de Identificación Tributaria (NIT) y realizar el alta inicial en el RTU Digital.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de solicitud' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Actualizar Datos en el RTU Digital',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    descripcion: 'Actualizar o ratificar datos en el Registro Tributario Unificado digital.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de actualización' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Habilitarse como Emisor FEL',
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-en-linea-fel/',
    descripcion: 'Habilitarse gratuitamente para emitir facturas electrónicas en línea desde la Agencia Virtual.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de habilitación' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Habilitarse como Operador Económico Autorizado (OEA)',
    url: 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
    descripcion: 'Certificar operaciones aduaneras bajo los estándares de seguridad y agilidad logística del Operador Económico Autorizado.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de certificación' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
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
    tramite: 'Solicitar Exención de IVA e ISR para ONG',
    url: 'https://portal.sat.gob.gt/portal/exenciones-ongs/',
    descripcion: 'Solicitar el reconocimiento formal de exención tributaria para asociaciones o fundaciones sin fines de lucro.',
    puntosMenu: [
      { id: 'requisitos', titulo: 'Cumplir requisitos obligatorios' },
      { id: 'pasos', titulo: 'Seguir pasos de solicitud' },
      { id: 'enlace', titulo: 'Ir al trámite oficial en portal SAT' }
    ],
    requisitos: ['Presentar escritura constitutiva debidamente registrada', 'Presentar constancia de inscripción en el Registro de Personas Jurídicas'],
    pasos: ['Presentar el expediente en la gerencia regional tributaria correspondiente.']
  }
];

interface PillarConfigItem {
  id: PillarType;
  name: string;
  desc: string;
  primaryColor: string;
  cardHoverBorder: string;
  cardHoverBg: string;
  cardHoverShadow: string;
  titleHoverText: string;
  circleClasses: string;
  actionTextClass: string;
  activeIndicatorColor: string;
}

const PILLARS_CONFIG: PillarConfigItem[] = [
  { 
    id: 'contribuyentes', 
    name: '1. Contribuyentes', 
    desc: 'Personas individuales, asalariados y regímenes de inscripción tributaria.',
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
    name: '2. Comercio Exterior', 
    desc: 'Gestiones aduaneras, importadores, exportadores y auxiliares.',
    primaryColor: '#19AFE1',
    cardHoverBorder: 'hover:border-[#19AFE1]',
    cardHoverBg: 'hover:bg-[#19AFE1]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(25,175,225,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#19AFE1]/15 text-[#0E88B1] group-hover:bg-white group-hover:text-[#19AFE1]',
    actionTextClass: 'text-[#0E88B1] group-hover:text-white',
    activeIndicatorColor: '#19AFE1'
  },
  { 
    id: 'profesionales', 
    name: '3. Profesionales', 
    desc: 'Notarios, abogados, gestores tributarios y agentes aduaneros.',
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
    id: 'organismos_especiales', 
    name: '4. Organismos Especiales', 
    desc: 'Entidades no lucrativas, ONGs y misiones diplomáticas.',
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

export default function App() {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(4);
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('profesionales');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Notarios y Abogados');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('Especies Fiscales');
  
  // Set default initial trámite to Venta de Especies Fiscales
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(TRAMITES_DATA[0]);

  // Active section for highlight
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Interactive requirement checklist state
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  // Copy notification state
  const [copiedLink, setCopiedLink] = useState(false);

  // Sidebar visibility: open by default on desktop, closed on mobile screens
  const [menuSidebarOpen, setMenuSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Helper to close drawer when navigating on mobile
  const closeMenuIfMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMenuSidebarOpen(false);
    }
  };

  // Scroll detection to compact spacing when scrolling down
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search query & results
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentPillarConfig = PILLARS_CONFIG.find(p => p.id === selectedPillar) || PILLARS_CONFIG[0];

  const currentPillarItems = TRAMITES_DATA.filter(i => i.pillar === selectedPillar);
  const currentCategoriaItems = currentPillarItems.filter(i => i.categoria === selectedCategoria);
  const currentSubcategoriaItems = currentCategoriaItems.filter(i => i.subcategoria === selectedSubcategoria);

  const categoriasInPillar = Array.from(new Set(currentPillarItems.map(i => i.categoria)));
  const subcategoriasInCategoria = Array.from(new Set(currentCategoriaItems.map(i => i.subcategoria)));

  // Filtered search results
  const searchResults = searchQuery.trim().length > 1
    ? TRAMITES_DATA.filter(t => 
        t.tramite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.formulario && t.formulario.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.subcategoria.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleGoHome = () => {
    setLevel(1);
    setSelectedTramite(null);
    closeMenuIfMobile();
  };

  const handleSelectPillar = (pillarId: PillarType) => {
    setSelectedPillar(pillarId);
    const pItems = TRAMITES_DATA.filter(i => i.pillar === pillarId);
    const firstCat = pItems[0]?.categoria || '';
    setSelectedCategoria(firstCat);
    const firstSub = pItems.filter(i => i.categoria === firstCat)[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(2);
    closeMenuIfMobile();
  };

  const handleSelectCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const subItems = TRAMITES_DATA.filter(i => i.pillar === selectedPillar && i.categoria === cat);
    const firstSub = subItems[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(3);
    closeMenuIfMobile();
  };

  const handleSelectSubcategoria = (sub: string) => {
    setSelectedSubcategoria(sub);
    const trms = TRAMITES_DATA.filter(i => i.pillar === selectedPillar && i.categoria === selectedCategoria && i.subcategoria === sub);
    const item = trms[0] || null;
    setSelectedTramite(item);
    setLevel(4);
    closeMenuIfMobile();
  };

  // Immediate selection of gestion when clicked in the menu
  const handleSelectMenuGestion = (item: TramiteItem) => {
    setSelectedTramite(item);
    setActiveSectionId('');
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll to in-page section with dynamic header offset
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isScrolled ? 80 : 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Toggle requirement check
  const handleToggleRequirement = (key: string) => {
    setCheckedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy trámite URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Select from search results
  const handleSelectSearchResult = (item: TramiteItem) => {
    setSelectedPillar(item.pillar);
    setSelectedCategoria(item.categoria);
    setSelectedSubcategoria(item.subcategoria);
    setSelectedTramite(item);
    setLevel(4);
    setSearchQuery('');
    setIsSearchFocused(false);
    closeMenuIfMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#19324B] font-sans antialiased flex flex-col selection:bg-[#14649B] selection:text-white">
      
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.2 AA) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#14649B] focus:text-white focus:rounded-lg focus:shadow-xl focus:text-xs focus:font-bold focus:outline-hidden"
      >
        Saltar al contenido principal
      </a>

      {/* SAT Institutional Gradient Stripe (Manual SAT Design System Web v1.0) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#19324B] via-[#14649B] to-[#19AFE1]" />

      {/* HEADER INTEGRAL: Totalmente responsive con safe-area y micro-compactación al scroll */}
      <header className={`sticky top-0 z-40 bg-white border-b border-[#DCDCDC] shadow-xs transition-all duration-300 ${
        isScrolled ? 'py-1' : 'py-2 sm:py-2.5'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
          
          {/* Fila 1: Marca Institucional adaptativa e Input de Búsqueda fluido */}
          <div className={`flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-300 ${
            isScrolled ? 'py-0.5' : 'py-1'
          }`}>
            
            {/* Logotipo y Títulos Institucionales */}
            <div 
              role="button"
              tabIndex={0}
              onClick={handleGoHome}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGoHome(); } }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 rounded-lg p-1 -m-1 focus-visible:ring-2 focus-visible:ring-[#14649B]"
              aria-label="Ir al inicio del portal SAT"
            >
              <div className="relative">
                <div className={`rounded-lg bg-[#19324B] group-hover:bg-[#14649B] flex items-center justify-center text-white font-black tracking-tight transition-all duration-300 shadow-xs ${
                  isScrolled ? 'w-7 h-7 text-xs' : 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm'
                }`}>
                  SAT
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FFB806]" />
              </div>
              
              <div>
                <span className={`text-[#14649B] uppercase tracking-wider block font-bold leading-tight transition-all duration-300 ${
                  isScrolled ? 'text-[9px]' : 'text-[9px] sm:text-[10px]'
                }`}>
                  Portal Institucional
                </span>
                <span className={`font-extrabold text-[#19324B] tracking-tight leading-none transition-all duration-300 ${
                  isScrolled ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                }`}>
                  <span className="sm:hidden">SAT Guatemala</span>
                  <span className="hidden sm:inline">Superintendencia de Administración Tributaria</span>
                </span>
              </div>
            </div>

            {/* Input de Búsqueda fluido sin desbordamiento */}
            <div 
              role="search" 
              className={`relative min-w-0 flex-1 transition-all duration-300 ${
                isScrolled ? 'max-w-[170px] sm:max-w-xs md:max-w-sm' : 'max-w-[190px] sm:max-w-xs md:max-w-sm lg:max-w-md'
              }`}
            >
              <div className="relative">
                <input 
                  type="search" 
                  aria-label="Buscar trámites o requisitos oficiales"
                  placeholder="Buscar trámites o requisitos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full bg-white border border-[#DCDCDC] rounded-lg text-xs text-[#19324B] placeholder:text-slate-500 focus:outline-hidden focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/20 transition-all duration-200 ${
                    isScrolled ? 'h-[32px] sm:h-[34px] pl-7 sm:pl-8 pr-7 text-xs' : 'h-[36px] sm:h-[40px] pl-8 sm:pl-9 pr-8 text-xs sm:text-sm'
                  }`}
                />
                <Search 
                  className={`text-slate-400 absolute left-2 sm:left-2.5 pointer-events-none transition-all duration-200 ${
                    isScrolled ? 'top-2 sm:top-2.5 w-3.5 h-3.5' : 'top-2.5 sm:top-3 w-4 h-4'
                  }`} 
                  aria-hidden="true" 
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar campo de búsqueda"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 text-xs rounded-full hover:bg-slate-100"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Resultados interactivos de búsqueda en vivo */}
              {isSearchFocused && searchResults.length > 0 && (
                <div 
                  role="listbox" 
                  aria-label="Resultados de búsqueda"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#DCDCDC] rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-[#DCDCDC]/60"
                >
                  {searchResults.map((res) => (
                    <div
                      key={res.id}
                      role="option"
                      aria-selected={false}
                      tabIndex={0}
                      onClick={() => handleSelectSearchResult(res)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSelectSearchResult(res); }}
                      className="p-3 hover:bg-[#14649B]/5 cursor-pointer transition-colors focus:bg-[#14649B]/10 focus:outline-hidden"
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#14649B]">{res.tramite}</div>
                      <div className="text-[11px] sm:text-xs text-slate-600 line-clamp-1">{res.descripcion}</div>
                      <div className="text-[10px] text-slate-500 pt-1 font-medium">{res.subcategoria} · {res.categoria}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Fila 2: Menú, Inicio y los 4 Pilares con scroll horizontal táctil seguro */}
          <nav 
            aria-label="Navegación principal" 
            className={`flex items-center gap-2 sm:gap-3 border-t border-[#DCDCDC]/60 transition-all duration-300 ${
              isScrolled ? 'pt-1 mt-1 text-xs' : 'pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 text-xs md:text-sm'
            }`}
          >
            
            {/* Botón de Menú lateral con accesibilidad */}
            <button 
              type="button"
              onClick={() => setMenuSidebarOpen(!menuSidebarOpen)}
              aria-expanded={menuSidebarOpen}
              aria-controls="lateral-menu"
              className={`bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B] hover:text-[#14649B] rounded-lg font-bold shrink-0 transition-all duration-200 flex items-center gap-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                isScrolled ? 'min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 text-xs' : 'min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs'
              }`}
            >
              {menuSidebarOpen ? <X className="w-3.5 h-3.5 text-[#C2185B]" /> : <Menu className="w-3.5 h-3.5 text-[#14649B]" />}
              <span>{menuSidebarOpen ? 'Ocultar' : 'Menú'}</span>
            </button>

            {/* Botón de Inicio */}
            <button 
              type="button"
              onClick={handleGoHome}
              className={`rounded-lg font-bold shrink-0 transition-all duration-200 text-xs focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                isScrolled ? 'min-h-[32px] sm:min-h-[34px] px-2.5 py-1' : 'min-h-[36px] sm:min-h-[38px] px-3 py-1.5'
              } ${
                level === 1 
                  ? 'bg-[#14649B] text-white shadow-xs' 
                  : 'bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B]'
              }`}
            >
              Inicio
            </button>

            {/* Los 4 Pilares oficiales de SAT: Contenedor fluido con scroll horizontal táctil */}
            <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-0.5">
              <div className={`flex items-center whitespace-nowrap pl-2.5 border-l border-[#DCDCDC] transition-all duration-300 ${
                isScrolled ? 'gap-2.5 md:gap-4' : 'gap-3 md:gap-5'
              }`}>
                {PILLARS_CONFIG.map((p) => (
                  <button 
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPillar(p.id)}
                    className={`relative font-semibold transition-colors shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                      isScrolled ? 'py-1 px-1 text-xs' : 'py-1.5 px-1 text-xs md:text-sm'
                    } ${
                      selectedPillar === p.id && level > 1 
                        ? 'text-[#14649B] font-extrabold' 
                        : 'text-slate-700 hover:text-[#14649B]'
                    }`}
                  >
                    {p.name}
                    {selectedPillar === p.id && level > 1 && (
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" 
                        style={{ backgroundColor: p.activeIndicatorColor }} 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </nav>

        </div>
      </header>

      {/* Two-column layout: Context-Aware Lateral Menu + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Mobile Backdrop for Off-Canvas Drawer (WCAG dialog overlay) */}
        {menuSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
            onClick={() => setMenuSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LATERAL MENU: Responsive Mobile Slide-in Drawer + Desktop Sticky Sidebar */}
        <aside 
          id="lateral-menu"
          aria-label="Navegación lateral de trámites"
          className={`
            fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs bg-white p-4 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out
            md:static md:w-68 lg:w-72 md:p-3 md:py-6 md:pl-6 md:pr-3 md:shadow-none md:z-auto md:overflow-y-visible md:translate-x-0
            ${menuSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
            ${isScrolled 
              ? 'md:top-[68px] md:h-[calc(100vh-68px)] md:overflow-y-auto' 
              : 'md:top-[98px] md:h-[calc(100vh-98px)] md:overflow-y-auto'
            }
            md:sticky shrink-0 space-y-3
          `}
        >
          {/* Header del drawer visible exclusivamente en móvil */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14649B]" />
              <span className="text-xs font-bold text-[#19324B] uppercase tracking-wider">Menú de Trámites</span>
            </div>
            <button
              type="button"
              onClick={() => setMenuSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#14649B]"
              aria-label="Cerrar menú lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* ESTRUCTURA TIPO TABLA (BORDES CONTINUOS, CERO GAPS) */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">

            {/* Nivel 1 Menu: Lista de Macro Grupos */}
            {level === 1 && (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14649B]" />
                    <h3 className="text-xs font-bold text-[#19324B] uppercase tracking-wider">Grupos Tributarios</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">4 Pilares</span>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {PILLARS_CONFIG.map((p) => {
                    const isSelected = selectedPillar === p.id;
                    return (
                      <button 
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPillar(p.id)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-[#14649B]/8 text-[#14649B] font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-[#14649B]'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#14649B] shadow-[0_0_8px_rgba(20,100,155,0.7)]" />
                        )}
                        <span className="truncate pr-2">{p.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isSelected ? 'text-[#14649B] translate-x-0.5' : 'text-slate-400 group-hover:text-[#14649B]'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nivel 2 Menu: Categorías dentro del Pilar */}
            {level === 2 && (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentPillarConfig.primaryColor }}
                    />
                    <h3 className="text-xs font-bold text-[#19324B] truncate">
                      {currentPillarConfig.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{categoriasInPillar.length}</span>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {categoriasInPillar.map((cat, idx) => {
                    const isSelected = selectedCategoria === cat;
                    return (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCategoria(cat)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-slate-100/70 font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && (
                          <span 
                            className="absolute left-0 top-0 bottom-0 w-1" 
                            style={{ 
                              backgroundColor: currentPillarConfig.primaryColor,
                              boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                            }}
                          />
                        )}
                        <span 
                          className="truncate pr-2"
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        >
                          {cat}
                        </span>
                        <ChevronRight 
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? 'translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nivel 3 Menu: Opciones dentro de la Categoría */}
            {level === 3 && (
              <div>
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentPillarConfig.primaryColor }}
                    />
                    <h3 className="text-xs font-bold text-[#19324B] truncate">{selectedCategoria}</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{subcategoriasInCategoria.length}</span>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {subcategoriasInCategoria.map((sub, idx) => {
                    const isSelected = selectedSubcategoria === sub;
                    return (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSubcategoria(sub)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-slate-100/70 font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && (
                          <span 
                            className="absolute left-0 top-0 bottom-0 w-1" 
                            style={{ 
                              backgroundColor: currentPillarConfig.primaryColor,
                              boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                            }}
                          />
                        )}
                        <span 
                          className="truncate pr-2"
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        >
                          {sub}
                        </span>
                        <ChevronRight 
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? 'translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nivel 4 Menu: Tabla continua sin gaps entre opciones */}
            {level === 4 && (
              <div>
                
                {/* Encabezado de la tabla */}
                <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: currentPillarConfig.primaryColor }}
                    />
                    <h3 className="text-xs font-bold text-[#19324B] tracking-tight truncate">
                      {selectedSubcategoria}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentSubcategoriaItems.length} {currentSubcategoriaItems.length === 1 ? 'trámite' : 'trámites'}
                  </span>
                </div>

                {/* Filas continuas de la tabla (sin gaps entre opciones) */}
                <div className="divide-y divide-slate-200/80">
                  {currentSubcategoriaItems.map((item) => {
                    const isSelected = selectedTramite?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectMenuGestion(item)}
                        className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                          isSelected 
                            ? 'bg-slate-100/70 font-bold' 
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {/* Barra que ilumina sutilmente al inicio de la fila activa */}
                        {isSelected && (
                          <span 
                            className="absolute left-0 top-0 bottom-0 w-1" 
                            style={{ 
                              backgroundColor: currentPillarConfig.primaryColor,
                              boxShadow: `0 0 8px ${currentPillarConfig.primaryColor}B3`
                            }}
                          />
                        )}
                        <span 
                          className="flex-1 pr-2 leading-snug"
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        >
                          {item.tramite}
                        </span>
                        <ChevronRight 
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? 'translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                          style={isSelected ? { color: currentPillarConfig.primaryColor } : undefined}
                        />
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

          {/* Enlace para volver al inicio */}
          <div className="px-1 flex items-center justify-between">
            <button 
              type="button"
              onClick={handleGoHome}
              className="text-xs text-[#14649B] hover:text-[#19324B] font-semibold flex items-center gap-1 group py-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B] rounded"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span>Volver al Inicio</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Portal SAT</span>
          </div>

        </aside>

        {/* RIGHT MAIN CONTENT: CARDS NAVIGATION UP TO 4TH LEVEL */}
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 bg-white focus:outline-hidden">
          
          {/* Breadcrumbs: SAT Design System Web v1.0 standard */}
          <div className={`flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl mx-auto' : ''}`}>
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
            <div className={`space-y-6 sm:space-y-8 max-w-4xl transition-all duration-300 ${!menuSidebarOpen ? 'mx-auto' : ''}`}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">Macro Grupos Oficiales</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">Seleccionar un Grupo Tributario</h2>
                <p className="text-sm text-slate-600">Explorar los requisitos oficiales y gestionar los trámites en línea.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {PILLARS_CONFIG.map((p) => (
                  <div 
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectPillar(p.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPillar(p.id); } }}
                    className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B]`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`text-base sm:text-lg font-bold text-[#19324B] ${p.titleHoverText} transition-colors`}>
                        {p.name}
                      </h3>
                      {/* Fondo redondo sutil con el signo > que pasa a fondo blanco y texto del color en hover */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">{p.desc}</p>
                    <div className={`text-xs font-bold pt-1 flex items-center gap-1.5 ${p.actionTextClass} transition-colors`}>
                      <span>Explorar este pilar</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 2: CARDS OF CATEGORIES
              ======================================================== */}
          {level === 2 && (
            <div className={`space-y-6 sm:space-y-8 max-w-4xl transition-all duration-300 ${!menuSidebarOpen ? 'mx-auto' : ''}`}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  Categorías de {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">Seleccionar una Categoría</h2>
                <p className="text-xs sm:text-sm text-slate-600">Elegir la categoría para consultar los trámites y gestiones correspondientes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {categoriasInPillar.map((cat, idx) => (
                  <div 
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectCategoria(cat)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectCategoria(cat); } }}
                    className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B]`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{cat}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">Acceder a las opciones y requisitos oficiales de {cat}.</p>
                    <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                      <span>Ver opciones</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 3: CARDS OF SUBCATEGORIES
              ======================================================== */}
          {level === 3 && (
            <div className={`space-y-6 sm:space-y-8 max-w-4xl transition-all duration-300 ${!menuSidebarOpen ? 'mx-auto' : ''}`}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  {selectedCategoria}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">Seleccionar una Gestión</h2>
                <p className="text-xs sm:text-sm text-slate-600">Seleccionar el tipo de trámite o gestión que desea consultar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {subcategoriasInCategoria.map((sub, idx) => (
                  <div 
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectSubcategoria(sub)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectSubcategoria(sub); } }}
                    className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B]`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{sub}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">Trámites y normativas vigentes correspondientes a {sub}.</p>
                    <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                      <span>Ver trámites</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 4: TRÁMITES & DETAIL CON ACCIÓN EN INFINITIVO
              ======================================================== */}
          {level === 4 && (
            <div className={`space-y-6 sm:space-y-8 transition-all duration-300 ${!menuSidebarOpen ? 'max-w-4xl mx-auto' : 'max-w-3xl'}`}>
              
              {selectedTramite ? (
                <div className="space-y-6 sm:space-y-8">
                  
                  {/* Título, Resumen y Barra de Acciones del Trámite */}
                  <div className="space-y-4 border-b border-[#DCDCDC]/60 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-[#14649B] uppercase tracking-wider block pb-1">
                          {selectedTramite.subcategoria}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight text-balance">
                          {selectedTramite.tramite}
                        </h2>
                      </div>

                      {/* Botones de acción funcional: Copiar enlace & Imprimir */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="min-h-[40px] px-3.5 py-2 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] bg-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B]"
                          aria-label="Copiar enlace directo al trámite"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                          <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="min-h-[40px] px-3.5 py-2 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] bg-white transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#14649B]"
                          aria-label="Imprimir ficha de trámite"
                        >
                          <Printer className="w-4 h-4 text-slate-600" />
                          <span>Imprimir</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {selectedTramite.descripcion}
                    </p>
                  </div>

                  {/* PUNTOS DE ESTA PÁGINA: Accesible, touch-friendly de 2 columnas en tablet/desktop */}
                  {selectedTramite.puntosMenu && (
                    <nav aria-label="Puntos de esta página" className="py-2 pb-4 border-b border-[#DCDCDC]/60 space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Puntos de esta página
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {selectedTramite.puntosMenu.map((punto) => (
                          <button
                            key={punto.id}
                            type="button"
                            onClick={() => scrollToSection(punto.id)}
                            className={`min-h-[38px] px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-left group transition-all text-xs border focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                              activeSectionId === punto.id 
                                ? 'bg-[#14649B]/10 border-[#14649B] text-[#14649B] font-bold shadow-xs' 
                                : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-[#14649B]/5 hover:border-[#14649B]/40 hover:text-[#14649B]'
                            }`}
                          >
                            <span className="leading-snug">{punto.titulo}</span>
                            <span className="text-slate-400 group-hover:text-[#14649B] text-xs shrink-0 font-mono" aria-hidden="true">↓</span>
                          </button>
                        ))}
                      </div>
                    </nav>
                  )}

                  {/* Requisitos por Modalidad si están presentes (Venta de Especies Fiscales) */}
                  {selectedTramite.requisitosPorModalidad && (
                    <div className="space-y-8">
                      
                      {/* Punto: Requisitos Notario Titular */}
                      <section id="requisitos-notario" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos como Notario Titular</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Requisitos obligatorios para la adquisición directa por parte del profesional Notario habilitado.</p>
                        
                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[0]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-notario-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button"
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Tercero Autorizado */}
                      <section id="requisitos-tercero" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Acreditar a un Tercero Autorizado (Procurador / Delegado)</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Documentación que debe presentar la persona designada por el Notario para realizar el retiro.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[1]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-tercero-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button"
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Patentados */}
                      <section id="requisitos-patentados" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4D8014]" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos como Patentado Autorizado</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Requisitos para personas individuales o jurídicas acreditadas con patente de expendio.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[2]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-pat-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <button 
                                key={idx} 
                                type="button"
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => handleToggleRequirement(reqKey)}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleToggleRequirement(reqKey);
                                  }
                                }}
                                className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                    </div>
                  )}

                  {/* Requisitos estándar si no tiene modalidades */}
                  {!selectedTramite.requisitosPorModalidad && selectedTramite.requisitos && (
                    <section id="requisitos" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Cumplir requisitos obligatorios</h3>
                      <div className="space-y-2.5">
                        {selectedTramite.requisitos.map((req, idx) => {
                          const reqKey = `${selectedTramite.id}-req-${idx}`;
                          const isChecked = !!checkedRequirements[reqKey];

                          return (
                            <button 
                              key={idx} 
                              type="button"
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={() => handleToggleRequirement(reqKey)}
                              onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                  e.preventDefault();
                                  handleToggleRequirement(reqKey);
                                }
                              }}
                              className={`w-full text-left p-3.5 sm:p-4 bg-white border rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#14649B] ${
                                isChecked ? 'border-emerald-500 bg-emerald-50/30 text-slate-600' : 'border-[#DCDCDC] text-slate-800 hover:border-slate-400'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                              </span>
                              <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Punto: Pasos del Trámite */}
                  {selectedTramite.pasos && (
                    <section id="pasos" className="scroll-mt-24 sm:scroll-mt-28 space-y-3.5 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Seguir los pasos para realizar el trámite</h3>
                      <div className="space-y-3">
                        {selectedTramite.pasos.map((paso, idx) => (
                          <div key={idx} className="p-3.5 sm:p-4 bg-white border border-[#DCDCDC] rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-3.5">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#14649B] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{paso}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Punto: Formulario Oficial */}
                  {selectedTramite.formulario && (
                    <section id="formulario" className="scroll-mt-24 sm:scroll-mt-28 space-y-3 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Llenar el formulario oficial de gestión</h3>
                      <div className="p-4 sm:p-5 bg-[#14649B]/5 border border-[#14649B]/20 rounded-xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-[#14649B] text-sm sm:text-base leading-snug">{selectedTramite.formulario}</span>
                          <span className="inline-flex items-center text-[11px] font-bold text-white bg-[#14649B] px-2.5 py-0.5 rounded-full w-fit">En línea 24/7</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Llenar en el portal oficial Declaraguate o Agencia Virtual. Al congelarlo se emite la boleta SAT-2000 para el pago presencial o electrónico.
                        </p>
                        <a 
                          href="https://declaraguate.sat.gob.gt" 
                          target="_blank" 
                          rel="noreferrer"
                          className="min-h-[40px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14649B] hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B] rounded"
                        >
                          <span>Ir al sistema de formularios Declaraguate</span>
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      </div>
                    </section>
                  )}

                  {/* Punto: Notas Importantes y Tarifas (TABLA DE DATOS RESPONSIVE WCAG 2.2) */}
                  <section id="notas" className="scroll-mt-24 sm:scroll-mt-28 space-y-4 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Revisar tarifas y notas importantes</h3>

                    {/* TABLA DE TARIFAS OFICIALES: Versión escritorio en tabla, versión móvil en tarjetas (Principio 9) */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                        Cuadro Oficial de Valores y Especies Fiscales
                      </div>

                      {/* Desktop Table View (>= 640px) */}
                      <div className="hidden sm:block border border-[#DCDCDC] rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100/80 text-[#19324B] font-bold border-b border-[#DCDCDC]">
                            <tr>
                              <th scope="col" className="p-3">Especie / Instrumento</th>
                              <th scope="col" className="p-3">Tarifa Oficial</th>
                              <th scope="col" className="p-3">Presentación / Detalle</th>
                              <th scope="col" className="p-3">Base Legal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#DCDCDC]/70 text-slate-700 bg-white">
                            <tr className="hover:bg-slate-50/70">
                              <td className="p-3 font-semibold text-[#19324B]">Papel Sellado Especial para Protocolos</td>
                              <td className="p-3 font-bold text-[#14649B]">Q10.00 / hoja</td>
                              <td className="p-3">Lote de 50 hojas (Q500.00) + 5 de comisión (55 hojas)</td>
                              <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 24</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70">
                              <td className="p-3 font-semibold text-[#19324B]">Comisión Notarial de Ley</td>
                              <td className="p-3 font-bold text-emerald-700">10% en especie</td>
                              <td className="p-3">5 hojas exentas entregadas por cada 50 adquiridas</td>
                              <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 28</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70">
                              <td className="p-3 font-semibold text-[#19324B]">Timbres Fiscales Notariales</td>
                              <td className="p-3 font-bold text-[#14649B]">Valores faciales</td>
                              <td className="p-3">Denominaciones desde Q0.50 hasta Q100.00</td>
                              <td className="p-3 text-slate-500 font-mono">Dto. 37-92 Art. 5</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70">
                              <td className="p-3 font-semibold text-[#19324B]">Razón Electrónica en Agencia Virtual</td>
                              <td className="p-3 font-bold text-[#14649B]">Tarifa específica</td>
                              <td className="p-3">Pago en línea con código QR de autenticidad</td>
                              <td className="p-3 text-slate-500 font-mono">Acuerdo Directorio</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card Transformation View (< 640px) */}
                      <div className="sm:hidden space-y-2.5">
                        <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                          <div className="font-bold text-[#19324B] text-sm">Papel Sellado Especial para Protocolos</div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Tarifa oficial:</span>
                            <span className="font-bold text-[#14649B] text-sm">Q10.00 por hoja</span>
                          </div>
                          <div className="text-[11px] text-slate-600">Lote de 50 hojas (Q500.00) + 5 hojas de comisión legal (55 hojas total).</div>
                          <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 24</div>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                          <div className="font-bold text-[#19324B] text-sm">Comisión Notarial de Ley</div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Beneficio legal:</span>
                            <span className="font-bold text-emerald-700 text-sm">10% en especie</span>
                          </div>
                          <div className="text-[11px] text-slate-600">5 hojas adicionales sin costo por cada lote de 50 hojas adquirido.</div>
                          <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 28</div>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-[#DCDCDC] rounded-xl space-y-1.5 text-xs">
                          <div className="font-bold text-[#19324B] text-sm">Timbres Fiscales y Razón Electrónica</div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Modalidad:</span>
                            <span className="font-bold text-[#14649B] text-sm">Física o Virtual</span>
                          </div>
                          <div className="text-[11px] text-slate-600">Estampillas físicas de distintas denominaciones o razón electrónica con QR en Agencia Virtual.</div>
                          <div className="text-[10px] text-slate-500 font-mono pt-1">Base: Decreto 37-92 Art. 5</div>
                        </div>
                      </div>
                    </div>

                    {/* Notas importantes en bloque accesible */}
                    {selectedTramite.notasImportantes && (
                      <div className="p-4 sm:p-5 bg-amber-50/70 border border-[#B45309]/30 rounded-2xl space-y-2.5 text-xs sm:text-sm text-slate-800">
                        {selectedTramite.notasImportantes.map((nota, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="text-[#B45309] font-black text-base shrink-0 leading-none mt-0.5" aria-hidden="true">•</span>
                            <p className="leading-relaxed">{nota}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Punto: Base Legal */}
                  {selectedTramite.baseLegal && (
                    <section id="base-legal" className="scroll-mt-24 sm:scroll-mt-28 space-y-2 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Consultar base legal y normativa aplicable</h3>
                      <div className="p-4 bg-slate-50 border border-[#DCDCDC] rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {selectedTramite.baseLegal}
                      </div>
                    </section>
                  )}

                  {/* Punto: Retiro en Agencias SAT (condicional) */}
                  {selectedTramite.puntosMenu.some(p => p.id === 'agencias') && (
                    <section id="agencias" className="scroll-mt-24 sm:scroll-mt-28 space-y-3 pt-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#19324B]">Retirar especies en Oficinas y Agencias Tributarias SAT</h3>
                      <div className="p-4 sm:p-5 bg-white border border-[#DCDCDC] rounded-xl space-y-2 text-xs sm:text-sm text-slate-700">
                        <p className="leading-relaxed">
                          Efectuar la recepción de las especies fiscales y la razón electrónica de correlativos de Papel de Protocolo en cualquier oficina o agencia tributaria de la SAT a nivel nacional.
                        </p>
                        <div className="text-xs text-[#14649B] font-semibold pt-1">
                          Horario habitual: Lunes a viernes de 08:00 a 16:00 horas (sin cerrar al mediodía).
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Punto: Enlace Oficial SAT */}
                  <section id="enlace" className="scroll-mt-24 sm:scroll-mt-28 pt-4 border-t border-[#DCDCDC]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#19324B] text-white rounded-xl shadow-xs">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base">Ir al trámite oficial en Portal SAT Guatemala</h4>
                        <p className="text-xs text-slate-300">Consultar los términos y condiciones directamente en el portal oficial.</p>
                      </div>
                      <a 
                        href={selectedTramite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto"
                        aria-label="Abrir trámite oficial en la SAT (se abre en pestaña nueva)"
                      >
                        <span>Abrir trámite oficial en la SAT</span>
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </section>

                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-[#19324B]">Trámites en {selectedSubcategoria}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {currentSubcategoriaItems.map((item) => (
                      <div 
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectMenuGestion(item)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectMenuGestion(item); } }}
                        className={`p-5 sm:p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14649B]`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-bold text-[#19324B] group-hover:text-white transition-colors">{item.tramite}</h4>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 group-hover:text-white/90 transition-colors line-clamp-2 leading-relaxed">{item.descripcion}</p>
                        <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                          <span>Ver trámite</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* Institutional SAT Footer conforming to Design System Web v1.0 and Safe Area */}
      <footer className="border-t border-[#DCDCDC] py-6 sm:py-8 px-4 sm:px-8 bg-white pb-[calc(1.5rem+var(--safe-bottom))]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="text-center sm:text-left leading-relaxed">
            © 2026 Superintendencia de Administración Tributaria — SAT Guatemala. SAT Design System Web v1.0.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#14649B] font-semibold">
            <a href="https://portal.sat.gob.gt" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Portal SAT</a>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <a href="https://declaraguate.sat.gob.gt" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Declaraguate</a>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <a href="https://portal.sat.gob.gt/portal/agencia-virtual/" target="_blank" rel="noreferrer" className="min-h-[36px] inline-flex items-center px-1 rounded hover:underline focus-visible:ring-2 focus-visible:ring-[#14649B]">Agencia Virtual</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
