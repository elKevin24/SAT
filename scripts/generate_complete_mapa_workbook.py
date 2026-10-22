import json
import zipfile
import os
from xml.sax.saxutils import escape

# 1. Cargar allTramites.json
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

TOTAL_PORTAL = len(all_data) # 714

def safe_int(v, default=99):
    if v is None: return default
    s = str(v).strip()
    return int(s) if s.isdigit() else default

# Diccionario Nivel 1
N1_DATA = [
    {
        'no': 1,
        'nombre': 'Contribuyentes',
        'que_es': 'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.',
        'lead_text': 'Información y servicios tributarios para personas y empresas.',
        'base_juridica': 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'
    },
    {
        'no': 2,
        'nombre': 'Operadores de Comercio Exterior',
        'que_es': 'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.',
        'lead_text': 'Servicios e información aduanera para la importación, exportación y logística.',
        'base_juridica': 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
    },
    {
        'no': 3,
        'nombre': 'Profesionales',
        'que_es': 'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
        'lead_text': 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
        'base_juridica': 'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 "A" y 112).'
    },
    {
        'no': 4,
        'nombre': 'Entes Exentos',
        'que_es': 'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.',
        'lead_text': 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
        'base_juridica': 'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'
    }
]

# N2 Data Dictionary
N2_DESCRIPTIONS = {
    ('Contribuyentes', 'Sin Obligaciones'): {
        'que_es': 'Personas individuales que no realizan actividades económicas mercantiles pero requieren identificación tributaria para actos civiles, contratos, trámites notariales o apertura de cuentas bancarias.',
        'lead_text': 'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia sin movimientos comerciales.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
    },
    ('Contribuyentes', 'Pequeños Contribuyentes'): {
        'que_es': 'Régimen tributario simplificado para personas individuales o jurídicas con tarifa definitiva 5% de IVA sin crédito fiscal conforme al límite de ley, así como productores agropecuarios del sector primario.',
        'lead_text': 'Facturación electrónica FEL, declaraciones mensuales del 5%, régimen electrónico y facilidades para el sector primario.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 45 al 50), Decreto 7-2019 (Régimen Electrónico) y Decreto 31-2024 (Sector Primario y Agropecuario).'
    },
    ('Contribuyentes', 'Contribuyente General'): {
        'que_es': 'Personas individuales y jurídicas afectas a las obligaciones tributarias generales del IVA (12%) e ISR (Actividades Lucrativas, Rentas del Capital y del Trabajo), administración del Registro Fiscal de Vehículos, facturación electrónica FEL y solvencia fiscal.',
        'lead_text': 'Declaraciones periódicas, facturación digital FEL, RTU Digital, traspasos vehiculares y pago de impuestos.',
        'base_juridica': 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012) y Ley del ISCV (Dto. 70-94).'
    },
    ('Contribuyentes', 'Contribuyentes Especiales'): {
        'que_es': 'Empresas calificadas por resolución de la SAT como Grandes o Medianos Contribuyentes Especiales, sujetas a control exhaustivo, atención diferenciada en gerencias especiales, retenciones de IVA/ISR y precios de transferencia.',
        'lead_text': 'Servicios y gestiones tributarias para empresas con atención diferenciada en gerencias especiales.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 120), Ley del IVA (Decreto 27-92) y resoluciones normativas de la SAT.'
    },
    ('Operadores de Comercio Exterior', 'Importadores'): {
        'que_es': 'Personas individuales o jurídicas autorizadas en el padrón aduanero para ingresar legalmente mercancías al país para su consumo o transformación, tramitando DUCAs, clasificación arancelaria y desaduanamiento.',
        'lead_text': 'Padrón de importadores habituales, declaración DUCA-D, aranceles SAC y nacionalización de mercancías.',
        'base_juridica': 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
    },
    ('Operadores de Comercio Exterior', 'Exportadores'): {
        'que_es': 'Personas o empresas registradas para enviar mercancías nacionales o nacionalizadas al mercado centroamericano e internacional, gozando de exención de IVA en exportaciones y derecho a devolución de crédito fiscal.',
        'lead_text': 'Registro de exportadores, declaración DUCA-F y DUCA-T, y devolución de crédito fiscal a exportadores.',
        'base_juridica': 'CAUCA IV, RECAUCA, Ley del IVA (Decreto 27-92, Arts. 23 al 25) y Decretos de Fomento a Exportaciones.'
    },
    ('Operadores de Comercio Exterior', 'Operador Económico Autorizado (OEA)'): {
        'que_es': 'Actores de la cadena de suministro internacional certificados por SAT por cumplir estándares de seguridad aduanera y solvencia fiscal, con beneficios de despacho ágil y canales prioritarios.',
        'lead_text': 'Habilitación, certificación y beneficios de facilitación aduanera para empresas seguras y confiables.',
        'base_juridica': 'Marco SAFE de la OMA, CAUCA IV (Art. 34) y normativa institucional de la SAT para el programa OEA.'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)'): {
        'que_es': 'Personas o empresas autorizadas por la SAT para actuar como intermediarios o custodios aduaneros: agentes de aduanas, apoderados aduaneros, transportistas aduaneros y depósitos aduaneros.',
        'lead_text': 'Habilitación y operaciones para Agentes Aduaneros, Transportistas, Depósitos y demás auxiliares.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 28), RECAUCA (Arts. 52 al 150) y Ley Nacional de Aduanas.'
    },
    ('Operadores de Comercio Exterior', 'Regímenes Territoriales y Zonas Especiales'): {
        'que_es': 'Empresas y polígonos que operan bajo regímenes aduaneros y tributarios diferenciados con suspensión o exención de tributos, como Maquilas (Decreto 29-89), Zonas Francas y ZDEEP.',
        'lead_text': 'Gestión operativa y aduanera para maquilas (Dto. 29-89), zonas francas y ZDEEP.',
        'base_juridica': 'Ley de Fomento a la Actividad Exportadora y Maquila (Dto. 29-89), Ley de Zonas Francas (Dto. 65-89) y Ley ZDEEP.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales'): {
        'que_es': 'Marco normativo arancelario, consultas técnicas de clasificación, convenios comerciales, prevención de contrabando, valoración aduanera e infraestructura y modernización de puertos y aduanas.',
        'lead_text': 'Arancel Centroamericano (SAC), consultas técnicas de criterio arancelario, COINCON y convenios comerciales.',
        'base_juridica': 'Convenio sobre el Régimen Arancelario y Aduanero Centroamericano, CAUCA IV, RECAUCA y Código Tributario.'
    },
    ('Profesionales', 'Abogados y Notarios'): {
        'que_es': 'Profesionales del derecho que dan fe pública en actos traslativos de dominio vehicular, contratos mercantiles y compraventas notariales, autorizados para el sistema de Traspaso Electrónico (e-Traspaso).',
        'lead_text': 'Papel sellado de protocolo, compra y registro de timbres notariales, y autorización de traspasos vehiculares electrónicos.',
        'base_juridica': 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales (Decreto 37-92) y normativa del Registro Fiscal de Vehículos.'
    },
    ('Profesionales', 'Peritos Contadores'): {
        'que_es': 'Técnicos y profesionales facultados para llevar la contabilidad formal de personas individuales y jurídicas, firmar estados financieros y actuar como contadores registrados ante la SAT.',
        'lead_text': 'Inscripción y actualización en el registro de peritos contadores, asignación a contribuyentes y libros contables.',
        'base_juridica': 'Decreto 2450 (Normas de la Profesión de Contador) y Código Tributario (Arts. 112 y 120).'
    },
    ('Profesionales', 'Auditores'): {
        'que_es': 'Contadores Públicos y Auditores (CPA) colegiados activos facultados para emitir dictámenes sobre estados financieros, dictámenes de crédito fiscal de IVA para exportadores y peritajes contables.',
        'lead_text': 'Habilitación para dictámenes de crédito fiscal de IVA para exportadores y auditorías tributarias especiales.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria (Dto. 72-2001) y Ley del IVA (Decreto 27-92, Art. 23 "A").'
    },
    ('Profesionales', 'Gestores Tributarios'): {
        'que_es': 'Personas autorizadas y acreditadas institucionalmente ante la SAT para realizar gestiones en representación de terceros mediante carné oficial y cumplimiento de requisitos de transparencia.',
        'lead_text': 'Acreditación, evaluación, renovación y carné institucional para la realización de gestiones tributarias de terceros.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 22 - Representación) y normativas de acreditación institucional de la SAT.'
    },
    ('Profesionales', 'Servicios Profesionales'): {
        'que_es': 'Profesionales liberales de todas las ramas (médicos, ingenieros, arquitectos, consultores) que prestan servicios técnicos o científicos independientes y facturan honorarios profesionales.',
        'lead_text': 'Facturación FEL por honorarios, retenciones de ISR profesional, deducciones aplicables y cumplimiento tributario.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Rentas de Actividades Lucrativas y Trabajo) y Ley del IVA.'
    },
    ('Entes Exentos', 'Entidades del Estado'): {
        'que_es': 'Organismos del Estado, ministerios, secretarías, dependencias públicas y entidades autónomas o descentralizadas sujetas a exención objetiva y mecanismos de retención y control presupuestario.',
        'lead_text': 'Registro de instituciones públicas en RTU, constancias de retención, flota vehicular estatal y control fiscal.',
        'base_juridica': 'Constitución Política (Art. 135), Ley Orgánica del Presupuesto (Decreto 101-97) y Ley del IVA (Art. 8).'
    },
    ('Entes Exentos', 'Constitucionales'): {
        'que_es': 'Instituciones beneficiadas con exención directa por mandato de la Constitución Política: centros educativos, universidades privadas y USAC (Arts. 73 y 88), iglesias (Art. 37) y CDAG/COI (Art. 92).',
        'lead_text': 'Reconocimiento y gestión de exenciones constitucionales para colegios, universidades, iglesias y deporte federado.',
        'base_juridica': 'Constitución Política de la República de Guatemala (Arts. 37, 73, 88 y 92) y Ley del IVA (Art. 8).'
    },
    ('Entes Exentos', 'No Lucrativos'): {
        'que_es': 'Asociaciones civiles, fundaciones benéficas, comités, ONGs y cooperativas inscritas como personas jurídicas no lucrativas que destinan su patrimonio exclusivamente a fines sociales o comunitarios.',
        'lead_text': 'Inscripción en RTU, obtención de solvencia de exención, emisión de constancias electrónicas de exención y donaciones.',
        'base_juridica': 'Ley de ONGs para el Desarrollo (Decreto 02-2003), Código Civil y Ley del Impuesto Sobre la Renta.'
    },
    ('Entes Exentos', 'Municipalidades'): {
        'que_es': 'Gobiernos locales y municipalidades de la República que gozan de exención tributaria integral en bienes e ingresos para el cumplimiento de sus competencias autónomas descentralizadas.',
        'lead_text': 'Constancias de exención del IVA (CIVA), gestión de flota vehicular edilicia y coordinación tributaria municipal.',
        'base_juridica': 'Constitución Política (Art. 257), Código Municipal (Decreto 12-2002) y Ley del Impuesto al Valor Agregado.'
    },
    ('Entes Exentos', 'Decreto'): {
        'que_es': 'Entidades beneficiadas con exención por leyes específicas u ordinarias del Congreso: misiones diplomáticas, organismos internacionales, acuerdos bilaterales y donaciones de ayuda humanitaria.',
        'lead_text': 'Gestión de exenciones para embajadas, diplomáticos, organismos internacionales de cooperación y donaciones oficiales.',
        'base_juridica': 'Convenios Internacionales de Viena sobre Relaciones Diplomáticas, Decretos del Congreso de exención y Ley del IVA.'
    }
}

