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
    primaryColor: '#73B026',
    cardHoverBorder: 'hover:border-[#73B026]',
    cardHoverBg: 'hover:bg-[#73B026]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(115,176,38,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#73B026]/15 text-[#5B911B] group-hover:bg-white group-hover:text-[#73B026]',
    actionTextClass: 'text-[#5B911B] group-hover:text-white',
    activeIndicatorColor: '#73B026'
  },
  { 
    id: 'organismos_especiales', 
    name: '4. Organismos Especiales', 
    desc: 'Entidades no lucrativas, ONGs y misiones diplomáticas.',
    primaryColor: '#FF9E1B',
    cardHoverBorder: 'hover:border-[#FF9E1B]',
    cardHoverBg: 'hover:bg-[#FF9E1B]',
    cardHoverShadow: 'hover:shadow-[0_14px_30px_rgba(255,158,27,0.30)]',
    titleHoverText: 'group-hover:text-white',
    circleClasses: 'bg-[#FF9E1B]/15 text-[#D97706] group-hover:bg-white group-hover:text-[#FF9E1B]',
    actionTextClass: 'text-[#D97706] group-hover:text-white',
    activeIndicatorColor: '#FF9E1B'
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

  // Sidebar visibility
  const [menuSidebarOpen, setMenuSidebarOpen] = useState<boolean>(true);

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
  };

  const handleSelectCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const subItems = TRAMITES_DATA.filter(i => i.pillar === selectedPillar && i.categoria === cat);
    const firstSub = subItems[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(3);
  };

  const handleSelectSubcategoria = (sub: string) => {
    setSelectedSubcategoria(sub);
    const trms = TRAMITES_DATA.filter(i => i.pillar === selectedPillar && i.categoria === selectedCategoria && i.subcategoria === sub);
    const item = trms[0] || null;
    setSelectedTramite(item);
    setLevel(4);
  };

  // Immediate selection of gestion when clicked in the menu
  const handleSelectMenuGestion = (item: TramiteItem) => {
    setSelectedTramite(item);
    setActiveSectionId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll to in-page section with dynamic header offset
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isScrolled ? 76 : 106;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#19324B] font-sans antialiased flex flex-col selection:bg-[#14649B] selection:text-white">
      
      {/* SAT Institutional Gradient Stripe (Manual SAT Design System Web v1.0) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#19324B] via-[#14649B] to-[#19AFE1]" />

      {/* HEADER INTEGRAL: Todo el contenido permanece, compactando exclusivamente el espacio vertical al navegar */}
      <header className={`sticky top-0 z-40 bg-white border-b border-[#DCDCDC] shadow-xs transition-all duration-300 ${
        isScrolled ? 'py-1' : 'py-2.5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Fila 1: Marca Institucional completa e Input de Búsqueda mantenido */}
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            isScrolled ? 'py-0.5' : 'py-1'
          }`}>
            
            {/* Logotipo y Títulos Institucionales: siempre presentes */}
            <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={handleGoHome}>
              <div className="relative">
                <div className={`rounded-lg bg-[#19324B] group-hover:bg-[#14649B] flex items-center justify-center text-white font-black tracking-tight transition-all duration-300 shadow-xs ${
                  isScrolled ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
                }`}>
                  SAT
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FFB806]" />
              </div>
              
              <div>
                <span className={`text-[#14649B] uppercase tracking-wider block font-bold leading-tight transition-all duration-300 ${
                  isScrolled ? 'text-[9px]' : 'text-[10px]'
                }`}>
                  Portal Institucional
                </span>
                <span className={`font-extrabold text-[#19324B] tracking-tight leading-none transition-all duration-300 ${
                  isScrolled ? 'text-xs md:text-sm' : 'text-sm md:text-base'
                }`}>
                  Superintendencia de Administración Tributaria
                </span>
              </div>
            </div>

            {/* Input de Búsqueda: siempre presente y adaptativo en altura y ancho */}
            <div className={`relative transition-all duration-300 ${
              isScrolled ? 'w-48 sm:w-60 md:w-72' : 'w-64 md:w-80 lg:w-96'
            }`}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar trámites o requisitos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full bg-white border border-[#DCDCDC] rounded-lg text-xs text-[#19324B] placeholder:text-slate-400 focus:outline-none focus:border-[#14649B] focus:ring-2 focus:ring-[#14649B]/15 transition-all duration-300 ${
                    isScrolled ? 'h-[30px] pl-8 pr-3 text-xs' : 'h-[38px] pl-9 pr-4 text-xs md:text-sm'
                  }`}
                />
                <Search className={`text-slate-400 absolute left-2.5 transition-all duration-300 ${
                  isScrolled ? 'top-2 w-3.5 h-3.5' : 'top-2.5 w-4 h-4'
                }`} />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs ${
                      isScrolled ? 'top-1.5' : 'top-2.5'
                    }`}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Resultados interactivos de búsqueda en vivo */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#DCDCDC] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto divide-y divide-[#DCDCDC]/60">
                  {searchResults.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-3 hover:bg-[#14649B]/5 cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-bold text-[#14649B]">{res.tramite}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{res.descripcion}</div>
                      <div className="text-[10px] text-slate-400 pt-1 font-medium">{res.subcategoria} · {res.categoria}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Fila 2: Menú, Inicio y los 4 Pilares: siempre visibles, compactando espacio vertical */}
          <div className={`flex items-center gap-3 border-t border-[#DCDCDC]/50 transition-all duration-300 ${
            isScrolled ? 'pt-1 mt-1 text-xs' : 'pt-2 mt-2 text-xs md:text-sm'
          }`}>
            
            {/* Botón de Menú lateral */}
            <button 
              onClick={() => setMenuSidebarOpen(!menuSidebarOpen)}
              className={`bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B] hover:text-[#14649B] rounded-lg font-bold shrink-0 transition-all duration-300 flex items-center gap-1.5 shadow-xs ${
                isScrolled ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
              }`}
            >
              {menuSidebarOpen ? <X className="w-3.5 h-3.5 text-[#D9336E]" /> : <Menu className="w-3.5 h-3.5 text-[#14649B]" />}
              {menuSidebarOpen ? 'Ocultar' : 'Menú'}
            </button>

            {/* Botón de Inicio */}
            <button 
              onClick={handleGoHome}
              className={`rounded-lg font-bold shrink-0 transition-all duration-300 text-xs ${
                isScrolled ? 'px-2 py-0.5' : 'px-3 py-1'
              } ${
                level === 1 
                  ? 'bg-[#14649B] text-white shadow-xs' 
                  : 'bg-white border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B]'
              }`}
            >
              Inicio
            </button>

            {/* Los 4 Pilares oficiales de SAT */}
            <div className={`flex items-center whitespace-nowrap pl-3 border-l border-[#DCDCDC] transition-all duration-300 ${
              isScrolled ? 'gap-3 md:gap-4' : 'gap-4 md:gap-5'
            }`}>
              {PILLARS_CONFIG.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => handleSelectPillar(p.id)}
                  className={`relative font-medium transition-colors ${
                    isScrolled ? 'py-0.5 text-xs' : 'py-1 text-xs md:text-sm'
                  } ${
                    selectedPillar === p.id && level > 1 
                      ? 'text-[#14649B] font-extrabold' 
                      : 'text-[#19324B]/80 hover:text-[#14649B]'
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

        </div>
      </header>

      {/* Two-column layout: Context-Aware Lateral Menu + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* LATERAL MENU: TABLA LIMPIA SIN GAPS ENTRE OPCIONES */}
        {menuSidebarOpen && (
          <aside className={`w-full md:w-68 lg:w-72 p-3 md:py-6 md:pl-6 md:pr-3 shrink-0 md:sticky transition-all duration-300 space-y-3 ${
            isScrolled 
              ? 'md:top-[68px] md:h-[calc(100vh-68px)] md:overflow-y-auto' 
              : 'md:top-[98px] md:h-[calc(100vh-98px)] md:overflow-y-auto'
          }`}>
            
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
                    <span className="text-[10px] text-slate-400 font-mono">4 Pilares</span>
                  </div>
                  <div className="divide-y divide-slate-200/80">
                    {PILLARS_CONFIG.map((p) => {
                      const isSelected = selectedPillar === p.id;
                      return (
                        <button 
                          key={p.id}
                          onClick={() => handleSelectPillar(p.id)}
                          className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group ${
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
                            isSelected ? 'text-[#14649B] translate-x-0.5' : 'text-slate-300 group-hover:text-[#14649B]'
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
                    <span className="text-[10px] text-slate-400 font-mono">{categoriasInPillar.length}</span>
                  </div>
                  <div className="divide-y divide-slate-200/80">
                    {categoriasInPillar.map((cat, idx) => {
                      const isSelected = selectedCategoria === cat;
                      return (
                        <button 
                          key={idx}
                          onClick={() => handleSelectCategoria(cat)}
                          className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group ${
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
                              isSelected ? 'translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
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
                    <span className="text-[10px] text-slate-400 font-mono">{subcategoriasInCategoria.length}</span>
                  </div>
                  <div className="divide-y divide-slate-200/80">
                    {subcategoriasInCategoria.map((sub, idx) => {
                      const isSelected = selectedSubcategoria === sub;
                      return (
                        <button 
                          key={idx}
                          onClick={() => handleSelectSubcategoria(sub)}
                          className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group ${
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
                              isSelected ? 'translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
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
                    <span className="text-[10px] text-slate-400 font-mono">
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
                          onClick={() => handleSelectMenuGestion(item)}
                          className={`relative w-full flex items-center justify-between text-left px-3.5 py-2.5 transition-colors text-xs group ${
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
                              isSelected ? 'translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
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
                onClick={handleGoHome}
                className="text-xs text-[#14649B] hover:text-[#19324B] font-semibold flex items-center gap-1 group"
              >
                <span className="transition-transform group-hover:-translate-x-0.5">←</span>
                <span>Volver al Inicio</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">Portal SAT</span>
            </div>

          </aside>
        )}

        {/* RIGHT MAIN CONTENT: CARDS NAVIGATION UP TO 4TH LEVEL */}
        <main className="flex-1 p-6 md:p-10 space-y-8 bg-white">
          
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
                    className={`p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${p.cardHoverBorder} ${p.cardHoverBg} ${p.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`text-lg font-bold text-[#19324B] ${p.titleHoverText} transition-colors`}>
                        {p.name}
                      </h3>
                      {/* Fondo redondo sutil con el signo > que pasa a fondo blanco y texto del color en hover */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${p.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">{p.desc}</p>
                    <div className={`text-xs font-bold pt-1 flex items-center gap-1.5 ${p.actionTextClass} transition-colors`}>
                      <span>Explorar este pilar</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
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
                    className={`p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{cat}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">Acceder a las opciones y requisitos oficiales de {cat}.</p>
                    <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                      <span>Ver opciones</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
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
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#14649B] uppercase tracking-wider">
                  {selectedCategoria}
                </span>
                <h2 className="text-3xl font-black text-[#19324B] tracking-tight">Seleccionar una Gestión</h2>
                <p className="text-sm text-slate-600">Seleccionar el tipo de trámite o gestión que desea consultar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {subcategoriasInCategoria.map((sub, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectSubcategoria(sub)}
                    className={`p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3.5 group shadow-xs hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#19324B] group-hover:text-white transition-colors">{sub}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 group-hover:text-white/90 transition-colors leading-relaxed">Trámites y normativas vigentes correspondientes a {sub}.</p>
                    <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                      <span>Ver trámites</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
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
            <div className="space-y-8 max-w-3xl animate-fadeIn">
              
              {selectedTramite ? (
                <div className="space-y-8">
                  
                  {/* Título, Resumen y Barra de Acciones del Trámite */}
                  <div className="space-y-4 border-b border-[#DCDCDC]/60 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#14649B] uppercase tracking-wider block pb-1">
                          {selectedTramite.subcategoria}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-[#19324B] tracking-tight">
                          {selectedTramite.tramite}
                        </h2>
                      </div>

                      {/* Botones de acción funcional: Copiar enlace & Imprimir */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] transition-colors flex items-center gap-1.5"
                          title="Copiar enlace directo"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedLink ? '¡Copiado!' : 'Compartir'}
                        </button>

                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 text-xs font-bold border border-[#DCDCDC] rounded-lg hover:border-[#14649B] hover:text-[#14649B] transition-colors flex items-center gap-1.5"
                          title="Imprimir resumen"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Imprimir
                        </button>
                      </div>
                    </div>

                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {selectedTramite.descripcion}
                    </p>
                  </div>

                  {/* PUNTOS DE ESTA PÁGINA (ULTRA MINIMALISTA Y COMPACTO) */}
                  {selectedTramite.puntosMenu && (
                    <nav aria-label="Puntos de esta página" className="py-1 pb-3 border-b border-[#DCDCDC]/50 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-0.5">
                        Puntos de esta página
                      </div>
                      
                      <div className="divide-y divide-[#DCDCDC]/40">
                        {selectedTramite.puntosMenu.map((punto) => (
                          <button
                            key={punto.id}
                            onClick={() => scrollToSection(punto.id)}
                            className={`w-full py-1 flex items-center justify-between gap-2 text-left group transition-colors text-[11px] ${
                              activeSectionId === punto.id ? 'text-[#14649B] font-semibold' : 'text-slate-600 hover:text-[#14649B]'
                            }`}
                          >
                            <span className="leading-tight">{punto.titulo}</span>
                            <span className="text-slate-300 group-hover:text-[#14649B] text-[10px] shrink-0 font-mono">↓</span>
                          </button>
                        ))}
                      </div>
                    </nav>
                  )}

                  {/* Requisitos por Modalidad si están presentes (Venta de Especies Fiscales) */}
                  {selectedTramite.requisitosPorModalidad && (
                    <div className="space-y-8">
                      
                      {/* Punto: Requisitos Notario Titular */}
                      <section id="requisitos-notario" className="scroll-mt-20 md:scroll-mt-24 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#14649B]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Cumplir requisitos como Notario Titular</h3>
                        </div>
                        <p className="text-sm text-slate-600">Requisitos obligatorios para la adquisición directa por parte del profesional Notario habilitado.</p>
                        
                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[0]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-notario-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <div 
                                key={idx} 
                                onClick={() => handleToggleRequirement(reqKey)}
                                className={`p-4 bg-white border rounded-lg text-sm leading-relaxed flex items-start gap-3 transition-colors cursor-pointer ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/20 text-slate-600' : 'border-[#DCDCDC] text-slate-700'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Tercero Autorizado */}
                      <section id="requisitos-tercero" className="scroll-mt-20 md:scroll-mt-24 space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#19AFE1]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Acreditar a un Tercero Autorizado (Procurador / Delegado)</h3>
                        </div>
                        <p className="text-sm text-slate-600">Documentación que debe presentar la persona designada por el Notario para realizar el retiro.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[1]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-tercero-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <div 
                                key={idx} 
                                onClick={() => handleToggleRequirement(reqKey)}
                                className={`p-4 bg-white border rounded-lg text-sm leading-relaxed flex items-start gap-3 transition-colors cursor-pointer ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/20 text-slate-600' : 'border-[#DCDCDC] text-slate-700'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* Punto: Requisitos Patentados */}
                      <section id="requisitos-patentados" className="scroll-mt-20 md:scroll-mt-24 space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F]" />
                          <h3 className="text-xl font-bold text-[#19324B]">Cumplir requisitos como Patentado Autorizado</h3>
                        </div>
                        <p className="text-sm text-slate-600">Requisitos para personas individuales o jurídicas acreditadas con patente de expendio.</p>

                        <div className="space-y-2.5">
                          {selectedTramite.requisitosPorModalidad[2]?.requisitos.map((req, idx) => {
                            const reqKey = `${selectedTramite.id}-pat-${idx}`;
                            const isChecked = !!checkedRequirements[reqKey];

                            return (
                              <div 
                                key={idx} 
                                onClick={() => handleToggleRequirement(reqKey)}
                                className={`p-4 bg-white border rounded-lg text-sm leading-relaxed flex items-start gap-3 transition-colors cursor-pointer ${
                                  isChecked ? 'border-emerald-500 bg-emerald-50/20 text-slate-600' : 'border-[#DCDCDC] text-slate-700'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-3" />}
                                </span>
                                <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                    </div>
                  )}

                  {/* Requisitos estándar si no tiene modalidades */}
                  {!selectedTramite.requisitosPorModalidad && selectedTramite.requisitos && (
                    <section id="requisitos" className="scroll-mt-20 md:scroll-mt-24 space-y-4">
                      <h3 className="text-xl font-bold text-[#19324B]">Cumplir requisitos obligatorios</h3>
                      <div className="space-y-2.5">
                        {selectedTramite.requisitos.map((req, idx) => {
                          const reqKey = `${selectedTramite.id}-req-${idx}`;
                          const isChecked = !!checkedRequirements[reqKey];

                          return (
                            <div 
                              key={idx} 
                              onClick={() => handleToggleRequirement(reqKey)}
                              className={`p-4 bg-white border rounded-lg text-sm leading-relaxed flex items-start gap-3 transition-colors cursor-pointer ${
                                isChecked ? 'border-emerald-500 bg-emerald-50/20 text-slate-600' : 'border-[#DCDCDC] text-slate-700'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-3" />}
                              </span>
                              <span className={isChecked ? 'line-through text-slate-500' : ''}>{req}</span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Punto: Pasos del Trámite */}
                  {selectedTramite.pasos && (
                    <section id="pasos" className="scroll-mt-20 md:scroll-mt-24 space-y-4 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Seguir los pasos para realizar el trámite</h3>
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

                  {/* Punto: Formulario Oficial */}
                  {selectedTramite.formulario && (
                    <section id="formulario" className="scroll-mt-20 md:scroll-mt-24 space-y-3 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Llenar el formulario oficial de gestión</h3>
                      <div className="p-5 bg-[#14649B]/5 border border-[#14649B]/20 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#14649B] text-base">{selectedTramite.formulario}</span>
                          <span className="text-xs font-bold text-white bg-[#14649B] px-2 py-0.5 rounded">En línea 24/7</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Llenar en el portal oficial Declaraguate o Agencia Virtual. Al congelarlo se emite la boleta SAT-2000 para el pago presencial o electrónico.
                        </p>
                        <a 
                          href="https://declaraguate.sat.gob.gt" 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                        >
                          <span>Ir al sistema de formularios Declaraguate</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </section>
                  )}

                  {/* Punto: Notas Importantes y Tarifas */}
                  {selectedTramite.notasImportantes && (
                    <section id="notas" className="scroll-mt-20 md:scroll-mt-24 space-y-4 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Revisar tarifas y notas importantes</h3>
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
                    <section id="base-legal" className="scroll-mt-20 md:scroll-mt-24 space-y-2 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Consultar base legal y normativa aplicable</h3>
                      <div className="p-4 bg-slate-50 border border-[#DCDCDC] rounded-lg text-xs text-slate-600 leading-relaxed">
                        {selectedTramite.baseLegal}
                      </div>
                    </section>
                  )}

                  {/* Punto: Retiro en Agencias SAT (condicional) */}
                  {selectedTramite.puntosMenu.some(p => p.id === 'agencias') && (
                    <section id="agencias" className="scroll-mt-20 md:scroll-mt-24 space-y-3 pt-2">
                      <h3 className="text-xl font-bold text-[#19324B]">Retirar especies en Oficinas y Agencias Tributarias SAT</h3>
                      <div className="p-5 bg-white border border-[#DCDCDC] rounded-xl space-y-2 text-sm text-slate-700">
                        <p>
                          Efectuar la recepción de las especies fiscales y la razón electrónica de correlativos de Papel de Protocolo en cualquier oficina o agencia tributaria de la SAT a nivel nacional.
                        </p>
                        <div className="text-xs text-[#14649B] font-semibold pt-1">
                          Horario habitual: Lunes a viernes de 08:00 a 16:00 horas (sin cerrar al mediodía).
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Punto: Enlace Oficial SAT */}
                  <section id="enlace" className="scroll-mt-20 md:scroll-mt-24 pt-4 border-t border-[#DCDCDC]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#19324B] text-white rounded-xl">
                      <div>
                        <h4 className="font-bold text-base">Ir al trámite oficial en Portal SAT Guatemala</h4>
                        <p className="text-xs text-slate-300">Consultar los términos y condiciones directamente en el portal oficial.</p>
                      </div>
                      <a 
                        href={selectedTramite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#14649B] hover:bg-[#19AFE1] text-white font-bold text-xs rounded-lg transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                      >
                        <span>Abrir trámite oficial en la SAT</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
                        onClick={() => handleSelectMenuGestion(item)}
                        className={`p-6 bg-white border border-[#DCDCDC] rounded-[16px] ${currentPillarConfig.cardHoverBorder} ${currentPillarConfig.cardHoverBg} ${currentPillarConfig.cardHoverShadow} transition-all duration-300 cursor-pointer space-y-3 group shadow-xs hover:-translate-y-1`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-bold text-[#19324B] group-hover:text-white transition-colors">{item.tramite}</h4>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPillarConfig.circleClasses} shadow-xs`}>
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 group-hover:text-white/90 transition-colors line-clamp-2 leading-relaxed">{item.descripcion}</p>
                        <div className={`text-xs font-bold ${currentPillarConfig.actionTextClass} group-hover:text-white transition-colors pt-1 flex items-center gap-1.5`}>
                          <span>Ver trámite</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
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
