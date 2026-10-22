const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

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

// 2. Colores y Estilos Institucionales SAT
const COLORS = {
  NAVY_DARK: 'FF19324B',
  BLUE_SAT: 'FF14649B',
  BLUE_MEDIUM: 'FF0284C7',
  HEADER_TEXT: 'FFFFFFFF',
  ZEBRA_BG: 'FFF8FAFC',
  WHITE_BG: 'FFFFFFFF',
  BORDER_NEUTRAL: 'FFCBD5E1',
  BORDER_HEADER: 'FFFFFFFF',
  SUBTOTAL_BG: 'FFE2E8F0',
  GRAND_TOTAL_BG: 'FFCBD5E1',
  LEAD_TEXT_COLOR: 'FF0369A1',
  TEXT_DARK: 'FF0F172A',
  LINK_BLUE: 'FF1D4ED8'
};

const BORDERS = {
  thin: {
    top: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } },
    bottom: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } }
  },
  header: {
    top: { style: 'thin', color: { argb: COLORS.BORDER_HEADER } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_HEADER } },
    bottom: { style: 'medium', color: { argb: COLORS.BORDER_HEADER } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_HEADER } }
  },
  subtotal: {
    top: { style: 'thin', color: { argb: 'FF94A3B8' } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } },
    bottom: { style: 'medium', color: { argb: 'FF64748B' } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } }
  },
  grandTotal: {
    top: { style: 'medium', color: { argb: 'FF475569' } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } },
    bottom: { style: 'double', color: { argb: 'FF1E293B' } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_NEUTRAL } }
  }
};

// 3. Diccionarios de Metadata
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

const N2_DESCRIPTIONS = {
  'Contribuyentes|||Sin Obligaciones': {
    que_es: 'Personas individuales que no realizan actividades económicas mercantiles pero requieren identificación tributaria para actos civiles, contratos, gestiones notariales o apertura de cuentas bancarias.',
    lead_text: 'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia sin movimientos comerciales.',
    base_juridica: 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
  },
  'Contribuyentes|||Pequeños Contribuyentes': {
    que_es: 'Régimen tributario simplificado para personas individuales o jurídicas con tarifa definitiva 5% de IVA sin crédito fiscal conforme al límite de ley, así como productores agropecuarios del sector primario.',
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
  }
};

// 4. Agrupaciones y Rutas
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

  if (!n1Map[n1]) {
    n1Map[n1] = { n1, o1, count: 0, actores: new Set(), gestiones: [] };
  }
  n1Map[n1].count++;
  n1Map[n1].actores.add(n2);
  n1Map[n1].gestiones.push(item);

  const k2 = `${n1}|||${n2}`;
  if (!n2Map[k2]) {
    n2Map[k2] = { n1, n2, o1, o2, count: 0, nodos: new Set(), gestiones: [] };
  }
  n2Map[k2].count++;
  n2Map[k2].nodos.add(n3);
  n2Map[k2].gestiones.push(item);

  const k3 = `${n1}|||${n2}|||${n3}`;
  if (!n3Map[k3]) {
    n3Map[k3] = { n1, n2, n3, o1, o2, o3, count: 0, subnodos: new Set(), gestiones: [] };
  }
  n3Map[k3].count++;
  n3Map[k3].subnodos.add(n4);
  n3Map[k3].gestiones.push(item);

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

// 5. Inicializar Libro ExcelJS
const wb = new ExcelJS.Workbook();
wb.creator = 'Superintendencia de Administración Tributaria (SAT Guatemala)';
wb.lastModifiedBy = 'Arquitectura de Información Portal SAT';
wb.created = new Date();
wb.modified = new Date();

function setupSheetBanner(ws, title, subtitle, totalCols) {
  // Fila 1: Banner Institucional
  ws.mergeCells(1, 1, 1, totalCols);
  const r1 = ws.getCell(1, 1);
  r1.value = 'SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA';
  r1.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: COLORS.HEADER_TEXT } };
  r1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };
  r1.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 26;

  // Fila 2: Título de Hoja
  ws.mergeCells(2, 1, 2, totalCols);
  const r2 = ws.getCell(2, 1);
  r2.value = title;
  r2.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: COLORS.HEADER_TEXT } };
  r2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.BLUE_SAT } };
  r2.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 22;

  // Fila 3: Subtítulo y Alcance
  ws.mergeCells(3, 1, 3, totalCols);
  const r3 = ws.getCell(3, 1);
  r3.value = subtitle;
  r3.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.HEADER_TEXT } };
  r3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F4C81' } };
  r3.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(3).height = 18;

  // Fila 4: Espacio
  ws.getRow(4).height = 8;

  // Configurar Freeze Panes en Fila 5 (Encabezados de Columna)
  ws.views = [{ state: 'frozen', ySplit: 5, xSplit: 0, activeCell: 'A6' }];
}

function applyHeaderRow(ws, headers) {
  const row = ws.getRow(5);
  row.height = 30;
  headers.forEach((h, i) => {
    const cell = row.getCell(i + 1);
    cell.value = h.title;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.HEADER_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.BLUE_SAT } };
    cell.alignment = { horizontal: h.align || 'left', vertical: 'middle', wrapText: true };
    cell.border = BORDERS.header;
  });

  // Activar Filtro Automático de Excel
  const lastColLetter = ws.getColumn(headers.length).letter;
  ws.autoFilter = `A5:${lastColLetter}5`;
}

