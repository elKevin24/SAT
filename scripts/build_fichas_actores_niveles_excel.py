# -*- coding: utf-8 -*-
"""
Genera la hoja "Fichas por Nivel" (tabla plana) del libro
Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx

Una fila por nodo, en todos los niveles de la arquitectura:
    Nivel 1 (4) + Nivel 2 (19) + Nivel 3 (17) = 40

Columnas: No. | Nivel | Nombre | Qué es | Lead text | Base jurídica

Los niveles se rotulan únicamente por su número (Nivel 1, Nivel 2, Nivel 3),
conforme a la regla de AGENTS.md: los niveles no llevan nombres conceptuales.

Alcance: solo los nodos de audiencia/rol (no el contenido de navegación ni los
trámites). No modifica ninguna otra hoja del libro.
"""

import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side

EXCEL_PATH = (
    'docs/fuentes-datos/02_archivos_producto_entregables/'
    'Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx'
)
SHEET_NAME = 'Fichas por Nivel'
OLD_SHEETS = ['Fichas de Actores', 'Fichas de Actores por Nivel']

HEADERS = ['No.', 'Nivel', 'Nombre', 'Qué es', 'Lead text', 'Base jurídica']
WIDTHS = {'A': 6, 'B': 10, 'C': 34, 'D': 62, 'E': 52, 'F': 58}

