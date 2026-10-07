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
BG_LABEL = 'F1F5F9'         # Fondo gris suave para etiquetas

font_title = Font(name='Segoe UI', size=15, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='FFFFFF')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_card_title = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
font_label = Font(name='Segoe UI', size=9, bold=True, color='1E293B')
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

# ==============================================================================
# 1. DEFINICIÓN ESTRUCTURAL DE LOS 4 SEGMENTOS PRINCIPALES (NIVEL 1)
# ==============================================================================
SEGMENTOS_DATA = [
    {
        'segmento': 'Operadores de Comercio Exterior',
        'color': CYAN_ACCENT,
        'que_es': 'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.',
        'lead_text': 'Gestiona tus trámites aduaneros, consulta requisitos y haz seguimiento a tus operaciones según tu rol en la cadena logística.',
        'base_juridica': 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
    },
    {
        'segmento': 'Contribuyentes',
        'color': BLUE_HEADER,
        'que_es': 'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.',
        'lead_text': 'Cumple con tus obligaciones tributarias, emite tus facturas, actualiza tu RTU y gestiona tus trámites de vehículos e impuestos internos de forma ágil y 100% digital.',
        'base_juridica': 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'
    },
    {
        'segmento': 'Profesionales',
        'color': GREEN_ACCENT,
        'que_es': 'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
        'lead_text': 'Accede a herramientas especializadas de fe pública, autorización de libros contables, presentación de dictámenes fiscales y gestión de trámites profesionales.',
        'base_juridica': 'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 "A" y 112).'
    },
    {
        'segmento': 'Entes Exentos',
        'color': PURPLE_ACCENT,
        'que_es': 'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.',
        'lead_text': 'Solicita y gestiona tus resoluciones de exención, emite constancias tributarias electrónicas y administra las obligaciones formales de tu entidad.',
        'base_juridica': 'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'
    }
]