// ==========================================
// HOJA 1: Árbol Jerárquico (N1-N5)
// ==========================================
console.log('Generando Hoja 1: Árbol Jerárquico (N1-N5)...');
const ws1 = wb.addWorksheet('Árbol Jerárquico (N1-N5)');
setupSheetBanner(
  ws1,
  'ÁRBOL JERÁRQUICO MULTINIVEL DE NAVEGACIÓN — ARQUITECTURA DE INFORMACIÓN CANÓNICA (N1–N5)',
  '136 Rutas Operativas Consolidadas · 714 Gestiones Oficiales · Gobernanza Numérica N1 a N5 · Ciclo ATO',
  12
);

const headers1 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Nivel 1', width: 30, align: 'left' },
  { title: 'Nivel 2', width: 32, align: 'left' },
  { title: 'Nivel 3', width: 38, align: 'left' },
  { title: 'Nivel 4', width: 42, align: 'left' },
  { title: 'Qué es: (Definición Operativa)', width: 55, align: 'left' },
  { title: 'Lead text: (Texto Orientador de Interfaz)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)', width: 50, align: 'left' },
  { title: 'Total Gestiones', width: 16, align: 'right' },
  { title: '% Nivel 1', width: 14, align: 'right' },
  { title: '% del Portal', width: 14, align: 'right' },
  { title: 'Ruta Oficial de Navegación (Miga de Pan)', width: 60, align: 'left' }
];