# (nivel, nombre, que_es, lead_text, base_juridica)
ACTORES = [
    # ------------------------------------------------------- CONTRIBUYENTES
    (1, 'Contribuyentes',
     'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de '
     'obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin '
     'actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, '
     'contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos '
     'contribuyentes especiales calificados.',
     'Información y servicios tributarios para personas y empresas.',
     'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), '
     'Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de '
     'Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'),
    (2, 'Sin Obligaciones de Impuestos',
     'Personas individuales que no realizan actividades económicas mercantiles pero requieren '
     'identificación tributaria para actos civiles, contratos, trámites notariales o apertura de '
     'cuentas bancarias.',
     'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia '
     'sin movimientos comerciales.',
     'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria '
     '(Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'),
    (3, 'Asalariados, Compradores de Bienes y Residentes en el Extranjero',
     'Personas individuales que, sin ejercer actividad económica mercantil, tramitan su NIT '
     'únicamente para actos civiles, laborales, notariales o bancarios. Agrupa a asalariados sin '
     'obligaciones tributarias, compradores de bienes, estudiantes y residentes en el extranjero que '
     'requieren identificación tributaria sin declarar impuestos internos.',
     'Solicita tu NIT sin actividad comercial, actualiza tus datos y consulta tus constancias.',
     'Código Tributario (Dto. 6-91, Arts. 112 y 120), Ley de Actualización Tributaria '
     '(Dto. 10-2012) y Acuerdo de Directorio SAT 08-2020.'),
    (2, 'Pequeños Contribuyentes',
     'Régimen tributario simplificado para personas individuales o jurídicas con ventas o servicios '
     'en el régimen simplificado (tarifa definitiva 5% de IVA sin crédito fiscal), así como '
     'productores agropecuarios del sector primario.',
     'Facturación electrónica FEL, declaraciones mensuales del 5%, régimen electrónico y '
     'facilidades para el sector primario.',
     'Ley del IVA (Decreto 27-92, Arts. 45 al 50), Decreto 7-2019 (Régimen Electrónico) y '
     'Decreto 31-2024 (Sector Primario y Agropecuario).'),
    (3, 'Pequeño Contribuyente General (5% / Régimen Electrónico)',
     'Personas individuales o jurídicas inscritas en el régimen simplificado del IVA del 5% '
     'definitivo sobre ingresos brutos, o en el régimen electrónico del Decreto 7-2019, sin derecho '
     'a crédito fiscal y con obligación de emitir factura electrónica FEL.',
     'Inscríbete en el régimen del 5%, declara mensualmente y habilita tu facturación FEL.',
     'Ley del IVA (Dto. 27-92, Arts. 45 al 50) y Ley de Simplificación Tributaria (Dto. 7-2019).'),
    (3, 'Productores del Sector Primario (Régimen Especial)',
     'Productores agropecuarios, silvícolas y pesqueros del sector primario acogidos a regímenes '
     'especiales de tributación, incluidos los sujetos al Impuesto de Circulación de Productos '
     '(ICT) y los beneficios del Decreto 31-2024.',
     'Regístrate como productor del sector primario y gestiona tu régimen especial e ICT.',
     'Ley del IVA (Dto. 27-92, Arts. 45 al 50), Dto. 31-2024 (Sector Primario y Agropecuario) y '
     'Ley del Impuesto de Circulación de Productos.'),
    (2, 'Régimen General',
     'Personas individuales y jurídicas afectas a las obligaciones tributarias generales del IVA '
     '(12%) e ISR (Actividades Lucrativas, Rentas del Capital y del Trabajo), administración del '
     'Registro Fiscal de Vehículos, facturación electrónica FEL y solvencia fiscal.',
     'Declaraciones periódicas, facturación digital FEL, RTU Digital, traspasos vehiculares y pago '
     'de impuestos.',
     'Código Tributario (Decreto 6-91), Ley del IVA (Decreto 27-92), Ley de Actualización '
     'Tributaria (Decreto 10-2012) y Ley del ISCV (Decreto 70-94).'),
    (3, 'Asalariados y Relación de Dependencia',
     'Trabajadores cuyos ingresos provienen exclusivamente de una relación laboral de dependencia, '
     'sujetos a retención mensual de ISR por parte del patrono y a proyección anual con opción de '
     'devolución cuando existe retención en exceso.',
     'Consulta tus retenciones de ISR, presenta tu proyección anual y solicita devoluciones como '
     'asalariado.',
     'Ley de Actualización Tributaria (Dto. 10-2012, Libro I - ISR Rentas del Trabajo) y su '
     'Reglamento.'),
    (3, 'Empresas y Sociedades Mercantiles',
     'Sociedades anónimas, de responsabilidad limitada, sucursales de sociedades extranjeras, '
     'contratos asociativos y demás personas jurídicas mercantiles constituidas conforme al Código '
     'de Comercio, obligadas a inscribir su RTU, acreditar representantes legales y gestionar su '
     'cese o cancelación.',
     'Inscribe tu sociedad, actualiza a sus representantes legales y gestiona su cese o '
     'cancelación.',
     'Código de Comercio (Decreto 2-70), Código Tributario (Decreto 6-91, Arts. 112 y 120) y '
     'Acuerdo de Directorio SAT 08-2020.'),
    (2, 'Contribuyentes Especiales',
     'Grandes y medianos contribuyentes calificados por la SAT con atención gerencial diferenciada, '
     'sujetos a fiscalización intensiva, requerimientos de precios de transferencia y presentación '
     'de estados financieros auditados.',
     'Atención especializada en gerencias diferenciadas, cumplimiento tributario corporativo y '
     'auditorías fiscales.',
     'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Resoluciones de Directorio de Calificación de '
     'Contribuyentes Especiales.'),
    (3, 'Grandes y Medianos Contribuyentes',
     'Empresas calificadas mediante Resolución del Directorio como Grandes o Medianos Contribuyentes '
     'Especiales, con régimen de atención diferenciada, obligación de reportar operaciones con '
     'partes relacionadas (precios de transferencia) y de presentar estados financieros auditados.',
     'Cumple tus obligaciones especiales, presenta estados financieros auditados y gestiona tus '
     'estudios de precios de transferencia.',
     'Ley Orgánica de la SAT (Decreto 1-98, Art. 3), Código Tributario (Dto. 6-91, Arts. 112 y 120) '
     'y Resoluciones de Directorio sobre Contribuyentes Especiales.'),

    # ----------------------------------------- OPERADORES DE COMERCIO EXTERIOR
    (1, 'Operadores de Comercio Exterior',
     'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, '
     'traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños '
     'de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos '
     'autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que '
     'operan bajo regímenes territoriales especiales.',
     'Servicios e información aduanera para la importación, exportación y logística.',
     'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución '
     '224-2008 COMIECO).'),
    (2, 'Importadores',
     'Personas individuales o jurídicas autorizadas en el padrón aduanero para ingresar legalmente '
     'mercancías extranjeras al territorio aduanero nacional para consumo, uso o transformación.',
     'Padrón de importadores, liquidación de declaraciones DUCA-D, despacho aduanero, aranceles e '
     'importación vehicular.',
     'CAUCA IV (Arts. 21 y 77), RECAUCA IV (Arts. 317 al 330) y Ley Nacional de Aduanas.'),
    (2, 'Exportadores',
     'Operadores inscritos en el Registro de Exportadores de la SAT y en la Ventanilla Única para '
     'las Exportaciones (VUPE) que despachan mercancías de origen nacional o nacionalizadas hacia '
     'mercados extranjeros.',
     'Código VUPE, declaraciones aduaneras de embarque y gestión de devolución de crédito fiscal del '
     'IVA.',
     'Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis), Decreto 29-89 (Ley de Maquilas) y '
     'CAUCA/RECAUCA IV.'),
    (2, 'Operador Económico Autorizado (OEA)',
     'Actores de la cadena logística internacional certificados por la SAT con estándares SAFE de la '
     'OMA para gozar de despacho preferencial y simplificación aduanera.',
     'Certificación en seguridad logística, carriles exprés y reducción de selectivo rojo en '
     'aduanas.',
     'Marco Normativo SAFE de la OMA, CAUCA IV y Resoluciones de Directorio SAT del Programa '
     'OEA-Guatemala.'),
    (2, 'Auxiliares de la Función Pública Aduanera (AFPA)',
     'Personas naturales o jurídicas autorizadas por la Intendencia de Aduanas para actuar en nombre '
     'propio o de terceros en desaduanamiento, transporte, custodia o desconsolidación: agentes '
     'aduaneros, apoderados, depósitos temporales, courier y transportistas.',
     'Carnés oficiales, pólizas de fianza operativa, marchamos electrónicos y habilitación de '
     'depósitos aduaneros.',
     'CAUCA IV (Arts. 18 al 28), RECAUCA IV (Arts. 74 al 136) y Ley Nacional de Aduanas.'),
    (3, 'Agentes Aduaneros',
     'Personas naturales autorizadas por la SAT para actuar como auxiliares de la función pública '
     'aduanera en el despacho de mercancías por cuenta de importadores y exportadores, con mandato '
     'inscrito, fianza vigente y carné oficial.',
     'Inscríbete, renueva tu fianza y actualiza tu carné de agente aduanero.',
     'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Arts. 74 al 85) y Ley Nacional de Aduanas.'),
    (3, 'Apoderados Especiales Aduaneros',
     'Personas individuales designadas mediante mandato especial por un agente aduanero o por un '
     'importador/exportador para realizar operaciones aduaneras determinadas, acreditadas con '
     'garantía y carné vigente ante el servicio aduanero.',
     'Habilita tu mandato, acredita tu garantía y gestiona tu carné de apoderado especial '
     'aduanero.',
     'CAUCA IV (Arts. 18 al 28) y RECAUCA IV (Arts. 86 al 90, Apoderados Especiales Aduaneros).'),
    (3, 'Depósitos Aduaneros',
     'Personas jurídicas autorizadas para almacenar mercancías bajo control aduanero: Depósitos '
     'Aduaneros Temporales (DAT), Almacenes Generales de Depósito (AGD) y almacenes fiscales, sujetos '
     'a habilitación, garantía y control de inventarios.',
     'Solicita tu habilitación, acredita tu fianza y opera tu depósito aduanero bajo control de la '
     'SAT.',
     'Decreto 1236 (Ley de Almacenes Generales de Depósito), RECAUCA IV (Arts. 116 al 130) y '
     'CAUCA IV.'),
    (3, 'Empresas de Entrega Rápida o Courier',
     'Empresas autorizadas para prestar el servicio de entrega rápida o courier, mediante el cual '
     'transportan y desaduanan envíos de importación y exportación bajo un régimen aduanero '
     'simplificado de despacho.',
     'Habilítate y opera como empresa courier bajo el régimen de envíos de entrega rápida.',
     'CAUCA IV y RECAUCA IV (Arts. 574 al 596, Régimen de Envíos de Entrega Rápida o Courier).'),
    (3, 'Transportistas Aduaneros',
     'Empresas de transporte autorizadas para movilizar mercancías hacia recintos aduaneros y en '
     'tránsito aduanero, obligadas a operar con manifiestos de carga, marchamo electrónico y equipo '
     'habilitado.',
     'Habilita tu flota, gestiona tus manifiestos de carga y opera el marchamo electrónico.',
     'CAUCA IV (Arts. 18 al 28), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Ley '
     'Nacional de Aduanas.'),
    (2, 'Regímenes Territoriales y Zonas Especiales',
     'Empresas y parques industriales que operan bajo regímenes aduaneros liberatorios o de fomento '
     'con suspensión y exención arancelaria: Maquilas (Decreto 29-89) y Zonas de Desarrollo '
     'Económico Especial Público (ZDEEP).',
     'Habilitación ZDEEP, importación con suspensión arancelaria y liquidación de cuentas corrientes '
     'bajo el Dto. 29-89.',
     'Decreto 29-89 (Ley de Maquilas), Decreto 22-73 (ZOLIC/ZDEEP) y normativa aduanera aplicable.'),
    (3, 'Maquilas (Decreto 29-89)',
     'Empresas autorizadas bajo la Ley de Fomento y Desarrollo de la Actividad Exportadora y de '
     'Maquila que importan insumos con suspensión de aranceles para transformarlos y exportar el '
     'producto final, operando con cuenta corriente y fianza.',
     'Habilita tu empresa maquiladora, administra tu cuenta corriente y libera tu fianza.',
     'Decreto 29-89 (Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila) y su '
     'Reglamento.'),
    (3, 'Zonas de Desarrollo Económico Especial Público (ZDEEP)',
     'Entidades administradoras y empresas usuarias calificadas que operan dentro de Zonas de '
     'Desarrollo Económico Especial Público, con beneficios aduaneros y fiscales para la actividad '
     'industrial y de servicios.',
     'Califícate como administrador o empresa usuaria ZDEEP y opera con incentivos bajo control '
     'aduanero.',
     'Decreto 22-73 (Ley Orgánica de ZOLIC / ZDEEP), CAUCA IV y RECAUCA IV.'),

    # --------------------------------------------------------- PROFESIONALES
    (1, 'Profesionales',
     'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen '
     'liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y '
     'notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), '
     'peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
     'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
     'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), '
     'Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código '
     'Tributario (Art. 57 "A" y 112).'),
    (2, 'Abogados y Notarios',
     'Profesionales del derecho colegiados activos autorizados para la fe pública notarial, venta y '
     'razón de timbres fiscales, papel sellado de protocolos y traspasos vehiculares electrónicos '
     '(TEV).',
     'Compra de papel de protocolo, razones de timbres, formalización de traspasos en línea TEV y '
     'avisos notariales.',
     'Código de Notariado (Decreto 314), Ley de Timbres Fiscales (Decreto 37-92) y Ley del ISCV '
     '(Decreto 70-94).'),
    (2, 'Peritos Contadores',
     'Técnicos contables acreditados ante la SAT facultados para llevar registros de contabilidad, '
     'autorizar libros electrónicos (LET) y firmar declaraciones juradas tributarias.',
     'Registro de contadores, habilitación del Libro Electrónico Tributario (LET) y administración '
     'de obligaciones contables.',
     'Decreto 2450 (Normas de la Profesión Contable), Código de Comercio (Arts. 368 al 381) y '
     'Código Tributario (Arts. 112 y 120).'),
    (2, 'Auditores',
     'Contadores Públicos y Auditores (CPA) colegiados activos facultados para emitir dictámenes '
     'periciales de devolución de crédito fiscal a exportadores, auditorías tributarias y estados '
     'financieros.',
     'Inscripción registral de firmas de CPA y emisión de dictámenes vinculantes para devolución de '
     'crédito fiscal.',
     'Ley de Colegiación Profesional Obligatoria (Decreto 72-2001) y Ley del IVA (Decreto 27-92, '
     'Art. 25 bis).'),
    (2, 'Gestores Tributarios',
     'Personas autorizadas formalmente con gafete institucional para representar a terceros en la '
     'realización presencial de expedientes ante agencias tributarias y aduaneras.',
     'Emisión y renovación de gafetes oficiales de gestor, reposición y consulta del padrón activo '
     'institucional.',
     'Código Tributario (Decreto 6-91, Art. 22) y Normativa de Acreditación de Gestores de la SAT.'),
    (2, 'Servicios Profesionales',
     'Profesionales liberales e independientes que prestan servicios técnicos, científicos, '
     'jurídicos o de salud por honorarios, afectos a retenciones del IVA e ISR y actualización '
     'registral.',
     'Facturación FEL por honorarios, formularios en Declaraguate, consultas vinculantes y '
     'retenciones tributarias.',
     'Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Código Tributario (Arts. 102 al '
     '105).'),

    # --------------------------------------------------------- ENTES EXENTOS
    (1, 'Entes Exentos',
     'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y '
     'organizaciones de la sociedad civil que, por mandato constitucional o ley específica '
     'ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio '
     'nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones '
     'sin fines de lucro, municipalidades y ministerios de Estado.',
     'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
     'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA '
     '(Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código '
     'Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'),
    (2, 'Entidades del Estado',
     'Ministerios, secretarías, organismos de Estado, dependencias públicas y entidades '
     'descentralizadas que operan como agentes de retención oficial del IVA e ISR y administran '
     'parque vehicular institucional.',
     'Unidades ejecutoras en el RTU, constancias de retención en compras públicas y control '
     'vehicular oficial.',
     'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA, Ley de Contrataciones del Estado '
     '(Decreto 57-92) y Código Tributario.'),
    (2, 'Constitucionales',
     'Entidades con exención total de tributos reconocida expresamente en la Constitución Política: '
     'centros educativos, universidades, comunidades religiosas, misiones diplomáticas y '
     'confederaciones deportivas.',
     'Acreditación de exenciones constitucionales, emisión de constancias electrónicas y registro en '
     'RTU.',
     'Constitución Política de la República (Arts. 37, 73, 88 y 92), Ley del IVA (Art. 8) y Código '
     'Tributario (Art. 62).'),
    (3, 'Centros Educativos y Universidades (Arts. 73 y 88)',
     'Centros educativos privados y universidades que gozan de exención del IVA y de otros tributos '
     'por mandato de los artículos 73 y 88 de la Constitución, previa acreditación de su personería '
     'jurídica y fines educativos ante la SAT.',
     'Acredita tu exención constitucional y obtén tus constancias electrónicas.',
     'Constitución Política de la República (Arts. 73 y 88), Ley del IVA (Dto. 27-92, Art. 8) y '
     'Código Tributario (Art. 62).'),
    (3, 'Iglesias y Deporte Federado (Arts. 37 y 92)',
     'Comunidades religiosas y entidades del deporte federado que gozan de exención de impuestos '
     'conforme a los artículos 37 y 92 de la Constitución, acreditadas mediante personería jurídica '
     'y reconocimiento ante la SAT.',
     'Registra tu comunidad religiosa o entidad deportiva y gestiona su exención.',
     'Constitución Política de la República (Arts. 37 y 92), Código Civil (personería jurídica) y '
     'Código Tributario (Art. 62).'),
    (2, 'No Lucrativos',
     'Organizaciones No Gubernamentales (ONGs), fundaciones benéficas y asociaciones civiles sin '
     'fines de lucro con exención formal calificada ante la SAT para fines sociales y de desarrollo.',
     'Solicitud formal de exención de ISR, actualización de directivas en el RTU y constancias '
     'tributarias.',
     'Ley de ONGs para el Desarrollo (Decreto 02-2003), Ley de Actualización Tributaria (Decreto '
     '10-2012, Art. 11) y Ley del IVA.'),
    (2, 'Municipalidades',
     'Las 340 corporaciones municipales autónomas de Guatemala, mancomunidades y empresas '
     'municipales prestadoras de servicios públicos comunitarios.',
     'Registro de autoridades y tesoreros en el RTU, solvencias municipales y exención del ISCV para '
     'flotillas ediles.',
     'Constitución Política (Art. 257), Código Municipal (Decreto 12-2002) y Ley del ISCV (Decreto '
     '70-94).'),
    (2, 'Decreto',
     'Entidades beneficiarias de incentivos y exenciones tributarias específicas aprobadas mediante '
     'decretos legislativos ordinarios del Congreso: cooperativas, partidos políticos, donaciones '
     'oficiales y fomento sectorial.',
     'Gestión de exenciones por ley ordinaria, despacho aduanero de donaciones y constancias '
     'oficiales.',
     'Ley General de Cooperativas (Decreto 82-78), Ley Electoral y de Partidos Políticos (Decreto '
     '1-85) y decretos de fomento.'),
    (3, 'Cooperativas, Partidos Políticos y Exenciones Especiales',
     'Cooperativas, partidos políticos y otras entidades beneficiarias de exenciones tributarias '
     'otorgadas por leyes ordinarias, sujetas a reconocimiento y control de vigencia ante la SAT.',
     'Gestiona la exención por ley especial de tu cooperativa, partido político o entidad.',
     'Ley General de Cooperativas (Dto. 82-78), Ley Electoral y de Partidos Políticos (Dto. 1-85) y '
     'decretos de exención específicos.'),
    (3, 'Misiones Diplomáticas y Organismos Internacionales',
     'Representaciones diplomáticas, consulares y organismos internacionales acreditados en '
     'Guatemala que solicitan el reconocimiento de sus exenciones tributarias conforme al derecho '
     'internacional y a los convenios de sede vigentes.',
     'Solicita el reconocimiento de exenciones y gestiona tus constancias como misión u organismo '
     'acreditado.',
     'Convención de Viena sobre Relaciones Diplomáticas (1961), convenios de sede suscritos por '
     'Guatemala y Código Tributario (Art. 62).'),
]

