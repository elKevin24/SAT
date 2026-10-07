import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Cargar dataset maestro
all_t = json.load(open('src/data/allTramites.json', encoding='utf-8'))

wb = openpyxl.Workbook()
wb.remove(wb.active)

# Paleta Institucional SAT
NAVY_HEADER = '14649B'      # Azul SAT Primario
BLUE_HEADER = '19324B'      # Azul Oscuro Título
CYAN_ACCENT = '0284C7'      # Celeste Operaciones
GREEN_ACCENT = '059669'     # Verde Consultas
ORANGE_ACCENT = 'C25E00'    # Naranja Brechas / Modificaciones
PURPLE_ACCENT = '7C3AED'    # Morado Normativa
ZEBRA_FILL = 'F8FAFC'       # Gris azulado tenue
BORDER_COLOR = 'CBD5E1'     # Borde neutro

font_title = Font(name='Segoe UI', size=16, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='FFFFFF')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_body = Font(name='Segoe UI', size=9)
font_bold = Font(name='Segoe UI', size=9, bold=True)
font_small = Font(name='Segoe UI', size=8, color='475569')

thin_border = Border(
    left=Side(style='thin', color=BORDER_COLOR),
    right=Side(style='thin', color=BORDER_COLOR),
    top=Side(style='thin', color=BORDER_COLOR),
    bottom=Side(style='thin', color=BORDER_COLOR)
)

header_border = Border(
    left=Side(style='thin', color='FFFFFF'),
    right=Side(style='thin', color='FFFFFF'),
    top=Side(style='medium', color='FFFFFF'),
    bottom=Side(style='medium', color='FFFFFF')
)

