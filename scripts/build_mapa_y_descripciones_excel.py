import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Cargar dataset maestro
all_t = json.load(open('src/data/allTramites.json', encoding='utf-8'))
TOTAL_PORTAL = len(all_t) # 739

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
BG_LABEL = 'F1F5F9'         # Fondo gris suave para etiquetas
BG_SUBTOTAL = 'F1F5F9'      # Fondo para subtotales

font_title = Font(name='Segoe UI', size=15, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='FFFFFF')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_body = Font(name='Segoe UI', size=9, color='0F172A')
font_lead = Font(name='Segoe UI', size=9, italic=True, bold=True, color='0369A1')
font_legal = Font(name='Segoe UI', size=9, bold=True, color='334155')
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

subtotal_border = Border(
    left=Side(style='thin', color=BORDER_COLOR),
    right=Side(style='thin', color=BORDER_COLOR),
    top=Side(style='thin', color='94A3B8'),
    bottom=Side(style='medium', color='64748B')
)

# ==============================================================================
# 1. DEFINICIÓN DE LOS 4 SEGMENTOS PRINCIPALES (NIVEL 1)
# ==============================================================================
SEGMENTOS_DATA = [
    {
        'no': 1,
        'segmento': 'Operadores de Comercio Exterior',
        'color': CYAN_ACCENT,
        'que_es': 'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.',
        'lead_text': 'Servicios e información aduanera para la importación, exportación y logística.',
        'base_juridica': 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
    },
    {
        'no': 2,
        'segmento': 'Contribuyentes',
        'color': BLUE_HEADER,
        'que_es': 'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.',
        'lead_text': 'Información y servicios tributarios para personas y empresas.',
        'base_juridica': 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'
    },
    {
        'no': 3,
        'segmento': 'Profesionales',
        'color': GREEN_ACCENT,
        'que_es': 'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
        'lead_text': 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
        'base_juridica': 'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 "A" y 112).'
    },
    {
        'no': 4,
        'segmento': 'Entes Exentos',
        'color': PURPLE_ACCENT,
        'que_es': 'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.',
        'lead_text': 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
        'base_juridica': 'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'
    }
]

# Conteos por segmento
for s in SEGMENTOS_DATA:
    s['conteo_tramites'] = sum(1 for t in all_t if t.get('segmento') == s['segmento'])
    s['pct'] = s['conteo_tramites'] / TOTAL_PORTAL