# ==============================================================================
# 2. DEFINICIÓN DE LAS 31 CATEGORÍAS Y ROLES (NIVEL 2 / 3 / 4)
# ==============================================================================
MAPA_DATA = [
    # --------------------------------------------------------------------------
    # 1. CONTRIBUYENTES (9 CATEGORÍAS)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Contribuyentes',
        'categoria': 'NIT sin Obligaciones',
        'grupo': 'Personas Individuales',
        'tema': 'RTU Digital y Solicitud de NIT',
        'que_es': 'Categoría destinada a personas individuales (estudiantes, personas en relación de dependencia sin renta afecta o ciudadanos en el extranjero) que requieren un Número de Identificación Tributaria únicamente para actos civiles, contractuales, bancarios o de registro público, sin realizar actividades mercantiles ni prestación de servicios técnicos afectos.',
        'lead_text': 'Inscribe tu primer NIT en línea, actualiza tus datos de residencia y obtén tu constancia de solvencia fiscal sin necesidad de acudir a una agencia.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Pequeños Contribuyentes',
        'grupo': 'Pequeño Contribuyente General',
        'tema': 'Régimen de 5% y Facturación FEL',
        'que_es': 'Régimen simplificado para personas individuales o jurídicas cuyas ventas de bienes o prestación de servicios no superan el monto de Q150,000 en el año calendario, tributando bajo una tarifa definitiva del 5% sobre ingresos brutos mensuales sin derecho a crédito fiscal.',
        'lead_text': 'Emite tus facturas electrónicas FEL de pequeño contribuyente, declara mensualmente el 5% en Declaraguate y mantén tus libros al día.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 45 al 50) y Ley de Simplificación Tributaria (Decreto 7-2019, Régimen Electrónico de Pequeño Contribuyente).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Pequeños Contribuyentes',
        'grupo': 'Sector Primario y Agropecuario',
        'tema': 'Regímenes Especiales Decreto 31-2024 / 7-2019',
        'que_es': 'Regímenes tributarios especiales creados para productores, ganaderos y comercializadores del sector agropecuario, artesanal y primario que comercializan productos no transformados.',
        'lead_text': 'Inscríbete en el régimen especial agropecuario, liquida tu Impuesto a la Confianza Tributaria y emite comprobantes oficiales simplificados.',
        'base_juridica': 'Ley de Simplificación Tributaria (Decreto 7-2019) y Ley para la Integración del Sector Productivo Primario y Agropecuario (Decreto 31-2024).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Contribuyente General',
        'grupo': 'Personas y Empresas en Régimen General',
        'tema': 'IVA General e Impuesto Sobre la Renta (ISR)',
        'que_es': 'Régimen aplicable a personas individuales y sociedades mercantiles con ingresos superiores a Q150,000 o afiliados voluntariamente al Régimen General del IVA (12%) y regímenes del ISR (Opcional Simplificado 5%/7% o Sobre Utilidades de Actividades Lucrativas 25%).',
        'lead_text': 'Declara y paga tu IVA mensual, liquida tus pagos trimestrales o retenciones de ISR, gestiona tu crédito fiscal y factura mediante FEL.',
        'base_juridica': 'Ley del IVA (Decreto 27-92), Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Ley del Impuesto de Solidaridad (Decreto 73-2008).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Asalariados',
        'grupo': 'Trabajadores en Relación de Dependencia',
        'tema': 'Retenciones de ISR y Planilla del IVA',
        'que_es': 'Régimen tributario de rentas del trabajo en relación de dependencia aplicable a trabajadores contratados por patronos públicos o privados que perciben ingresos salariales sujetos a retención del ISR.',
        'lead_text': 'Consulta tus retenciones de ISR practicadas por tu patrono, ingresa tu planilla del IVA con facturas FEL y solicita devolución de retenciones en exceso.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Arts. 68 al 82 - Rentas del Trabajo en Relación de Dependencia).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Vehículos',
        'grupo': 'Propietarios y Compradores de Vehículos',
        'tema': 'Registro Fiscal de Vehículos (RFV)',
        'que_es': 'Registro Fiscal de Vehículos (RFV) que administra el parque vehicular nacional, altas, bajas, modificaciones y el impuesto anual de circulación para propietarios y compradores de automotores terrestres, marítimos y aéreos.',
        'lead_text': 'Paga tu calcomanía anual de circulación (ISCV), tramita primeras placas, realiza traspasos vehiculares y repón distintivos extraviados.',
        'base_juridica': 'Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos (Decreto 70-94) y Código Tributario (Decreto 6-91).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Contribuyentes Especiales',
        'grupo': 'Grandes y Medianos Contribuyentes',
        'tema': 'Gerencias Especializadas de Fiscalización',
        'que_es': 'Segmento de control fiscal diferenciado conformado por grandes y medianos contribuyentes calificados por resolución de la SAT en función de su representatividad en la recaudación, facturación y relevancia sectorial.',
        'lead_text': 'Gestiona tus obligaciones en agencias especializadas, presenta estados financieros auditados y cumple con estudios de precios de transferencia.',
        'base_juridica': 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Resoluciones de Directorio de Calificación de Contribuyentes Especiales.',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Facturación Electrónica',
        'grupo': 'Emisores de DTE',
        'tema': 'Sistema FEL y Agencia Virtual',
        'que_es': 'Régimen obligatorio de emisión, transmisión y certificación de Documentos Tributarios Electrónicos (DTE) a través del sistema FEL y certificadores autorizados para todos los contribuyentes afiliados al régimen tributario nacional.',
        'lead_text': 'Habilítate como emisor de factura electrónica FEL, emite facturas gratuitas desde la Agencia Virtual y administra tus documentos emitidos y recibidos.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 29 y 29 "A") y Acuerdo de Directorio SAT 13-2018 (Régimen FEL).',
    },
    {
        'segmento': 'Contribuyentes',
        'categoria': 'Servicios al Contribuyente',
        'grupo': 'Ciudadanía y Usuarios de Agencia Virtual',
        'tema': 'Plataforma Digital, Citas y Solvencias',
        'que_es': 'Plataforma de servicios transversales de atención ciudadana, autenticación digital, expedición de solvencias fiscales, agendamiento de citas presenciales y consultas públicas en bases de datos de la SAT.',
        'lead_text': 'Crea o desbloquea tu Agencia Virtual, genera tu solvencia fiscal con código QR, agenda citas presenciales y consulta el estado de tus gestiones.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 57 "A" y Art. 120) y Acuerdos de Directorio de Servicios Electrónicos.',
    },

    # --------------------------------------------------------------------------
    # 2. OPERADORES DE COMERCIO EXTERIOR (12 ACTORES OFICIALES)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Importadores y Exportadores (Compartido)',
        'grupo': 'Operadores Comerciales Generales',
        'tema': 'Gestiones Aduaneras Comunes y Arancel',
        'que_es': 'Operadores comerciales que realizan indistintamente gestiones transversales de entrada y salida de mercancías, consultas arancelarias y pagos tributarios aduaneros en las aduanas de la República.',
        'lead_text': 'Consulta el Arancel Integrado Centroamericano (SAC), realiza pagos por BancaSAT y tramita solvencias aduaneras unificadas.',
        'base_juridica': 'Convenio sobre el Régimen Arancelario y Aduanero Centroamericano, CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA IV (Resolución 224-2008 COMIECO).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Importadores',
        'grupo': 'Importadores Registrados',
        'tema': 'Padrón de Importadores y DUCA-D',
        'que_es': 'Personas individuales o jurídicas autorizadas en el padrón aduanero de la SAT para introducir legalmente mercancías extranjeras al territorio aduanero nacional para su consumo, uso o transformación.',
        'lead_text': 'Inscríbete en el padrón de importadores, liquida tus declaraciones aduaneras DUCA-D, consulta aranceles y rescata mercancías en aduana.',
        'base_juridica': 'CAUCA IV (Arts. 21 y 77), RECAUCA IV (Arts. 317 al 330) y Acuerdo Relativo a la Aplicación del Artículo VII del GATT (Valoración OMC).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Exportadores',
        'grupo': 'Exportadores Habituales y Ocasionales',
        'tema': 'Padrón de Exportadores y Devolución IVA',
        'que_es': 'Personas individuales o jurídicas inscritas en el Registro de Exportadores de la SAT que despachan mercancías de origen nacional o nacionalizadas hacia mercados del exterior.',
        'lead_text': 'Registra tus exportaciones con código VUPE, emite facturas con régimen especial y gestiona la devolución de crédito fiscal del IVA.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis), Ley de Fomento y Maquila (Decreto 29-89) y CAUCA/RECAUCA IV.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Operador Económico Autorizado (OEA)',
        'grupo': 'Operadores Certificados en Seguridad',
        'tema': 'Cadena Logística Segura y Carril Exprés',
        'que_es': 'Operadores de la cadena logística internacional certificados por la Intendencia de Aduanas por mantener rigurosos estándares de seguridad y confiabilidad en sus operaciones transfronterizas.',
        'lead_text': 'Accede a carriles exprés preferenciales, prioridad en contingencias y despacho ágil con selectivo rojo reducido.',
        'base_juridica': 'Marco Normativo SAFE de la OMA, CAUCA IV y Resoluciones de Directorio de la SAT sobre el Programa OEA-Guatemala.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Agentes Aduaneros',
        'grupo': 'Auxiliares de la Función Pública Aduanera',
        'tema': 'Despacho Aduanero Oficial y Representación',
        'que_es': 'Profesionales auxiliares de la función pública aduanera autorizados para actuar por cuenta de terceros en los trámites y operaciones de desaduanamiento ante la SAT.',
        'lead_text': 'Gestiona tu carné y habilitación oficial, presenta pólizas de seguro de caución y transmite declaraciones con firma electrónica.',
        'base_juridica': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Arts. 74 al 85) y Ley Nacional de Aduanas.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Apoderados Especiales Aduaneros',
        'grupo': 'Representantes Legales Exclusivos',
        'tema': 'Despacho Aduanero por Cuenta Propia',
        'que_es': 'Personas individuales mandatarias designadas exclusivamente por una persona jurídica para representarla formalmente en sus despachos aduaneros propios.',
        'lead_text': 'Registra tu mandato legal, actualiza tu carné de apoderado y tramita declaraciones DUCA corporativas.',
        'base_juridica': 'CAUCA IV (Art. 21), RECAUCA IV (Arts. 86 al 90) y Código de Notariado.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Empresas de Entrega Rápida o Courier',
        'grupo': 'Mensajería y Envíos Expresos',
        'tema': 'Paquetería Internacional y Franquicias',
        'que_es': 'Empresas de mensajería y paquetería urgente autorizadas para transportar y desaduanar envíos postales exprés y encomiendas internacionales no comerciales.',
        'lead_text': 'Transmite manifiestos courier, aplica franquicias simplificadas y habilita recintos desconsolidadores de paquetería.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 574 al 596 - Régimen de Envíos de Entrega Rápida o Courier).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Consolidadores y Desconsolidadores de Carga',
        'grupo': 'Operadores Logísticos y de Carga',
        'tema': 'Manifiestos CUSCAR y Guías Hijas',
        'que_es': 'Operadores logísticos autorizados para agrupar o separar mercancías pertenecientes a distintos consignatarios bajo un solo documento matriz de transporte.',
        'lead_text': 'Transmite manifiestos CUSCAR, emite guías hijas y reporta inconsistencias o averías de carga ante la aduana.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 102 al 109 - Auxiliares Consolidador y Desconsolidador de Carga).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Transportistas Aduaneros',
        'grupo': 'Transporte Internacional Terrestre y Carga',
        'tema': 'Tránsito Aduanero Internacional y Marchamo',
        'que_es': 'Empresas y conductores autorizados para realizar el traslado de mercancías bajo control aduanero dentro del territorio nacional o en tránsito internacional centroamericano.',
        'lead_text': 'Registra medios de transporte, activa marchamos electrónicos RFID y transmite declaraciones de tránsito DUCA-T.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 20), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Reglamentos de Transporte Centroamericano.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'Depósitos Aduaneros',
        'grupo': 'Almacenes Fiscales, AGD y DAT',
        'tema': 'Custodia de Mercancías y Títulos de Crédito',
        'que_es': 'Recintos públicos o privados (Almacenes Fiscales, Almacenes Generales de Depósito y Depósitos Aduaneros Temporales DAT) autorizados para custodiar mercancías con suspensión de tributos aduaneros.',
        'lead_text': 'Controla inventarios de custodia, gestiona actas de recepción, emite certificados de depósito (AGD) y tramita prórrogas de permanencia.',
        'base_juridica': 'Decreto 1236 (Ley de Almacenes Generales de Depósito), CAUCA IV y RECAUCA IV (Arts. 119 al 129 - Régimen de Depósito Aduanero).',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'ZDEEP - Entidades Administradoras',
        'grupo': 'Polígonos ZDEEP',
        'tema': 'Administración de Zonas Especiales Públicas',
        'que_es': 'Personas jurídicas públicas o privadas autorizadas por ZOLIC y SAT para desarrollar, operar y vigilar la infraestructura de polígonos industriales y logísticos ZDEEP.',
        'lead_text': 'Delimita polígonos aduaneros, administra garitas de control y supervisa el perímetro de seguridad de la zona especial.',
        'base_juridica': 'Decreto 22-73 (Ley Orgánica de ZOLIC reformada), CAUCA IV, RECAUCA IV y Resoluciones Conjuntas SAT-ZOLIC.',
    },
    {
        'segmento': 'Operadores de Comercio Exterior',
        'categoria': 'ZDEEP - Empresas Usuarias',
        'grupo': 'Empresas Instaladas en ZDEEP',
        'tema': 'Transformación, Servicios y Exenciones',
        'que_es': 'Empresas industriales, comerciales o de servicios instaladas y operando dentro de los recintos calificados como ZDEEP para producir o transformar con beneficios fiscales.',
        'lead_text': 'Ingresa materias primas con suspensión de DAI e IVA, realiza descargos de producción y goza de exenciones tributarias.',
        'base_juridica': 'Decreto 22-73 (Régimen Fiscal ZDEEP), Ley de Actualización Tributaria (Decreto 10-2012) y CAUCA/RECAUCA IV.',
    },

    # --------------------------------------------------------------------------
    # 3. PROFESIONALES (5 CATEGORÍAS)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Profesionales',
        'categoria': 'Abogados y Notarios',
        'grupo': 'Notarios en Ejercicio',
        'tema': 'Papel Sellado de Protocolo y Avisos',
        'que_es': 'Profesionales del derecho colegiados activos autorizados para ejercer la fe pública notarial, redactar instrumentos públicos y autorizar traspasos electrónicos de vehículos ante la SAT.',
        'lead_text': 'Compra papel sellado especial para protocolos, adquiere timbres fiscales, realiza traspasos vehiculares electrónicos (TEV) y presenta avisos notariales.',
        'base_juridica': 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales y de Papel Sellado Especial para Protocolos (Decreto 37-92) y Código Tributario.',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Peritos Contadores',
        'grupo': 'Contadores Registrados',
        'tema': 'Libros Contables y Declaraciones',
        'que_es': 'Técnicos y profesionales contables inscritos y autorizados ante la SAT para llevar y firmar registros contables de contribuyentes, certificar estados financieros y realizar gestiones tributarias.',
        'lead_text': 'Inscríbete y actualiza tus datos en el Registro de Contadores, autoriza libros contables computarizados y asocia contribuyentes a tu perfil.',
        'base_juridica': 'Decreto 2450 (Normas que Regulan el Ejercicio de la Profesión de Contador), Código de Comercio (Decreto 2-70) y Código Tributario (Arts. 112 y 120).',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Auditores',
        'grupo': 'Contadores Públicos y Auditores (CPA)',
        'tema': 'Dictámenes Tributarios y Devolución IVA',
        'que_es': 'Contadores Públicos y Auditores (CPA) colegiados activos y firmas de auditoría facultados para emitir dictámenes sobre estados financieros, devolución de crédito fiscal e informes de precios de transferencia.',
        'lead_text': 'Emite dictámenes de crédito fiscal para exportadores, dictámenes de estados financieros para licitaciones y presenta informes tributarios requeridos por SAT.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria (Decreto 72-2001), Ley del IVA (Decreto 27-92, Art. 23 bis) y Ley de Actualización Tributaria (Decreto 10-2012).',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Gestores Tributarios',
        'grupo': 'Gestores Acreditados SAT',
        'tema': 'Gafetes y Trámites Presenciales',
        'que_es': 'Personas individuales autorizadas y acreditadas formalmente ante la SAT para representar a terceros en la tramitación presencial de gestiones administrativas tributarias y aduaneras.',
        'lead_text': 'Tramita y renueva tu carné oficial de gestor tributario, registra tus datos biométricos y gestiona expedientes autorizados en agencias tributarias.',
        'base_juridica': 'Acuerdos de Directorio de la SAT sobre Regulación y Acreditación de Gestores Tributarios y Código Tributario.',
    },
    {
        'segmento': 'Profesionales',
        'categoria': 'Servicios Profesionales',
        'grupo': 'Profesionales Liberales Independientes',
        'tema': 'Facturación por Honorarios y Retenciones',
        'que_es': 'Profesionales liberales e independientes que prestan servicios técnicos, científicos, jurídicos o de consultoría por honorarios profesionales.',
        'lead_text': 'Emite facturas electrónicas FEL por honorarios, liquida retenciones de ISR, actualiza tu colegiado activo y consulta tu solvencia fiscal.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Ley del IVA (Decreto 27-92).',
    },

    # --------------------------------------------------------------------------
    # 4. ENTES EXENTOS (5 CATEGORÍAS)
    # --------------------------------------------------------------------------
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Constitucionales',
        'grupo': 'Universidades, Colegios e Iglesias',
        'tema': 'Exenciones Tributarias de Rango Constitucional',
        'que_es': 'Instituciones educativas, universidades, comunidades religiosas, misiones diplomáticas y cuerpos consulares que gozan de exención de impuestos por mandato directo de la Carta Magna.',
        'lead_text': 'Inscribe tu personería jurídica exenta en el RTU, emite constancias electrónicas de exención de IVA y timbres, y acredita representación legal.',
        'base_juridica': 'Constitución Política de la República de Guatemala (Arts. 37, 73, 88), Ley del IVA (Art. 8) y Código Tributario (Art. 62).',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'No Lucrativos',
        'grupo': 'ONGs, Fundaciones y Cooperativas',
        'tema': 'Reconocimiento de Exención de ISR e IVA',
        'que_es': 'Organizaciones No Gubernamentales (ONGs), fundaciones benéficas, asociaciones civiles sin fines de lucro y cooperativas que solicitan reconocimiento administrativo de exención de ISR e IVA.',
        'lead_text': 'Solicita tu resolución formal de exención de ISR, actualiza estatutos y junta directiva en el RTU y emite constancias de retención y exención.',
        'base_juridica': 'Decreto 02-2003 (Ley de ONGs para el Desarrollo), Ley de Actualización Tributaria (Decreto 10-2012, Art. 11) y Ley del IVA.',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Municipalidades',
        'grupo': 'Gobiernos Locales y Empresas Municipales',
        'tema': 'Autonomía Municipal y Régimen Exento',
        'que_es': 'Las 340 corporaciones municipales autónomas de la República de Guatemala, mancomunidades y empresas municipales públicas prestadoras de servicios comunitarios.',
        'lead_text': 'Registra autoridades y tesoreros en el RTU, gestiona la exención del impuesto de circulación para flotillas municipales y tramita solvencias institucionales.',
        'base_juridica': 'Constitución Política de la República (Art. 257), Código Municipal (Decreto 12-2002) y Ley del ISCV (Decreto 70-94).',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Entidades del Estado',
        'grupo': 'Ministerios, Secretarías y Organismos del Estado',
        'tema': 'Compras Públicas y Agentes de Retención',
        'que_es': 'Ministerios de Estado, secretarías, organismos de los poderes Ejecutivo, Legislativo y Judicial, y entidades públicas descentralizadas que operan como agentes de retención del IVA e ISR.',
        'lead_text': 'Habilita unidades ejecutoras en el RTU, emite constancias de retención en compras públicas y administra el parque vehicular oficial del Estado.',
        'base_juridica': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA, Ley de Contrataciones del Estado (Decreto 57-92) y Código Tributario.',
    },
    {
        'segmento': 'Entes Exentos',
        'categoria': 'Decreto',
        'grupo': 'Entidades con Incentivos Especiales',
        'tema': 'Exenciones y Fomento por Decreto Legislativo',
        'que_es': 'Personas o entidades beneficiarias de leyes de fomento económico y exenciones tributarias específicas aprobadas mediante decretos legislativos ordinarios del Congreso.',
        'lead_text': 'Acredita resoluciones ministeriales de calificación de fomento, gestiona exenciones arancelarias temporales y presenta reportes periódicos de cumplimiento.',
        'base_juridica': 'Decretos específicos de fomento (Decreto 29-89 de Maquilas, Decreto 65-89 de Zonas Francas, Ley de Incentivos para Energías Renovables) y Código Tributario.',
    }
]

