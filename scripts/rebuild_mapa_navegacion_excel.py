import json
import zipfile
import re
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

# 1. Cargar dataset maestro
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

TOTAL_PORTAL = len(all_data) # 714

# 2. Cargar descripciones taxonómicas
with open('scripts/taxonomy_descriptions.json', 'r', encoding='utf-8') as f:
    tax_desc = json.load(f)

def safe_int(v, default=99):
    if v is None: return default
    s = str(v).strip()
    return int(s) if s.isdigit() else default

# Diccionario de orden para N1
N1_ORDER = {
    'Contribuyentes': 1,
    'Operadores de Comercio Exterior': 2,
    'Profesionales': 3,
    'Entes Exentos': 4
}

# Diccionario de datos canónicos para N1
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

# Recopilar los 20 Actores Canónicos de N2
n2_map = {}
for g in all_data:
    n1 = g.get('nivel1')
    n2 = g.get('nivel2')
    key = (n1, n2)
    if key not in n2_map:
        n2_map[key] = {
            'n1': n1,
            'n2': n2,
            'o1': safe_int(g.get('orden_n1')),
            'o2': safe_int(g.get('orden_n2')),
            'count': 0,
            'gestiones': [],
            'bases': set()
        }
    n2_map[key]['count'] += 1
    n2_map[key]['gestiones'].append(g.get('gestion'))
    bl = g.get('baseLegal', '')
    if bl and bl != '—': n2_map[key]['bases'].add(bl)

# Ordenar los 20 actores de N2
sorted_n2 = sorted(n2_map.values(), key=lambda x: (x['o1'], x['o2'], x['n2']))

# Descripciones oficiales para los 20 actores de N2
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

# 3. Recopilar los 62 Nodos de Nivel 3
n3_map = {}
for g in all_data:
    n1 = g.get('nivel1')
    n2 = g.get('nivel2')
    n3 = g.get('nivel3')
    key = (n1, n2, n3)
    if key not in n3_map:
        n3_map[key] = {
            'n1': n1,
            'n2': n2,
            'n3': n3,
            'o1': safe_int(g.get('orden_n1')),
            'o2': safe_int(g.get('orden_n2')),
            'o3': safe_int(g.get('orden_n3')),
            'count': 0,
            'gestiones': [],
            'bases': set()
        }
    n3_map[key]['count'] += 1
    n3_map[key]['gestiones'].append(g.get('gestion'))
    bl = g.get('baseLegal', '')
    if bl and bl != '—': n3_map[key]['bases'].add(bl)

sorted_n3 = sorted(n3_map.values(), key=lambda x: (x['o1'], x['o2'], x['o3'], x['n3']))

# 4. Recopilar los 136 Caminos Canónicos (N1 a N4)
paths_map = {}
for g in all_data:
    n1 = g.get('nivel1', '—')
    n2 = g.get('nivel2', '—')
    n3 = g.get('nivel3', '—')
    n4 = g.get('nivel4', '—')
    key = (n1, n2, n3, n4)
    if key not in paths_map:
        paths_map[key] = {
            'n1': n1, 'n2': n2, 'n3': n3, 'n4': n4,
            'o1': safe_int(g.get('orden_n1')),
            'o2': safe_int(g.get('orden_n2')),
            'o3': safe_int(g.get('orden_n3')),
            'o4': safe_int(g.get('orden_n4')),
            'count': 0,
            'gestiones': [],
            'descriptions': [],
            'bases': set()
        }
    paths_map[key]['count'] += 1
    paths_map[key]['gestiones'].append(g.get('gestion', ''))
    if g.get('descripcion'): paths_map[key]['descriptions'].append(g.get('descripcion'))
    bl = g.get('baseLegal', '')
    if bl and bl != '—': paths_map[key]['bases'].add(bl)

sorted_paths = sorted(paths_map.values(), key=lambda x: (x['o1'], x['o2'], x['o3'], x['o4'], x['n1'], x['n2'], x['n3'], x['n4']))

print(f"Dataset consolidado: {TOTAL_PORTAL} gestiones.")
print(f"Nivel 1: {len(N1_CONFIG)} | Nivel 2: {len(sorted_n2)} | Nivel 3: {len(sorted_n3)} | Caminos N1-N4: {len(sorted_paths)}")