# ==============================================================================
# DATOS MAESTROS DEL MAPA CON DESCRIPCIONES Y BASE LEGAL
# ==============================================================================
# Cada fila define un nodo de navegación con su audiencia ("Para quién es"),
# su alcance funcional ("Qué se puede hacer aquí") y su "Base legal (En base a qué)".
MAPA_DATA = [
    # --------------------------------------------------------------------------
    # 1. CONTRIBUYENTES
    # --------------------------------------------------------------------------
    {
        'segmento': 'Contribuyentes',
        'categoria': 'NIT sin Obligaciones',
        'grupo': 'Personas Individuales',
        'tema': 'RTU Digital y Solicitud de NIT',
        'para_quien': 'Personas individuales, estudiantes, asalariados y personas en el extranjero que no realizan actividad económica pero requieren NIT para trámites civiles, herencias, cuentas bancarias o compra de bienes.',
        'que_hace': 'Inscripción de primer NIT en línea, actualización de datos de residencia, solicitud de solvencia fiscal y consultas ciudadanas.',
        'base_legal': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Pequeños Contribuyentes',
        'grupo': 'Pequeño Contribuyente General',
        'tema': 'Régimen de 5% y Facturación FEL',
        'para_quien': 'Personas individuales o jurídicas con ventas o servicios de hasta Q150,000 en el año calendario que tributan con una tarifa definitiva del 5% sin derecho a crédito fiscal.',
        'que_hace': 'Inscripción y cambio de régimen, habilitación de factura electrónica FEL, declaración mensual en Declaraguate (SAT-2046) y cierre o suspensión de actividades.',
        'base_legal': 'Ley del IVA (Decreto 27-92, Arts. 45 al 50) y Ley de Simplificación Tributaria (Decreto 7-2019, Régimen Electrónico de Pequeño Contribuyente).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Pequeños Contribuyentes',
        'grupo': 'Sector Primario y Agropecuario',
        'tema': 'Regímenes Especiales Decreto 31-2024 / 7-2019',
        'para_quien': 'Productores y comercializadores artesanales, agrícolas y ganaderos que operan en los regímenes simplificados del sector primario y pecuario.',
        'que_hace': 'Inscripción en padrón agropecuario, liquidación y pago del Impuesto a la Confianza Tributaria (ICT) y emisión de documentos tributarios autorizados.',
        'base_legal': 'Decreto 7-2019 y Decreto 31-2024 (Ley para la Integración del Sector Productivo Primario y Agropecuario).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Contribuyente General',
        'grupo': 'Personas y Empresas en Régimen General',
        'tema': 'IVA General e Impuesto Sobre la Renta (ISR)',
        'para_quien': 'Empresas individuales, sociedades mercantiles y profesionales con ingresos mayores a Q150,000 o afiliados al Régimen General del IVA y del ISR (Opcional Simplificado o Sobre Utilidades).',
        'que_hace': 'Declaración y pago mensual de IVA (SAT-2237), pagos trimestrales o mensuales de ISR (SAT-1311/SAT-1411), liquidación de ISO y emisión obligatoria de FEL.',
        'base_legal': 'Ley del IVA (Decreto 27-92), Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Ley del Impuesto de Solidaridad (Decreto 73-2008).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Asalariados',
        'grupo': 'Trabajadores en Relación de Dependencia',
        'tema': 'Retenciones de ISR y Planilla del IVA',
        'para_quien': 'Trabajadores contratados por patronos públicos o privados que perciben sueldos, salarios o bonificaciones sujetos a retención del Impuesto Sobre la Renta.',
        'que_hace': 'Proyección anual de ISR, presentación de la planilla electrónica del IVA con comprobantes FEL y solicitud de devolución de retenciones practicadas en exceso.',
        'base_legal': 'Ley de Actualización Tributaria (Decreto 10-2012, Arts. 68 al 82 - Rentas del Trabajo en Relación de Dependencia).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Vehículos',
        'grupo': 'Propietarios y Compradores de Vehículos',
        'tema': 'Registro Fiscal de Vehículos (RFV)',
        'para_quien': 'Personas y empresas propietarias de automotores, importadores de vehículos y ciudadanos que compran o venden automóviles terrestres, motos o unidades marítimas.',
        'que_hace': 'Pago del Impuesto sobre Circulación (ISCV - Calcomanía), primeras placas, traspaso electrónico con notario, reposición de tarjeta y distintivos, y baja o inactivación.',
        'base_legal': 'Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos (Decreto 70-94) y Código Tributario (Decreto 6-91).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Contribuyentes Especiales',
        'grupo': 'Grandes y Medianos Contribuyentes',
        'tema': 'Gerencias Especializadas de Fiscalización',
        'para_quien': 'Contribuyentes calificados por resolución de la SAT en función de su representatividad fiscal, nivel de facturación y sector económico.',
        'que_hace': 'Atención en gerencias diferenciadas, presentación de estados financieros auditados, precios de transferencia y control intensivo de solvencia.',
        'base_legal': 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Resoluciones de Directorio de Calificación de Contribuyentes Especiales.',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Facturación Electrónica',
        'grupo': 'Emisores de DTE',
        'tema': 'Sistema FEL y Agencia Virtual',
        'para_quien': 'Todos los contribuyentes afiliados al régimen tributario nacional obligados a emitir facturas, notas de crédito, notas de débito y recibos digitales.',
        'que_hace': 'Habilitación como emisor FEL, emisión gratuita desde la Agencia Virtual, anulación de DTE, consulta de facturas recibidas y acreditación de certificadores.',
        'base_legal': 'Ley del IVA (Decreto 27-92, Arts. 29 y 29 "A") y Acuerdo de Directorio SAT 13-2018 (Régimen FEL).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Servicios al Contribuyente',
        'grupo': 'Ciudadanía y Usuarios de Agencia Virtual',
        'tema': 'Plataforma Digital, Citas y Solvencias',
        'para_quien': 'Cualquier persona individual o jurídica que necesita gestionar claves de acceso, citas presenciales, solvencias fiscales o presentar consultas.',
        'que_hace': 'Creación y reseteo de usuario en Agencia Virtual, emisión de solvencia fiscal inmediata, programación de citas presenciales y consulta de NIT.',
        'base_legal': 'Código Tributario (Decreto 6-91, Art. 57 "A" y Art. 120) y Acuerdos de Directorio de Servicios Electrónicos.',
    },

    # --------------------------------------------------------------------------
    # 2. OPERADORES DE COMERCIO EXTERIOR (12 ACTORES OFICIALES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Importadores y Exportadores (Compartido)',
        'grupo': 'Operadores Comerciales Generales',
        'tema': 'Gestiones Aduaneras Comunes y Arancel',
        'para_quien': 'Empresas y personas que realizan operaciones transfronterizas de entrada y salida de mercancías.',
        'que_hace': 'Consulta del Arancel Integrado Centroamericano (SAC), pago electrónico por BancaSAT, DUCA general, solvencia aduanera y permisos no arancelarios.',
        'base_legal': 'Código Aduanero Uniforme Centroamericano (CAUCA IV), Reglamento (RECAUCA IV) y Convenio Arancelario Centroamericano.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Importadores',
        'grupo': 'Importadores Registrados',
        'tema': 'Padrón de Importadores y DUCA-D',
        'para_quien': 'Empresas y personas individuales autorizadas en el padrón aduanero de la SAT para introducir mercancías al territorio nacional.',
        'que_hace': 'Inscripción en el padrón de importadores, liquidación de DUCA-D de importación, declaración del valor aduanero, rescate de mercancías en abandono e IPRIMA.',
        'base_legal': 'CAUCA IV, RECAUCA IV (Despacho Aduanero de Importación) y Acuerdo Relativo a la Aplicación del Artículo VII del GATT (Valoración OMC).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Exportadores',
        'grupo': 'Exportadores Habituales y Ocasionales',
        'tema': 'Padrón de Exportadores y Devolución IVA',
        'para_quien': 'Personas y empresas inscritas en el Registro de Exportadores de la SAT que despachan productos nacionales hacia mercados internacionales.',
        'que_hace': 'Inscripción en Agencia Virtual con código VUPE, autorización de listas de embarque, declaraciones simplificadas y solicitud de devolución de crédito fiscal del IVA.',
        'base_legal': 'Ley de Fomento y Maquila (Decreto 29-89), Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis) y CAUCA/RECAUCA.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Operador Económico Autorizado (OEA)',
        'grupo': 'Operadores Certificados en Seguridad',
        'tema': 'Cadena Logística Segura y Carril Exprés',
        'para_quien': 'Empresas calificadas por la Intendencia de Aduanas que garantizan altos estándares de seguridad en la cadena logística internacional.',
        'que_hace': 'Acceso a carriles preferenciales en puestos fronterizos y puertos, atención prioritaria en contingencias, reducción de selectivo rojo y despacho ágil.',
        'base_legal': 'Marco Normativo SAFE de la Organización Mundial de Aduanas (OMA), CAUCA IV y Acuerdos de Directorio SAT.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Agentes Aduaneros',
        'grupo': 'Auxiliares de la Función Pública Aduanera',
        'tema': 'Despacho Aduanero Oficial y Representación',
        'para_quien': 'Profesionales autorizados por el Directorio de la SAT para prestar servicios a terceros en el despacho de mercancías ante la aduana.',
        'que_hace': 'Habilitación de carné oficial, constitución de seguro de caución, transmisión de DUCAs con firma electrónica, acreditación de asistentes y recursos legales.',
        'base_legal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Arts. 74 al 85) y Ley Nacional de Aduanas.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Apoderados Especiales Aduaneros',
        'grupo': 'Representantes Legales Exclusivos',
        'tema': 'Despacho Aduanero por Cuenta Propia',
        'para_quien': 'Personas individuales designadas mediante mandato por una persona jurídica para representarla exclusivamente en sus despachos aduaneros.',
        'que_hace': 'Registro de mandato legal, renovación anual de autorización, carné de apoderado, presentación de fianzas operativas y gestión de DUCAs corporativas.',
        'base_legal': 'CAUCA IV (Art. 21), RECAUCA IV (Arts. 86 al 90) y Ley Nacional de Aduanas.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Empresas de Entrega Rápida o Courier',
        'grupo': 'Mensajería y Envíos Expresos',
        'tema': 'Paquetería Internacional y Franquicias',
        'para_quien': 'Empresas de paquetería urgente que transportan y desaduanan envíos postales no comerciales y encomiendas internacionales.',
        'que_hace': 'Transmisión de manifiestos courier, despacho simplificado oficioso (Categorías A, B y C), habilitación de recintos desconsolidadores y franquicias.',
        'base_legal': 'CAUCA IV y RECAUCA IV (Arts. 574 al 596 - Régimen de Envíos de Entrega Rápida o Courier).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Consolidadores y Desconsolidadores de Carga',
        'grupo': 'Operadores Logísticos y de Carga',
        'tema': 'Manifiestos CUSCAR y Guías Hijas',
        'para_quien': 'Empresas autorizadas para agrupar o desagrupar mercancías de diferentes consignatarios en una sola unidad de carga.',
        'que_hace': 'Transmisión electrónica del mensaje CUSCAR, desconsolidación de conocimientos de embarque (B/L, AWB) y reporte de faltantes, sobrantes o averías.',
        'base_legal': 'CAUCA IV y RECAUCA IV (Arts. 102 al 109 - Empresas Consolidadoras y Desconsolidadoras de Carga).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Transportistas Aduaneros',
        'grupo': 'Transporte Internacional Terrestre y Carga',
        'tema': 'Tránsito Aduanero Internacional y Marchamo',
        'para_quien': 'Empresas y conductores de transporte internacional de carga terrestre, aéreo y marítimo autorizados ante la SAT.',
        'que_hace': 'Registro de medios de transporte, admisión temporal de equipo (ATC), colocación de marchamo electrónico RFID, transmisión de DUCA-T y cartas de ingreso.',
        'base_legal': 'CAUCA IV (Arts. 18 al 20), RECAUCA IV (Tránsito Aduanero Terrestre) y Reglamentos de Transporte Centroamericano.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Depósitos Aduaneros',
        'grupo': 'Almacenes Fiscales, AGD y DAT',
        'tema': 'Custodia de Mercancías y Títulos de Crédito',
        'para_quien': 'Entidades públicas y privadas autorizadas para custodiar mercancías extranjeras bajo control aduanero con suspensión de tributos.',
        'que_hace': 'Recepción de mercancías, control de permanencia y cobro SCP, emisión de certificados de depósito y bonos de prenda (AGD), actas DAT y reporte de inventarios.',
        'base_legal': 'Decreto 1236 (Ley de Almacenes Generales de Depósito), CAUCA IV y RECAUCA IV (Arts. 119 al 129 - Régimen de Depósito Aduanero).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'ZDEEP - Entidades Administradoras',
        'grupo': 'Polígonos ZDEEP',
        'tema': 'Administración de Zonas Especiales Públicas',
        'para_quien': 'Personas jurídicas públicas o privadas autorizadas por ZOLIC y SAT para desarrollar y administrar polígonos industriales y logísticos ZDEEP.',
        'que_hace': 'Delimitación perimetral de polígonos, registro y control de garitas aduaneras, fiscalización de infraestructura física y control de accesos.',
        'base_legal': 'Decreto 22-73 (Ley Orgánica de ZOLIC reformada), CAUCA IV, RECAUCA IV y Resoluciones Conjuntas SAT-ZOLIC.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'ZDEEP - Empresas Usuarias',
        'grupo': 'Empresas Instaladas en ZDEEP',
        'tema': 'Transformación, Servicios y Exenciones',
        'para_quien': 'Empresas industriales, comerciales o de servicios instaladas y operando dentro de los recintos calificados como ZDEEP.',
        'que_hace': 'Ingreso y egreso de materias primas con suspensión de DAI/IVA, descargo de inventarios de transformación, goce de exenciones y traslados fiscales.',
        'base_legal': 'Decreto 22-73 (Régimen Fiscal ZDEEP), Ley de Actualización Tributaria y CAUCA/RECAUCA.',
    },

    # --------------------------------------------------------------------------
    # 3. PROFESIONALES
    # --------------------------------------------------------------------------
    {
        'segmento': 'Profesionales',
        'categoria': 'Abogados y Notarios',
        'grupo': 'Notarios en Ejercicio',
        'tema': 'Papel Sellado de Protocolo y Avisos',
        'para_quien': 'Abogados y notarios colegiados activos autorizados para dar fe pública en actos civiles y mercantiles ante la SAT.',
        'que_hace': 'Compra de Papel Sellado Especial para Protocolos (SAT-7130), timbres fiscales, traspasos electrónicos vehiculares (TEV) y avisos notariales obligatorios.',
        'base_legal': 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales (Decreto 37-92) y Código Tributario (Art. 57 "A").',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Peritos Contadores',
        'grupo': 'Contadores Registrados',
        'tema': 'Libros Contables y Declaraciones',
        'para_quien': 'Peritos contadores habilitados ante la SAT para firmar balances, registrar contabilidades y asesorar contribuyentes.',
        'que_hace': 'Inscripción y actualización en el Registro de Contadores, autorización de libros contables digitales, presentación de balances y retenciones.',
        'base_legal': 'Decreto 2450 (Normas de la Profesión Contable), Código de Comercio y Código Tributario (Arts. 112 y 120).',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Auditores',
        'grupo': 'Contadores Públicos y Auditores (CPA)',
        'tema': 'Dictámenes Tributarios y Devolución IVA',
        'para_quien': 'Auditores y firmas contables independientes colegiadas encargadas de dictaminar estados financieros e informes fiscales.',
        'que_hace': 'Emisión de dictámenes de crédito fiscal para exportadores, dictámenes de precios de transferencia y auditorías requeridas por SAT.',
        'base_legal': 'Ley del IVA (Decreto 27-92, Art. 23 bis), Decreto 10-2012 y Ley de Colegiación Profesional Obligatoria (Decreto 72-2001).',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Gestores Tributarios',
        'grupo': 'Gestores Acreditados SAT',
        'tema': 'Gafetes y Trámites Presenciales',
        'para_quien': 'Personas autorizadas formalmente para representar y gestionar trámites administrativos de terceros ante las oficinas y agencias de la SAT.',
        'que_hace': 'Acreditación oficial, renovación anual de gafetes, registro de huella biométrica y gestión presencial en ventanillas de atención.',
        'base_legal': 'Acuerdos de Directorio de la SAT sobre Acreditación y Regulación de Gestores Tributarios y Código Tributario.',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Servicios Profesionales',
        'grupo': 'Profesionales Liberales Independientes',
        'tema': 'Facturación por Honorarios y Retenciones',
        'para_quien': 'Médicos, ingenieros, arquitectos, consultores y profesionales que ejercen de forma independiente prestando servicios técnicos.',
        'que_hace': 'Facturación electrónica FEL por honorarios, pago de retenciones de ISR, actualización de colegiado activo y solvencia fiscal.',
        'base_legal': 'Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Ley del IVA (Decreto 27-92).',
    },

    # --------------------------------------------------------------------------
    # 4. ENTES EXENTOS
    # --------------------------------------------------------------------------
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Constitucionales',
        'grupo': 'Universidades, Colegios e Iglesias',
        'tema': 'Exenciones Tributarias de Rango Constitucional',
        'para_quien': 'Centros educativos, universidades, misiones diplomáticas, comunidades religiosas e iglesias con exención expresa en la Carta Magna.',
        'que_hace': 'Registro de personería exenta en RTU, emisión de constancias de exención del IVA y timbres, y acreditación de representación legal.',
        'base_legal': 'Constitución Política de la República de Guatemala (Arts. 37, 73, 88), Ley del IVA (Art. 8) y Código Tributario (Art. 62).',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'No Lucrativos',
        'grupo': 'ONGs, Fundaciones y Cooperativas',
        'tema': 'Reconocimiento de Exención de ISR e IVA',
        'para_quien': 'Asociaciones civiles, fundaciones benéficas, cooperativas de ahorro y gremiales legalmente constituidas sin fines de lucro.',
        'que_hace': 'Trámite de resolución de exención de ISR, actualización de estatutos, retenciones a terceros y presentación de informes anuales.',
        'base_legal': 'Decreto 02-2003 (Ley de ONGs), Ley de Actualización Tributaria (Decreto 10-2012, Art. 11) y Ley del IVA.',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Municipalidades',
        'grupo': 'Gobiernos Locales y Empresas Municipales',
        'tema': 'Autonomía Municipal y Régimen Exento',
        'para_quien': 'Las 340 municipalidades del país, mancomunidades y empresas municipales autónomas prestadoras de servicios públicos.',
        'que_hace': 'Inscripción de alcaldes y tesoreros en RTU, registro de flotillas vehiculares municipales exentas del ISCV y constancias de exención.',
        'base_legal': 'Constitución Política de la República (Art. 257), Código Municipal (Decreto 12-2002) y Ley del ISCV (Decreto 70-94).',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Entidades del Estado',
        'grupo': 'Ministerios, Secretarías y Organismos del Estado',
        'tema': 'Compras Públicas y Agentes de Retención',
        'para_quien': 'Dependencias del Organismo Ejecutivo, Legislativo, Judicial, entidades autónomas y descentralizadas del sector público.',
        'que_hace': 'Registro de unidades ejecutoras en RTU, emisión de constancias de retención del IVA/ISR en compras del Estado y gestión vehicular oficial.',
        'base_legal': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA, Decreto 10-2012 y Código Tributario.',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Decreto',
        'grupo': 'Entidades con Incentivos Especiales',
        'tema': 'Exenciones y Fomento por Decreto Legislativo',
        'para_quien': 'Entidades o proyectos con beneficios fiscales otorgados por leyes ordinarias de fomento sectorial (turismo, energía renovable, reforestación).',
        'que_hace': 'Acreditación de resolución ministerial o dictamen de beneficio fiscal, exenciones específicas de aranceles y reporte periódico.',
        'base_legal': 'Decretos Legislativos específicos de fomento (Decreto 29-89, Decreto 65-89, Ley de Fomento a las Energías Renovables) y Código Tributario.',
    }
]