# ==============================================================================
# 2. DEFINICIÓN EXACTA Y CANÓNICA DE LOS 33 NODOS DE NAVEGACIÓN (100% COBERTURA)
# ==============================================================================
NODOS_MAPA = [
    # --------------------------------------------------------------------------
    # CONTRIBUYENTES (11 NODOS = 413 TRÁMITES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Contribuyentes',
        'regimen': 'NIT sin Obligaciones',
        'categoria': 'NIT sin Obligaciones',
        'alcance': 'Inscripción de primer NIT, actualización de datos de residencia y solvencia fiscal para personas sin actividad mercantil.',
        'que_es': 'Categoría destinada a personas individuales (estudiantes, asalariados no afectos, personas que compran bienes o abren cuentas bancarias) que requieren un Número de Identificación Tributaria únicamente para actos civiles, contractuales o notariales sin realizar actividades mercantiles ni prestación de servicios técnicos afectos.',
        'lead_text': 'Gestiones y servicios de identificación tributaria para personas sin actividad comercial.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Pequeños Contribuyentes',
        'categoria': 'Pequeños Contribuyentes',
        'alcance': 'Régimen del 5% definitivo, facturación FEL, régimen electrónico y regímenes especiales del sector primario y agropecuario.',
        'que_es': 'Régimen simplificado para personas individuales o jurídicas cuyas ventas de bienes o prestación de servicios no superan el monto de Q150,000 en el año calendario, tributando bajo una tarifa definitiva del 5% sobre ingresos brutos mensuales sin derecho a crédito fiscal, incluyendo productores agropecuarios (ICT).',
        'lead_text': 'Información y obligaciones para pequeños negocios y régimen simplificado.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 45 al 50), Decreto 7-2019 (Régimen Electrónico) y Decreto 31-2024 (Sector Primario y Agropecuario).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Declaraciones y Pagos',
        'alcance': 'Declaración y pago de IVA General, pagos trimestrales o mensuales de ISR, liquidación de ISO y formularios electrónicos.',
        'que_es': 'Gestión y liquidación periódica de impuestos internos directos e indirectos (IVA General 12%, ISR Actividades Lucrativas, ISO, Timbres Fiscales, IETAP) mediante formularios oficiales en Declaraguate y boletas de pago SAT-2000.',
        'lead_text': 'Llena tus formularios oficiales en Declaraguate, genera tu boleta SAT-2000 y paga electrónicamente desde BancaSAT.',
        'base_juridica': 'Código Tributario (Decreto 6-91), Ley del IVA (Decreto 27-92) y Ley de Actualización Tributaria (Decreto 10-2012, Libros I y II).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'RTU Digital y Agencia Virtual',
        'alcance': 'Inscripción y actualización periódica en el RTU, modificación de domicilios, altas de establecimientos y gestión de usuarios.',
        'que_es': 'Plataforma digital de identidad tributaria y expediente electrónico del contribuyente para actualización obligatoria de datos de residencia, actividades económicas, establecimientos mercantiles, contadores, representantes legales y afiliaciones fiscales.',
        'lead_text': 'Actualiza tus datos en el RTU Digital, modifica tus actividades económicas y administra tus accesos en la Agencia Virtual.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020 (RTU Digital obligatorio).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Vehículos',
        'alcance': 'Registro Fiscal de Vehículos (RFV), calcomanía anual ISCV, primeras placas, traspasos y reposición de distintivos.',
        'que_es': 'Registro Fiscal de Vehículos (RFV) que administra la propiedad, tenencia, modificaciones de características y el pago anual del Impuesto sobre Circulación de Vehículos (ISCV) para automotores terrestres, marítimos y aéreos.',
        'lead_text': 'Paga tu calcomanía ISCV, tramita primeras placas, realiza traspasos con notario y repón distintivos extraviados.',
        'base_juridica': 'Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos (Decreto 70-94) y Código Tributario.',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Servicios al Contribuyente',
        'alcance': 'Agendamiento de citas presenciales, solvencia fiscal con código QR, consultas públicas y asistencia tributaria.',
        'que_es': 'Canales de atención presencial y remota, agendamiento de citas en oficinas tributarias del país, expedición de solvencias fiscales inmediatas y herramientas de consulta pública en registros de la SAT.',
        'lead_text': 'Agenda tu cita en agencias tributarias, solicita tu solvencia fiscal con código QR y consulta el estado de tus gestiones.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 57 "A") y Ley Orgánica de la SAT (Decreto 1-98).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Empresas y Sociedades',
        'alcance': 'Inscripción y cese de sociedades mercantiles, habilitación de sucursales, nombramiento de representantes legales y personerías.',
        'que_es': 'Personas jurídicas, sociedades anónimas, empresas mercantiles, sucursales extranjeras y contratos asociativos sujetos al cumplimiento de obligaciones societarias y mercantiles ante la administración tributaria.',
        'lead_text': 'Inscribe y actualiza representantes legales, habilita sucursales mercantiles y gestiona modificaciones societarias en el RTU.',
        'base_juridica': 'Código de Comercio (Decreto 2-70), Código Tributario (Decreto 6-91) y Ley de Actualización Tributaria.',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Facturación Electrónica',
        'alcance': 'Habilitación como emisor FEL, emisión de facturas y notas de crédito en Agencia Virtual, y anulación de DTE.',
        'que_es': 'Régimen obligatorio de Factura Electrónica en Línea (FEL) para la emisión, anulación, transmisión y consulta de Documentos Tributarios Electrónicos (DTE) a través de Agencia Virtual o certificadores autorizados.',
        'lead_text': 'Habilítate como emisor FEL gratuito, autoriza tus formatos de documentos y administra tus comprobantes fiscales digitales.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 29 y 29 "A") y Acuerdo de Directorio SAT 13-2018 (Régimen FEL).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Solvencia y Convenios',
        'alcance': 'Suscripción de convenios de pago en cuotas, facilidades crediticias y regularización de omisos y saldos pendientes.',
        'que_es': 'Instrumentos de regularización fiscal, suscripción de convenios de pago por mora o determinación de oficio, facilidades crediticias y constancias de no adeudo tributario.',
        'lead_text': 'Solicita facilidades de pago en cuotas, suscribe convenios tributarios y obtén tu solvencia fiscal al regularizar tus saldos.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 40 y 57 "A") y Acuerdos de Directorio de Facilidades de Pago.',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyente General',
        'categoria': 'Asalariados',
        'alcance': 'Rentas del trabajo en relación de dependencia, planilla electrónica del IVA y devolución de retenciones de ISR.',
        'que_es': 'Trabajadores contratados por patronos públicos o privados afectos a retenciones mensuales de ISR, proyección anual de retención y presentación de la planilla del IVA por compras personales.',
        'lead_text': 'Presenta tu planilla electrónica del IVA con comprobantes FEL y solicita devolución de retenciones de ISR en exceso.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Arts. 68 al 82 - Rentas del Trabajo).',
    },
    {
        'segmento': 'Contribuyentes',
        'regimen': 'Contribuyentes Especiales',
        'categoria': 'Contribuyentes Especiales',
        'alcance': 'Atención en gerencias diferenciadas, presentación de estados financieros auditados y precios de transferencia.',
        'que_es': 'Empresas calificadas por resolución de la SAT como grandes o medianos contribuyentes especiales sujetas a esquemas intensivos de fiscalización, atención diferenciada y cumplimiento de precios de transferencia.',
        'lead_text': 'Servicios y gestiones tributarias para empresas con atención diferenciada.',
        'base_juridica': 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Resoluciones de Directorio de Calificación de Contribuyentes Especiales.',
    },

    # --------------------------------------------------------------------------
    # OPERADORES DE COMERCIO EXTERIOR (12 NODOS = 202 TRÁMITES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '1. Importadores y Exportadores',
        'categoria': 'Importadores y Exportadores (Compartido)',
        'alcance': 'Arancel Integrado Centroamericano (SAC), pagos aduaneros por BancaSAT, DUCAs comunes y solvencia aduanera.',
        'que_es': 'Operadores comerciales que realizan indistintamente gestiones transversales de entrada y salida de mercancías, consultas arancelarias y pagos tributarios aduaneros en las aduanas de la República.',
        'lead_text': 'Consulta el Arancel Integrado Centroamericano (SAC), realiza pagos por BancaSAT y tramita solvencias aduaneras unificadas.',
        'base_juridica': 'Convenio sobre el Régimen Arancelario y Aduanero Centroamericano, CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA IV (Resolución 224-2008 COMIECO).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '1. Importadores y Exportadores',
        'categoria': 'Importadores',
        'alcance': 'Inscripción en padrón de importadores, liquidación de DUCA-D, valoración aduanera y rescate de mercancías.',
        'que_es': 'Personas individuales o jurídicas autorizadas en el padrón aduanero de la SAT para introducir legalmente mercancías extranjeras al territorio aduanero nacional para su consumo, uso o transformación.',
        'lead_text': 'Inscríbete en el padrón de importadores, liquida tus declaraciones aduaneras DUCA-D, consulta aranceles y rescata mercancías en aduana.',
        'base_juridica': 'CAUCA IV (Arts. 21 y 77), RECAUCA IV (Arts. 317 al 330) y Acuerdo Relativo a la Aplicación del Artículo VII del GATT (Valoración OMC).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '1. Importadores y Exportadores',
        'categoria': 'Exportadores',
        'alcance': 'Registro de exportadores VUPE, autorización de embarques y devolución de crédito fiscal del IVA para exportadores.',
        'que_es': 'Personas individuales o jurídicas inscritas en el Registro de Exportadores de la SAT que despachan mercancías de origen nacional o nacionalizadas hacia mercados del exterior.',
        'lead_text': 'Registra tus exportaciones con código VUPE, emite facturas con régimen especial y gestiona la devolución de crédito fiscal del IVA.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis), Ley de Fomento y Maquila (Decreto 29-89) y CAUCA/RECAUCA IV.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '1. Importadores y Exportadores',
        'categoria': 'Operador Económico Autorizado (OEA)',
        'alcance': 'Certificación en seguridad de la cadena de suministro, carril exprés aduanero y reducción de selectivo rojo.',
        'que_es': 'Operadores de la cadena logística internacional certificados por la Intendencia de Aduanas por mantener rigurosos estándares de seguridad y confiabilidad en sus operaciones transfronterizas.',
        'lead_text': 'Accede a carriles exprés preferenciales, prioridad en contingencias y despacho ágil con selectivo rojo reducido.',
        'base_juridica': 'Marco Normativo SAFE de la OMA, CAUCA IV y Resoluciones de Directorio de la SAT sobre el Programa OEA-Guatemala.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Depósitos Aduaneros',
        'alcance': 'Almacenes Fiscales, Almacenes Generales de Depósito (AGD) y Depósitos Aduaneros Temporales (DAT).',
        'que_es': 'Recintos públicos o privados autorizados para custodiar mercancías con suspensión de tributos aduaneros, emisión de certificados de depósito y bonos de prenda (AGD) y actas de recepción DAT.',
        'lead_text': 'Controla inventarios de custodia, gestiona actas de recepción, emite certificados de depósito (AGD) y tramita prórrogas de permanencia.',
        'base_juridica': 'Decreto 1236 (Ley de Almacenes Generales de Depósito), CAUCA IV y RECAUCA IV (Arts. 119 al 129 - Régimen de Depósito Aduanero).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Agentes Aduaneros',
        'alcance': 'Habilitación de carné oficial, constitución de pólizas de caución y transmisión de DUCAs con firma electrónica.',
        'que_es': 'Profesionales auxiliares de la función pública aduanera autorizados para actuar por cuenta de terceros en los trámites y operaciones de desaduanamiento ante la SAT.',
        'lead_text': 'Gestiona tu carné y habilitación oficial, presenta pólizas de seguro de caución y transmite declaraciones con firma electrónica.',
        'base_juridica': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Arts. 74 al 85) y Ley Nacional de Aduanas.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Apoderados Especiales Aduaneros',
        'alcance': 'Representación exclusiva de personas jurídicas en despachos aduaneros propios, carné y renovación de fianza.',
        'que_es': 'Personas individuales mandatarias designadas exclusivamente por una persona jurídica para representarla formalmente en sus despachos aduaneros propios.',
        'lead_text': 'Registra tu mandato legal, actualiza tu carné de apoderado y tramita declaraciones DUCA corporativas.',
        'base_juridica': 'CAUCA IV (Art. 21), RECAUCA IV (Arts. 86 al 90) y Código de Notariado.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Transportistas Aduaneros',
        'alcance': 'Registro de unidades y conductores, transmisión de DUCA-T y colocación de marchamo electrónico RFID.',
        'que_es': 'Empresas y conductores autorizados para realizar el traslado de mercancías bajo control aduanero dentro del territorio nacional o en tránsito internacional centroamericano.',
        'lead_text': 'Registra medios de transporte, activa marchamos electrónicos RFID y transmite declaraciones de tránsito DUCA-T.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 20), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Reglamentos de Transporte Centroamericano.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Empresas de Entrega Rápida o Courier',
        'alcance': 'Despacho simplificado de paquetería urgente, manifiestos courier y recintos desconsolidadores de encomiendas.',
        'que_es': 'Empresas de mensajería y paquetería urgente autorizadas para transportar y desaduanar envíos postales exprés y encomiendas internacionales no comerciales.',
        'lead_text': 'Transmite manifiestos courier, aplica franquicias simplificadas y habilita recintos desconsolidadores de paquetería.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 574 al 596 - Régimen de Envíos de Entrega Rápida o Courier).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Consolidadores y Desconsolidadores de Carga',
        'alcance': 'Transmisión de manifiesto electrónico CUSCAR, desconsolidación de conocimientos de embarque y guías hijas.',
        'que_es': 'Operadores logísticos autorizados para agrupar o separar mercancías pertenecientes a distintos consignatarios bajo un solo documento matriz de transporte.',
        'lead_text': 'Transmite manifiestos CUSCAR, emite guías hijas y reporta inconsistencias o averías de carga ante la aduana.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 102 al 109 - Auxiliares Consolidador y Desconsolidador de Carga).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '3. Regímenes Territoriales y Zonas Especiales',
        'categoria': 'ZDEEP - Entidades Administradoras',
        'alcance': 'Habilitación de polígonos industriales ZDEEP, supervisión perimetral, garitas de control y recintos aduaneros.',
        'que_es': 'Personas jurídicas públicas o privadas autorizadas por ZOLIC y SAT para desarrollar, operar y vigilar la infraestructura de polígonos industriales y logísticos ZDEEP.',
        'lead_text': 'Delimita polígonos aduaneros, administra garitas de control y supervisa el perímetro de seguridad de la zona especial.',
        'base_juridica': 'Decreto 22-73 (Ley Orgánica de ZOLIC reformada), CAUCA IV, RECAUCA IV y Resoluciones Conjuntas SAT-ZOLIC.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'regimen': '3. Regímenes Territoriales y Zonas Especiales',
        'categoria': 'ZDEEP - Empresas Usuarias',
        'alcance': 'Ingreso de insumos con suspensión arancelaria, descargos de transformación y exenciones tributarias de fomento.',
        'que_es': 'Empresas industriales, comerciales o de servicios instaladas y operando dentro de los recintos calificados como ZDEEP para producir o transformar con beneficios fiscales.',
        'lead_text': 'Ingresa materias primas con suspensión de DAI e IVA, realiza descargos de producción y goza de exenciones tributarias.',
        'base_juridica': 'Decreto 22-73 (Régimen Fiscal ZDEEP), Ley de Actualización Tributaria (Decreto 10-2012) y CAUCA/RECAUCA IV.',
    },

    # --------------------------------------------------------------------------
    # PROFESIONALES (5 NODOS = 45 TRÁMITES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Profesionales',
        'regimen': 'Servicios Profesionales y Terceras Personas',
        'categoria': 'Abogados y Notarios',
        'alcance': 'Compra de papel sellado de protocolo (SAT-7130), timbres fiscales y traspasos electrónicos vehiculares (TEV).',
        'que_es': 'Profesionales del derecho colegiados activos autorizados para ejercer la fe pública notarial, redactar instrumentos públicos y autorizar traspasos electrónicos de vehículos ante la SAT.',
        'lead_text': 'Compra papel sellado especial para protocolos, adquiere timbres fiscales, realiza traspasos vehiculares electrónicos (TEV) y presenta avisos notariales.',
        'base_juridica': 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales y de Papel Sellado Especial para Protocolos (Decreto 37-92) y Código Tributario.',
    },
    {
        'segmento': 'Profesionales',
        'regimen': 'Servicios Profesionales y Terceras Personas',
        'categoria': 'Peritos Contadores',
        'alcance': 'Inscripción en el Registro de Contadores, autorización de libros contables digitales y firma de balances.',
        'que_es': 'Técnicos y profesionales contables inscritos y autorizados ante la SAT para llevar y firmar registros contables de contribuyentes, certificar estados financieros y realizar gestiones tributarias.',
        'lead_text': 'Inscríbete y actualiza tus datos en el Registro de Contadores, autoriza libros contables computarizados y asocia contribuyentes a tu perfil.',
        'base_juridica': 'Decreto 2450 (Normas que Regulan el Ejercicio de la Profesión de Contador), Código de Comercio (Decreto 2-70) y Código Tributario (Arts. 112 y 120).',
    },
    {
        'segmento': 'Profesionales',
        'regimen': 'Servicios Profesionales y Terceras Personas',
        'categoria': 'Gestores Tributarios',
        'alcance': 'Acreditación oficial ante SAT, renovación de gafetes, registro biométrico y representación presencial autorizada.',
        'que_es': 'Personas individuales autorizadas y acreditadas formalmente ante la SAT para representar a terceros en la tramitación presencial de gestiones administrativas tributarias y aduaneras.',
        'lead_text': 'Tramita y renueva tu carné oficial de gestor tributario, registra tus datos biométricos y gestiona expedientes autorizados en agencias tributarias.',
        'base_juridica': 'Acuerdos de Directorio de la SAT sobre Regulación y Acreditación de Gestores Tributarios y Código Tributario.',
    },
    {
        'segmento': 'Profesionales',
        'regimen': 'Servicios Profesionales y Terceras Personas',
        'categoria': 'Servicios Profesionales',
        'alcance': 'Facturación FEL por honorarios profesionales, retenciones de ISR y actualización de constancia de colegiado activo.',
        'que_es': 'Profesionales liberales e independientes que prestan servicios técnicos, científicos, jurídicos o de consultoría por honorarios profesionales.',
        'lead_text': 'Emite facturas electrónicas FEL por honorarios, liquida retenciones de ISR, actualiza tu colegiado activo y consulta tu solvencia fiscal.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Ley del IVA (Decreto 27-92).',
    },
    {
        'segmento': 'Profesionales',
        'regimen': 'Servicios Profesionales y Terceras Personas',
        'categoria': 'Auditores',
        'alcance': 'Dictámenes de crédito fiscal para exportadores, dictámenes de estados financieros e informes tributarios.',
        'que_es': 'Contadores Públicos y Auditores (CPA) colegiados activos y firmas de auditoría facultados para emitir dictámenes sobre estados financieros, devolución de crédito fiscal e informes de precios de transferencia.',
        'lead_text': 'Emite dictámenes de crédito fiscal para exportadores, dictámenes de estados financieros para licitaciones y presenta informes tributarios requeridos por SAT.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria (Decreto 72-2001), Ley del IVA (Decreto 27-92, Art. 23 bis) y Ley de Actualización Tributaria (Decreto 10-2012).',
    },

    # --------------------------------------------------------------------------
    # ENTES EXENTOS (5 NODOS = 79 TRÁMITES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Entes Exentos',
        'regimen': 'Organizaciones No Lucrativas (Exentas)',
        'categoria': 'Constitucionales',
        'alcance': 'Exención constitucional de impuestos para universidades, colegios, iglesias y misiones diplomáticas.',
        'que_es': 'Instituciones educativas, universidades, comunidades religiosas, misiones diplomáticas y cuerpos consulares que gozan de exención de impuestos por mandato directo de la Carta Magna.',
        'lead_text': 'Inscribe tu personería jurídica exenta en el RTU, emite constancias electrónicas de exención de IVA y timbres, y acredita representación legal.',
        'base_juridica': 'Constitución Política de la República de Guatemala (Arts. 37, 73, 88), Ley del IVA (Art. 8) y Código Tributario (Art. 62).',
    },
    {
        'segmento': 'Entes Exentos',
        'regimen': 'Organizaciones No Lucrativas (Exentas)',
        'categoria': 'Decreto',
        'alcance': 'Entidades con incentivos y exenciones especiales otorgadas por leyes ordinarias de fomento sectorial.',
        'que_es': 'Personas o entidades beneficiarias de leyes de fomento económico y exenciones tributarias específicas aprobadas mediante decretos legislativos ordinarios del Congreso.',
        'lead_text': 'Acredita resoluciones ministeriales de calificación de fomento, gestiona exenciones arancelarias temporales y presenta reportes periódicos de cumplimiento.',
        'base_juridica': 'Decretos específicos de fomento (Decreto 29-89 de Maquilas, Decreto 65-89 de Zonas Francas, Ley de Incentivos para Energías Renovables) y Código Tributario.',
    },
    {
        'segmento': 'Entes Exentos',
        'regimen': 'Organizaciones No Lucrativas (Exentas)',
        'categoria': 'No Lucrativos',
        'alcance': 'Resoluciones de exención de ISR e IVA para ONGs, fundaciones benéficas, asociaciones y cooperativas.',
        'que_es': 'Organizaciones No Gubernamentales (ONGs), fundaciones benéficas, asociaciones civiles sin fines de lucro y cooperativas que solicitan reconocimiento administrativo de exención de ISR e IVA.',
        'lead_text': 'Solicita tu resolución formal de exención de ISR, actualiza estatutos y junta directiva en el RTU y emite constancias de retención y exención.',
        'base_juridica': 'Decreto 02-2003 (Ley de ONGs para el Desarrollo), Ley de Actualización Tributaria (Decreto 10-2012, Art. 11) y Ley del IVA.',
    },
    {
        'segmento': 'Entes Exentos',
        'regimen': 'Sector Público y Entidades del Estado',
        'categoria': 'Entidades del Estado',
        'alcance': 'Ministerios, secretarías, organismos del Estado, compras públicas y emisión de constancias de retención.',
        'que_es': 'Ministerios de Estado, secretarías, organismos de los poderes Ejecutivo, Legislativo y Judicial, y entidades públicas descentralizadas que operan como agentes de retención del IVA e ISR.',
        'lead_text': 'Habilita unidades ejecutoras en el RTU, emite constancias de retención en compras públicas y administra el parque vehicular oficial del Estado.',
        'base_juridica': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA, Ley de Contrataciones del Estado (Decreto 57-92) y Código Tributario.',
    },
    {
        'segmento': 'Entes Exentos',
        'regimen': 'Sector Público y Entidades del Estado',
        'categoria': 'Municipalidades',
        'alcance': 'Autonomía municipal, inscripción de corporaciones y flotillas vehiculares municipales exentas del ISCV.',
        'que_es': 'Las 340 corporaciones municipales autónomas de la República de Guatemala, mancomunidades y empresas municipales públicas prestadoras de servicios comunitarios.',
        'lead_text': 'Registra autoridades y tesoreros en el RTU, gestiona la exención del impuesto de circulación para flotillas municipales y tramita solvencias institucionales.',
        'base_juridica': 'Constitución Política de la República (Art. 257), Código Municipal (Decreto 12-2002) y Ley del ISCV (Decreto 70-94).',
    }
]

