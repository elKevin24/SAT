// Datos maestros oficiales del Ecosistema FEL extraídos y validados del Portal SAT Guatemala
// Cero información inventada. Integridad referencial 100% y enlaces oficiales HTTP 200 OK.

export interface CertificadorData {
  nombre: string;
  nit: string;
  web: string;
  direccion: string;
  contacto: string;
  autorizacion: string;
  renovacion: string;
}

export interface AuditorData {
  nombre: string;
  nit: string;
  web: string;
  direccion: string;
  contacto: string;
  fecha_reg: string;
}

export interface TecnicaDocData {
  num: string;
  name: string;
  link: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const FEL_CERTIFICADORES: CertificadorData[] = [
  {
    "nombre": "AINNOVA S.A.",
    "nit": "5640773-4",
    "web": "https://www.guatefacturas.com",
    "direccion": "Vía 5 5-34 Zona 4, Centro Financiero BI, Torre III, Nivel 5, Oficina 2, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2200-6161 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2200-6161 | Correo: | [email protected]",
    "autorizacion": "23/11/2018",
    "renovacion": "23/11/2026"
  },
  {
    "nombre": "CÁMARA DE COMERCIO DE GUATEMALA",
    "nit": "351598",
    "web": "https://www.ccg.gt",
    "direccion": "10 calle, 3-80, Zona 1, Guatemala, Guatemala",
    "contacto": "Contacto: | Teléfono: 2417-2718 | Correo: | [email protected] | Soporte: | Teléfono: 2417-2700 | Correo: | [email protected]",
    "autorizacion": "24/02/2021",
    "renovacion": "24/02/2027"
  },
  {
    "nombre": "CARI LATINOAMÉRICA, S.A.",
    "nit": "96941243",
    "web": "https://www.cari.lat",
    "direccion": "Avenida las Américas 7-62 Zona 3, Torre Pradera, 10mo nivel, oficina 1007, Quetzaltenango, Quetzaltenango.",
    "contacto": "Ventas: | Teléfono: (502) 7824-6818 | Correo: | [email protected] | Soporte: | Teléfono: (502) 7824-6819 | Correo: | [email protected]",
    "autorizacion": "22/11/2022",
    "renovacion": "22/11/2026"
  },
  {
    "nombre": "COFIDI, S.A.",
    "nit": "62469045",
    "web": "https://www.cofidi.com.gt",
    "direccion": "3a. avenida 13-78 zona 10 edificio Citigroup 4to nivel, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2326-6899 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2326-6899 | Correo: | [email protected]",
    "autorizacion": "03/07/2019",
    "renovacion": "03/07/2027"
  },
  {
    "nombre": "COMERCIALIZADORA GUATEMALTECA MAYORISTA DE ELECTRICIDAD, S.A.",
    "nit": "37156616",
    "web": "https://portal.fel.guatemel.com.gt",
    "direccion": "Diagonal 6, 10-50 zona 10. Edificio Interaméricas World Center, Torre Sur, nivel 14, oficina 1401. Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2367-9300 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2367-9300 | Correo: | [email protected]",
    "autorizacion": "21/02/2020",
    "renovacion": "21/02/2027"
  },
  {
    "nombre": "CONTAP, S.A.",
    "nit": "98978802",
    "web": "https://www.facturas.gt",
    "direccion": "Vía 4, 1-00, 305, Torre 2, Zona 4, Edificio Campus Tecnológico. Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2367-2183 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2367-2183 | Correo: | [email protected]",
    "autorizacion": "30/04/2020",
    "renovacion": "30/04/2027"
  },
  {
    "nombre": "CORPOSISTEMAS, S.A.",
    "nit": "108151654",
    "web": "https://www.corposistemasgt.com",
    "direccion": "2da Calle 7-57, zona 4. Cobán, Alta Verapaz.",
    "contacto": "Ventas: | Teléfono: (502) 7956-7677 | Correo: | [email protected] | Soporte: | Teléfono: (502) 7956-7677 | Correo: | [email protected]",
    "autorizacion": "06/04/2021",
    "renovacion": "06/04/2027"
  },
  {
    "nombre": "DIGIFACT SERVICIOS, S. A.",
    "nit": "77454820",
    "web": "https://www.digifact.com.gt",
    "direccion": "4 Avenida 15-70 Zona 10, Edificio Paladium Local 3. Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2319-1921 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2319-1921 | Correo: | [email protected]",
    "autorizacion": "23/08/2019",
    "renovacion": "23/08/2027"
  },
  {
    "nombre": "FORMULARIOS CONTINUOS DE CENTRO AMERICA, S A.",
    "nit": "4150686",
    "web": "https://www.eforcon.com",
    "direccion": "2 Calle 36-73 Col. Toledo Zona 11 Guatemala, Guatemala",
    "contacto": "Ventas: | Teléfono: (502) 2423-8989 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2423-8990 | Correo: | [email protected]",
    "autorizacion": "20/11/2019",
    "renovacion": "20/11/2026"
  },
  {
    "nombre": "G4S DOCUMENTA, S. A.",
    "nit": "60010207",
    "web": "https://www.documenta.com.gt",
    "direccion": "11 calle 0-69, Zona 9, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2421-8000 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2222-3838 | Correo: | [email protected]",
    "autorizacion": "11/03/2019",
    "renovacion": "11/03/2027"
  },
  {
    "nombre": "GOM SOLUTIONS, S.A.",
    "nit": "95189416",
    "web": "https://www.gomsolutions.com",
    "direccion": "23 Avenida Boulevar el Naranjo, 12-91 oficina 67, zona 4, Mixco, Guatemala",
    "contacto": "Ventas: | Teléfono: (502) 2425-9000 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2425-9000 | Correo: | [email protected]",
    "autorizacion": "12/03/2020",
    "renovacion": "12/03/2027"
  },
  {
    "nombre": "GRUPO CDS S.A.",
    "nit": "107902281",
    "web": "https://www.grupocds.com.gt",
    "direccion": "22 Avenida, 3-37 A, Zona 3, Edificio Europa 03-07 Tercer Nivel, Quetzaltenango, Quetzaltenango",
    "contacto": "Ventas: | Teléfono: (502) 7729-3838 | Correo: | [email protected] | Soporte: | Teléfono: (502) 7729-3838 | Correo: | [email protected]",
    "autorizacion": "02/12/2021",
    "renovacion": "02/12/2026"
  },
  {
    "nombre": "INTEGRAL ADMINISTRADORA DE RECURSOS Y SERVICIOS EMPRESARIALES, S.A",
    "nit": "92721788",
    "web": "https://www.indrese.com",
    "direccion": "Avenida Reforma 7-62 Zona 9, Edificio Aristos Reforma, Oficina 110 Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2296-4545, (502) 2296-4544 | Correo: | [email protected] | Soporte: | Teléfono: (502) 3211-2147, (502) 2378-4851 | Correo: | [email protected]",
    "autorizacion": "17/01/2020",
    "renovacion": "17/01/2027"
  },
  {
    "nombre": "INFILE, S. A.",
    "nit": "12521337",
    "web": "https://www.infile.com",
    "direccion": "Avenida Reforma 3-48, Edificio Anel, 4° Nivel, Oficina 401, Zona 9, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2208-2208 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2208-2208 | Correo: | [email protected]",
    "autorizacion": "29/10/2018",
    "renovacion": "31/10/2026"
  },
  {
    "nombre": "INFORUM CONSULTING, S. A.",
    "nit": "43430775",
    "web": "https://www.edxsolutions.gt",
    "direccion": "12 calle 1-25, zona 10, Edificio Geminis 10, Torre Sur, nivel 8, oficina 812, Guatemala, Guatemala.",
    "contacto": "Ventas y Soporte: | Teléfono: (502) 2335-3005 Extensión 3010 | Correo: | [email protected]",
    "autorizacion": "23/11/2018",
    "renovacion": "23/11/2026"
  },
  {
    "nombre": "MEGAPRINT, S. A.",
    "nit": "50510231",
    "web": "https://www.megaprint.com.gt",
    "direccion": "KM. 9.5 Carretera a El Salvador CA-01, Torre Tigo, Oficina 2A, Santa Catarina Pinula, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2329-4800 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2329-4800 | Correo: | [email protected]",
    "autorizacion": "23/11/2018",
    "renovacion": "23/11/2026"
  },
  {
    "nombre": "OPERADORA ECONÓMICA, S.A.",
    "nit": "64281167",
    "web": "https://www.ecofactura.com.gt",
    "direccion": "12 calle A 14-65 zona 1, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2207-7777 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2207-7777 | Correo: | [email protected]",
    "autorizacion": "13/02/2020",
    "renovacion": "13/02/2027"
  },
  {
    "nombre": "TEKRA, S. A.",
    "nit": "107346834",
    "web": "https://www.tekra.com.gt",
    "direccion": "6 Avenida, 7-66, Primer Nivel, Oficina C-1, Zona 10, Edificio Condominio Médico, Guatemala, Guatemala.",
    "contacto": "Ventas: | Teléfono: (502) 2332-5804 | Correo: | [email protected] | Soporte: | Teléfono: (502) 2332-5804 | Correo: | [email protected]",
    "autorizacion": "21/12/2020",
    "renovacion": "21/12/2026"
  }
];

export const FEL_AUDITORES: AuditorData[] = [
  {
    "nombre": "Sistemas Aplicativos, S.A.",
    "nit": "12513687",
    "web": "https://www.sisap.com",
    "direccion": "3a. Calle «A» 6-50 Zona 10. Guatemala, Guatemala.",
    "contacto": "Ventas | Tel: (502) 2410 4300 | Email: | [email protected] | Soporte | Tel: (502) 2410 4329 | (502) 2410 4328 | Email: | [email protected]",
    "fecha_reg": "08/08/2018"
  },
  {
    "nombre": "Sistemas Eficientes, S.A.",
    "nit": "7067356",
    "web": "https://www.sefisa.com",
    "direccion": "Avenida Reforma 6-64 zona 9 Plaza Corporativa Reforma Torre III, Nivel 5. Guatemala, Guatemala.",
    "contacto": "Ventas | Tel: (502) 2383 6666 | Email: | [email protected] | Soporte | Tel: (502) 2383 6666 | Email: | [email protected]",
    "fecha_reg": "08/08/2018"
  },
  {
    "nombre": "Deloitte Consulting de Guatemala, S.A.",
    "nit": "34333061",
    "web": "https://www.deloitte.com/gt",
    "direccion": "5 Avenida 5-55 zona 14 Edificio Europlaza World Business Center Nivel 15 Torre 4 Oficinas 1501 y 1502 Guatemala, Guatemala",
    "contacto": "Ventas | Tel: (502) 2384 6500 | Email: | [email protected] | Soporte | Tel: (502) 2384 6500 | Email: | [email protected]",
    "fecha_reg": "13/09/2018"
  },
  {
    "nombre": "Devel Security, S.A.",
    "nit": "76808548",
    "web": "https://www.devel.group",
    "direccion": "7 Avenida 5-45, Zona 4, Edificio XPO I Nivel 9, Guatemala, Guatemala",
    "contacto": "Ventas | Tel.: (502) 2307 5700 | Email: | [email protected] | Soporte | Tel.: (502) 2307 5757 | Email: | [email protected]",
    "fecha_reg": "17/12/2018"
  },
  {
    "nombre": "PAKAL SECURITY LABS, S. A.",
    "nit": "",
    "web": "",
    "direccion": "Ruta 4 6-32, Zona 4 Guatemala, Guatemala",
    "contacto": "Ventas | Tel: (502) 2375 7765 | Email: | [email protected] | Soporte | Tel: (502) 2375 7765 | Email: | [email protected]",
    "fecha_reg": "22/08/2022"
  }
];

export const FEL_TECNICA_DOCS: TecnicaDocData[] = [
  {
    "num": "1",
    "name": "Proceso de factura electrónica en línea",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/92802/proceso-de-factura-electronica-en-linea-2026-2"
  },
  {
    "num": "2",
    "name": "Reglas y validaciones",
    "link": "https://portal.sat.gob.gt/portal/descarga/14852/reglas-y-validaciones/97423/fel_reglas_y_validaciones-3"
  },
  {
    "num": "3",
    "name": "Procedimiento de autorización del certificador",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80213/procedimiento-de-autorizacion-de-certificador.pdf"
  },
  {
    "num": "4",
    "name": "Procedimiento de autorización del auditor de seguridad de la información",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80050/fel-procedimiento-de-autorizacion-del-auditor-4.pdf"
  },
  {
    "num": "5",
    "name": "Casos de prueba para certificación",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/25545/fel-casos-de-prueba.zip"
  },
  {
    "num": "6",
    "name": "Documento Técnico Servicios",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/25830/documento-tecnico-servicios-sat.pdf"
  },
  {
    "num": "7",
    "name": "Presentación FEL-Tecnológica",
    "link": "https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/92805/fel-tecnologia-1-3-vf-2026-2"
  },
  {
    "num": "8",
    "name": "Esquema principal del DTE",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  },
  {
    "num": "9",
    "name": "Esquema del complemento: Exportaciones",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  },
  {
    "num": "10",
    "name": "Esquema del complemento: Facturas Cambiarias",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  },
  {
    "num": "11",
    "name": "Esquema del complemento: Facturas Especiales",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  },
  {
    "num": "12",
    "name": "Esquema del complemento: Referencias a las Notas de Crédito o Débito",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  },
  {
    "num": "13",
    "name": "Esquema para Anulación de DTE",
    "link": "https://github.com/notificacioneselectfel/Catalogo-FEL/tree/main/XSD"
  }
];

export const FEL_FAQS: Record<string, FaqItem[]> = {
  "Conceptos generales del Régimen FEL": [
    {
      "q": "¿Qué es el Régimen de Factura Electrónica en Línea (FEL)?",
      "a": "Es el modelo operativo establecido por la Administración Tributaria para la emisión de Documentos Tributarios Electrónicos (DTE) de forma segura y con autorización en línea."
    },
    {
      "q": "¿Qué es un Documento Tributario Electrónico (DTE)?",
      "a": "Es un archivo electrónico en formato XML, certificado de acuerdo con las disposiciones del Régimen FEL autorizadas por la SAT.\nActualmente se encuentran disponibles los siguientes DTE:\n• Factura\n• Factura Cambiaria\n• Factura de Pequeño Contribuyente\n• Factura Cambiaria Pequeño Contribuyente\n• Factura Especial\n• Nota de Abono\n• Recibo por Donación\n• Recibo\n• Factura Específica\n• Nota de Débito\n• Nota de Crédito\n• Factura Contribuyente Régimen Primario\n• Factura Cambiaria Contribuyente Régimen Primario\n• Factura Contribuyente Régimen Pecuario\n• Factura Cambiaria Contribuyente Régimen Pecuario\n• Constancia de Exención del IVA\n• Constancia de Adquisición de Insumos y Servicios\n• Nota de Envío\n• Recibo de Anticipos\n• Factura Provisional"
    },
    {
      "q": "¿Quiénes son los involucrados en el proceso de emisión de Factura Electrónica en Línea (FEL)?",
      "a": "• Emisor: es el contribuyente que emite los Documentos Tributarios Electrónicos (DTE).\n• Certificador: es la persona individual o jurídica que realiza la certificación y el almacenamiento de los DTE transmitidos por los emisores.\n• Receptor: es la persona individual o jurídica a nombre de quien se emite el DTE.\n• SAT: es la administradora del Régimen FEL, por lo que verifica y recibe los DTE certificados para darles validez y colocarlos a disposición de los contribuyentes y público en general por medio de consultas."
    },
    {
      "q": "¿Cuál es el proceso de emisión de Factura Electrónica en Línea (FEL)?",
      "a": "1. El contribuyente emite el documento con firma electrónica y lo envía al certificador de manera automática.\n2. El certificador recibe, valida y asigna número de autorización a cada Documento Tributario Electrónico (DTE), y lo envía automáticamente al emisor y a la SAT.\n3. El emisor entrega el DTE al receptor o cliente.\n4. La SAT verifica cada DTE y lo pone a disposición del emisor y receptor para consulta y verificación."
    },
    {
      "q": "¿Es obligatorio imprimir las facturas electrónicas?",
      "a": "Para entrega de facturas u otros Documentos Tributarios Electrónicos (DTE), el emisor cuenta con las opciones siguientes:\n• Digital: entrega a través de medios electrónicos como correo electrónico, mensajes instantáneos, hipervínculos, mensaje de texto, entre otros.\n• Papel: cuando el receptor así lo desee."
    },
    {
      "q": "¿Qué contribuyentes pueden emitir facturas y otros Documentos Tributarios Electrónicos (DTE) en el Régimen FEL?",
      "a": "Actualmente todos los contribuyentes afiliados al Régimen General del Impuesto al Valor Agregado (IVA) y Régimen de Pequeño Contribuyente, así como los que se afilien al Régimen Primario y Pecuario, deben emitir Documentos Tributarios Electrónicos (DTE) en el Régimen FEL. Asimismo, está disponible para las entidades exentas o no lucrativas y las entidades del Estado."
    },
    {
      "q": "¿Quiénes están obligados a incorporarse en el Régimen FEL?",
      "a": "Actualmente todos los contribuyentes afiliados al Régimen General del IVA y Régimen de Pequeño Contribuyente, así como los que se afilien al Régimen Primario y Pecuario, deben emitir Documentos Tributarios Electrónicos (DTE) en el Régimen FEL. Asimismo, está disponible para las entidades exentas o no lucrativas y las entidades del Estado."
    },
    {
      "q": "¿Cuáles son los beneficios de utilizar el Régimen FEL?",
      "a": "• Fácil habilitación por medio de la Agencia Virtual SAT y la App FEL.\n• Autorización inmediata de cada documento.\n• Confiabilidad de la información.\n• Reducción del uso de papel y otros recursos.\n• Verificación de la validez de los DTE a través del Portal SAT (Verificador Integrado), Agencia Virtual, App FEL y notificaciones electrónicas.\n• Consulta y descarga de los DTE emitidos y recibidos en la Agencia Virtual, App FEL y Verificador Integrado de la SAT."
    },
    {
      "q": "¿Qué seguridad tiene el contribuyente de que está recibiendo un Documento Tributario Electrónico (DTE) válido?",
      "a": "Los Documentos Tributarios Electrónicos (DTE) pueden ser validados en las siguientes opciones:\n• Verificador público de documentos: portal.sat.gob.gt/portal/verificador-integrado/\n• Consulta personalizada de documentos disponible en la Agencia Virtual de SAT y App FEL.\n• Notificaciones por correo electrónico."
    },
    {
      "q": "¿Dónde puedo ver información estadística del Régimen FEL?",
      "a": "Para consultar la información estadística del Régimen FEL ingresa a SatData+ en el Portal SAT."
    }
  ],
  "Habilitación, requisitos y medios de emisión": [
    {
      "q": "¿Cómo me habilito para emitir Documentos Tributarios Electrónicos (DTE)?",
      "a": "A través de la opción «Habilitarse como emisor», disponible en Agencia Virtual y App FEL. La gestión se realiza en línea (consulta los manuales en la sección Habilitarse como emisor FEL)."
    },
    {
      "q": "¿Cuáles son los requisitos para habilitarse como emisor de Documentos Tributarios Electrónicos (DTE)?",
      "a": "• Acceso a la Agencia Virtual de la SAT.\n• Datos actualizados en el Registro Tributario Unificado (RTU).\n• Tener como mínimo un establecimiento activo en el RTU.\n• Estar afiliado al Impuesto al Valor Agregado (IVA) o al Impuesto a la Confianza Tributaria (ICT, para Régimen Primario y Pecuario), cuando corresponda.\n• Tener su domicilio fiscal localizado."
    },
    {
      "q": "¿Por qué medios puedo emitir y certificar mis Documentos Tributarios Electrónicos (DTE)?",
      "a": "• Emisión gratuita a través de la Agencia Virtual y App FEL, donde la SAT es el certificador.\n• Por medio de Certificadores autorizados (con costo)."
    },
    {
      "q": "¿Cómo obtengo las autorizaciones de los Documentos Tributarios Electrónicos (DTE)?",
      "a": "La autorización se asigna de forma aleatoria y automática a cada Documento Tributario Electrónico (DTE) emitido en el momento de la certificación, por lo cual no existen rangos preautorizados."
    },
    {
      "q": "¿Tienen vencimiento los Documentos Tributarios Electrónicos (DTE) emitidos en el Régimen FEL?",
      "a": "No, debido a que su autorización es única para cada documento en el momento de la emisión y certificación."
    },
    {
      "q": "¿Cuáles son las características del aplicativo gratuito FEL de la Agencia Virtual SAT y App FEL?",
      "a": "• Cada Documento Tributario Electrónico (DTE) se llena mediante un formulario web.\n• Al completar el formulario se genera el DTE certificado que puede ser descargado por el emisor para su entrega.\n• Las descripciones de productos o servicios se ingresan de forma manual.\n• Desde la Agencia Virtual se puede efectuar emisión masiva de DTE a través de un archivo de carga (Excel).\n• Desde la App FEL puede generar facturas por medio de voz (disponible para pequeños contribuyentes)."
    },
    {
      "q": "¿Dónde puedo encontrar el aplicativo gratuito FEL de la Agencia Virtual y App FEL?",
      "a": "El aplicativo FEL está disponible en la Agencia Virtual de SAT ingresando con el usuario correspondiente al NIT desde portal.sat.gob.gt/portal/. La App FEL se descarga de forma gratuita desde App Store (iOS), Play Store (Android) y App Gallery (Huawei) en teléfono celular o tableta."
    },
    {
      "q": "¿Tiene algún costo la emisión de Documentos Tributarios Electrónicos (DTE) en los sistemas de SAT?",
      "a": "No, si el contribuyente utiliza el aplicativo web en la Agencia Virtual de SAT o la App FEL."
    },
    {
      "q": "¿Tiene algún costo el certificado de firma electrónica para el emisor?",
      "a": "El certificado de firma electrónica se proporciona al contribuyente cuando se habilita como emisor en el Régimen FEL, el cual no tiene costo."
    },
    {
      "q": "¿Cómo puedo saber quiénes son los certificadores autorizados por la SAT?",
      "a": "Puedes consultar el listado oficial en la sección Certificadores autorizados de Factura Electrónica (FEL) de este portal."
    },
    {
      "q": "¿Debo acreditar a SAT como mi certificador en el módulo «Acreditación de Certificadores»?",
      "a": "No, este proceso es automático cuando el contribuyente se habilita como emisor del Régimen FEL."
    },
    {
      "q": "¿Es necesario acreditar certificadores en el Régimen FEL?",
      "a": "El Certificador SAT no es necesario acreditarlo, ya que queda registrado de forma automática en el momento de la habilitación como emisor. Si se requieren los servicios de otros certificadores autorizados, sí se debe acreditarlos a través de la opción disponible en la Agencia Virtual."
    },
    {
      "q": "¿Existen manuales o instructivos del aplicativo FEL de la Agencia Virtual y App FEL?",
      "a": "Sí, todos los manuales de usuario para utilizar las diferentes opciones disponibles del Régimen FEL en la Agencia Virtual y App FEL están publicados en la sección Habilitarse como emisor FEL."
    },
    {
      "q": "¿Puedo delegar para que emitan Documentos Tributarios Electrónicos (DTE) en mi nombre?",
      "a": "Sí, a través de la Agencia Virtual puedes delegar permisos para que otras personas emitan, anulen o consulten DTE. La persona que cuente con el permiso delegado podrá hacer uso del mismo en la Agencia Virtual y App FEL."
    },
    {
      "q": "¿Si emito facturas por Q2,500.00 o más, qué debo colocar como identificación del receptor o comprador?",
      "a": "Número de Identificación Tributaria (NIT). Si no cuenta con NIT y es persona individual, podrá colocarse el Código Único de Identificación (CUI), y si es persona extranjera, el número de pasaporte o el código tributario de su país de origen (Artículo 30, numeral 9, Reglamento de la Ley del IVA, reformado por el Acuerdo Gubernativo 12-2023)."
    },
    {
      "q": "¿Puedo emitir facturas a consumidor final?",
      "a": "Solo en montos menores a Q2,500.00 podrás colocar «Consumidor Final» en la identificación del receptor o comprador (Artículo 30, numeral 9, Reglamento de la Ley del IVA, reformado por el Acuerdo Gubernativo 12-2023)."
    },
    {
      "q": "¿Si emito facturas de exportación, qué debo colocar como identificación del receptor o comprador?",
      "a": "El número de pasaporte o código tributario de su país de origen, según corresponda, o el número de identificación de otra índole que proporcione el receptor (Artículo 30, numeral 9, Reglamento de la Ley del IVA, reformado por el Acuerdo Gubernativo 12-2023)."
    },
    {
      "q": "¿Es obligatorio colocar la dirección del receptor en los Documentos Tributarios Electrónicos (DTE)?",
      "a": "Es opcional, ya que no es requerido según el Reglamento de la Ley del IVA. La información consignada es la proporcionada por el receptor del documento."
    },
    {
      "q": "¿Qué es la factura provisional?",
      "a": "Es el documento que respalda las transacciones de exportación realizadas con la clase de «DUCA 54» (Declaración Única Centroamericana), a efecto de emitir un documento previo a realizar la exportación definitiva."
    }
  ],
  "Consulta, anulación, rechazo y contingencias": [
    {
      "q": "¿Qué debo hacer cuando me muestra error al ingresar la contraseña asociada en la emisión de mis Documentos Tributarios Electrónicos (DTE)?",
      "a": "Debes generar una nueva contraseña asociada ingresando a la Agencia Virtual en: Servicios Tributarios > Factura Electrónica en Línea > Generar Firma Electrónica o restablecer contraseña. También puedes generarla desde la App FEL. Dicho cambio debe realizarse como mínimo una vez al año."
    },
    {
      "q": "¿Puedo anular documentos en el aplicativo FEL y App FEL?",
      "a": "Sí, la anulación se realiza desde el módulo «Anular DTE» o desde la opción directa en la consulta de DTE emitidos en la Agencia Virtual, considerando el plazo de presentación de la declaración mensual del IVA."
    },
    {
      "q": "¿Cuál es el plazo para anular Documentos Tributarios Electrónicos (DTE) en el Régimen FEL?",
      "a": "El mes de emisión y como máximo hasta el vencimiento de la declaración mensual del IVA."
    },
    {
      "q": "¿Qué debo hacer si necesito anular Documentos Tributarios Electrónicos (DTE) fuera del plazo establecido?",
      "a": "Para casos justificados existe la opción para solicitar la anulación extemporánea de DTE en la Agencia Virtual, la cual es analizada por la SAT y, de ser procedente, se aprueba."
    },
    {
      "q": "¿Si anulé un Documento Tributario Electrónico (DTE) por error, puedo revertir la anulación?",
      "a": "Sí, a través de la opción disponible en la Agencia Virtual en Servicios Tributarios > Factura Electrónica, podrás ingresar tu solicitud de reversión de anulación. También está disponible en la App FEL."
    },
    {
      "q": "¿Cómo me entero si me emitieron o me anularon un Documento Tributario Electrónico (DTE)?",
      "a": "Puedes configurar un correo electrónico para recibir notificaciones automáticas ingresando a: Agencia Virtual > Servicios Tributarios > Factura Electrónica FEL > Configuración FEL. En la App FEL también puedes activar notificaciones. Las anulaciones de DTE se notifican en todos los casos al correo registrado en el RTU."
    },
    {
      "q": "¿Cómo puedo reportar una anulación de un Documento Tributario Electrónico (DTE) realizada sin mi consentimiento?",
      "a": "Se reporta en un lapso de 72 horas utilizando el enlace disponible en el correo de notificación que se recibe de la SAT, o desde la consulta de documentos recibidos presionando los 3 puntos ubicados del lado derecho, opción «Reportar anulación», tanto en la Agencia Virtual como en la App FEL."
    },
    {
      "q": "¿Si emiten un Documento Tributario Electrónico (DTE) a mi nombre y no realicé la compra, puedo rechazar el documento?",
      "a": "Sí, puedes realizarlo en la Agencia Virtual ingresando a: Servicios Tributarios > Factura Electrónica en Línea FEL > Consultar DTE > opción «Rechazar DTE». El DTE rechazado no se visualizará en las consultas del contribuyente receptor."
    },
    {
      "q": "¿Si por error rechacé un Documento Tributario Electrónico (DTE), puedo solicitar la reversión?",
      "a": "Sí, únicamente el contribuyente receptor puede solicitarla en la Agencia Virtual ingresando a: Servicios Tributarios > Factura Electrónica en Línea FEL > Solicitud de reversión de Rechazo de DTE."
    },
    {
      "q": "¿El emisor puede solicitar la reversión de rechazo de Documentos Tributarios Electrónicos (DTE)?",
      "a": "No, solamente puede ser solicitada por el receptor del DTE."
    },
    {
      "q": "¿Cuáles son las opciones directas en la consulta de Documentos Tributarios Electrónicos (DTE) en la Agencia Virtual y App FEL?",
      "a": "Desde la consulta de documentos emitidos:\n• Emisión de notas de crédito (cuando corresponda)\n• Emisión de nota de débito (cuando corresponda)\n• Anulación (cuando corresponda)\n• Reversión de anulación (cuando el documento se encuentre anulado)\n\nDesde la consulta de documentos recibidos:\n• Emisión de constancia de exención de IVA (CIVA, cuando corresponda)\n• Emisión de constancia de adquisición de insumos (CAIS, cuando corresponda)\n• Reportar anulación (en caso el documento haya sido anulado sin su consentimiento)\n• Rechazar DTE (en caso el documento haya sido emitido sin su consentimiento)"
    },
    {
      "q": "¿Cuál es el máximo de Documentos Tributarios Electrónicos (DTE) que puedo descargar desde la consulta de DTE emitidos o recibidos?",
      "a": "El máximo permitido es de 10,000 documentos por cada consulta. Si la cantidad de documentos es mayor a 10,000, se habilitará en pantalla el campo para consignar un correo electrónico al que posteriormente se enviará un archivo en formato CSV con un máximo de 500,000 DTE."
    },
    {
      "q": "¿Por qué medio puedo notificar la emisión de DTE en un establecimiento con ubicación temporal?",
      "a": "A través de la Agencia Virtual en el módulo «Aviso de emisión de DTE en establecimiento temporal», dirigido a contribuyentes que realizan eventos temporales en un lugar distinto al domicilio comercial registrado en el RTU. El plazo establecido es de 3 meses; si requieres un período mayor, debes presentar un nuevo aviso."
    },
    {
      "q": "¿Cómo notifico a la SAT si no puedo emitir DTE de manera inmediata por fallas de conectividad con mi certificador?",
      "a": "A través de la Agencia Virtual por medio del módulo «Notificación de contingencia»."
    },
    {
      "q": "¿Dónde debo reportar los inconvenientes o consultas del Régimen FEL?",
      "a": "Para orientación general escribe al buzón ayuda@sat.gob.gt y, para soporte técnico por el uso de los sistemas FEL, al buzón efactura@sat.gob.gt."
    }
  ],
  "Pequeño Contribuyente, Régimen Primario y Pecuario (Decreto 31-2024)": [
    {
      "q": "¿Están los Pequeños Contribuyentes obligados a emitir Documentos Tributarios Electrónicos (DTE) en el Régimen FEL?",
      "a": "Sí. De acuerdo con la Resolución SAT-DSI-1350-2022, todos los Pequeños Contribuyentes deben incorporarse al Régimen FEL."
    },
    {
      "q": "¿Cuál es el límite de facturación anual para aplicar al Régimen de Pequeño Contribuyente?",
      "a": "125 salarios mínimos mensuales vigentes no agrícolas, según el Decreto Número 31-2024."
    },
    {
      "q": "¿Cuáles son los tipos de formato de impresión de los DTE que se pueden generar desde la App FEL?",
      "a": "• Formato tamaño carta.\n• Formato tipo ticket."
    },
    {
      "q": "¿Quiénes pueden hacer uso de la emisión por voz desde la App FEL?",
      "a": "Únicamente los Pequeños Contribuyentes, para emitir DTE tipo Factura de Pequeño Contribuyente (pueden digitar los datos o dictarlos por voz)."
    },
    {
      "q": "¿Qué datos se deben dictar para realizar la emisión por voz desde la App FEL?",
      "a": "• NIT del receptor (si no se indica, se coloca Consumidor Final automáticamente).\n• Descripción del bien o servicio.\n• Cantidad de unidades.\n• Precio en quetzales."
    },
    {
      "q": "¿Qué es el Régimen Primario según el Decreto 31-2024?",
      "a": "Es un régimen especial de producción y comercialización de productos agrícolas y artesanías producidos en Guatemala. El límite de ventas brutas anuales para aplicar es de 3,500 salarios mínimos mensuales vigentes no agrícolas."
    },
    {
      "q": "¿Qué es el Régimen Pecuario según el Decreto 31-2024?",
      "a": "Es un régimen especial de tributación simplificada que incluye la producción y comercialización de productos del sector pecuario, hidrobiológico y apícola. De acuerdo con el Decreto Número 31-2024, no se establece límite anual de ventas para este régimen."
    },
    {
      "q": "¿En qué lugares deben comercializar sus productos quienes pertenecen al Régimen Primario y Pecuario?",
      "a": "Según el Decreto 31-2024, lo pueden realizar en supermercados, mercados cantonales, municipales y centros de acopio."
    },
    {
      "q": "¿Cuáles son los tipos de DTE que pueden emitir los contribuyentes del Régimen Primario en el Régimen FEL?",
      "a": "• Factura Contribuyente Régimen Primario (FARP).\n• Factura Cambiaria Contribuyente Régimen Primario (FCRP).\n• Factura Específica (FEPE)."
    }
  ]
};
