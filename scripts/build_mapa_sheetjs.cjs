const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Cargar allTramites.json
const rawData = fs.readFileSync('src/data/allTramites.json', 'utf8');
const allData = JSON.parse(rawData);
const TOTAL_PORTAL = allData.length; // 714

function safeInt(v, defaultVal = 99) {
  if (v === null || v === undefined) return defaultVal;
  const s = String(v).trim();
  const n = parseInt(s, 10);
  return isNaN(n) ? defaultVal : n;
}

// 2. Diccionario Nivel 1 (4 Macro-Segmentos)
const N1_DATA = [
  {
    no: 1,
    nombre: 'Contribuyentes',
    actores: 'Sin Obligaciones; Pequeños Contribuyentes; Contribuyente General; Contribuyentes Especiales',
    que_es: 'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.',
    lead_text: 'Información y servicios tributarios para personas y empresas.',
    base_juridica: 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'
  },
  {
    no: 2,
    nombre: 'Operadores de Comercio Exterior',
    actores: 'Importadores; Exportadores; Operador Económico Autorizado (OEA); Auxiliares de la Función Pública Aduanera (AFPA); Regímenes Territoriales y Zonas Especiales; Normativa y Operaciones Aduaneras Generales',
    que_es: 'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.',
    lead_text: 'Servicios e información aduanera para la importación, exportación y logística.',
    base_juridica: 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
  },
  {
    no: 3,
    nombre: 'Profesionales',
    actores: 'Abogados y Notarios; Peritos Contadores; Auditores; Gestores Tributarios; Servicios Profesionales',
    que_es: 'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
    lead_text: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
    base_juridica: 'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 "A" y 112).'
  },
  {
    no: 4,
    nombre: 'Entes Exentos',
    actores: 'Entidades del Estado; Constitucionales; No Lucrativos; Municipalidades; Decreto',
    que_es: 'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.',
    lead_text: 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
    base_juridica: 'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'
  }
];