# Calcular conteos reales desde all_t para cada nodo del mapa
for node in MAPA_DATA:
    seg = node['segmento']
    cat = node['categoria']
    count = sum(1 for t in all_t if (t.get('segmento') == seg or t.get('pillarName') == seg) and t.get('categoria') == cat)
    node['conteo_tramites'] = count

# Conteo por segmento
for seg_item in SEGMENTOS_DATA:
    s_nom = seg_item['segmento']
    seg_item['conteo_tramites'] = sum(1 for t in all_t if (t.get('segmento') == s_nom or t.get('pillarName') == s_nom))
    seg_item['pct'] = seg_item['conteo_tramites'] / len(all_t)

TOTAL_PORTAL = len(all_t)

# ==============================================================================
# HOJA 1: RESUMEN DE ARQUITECTURA (CON EL FORMATO SOLICITADO: QUE ES, LEAD TEXT, BASE JURIDICA)
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

# Banner
ws_resumen.merge_cells('B2:H3')
banner = ws_resumen['B2']
banner.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner.font = font_title
banner.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner.alignment = Alignment(horizontal='center', vertical='center')

ws_resumen.merge_cells('B4:H4')
sub = ws_resumen['B4']
sub.value = "RESUMEN EJECUTIVO DE ARQUITECTURA DE INFORMACIÓN — DEFINICIÓN DE SEGMENTOS, LEAD TEXT Y BASE JURÍDICA"
sub.font = font_subtitle
sub.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub.alignment = Alignment(horizontal='center', vertical='center')