# Calcular conteos reales desde all_t para cada nodo del mapa
for node in MAPA_DATA:
    seg = node['segmento']
    cat = node['categoria']
    # Contar trámites que coinciden en pillar/segmento y categoria
    count = sum(1 for t in all_t if (t.get('segmento') == seg or t.get('pillarName') == seg) and t.get('categoria') == cat)
    node['conteo_tramites'] = count

# ==============================================================================
# HOJA 1: MAPA DE NAVEGACIÓN Y ARQUITECTURA DEL PORTAL
# ==============================================================================
ws_mapa = wb.create_sheet(title="Mapa de Navegación")
ws_mapa.views.sheetView[0].showGridLines = True

# Banner
ws_mapa.merge_cells('B2:H3')
banner = ws_mapa['B2']
banner.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner.font = font_title
banner.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner.alignment = Alignment(horizontal='center', vertical='center')

ws_mapa.merge_cells('B4:H4')
sub = ws_mapa['B4']
sub.value = "MAPA ESTRUCTURAL DE NAVEGACIÓN DEL PORTAL WEB (ARQUITECTURA DE INFORMACIÓN CENTRADA EN EL CIUDADANO)"
sub.font = font_subtitle
sub.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub.alignment = Alignment(horizontal='center', vertical='center')