// 3. Diccionarios N2 y N3
const N2_DESCRIPTIONS = {
  'Contribuyentes|||Sin Obligaciones': {
    que_es: 'Personas individuales que no realizan actividades económicas mercantiles pero requieren identificación tributaria para actos civiles, contratos, gestiones notariales o apertura de cuentas bancarias.',
    lead_text: 'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia sin movimientos comerciales.',
    base_juridica: 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
  },
  'Contribuyentes|||Pequeños Contribuyentes': {
    que_es: 'Régimen tributario simplificado para personas individuales o jurídicas con ventas o servicios de hasta Q150,000 anuales (tarifa definitiva 5% de IVA sin crédito fiscal), así como productores agropecuarios del sector primario.',
    lead_text: 'Facturación electrónica FEL, declaraciones mensuales del 5%, régimen electrónico y facilidades para el sector primario.',
    base_juridica: 'Ley del IVA (Decreto 27-92, Arts. 45 al 50), Decreto 7-2019 (Régimen Electrónico) y Decreto 31-2024 (Sector Primario y Agropecuario).'
  },
  'Contribuyentes|||Contribuyente General': {
    que_es: 'Personas individuales y jurídicas afectas a las obligaciones tributarias generales del IVA (12%) e ISR (Actividades Lucrativas, Rentas del Capital y del Trabajo), administración del Registro Fiscal de Vehículos, facturación electrónica FEL y solvencia fiscal.',
    lead_text: 'Declaraciones periódicas, facturación digital FEL, RTU Digital, traspasos vehiculares y pago de impuestos.',
    base_juridica: 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012) y Ley del ISCV (Dto. 70-94).'
  },
  'Contribuyentes|||Contribuyentes Especiales': {
    que_es: 'Empresas calificadas por resolución de la SAT como Grandes o Medianos Contribuyentes Especiales, sujetas a control exhaustivo, atención diferenciada en gerencias especiales, retenciones de IVA/ISR y precios de transferencia.',
    lead_text: 'Servicios y gestiones tributarias para empresas con atención diferenciada en gerencias especiales.',
    base_juridica: 'Código Tributario (Decreto 6-91, Art. 120), Ley del IVA (Decreto 27-92) y resoluciones normativas de la SAT.'
  },
  'Operadores de Comercio Exterior|||Importadores': {
    que_es: 'Personas individuales o jurídicas que introducen legalmente mercancías extranjeras al territorio aduanero nacional para su consumo, transformación o comercialización, gestionando declaraciones DUCA, aranceles DAI e IVA aduanero.',
    lead_text: 'Requisitos de inscripción, padrón de importadores, liquidación de DUCA y levante de mercancías.',
    base_juridica: 'CAUCA IV (Resolución 223-2008 COMIECO), RECAUCA (Resolución 224-2008 COMIECO) y Ley Nacional de Aduanas (Dto. 14-2013).'
  },
  'Operadores de Comercio Exterior|||Exportadores': {
    que_es: 'Personas individuales o jurídicas que envían mercancías nacionales o nacionalizadas fuera del territorio aduanero guatemalteco, gozando de exención de IVA y derecho a devolución de crédito fiscal para exportadores.',
    lead_text: 'Gestiones de despacho aduanero de exportación, DUCA-F centroamericana y devolución de crédito fiscal.',
    base_juridica: 'CAUCA IV, RECAUCA y Ley del IVA (Decreto 27-92, Art. 23 y 23 "A").'
  },
  'Operadores de Comercio Exterior|||Operador Económico Autorizado (OEA)': {
    que_es: 'Programa voluntario de certificación de seguridad en la cadena logística internacional para empresas confiables, que otorga facilidades operativas, prioridad de levante y reducción de selectivo en aduanas.',
    lead_text: 'Certificación OEA de seguridad logística aduanera, canal ágil de despacho y acuerdos de reconocimiento mutuo.',
    base_juridica: 'CAUCA IV (Art. 22), RECAUCA (Arts. 61 al 68) y Normativa Operativa del Programa OEA Guatemala.'
  },
  'Operadores de Comercio Exterior|||Auxiliares de la Función Pública Aduanera (AFPA)': {
    que_es: 'Personas autorizadas por la SAT para actuar en nombre de terceros en actos aduaneros: agentes aduaneros, transportistas aduaneros, depósitos aduaneros, empresas de mensajería (courier) y consolidadores de carga.',
    lead_text: 'Autorización, registro, habilitación y fiscalización de auxiliares aduaneros acreditados.',
    base_juridica: 'CAUCA IV (Arts. 18 al 21) y RECAUCA (Arts. 74 al 185).'
  },
  'Operadores de Comercio Exterior|||Regímenes Territoriales y Zonas Especiales': {
    que_es: 'Empresas calificadas que operan en Zonas Francas, Zonas de Desarrollo Económico Especial Público (ZDEEP) o bajo el régimen de Maquila (Decreto 29-89), gozando de suspensión temporal o exoneración de tributos.',
    lead_text: 'Gestiones para empresas en zonas francas, maquilas y zonas de desarrollo económico.',
    base_juridica: 'Ley de Fomento a la Actividad Exportadora y Maquila (Dto. 29-89), Ley de Zonas Francas (Dto. 65-89) y Ley de ZOLIC (Dto. 22-73).'
  },
  'Operadores de Comercio Exterior|||Normativa y Operaciones Aduaneras Generales': {
    que_es: 'Disposiciones operativas transversales de comercio exterior: Arancel Centroamericano (SAC), valor en aduana, resoluciones anticipadas, tránsitos aduaneros, subastas y convenios internacionales.',
    lead_text: 'Consultas de aranceles, normativa aduanera regional y operaciones de tránsito aduanero.',
    base_juridica: 'Código Tributario (Dto. 6-91), CAUCA IV, RECAUCA y Sistema Arancelario Centroamericano (SAC).'
  },
  'Profesionales|||Abogados y Notarios': {
    que_es: 'Profesionales del derecho que actúan en la formalización de escrituras públicas, traspasos electrónicos vehiculares mediante fe pública, personerías jurídicas y representación legal de contribuyentes.',
    lead_text: 'Herramientas de traspaso electrónico vehicular, registro de notarios y compra de timbres fiscales.',
    base_juridica: 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales (Decreto 37-92) y Código Tributario (Art. 57 "A").'
  },
  'Profesionales|||Peritos Contadores': {
    que_es: 'Técnicos contables acreditados ante la SAT responsables de llevar la contabilidad oficial de personas individuales y jurídicas, firmar balances y presentar declaraciones juradas de impuestos.',
    lead_text: 'Acreditación oficial en RTU, firma digital de estados financieros y herramientas de vinculación contable.',
    base_juridica: 'Decreto 2450 (Normas de la Profesión Contable) y Código Tributario (Decreto 6-91, Art. 112).'
  },
  'Profesionales|||Auditores': {
    que_es: 'Contadores Públicos y Auditores (CPA) colegiados activos facultados para emitir dictámenes fiscales, auditar estados financieros y dictaminar devoluciones de crédito fiscal.',
    lead_text: 'Dictámenes fiscales obligatorios, auditorías tributarias y acreditación como contador público.',
    base_juridica: 'Ley de Colegiación Profesional Obligatoria (Dto. 72-2001) y Código Tributario (Decreto 6-91).'
  },
  'Profesionales|||Gestores Tributarios': {
    que_es: 'Personas individuales registradas ante la SAT para realizar gestiones en agencias y oficinas tributarias en representación de contribuyentes debidamente autorizados.',
    lead_text: 'Registro de gestores, carné de acreditación y requisitos para actuar ante oficinas de la SAT.',
    base_juridica: 'Código Tributario (Decreto 6-91, Arts. 112 y 120).'
  },
  'Profesionales|||Servicios Profesionales': {
    que_es: 'Profesionales liberales de todas las disciplinas (médicos, ingenieros, arquitectos, consultores) afectos al pago de impuestos por honorarios profesionales bajo regímenes del IVA e ISR.',
    lead_text: 'Facturación FEL por honorarios profesionales, retenciones de ISR y deducciones autorizadas.',
    base_juridica: 'Ley de Actualización Tributaria (Decreto 10-2012) y Ley del IVA (Decreto 27-92).'
  },
  'Entes Exentos|||Entidades del Estado': {
    que_es: 'Organismos de los poderes del Estado (Ejecutivo, Legislativo, Judicial), ministerios, secretarías y dependencias públicas exentas de tributos pero obligadas a actuar como agentes de retención.',
    lead_text: 'Gestiones para ministerios y entidades estatales, constancias de exención y compras públicas.',
    base_juridica: 'Constitución Política de la República (Art. 257) y Ley del IVA (Decreto 27-92, Art. 8).'
  },
  'Entes Exentos|||Constitucionales': {
    que_es: 'Entidades cuya exención emana directamente de mandatos de la Constitución: Universidad de San Carlos de Guatemala (USAC), Instituto Guatemalteco de Seguridad Social (IGSS) y centros educativos/culturales.',
    lead_text: 'Servicios e información de exención constitucional para universidades, colegios y el IGSS.',
    base_juridica: 'Constitución Política de la República (Arts. 73, 88 y 100).'
  },
  'Entes Exentos|||No Lucrativos': {
    que_es: 'Organizaciones no gubernamentales (ONG), asociaciones de beneficencia, fundaciones, comunidades religiosas y clubes de servicio sin fines de lucro debidamente registradas.',
    lead_text: 'Registro de organizaciones no lucrativas, calificación de exención y constancias de donación.',
    base_juridica: 'Ley de ONGs para el Desarrollo (Dto. 02-2003) y Ley del IVA (Decreto 27-92, Art. 8).'
  },
  'Entes Exentos|||Municipalidades': {
    que_es: 'Gobiernos locales y corporaciones municipales autónomas exentas de tributos conforme al régimen constitucional y el Código Municipal.',
    lead_text: 'Gestiones tributarias para municipalidades y empresas municipales autónomas.',
    base_juridica: 'Constitución Política de la República (Art. 257 y 261) y Código Municipal (Decreto 12-2002).'
  },
  'Entes Exentos|||Decreto': {
    que_es: 'Entidades, cooperativas, partidos políticos y proyectos internacionales cuya exención está otorgada por decretos específicos del Congreso o convenios bilaterales ratificados.',
    lead_text: 'Gestiones para cooperativas, misiones diplomáticas y programas con exención otorgada por ley específica.',
    base_juridica: 'Decretos específicos del Congreso, Ley General de Cooperativas (Dto. 82-78) y Convención de Viena.'
  }
};