# Tarjetas KPI superiores
kpis = [
    ("TOTAL DEL PORTAL", f"{TOTAL_PORTAL} Trámites", "Universo Oficial SAT", "B6", "B7", NAVY_HEADER),
    ("CONTRIBUYENTES", f"{SEGMENTOS_DATA[1]['conteo_tramites']} Trámites", "Régimen Interno", "C6", "C7", BLUE_HEADER),
    ("COMERCIO EXTERIOR", f"{SEGMENTOS_DATA[0]['conteo_tramites']} Trámites", "Aduanas, AFPA y Zonas", "D6", "D7", CYAN_ACCENT),
    ("PROFESIONALES", f"{SEGMENTOS_DATA[2]['conteo_tramites']} Trámites", "Notarios, CPA, TEV", "E6", "E7", GREEN_ACCENT),
    ("ENTES EXENTOS", f"{SEGMENTOS_DATA[3]['conteo_tramites']} Trámites", "ONGs, Iglesias, Estado", "F6", "G7", PURPLE_ACCENT),
]

for label, val, sub_txt, top_l, bot_r, color in kpis:
    ws_resumen.merge_cells(f"{top_l}:{bot_r}")
    cell = ws_resumen[top_l]
    cell.value = f"{label}\n{val}"
    cell.font = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
    cell.fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