headers1.forEach((h, i) => { ws1.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws1, headers1);

let curRow1 = 6;
let prevN1_1 = null;
let n1StartRow_1 = 6;
let itemNo1 = 1;

sortedPaths.forEach(p => {
  if (prevN1_1 && prevN1_1 !== p.n1) {
    // Insertar Subtotal N1
    const subRow = ws1.getRow(curRow1);
    subRow.height = 24;
    subRow.getCell(1).value = '';
    subRow.getCell(2).value = `SUBTOTAL ${prevN1_1.toUpperCase()}`;
    subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
    subRow.getCell(6).value = `Consolidado oficial de rutas y gestiones para el macro-segmento ${prevN1_1}.`;
    subRow.getCell(6).font = { name: 'Segoe UI', size: 8, italic: true };
    
    // Fórmulas de Subtotal
    const cellCount = subRow.getCell(9);
    cellCount.value = { formula: `SUM(I${n1StartRow_1}:I${curRow1 - 1})`, result: n1Map[prevN1_1].count };
    cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
    cellCount.numFmt = '#,##0';
    cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctN1 = subRow.getCell(10);
    cellPctN1.value = 1.0;
    cellPctN1.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctN1.numFmt = '0.0%';
    cellPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctPort = subRow.getCell(11);
    cellPctPort.value = { formula: `I${curRow1}/$I$148`, result: n1Map[prevN1_1].count / TOTAL_PORTAL };
    cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctPort.numFmt = '0.0%';
    cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

    subRow.getCell(12).value = `Inicio > ${prevN1_1}`;

    for (let c = 1; c <= 12; c++) {
      const cell = subRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
      cell.border = BORDERS.subtotal;
    }

    curRow1++;
    n1StartRow_1 = curRow1;
  }
  prevN1_1 = p.n1;

  const meta = getPathMetadata(p);
  const row = ws1.getRow(curRow1);
  row.height = 36;
  const isZebra = (curRow1 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = itemNo1++;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(2).value = p.n1;
  row.getCell(3).value = p.n2;
  row.getCell(4).value = p.n3;
  row.getCell(5).value = p.n4;

  const cQueEs = row.getCell(6);
  cQueEs.value = meta.que_es;
  cQueEs.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(7);
  cLead.value = meta.lead_text;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(8);
  cBase.value = meta.base_juridica;
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cCount = row.getCell(9);
  cCount.value = p.count;
  cCount.numFmt = '#,##0';
  cCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctN1 = row.getCell(10);
  cPctN1.value = p.count / n1Map[p.n1].count;
  cPctN1.numFmt = '0.0%';
  cPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctPort = row.getCell(11);
  cPctPort.value = { formula: `I${curRow1}/$I$148`, result: p.count / TOTAL_PORTAL };
  cPctPort.numFmt = '0.0%';
  cPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  const breadcrumb = p.n4 === '—' 
    ? (p.n3 === '—' ? `Inicio > ${p.n1} > ${p.n2}` : `Inicio > ${p.n1} > ${p.n2} > ${p.n3}`)
    : `Inicio > ${p.n1} > ${p.n2} > ${p.n3} > ${p.n4}`;
  const cBread = row.getCell(12);
  cBread.value = breadcrumb;
  cBread.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  for (let c = 1; c <= 12; c++) {
    const cell = row.getCell(c);
    if (!cell.fill) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    }
    cell.border = BORDERS.thin;
    if (!cell.font) {
      cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
    }
  }

  curRow1++;
});

// Último subtotal N1
if (prevN1_1) {
  const subRow = ws1.getRow(curRow1);
  subRow.height = 24;
  subRow.getCell(2).value = `SUBTOTAL ${prevN1_1.toUpperCase()}`;
  subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
  subRow.getCell(6).value = `Consolidado oficial de rutas y gestiones para el macro-segmento ${prevN1_1}.`;
  subRow.getCell(6).font = { name: 'Segoe UI', size: 8, italic: true };
  
  const cellCount = subRow.getCell(9);
  cellCount.value = { formula: `SUM(I${n1StartRow_1}:I${curRow1 - 1})`, result: n1Map[prevN1_1].count };
  cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
  cellCount.numFmt = '#,##0';
  cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctN1 = subRow.getCell(10);
  cellPctN1.value = 1.0;
  cellPctN1.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctN1.numFmt = '0.0%';
  cellPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctPort = subRow.getCell(11);
  cellPctPort.value = { formula: `I${curRow1}/$I$148`, result: n1Map[prevN1_1].count / TOTAL_PORTAL };
  cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctPort.numFmt = '0.0%';
  cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  subRow.getCell(12).value = `Inicio > ${prevN1_1}`;

  for (let c = 1; c <= 12; c++) {
    const cell = subRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
    cell.border = BORDERS.subtotal;
  }
  curRow1++;
}

// Gran Total Portal
const totRow1 = ws1.getRow(curRow1);
totRow1.height = 28;
totRow1.getCell(2).value = 'TOTAL PORTAL WEB SAT';
totRow1.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow1.getCell(3).value = '20 Actores Canónicos';
totRow1.getCell(4).value = '62 Nodos Especializados';
totRow1.getCell(5).value = '136 Subnodos Operativos';
totRow1.getCell(6).value = 'Universo total de gestiones clasificadas bajo gobernanza canónica estricta N1 a N5.';
totRow1.getCell(7).value = 'Portal Institucional SAT Guatemala · Cero enlaces rotos · Acceso en 2-3 clics.';
totRow1.getCell(8).value = 'Constitución Política, Código Tributario, CAUCA IV, RECAUCA, Leyes de IVA, ISR, ISCV.';

const totCountCell = totRow1.getCell(9);
totCountCell.value = TOTAL_PORTAL;
totCountCell.font = { name: 'Segoe UI', size: 10, bold: true };
totCountCell.numFmt = '#,##0';
totCountCell.alignment = { horizontal: 'right', vertical: 'middle' };

const totPctN1Cell = totRow1.getCell(10);
totPctN1Cell.value = 1.0;
totPctN1Cell.font = { name: 'Segoe UI', size: 10, bold: true };
totPctN1Cell.numFmt = '0.0%';
totPctN1Cell.alignment = { horizontal: 'right', vertical: 'middle' };

const totPctPortCell = totRow1.getCell(11);
totPctPortCell.value = 1.0;
totPctPortCell.font = { name: 'Segoe UI', size: 10, bold: true };
totPctPortCell.numFmt = '0.0%';
totPctPortCell.alignment = { horizontal: 'right', vertical: 'middle' };

totRow1.getCell(12).value = 'Portal SAT Guatemala';

for (let c = 1; c <= 12; c++) {
  const cell = totRow1.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}


// ==========================================
// HOJA 2: Nivel 1
// ==========================================
console.log('Generando Hoja 2: Nivel 1...');
const ws2 = wb.addWorksheet('Nivel 1');
setupSheetBanner(
  ws2,
  '1. NIVEL 1 — DEFINICIONES INSTITUCIONALES Y ACTORES CANÓNICOS QUE AGRUPA',
  '4 Macro-Segmentos Canónicos · Formato Resumen Arquitectura · Estructura Numérica N1',
  8
);

const headers2 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Nivel 1', width: 32, align: 'left' },
  { title: 'Actores Canónicos que Agrupa (Nivel 2)', width: 45, align: 'left' },
  { title: 'Qué es: (Definición Operativa)', width: 60, align: 'left' },
  { title: 'Lead text: (Texto Orientador de Interfaz)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)', width: 55, align: 'left' },
  { title: 'Total Gestiones', width: 16, align: 'right' },
  { title: '% del Portal', width: 14, align: 'right' }
];
headers2.forEach((h, i) => { ws2.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws2, headers2);

let curRow2 = 6;
N1_DATA.forEach(n1 => {
  const row = ws2.getRow(curRow2);
  row.height = 48;
  const isZebra = (curRow2 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = n1.no;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(2).value = n1.nombre;
  row.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };

  const cAct = row.getCell(3);
  cAct.value = n1.actores;
  cAct.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cQue = row.getCell(4);
  cQue.value = n1.que_es;
  cQue.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(5);
  cLead.value = n1.lead_text;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(6);
  cBase.value = n1.base_juridica;
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const totGest = n1Map[n1.nombre] ? n1Map[n1.nombre].count : 0;
  const cTot = row.getCell(7);
  cTot.value = totGest;
  cTot.font = { name: 'Segoe UI', size: 10, bold: true };
  cTot.numFmt = '#,##0';
  cTot.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPct = row.getCell(8);
  cPct.value = { formula: `G${curRow2}/$G$10`, result: totGest / TOTAL_PORTAL };
  cPct.font = { name: 'Segoe UI', size: 9, bold: true };
  cPct.numFmt = '0.0%';
  cPct.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 8; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    cell.border = BORDERS.thin;
    if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
  }

  curRow2++;
});

// Fila Total Nivel 1
const totRow2 = ws2.getRow(10);
totRow2.height = 28;
totRow2.getCell(2).value = 'TOTAL PORTAL WEB SAT';
totRow2.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow2.getCell(3).value = '20 Actores Canónicos Consolidados';
totRow2.getCell(4).value = 'Universo total de gestiones y servicios del portal';

const cTot2 = totRow2.getCell(7);
cTot2.value = { formula: 'SUM(G6:G9)', result: TOTAL_PORTAL };
cTot2.font = { name: 'Segoe UI', size: 10, bold: true };
cTot2.numFmt = '#,##0';
cTot2.alignment = { horizontal: 'right', vertical: 'middle' };