const N3_DESCRIPTIONS = {
  'Contribuyentes|||Sin Obligaciones|||Lista directa (Sin nivel intermedio)': {
    que_es: 'Canal directo para personas individuales que requieren inscripción, actualización de datos o consulta de constancia sin obligaciones comerciales.',
    lead_text: 'Consulta y gestiona tu NIT y datos básicos de identificación personal ante la SAT.',
    base_juridica: 'Código Tributario (Decreto 6-91, Art. 120).'
  },
  'Contribuyentes|||Pequeños Contribuyentes|||Régimen de Pequeño Contribuyente': {
    que_es: 'Conjunto de gestiones del régimen simplificado del 5%: inscripción en RTU, emisión de facturas electrónicas FEL y declaración jurada en Declaraguate.',
    lead_text: 'Cumplimiento tributario mensual del 5% y facturación electrónica para pequeños negocios.',
    base_juridica: 'Ley del IVA (Decreto 27-92, Arts. 45-50) y Decreto 7-2019.'
  },
  'Contribuyentes|||Pequeños Contribuyentes|||Régimen Agropecuario y Productores': {
    que_es: 'Régimen especial con tarifa reducida para productores agropecuarios, artesanales y del sector primario de la economía nacional.',
    lead_text: 'Servicios tributarios diferenciados para el sector productivo agropecuario.',
    base_juridica: 'Decreto 31-2024 y reformas al Código Tributario.'
  },
  'Contribuyentes|||Contribuyente General|||Declaraciones, pagos y solvencias': {
    que_es: 'Gestiones esenciales para el cumplimiento tributario periódico: presentación de formularios en Declaraguate, pagos bancarios en línea y solvencias fiscales.',
    lead_text: 'Declara y paga tus impuestos en línea y genera tu solvencia fiscal oficial.',
    base_juridica: 'Código Tributario (Decreto 6-91, Arts. 29, 91 y 112).'
  },
  'Contribuyentes|||Contribuyente General|||Facturación electrónica y documentos tributarios': {
    que_es: 'Plataforma del Régimen de Factura Electrónica en Línea (FEL), habilitación de emisores, anulación de DTE, certificación y consulta de documentos tributarios.',
    lead_text: 'Emite facturas electrónicas FEL gratis, consulta DTE y administra documentos tributarios.',
    base_juridica: 'Acuerdo de Directorio SAT 13-2018 y Ley del IVA (Decreto 27-92).'
  },
  'Contribuyentes|||Contribuyente General|||Inscripción y actualización en el RTU': {
    que_es: 'Administración del ciclo de vida en el Registro Tributario Unificado: inscripción de personas individuales y jurídicas, actualización y cese de actividades.',
    lead_text: 'Actualiza tus datos en RTU Digital, modifica establecimientos o inactiva registros.',
    base_juridica: 'Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020.'
  },
  'Contribuyentes|||Contribuyente General|||Vehículos (como propietario)': {
    que_es: 'Servicios del Registro Fiscal de Vehículos para propietarios: pago del Impuesto de Circulación (ISCV), traspasos electrónicos, reposición de distintivos y calcomanías.',
    lead_text: 'Traspasos de vehículos, pago de calcomanía anual y reposición de distintivos.',
    base_juridica: 'Ley del Impuesto sobre Circulación de Vehículos (Decreto 70-94).'
  },
  'Contribuyentes|||Contribuyente General|||Devoluciones y créditos fiscales': {
    que_es: 'Gestiones para solicitar la devolución o acreditamiento de pagos en exceso o indebidos, y reintegro del crédito fiscal para exportadores y contribuyentes.',
    lead_text: 'Solicita devoluciones de pagos indebidos y devolución de crédito fiscal.',
    base_juridica: 'Código Tributario (Decreto 6-91, Art. 153) y Ley del IVA (Decreto 27-92, Art. 23).'
  },
  'Contribuyentes|||Contribuyente General|||Regímenes tributarios': {
    que_es: 'Información y herramientas sobre los regímenes del ISR (Actividades Lucrativas, Rentas de Trabajo, Rentas de Capital), ISO e IVA general.',
    lead_text: 'Conoce los regímenes de ISR e IVA y las obligaciones tributarias aplicables.',
    base_juridica: 'Ley de Actualización Tributaria (Decreto 10-2012).'
  },
  'Contribuyentes|||Contribuyente General|||Servicios y gestiones al contribuyente': {
    que_es: 'Canales de atención al ciudadano: sistema de citas previas, convenios de pago en cuotas, Agencia Virtual, consultas de NIT y mesa de ayuda.',
    lead_text: 'Agenda tu cita en agencias, solicita convenios de pago y accede a la Agencia Virtual.',
    base_juridica: 'Ley Orgánica de la SAT (Decreto 1-98) y Código Tributario (Art. 40).'
  },
  'Contribuyentes|||Contribuyente General|||Cultura tributaria y capacitación': {
    que_es: 'Programas formativos, talleres virtuales, diplomados tributarios y cursos de inducción impartidos por el Centro de Capacitación Tributaria y Aduanera de la SAT.',
    lead_text: 'Capacítate en temas tributarios y aduaneros con cursos y talleres gratuitos de la SAT.',
    base_juridica: 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3).'
  },
  'Operadores de Comercio Exterior|||Importadores|||Despacho Aduanero de Importación': {
    que_es: 'Procedimientos y requisitos para el ingreso y desaduanamiento de mercancías: liquidación de DUCA-D, pago de derechos arancelarios e inspección no intrusiva.',
    lead_text: 'Gestiona la importación de mercancías, declaración DUCA y levante aduanero.',
    base_juridica: 'CAUCA IV, RECAUCA y Ley Nacional de Aduanas.'
  },
  'Operadores de Comercio Exterior|||Exportadores|||Despacho Aduanero de Exportación': {
    que_es: 'Procedimientos para la salida legal de mercancías del territorio aduanero: DUCA-F, DUCA-D de exportación, certificaciones de origen y embarque.',
    lead_text: 'Realiza el despacho de exportación, registro de DUCA y salida legal de mercancías.',
    base_juridica: 'CAUCA IV (Arts. 91-95) y RECAUCA (Arts. 367-375).'
  },
  'Operadores de Comercio Exterior|||Auxiliares de la Función Pública Aduanera (AFPA)|||Agentes Aduaneros': {
    que_es: 'Gestiones para la autorización, fianza, acreditación de dependientes y fiscalización de agentes aduaneros como auxiliares de la función pública.',
    lead_text: 'Autorización, carné y renovación de agentes aduaneros ante la Intendencia de Aduanas.',
    base_juridica: 'CAUCA IV (Arts. 19-21) y RECAUCA (Arts. 74-100).'
  },
  'Profesionales|||Abogados y Notarios|||Traspaso Electrónico de Vehículos': {
    que_es: 'Servicio en línea para notarios acreditados que permite autorizar electrónicamente la compraventa y traspaso de propiedad de vehículos.',
    lead_text: 'Autoriza traspasos vehiculares electrónicos con firma digital de notario.',
    base_juridica: 'Código de Notariado y Ley del ISCV (Decreto 70-94).'
  },
  'Profesionales|||Peritos Contadores|||Acreditación y Vinculación Contable': {
    que_es: 'Gestiones para registrarse como perito contador, vincular y desvincular contribuyentes a cargo y certificar libros contables electrónicos.',
    lead_text: 'Inscríbete como contador, asocia contribuyentes y valida libros tributarios.',
    base_juridica: 'Decreto 2450 y Código Tributario (Art. 112).'
  },
  'Entes Exentos|||No Lucrativos|||Inscripción y Solicitud de Exención': {
    que_es: 'Procedimientos para inscribir ONGs, asociaciones y fundaciones en RTU y tramitar la resolución de exención tributaria ante la SAT.',
    lead_text: 'Inscribe tu asociación sin fines de lucro y tramita tu constancia de exención.',
    base_juridica: 'Ley del IVA (Art. 8) y Ley de ONGs (Dto. 02-2003).'
  }
};