# Título de Sección
ws_resumen['B9'] = "1. RESUMEN ESTRUCTURAL POR SEGMENTO (NIVEL 1) — DEFINICIONES INSTITUCIONALES"
ws_resumen['B9'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

current_row = 11

for s in SEGMENTOS_DATA:
    # Encabezado del Segmento con métricas
    ws_resumen.merge_cells(f"B{current_row}:G{current_row}")
    c_title = ws_resumen[f"B{current_row}"]
    c_title.value = f"  {s['segmento'].upper()}  ({s['conteo_tramites']} Trámites — {s['pct']:.1%} del Portal)"
    c_title.font = font_card_title
    c_title.fill = PatternFill(start_color=s['color'], end_color=s['color'], fill_type='solid')
    c_title.alignment = Alignment(horizontal='left', vertical='center')
    ws_resumen.row_dimensions[current_row].height = 26
    
    # Fila Qué es:
    ws_resumen.cell(row=current_row+1, column=2, value="Qué es:").font = font_label
    ws_resumen.cell(row=current_row+1, column=2).fill = PatternFill(start_color=BG_LABEL, end_color=BG_LABEL, fill_type='solid')
    ws_resumen.cell(row=current_row+1, column=2).alignment = Alignment(horizontal='center', vertical='center')
    ws_resumen.cell(row=current_row+1, column=2).border = thin_border
    
    ws_resumen.merge_cells(f"C{current_row+1}:G{current_row+1}")
    c_qe = ws_resumen[f"C{current_row+1}"]
    c_qe.value = s['que_es']
    c_qe.font = font_body
    c_qe.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    for col_c in range(3, 8):
        ws_resumen.cell(row=current_row+1, column=col_c).border = thin_border
    ws_resumen.row_dimensions[current_row+1].height = 44

    # Fila Lead text:
    ws_resumen.cell(row=current_row+2, column=2, value="Lead text:").font = font_label
    ws_resumen.cell(row=current_row+2, column=2).fill = PatternFill(start_color=BG_LABEL, end_color=BG_LABEL, fill_type='solid')
    ws_resumen.cell(row=current_row+2, column=2).alignment = Alignment(horizontal='center', vertical='center')
    ws_resumen.cell(row=current_row+2, column=2).border = thin_border
    
    ws_resumen.merge_cells(f"C{current_row+2}:G{current_row+2}")
    c_lt = ws_resumen[f"C{current_row+2}"]
    c_lt.value = s['lead_text']
    c_lt.font = font_lead
    c_lt.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    for col_c in range(3, 8):
        ws_resumen.cell(row=current_row+2, column=col_c).border = thin_border
    ws_resumen.row_dimensions[current_row+2].height = 28

    # Fila Base jurídica:
    ws_resumen.cell(row=current_row+3, column=2, value="Base jurídica:").font = font_label
    ws_resumen.cell(row=current_row+3, column=2).fill = PatternFill(start_color=BG_LABEL, end_color=BG_LABEL, fill_type='solid')
    ws_resumen.cell(row=current_row+3, column=2).alignment = Alignment(horizontal='center', vertical='center')
    ws_resumen.cell(row=current_row+3, column=2).border = thin_border
    
    ws_resumen.merge_cells(f"C{current_row+3}:G{current_row+3}")
    c_bj = ws_resumen[f"C{current_row+3}"]
    c_bj.value = s['base_juridica']
    c_bj.font = font_legal
    c_bj.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    for col_c in range(3, 8):
        ws_resumen.cell(row=current_row+3, column=col_c).border = thin_border
    ws_resumen.row_dimensions[current_row+3].height = 32

    current_row += 5

# Ajustar anchos en Resumen
ws_resumen.column_dimensions['A'].width = 3
ws_resumen.column_dimensions['B'].width = 16
ws_resumen.column_dimensions['C'].width = 36
ws_resumen.column_dimensions['D'].width = 36
ws_resumen.column_dimensions['E'].width = 36
ws_resumen.column_dimensions['F'].width = 24
ws_resumen.column_dimensions['G'].width = 24
ws_resumen.column_dimensions['H'].width = 4

# ==============================================================================
# HOJA 2: MAPA DE NAVEGACIÓN (TAXONOMÍA PURA N1 A N4)
# ==============================================================================
ws_mapa = wb.create_sheet(title="Mapa de Navegación")
ws_mapa.views.sheetView[0].showGridLines = True

ws_mapa.merge_cells('B2:H3')
banner_m = ws_mapa['B2']
banner_m.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner_m.font = font_title
banner_m.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner_m.alignment = Alignment(horizontal='center', vertical='center')

ws_mapa.merge_cells('B4:H4')
sub_m = ws_mapa['B4']
sub_m.value = "MAPA ESTRUCTURAL DE NAVEGACIÓN DEL PORTAL WEB (ARQUITECTURA DE INFORMACIÓN CENTRADA EN EL CIUDADANO)"
sub_m.font = font_subtitle
sub_m.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_m.alignment = Alignment(horizontal='center', vertical='center')

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

total_row = len(MAPA_DATA) + 7
ws_mapa.cell(row=total_row, column=2, value="").border = thin_border
ws_mapa.cell(row=total_row, column=3, value="TOTAL DEL PORTAL").font = font_bold
ws_mapa.cell(row=total_row, column=4, value="4 Segmentos y 31 Categorías Principales").font = font_small
ws_mapa.cell(row=total_row, column=5, value="").border = thin_border
ws_mapa.cell(row=total_row, column=6, value="").border = thin_border
c_tot = ws_mapa.cell(row=total_row, column=7, value=f"=SUM(G7:G{total_row-1})")
c_tot.font = font_bold
c_tot.alignment = Alignment(horizontal='right')
ws_mapa.cell(row=total_row, column=8, value=f"{TOTAL_PORTAL} Trámites Oficiales Integrados").font = font_bold
for c_idx in range(2, 9):
    ws_mapa.cell(row=total_row, column=c_idx).border = thin_border
    ws_mapa.cell(row=total_row, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')

mapa_widths = {2: 8, 3: 32, 4: 34, 5: 34, 6: 38, 7: 20, 8: 55}
for col_idx, width in mapa_widths.items():
    ws_mapa.column_dimensions[get_column_letter(col_idx)].width = width
ws_mapa.freeze_panes = 'E7'

# ==============================================================================
# HOJA 3: FICHAS POR ROL Y CATEGORÍA (QUÉ ES, LEAD TEXT Y BASE JURÍDICA EN DETALLE)
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
sub_f.value = "MATRIZ COMPLETA DE LAS 31 CATEGORÍAS DEL PORTAL CON SUS TEXTOS ORIENTADORES Y MARCO NORMATIVO OFICIAL"
sub_f.font = font_subtitle
sub_f.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_f.alignment = Alignment(horizontal='center', vertical='center')

headers_fichas = [
    "No.",
    "Segmento (Nivel 1)",
    "Categoría / Rol (Nivel 2/3)",
    "Tema / Especialidad (Nivel 4)",
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

for r_idx, node in enumerate(MAPA_DATA, start=7):
    ws_fichas.cell(row=r_idx, column=1, value=r_idx - 6).alignment = Alignment(horizontal='center')
    ws_fichas.cell(row=r_idx, column=2, value=node['segmento']).font = font_bold
    ws_fichas.cell(row=r_idx, column=3, value=node['categoria']).font = font_bold
    ws_fichas.cell(row=r_idx, column=4, value=node['tema'])
    
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
    c_cnt.alignment = Alignment(horizontal='right')
    c_cnt.font = font_bold

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 9):
        cell = ws_fichas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 6, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_fichas.row_dimensions[r_idx].height = 50

fichas_widths = {1: 8, 2: 28, 3: 32, 4: 30, 5: 55, 6: 50, 7: 55, 8: 12}
for col_idx, width in fichas_widths.items():
    ws_fichas.column_dimensions[get_column_letter(col_idx)].width = width
ws_fichas.freeze_panes = 'D7'
ws_fichas.auto_filter.ref = f"A6:H{len(MAPA_DATA)+6}"

# Guardar libro exclusivo del mapa
OUTPUT_MAPA_PATH = 'docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx'
wb.save(OUTPUT_MAPA_PATH)
print(f"Libro exclusivo del mapa guardado en: {OUTPUT_MAPA_PATH}")
print(f"Hojas: Resumen Arquitectura, Mapa de Navegación, Fichas por Rol y Categoría ({len(MAPA_DATA)} fichas)")