const cPct2 = totRow2.getCell(8);
cPct2.value = 1.0;
cPct2.font = { name: 'Segoe UI', size: 10, bold: true };
cPct2.numFmt = '0.0%';
cPct2.alignment = { horizontal: 'right', vertical: 'middle' };

for (let c = 1; c <= 8; c++) {
  const cell = totRow2.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}


// ==========================================
// HOJA 3: Nivel 2
// ==========================================
console.log('Generando Hoja 3: Nivel 2...');
const ws3 = wb.addWorksheet('Nivel 2');
setupSheetBanner(
  ws3,
  '2. NIVEL 2 — LOS 20 ACTORES CANÓNICOS Y NODOS QUE AGRUPA (NIVEL 3)',
  '20 Actores Canónicos · Formato Resumen Arquitectura · Estructura Numérica N2',
  10
);

const headers3 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Nivel 1', width: 30, align: 'left' },
  { title: 'Nivel 2', width: 32, align: 'left' },
  { title: 'Nodos que Agrupa (Nivel 3)', width: 45, align: 'left' },
  { title: 'Qué es: (Definición Operativa de la Figura)', width: 55, align: 'left' },
  { title: 'Lead text: (Texto Orientador de Interfaz)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial)', width: 50, align: 'left' },
  { title: 'Total Gestiones', width: 16, align: 'right' },
  { title: '% Nivel 1', width: 14, align: 'right' },
  { title: '% del Portal', width: 14, align: 'right' }
];
headers3.forEach((h, i) => { ws3.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws3, headers3);

let curRow3 = 6;
let prevN1_2 = null;
let n1StartRow_2 = 6;
let itemNo2 = 1;

sortedN2.forEach(n2 => {
  if (prevN1_2 && prevN1_2 !== n2.n1) {
    const subRow = ws3.getRow(curRow3);
    subRow.height = 24;
    subRow.getCell(2).value = `SUBTOTAL ${prevN1_2.toUpperCase()}`;
    subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
    
    const cellCount = subRow.getCell(8);
    cellCount.value = { formula: `SUM(H${n1StartRow_2}:H${curRow3 - 1})`, result: n1Map[prevN1_2].count };
    cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
    cellCount.numFmt = '#,##0';
    cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctN1 = subRow.getCell(9);
    cellPctN1.value = 1.0;
    cellPctN1.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctN1.numFmt = '0.0%';
    cellPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctPort = subRow.getCell(10);
    cellPctPort.value = { formula: `H${curRow3}/$H$30`, result: n1Map[prevN1_2].count / TOTAL_PORTAL };
    cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctPort.numFmt = '0.0%';
    cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

    for (let c = 1; c <= 10; c++) {
      const cell = subRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
      cell.border = BORDERS.subtotal;
    }
    curRow3++;
    n1StartRow_2 = curRow3;
  }
  prevN1_2 = n2.n1;

  const key2 = `${n2.n1}|||${n2.n2}`;
  const desc = N2_DESCRIPTIONS[key2] || {
    que_es: `Actor canónico de ${n2.n2} en ${n2.n1}.`,
    lead_text: `Servicios y gestiones para ${n2.n2}.`,
    base_juridica: 'Código Tributario y Ley Orgánica de la SAT.'
  };

  const nodosList = Array.from(n2.nodos).filter(x => x !== '—').join('; ') || 'Lista directa (Sin nivel intermedio)';
  const row = ws3.getRow(curRow3);
  row.height = 42;
  const isZebra = (curRow3 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = itemNo2++;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(2).value = n2.n1;
  row.getCell(3).value = n2.n2;
  row.getCell(3).font = { name: 'Segoe UI', size: 9, bold: true };

  const cNod = row.getCell(4);
  cNod.value = nodosList;
  cNod.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cQue = row.getCell(5);
  cQue.value = desc.que_es;
  cQue.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(6);
  cLead.value = desc.lead_text;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(7);
  cBase.value = desc.base_juridica;
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cCount = row.getCell(8);
  cCount.value = n2.count;
  cCount.numFmt = '#,##0';
  cCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctN1 = row.getCell(9);
  cPctN1.value = n2.count / n1Map[n2.n1].count;
  cPctN1.numFmt = '0.0%';
  cPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctPort = row.getCell(10);
  cPctPort.value = { formula: `H${curRow3}/$H$30`, result: n2.count / TOTAL_PORTAL };
  cPctPort.numFmt = '0.0%';
  cPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 10; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    cell.border = BORDERS.thin;
    if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
  }
  curRow3++;
});

// Último subtotal N2
if (prevN1_2) {
  const subRow = ws3.getRow(curRow3);
  subRow.height = 24;
  subRow.getCell(2).value = `SUBTOTAL ${prevN1_2.toUpperCase()}`;
  subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
  
  const cellCount = subRow.getCell(8);
  cellCount.value = { formula: `SUM(H${n1StartRow_2}:H${curRow3 - 1})`, result: n1Map[prevN1_2].count };
  cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
  cellCount.numFmt = '#,##0';
  cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctN1 = subRow.getCell(9);
  cellPctN1.value = 1.0;
  cellPctN1.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctN1.numFmt = '0.0%';
  cellPctN1.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctPort = subRow.getCell(10);
  cellPctPort.value = { formula: `H${curRow3}/$H$30`, result: n1Map[prevN1_2].count / TOTAL_PORTAL };
  cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctPort.numFmt = '0.0%';
  cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 10; c++) {
    const cell = subRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
    cell.border = BORDERS.subtotal;
  }
  curRow3++;
}