assert len(ACTORES) == 40, f'Se esperaban 40 actores, hay {len(ACTORES)}'

THIN = Side(style='thin', color='00B7C3D0')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def build():
    wb = openpyxl.load_workbook(EXCEL_PATH)
    for old in OLD_SHEETS:
        if old in wb.sheetnames:
            del wb[old]
    if SHEET_NAME in wb.sheetnames:
        del wb[SHEET_NAME]
    ws = wb.create_sheet(SHEET_NAME)

    for col, width in WIDTHS.items():
        ws.column_dimensions[col].width = width

    for i, header in enumerate(HEADERS, start=1):
        c = ws.cell(row=1, column=i, value=header)
        c.font = Font(name='Segoe UI', sz=10, bold=True)
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        c.border = BORDER

    for r, (nivel, nombre, que_es, lead, base) in enumerate(ACTORES, start=2):
        for col, value in enumerate([r - 1, f'Nivel {nivel}', nombre, que_es, lead, base], start=1):
            c = ws.cell(row=r, column=col, value=value)
            c.font = Font(name='Segoe UI', sz=9)
            c.alignment = Alignment(
                horizontal='center' if col <= 2 else 'left',
                vertical='top' if col > 2 else 'center',
                wrap_text=True,
            )
            c.border = BORDER

    ws.freeze_panes = 'A2'
    wb.save(EXCEL_PATH)
    print(f'Hoja "{SHEET_NAME}": {len(ACTORES)} filas (2:{len(ACTORES) + 1}).')
    print('Hojas:', wb.sheetnames)


if __name__ == '__main__':
    build()