const ATO_DICT = {
  '1. Empezar y registrarse': 'Fase inicial de formalización: inscripción en RTU, obtención de primer NIT, acreditaciones, registros iniciales y apertura de operaciones tributarias y aduaneras.',
  '2. Operar, declarar y pagar': 'Fase operativa regular de cumplimiento: emisión de facturas FEL, presentación de declaraciones juradas periódicas, pago de impuestos, aranceles y retenciones.',
  '3. Consultar y verificar': 'Fase de control ciudadano y verificación: consulta de solvencia fiscal, estado de vehículos, verificación de facturas DTE, aranceles SAC y padrones públicos.',
  '4. Modificaciones y cierre': 'Fase de actualización patrimonial y conclusión: modificación de datos en RTU, cese temporal o definitivo de actividades, cancelación de vehículos y clausuras.',
  '5. Normativa, guías y soporte': 'Fase de soporte técnico y orientación: marco legal tributario y aduanero, leyes, reglamentos, criterios institucionales, citas previas y convenios de pago.'
};

const INTERACTION_DICT = {
  'Transaccional': 'Servicio 100% digital donde el ciudadano inicia, procesa y concluye la gestión en línea mediante autenticación con usuario y contraseña.',
  'Formulario / Declaraguate': 'Herramienta oficial interactiva para el llenado y congelado de formularios electrónicos de declaraciones juradas y boletas de pago Sat-2000.',
  'Consulta Pública': 'Herramienta de acceso libre e inmediato sin requerir inicio de sesión, diseñada para verificar solvencias, consultar NITs, tarifas arancelarias o facturas.',
  'Guía Informativa': 'Ficha de requisitos, base legal, pasos cronológicos y canales de atención presencial o virtual para realizar una gestión tributaria o aduanera.',
  'Descarga / Herramienta': 'Acceso a software oficial, aplicativos móviles (App SAT), lectores FEL, catálogos de códigos arancelarios o plantillas descargables.',
  'Cita Previa': 'Sistema oficial para reservar fecha y hora de atención presencial en agencias tributarias de la SAT en toda la República.'
};

// 4. Procesamiento de Caminos y Nodos
const n1Map = {};
const n2Map = {};
const n3Map = {};
const pathsMap = {};

allData.forEach(item => {
  const n1 = item.nivel1 || 'Contribuyentes';
  const n2 = item.nivel2 || 'General';
  const n3 = item.nivel3 || '—';
  const n4 = item.nivel4 || '—';
  const o1 = safeInt(item.orden_n1);
  const o2 = safeInt(item.orden_n2);
  const o3 = safeInt(item.orden_n3);
  const o4 = safeInt(item.orden_n4);

  // N1
  if (!n1Map[n1]) {
    n1Map[n1] = { n1, o1, count: 0, actores: new Set(), gestiones: [] };
  }
  n1Map[n1].count++;
  n1Map[n1].actores.add(n2);
  n1Map[n1].gestiones.push(item);

  // N2
  const k2 = `${n1}|||${n2}`;
  if (!n2Map[k2]) {
    n2Map[k2] = { n1, n2, o1, o2, count: 0, nodos: new Set(), gestiones: [] };
  }
  n2Map[k2].count++;
  n2Map[k2].nodos.add(n3);
  n2Map[k2].gestiones.push(item);

  // N3
  const k3 = `${n1}|||${n2}|||${n3}`;
  if (!n3Map[k3]) {
    n3Map[k3] = { n1, n2, n3, o1, o2, o3, count: 0, subnodos: new Set(), gestiones: [] };
  }
  n3Map[k3].count++;
  n3Map[k3].subnodos.add(n4);
  n3Map[k3].gestiones.push(item);

  // Path N4
  const kp = `${n1}|||${n2}|||${n3}|||${n4}`;
  if (!pathsMap[kp]) {
    pathsMap[kp] = { n1, n2, n3, n4, o1, o2, o3, o4, count: 0, gestiones: [], bases: new Set() };
  }
  pathsMap[kp].count++;
  pathsMap[kp].gestiones.push(item.gestion || item.nombreActual);
  if (item.baseLegal && item.baseLegal !== '—') {
    pathsMap[kp].bases.add(item.baseLegal);
  }
});