// Gran Total Nivel 2
const totRow3 = ws3.getRow(curRow3);
totRow3.height = 28;
totRow3.getCell(2).value = 'TOTAL PORTAL WEB SAT';
totRow3.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow3.getCell(3).value = '20 Actores Canónicos';

const cTot3 = totRow3.getCell(8);
cTot3.value = TOTAL_PORTAL;
cTot3.font = { name: 'Segoe UI', size: 10, bold: true };
cTot3.numFmt = '#,##0';
cTot3.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctN1_3 = totRow3.getCell(9);
cPctN1_3.value = 1.0;
cPctN1_3.font = { name: 'Segoe UI', size: 10, bold: true };
cPctN1_3.numFmt = '0.0%';
cPctN1_3.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctPort_3 = totRow3.getCell(10);
cPctPort_3.value = 1.0;
cPctPort_3.font = { name: 'Segoe UI', size: 10, bold: true };
cPctPort_3.numFmt = '0.0%';
cPctPort_3.alignment = { horizontal: 'right', vertical: 'middle' };

for (let c = 1; c <= 10; c++) {
  const cell = totRow3.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}


// ==========================================
// HOJA 4: Nivel 3
// ==========================================
console.log('Generando Hoja 4: Nivel 3...');
const ws4 = wb.addWorksheet('Nivel 3');
setupSheetBanner(
  ws4,
  '3. NIVEL 3 — NODOS ESPECIALIZADOS Y SUBNODOS QUE AGRUPA (NIVEL 4)',
  '62 Nodos Especializados · Formato Resumen Arquitectura · Estructura Numérica N3',
  11
);

const headers4 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Nivel 1', width: 30, align: 'left' },
  { title: 'Nivel 2', width: 32, align: 'left' },
  { title: 'Nivel 3', width: 38, align: 'left' },
  { title: 'Subnodos que Agrupa (Nivel 4)', width: 45, align: 'left' },
  { title: 'Qué es: (Definición Operativa del Nodo)', width: 55, align: 'left' },
  { title: 'Lead text: (Texto Orientador de Interfaz)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial)', width: 50, align: 'left' },
  { title: 'Total Gestiones', width: 16, align: 'right' },
  { title: '% Nivel 2', width: 14, align: 'right' },
  { title: '% del Portal', width: 14, align: 'right' }
];
headers4.forEach((h, i) => { ws4.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws4, headers4);

let curRow4 = 6;
let prevN1_4 = null;
let n1StartRow_4 = 6;
let itemNo3 = 1;

sortedN3.forEach(n3 => {
  if (prevN1_4 && prevN1_4 !== n3.n1) {
    const subRow = ws4.getRow(curRow4);
    subRow.height = 24;
    subRow.getCell(2).value = `SUBTOTAL ${prevN1_4.toUpperCase()}`;
    subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
    
    const cellCount = subRow.getCell(9);
    cellCount.value = { formula: `SUM(I${n1StartRow_4}:I${curRow4 - 1})`, result: n1Map[prevN1_4].count };
    cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
    cellCount.numFmt = '#,##0';
    cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctN2 = subRow.getCell(10);
    cellPctN2.value = 1.0;
    cellPctN2.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctN2.numFmt = '0.0%';
    cellPctN2.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctPort = subRow.getCell(11);
    cellPctPort.value = { formula: `I${curRow4}/$I$72`, result: n1Map[prevN1_4].count / TOTAL_PORTAL };
    cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctPort.numFmt = '0.0%';
    cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

    for (let c = 1; c <= 11; c++) {
      const cell = subRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
      cell.border = BORDERS.subtotal;
    }
    curRow4++;
    n1StartRow_4 = curRow4;
  }
  prevN1_4 = n3.n1;

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
  const row = ws4.getRow(curRow4);
  row.height = 42;
  const isZebra = (curRow4 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = itemNo3++;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(2).value = n3.n1;
  row.getCell(3).value = n3.n2;
  row.getCell(4).value = n3.n3;
  row.getCell(4).font = { name: 'Segoe UI', size: 9, bold: true };

  const cSub = row.getCell(5);
  cSub.value = subnodosList;
  cSub.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cQue = row.getCell(6);
  cQue.value = desc.que_es;
  cQue.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(7);
  cLead.value = desc.lead_text;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(8);
  cBase.value = desc.base_juridica;
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cCount = row.getCell(9);
  cCount.value = n3.count;
  cCount.numFmt = '#,##0';
  cCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctN2 = row.getCell(10);
  cPctN2.value = n3.count / n2Map[key2].count;
  cPctN2.numFmt = '0.0%';
  cPctN2.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctPort = row.getCell(11);
  cPctPort.value = { formula: `I${curRow4}/$I$72`, result: n3.count / TOTAL_PORTAL };
  cPctPort.numFmt = '0.0%';
  cPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 11; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    cell.border = BORDERS.thin;
    if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
  }
  curRow4++;
});

// Último subtotal N3
if (prevN1_4) {
  const subRow = ws4.getRow(curRow4);
  subRow.height = 24;
  subRow.getCell(2).value = `SUBTOTAL ${prevN1_4.toUpperCase()}`;
  subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
  
  const cellCount = subRow.getCell(9);
  cellCount.value = { formula: `SUM(I${n1StartRow_4}:I${curRow4 - 1})`, result: n1Map[prevN1_4].count };
  cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
  cellCount.numFmt = '#,##0';
  cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctN2 = subRow.getCell(10);
  cellPctN2.value = 1.0;
  cellPctN2.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctN2.numFmt = '0.0%';
  cellPctN2.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctPort = subRow.getCell(11);
  cellPctPort.value = { formula: `I${curRow4}/$I$72`, result: n1Map[prevN1_4].count / TOTAL_PORTAL };
  cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctPort.numFmt = '0.0%';
  cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 11; c++) {
    const cell = subRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
    cell.border = BORDERS.subtotal;
  }
  curRow4++;
}