headers_mapa = [
    "No.",
    "Nivel 1: Segmento Oficial",
    "Nivel 2: Categoría / Área",
    "Nivel 3: Grupo / Actor Específico",
    "Nivel 4: Tema / Especialidad",
    "Trámites Contenidos",
    "Ruta de Navegación de Entrada (Miga de Pan)"
]

for col_idx, h in enumerate(headers_mapa, start=2):
    c = ws_mapa.cell(row=6, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_mapa.row_dimensions[6].height = 28

for r_idx, node in enumerate(MAPA_DATA, start=7):
    ws_mapa.cell(row=r_idx, column=2, value=r_idx - 6).alignment = Alignment(horizontal='center')
    ws_mapa.cell(row=r_idx, column=3, value=node['segmento']).font = font_bold
    ws_mapa.cell(row=r_idx, column=4, value=node['categoria']).font = font_bold
    ws_mapa.cell(row=r_idx, column=5, value=node['grupo'])
    ws_mapa.cell(row=r_idx, column=6, value=node['tema'])
    
    c_cnt = ws_mapa.cell(row=r_idx, column=7, value=node['conteo_tramites'])
    c_cnt.alignment = Alignment(horizontal='right')
    c_cnt.font = font_bold
    
    miga = f"{node['segmento']} > {node['categoria']} > {node['tema']}"
    ws_mapa.cell(row=r_idx, column=8, value=miga).font = font_small

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_mapa.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 4, 7]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_mapa.row_dimensions[r_idx].height = 22