# Calcular conteos reales desde all_t para cada nodo del mapa
for node in NODOS_MAPA:
    seg = node['segmento']
    cat = node['categoria']
    cnt = sum(1 for t in all_t if t.get('segmento') == seg and t.get('categoria') == cat)
    node['conteo_tramites'] = cnt

# Conteos ATO
ato_stages = [
    ("Empezar y registrarse", "Primer NIT, RTU Digital, padrones de importación/exportación y habilitación inicial", sum(1 for t in all_t if t.get('etapaAtoLabel') == 'Empezar y registrarse')),
    ("Operación y declaraciones", "Facturación FEL, Declaraguate, DUCAs, retenciones, transferencias y pagos", sum(1 for t in all_t if t.get('etapaAtoLabel') == 'Operación y declaraciones')),
    ("Consultas y herramientas", "Verificadores en tiempo real, solvencia, selectivo aduanero, rampa y SAC", sum(1 for t in all_t if t.get('etapaAtoLabel') == 'Consultas y herramientas')),
    ("Modificaciones y cierre", "Actualización de RTU, traspaso vehicular, prórrogas, cese de actividades y subastas", sum(1 for t in all_t if t.get('etapaAtoLabel') == 'Modificaciones y cierre')),
    ("Normativa y asistencia", "Marco legal aduanero y tributario, devoluciones, criterios institucionales y cursos", sum(1 for t in all_t if t.get('etapaAtoLabel') == 'Normativa y asistencia'))
]