// Gran Total Nivel 3
const totRow4 = ws4.getRow(curRow4);
totRow4.height = 28;
totRow4.getCell(2).value = 'TOTAL PORTAL WEB SAT';
totRow4.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow4.getCell(3).value = '20 Actores Canónicos';
totRow4.getCell(4).value = '62 Nodos Especializados';

const cTot4 = totRow4.getCell(9);
cTot4.value = TOTAL_PORTAL;
cTot4.font = { name: 'Segoe UI', size: 10, bold: true };
cTot4.numFmt = '#,##0';
cTot4.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctN2_4 = totRow4.getCell(10);
cPctN2_4.value = 1.0;
cPctN2_4.font = { name: 'Segoe UI', size: 10, bold: true };
cPctN2_4.numFmt = '0.0%';
cPctN2_4.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctPort_4 = totRow4.getCell(11);
cPctPort_4.value = 1.0;
cPctPort_4.font = { name: 'Segoe UI', size: 10, bold: true };
cPctPort_4.numFmt = '0.0%';
cPctPort_4.alignment = { horizontal: 'right', vertical: 'middle' };

for (let c = 1; c <= 11; c++) {
  const cell = totRow4.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}


// ==========================================
// HOJA 5: Nivel 4
// ==========================================
console.log('Generando Hoja 5: Nivel 4...');
const ws5 = wb.addWorksheet('Nivel 4');
setupSheetBanner(
  ws5,
  '4. NIVEL 4 — SUBNODOS OPERATIVOS Y GESTIONES QUE AGRUPA (NIVEL 5)',
  '136 Subnodos Operativos · Formato Resumen Arquitectura · Estructura Numérica N4',
  12
);