# Fila total
total_row = len(MAPA_DATA) + 7
ws_mapa.cell(row=total_row, column=2, value="").border = thin_border
ws_mapa.cell(row=total_row, column=3, value="TOTAL DEL PORTAL").font = font_bold
ws_mapa.cell(row=total_row, column=4, value="4 Segmentos y 31 Categorías Principales").font = font_small
ws_mapa.cell(row=total_row, column=5, value="").border = thin_border
ws_mapa.cell(row=total_row, column=6, value="").border = thin_border
c_tot = ws_mapa.cell(row=total_row, column=7, value=f"=SUM(G7:G{total_row-1})")
c_tot.font = font_bold
c_tot.alignment = Alignment(horizontal='right')
ws_mapa.cell(row=total_row, column=8, value="739 Trámites Oficiales Integrados").font = font_bold
for c_idx in range(2, 9):
    ws_mapa.cell(row=total_row, column=c_idx).border = thin_border
    ws_mapa.cell(row=total_row, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')

mapa_widths = {2: 8, 3: 32, 4: 34, 5: 34, 6: 38, 7: 20, 8: 55}
for col_idx, width in mapa_widths.items():
    ws_mapa.column_dimensions[get_column_letter(col_idx)].width = width
ws_mapa.freeze_panes = 'E7'

# ==============================================================================
# HOJA 2: DESCRIPCIONES Y BASE LEGAL (EL DOCUMENTO SOLICITADO)
# ==============================================================================
ws_desc = wb.create_sheet(title="Descripciones y Base Legal")
ws_desc.views.sheetView[0].showGridLines = True

# Banner
ws_desc.merge_cells('A2:H3')
banner2 = ws_desc['A2']
banner2.value = "MATRIZ DE DESCRIPCIONES FUNCIONALES Y FUNDAMENTO JURÍDICO — PORTAL SAT"
banner2.font = font_title
banner2.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner2.alignment = Alignment(horizontal='center', vertical='center')

ws_desc.merge_cells('A4:H4')
sub2 = ws_desc['A4']
sub2.value = "DEFINICIÓN OPERATIVA: PARA QUIÉN ES, ALCANCE FUNCIONAL Y EN BASE A QUÉ NORMATIVA OPERA CADA CATEGORÍA"
sub2.font = font_subtitle
sub2.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub2.alignment = Alignment(horizontal='center', vertical='center')

headers_desc = [
    "No.",
    "Segmento (L1)",
    "Categoría / Actor (L2/L3)",
    "Especialidad / Tema (L4)",
    "¿Para quién es? (Audiencia Destinataria en Lenguaje Ciudadano)",
    "¿Qué se puede hacer aquí? (Alcance y Gestiones Clave)",
    "Base Legal de Referencia (En base a qué: CAUCA, RECAUCA, Leyes, Decretos)",
    "Total Fichas"
]

for col_idx, h in enumerate(headers_desc, start=1):
    c = ws_desc.cell(row=6, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_desc.row_dimensions[6].height = 28

for r_idx, node in enumerate(MAPA_DATA, start=7):
    ws_desc.cell(row=r_idx, column=1, value=r_idx - 6).alignment = Alignment(horizontal='center')
    ws_desc.cell(row=r_idx, column=2, value=node['segmento']).font = font_bold
    ws_desc.cell(row=r_idx, column=3, value=node['categoria']).font = font_bold
    ws_desc.cell(row=r_idx, column=4, value=node['tema'])
    ws_desc.cell(row=r_idx, column=5, value=node['para_quien'])
    ws_desc.cell(row=r_idx, column=6, value=node['que_hace'])
    
    # Base legal destacada
    c_bl = ws_desc.cell(row=r_idx, column=7, value=node['base_legal'])
    c_bl.font = Font(name='Segoe UI', size=9, bold=True, color='1E293B')
    
    c_cnt = ws_desc.cell(row=r_idx, column=8, value=node['conteo_tramites'])
    c_cnt.alignment = Alignment(horizontal='right')
    c_cnt.font = font_bold

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 9):
        cell = ws_desc.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
        if c_idx in [5, 6, 7]:
            cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    ws_desc.row_dimensions[r_idx].height = 42

desc_widths = {1: 8, 2: 28, 3: 34, 4: 30, 5: 55, 6: 55, 7: 55, 8: 14}
for col_idx, width in desc_widths.items():
    ws_desc.column_dimensions[get_column_letter(col_idx)].width = width
ws_desc.freeze_panes = 'D7'
ws_desc.auto_filter.ref = f"A6:H{len(MAPA_DATA)+6}"

# Guardar libro exclusivo del mapa
OUTPUT_MAPA_PATH = 'docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx'
wb.save(OUTPUT_MAPA_PATH)
print(f"Libro exclusivo del mapa guardado en: {OUTPUT_MAPA_PATH}")
print(f"Total nodos de arquitectura: {len(MAPA_DATA)}")