const sortedN2 = Object.values(n2Map).sort((a, b) => a.o1 - b.o1 || a.o2 - b.o2 || a.n2.localeCompare(b.n2));
const sortedN3 = Object.values(n3Map).sort((a, b) => a.o1 - b.o1 || a.o2 - b.o2 || a.o3 - b.o3 || a.n3.localeCompare(b.n3));
const sortedPaths = Object.values(pathsMap).sort((a, b) => a.o1 - b.o1 || a.o2 - b.o2 || a.o3 - b.o3 || a.o4 - b.o4 || a.n1.localeCompare(b.n1));

function getPathMetadata(p) {
  const { n1, n2, n3, n4 } = p;
  let base_juridica;
  if (p.bases.size > 0) {
    base_juridica = Array.from(p.bases).sort().slice(0, 2).join('; ');
  } else if (N3_DESCRIPTIONS[`${n1}|||${n2}|||${n3}`]) {
    base_juridica = N3_DESCRIPTIONS[`${n1}|||${n2}|||${n3}`].base_juridica;
  } else if (N2_DESCRIPTIONS[`${n1}|||${n2}`]) {
    base_juridica = N2_DESCRIPTIONS[`${n1}|||${n2}`].base_juridica;
  } else {
    base_juridica = 'Código Tributario (Decreto 6-91) y Ley Orgánica de la SAT.';
  }

  let que_es, lead_text;
  if (n4 === '—') {
    if (N3_DESCRIPTIONS[`${n1}|||${n2}|||${n3}`]) {
      que_es = N3_DESCRIPTIONS[`${n1}|||${n2}|||${n3}`].que_es;
      lead_text = N3_DESCRIPTIONS[`${n1}|||${n2}|||${n3}`].lead_text;
    } else if (N2_DESCRIPTIONS[`${n1}|||${n2}`]) {
      que_es = N2_DESCRIPTIONS[`${n1}|||${n2}`].que_es;
      lead_text = N2_DESCRIPTIONS[`${n1}|||${n2}`].lead_text;
    } else {
      que_es = `Gestiones institucionales especializadas para ${n2} en el portal de la SAT.`;
      lead_text = `Servicios y gestiones operativas para ${n2}.`;
    }
  } else {
    const gestionesSample = p.gestiones.slice(0, 3).map(g => g.substring(0, 40)).join(', ');
    que_es = `Subnodo funcional de ${n4} bajo ${n3}: gestión de requerimientos operativos, documentación oficial y servicios tales como ${gestionesSample}.`;
    lead_text = `Accede a los requisitos, guías y aplicativos oficiales para ${n4.toLowerCase()}.`;
  }

  return { base_juridica, que_es, lead_text };
}

// ==========================================
// CREACIÓN DE LAS 6 HOJAS
// ==========================================
const wb = XLSX.utils.book_new();

// ------------------------------------------
// 1. Árbol Jerárquico (N1-N5)
// ------------------------------------------
console.log('Construyendo Hoja 1: Árbol Jerárquico (N1-N5)...');
const rows1 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['ÁRBOL JERÁRQUICO MULTINIVEL DE NAVEGACIÓN — ARQUITECTURA DE INFORMACIÓN CANÓNICA (N1–N5)'],
  ['136 Rutas Operativas Consolidadas · 714 Gestiones Oficiales · Gobernanza Numérica N1 a N5 · Ciclo ATO'],
  [],
  [
    'No.',
    'Nivel 1',
    'Nivel 2',
    'Nivel 3',
    'Nivel 4',
    'Qué es: (Definición Operativa)',
    'Lead text: (Texto Orientador de Interfaz)',
    'Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)',
    'Total Gestiones',
    '% Nivel 1',
    '% del Portal',
    'Ruta Oficial de Navegación (Miga de Pan)'
  ]
];

let prevN1_1 = null;
let n1Count_1 = 0;
let rowIdx1 = 1;

sortedPaths.forEach(p => {
  if (prevN1_1 && prevN1_1 !== p.n1) {
    const totN1 = n1Map[prevN1_1].count;
    rows1.push([
      '',
      `SUBTOTAL ${prevN1_1.toUpperCase()}`,
      '',
      '',
      '',
      `Consolidado oficial de rutas y gestiones para el macro-segmento ${prevN1_1}.`,
      '',
      '',
      totN1,
      '100.0%',
      `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`,
      `Inicio > ${prevN1_1}`
    ]);
  }
  prevN1_1 = p.n1;

  const meta = getPathMetadata(p);
  const totN1 = n1Map[p.n1].count;
  const pctN1 = `${((p.count / totN1) * 100).toFixed(1)}%`;
  const pctPort = `${((p.count / TOTAL_PORTAL) * 100).toFixed(1)}%`;
  const breadcrumb = p.n4 === '—' 
    ? (p.n3 === '—' ? `Inicio > ${p.n1} > ${p.n2}` : `Inicio > ${p.n1} > ${p.n2} > ${p.n3}`)
    : `Inicio > ${p.n1} > ${p.n2} > ${p.n3} > ${p.n4}`;

  rows1.push([
    rowIdx1++,
    p.n1,
    p.n2,
    p.n3,
    p.n4,
    meta.que_es,
    meta.lead_text,
    meta.base_juridica,
    p.count,
    pctN1,
    pctPort,
    breadcrumb
  ]);
});

if (prevN1_1) {
  const totN1 = n1Map[prevN1_1].count;
  rows1.push([
    '',
    `SUBTOTAL ${prevN1_1.toUpperCase()}`,
    '',
    '',
    '',
    `Consolidado oficial de rutas y gestiones para el macro-segmento ${prevN1_1}.`,
    '',
    '',
    totN1,
    '100.0%',
    `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`,
    `Inicio > ${prevN1_1}`
  ]);
}