const headers5 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Nivel 1', width: 30, align: 'left' },
  { title: 'Nivel 2', width: 32, align: 'left' },
  { title: 'Nivel 3', width: 38, align: 'left' },
  { title: 'Nivel 4', width: 42, align: 'left' },
  { title: 'Gestiones que Agrupa (Nivel 5)', width: 55, align: 'left' },
  { title: 'Qué es: (Definición Operativa del Subnodo)', width: 55, align: 'left' },
  { title: 'Lead text: (Texto Orientador de Interfaz)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial)', width: 50, align: 'left' },
  { title: 'Total Gestiones', width: 16, align: 'right' },
  { title: '% Nivel 3', width: 14, align: 'right' },
  { title: '% del Portal', width: 14, align: 'right' }
];
headers5.forEach((h, i) => { ws5.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws5, headers5);

let curRow5 = 6;
let prevN1_5 = null;
let n1StartRow_5 = 6;
let itemNo4 = 1;

sortedPaths.forEach(p => {
  if (prevN1_5 && prevN1_5 !== p.n1) {
    const subRow = ws5.getRow(curRow5);
    subRow.height = 24;
    subRow.getCell(2).value = `SUBTOTAL ${prevN1_5.toUpperCase()}`;
    subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
    
    const cellCount = subRow.getCell(10);
    cellCount.value = { formula: `SUM(J${n1StartRow_5}:J${curRow5 - 1})`, result: n1Map[prevN1_5].count };
    cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
    cellCount.numFmt = '#,##0';
    cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctN3 = subRow.getCell(11);
    cellPctN3.value = 1.0;
    cellPctN3.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctN3.numFmt = '0.0%';
    cellPctN3.alignment = { horizontal: 'right', vertical: 'middle' };

    const cellPctPort = subRow.getCell(12);
    cellPctPort.value = { formula: `J${curRow5}/$J$148`, result: n1Map[prevN1_5].count / TOTAL_PORTAL };
    cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
    cellPctPort.numFmt = '0.0%';
    cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

    for (let c = 1; c <= 12; c++) {
      const cell = subRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
      cell.border = BORDERS.subtotal;
    }
    curRow5++;
    n1StartRow_5 = curRow5;
  }
  prevN1_5 = p.n1;

  const meta = getPathMetadata(p);
  const gestionesList = p.gestiones.slice(0, 4).map(g => g.substring(0, 45)).join('; ') + (p.gestiones.length > 4 ? ` ... (+${p.gestiones.length - 4} más)` : '');
  const key3 = `${p.n1}|||${p.n2}|||${p.n3}`;
  const row = ws5.getRow(curRow5);
  row.height = 42;
  const isZebra = (curRow5 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = itemNo4++;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(2).value = p.n1;
  row.getCell(3).value = p.n2;
  row.getCell(4).value = p.n3;
  row.getCell(5).value = p.n4;
  row.getCell(5).font = { name: 'Segoe UI', size: 9, bold: true };

  const cGest = row.getCell(6);
  cGest.value = gestionesList;
  cGest.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cQue = row.getCell(7);
  cQue.value = meta.que_es;
  cQue.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(8);
  cLead.value = meta.lead_text;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(9);
  cBase.value = meta.base_juridica;
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cCount = row.getCell(10);
  cCount.value = p.count;
  cCount.numFmt = '#,##0';
  cCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctN3 = row.getCell(11);
  cPctN3.value = p.count / n3Map[key3].count;
  cPctN3.numFmt = '0.0%';
  cPctN3.alignment = { horizontal: 'right', vertical: 'middle' };

  const cPctPort = row.getCell(12);
  cPctPort.value = { formula: `J${curRow5}/$J$148`, result: p.count / TOTAL_PORTAL };
  cPctPort.numFmt = '0.0%';
  cPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 12; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    cell.border = BORDERS.thin;
    if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
  }
  curRow5++;
});

// Último subtotal N4
if (prevN1_5) {
  const subRow = ws5.getRow(curRow5);
  subRow.height = 24;
  subRow.getCell(2).value = `SUBTOTAL ${prevN1_5.toUpperCase()}`;
  subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
  
  const cellCount = subRow.getCell(10);
  cellCount.value = { formula: `SUM(J${n1StartRow_5}:J${curRow5 - 1})`, result: n1Map[prevN1_5].count };
  cellCount.font = { name: 'Segoe UI', size: 9, bold: true };
  cellCount.numFmt = '#,##0';
  cellCount.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctN3 = subRow.getCell(11);
  cellPctN3.value = 1.0;
  cellPctN3.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctN3.numFmt = '0.0%';
  cellPctN3.alignment = { horizontal: 'right', vertical: 'middle' };

  const cellPctPort = subRow.getCell(12);
  cellPctPort.value = { formula: `J${curRow5}/$J$148`, result: n1Map[prevN1_5].count / TOTAL_PORTAL };
  cellPctPort.font = { name: 'Segoe UI', size: 9, bold: true };
  cellPctPort.numFmt = '0.0%';
  cellPctPort.alignment = { horizontal: 'right', vertical: 'middle' };

  for (let c = 1; c <= 12; c++) {
    const cell = subRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
    cell.border = BORDERS.subtotal;
  }
  curRow5++;
}

// Gran Total Nivel 4
const totRow5 = ws5.getRow(curRow5);
totRow5.height = 28;
totRow5.getCell(2).value = 'TOTAL PORTAL WEB SAT';
totRow5.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow5.getCell(3).value = '20 Actores Canónicos';
totRow5.getCell(4).value = '62 Nodos Especializados';
totRow5.getCell(5).value = '136 Subnodos Operativos';
totRow5.getCell(6).value = '714 Gestiones Oficiales';

const cTot5 = totRow5.getCell(10);
cTot5.value = TOTAL_PORTAL;
cTot5.font = { name: 'Segoe UI', size: 10, bold: true };
cTot5.numFmt = '#,##0';
cTot5.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctN3_5 = totRow5.getCell(11);
cPctN3_5.value = 1.0;
cPctN3_5.font = { name: 'Segoe UI', size: 10, bold: true };
cPctN3_5.numFmt = '0.0%';
cPctN3_5.alignment = { horizontal: 'right', vertical: 'middle' };

const cPctPort_5 = totRow5.getCell(12);
cPctPort_5.value = 1.0;
cPctPort_5.font = { name: 'Segoe UI', size: 10, bold: true };
cPctPort_5.numFmt = '0.0%';
cPctPort_5.alignment = { horizontal: 'right', vertical: 'middle' };

for (let c = 1; c <= 12; c++) {
  const cell = totRow5.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}


// ==========================================
// HOJA 6: Nivel 5
// ==========================================
console.log('Generando Hoja 6: Nivel 5 (Catálogo Canónico de Gestiones)...');
const ws6 = wb.addWorksheet('Nivel 5');
setupSheetBanner(
  ws6,
  '5. NIVEL 5 — CATÁLOGO CANÓNICO DE GESTIONES Y SERVICIOS INSTITUCIONALES',
  '714 Gestiones Oficiales · Código Inmutable SAT-GES-#### · Gobernanza ATO · URLs Validadas HTTP 200',
  13
);

const headers6 = [
  { title: 'No.', width: 6, align: 'center' },
  { title: 'Código Canónico', width: 16, align: 'center' },
  { title: 'Nivel 1', width: 28, align: 'left' },
  { title: 'Nivel 2', width: 28, align: 'left' },
  { title: 'Nivel 3', width: 32, align: 'left' },
  { title: 'Nivel 4', width: 35, align: 'left' },
  { title: 'Nivel 5 (Gestión Canónica)', width: 45, align: 'left' },
  { title: 'Qué es: (Descripción Operativa de la Gestión)', width: 55, align: 'left' },
  { title: 'Lead text: (Acción Directa al Ciudadano)', width: 45, align: 'left' },
  { title: 'Base jurídica: (Fundamento Legal Oficial)', width: 50, align: 'left' },
  { title: 'Etapa ATO', width: 22, align: 'left' },
  { title: 'Tipo de Interacción', width: 22, align: 'center' },
  { title: 'URL Oficial Verificada', width: 55, align: 'left' }
];
headers6.forEach((h, i) => { ws6.getColumn(i + 1).width = h.width; });
applyHeaderRow(ws6, headers6);

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

let curRow6 = 6;
let prevN1_6 = null;
let n1Count_6 = 0;
let itemNo5 = 1;

sortedGestiones.forEach(g => {
  const n1 = g.nivel1 || 'Contribuyentes';
  if (prevN1_6 && prevN1_6 !== n1) {
    const subRow = ws6.getRow(curRow6);
    subRow.height = 24;
    subRow.getCell(2).value = `SUBTOTAL ${prevN1_6.toUpperCase()}`;
    subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
    subRow.getCell(7).value = `${n1Count_6} Gestiones`;
    subRow.getCell(7).font = { name: 'Segoe UI', size: 9, bold: true };
    subRow.getCell(8).value = `Consolidado oficial de gestiones canónicas para el macro-segmento ${prevN1_6}.`;

    for (let c = 1; c <= 13; c++) {
      const cell = subRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
      cell.border = BORDERS.subtotal;
    }
    curRow6++;
    n1Count_6 = 0;
  }
  prevN1_6 = n1;
  n1Count_6++;

  const row = ws6.getRow(curRow6);
  row.height = 42;
  const isZebra = (curRow6 % 2 === 1);
  const rowBg = isZebra ? COLORS.ZEBRA_BG : COLORS.WHITE_BG;

  row.getCell(1).value = itemNo5++;
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  const cod = g.codigo || `SAT-GES-${String(itemNo5 - 1).padStart(4, '0')}`;
  const cCod = row.getCell(2);
  cCod.value = cod;
  cCod.font = { name: 'Consolas', size: 9, bold: true, color: { argb: COLORS.BLUE_SAT } };
  cCod.alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(3).value = n1;
  row.getCell(4).value = g.nivel2 || '—';
  row.getCell(5).value = g.nivel3 || '—';
  row.getCell(6).value = g.nivel4 || '—';

  const n5 = g.gestion || g.nombreActual || '—';
  const cGes = row.getCell(7);
  cGes.value = n5;
  cGes.font = { name: 'Segoe UI', size: 9, bold: true };
  cGes.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cQue = row.getCell(8);
  cQue.value = g.descripcion || g.que_es || `Gestión institucional oficial para ${n5}.`;
  cQue.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cLead = row.getCell(9);
  cLead.value = g.lead_text || `Realiza y consulta la gestión oficial de ${n5.toLowerCase()}.`;
  cLead.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: COLORS.LEAD_TEXT_COLOR } };
  cLead.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cBase = row.getCell(10);
  cBase.value = g.baseLegal || 'Código Tributario y Ley Orgánica de la SAT.';
  cBase.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  const cAto = row.getCell(11);
  cAto.value = g.etapaAto || '1. Empezar y registrarse';
  cAto.alignment = { horizontal: 'left', vertical: 'middle' };

  const cInt = row.getCell(12);
  cInt.value = g.tipoInteraccion || 'Guía Informativa';
  cInt.alignment = { horizontal: 'center', vertical: 'middle' };

  const cUrl = row.getCell(13);
  const targetUrl = g.urlOficial || 'https://portal.sat.gob.gt/';
  cUrl.value = { text: targetUrl, hyperlink: targetUrl };
  cUrl.font = { name: 'Segoe UI', size: 9, underline: true, color: { argb: COLORS.LINK_BLUE } };
  cUrl.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

  for (let c = 1; c <= 13; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
    cell.border = BORDERS.thin;
    if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, color: { argb: COLORS.TEXT_DARK } };
  }
  curRow6++;
});

