import type { SegmentId } from '../components/UserSegmentCards';

export interface GuidedRequirement {
  id: string;
  label: string;
  description: string;
  obligatorio: boolean;
}

export interface GuidedStep {
  numero: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  acciones: string[];
  notaVisual?: string;
}

export interface GuidedAssistant {
  id: string;
  codigoGestion: string;
  pilar: SegmentId;
  pilarName: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  tiempoEstimado: string;
  modalidad: string;
  baseLegal: string;
  urlOficial: string;
  requisitos: GuidedRequirement[];
  pasos: GuidedStep[];
}

export const GUIDED_ASSISTANTS: Record<string, GuidedAssistant> = {
  'primer-nit': {
    id: 'primer-nit',
    codigoGestion: 'SAT-GES-0001',
    pilar: 'contribuyentes',
    pilarName: 'Contribuyentes',
    categoria: 'Sin Obligaciones',
    titulo: 'Asistente Guiado: Solicitud de Primer NIT',
    subtitulo: 'Inscripción para Personas Individuales Nacionales y Extranjeras sin actividad mercantil',
    descripcion: 'Te guiamos paso a paso para obtener tu Número de Identificación Tributaria (NIT) en línea, verificar tus documentos y habilitar tus servicios digitales.',
    tiempoEstimado: '15 a 20 minutos',
    modalidad: '100% Digital en Línea',
    baseLegal: 'Código Tributario (Decreto 6-91, Arts. 112 y 120) y Acuerdo de Directorio SAT 08-2020.',
    urlOficial: 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/#1615485066841-639e67c5-51e3',
    requisitos: [
      {
        id: 'dpi',
        label: 'Documento Personal de Identificación (DPI)',
        description: 'DPI original vigente. Si eres extranjero, Pasaporte vigente.',
        obligatorio: true,
      },
      {
        id: 'factura_servicio',
        label: 'Factura de servicio básico (Agua, Luz o Teléfono)',
        description: 'Emitida en los últimos 3 meses para comprobar tu dirección de residencia.',
        obligatorio: true,
      },
      {
        id: 'correo_personal',
        label: 'Correo electrónico personal activo',
        description: 'Cuenta a la que tengas acceso inmediato para recibir el código de seguridad.',
        obligatorio: true,
      },
      {
        id: 'camara_dispositivo',
        label: 'Dispositivo con cámara o fotos legibles',
        description: 'Fotografía legible del DPI (ambos lados) en formato JPG o PDF.',
        obligatorio: false,
      },
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Verificación y Preparación de Documentos',
        subtitulo: 'Valida que tus requisitos cumplan con las especificaciones técnicas',
        descripcion: 'Antes de ingresar al portal de la SAT, asegúrate de tener tus documentos escaneados o fotografiados en alta resolución.',
        acciones: [
          'Verifica que tu DPI esté vigente y que la foto sea perfectamente legible.',
          'Escanea o toma foto a la factura de servicio donde aparezca la dirección exacta.',
          'Comprueba que tu correo electrónico esté abierto para recibir notificaciones.',
        ],
        notaVisual: 'Los archivos adjuntos no deben superar 5 MB por documento.',
      },
      {
        numero: 2,
        titulo: 'Registro de Datos en la Solicitud Electrónica',
        subtitulo: 'Completa el formulario oficial de inscripción en el portal SAT',
        descripcion: 'Ingresarás tus datos de identificación, domicilio fiscal y contacto personal.',
        acciones: [
          'Ingresa a la opción "Solicitud Electrónica de NIT" en el portal oficial.',
          'Escribe tus nombres, apellidos y fecha de nacimiento tal como constan en tu DPI.',
          'Ingresa tu dirección de residencia y adjunta el comprobante de servicio.',
          'Valida tu correo electrónico mediante el código de confirmación enviado.',
        ],
      },
      {
        numero: 3,
        titulo: 'Confirmación y Emisión de Constancia',
        subtitulo: 'Revisión por parte de la SAT y descarga de constancia',
        descripcion: 'La SAT validará la información con el Registro Nacional de las Personas (RENAP).',
        acciones: [
          'Recibirás un correo electrónico de confirmación con tu número de expediente.',
          'En un plazo de 24 a 48 horas hábiles se emitirá tu número de NIT.',
          'Ingresa al enlace del correo para descargar e imprimir tu constancia oficial del RTU.',
        ],
      },
    ],
  },

  'agencia-virtual': {
    id: 'agencia-virtual',
    codigoGestion: 'SAT-GES-0002',
    pilar: 'contribuyentes',
    pilarName: 'Contribuyentes',
    categoria: 'Sin Obligaciones',
    titulo: 'Asistente Guiado: Solicitud y Activación de Agencia Virtual',
    subtitulo: 'Habilitación de tu usuario de servicios en línea de la SAT',
    descripcion: 'Aprende a crear tu usuario en Agencia Virtual para realizar consultas, descargar constancias del RTU, emitir solvencias y realizar gestiones tributarias.',
    tiempoEstimado: '10 a 15 minutos',
    modalidad: 'Digital con validación biométrica/virtual',
    baseLegal: 'Acuerdo de Directorio SAT 08-2020 sobre Servicios Virtuales.',
    urlOficial: 'https://portal.sat.gob.gt/portal/solicitud-de-usuario-de-agencia-virtual/',
    requisitos: [
      {
        id: 'nit_activo',
        label: 'Número de Identificación Tributaria (NIT)',
        description: 'Tener NIT registrado previamente ante la SAT.',
        obligatorio: true,
      },
      {
        id: 'dpi_escaneado',
        label: 'DPI escaneado o en fotografía clara',
        description: 'Imagen legible del documento de identificación.',
        obligatorio: true,
      },
      {
        id: 'correo_rtu',
        label: 'Acceso al correo registrado en RTU',
        description: 'El correo electrónico asociado a tu NIT.',
        obligatorio: true,
      },
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Solicitud de Usuario en Línea',
        subtitulo: 'Llenado del formulario web de Agencia Virtual',
        descripcion: 'Ingresa tus datos personales para solicitar la apertura de la cuenta.',
        acciones: [
          'Haz clic en "Solicitar usuario de Agencia Virtual" en el portal SAT.',
          'Ingresa tu NIT y fecha de nacimiento.',
          'Confirma la dirección de correo electrónico registrada.',
        ],
      },
      {
        numero: 2,
        titulo: 'Validación de Identidad',
        subtitulo: 'Acreditación de titularidad de la cuenta',
        descripcion: 'Verifica tu identidad mediante enlace seguro enviado a tu correo o grabación biométrica.',
        acciones: [
          'Abre el enlace de verificación enviado a tu bandeja de entrada.',
          'Sube la fotografía de tu DPI de ambos lados.',
          'Sigue las instrucciones en pantalla para la prueba de vida o confirmación.',
        ],
      },
      {
        numero: 3,
        titulo: 'Creación de Contraseña y Primer Acceso',
        subtitulo: 'Ingreso a la plataforma de Agencia Virtual',
        descripcion: 'Define tu clave de acceso personal e ingresa por primera vez.',
        acciones: [
          'Crea una contraseña segura con mayúsculas, minúsculas y números.',
          'Acepta los términos de uso de la plataforma digital.',
          'Accede a tu panel principal para consultar tu constancia RTU y estado fiscal.',
        ],
      },
    ],
  },

  'pequeno-contribuyente': {
    id: 'pequeno-contribuyente',
    codigoGestion: 'SAT-GES-0011',
    pilar: 'contribuyentes',
    pilarName: 'Contribuyentes',
    categoria: 'Pequeños Contribuyentes',
    titulo: 'Asistente Guiado: Inscripción en Pequeño Contribuyente',
    subtitulo: 'Régimen simplificado con tarifa fija del 5% del IVA',
    descripcion: 'Orientación para inscribirte o cambiarte al Régimen de Pequeño Contribuyente si tus ventas o servicios no superan los Q150,000.00 anuales.',
    tiempoEstimado: '15 minutos',
    modalidad: 'En línea mediante Agencia Virtual',
    baseLegal: 'Ley del IVA (Decreto 27-92, Arts. 45 al 50).',
    urlOficial: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    requisitos: [
      {
        id: 'agencia_activa',
        label: 'Usuario activo de Agencia Virtual',
        description: 'Acceso habilitado a la plataforma de Agencia Virtual.',
        obligatorio: true,
      },
      {
        id: 'estimacion_ingresos',
        label: 'Estimación de ventas anuales ≤ Q150,000.00',
        description: 'Tus ingresos brutos no deben exceder este tope anual.',
        obligatorio: true,
      },
      {
        id: 'fel_habilitado',
        label: 'Disponibilidad para Factura Electrónica (FEL)',
        description: 'Emisión de facturas electrónicas gratuitas desde la app o portal.',
        obligatorio: true,
      },
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Actualización de Datos en RTU Digital',
        subtitulo: 'Selección del régimen tributario',
        descripcion: 'Ingresa a tu Agencia Virtual y dirígete al apartado de RTU Digital.',
        acciones: [
          'Haz clic en "RTU Digital" > "Actualización de Datos".',
          'En la sección de Actividad Económica, ingresa tu giro de negocio o servicio profesional.',
          'Selecciona el "Régimen de Pequeño Contribuyente (Tarifa 5%)".',
        ],
      },
      {
        numero: 2,
        titulo: 'Habilitación del Emisor FEL',
        subtitulo: 'Configuración del sistema de Facturación Electrónica en Línea',
        descripcion: 'Activa la emisión gratuita de facturas electrónicas desde la app de la SAT.',
        acciones: [
          'Ingresa a la sección "Facturas Electrónicas (FEL)".',
          'Selecciona la opción "Acreditarse como Emisor".',
          'Genera tu firma electrónica personal de forma gratuita con tu clave.',
        ],
      },
      {
        numero: 3,
        titulo: 'Presentación de Declaraciones Mensuales',
        subtitulo: 'Pago mensual del 5% en Declaraguate (Formulario SAT-2046)',
        descripcion: 'Conoce la fecha de vencimiento y cómo presentar tu declaración cada mes.',
        acciones: [
          'Ingresa a Declaraguate.sat.gob.gt y selecciona el formulario SAT-2046.',
          'Declara el total de ventas facturadas en el mes anterior.',
          'Paga el impuesto del 5% en banca en línea o en ventanilla bancaria.',
        ],
      },
    ],
  },

  'e-traspaso': {
    id: 'e-traspaso',
    codigoGestion: 'SAT-GES-0025',
    pilar: 'profesionales',
    pilarName: 'Profesionales',
    categoria: 'Abogados y Notarios',
    titulo: 'Asistente Guiado: Traspaso Electrónico Vehicular (e-Traspaso)',
    subtitulo: 'Procedimiento digital para transferencia de dominio de vehículos',
    descripcion: 'Guía para Notarios activos en la realización del traspaso electrónico de vehículos sin necesidad de acudir físicamente a la agencia tributaria.',
    tiempoEstimado: '20 minutos',
    modalidad: 'Electrónico Notarial en Agencia Virtual',
    baseLegal: 'Ley del ISCV (Decreto 70-94) y Acuerdo de Directorio 08-2020.',
    urlOficial: 'https://portal.sat.gob.gt/portal/traspaso-de-vehiculos/',
    requisitos: [
      {
        id: 'notario_activo',
        label: 'Notario colegiado activo con Agencia Virtual',
        description: 'Estar registrado y habilitado como Notario ante la SAT.',
        obligatorio: true,
      },
      {
        id: 'tarjeta_titulo_digital',
        label: 'Título de Propiedad y Tarjeta digitales',
        description: 'Vehículo en estado activo y con distintivos electrónicos.',
        obligatorio: true,
      },
      {
        id: 'solvencia_iscv',
        label: 'Impuesto de Circulacion (ISCV) al día',
        description: 'Tanto vendedor como comprador deben contar con Solvencia Fiscal.',
        obligatorio: true,
      },
    ],
    pasos: [
      {
        numero: 1,
        titulo: 'Iniciación del Traspaso Notarial',
        subtitulo: 'Ingreso de datos del vendedor, comprador y vehículo',
        descripcion: 'El Notario autoriza el trámite en su perfil de Agencia Virtual.',
        acciones: [
          'El Notario ingresa a Agencia Virtual > "Servicios Notariales" > "e-Traspaso".',
          'Ingresa las placas del vehículo y los NIT del comprador y vendedor.',
          'Sube el certificado digital del acta notarial de juramentación.',
        ],
      },
      {
        numero: 2,
        titulo: 'Aprobación de Vendedor y Comprador',
        subtitulo: 'Aceptación digital en las cuentas de Agencia Virtual',
        descripcion: 'Tanto el vendedor como el comprador autorizan la transacción desde sus respectivas cuentas.',
        acciones: [
          'El vendedor ingresa a su Agencia Virtual y aprueba el traspaso de dominio.',
          'El comprador ingresa a su Agencia Virtual, confirma la recepción y realiza el pago del IVA del traspaso.',
        ],
      },
      {
        numero: 3,
        titulo: 'Emisión Inmediata de Distintivos',
        subtitulo: 'Descarga de nueva Tarjeta de Circulación y Título',
        descripcion: 'El sistema emite automáticamente los nuevos documentos a nombre del comprador.',
        acciones: [
          'El nuevo propietario descarga la Tarjeta de Circulación en PDF con código QR.',
          'Descarga el Título de Propiedad Vehicular electrónico.',
          'El trámite queda registrado inmediatamente en la base de datos fiscal.',
        ],
      },
    ],
  },
};
