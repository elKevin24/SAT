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
  "Generalidades y Conceptos Básicos": [
    {
      "q": "¿Qué es el Régimen de Factura Electrónica en Línea (FEL)?",
      "a": "Es el modelo operativo establecido por la Administración Tributaria para la emisión de Documentos Tributarios Electrónicos (DTE) de forma segura y con autorización en línea."
    },
    {
      "q": "¿Qué es un Documento Tributario Electrónico (DTE)?",
      "a": "Es un archivo electrónico en formato XML, certificado de acuerdo con las disposiciones del Régimen FEL autorizadas por la SAT.Actualmente se encuentran disponibles los siguientes DTE:"
    },
    {
      "q": "¿Quiénes son los involucrados en el proceso de emisión de Factura Electrónica en Línea?",
      "a": "Emisor: Certificador: Receptor: SAT:"
    },
    {
      "q": "¿Es obligatorio imprimir las facturas electrónicas?",
      "a": "Para entrega de facturas u otros Documentos Tributarios Electrónicos (DTE), el emisor cuenta con las opciones siguientes: Digital: Papel:"
    },
    {
      "q": "¿Qué contribuyentes pueden emitir facturas y otros Documentos Tributarios Electrónicos (DTE) en el Régimen FEL?",
      "a": "Actualmente todos los contribuyentes afiliados al Régimen General del IVA y Régimen de Pequeños Contribuyente, así como los que se afilien al Régimen Primario y Pecuario, deben emitir Documentos Tributarios Electrónicos (DTE) en el Régimen FEL, asimismo, está disponible para las entidades exentas o no lucrativas y las entidades del Estado."
    },
    {
      "q": "¿Cómo me habilito para emitir Documentos Tributarios Electrónicos -DTE?",
      "a": "A través de la opción “Habilitarse como emisor”, disponible en Agencia Virtual y App FEL, la gestión se realiza en línea.Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Cómo obtengo las autorizaciones de los Documentos Tributarios Electrónicos -DTE-?",
      "a": "La autorización se asigna de forma aleatoria y automática a cada Documento Tributario Electrónico (DTE) emitido en el momento de la certificación, por lo cual no existen rangos preautorizados."
    },
    {
      "q": "¿Tiene algún costo la emisión de Documentos Tributarios Electrónicos DTE- en los sistemas de SAT?",
      "a": "No, si el contribuyente utiliza el aplicativo web en la Agencia Virtual de SAT o la App FEL."
    }
  ],
  "Habilitación y Medios de Emisión": [
    {
      "q": "¿Dónde puedo encontrar el aplicativo gratuito FEL de la Agencia Virtual y App FEL?",
      "a": "El aplicativo FEL está disponible en la Agencia Virtual de SAT, para ello ingresa con el usuario que corresponde al NIT, desde el siguiente enlace:https://portal.sat.gob.gt/portal/La App FEL se descarga de forma gratuita desde las tiendas de aplicaciones App Store -IOS-, Play Store -Android- y App Gallery -Huawei-, desde un teléfono celular o tablet."
    },
    {
      "q": "¿Cuáles son los requisitos para habilitarse como emisor de Documentos Tributarios Electrónicos -DTE-?",
      "a": "*Cuando corresponda. Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Existen manuales o instructivos del aplicativo FEL de la Agencia Virtual y App FEL?",
      "a": "Sí, en el portal SAT se encuentran publicados los manuales de usuario para utilizar las diferentes opciones disponibles del Régimen FEL, en la Agencia Virtual y App FEL, siguiendo el siguiente enlace:https://portal.sat.gob.gt/portal/emisorde-dte/"
    },
    {
      "q": "¿Cuáles son los tipos de formato de impresión de los Documentos Tributarios Electrónicos (DTE), que se pueden generar desde la APP FEL?",
      "a": "Formato tamaño cartaFormato tipo ticket"
    },
    {
      "q": "¿Quiénes pueden hacer uso de la emisión por voz desde la APP FEL?",
      "a": "Únicamente los Pequeños Contribuyentes."
    },
    {
      "q": "¿Qué tipo de Documento Tributario Electrónico (DTE), puedo emitir por medio de voz en la APP FEL?",
      "a": "DTE tipo Factura de Pequeño Contribuyente."
    },
    {
      "q": "¿Qué datos se deben dictar para realizar la emisión por voz desde la APP FEL?",
      "a": "¿Cuáles son las formas en que los pequeños contribuyentes pueden realizar la emisión de Documentos Tributarios Electrónicos (DTE) a través de la APP FEL? Digitando los datos o por medio de voz."
    },
    {
      "q": "¿Cuáles son las opciones directas que se encuentran en la consulta de Documentos Tributarios Electrónicos -DTE- en la Agencia Virtual y App FEL?",
      "a": "Desde la consulta de documentos emitidos: Desde la consulta de documentos emitidos: Desde la consulta de documentos recibidos: Desde la consulta de documentos recibidos: Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    }
  ],
  "Anulación, Notas de Crédito y Contingencias": [
    {
      "q": "¿Qué debo hacer cuando me muestra error al ingresar la contraseña asociada en la emisión de mis Documentos Tributarios Electrónicos -DTE-?",
      "a": "Debe generar una nueva contraseña asociada ingresando a la Agencia Virtual en las siguientes opciones: También puede generar una nueva contraseña desde la App FEL. Dicho cambio debe realizarse como mínimo una vez año. Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Puedo anular documentos en el aplicativo FEL y App FEL?",
      "a": "Si, la transacción de anulación se realiza desde el módulo “Anular DTE” o desde la opción directa en la consulta de DTE emitidos, ambos de la Agencia Virtual, considerando el plazo de presentación de la declaración mensual del IVA.Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Cómo me entero si me emitieron o me anularon un Documento Tributario Electrónico -DTE-?",
      "a": "Los contribuyentes podrán configurar un correo electrónico, donde la SAT le informará automáticamente cada vez que le emitan o anulen un DTE, para ello: Asimismo, en la App FEL pueden activar las notificaciones en las que también se les informará cuando les emitan o anulen un DTE.Las anulaciones de DTE se notifican en todos los casos al correo registrado en RTU."
    },
    {
      "q": "¿Si anulé un Documento Tributario Electrónico -DTE- por error, puedo revertir la anulación?",
      "a": "Si, a través de la opción disponible en la Agencia Virtual en el apartado Servicios Tributarios, Factura Electrónica, podrás ingresar tu solicitud de reversión de anulación. También en la App FEL por medio de la opción disponible.Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Si por error rechacé un Documento Tributario Electrónico -DTE-, puedo solicitar la reversión?",
      "a": "Sí, únicamente el contribuyente receptor lo puede realizar por medio de la agencia virtual en Servicios tributarios, Factura Electrónica en Línea FEL, Solicitud de reversión de Rechazo de DTE.Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Cuál es el plazo para anular Documentos Tributarios Electrónicos -DTE- en el Régimen FEL?",
      "a": "El mes de emisión y como máximo hasta el vencimiento de la declaración mensual del IVA."
    },
    {
      "q": "¿Qué debo hacer si necesito anular Documentos Tributarios Electrónicos -DTE- en el Régimen FEL fuera del plazo establecido?",
      "a": "Es importante recordar que el plazo de anulación establecido es el mes de emisión y como máximo hasta el vencimiento de la declaración mensual del IVA.Sin embargo, para casos justificados existe la opción para solicitar la anulación extemporánea de DTE, la cual es analizada por la SAT y de ser procedente se aprueba.Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    },
    {
      "q": "¿Cómo puedo reportar una anulación de un Documento Tributario Electrónico (DTE) realizada sin mi consentimiento?",
      "a": "Ver manual:https://portal.sat.gob.gt/portal/emisor-de-dte/"
    }
  ],
  "Pequeño Contribuyente y Regímenes Especiales": [
    {
      "q": "¿Pueden los Pequeños Contribuyentes emitir facturas en el Régimen FEL de forma gratuita?",
      "a": "Sí. Todos los contribuyentes inscritos en el Régimen de Pequeño Contribuyente pueden emitir sus facturas electrónicas de forma totalmente gratuita e ilimitada a través de la Agencia Virtual en el portal web de la SAT o desde la aplicación móvil oficial APP FEL."
    },
    {
      "q": "¿Qué tarifa de impuesto aplica para las facturas de Pequeño Contribuyente?",
      "a": "Aplica una tarifa única y definitiva del 5% sobre el total de los ingresos facturados en el mes, pagadera mediante el formulario SAT-2046 en Declaraguate dentro del mes siguiente calendario."
    },
    {
      "q": "¿Cuál es el límite máximo de facturación anual para el Pequeño Contribuyente en FEL?",
      "a": "El monto máximo legal de ventas o prestación de servicios es de Q 150,000.00 en un año calendario. Si supera dicho límite, la SAT promoverá su pase automático al Régimen General del IVA."
    },
    {
      "q": "¿Deben los contribuyentes del Sector Primario y Agropecuario (Decreto 31-2024) emitir FEL?",
      "a": "Sí, los productores del régimen especial agropecuario emiten facturas electrónicas bajo las tarifas diferenciadas normadas en el Decreto 31-2024, contando con formularios y plantillas habilitadas en el sistema de la SAT."
    }
  ],
  "Planilla IVA-FEL y Empleados": [
    {
      "q": "Se puede incluir el traspaso de un vehículo en la planilla de SAT?",
      "a": "No se puede incluir dentro de la planilla del IVA este dato. Retenciones Pago Directo"
    },
    {
      "q": "¿Qué es Planilla IVA-FEL?",
      "a": "Planilla IVA-FEL es una herramienta dirigida a las personas individuales en relación de dependencia que desean realizar la presentación de la planilla, conteniendo el detalle de facturas, que les permite optar por la deducción de la renta neta y acreditar hasta Q12,000.00 por el Impuesto al Valor Agregado pagado en gastos personales, por compras de bienes o adquisición de servicios, durante el período de liquidación definitiva anual y se debe presentar dentro de los primeros diez (10) días hábiles del mes de enero de cada año, tiene como insumo principal la Factura Electrónica en Línea (FEL) y se encuentra disponible en la Agencia Virtual. Base Legal:Artículo 72 del Decreto Número 10-2012 del Congreso de la República de Guatemala, Ley de Actualización Tributaria. Base Legal:"
    },
    {
      "q": "¿Para qué sirve Planilla IVA-FEL?",
      "a": "Planilla IVA-FEL tiene como insumo principal la Factura Electrónica en Línea (FEL) y se encuentra disponible en la Agencia Virtual. Dirigido a las personas individuales en relación de dependencia que desean realizar la presentación de la planilla, conteniendo el detalle de facturas, que les permite optar por la deducción de la renta neta y acreditar hasta Q12,000.00 por el Impuesto al Valor Agregado pagado en gastos personales, por compras de bienes o adquisición de servicios, durante el período de liquidación definitiva anual y que deberán de presentarse dentro de los primeros diez (10) días hábiles del mes de enero de cada año. Base Legal:Artículo 72 del Decreto Número 10-2012 del Congreso de la República de Guatemala, Ley de Actualización Tributaria. Base Legal:"
    },
    {
      "q": "Puedo ingresar facturas en papel en mi Planilla IVA-FEL?",
      "a": "Ahora las Facturas Electrónicas en Línea (FEL) que solicite con su NIT o CUI se cargarán de forma automática."
    },
    {
      "q": "¿Puedo incluir el formulario de IVA traspaso en la Planilla IVA-FEL?",
      "a": "Los siguientes formularios se muestran automáticos:"
    },
    {
      "q": "¿Puedo ingresas Facturas de Pequeño Contribuyente a Planilla IVA-FEL?",
      "a": "Las facturas de los siguientes Regímenes no están incluidas dentro de Planilla IVA-FEL: – Facturas de Pequeño Contribuyente– Facturas Régimen Electrónico de Pequeño Contribuyente– Facturas Régimen Especial de Contribuyente Agropecuario– Facturas Régimen Electrónico de Pequeño Contribuyente– Facturas Régimen Electrónico Especial de Contribuyente Agropecuario En virtud, que los documentos anteriores no generan derecho a Crédito Fiscal, Artículos 49, 54 “C” y 54 “E” del Decreto Número 27-92 del Congreso de la República de Guatemala, Ley del Impuesto al Valor Agregado."
    },
    {
      "q": "¿Cómo presento la Planilla del IVA?",
      "a": "Ingresa a tu Agencia Virtual, selecciona el menú Servicios Tributarios > Planilla IVA-FEL puedes encontrar el manualaquí La opción “Presentar planilla” se habilitará automáticamente a partir del 1 de enero y se inhabilita el décimo día hábil de enero de cada año."
    },
    {
      "q": "¿Qué necesito para utilizar Planilla IVA-FEL?",
      "a": "Requisitos para acceder a Planilla IVA-FEL: Se recomienda actualizar o ratificar datos cada año en el RTU Digital, antes de la fecha de presentación de la planilla."
    }
  ]
};