# Conteos Interacciones
interactions = [
    ("Guía Informativa / Texto", "Páginas explicativas, requisitos de trámites presenciales o mixtos", sum(1 for t in all_t if t.get('tipoInteraccionLabel') == 'Guía Informativa / Texto')),
    ("Trámite / Aplicativo en Línea", "Servicios digitales transaccionales (Agencia Virtual, Declaraguate, TEV, FEL)", sum(1 for t in all_t if t.get('tipoInteraccionLabel') == 'Trámite / Aplicativo en Línea')),
    ("Consulta en Base de Datos", "Herramientas de verificación sin autenticación previa (RTU público, solvencias)", sum(1 for t in all_t if t.get('tipoInteraccionLabel') == 'Consulta en Base de Datos')),
    ("Descarga de Documento / Software", "Descarga de formularios en PDF/Excel, software, manuales o legislación", sum(1 for t in all_t if t.get('tipoInteraccionLabel') == 'Descarga de Documento / Software')),
]

# ==============================================================================
# HOJA 1: RESUMEN ARQUITECTURA (IDÉNTICA AL LIBRO MAESTRO)
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

# Banner Institucional Superior
ws_resumen.merge_cells('B2:H3')
banner = ws_resumen['B2']
banner.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner.font = font_title
banner.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner.alignment = Alignment(horizontal='center', vertical='center')