rows1.push([
  '',
  'TOTAL PORTAL WEB SAT',
  '20 Actores Canónicos',
  '62 Nodos Especializados',
  '136 Subnodos Operativos',
  'Universo total de gestiones clasificadas bajo gobernanza canónica estricta N1 a N5.',
  'Portal Institucional SAT Guatemala · Cero enlaces rotos · Acceso en 2-3 clics.',
  'Constitución Política, Código Tributario, CAUCA IV, RECAUCA, Leyes de IVA, ISR, ISCV.',
  TOTAL_PORTAL,
  '100.0%',
  '100.0%',
  'Portal SAT Guatemala'
]);

const ws1 = XLSX.utils.aoa_to_sheet(rows1);
ws1['!cols'] = [
  { wch: 6 },
  { wch: 30 },
  { wch: 32 },
  { wch: 38 },
  { wch: 42 },
  { wch: 55 },
  { wch: 45 },
  { wch: 50 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 },
  { wch: 60 }
];
XLSX.utils.book_append_sheet(wb, ws1, 'Árbol Jerárquico (N1-N5)');

// ------------------------------------------
// 2. Nivel 1
// ------------------------------------------
console.log('Construyendo Hoja 2: Nivel 1...');
const rows2 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['1. NIVEL 1 — DEFINICIONES INSTITUCIONALES Y ACTORES CANÓNICOS QUE AGRUPA'],
  ['4 Macro-Segmentos Canónicos · Formato Resumen Arquitectura · Estructura Numérica N1'],
  [],
  [
    'No.',
    'Nivel 1',
    'Actores Canónicos que Agrupa (Nivel 2)',
    'Qué es: (Definición Operativa)',
    'Lead text: (Texto Orientador de Interfaz)',
    'Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)',
    'Total Gestiones',
    '% del Portal'
  ]
];

N1_DATA.forEach(n1 => {
  const tot = n1Map[n1.nombre] ? n1Map[n1.nombre].count : 0;
  const pct = `${((tot / TOTAL_PORTAL) * 100).toFixed(1)}%`;
  rows2.push([
    n1.no,
    n1.nombre,
    n1.actores,
    n1.que_es,
    n1.lead_text,
    n1.base_juridica,
    tot,
    pct
  ]);
});

rows2.push([
  '',
  'TOTAL PORTAL WEB SAT',
  '20 Actores Canónicos Consolidados',
  'Universo total de gestiones y servicios del portal',
  '',
  '',
  TOTAL_PORTAL,
  '100.0%'
]);

const ws2 = XLSX.utils.aoa_to_sheet(rows2);
ws2['!cols'] = [
  { wch: 6 },
  { wch: 32 },
  { wch: 45 },
  { wch: 60 },
  { wch: 45 },
  { wch: 55 },
  { wch: 16 },
  { wch: 14 }
];
XLSX.utils.book_append_sheet(wb, ws2, 'Nivel 1');

// ------------------------------------------
// 3. Nivel 2
// ------------------------------------------
console.log('Construyendo Hoja 3: Nivel 2...');
const rows3 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['2. NIVEL 2 — LOS 20 ACTORES CANÓNICOS Y NODOS QUE AGRUPA (NIVEL 3)'],
  ['20 Actores Canónicos · Formato Resumen Arquitectura · Estructura Numérica N2'],
  [],
  [
    'No.',
    'Nivel 1',
    'Nivel 2',
    'Nodos que Agrupa (Nivel 3)',
    'Qué es: (Definición Operativa de la Figura)',
    'Lead text: (Texto Orientador de Interfaz)',
    'Base jurídica: (Fundamento Legal Oficial)',
    'Total Gestiones',
    '% Nivel 1',
    '% del Portal'
  ]
];

let prevN1_2 = null;
let rowIdx2 = 1;

sortedN2.forEach(n2 => {
  if (prevN1_2 && prevN1_2 !== n2.n1) {
    const totN1 = n1Map[prevN1_2].count;
    rows3.push([
      '',
      `SUBTOTAL ${prevN1_2.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      totN1,
      '100.0%',
      `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
    ]);
  }
  prevN1_2 = n2.n1;

  const key2 = `${n2.n1}|||${n2.n2}`;
  const desc = N2_DESCRIPTIONS[key2] || {
    que_es: `Actor canónico de ${n2.n2} en ${n2.n1}.`,
    lead_text: `Servicios y gestiones para ${n2.n2}.`,
    base_juridica: 'Código Tributario y Ley Orgánica de la SAT.'
  };

  const nodosList = Array.from(n2.nodos).filter(x => x !== '—').join('; ') || 'Lista directa (Sin nivel intermedio)';
  const totN1 = n1Map[n2.n1].count;
  const pctN1 = `${((n2.count / totN1) * 100).toFixed(1)}%`;
  const pctPort = `${((n2.count / TOTAL_PORTAL) * 100).toFixed(1)}%`;

  rows3.push([
    rowIdx2++,
    n2.n1,
    n2.n2,
    nodosList,
    desc.que_es,
    desc.lead_text,
    desc.base_juridica,
    n2.count,
    pctN1,
    pctPort
  ]);
});