// Último subtotal N5
if (prevN1_6) {
  const subRow = ws6.getRow(curRow6);
  subRow.height = 24;
  subRow.getCell(2).value = `SUBTOTAL ${prevN1_6.toUpperCase()}`;
  subRow.getCell(2).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.TEXT_DARK } };
  subRow.getCell(7).value = `${n1Count_6} Gestiones`;
  subRow.getCell(7).font = { name: 'Segoe UI', size: 9, bold: true };
  subRow.getCell(8).value = `Consolidado oficial de gestiones canónicas para el macro-segmento ${prevN1_6}.`;

  for (let c = 1; c <= 13; c++) {
    const cell = subRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SUBTOTAL_BG } };
    cell.border = BORDERS.subtotal;
  }
  curRow6++;
}

// Gran Total N5
const totRow6 = ws6.getRow(curRow6);
totRow6.height = 28;
totRow6.getCell(2).value = 'GRAN TOTAL PORTAL SAT';
totRow6.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };
totRow6.getCell(7).value = `${TOTAL_PORTAL} Gestiones`;
totRow6.getCell(7).font = { name: 'Segoe UI', size: 10, bold: true };
totRow6.getCell(8).value = 'Universo total de gestiones clasificadas y sincronizadas con el portal de producción SAT.';

for (let c = 1; c <= 13; c++) {
  const cell = totRow6.getCell(c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.GRAND_TOTAL_BG } };
  cell.border = BORDERS.grandTotal;
  if (!cell.font) cell.font = { name: 'Segoe UI', size: 9, bold: true };
}

// ==========================================
// GUARDAR LIBRO CON FORMATO ENRIQUECIDO
// ==========================================
const targetFile = 'docs/fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx';
const publicDir = 'public/downloads';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicFile = path.join(publicDir, 'Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx');

async function saveWorkbook() {
  console.log(`Guardando libro Gold Standard en ${targetFile}...`);
  await wb.xlsx.writeFile(targetFile);

  console.log(`Guardando copia en ${publicFile} para descarga directa...`);
  await wb.xlsx.writeFile(publicFile);

  console.log('¡Libro Gold Standard generado exitosamente con ExcelJS!');
  console.log('Hojas incluidas:', wb.worksheets.map(w => w.name));
}

saveWorkbook().catch(err => {
  console.error('Error al guardar el libro:', err);
  process.exit(1);
});