# Diccionario curado para los 62 nodos de Nivel 3
N3_DESCRIPTIONS = {
    ('Contribuyentes', 'Sin Obligaciones', '—'): {
        'que_es': 'Identificación tributaria oficial para personas individuales no afectas a actividades comerciales: inscripción de primer NIT, actualización de residencia y constancias sin movimientos fiscales.',
        'lead_text': 'Gestiones y servicios de identificación tributaria para personas sin actividad comercial.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
    },
    ('Contribuyentes', 'Pequeños Contribuyentes', 'Régimen de Pequeño Contribuyente'): {
        'que_es': 'Régimen tributario simplificado de tarifa definitiva 5% de IVA mensual sin crédito fiscal para personas individuales o jurídicas conforme al límite legal de facturación anual del régimen simplificado.',
        'lead_text': 'Requisitos, pasos y documentos para solicitar tu Número de Identificación Tributaria (NIT) en línea e inscribirte al Régimen.',
        'base_juridica': 'Decreto 27-92 (Ley del IVA, Arts. 45 al 50) y Decreto 7-2019 (Ley de Simplificación Tributaria).'
    },
    ('Contribuyentes', 'Pequeños Contribuyentes', 'Régimen Agropecuario y Productores'): {
        'que_es': 'Régimen especial simplificado para pequeños productores del sector primario y agropecuario, con facilidades de comercialización, facturación electrónica y retención definitiva.',
        'lead_text': 'Requisitos, pasos y documentos para confirmar tus datos en el registro de productores y formalizar operaciones agrícolas.',
        'base_juridica': 'Decreto 27-92 (Ley del IVA) y Decreto 31-2024 (Ley de Fortalecimiento del Sector Primario).'
    },
    ('Contribuyentes', 'Contribuyente General', 'Inscripción y actualización en el RTU'): {
        'que_es': 'Procedimientos de enrolamiento, asignación de NIT, actualización periódica de domicilio fiscal, modificación de actividades económicas, altas de establecimientos y cese de operaciones en el Registro Tributario Unificado.',
        'lead_text': 'Actualiza tus datos en el RTU Digital, modifica tus actividades económicas y administra tus accesos en la Agencia Virtual.',
        'base_juridica': 'Código Tributario, Decreto 6-91 (Arts. 112 y 120) y Acuerdo de Directorio SAT 08-2020.'
    },
    ('Contribuyentes', 'Contribuyente General', 'Facturación electrónica y documentos tributarios'): {
        'que_es': 'Habilitación como emisor de Factura Electrónica en Línea (FEL), autorización de resoluciones para notas de crédito/débito, administración de documentos tributarios e imprentas autorizadas.',
        'lead_text': 'Habilítate como emisor FEL gratuito, autoriza tus formatos de documentos y administra tus comprobantes fiscales digitales.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 29 y 29 "A") y Acuerdo de Directorio SAT 13-2018 (Régimen FEL).'
    },
    ('Contribuyentes', 'Contribuyente General', 'Declaraciones, pagos y solvencias'): {
        'que_es': 'Presentación periódica de declaraciones tributarias mediante Declaraguate, emisión de boletas SAT-2000, pago electrónico por BancaSAT, solicitud de facilidades y obtención de solvencia fiscal.',
        'lead_text': 'Llena tus formularios oficiales en Declaraguate, genera tu boleta SAT-2000 y paga electrónicamente desde BancaSAT.',
        'base_juridica': 'Código Tributario, Decreto 6-91 del Congreso de la República (Arts. 40 y 57 "A").'
    },
    ('Contribuyentes', 'Contribuyente General', 'Devoluciones y créditos fiscales'): {
        'que_es': 'Procedimientos administrativos y electrónicos para la devolución de pagos en exceso o indebidos, acreditamiento y reintegro del crédito fiscal del Impuesto al Valor Agregado.',
        'lead_text': 'Solicita la devolución de pagos en exceso o indebidos y tramita el reintegro de créditos fiscales del IVA.',
        'base_juridica': 'Decreto 27-92 del Congreso de la República (Ley del Impuesto al Valor Agregado) y Código Tributario.'
    },
    ('Contribuyentes', 'Contribuyente General', 'Regímenes tributarios'): {
        'que_es': 'Orientación, afiliación y cambio entre los distintos regímenes del Impuesto Sobre la Renta (Sobre las Utilidades de Actividades Lucrativas, Opcional Simplificado sobre Ingresos y Rentas de Capital).',
        'lead_text': 'Conoce los regímenes de ISR e IVA, calcula tus obligaciones y gestiona cambios de afiliación tributaria.',
        'base_juridica': 'Decreto 10-2012 (Ley de Actualización Tributaria, Libro I - Impuesto Sobre la Renta).'
    },
    ('Contribuyentes', 'Contribuyente General', 'Vehículos (como propietario)'): {
        'que_es': 'Gestión integral del parque vehicular en el Registro Fiscal de Vehículos: pago del ISCV, solicitud de primeras placas, traspasos electrónicos notariales, modificaciones de características y reposición de placas.',
        'lead_text': 'Paga tu calcomanía ISCV, tramita primeras placas, realiza traspasos con notario y repón distintivos extraviados.',
        'base_juridica': 'Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos (Decreto 70-94) y Código Tributario.'
    },
    ('Contribuyentes', 'Contribuyente General', 'Servicios y gestiones al contribuyente'): {
        'que_es': 'Canales de atención presencial y virtual, agendamiento de citas en oficinas tributarias, verificadores de autenticidad de documentos con código QR y constancias de colegiados activos.',
        'lead_text': 'Agenda tu cita en agencias tributarias, solicita tu solvencia fiscal con código QR y consulta el estado de tus gestiones.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 57 "A") y Ley Orgánica de la SAT (Decreto 1-98).'
    },
    ('Contribuyentes', 'Contribuyente General', 'Cultura tributaria y capacitación'): {
        'que_es': 'Programas institucionales de formación cívico-tributaria y aduanera, cursos virtuales gratuitos, guías didácticas para contribuyentes y talleres de actualización normativa.',
        'lead_text': 'Participa en cursos virtuales gratuitos, seminarios web y talleres de capacitación tributaria y aduanera.',
        'base_juridica': 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Política Institucional de Fomento de Cultura Tributaria.'
    },
    ('Contribuyentes', 'Contribuyentes Especiales', 'Gerencias Especiales y Control Tributario'): {
        'que_es': 'Atención especializada en las gerencias de Grandes y Medianos Contribuyentes Especiales para empresas de alta relevancia fiscal sujeta a seguimiento preferente.',
        'lead_text': 'Servicios directos de fiscalización, control intensivo y atención diferenciada en gerencias especiales.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT de Contribuyentes Especiales.'
    },
    ('Contribuyentes', 'Contribuyentes Especiales', 'Declaraciones e Informes Especiales'): {
        'que_es': 'Obligaciones formales específicas para contribuyentes calificados: estudios y declaraciones juradas de precios de transferencia, inventarios semestrales e informes de auditoría externa.',
        'lead_text': 'Presentación de estudios de precios de transferencia, informes periciales y anexos de estados financieros auditados.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Arts. 54 al 67 - Precios de Transferencia).'
    },
    ('Contribuyentes', 'Contribuyentes Especiales', 'Capacitación y Orientación Diferenciada'): {
        'que_es': 'Jornadas de actualización técnica, criterios institucionales vinculantes y mesas de diálogo tributario orientadas a los sectores corporativos e industriales de mayor escala.',
        'lead_text': 'Sesiones especializadas de actualización técnica y normativa para directores financieros y auditores de grandes empresas.',
        'base_juridica': 'Ley Orgánica de la SAT (Decreto 1-98) y convenios de cumplimiento cooperativo.'
    },
    ('Operadores de Comercio Exterior', 'Importadores', 'Registro y Padrón de Importadores'): {
        'que_es': 'Requisitos, pasos y activación en el Padrón de Importadores habituales y no habituales de la SAT para realizar operaciones aduaneras de ingreso de mercancías.',
        'lead_text': 'Activa tu estatus en el Padrón de Importadores, actualiza tu solvencia aduanera y consulta tu historial de despachos.',
        'base_juridica': 'CAUCA IV, RECAUCA y Ley Nacional de Aduanas (Decreto 14-2013).'
    },
    ('Operadores de Comercio Exterior', 'Importadores', 'Declaraciones Aduaneras y DUCAs'): {
        'que_es': 'Elaboración, transmisión electrónica, liquidación tributaria y validación de la Declaración Única Centroamericana en su modalidad DUCA-D para mercancías extrarregionales.',
        'lead_text': 'Transmite tu DUCA-D electrónica, liquida los derechos arancelarios a la importación (DAI) y valida selectivos aduaneros.',
        'base_juridica': 'Resolución COMIECO 409-2018 (Régimen de la DUCA), CAUCA IV y RECAUCA.'
    },
    ('Operadores de Comercio Exterior', 'Importadores', 'Despacho Aduanero, Levante y Selectivo'): {
        'que_es': 'Procesos operativos de selectivo aduanero (verde, amarillo y rojo), reconocimiento físico, escaneo no intrusivo y autorización de levante de mercancías en puertos, aeropuertos y aduanas terrestres.',
        'lead_text': 'Monitorea el resultado del semáforo fiscal, atiende inspecciones físicas o documentales y obtén el levante de carga.',
        'base_juridica': 'CAUCA IV (Arts. 77 al 85) y RECAUCA (Arts. 317 al 356).'
    },
    ('Operadores de Comercio Exterior', 'Importadores', 'Importación y Nacionalización de Vehículos'): {
        'que_es': 'Nacionalización e internación definitiva de vehículos nuevos y usados, cálculo de DAI e IPRIMA conforme a tablas de valores oficiales y asignación de primer distintivo.',
        'lead_text': 'Calcula aranceles e IPRIMA para importación de vehículos, tramita la póliza aduanera y genera primeras placas.',
        'base_juridica': 'Ley del IPRIMA (Decreto 148-85), Ley del ISCV (Decreto 70-94), CAUCA IV y RECAUCA.'
    },
    ('Operadores de Comercio Exterior', 'Importadores', 'Mercancías en Abandono, Depósitos y Franquicias'): {
        'que_es': 'Procedimientos de rescate de mercancías en abandono tácito o expreso, aplicación de franquicias aduaneras diplomáticas y subastas públicas de aduana.',
        'lead_text': 'Consulta listados de mercancías en abandono, tramita franquicias diplomáticas y participa en subastas públicas aduaneras.',
        'base_juridica': 'CAUCA IV (Arts. 116 al 118) y RECAUCA (Arts. 604 al 618).'
    },
    ('Operadores de Comercio Exterior', 'Exportadores', 'Padrón y Registro de Exportadores'): {
        'que_es': 'Habilitación oficial en el padrón aduanero de exportadores de la SAT y vinculación con la Ventanilla Ágil de Exportaciones (VUPE).',
        'lead_text': 'Inscríbete como exportador, enlaza tu registro con VUPE y gestiona tus autorizaciones de despacho internacional.',
        'base_juridica': 'CAUCA IV, RECAUCA y Ley de Fomento a las Exportaciones.'
    },
    ('Operadores de Comercio Exterior', 'Exportadores', 'Declaraciones Aduaneras y Embarques'): {
        'que_es': 'Emisión de la Declaración Única Centroamericana para mercancías intrarregionales (DUCA-F) y de exportación extrarregional, despacho aduanero y control de embarque.',
        'lead_text': 'Emite declaraciones DUCA-F y autorizaciones de embarque marítimo, aéreo y terrestre hacia mercados internacionales.',
        'base_juridica': 'Resolución COMIECO 409-2018 y CAUCA IV.'
    },
    ('Operadores de Comercio Exterior', 'Exportadores', 'Devolución de Crédito Fiscal'): {
        'que_es': 'Mecanismos especiales y electrónicos para el reintegro ágil del crédito fiscal del IVA soportado en la adquisición de insumos para productos exportados (Régimen General, Especial y Optativo).',
        'lead_text': 'Solicita la devolución de crédito fiscal a exportadores en cuenta corriente tributaria o mediante régimen optativo.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis) y normativas de devolución ágil de la SAT.'
    },
    ('Operadores de Comercio Exterior', 'Operador Económico Autorizado (OEA)', '—'): {
        'que_es': 'Certificación integral OEA para importadores, exportadores y auxiliares logísticos que acreditan seguridad en su cadena logística, con carriles exclusivos de despacho y prioridad de atención aduanera.',
        'lead_text': 'Certifícate como Operador Económico Autorizado (OEA) y accede a carriles rápidos y acuerdos de reconocimiento mutuo.',
        'base_juridica': 'Marco SAFE de la OMA, CAUCA IV (Art. 34) y normativa institucional de la SAT para el programa OEA.'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)', 'Agentes Aduaneros'): {
        'que_es': 'Inscripción, habilitación y fiscalización de agentes aduaneros individuales autorizados para actuar en despacho aduanero por cuenta de terceros.',
        'lead_text': 'Guía normativa y procedimental para la inscripción, autorización inicial de operaciones y registro en el padrón aduanero de la SAT.',
        'base_juridica': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)', 'Apoderados Especiales Aduaneros'): {
        'que_es': 'Acreditación de empleados dependientes de empresas importadoras/exportadoras para tramitar el despacho aduanero exclusivo de su representada.',
        'lead_text': 'Procedimiento normativo para registrar mandatos especiales aduaneros, habilitar firma autorizada y emitir acreditación ante SAT.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 86 al 90, Apoderados Especiales Aduaneros).'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)', 'Depósitos Aduaneros'): {
        'que_es': 'Habilitación, supervisión y auditoría de recintos fiscales públicos y privados para el almacenamiento temporal de mercancías bajo control aduanero con suspensión de tributos.',
        'lead_text': 'Requisitos normativos para delimitar perímetros, equipamiento y habilitación inicial de recintos aduaneros temporales.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 119 al 129, Régimen de Depósito Aduanero o Fiscal).'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)', 'Empresas de Entrega Rápida o Courier'): {
        'que_es': 'Registro y control aduanero de empresas de mensajería internacional express para el despacho simplificado de envíos postales urgentes y compras por internet.',
        'lead_text': 'Autorización y despacho ágil de paquetes internacionales express y envíos urgentes bajo régimen courier.',
        'base_juridica': 'CAUCA IV y RECAUCA IV (Arts. 574 al 596, Régimen de Envíos de Entrega Rápida o Courier).'
    },
    ('Operadores de Comercio Exterior', 'Auxiliares de la Función Pública Aduanera (AFPA)', 'Transportistas Aduaneros'): {
        'que_es': 'Registro de empresas y medios de transporte terrestre, aéreo y marítimo para el traslado internacional e interno de mercancías bajo control y precintos aduaneros.',
        'lead_text': 'Inscripción de medios de transporte aduanero, habilitación de conductores y registro de precintos fiscales.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 28), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Ley de Aduanas.'
    },
    ('Operadores de Comercio Exterior', 'Regímenes Territoriales y Zonas Especiales', 'Maquilas (Decreto 29-89)'): {
        'que_es': 'Régimen aduanero y fiscal de perfeccionamiento activo con suspensión de DAI e IVA para materias primas e insumos destinados a exportación fuera de Centroamérica.',
        'lead_text': 'Gestión de pólizas de importación temporal, descargos de materias primas y cumplimiento de obligaciones bajo Decreto 29-89.',
        'base_juridica': 'Decreto 29-89 (Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila).'
    },
    ('Operadores de Comercio Exterior', 'Regímenes Territoriales y Zonas Especiales', 'Zonas de Desarrollo Económico Especial Público (ZDEEP)'): {
        'que_es': 'Instalación y operación de empresas usuarias e industrias en polígonos delimitados ZDEEP con incentivos de exención de ISR y suspensión arancelaria administradas por ZOLIC.',
        'lead_text': 'Inscripción de usuarios ZDEEP, habilitación de polígonos industriales y control aduanero de mercancías en zonas francas.',
        'base_juridica': 'Decreto 22-73 (Ley Orgánica de ZOLIC / ZDEEP), CAUCA IV y RECAUCA IV.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales', 'Arancel Centroamericano (SAC) y Permisos'): {
        'que_es': 'Estructura arancelaria oficial, clasificación de mercancías, notas de capítulo SAC, gravámenes DAI aplicables y requisitos no arancelarios de ministerios reguladores.',
        'lead_text': 'Consulta el Sistema Arancelario Centroamericano (SAC), tarifas arancelarias vigentes y permisos no arancelarios exigibles.',
        'base_juridica': 'Convenio sobre el Régimen Arancelario y Aduanero Centroamericano (SAC) y Ley de Aduanas.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales', 'Acuerdos Comerciales y Facilitación'): {
        'que_es': 'Tratados de libre comercio vigentes, normas de origen, certificados de origen preferenciales y medidas de facilitación del comercio internacional de la OMC.',
        'lead_text': 'Aplica preferencias arancelarias de tratados de libre comercio, valida certificados de origen y acuerdos de facilitación.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 28), Tratados de Libre Comercio suscritos por Guatemala y Acuerdos de la OMC.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales', 'Prevención de Contrabando y Defraudación'): {
        'que_es': 'Mecanismos de control aduanero interinstitucional, puestos de control fronterizo, denuncias en COINCON y combate al comercio ilícito y defraudación aduanera.',
        'lead_text': 'Denuncia actos de contrabando ante la COINCON y consulta operativos de puestos de control interinstitucional (PCI).',
        'base_juridica': 'Ley Contra la Defraudación y el Contrabando Aduaneros (Decreto 58-90) y Código Tributario.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales', 'Consultas Técnicas, Recursos y Valoración'): {
        'que_es': 'Criterios vinculantes de clasificación arancelaria previa, métodos de valoración aduanera según Acuerdo de la OMC y recursos de revocatoria aduanera.',
        'lead_text': 'Solicita criterios técnicos anticipados de clasificación arancelaria y resolución de discrepancias en valoración.',
        'base_juridica': 'Acuerdo de Valoración de la OMC, CAUCA IV y RECAUCA.'
    },
    ('Operadores de Comercio Exterior', 'Normativa y Operaciones Aduaneras Generales', 'Modernización e Infraestructura Aduanera'): {
        'que_es': 'Proyectos tecnológicos de automatización aduanera, marchamos electrónicos GPS, modernización de aduanas marítimas, terrestres y aéreas e interoperabilidad regional.',
        'lead_text': 'Conoce los proyectos de modernización aduanera, sistemas de trazabilidad y nuevas tecnologías de despacho.',
        'base_juridica': 'Plan Estratégico Institucional de la SAT y normativas aduaneras regionales COMIECO.'
    },
    ('Profesionales', 'Abogados y Notarios', 'Habilitación y Registro Notarial'): {
        'que_es': 'Habilitación, activación de firma electrónica avanzada y enrolamiento de notarios activos en la Agencia Virtual para la autorización de gestiones de fe pública.',
        'lead_text': 'Inscripción y activación notarial en Agencia Virtual para autorización de gestiones con validez jurídica.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 112) y Resoluciones de Seguridad Tecnológica y Biométrica de la SAT.'
    },
    ('Profesionales', 'Abogados y Notarios', 'Timbres Fiscales y Papel Sellado de Protocolo'): {
        'que_es': 'Adquisición de papel sellado especial para protocolos notariales, registro y pago de timbres fiscales digitales y control de especies fiscales para escrituras públicas.',
        'lead_text': 'Compra y autoriza papel sellado para protocolos y adquiere timbres fiscales para contratos y escrituras.',
        'base_juridica': 'Decreto 37-92 (Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos, Arts. 16 al 22).'
    },
    ('Profesionales', 'Abogados y Notarios', 'Traspaso Electrónico Vehicular (e-Traspaso)'): {
        'que_es': 'Plataforma digital para la legalización notarial inmediata del endoso de títulos vehiculares, verificación de identidad con biometría y traspaso de propiedad en línea.',
        'lead_text': 'Autoriza traspasos vehiculares electrónicos con firma electrónica y certificación biométrica en tiempo real.',
        'base_juridica': 'Ley del ISCV (Decreto 70-94) y Acuerdo de Directorio SAT de Implementación del Sistema TEV.'
    },
    ('Profesionales', 'Abogados y Notarios', 'Avisos Notariales y Fe Pública'): {
        'que_es': 'Presentación electrónica de testimonios especiales, avisos de legalización de firmas y avisos notariales obligatorios ante la administración tributaria.',
        'lead_text': 'Remite avisos notariales de transferencias patrimoniales y testimonios notariales exigidos por ley.',
        'base_juridica': 'Código de Notariado (Decreto 314) y Manual de Atención al Contribuyente de la SAT.'
    },
    ('Profesionales', 'Peritos Contadores', 'Habilitación y Registro de Perito Contador'): {
        'que_es': 'Inscripción oficial en el registro de peritos contadores, asignación de acreditación técnica, actualización de datos de colegiación y responsabilidades contables.',
        'lead_text': 'Habilítate como perito contador autorizado, actualiza tus datos y gestiona tus acreditaciones ante la SAT.',
        'base_juridica': 'Decreto 2450 (Normas de la Profesión Contable) y Resoluciones de Agencia Virtual SAT.'
    },
    ('Profesionales', 'Peritos Contadores', 'Consultas, Retenciones y Libros Contables'): {
        'que_es': 'Habilitación de libros de compras y ventas electrónicos, acceso al buzón tributario de clientes asignados y emisión de constancias de retención de IVA e ISR.',
        'lead_text': 'Autoriza libros contables computarizados, administra empresas asignadas y gestiona sistemas de retención.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Art. 47 bis) y Ley de Actualización Tributaria (Decreto 10-2012, Art. 86).'
    },
    ('Profesionales', 'Auditores', 'Habilitación y Registro de Auditor (CPA)'): {
        'que_es': 'Registro institucional de Contadores Públicos y Auditores (CPA) colegiados activos ante la SAT para la emisión de informes de auditoría con fe pública.',
        'lead_text': 'Registro oficial de firmas de auditoría y CPAs individuales para actuación pericial y dictámenes tributarios.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria (Decreto 72-2001) y Código Tributario (Art. 120).'
    },
    ('Profesionales', 'Auditores', 'Dictámenes de Crédito Fiscal y Auditoría'): {
        'que_es': 'Emisión y radicación electrónica de dictámenes de auditoría externa que avalan la procedencia del crédito fiscal del IVA para empresas exportadoras bajo régimen optativo.',
        'lead_text': 'Presenta dictámenes de crédito fiscal de IVA para exportadores y anexos de auditoría tributaria obligatoria.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Art. 25 bis) y Acuerdo de Directorio SAT 07-2007 (Régimen Optativo de Devolución).'
    },
    ('Profesionales', 'Gestores Tributarios', 'Acreditación y Carné Oficial de Gestor'): {
        'que_es': 'Solicitud, evaluación institucional, verificación de antecedentes y emisión del carné oficial de gestor tributario para la representación legítima de contribuyentes.',
        'lead_text': 'Solicita la acreditación oficial, evaluación y expedición del carné institucional ante la SAT para actuar formalmente como gestor de gestiones de terceros.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 22 - Representación) y Manual Institucional de Acreditación de Gestores de la SAT.'
    },
    ('Profesionales', 'Gestores Tributarios', 'Renovación y Gestión de Gafetes'): {
        'que_es': 'Renovación anual de credenciales de gestor, actualización de registros biométricos y control ético y operativo en agencias tributarias de todo el país.',
        'lead_text': 'Renueva tu carné de gestor tributario, actualiza tu vigencia operativa y consulta tu récord de gestiones.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 22 y 94) y Normativa de Control de Gestores Tributarios de la SAT.'
    },
    ('Profesionales', 'Servicios Profesionales', 'Facturación por Honorarios y Formularios'): {
        'que_es': 'Emisión de facturas electrónicas de honorarios profesionales por servicios técnicos, científicos o artísticos y declaración simplificada de ingresos.',
        'lead_text': 'Factura tus honorarios profesionales en FEL, declara tus ingresos y calcula retenciones aplicables.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 106) y Ley de Actualización Tributaria (Decreto 10-2012, Libro I).'
    },
    ('Profesionales', 'Servicios Profesionales', 'Actualización de Actividad y RTU'): {
        'que_es': 'Actualización obligatoria de datos en el RTU para profesionales independientes, adición de títulos académicos y acreditación de colegiación activa.',
        'lead_text': 'Actualiza tu título profesional, colegiación activa y domicilio fiscal en tu expediente digital del RTU.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020.'
    },
    ('Profesionales', 'Servicios Profesionales', 'Consultas Jurídico Tributarias'): {
        'que_es': 'Formulación de consultas formales no vinculantes y vinculantes sobre interpretación de leyes tributarias, resoluciones de duda razonable y precedentes administrativos.',
        'lead_text': 'Presenta consultas técnico-jurídicas sobre la aplicación de leyes y normas tributarias ante la SAT.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 112) y Ley Orgánica de la SAT (Decreto 1-98, Art. 3).'
    },
    ('Profesionales', 'Servicios Profesionales', 'Sistemas de Retención y Cumplimiento'): {
        'que_es': 'Mecanismos de retención del 5% definitivo de ISR sobre honorarios profesionales practicados por agentes de retención y emisión de constancias electrónicas.',
        'lead_text': 'Consulta y descarga constancias de retención practicadas por tus clientes sobre honorarios facturados.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 112) y Ley Orgánica de la SAT (Decreto 1-98).'
    },
    ('Entes Exentos', 'Entidades del Estado', 'Registro Institucional y RTU Estatal'): {
        'que_es': 'Inscripción y actualización en el RTU de dependencias de la administración central, entidades descentralizadas, empresas públicas y fondos sociales del Estado.',
        'lead_text': 'Inscribe y actualiza representantes y datos institucionales de dependencias públicas en el RTU.',
        'base_juridica': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA y Código Tributario.'
    },
    ('Entes Exentos', 'Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones'): {
        'que_es': 'Gestión de retenciones de IVA e ISR en compras públicas efectuadas por el Estado y emisión de constancias de exención oficial para contratistas gubernamentales.',
        'lead_text': 'Emite constancias de retención fiscal y administra comprobantes FEL en adquisiciones y contrataciones del Estado.',
        'base_juridica': 'Ley de Contrataciones del Estado (Decreto 57-92), Ley Orgánica del Presupuesto y Ley del IVA.'
    },
    ('Entes Exentos', 'Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad'): {
        'que_es': 'Inscripción, asignación de placas oficiales (O, MI, CD) y exención del ISCV para flotillas de vehículos de servicio público y seguridad nacional.',
        'lead_text': 'Gestiona placas oficiales, asignación de distintivos estatales y control del parque vehicular del sector público.',
        'base_juridica': 'Ley del Impuesto sobre Circulación de Vehículos (Decreto 70-94, Art. 9 - Exenciones).'
    },
    ('Entes Exentos', 'Entidades del Estado', 'Control Interno, Solvencias y Normativa'): {
        'que_es': 'Coordinación con la Contraloría General de Cuentas, fiscalización de fondos públicos, solvencias institucionales y cumplimiento de auditoría estatal.',
        'lead_text': 'Coordina solvencias fiscales institucionales y reportes de cumplimiento presupuestario del sector público.',
        'base_juridica': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA y Código Tributario.'
    },
    ('Entes Exentos', 'Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)'): {
        'que_es': 'Reconocimiento y acreditación de la exención tributaria constitucional para colegios privados, institutos y universidades autorizadas que prestan servicios de enseñanza.',
        'lead_text': 'Inscribir colegios, escuelas e institutos educativos privados sin fines de lucro en el Registro Tributario Unificado para el reconocimiento de la exención constitucional del Artículo 73.',
        'base_juridica': 'Constitución Política de la República de Guatemala (Arts. 73 y 88) y Ley del IVA (Art. 8).'
    },
    ('Entes Exentos', 'Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)'): {
        'que_es': 'Acreditación formal de personería jurídica y reconocimiento de exención tributaria integral para confesiones religiosas (Art. 37) y federaciones deportivas de la CDAG y COG (Art. 92).',
        'lead_text': 'Gestiona la inscripción y reconocimiento de exención fiscal para templos, iglesias y federaciones deportivas oficiales.',
        'base_juridica': 'Constitución Política de la República (Arts. 37 y 92), Código Civil y Ley del IVA.'
    },
    ('Entes Exentos', 'Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional'): {
        'que_es': 'Trámites de exención en compras de vehículos, donaciones educativas o benéficas y emisión de constancias de exención del IVA para instituciones constitucionales.',
        'lead_text': 'Solicita exención de aranceles e impuestos en vehículos y bienes para fines educativos, religiosos o deportivos.',
        'base_juridica': 'Constitución Política de la República de Guatemala, Ley del IVA y Código Tributario.'
    },
    ('Entes Exentos', 'No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas'): {
        'que_es': 'Inscripción, adscripción y asignación de NIT en el RTU para asociaciones civiles de beneficio mutuo, comités comunitarios, fundaciones benéficas y ONGs.',
        'lead_text': 'Inscribe asociaciones civiles, fundaciones y organizaciones comunitarias no lucrativas en el RTU.',
        'base_juridica': 'Decreto 02-2003 (Ley de Organizaciones No Gubernamentales para el Desarrollo) y Ley del IVA (Art. 8).'
    },
    ('Entes Exentos', 'No Lucrativos', 'Exenciones CIVA, Actualización y Cierre de Operaciones'): {
        'que_es': 'Emisión de Constancias de Exención del IVA (CIVA), renovación periódica de credenciales de entidad exenta, rendición de cuentas sobre donaciones y cese de personerías.',
        'lead_text': 'Emite constancias electrónicas de exención CIVA para compras de bienes y servicios vinculados al objeto social.',
        'base_juridica': 'Decreto 02-2003 (Ley de Organizaciones No Gubernamentales para el Desarrollo) y Ley del IVA (Art. 8).'
    },
    ('Entes Exentos', 'Municipalidades', '—'): {
        'que_es': 'Administración integral de la exención tributaria constitucional para las 340 corporaciones municipales del país en adquisiciones, proyectos de infraestructura y servicios comunitarios.',
        'lead_text': 'Gestionar y emitir Constancias de Exención del Impuesto al Valor Agregado (CIVA) para compras de bienes y servicios efectuadas por municipalidades.',
        'base_juridica': 'Constitución Política (Art. 257), Código Municipal (Decreto 12-2002) y Ley del IVA.'
    },
    ('Entes Exentos', 'Decreto', 'Misiones Diplomáticas y Organismos Internacionales'): {
        'que_es': 'Exención diplomática de aranceles, IVA e impuestos internos para embajadas, consulados acreditados, diplomáticos extranjeros y organismos internacionales de cooperación.',
        'lead_text': 'Tramita franquicias diplomáticas de importación, placas CD y constancias de exención para embajadas y organismos multilaterales.',
        'base_juridica': 'Convención de Viena sobre Relaciones Diplomáticas, Decretos del Congreso de ratificación y Ley del IVA.'
    },
    ('Entes Exentos', 'Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales'): {
        'que_es': 'Gestión de exenciones específicas otorgadas por ley a cooperativas de ahorro y crédito, organizaciones políticas y entidades de fomento social debidamente registradas.',
        'lead_text': 'Acredita resoluciones de fomento cooperativo y beneficios fiscales específicos decretados por el Congreso.',
        'base_juridica': 'Ley General de Cooperativas (Decreto 82-78), Ley Electoral y de Partidos Políticos y Código Tributario.'
    },
    ('Entes Exentos', 'Decreto', 'Donaciones Oficiales y Despacho Aduanero'): {
        'que_es': 'Despacho aduanero exento y franquicias arancelarias para donaciones de alimentos, medicamentos, material médico y ayuda humanitaria proveniente del exterior.',
        'lead_text': 'Despacha donaciones internacionales humanitarias y gestiona la exención total de aranceles e impuestos de importación.',
        'base_juridica': 'Convenios de Ayuda Humanitaria Internacional, Ley del IVA y CAUCA IV.'
    }
}

# 5. Helper para formatear XML OpenXML
def make_cell(col_letter, row_idx, val, style_id, cell_type="inlineStr"):
    r_coord = f"{col_letter}{row_idx}"
    if val is None or str(val).strip() == "":
        return f'<c r="{r_coord}" s="{style_id}"/>'
    s_val = str(val).strip()
    if cell_type == "inlineStr":
        clean_text = escape(s_val)
        return f'<c r="{r_coord}" s="{style_id}" t="inlineStr"><is><t>{clean_text}</t></is></c>'
    elif cell_type == "n":
        return f'<c r="{r_coord}" s="{style_id}"><v>{s_val}</v></c>'
    elif cell_type == "f":
        return f'<c r="{r_coord}" s="{style_id}"><f>{escape(s_val)}</f></c>'
    else:
        clean_text = escape(s_val)
        return f'<c r="{r_coord}" s="{style_id}" t="inlineStr"><is><t>{clean_text}</t></is></c>'

print("Diccionarios y helpers preparados.")