if (prevN1_2) {
  const totN1 = n1Map[prevN1_2].count;
  rows3.push([
    '',
    `SUBTOTAL ${prevN1_2.toUpperCase()}`,
    '',
    '',
    '',
    '',
    '',
    totN1,
    '100.0%',
    `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
  ]);
}

rows3.push([
  '',
  'TOTAL PORTAL WEB SAT',
  '20 Actores Canónicos',
  '',
  '',
  '',
  '',
  TOTAL_PORTAL,
  '100.0%',
  '100.0%'
]);

const ws3 = XLSX.utils.aoa_to_sheet(rows3);
ws3['!cols'] = [
  { wch: 6 },
  { wch: 30 },
  { wch: 32 },
  { wch: 45 },
  { wch: 55 },
  { wch: 45 },
  { wch: 50 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 }
];
XLSX.utils.book_append_sheet(wb, ws3, 'Nivel 2');

// ------------------------------------------
// 4. Nivel 3
// ------------------------------------------
console.log('Construyendo Hoja 4: Nivel 3...');
const rows4 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['3. NIVEL 3 — NODOS ESPECIALIZADOS Y SUBNODOS QUE AGRUPA (NIVEL 4)'],
  ['62 Nodos Especializados · Formato Resumen Arquitectura · Estructura Numérica N3'],
  [],
  [
    'No.',
    'Nivel 1',
    'Nivel 2',
    'Nivel 3',
    'Subnodos que Agrupa (Nivel 4)',
    'Qué es: (Definición Operativa del Nodo)',
    'Lead text: (Texto Orientador de Interfaz)',
    'Base jurídica: (Fundamento Legal Oficial)',
    'Total Gestiones',
    '% Nivel 2',
    '% del Portal'
  ]
];

let prevN1_3 = null;
let rowIdx3 = 1;

sortedN3.forEach(n3 => {
  if (prevN1_3 && prevN1_3 !== n3.n1) {
    const totN1 = n1Map[prevN1_3].count;
    rows4.push([
      '',
      `SUBTOTAL ${prevN1_3.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      '',
      totN1,
      '100.0%',
      `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
    ]);
  }
  prevN1_3 = n3.n1;

  const key3 = `${n3.n1}|||${n3.n2}|||${n3.n3}`;
  const key2 = `${n3.n1}|||${n3.n2}`;
  let desc = N3_DESCRIPTIONS[key3];
  if (!desc) {
    if (N2_DESCRIPTIONS[key2]) {
      desc = {
        que_es: `${N2_DESCRIPTIONS[key2].que_es} Incluye el nodo de ${n3.n3}.`,
        lead_text: N2_DESCRIPTIONS[key2].lead_text,
        base_juridica: N2_DESCRIPTIONS[key2].base_juridica
      };
    } else {
      desc = {
        que_es: `Nodo especializado de ${n3.n3} para ${n3.n2}.`,
        lead_text: `Servicios y gestiones operativas para ${n3.n3}.`,
        base_juridica: 'Código Tributario y Ley Orgánica de la SAT.'
      };
    }
  }

  const subnodosList = Array.from(n3.subnodos).filter(x => x !== '—').join('; ') || 'Lista directa (Sin subnodo intermedio)';
  const totN2 = n2Map[key2].count;
  const pctN2 = `${((n3.count / totN2) * 100).toFixed(1)}%`;
  const pctPort = `${((n3.count / TOTAL_PORTAL) * 100).toFixed(1)}%`;

  rows4.push([
    rowIdx3++,
    n3.n1,
    n3.n2,
    n3.n3,
    subnodosList,
    desc.que_es,
    desc.lead_text,
    desc.base_juridica,
    n3.count,
    pctN2,
    pctPort
  ]);
});

if (prevN1_3) {
  const totN1 = n1Map[prevN1_3].count;
  rows4.push([
    '',
    `SUBTOTAL ${prevN1_3.toUpperCase()}`,
    '',
    '',
    '',
    '',
    '',
    '',
    totN1,
    '100.0%',
    `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
  ]);
}

rows4.push([
  '',
  'TOTAL PORTAL WEB SAT',
  '20 Actores Canónicos',
  '62 Nodos Especializados',
  '',
  '',
  '',
  '',
  TOTAL_PORTAL,
  '100.0%',
  '100.0%'
]);

const ws4 = XLSX.utils.aoa_to_sheet(rows4);
ws4['!cols'] = [
  { wch: 6 },
  { wch: 30 },
  { wch: 32 },
  { wch: 38 },
  { wch: 45 },
  { wch: 55 },
  { wch: 45 },
  { wch: 50 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 }
];
XLSX.utils.book_append_sheet(wb, ws4, 'Nivel 3');

// ------------------------------------------
// 5. Nivel 4
// ------------------------------------------
console.log('Construyendo Hoja 5: Nivel 4...');
const rows5 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['4. NIVEL 4 — SUBNODOS OPERATIVOS Y GESTIONES QUE AGRUPA (NIVEL 5)'],
  ['136 Subnodos Operativos · Formato Resumen Arquitectura · Estructura Numérica N4'],
  [],
  [
    'No.',
    'Nivel 1',
    'Nivel 2',
    'Nivel 3',
    'Nivel 4',
    'Gestiones que Agrupa (Nivel 5)',
    'Qué es: (Definición Operativa del Subnodo)',
    'Lead text: (Texto Orientador de Interfaz)',
    'Base jurídica: (Fundamento Legal Oficial)',
    'Total Gestiones',
    '% Nivel 3',
    '% del Portal'
  ]
];

let prevN1_4 = null;
let rowIdx4 = 1;

sortedPaths.forEach(p => {
  if (prevN1_4 && prevN1_4 !== p.n1) {
    const totN1 = n1Map[prevN1_4].count;
    rows5.push([
      '',
      `SUBTOTAL ${prevN1_4.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      totN1,
      '100.0%',
      `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
    ]);
  }
  prevN1_4 = p.n1;

  const meta = getPathMetadata(p);
  const gestionesList = p.gestiones.slice(0, 4).map(g => g.substring(0, 45)).join('; ') + (p.gestiones.length > 4 ? ` ... (+${p.gestiones.length - 4} más)` : '');
  const key3 = `${p.n1}|||${p.n2}|||${p.n3}`;
  const totN3 = n3Map[key3].count;
  const pctN3 = `${((p.count / totN3) * 100).toFixed(1)}%`;
  const pctPort = `${((p.count / TOTAL_PORTAL) * 100).toFixed(1)}%`;

  rows5.push([
    rowIdx4++,
    p.n1,
    p.n2,
    p.n3,
    p.n4,
    gestionesList,
    meta.que_es,
    meta.lead_text,
    meta.base_juridica,
    p.count,
    pctN3,
    pctPort
  ]);
});

if (prevN1_4) {
  const totN1 = n1Map[prevN1_4].count;
  rows5.push([
    '',
    `SUBTOTAL ${prevN1_4.toUpperCase()}`,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    totN1,
    '100.0%',
    `${((totN1 / TOTAL_PORTAL) * 100).toFixed(1)}%`
  ]);
}

rows5.push([
  '',
  'TOTAL PORTAL WEB SAT',
  '20 Actores Canónicos',
  '62 Nodos Especializados',
  '136 Subnodos Operativos',
  '714 Gestiones Oficiales',
  '',
  '',
  '',
  TOTAL_PORTAL,
  '100.0%',
  '100.0%'
]);