ws_resumen.merge_cells('B4:H4')
sub_banner = ws_resumen['B4']
sub_banner.value = "ARQUITECTURA DE INFORMACIÓN DEL PORTAL WEB — DEFINICIÓN DE SEGMENTOS, LEAD TEXT, ATO Y BASE JURÍDICA"
sub_banner.font = font_subtitle
sub_banner.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_banner.alignment = Alignment(horizontal='center', vertical='center')

# Bloques KPI superiores
kpis = [
    ("TOTAL CONTENIDOS", f"{TOTAL_PORTAL} Trámites", "Universo Oficial SAT", "B6", "B7", NAVY_HEADER),
    ("CONTRIBUYENTES", f"{SEGMENTOS_DATA[1]['conteo_tramites']} Trámites", "Régimen Interno", "C6", "C7", BLUE_HEADER),
    ("COMERCIO EXTERIOR", f"{SEGMENTOS_DATA[0]['conteo_tramites']} Trámites", "Aduanas, AFPA y Zonas", "D6", "E7", CYAN_ACCENT),
    ("PROFESIONALES", f"{SEGMENTOS_DATA[2]['conteo_tramites']} Trámites", "Notarios, CPA, TEV", "F6", "F7", GREEN_ACCENT),
    ("ENTES EXENTOS", f"{SEGMENTOS_DATA[3]['conteo_tramites']} Trámites", "ONGs, Iglesias, Estado", "G6", "H7", PURPLE_ACCENT),
]

for label, val, sub_txt, top_l, bot_r, color in kpis:
    ws_resumen.merge_cells(f"{top_l}:{bot_r}")
    cell = ws_resumen[top_l]
    cell.value = f"{label}\n{val}"
    cell.font = Font(name='Segoe UI', size=12, bold=True, color='FFFFFF')
    cell.fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