const ws5 = XLSX.utils.aoa_to_sheet(rows5);
ws5['!cols'] = [
  { wch: 6 },
  { wch: 30 },
  { wch: 32 },
  { wch: 38 },
  { wch: 42 },
  { wch: 55 },
  { wch: 55 },
  { wch: 45 },
  { wch: 50 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 }
];
XLSX.utils.book_append_sheet(wb, ws5, 'Nivel 4');

// ------------------------------------------
// 6. Nivel 5
// ------------------------------------------
console.log('Construyendo Hoja 6: Nivel 5 (Catálogo Canónico de Gestiones)...');
const rows6 = [
  ['SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA'],
  ['5. NIVEL 5 — CATÁLOGO CANÓNICO DE GESTIONES Y SERVICIOS INSTITUCIONALES'],
  ['714 Gestiones Oficiales · Código Inmutable SAT-GES-#### · Gobernanza ATO · URLs Validadas HTTP 200'],
  [],
  [
    'No.',
    'Código Canónico',
    'Nivel 1',
    'Nivel 2',
    'Nivel 3',
    'Nivel 4',
    'Nivel 5 (Gestión Canónica)',
    'Qué es: (Descripción Operativa de la Gestión)',
    'Lead text: (Acción Directa al Ciudadano)',
    'Base jurídica: (Fundamento Legal Oficial)',
    'Etapa ATO',
    'Tipo de Interacción',
    'URL Oficial Verificada'
  ]
];

const sortedGestiones = [...allData].sort((a, b) => {
  const o1a = safeInt(a.orden_n1), o1b = safeInt(b.orden_n1);
  if (o1a !== o1b) return o1a - o1b;
  const o2a = safeInt(a.orden_n2), o2b = safeInt(b.orden_n2);
  if (o2a !== o2b) return o2a - o2b;
  const o3a = safeInt(a.orden_n3), o3b = safeInt(b.orden_n3);
  if (o3a !== o3b) return o3a - o3b;
  const o4a = safeInt(a.orden_n4), o4b = safeInt(b.orden_n4);
  if (o4a !== o4b) return o4a - o4b;
  const o5a = safeInt(a.orden_n5), o5b = safeInt(b.orden_n5);
  if (o5a !== o5b) return o5a - o5b;
  return (a.codigo || '').localeCompare(b.codigo || '');
});

let prevN1_5 = null;
let n1SubtotalCount_5 = 0;
let rowIdx5 = 1;

sortedGestiones.forEach(g => {
  const n1 = g.nivel1 || 'Contribuyentes';
  if (prevN1_5 && prevN1_5 !== n1) {
    rows6.push([
      '',
      `SUBTOTAL ${prevN1_5.toUpperCase()}`,
      '',
      '',
      '',
      '',
      `${n1SubtotalCount_5} Gestiones`,
      `Consolidado oficial de gestiones canónicas para el macro-segmento ${prevN1_5}.`,
      '',
      '',
      '',
      '',
      ''
    ]);
    n1SubtotalCount_5 = 0;
  }
  prevN1_5 = n1;
  n1SubtotalCount_5++;

  const cod = g.codigo || `SAT-GES-${String(rowIdx5).padStart(4, '0')}`;
  const n2 = g.nivel2 || '—';
  const n3 = g.nivel3 || '—';
  const n4 = g.nivel4 || '—';
  const n5 = g.gestion || g.nombreActual || '—';
  const que_es = g.descripcion || g.que_es || `Gestión institucional oficial para ${n5}.`;
  const lead_text = g.lead_text || `Realiza y consulta la gestión oficial de ${n5.toLowerCase()}.`;
  const base_juridica = g.baseLegal || 'Código Tributario y Ley Orgánica de la SAT.';
  const etapa_ato = g.etapaAto || '1. Empezar y registrarse';
  const tipo_interaccion = g.tipoInteraccion || 'Guía Informativa';
  const url_oficial = g.urlOficial || 'https://portal.sat.gob.gt/';

  rows6.push([
    rowIdx5++,
    cod,
    n1,
    n2,
    n3,
    n4,
    n5,
    que_es,
    lead_text,
    base_juridica,
    etapa_ato,
    tipo_interaccion,
    url_oficial
  ]);
});

if (prevN1_5) {
  rows6.push([
    '',
    `SUBTOTAL ${prevN1_5.toUpperCase()}`,
    '',
    '',
    '',
    '',
    `${n1SubtotalCount_5} Gestiones`,
    `Consolidado oficial de gestiones canónicas para el macro-segmento ${prevN1_5}.`,
    '',
    '',
    '',
    '',
    ''
  ]);
}

rows6.push([
  '',
  'GRAN TOTAL 714 GESTIONES CANÓNICAS',
  '',
  '',
  '',
  '',
  `${TOTAL_PORTAL} Gestiones`,
  'Universo total de gestiones clasificadas y sincronizadas con el portal de producción SAT.',
  '',
  '',
  '',
  '',
  ''
]);

const ws6 = XLSX.utils.aoa_to_sheet(rows6);
ws6['!cols'] = [
  { wch: 6 },
  { wch: 16 },
  { wch: 28 },
  { wch: 28 },
  { wch: 32 },
  { wch: 35 },
  { wch: 45 },
  { wch: 55 },
  { wch: 45 },
  { wch: 50 },
  { wch: 22 },
  { wch: 22 },
  { wch: 55 }
];
XLSX.utils.book_append_sheet(wb, ws6, 'Nivel 5');

// ------------------------------------------
// 7. Guardar el Libro
// ------------------------------------------
const targetFile = 'docs/fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx';
const publicDir = 'public/downloads';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicFile = path.join(publicDir, 'Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx');

console.log(`Escribiendo archivo con SheetJS en ${targetFile}...`);
XLSX.writeFile(wb, targetFile);

console.log(`Copiando archivo a ${publicFile} para descarga directa en la app...`);
XLSX.writeFile(wb, publicFile);

console.log('¡Libro generado y guardado exitosamente con SheetJS!');
console.log('Hojas incluidas:', wb.SheetNames);