# ------------------------------------------------------------------------------
# SECCIÓN 1: SEGMENTOS PRINCIPALES DEL PORTAL (NIVEL 1)
# ------------------------------------------------------------------------------
ws_resumen['B9'] = "1. SEGMENTOS PRINCIPALES DEL PORTAL (NIVEL 1) — DEFINICIONES INSTITUCIONALES"
ws_resumen['B9'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

macro_headers = [
    "No.",
    "Segmento (Nivel 1)",
    "Qué es: (Definición Operativa)",
    "Lead text: (Texto Orientador de Interfaz)",
    "Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)",
    "Total Contenidos",
    "% del Portal"
]

for col_idx, h in enumerate(macro_headers, start=2):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_resumen.row_dimensions[10].height = 28

for r_idx, s in enumerate(SEGMENTOS_DATA, start=11):
    ws_resumen.cell(row=r_idx, column=2, value=s['no']).alignment = Alignment(horizontal='center', vertical='center')
    ws_resumen.cell(row=r_idx, column=3, value=s['segmento']).font = font_bold
    ws_resumen.cell(row=r_idx, column=3).alignment = Alignment(horizontal='left', vertical='center')
    
    c_qe = ws_resumen.cell(row=r_idx, column=4, value=s['que_es'])
    c_qe.font = font_body
    c_qe.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_lt = ws_resumen.cell(row=r_idx, column=5, value=s['lead_text'])
    c_lt.font = font_lead
    c_lt.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_bj = ws_resumen.cell(row=r_idx, column=6, value=s['base_juridica'])
    c_bj.font = font_legal
    c_bj.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_tot = ws_resumen.cell(row=r_idx, column=7, value=s['conteo_tramites'])
    c_tot.alignment = Alignment(horizontal='right', vertical='center')
    c_tot.font = font_bold
    
    c_pct = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/$G$15")
    c_pct.alignment = Alignment(horizontal='right', vertical='center')
    c_pct.font = font_bold
    c_pct.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 4, 5, 6, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 56

# Fila totalizador Segmentos
ws_resumen.cell(row=15, column=2, value="").border = thin_border
ws_resumen.cell(row=15, column=3, value="TOTAL PORTAL WEB SAT").font = font_bold
ws_resumen.cell(row=15, column=4, value="Universo total de fichas y servicios").font = font_small
ws_resumen.cell(row=15, column=5, value="").border = thin_border
ws_resumen.cell(row=15, column=6, value="").border = thin_border
c_tt = ws_resumen.cell(row=15, column=7, value="=SUM(G11:G14)")
c_tt.font = font_bold
c_tt.alignment = Alignment(horizontal='right', vertical='center')
c_tp = ws_resumen.cell(row=15, column=8, value="=SUM(H11:H14)")
c_tp.font = font_bold
c_tp.alignment = Alignment(horizontal='right', vertical='center')
c_tp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=15, column=c_idx).border = thin_border
    ws_resumen.cell(row=15, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[15].height = 24

# ------------------------------------------------------------------------------
# SECCIÓN 2: METODOLOGÍA CICLO DE VIDA ATO (AUSTRALIA)
# ------------------------------------------------------------------------------
ws_resumen['B17'] = "2. METODOLOGÍA CICLO DE VIDA ATO (AUSTRALIA) - SIN NÚMEROS VISIBLES"
ws_resumen['B17'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

ato_headers = ["Etapa ATO", "Descripción Funcional", "Total Contenidos", "% del Portal"]
for col_idx, h in enumerate(ato_headers, start=2):
    target_c = col_idx if col_idx < 4 else (col_idx + 3)
    c = ws_resumen.cell(row=18, column=target_c, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border
ws_resumen.merge_cells('C18:F18')
ws_resumen.row_dimensions[18].height = 26

for r_idx, (enom, edesc, ecount) in enumerate(ato_stages, start=19):
    ws_resumen.cell(row=r_idx, column=2, value=enom).font = font_bold
    ws_resumen.cell(row=r_idx, column=2).alignment = Alignment(horizontal='left', vertical='center')
    
    ws_resumen.merge_cells(f"C{r_idx}:F{r_idx}")
    c_ed = ws_resumen.cell(row=r_idx, column=3, value=edesc)
    c_ed.font = font_small
    c_ed.alignment = Alignment(horizontal='left', vertical='center')

    c_at = ws_resumen.cell(row=r_idx, column=7, value=ecount)
    c_at.alignment = Alignment(horizontal='right', vertical='center')
    c_at.font = font_bold
    
    c_ap = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/$G$24")
    c_ap.alignment = Alignment(horizontal='right', vertical='center')
    c_ap.font = font_bold
    c_ap.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 22

# Fila totalizador ATO
ws_resumen.cell(row=24, column=2, value="TOTAL POR CICLO ATO").font = font_bold
ws_resumen.merge_cells('C24:F24')
ws_resumen.cell(row=24, column=3, value="100% de contenidos clasificados según ciclo de vida del contribuyente").font = font_small
c_att = ws_resumen.cell(row=24, column=7, value="=SUM(G19:G23)")
c_att.font = font_bold
c_att.alignment = Alignment(horizontal='right', vertical='center')
c_atp = ws_resumen.cell(row=24, column=8, value="=SUM(H19:H23)")
c_atp.font = font_bold
c_atp.alignment = Alignment(horizontal='right', vertical='center')
c_atp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=24, column=c_idx).border = thin_border
    ws_resumen.cell(row=24, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[24].height = 24

# ------------------------------------------------------------------------------
# SECCIÓN 3: TIPOS DE INTERACCIÓN (CÓMO RESUELVE EL CIUDADANO)
# ------------------------------------------------------------------------------
ws_resumen['B26'] = "3. TIPOS DE INTERACCIÓN (CÓMO RESUELVE EL CIUDADANO)"
ws_resumen['B26'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

int_headers = ["Tipo de Interacción", "Modalidad Operativa", "Total Contenidos", "% del Portal"]
for col_idx, h in enumerate(int_headers, start=2):
    target_c = col_idx if col_idx < 4 else (col_idx + 3)
    c = ws_resumen.cell(row=27, column=target_c, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=CYAN_ACCENT, end_color=CYAN_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border
ws_resumen.merge_cells('C27:F27')
ws_resumen.row_dimensions[27].height = 26

for r_idx, (inom, idesc, icount) in enumerate(interactions, start=28):
    ws_resumen.cell(row=r_idx, column=2, value=inom).font = font_bold
    ws_resumen.cell(row=r_idx, column=2).alignment = Alignment(horizontal='left', vertical='center')
    
    ws_resumen.merge_cells(f"C{r_idx}:F{r_idx}")
    c_id = ws_resumen.cell(row=r_idx, column=3, value=idesc)
    c_id.font = font_small
    c_id.alignment = Alignment(horizontal='left', vertical='center')

    c_it = ws_resumen.cell(row=r_idx, column=7, value=icount)
    c_it.alignment = Alignment(horizontal='right', vertical='center')
    c_it.font = font_bold
    
    c_ip = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/$G$32")
    c_ip.alignment = Alignment(horizontal='right', vertical='center')
    c_ip.font = font_bold
    c_ip.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 22

# Fila totalizador Interacciones
ws_resumen.cell(row=32, column=2, value="TOTAL INTERACCIONES").font = font_bold
ws_resumen.merge_cells('C32:F32')
ws_resumen.cell(row=32, column=3, value="100% de contenidos catalogados según interacción digital").font = font_small
c_itt = ws_resumen.cell(row=32, column=7, value="=SUM(G28:G31)")
c_itt.font = font_bold
c_itt.alignment = Alignment(horizontal='right', vertical='center')
c_itp = ws_resumen.cell(row=32, column=8, value="=SUM(H28:H31)")
c_itp.font = font_bold
c_itp.alignment = Alignment(horizontal='right', vertical='center')
c_itp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=32, column=c_idx).border = thin_border
    ws_resumen.cell(row=32, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[32].height = 24

# Anchos de columna en Resumen
resumen_col_widths = {
    1: 4, 2: 6, 3: 32, 4: 55, 5: 50, 6: 55, 7: 18, 8: 14
}
for col_idx, width in resumen_col_widths.items():
    ws_resumen.column_dimensions[get_column_letter(col_idx)].width = width


# ==============================================================================
# HOJA 2: MAPA DE NAVEGACIÓN (ÁRBOL COMPLETO Y CANÓNICO CON 100% COBERTURA: 739)
# ==============================================================================
ws_mapa = wb.create_sheet(title="Mapa de Navegación")
ws_mapa.views.sheetView[0].showGridLines = True

ws_mapa.merge_cells('B2:J3')
banner_m = ws_mapa['B2']
banner_m.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner_m.font = font_title
banner_m.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner_m.alignment = Alignment(horizontal='center', vertical='center')

ws_mapa.merge_cells('B4:J4')
sub_m = ws_mapa['B4']
sub_m.value = "MAPA ESTRUCTURAL DE NAVEGACIÓN DEL PORTAL WEB — TAXONOMÍA CANÓNICA (N1 A N3) Y CONTEO OFICIAL DE COBERTURA"
sub_m.font = font_subtitle
sub_m.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_m.alignment = Alignment(horizontal='center', vertical='center')

headers_mapa = [
    "No.",
    "Nivel 1: Segmento Oficial",
    "Nivel 2: Régimen / Área",
    "Nivel 3: Categoría / Actor",
    "Alcance y Especialidad de Navegación",
    "Trámites",
    "% Segmento",
    "% Portal",
    "Ruta Canónica de Navegación (Miga de Pan)"
]

for col_idx, h in enumerate(headers_mapa, start=2):
    c = ws_mapa.cell(row=6, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_mapa.row_dimensions[6].height = 28

# Agrupar los nodos por segmento para insertar subtotales limpios
segmentos_orden = [
    ('Contribuyentes', 413, BLUE_HEADER),
    ('Operadores de Comercio Exterior', 202, CYAN_ACCENT),
    ('Profesionales', 45, GREEN_ACCENT),
    ('Entes Exentos', 79, PURPLE_ACCENT)
]

current_row = 7
node_no = 1
subtotal_rows = []

for seg_name, seg_total, seg_color in segmentos_orden:
    seg_nodes = [n for n in NODOS_MAPA if n['segmento'] == seg_name]
    start_seg_row = current_row
    
    for node in seg_nodes:
        ws_mapa.cell(row=current_row, column=2, value=node_no).alignment = Alignment(horizontal='center', vertical='center')
        ws_mapa.cell(row=current_row, column=3, value=node['segmento']).font = font_bold
        ws_mapa.cell(row=current_row, column=4, value=node['regimen']).font = font_bold
        ws_mapa.cell(row=current_row, column=5, value=node['categoria'])
        ws_mapa.cell(row=current_row, column=6, value=node['alcance']).font = font_small
        
        # Conteo trámites
        c_cnt = ws_mapa.cell(row=current_row, column=7, value=node['conteo_tramites'])
        c_cnt.alignment = Alignment(horizontal='right', vertical='center')
        c_cnt.font = font_bold

        # % del Segmento (se actualizará con la fórmula al subtotal)
        # Por ahora temporal, se fija abajo
        
        # Miga de Pan
        miga = f"{node['segmento']} > {node['regimen']} > {node['categoria']}"
        ws_mapa.cell(row=current_row, column=10, value=miga).font = font_small

        fill_color = ZEBRA_FILL if current_row % 2 == 0 else 'FFFFFF'
        for c_idx in range(2, 11):
            cell = ws_mapa.cell(row=current_row, column=c_idx)
            if c_idx not in [3, 4, 7]: cell.font = font_body
            if c_idx == 6 or c_idx == 10: cell.font = font_small
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
            cell.border = thin_border
        ws_mapa.row_dimensions[current_row].height = 24

        current_row += 1
        node_no += 1

    end_seg_row = current_row - 1
    subtotal_row = current_row
    subtotal_rows.append(subtotal_row)

    # Fila de Subtotal del Segmento
    ws_mapa.cell(row=subtotal_row, column=2, value="").border = subtotal_border
    ws_mapa.cell(row=subtotal_row, column=3, value=f"SUBTOTAL {seg_name.upper()}").font = font_bold
    ws_mapa.cell(row=subtotal_row, column=4, value=f"{len(seg_nodes)} Categorías / Actores").font = font_small
    ws_mapa.cell(row=subtotal_row, column=5, value="").border = subtotal_border
    ws_mapa.cell(row=subtotal_row, column=6, value="").border = subtotal_border
    
    c_subtot = ws_mapa.cell(row=subtotal_row, column=7, value=f"=SUM(G{start_seg_row}:G{end_seg_row})")
    c_subtot.font = font_bold
    c_subtot.alignment = Alignment(horizontal='right', vertical='center')

    c_sub_pct_seg = ws_mapa.cell(row=subtotal_row, column=8, value="100.0%")
    c_sub_pct_seg.font = font_bold
    c_sub_pct_seg.alignment = Alignment(horizontal='right', vertical='center')

    c_sub_pct_port = ws_mapa.cell(row=subtotal_row, column=9, value=f"=G{subtotal_row}/$G$44") # G44 es total final
    c_sub_pct_port.font = font_bold
    c_sub_pct_port.alignment = Alignment(horizontal='right', vertical='center')
    c_sub_pct_port.number_format = '0.0%'

    ws_mapa.cell(row=subtotal_row, column=10, value=f"Cobertura completa de {seg_name}").font = font_small

    for c_idx in range(2, 11):
        cell = ws_mapa.cell(row=subtotal_row, column=c_idx)
        cell.border = subtotal_border
        cell.fill = PatternFill(start_color=BG_SUBTOTAL, end_color=BG_SUBTOTAL, fill_type='solid')
    ws_mapa.row_dimensions[subtotal_row].height = 24

    # Ahora asignar fórmulas de porcentaje a las filas del segmento
    for r in range(start_seg_row, end_seg_row + 1):
        # % del Segmento
        c_ps = ws_mapa.cell(row=r, column=8, value=f"=G{r}/$G${subtotal_row}")
        c_ps.alignment = Alignment(horizontal='right', vertical='center')
        c_ps.font = font_small
        c_ps.number_format = '0.0%'
        
        # % del Portal
        c_pp = ws_mapa.cell(row=r, column=9, value=f"=G{r}/$G$44")
        c_pp.alignment = Alignment(horizontal='right', vertical='center')
        c_pp.font = font_small
        c_pp.number_format = '0.0%'

    current_row += 1

# Fila TOTAL GENERAL DEL PORTAL
final_row = current_row # Fila 45
ws_mapa.cell(row=final_row, column=2, value="").border = header_border
ws_mapa.cell(row=final_row, column=3, value="TOTAL PORTAL WEB SAT").font = font_bold
ws_mapa.cell(row=final_row, column=4, value="4 Segmentos y 33 Categorías").font = font_small
ws_mapa.cell(row=final_row, column=5, value="").border = header_border
ws_mapa.cell(row=final_row, column=6, value="Universo Total de Fichas Oficiales").font = font_bold

formula_total = "=" + "+".join([f"G{r}" for r in subtotal_rows])
c_tot_final = ws_mapa.cell(row=final_row, column=7, value=formula_total)
c_tot_final.font = Font(name='Segoe UI', size=10, bold=True, color='1E293B')
c_tot_final.alignment = Alignment(horizontal='right', vertical='center')

c_tot_pct_seg = ws_mapa.cell(row=final_row, column=8, value="—").alignment = Alignment(horizontal='center', vertical='center')
c_tot_pct_port = ws_mapa.cell(row=final_row, column=9, value="100.0%")
c_tot_pct_port.font = font_bold
c_tot_pct_port.alignment = Alignment(horizontal='right', vertical='center')

ws_mapa.cell(row=final_row, column=10, value=f"{TOTAL_PORTAL} Trámites 100% Mapeados").font = font_bold

for c_idx in range(2, 11):
    cell = ws_mapa.cell(row=final_row, column=c_idx)
    cell.border = header_border
    cell.fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_mapa.row_dimensions[final_row].height = 28

mapa_widths = {2: 8, 3: 32, 4: 36, 5: 36, 6: 48, 7: 14, 8: 14, 9: 14, 10: 55}
for col_idx, width in mapa_widths.items():
    ws_mapa.column_dimensions[get_column_letter(col_idx)].width = width
ws_mapa.freeze_panes = 'F7'

# ==============================================================================
# HOJA 3: FICHAS POR ROL Y CATEGORÍA (DEFINICIONES, LEAD TEXT Y BASE JURÍDICA: 33 FICHAS)
# ==============================================================================
ws_fichas = wb.create_sheet(title="Fichas por Rol y Categoría")
ws_fichas.views.sheetView[0].showGridLines = True

ws_fichas.merge_cells('A2:H3')
banner_f = ws_fichas['A2']
banner_f.value = "FICHAS TÉCNICAS DE ARQUITECTURA: DEFINICIÓN, LEAD TEXT Y BASE JURÍDICA POR ROL"
banner_f.font = font_title
banner_f.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner_f.alignment = Alignment(horizontal='center', vertical='center')

ws_fichas.merge_cells('A4:H4')
sub_f = ws_fichas['A4']
sub_f.value = "MATRIZ COMPLETA DE LAS 33 CATEGORÍAS DEL PORTAL CON SUS TEXTOS ORIENTADORES Y MARCO NORMATIVO OFICIAL"
sub_f.font = font_subtitle
sub_f.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_f.alignment = Alignment(horizontal='center', vertical='center')

headers_fichas = [
    "No.",
    "Segmento (Nivel 1)",
    "Régimen / Área (Nivel 2)",
    "Categoría / Actor (Nivel 3)",
    "Qué es: (Definición Operativa de la Figura)",
    "Lead text: (Texto Orientador de Interfaz)",
    "Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)",
    "Trámites"
]

for col_idx, h in enumerate(headers_fichas, start=1):
    c = ws_fichas.cell(row=6, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_fichas.row_dimensions[6].height = 28

for r_idx, node in enumerate(NODOS_MAPA, start=7):
    ws_fichas.cell(row=r_idx, column=1, value=r_idx - 6).alignment = Alignment(horizontal='center', vertical='center')
    ws_fichas.cell(row=r_idx, column=2, value=node['segmento']).font = font_bold
    ws_fichas.cell(row=r_idx, column=3, value=node['regimen']).font = font_bold
    ws_fichas.cell(row=r_idx, column=4, value=node['categoria'])
    
    # Qué es:
    c_qe = ws_fichas.cell(row=r_idx, column=5, value=node['que_es'])
    c_qe.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    
    # Lead text:
    c_lt = ws_fichas.cell(row=r_idx, column=6, value=node['lead_text'])
    c_lt.font = font_lead
    c_lt.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    # Base jurídica:
    c_bj = ws_fichas.cell(row=r_idx, column=7, value=node['base_juridica'])
    c_bj.font = font_legal
    c_bj.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_cnt = ws_fichas.cell(row=r_idx, column=8, value=node['conteo_tramites'])
    c_cnt.alignment = Alignment(horizontal='right', vertical='center')
    c_cnt.font = font_bold

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 9):
        cell = ws_fichas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 6, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_fichas.row_dimensions[r_idx].height = 54

# Fila totalizador en Fichas
tot_fichas_row = len(NODOS_MAPA) + 7
ws_fichas.cell(row=tot_fichas_row, column=1, value="").border = header_border
ws_fichas.cell(row=tot_fichas_row, column=2, value="TOTAL PORTAL WEB SAT").font = font_bold
ws_fichas.cell(row=tot_fichas_row, column=3, value="4 Segmentos Oficiales").font = font_small
ws_fichas.cell(row=tot_fichas_row, column=4, value=f"{len(NODOS_MAPA)} Categorías").font = font_small
ws_fichas.cell(row=tot_fichas_row, column=5, value="100% de la arquitectura de información clasificada").font = font_small
ws_fichas.cell(row=tot_fichas_row, column=6, value="").border = header_border
ws_fichas.cell(row=tot_fichas_row, column=7, value="").border = header_border
c_tot_f = ws_fichas.cell(row=tot_fichas_row, column=8, value=f"=SUM(H7:H{tot_fichas_row-1})")
c_tot_f.font = font_bold
c_tot_f.alignment = Alignment(horizontal='right', vertical='center')

for c_idx in range(1, 9):
    cell = ws_fichas.cell(row=tot_fichas_row, column=c_idx)
    cell.border = header_border
    cell.fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_fichas.row_dimensions[tot_fichas_row].height = 26

fichas_widths = {1: 8, 2: 28, 3: 32, 4: 32, 5: 55, 6: 50, 7: 55, 8: 14}
for col_idx, width in fichas_widths.items():
    ws_fichas.column_dimensions[get_column_letter(col_idx)].width = width
ws_fichas.freeze_panes = 'E7'
ws_fichas.auto_filter.ref = f"A6:H{len(NODOS_MAPA)+6}"

# Guardar libro definitivo
OUTPUT_MAPA_PATH = 'docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx'
wb.save(OUTPUT_MAPA_PATH)
print(f"Libro exclusivo del mapa guardado en: {OUTPUT_MAPA_PATH}")
print(f"Hojas: Resumen Arquitectura, Mapa de Navegación ({len(NODOS_MAPA)} nodos + 4 subtotales), Fichas por Rol y Categoría ({len(NODOS_MAPA)} fichas)")
