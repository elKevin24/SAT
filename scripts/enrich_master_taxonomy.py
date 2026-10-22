"""
Script Maestro de Enriquecimiento y Sincronización Taxonómica Completa
Portal SAT Guatemala
Genera definiciones completas para Nivel 1, Nivel 2 y Nivel 3,
y síntesis para Nivel 4, actualizando:
1. database/nosql_mongodb/arbol_navegacion.json
2. scripts/build_mapa_y_descripciones_excel.py
3. docs/fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx
4. src/data/taxonomyDescriptions.ts (para React)
"""

import openpyxl
import json
import re
import os

EXCEL_PATH = 'docs/fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx'
ARBOL_PATH = 'database/nosql_mongodb/arbol_navegacion.json'
OUTPUT_TS_PATH = 'src/data/taxonomyDescriptions.ts'

def slugify(text: str) -> str:
    if not text or text in ['—', '-', 'None']:
        return ''
    text = text.lower().strip()
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
        'ñ': 'n', '/': '-', '\\': '-', '&': 'y', '(': '', ')': '',
        '[': '', ']': '', ',': '', '.': '', ':': '', ';': '', '"': '', "'": ''
    }
    for orig, rep in replacements.items():
        text = text.replace(orig, rep)
    text = re.sub(r'[^a-z0-9\-]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# 1. DICCIONARIO N1
N1_DEFS = {
    'contribuyentes': {
        'nombre': 'Contribuyentes',
        'que_es': 'Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.',
        'lead_text': 'Información y servicios tributarios para personas y empresas.',
        'base_juridica': 'Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).'
    },
    'operadores-de-comercio-exterior': {
        'nombre': 'Operadores de Comercio Exterior',
        'que_es': 'Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.',
        'lead_text': 'Servicios e información aduanera para la importación, exportación y logística.',
        'base_juridica': 'Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).'
    },
    'profesionales': {
        'nombre': 'Profesionales',
        'que_es': 'Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.',
        'lead_text': 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
        'base_juridica': 'Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 "A" y 112).'
    },
    'entes-exentos': {
        'nombre': 'Entes Exentos',
        'que_es': 'Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.',
        'lead_text': 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.',
        'base_juridica': 'Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).'
    }
}

# 2. DICCIONARIO N2: ÁREAS Y REGÍMENES (20 ÁREAS)
N2_DEFS = {
    # Contribuyentes
    'contribuyentes/sin-obligaciones-de-impuestos': {
        'nombre': 'Sin Obligaciones de Impuestos',
        'que_es': 'Personas individuales que no realizan actividades económicas mercantiles pero requieren identificación tributaria para actos civiles, contratos, trámites notariales o apertura de cuentas bancarias.',
        'lead_text': 'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia sin movimientos comerciales.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
    },
    'contribuyentes/pequenos-contribuyentes': {
        'nombre': 'Pequeños Contribuyentes',
        'que_es': 'Régimen tributario simplificado para personas individuales o jurídicas con tarifa definitiva 5% de IVA sin crédito fiscal conforme al límite de ley, así como productores agropecuarios del sector primario.',
        'lead_text': 'Facturación electrónica FEL, declaraciones mensuales del 5%, régimen electrónico y facilidades para el sector primario.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 45 al 50), Decreto 7-2019 (Régimen Electrónico) y Decreto 31-2024 (Sector Primario y Agropecuario).'
    },
    'contribuyentes/regimen-general': {
        'nombre': 'Régimen General',
        'que_es': 'Personas individuales y jurídicas afectas a las obligaciones tributarias generales del IVA (12%) e ISR (Actividades Lucrativas, Rentas del Capital y del Trabajo), administración del Registro Fiscal de Vehículos, facturación electrónica FEL y solvencia fiscal.',
        'lead_text': 'Declaraciones periódicas, facturación digital FEL, RTU Digital, traspasos vehiculares y pago de impuestos.',
        'base_juridica': 'Código Tributario (Decreto 6-91), Ley del IVA (Decreto 27-92), Ley de Actualización Tributaria (Decreto 10-2012) y Ley del ISCV (Decreto 70-94).'
    },
    'contribuyentes/contribuyentes-especiales': {
        'nombre': 'Contribuyentes Especiales',
        'que_es': 'Grandes y medianos contribuyentes calificados por la SAT con atención gerencial diferenciada, sujetos a fiscalización intensiva, requerimientos de precios de transferencia y presentación de estados financieros auditados.',
        'lead_text': 'Atención especializada en gerencias diferenciadas, cumplimiento tributario corporativo y auditorías fiscales.',
        'base_juridica': 'Ley Orgánica de la SAT (Decreto 1-98, Art. 3) y Resoluciones de Directorio de Calificación de Contribuyentes Especiales.'
    },

    # Entes Exentos
    'entes-exentos/constitucionales': {
        'nombre': 'Constitucionales',
        'que_es': 'Entidades con exención total de tributos reconocida expresamente en la Constitución Política: centros educativos, universidades, comunidades religiosas, misiones diplomáticas y confederaciones deportivas.',
        'lead_text': 'Acreditación de exenciones constitucionales, emisión de constancias electrónicas y registro en RTU.',
        'base_juridica': 'Constitución Política de la República (Arts. 37, 73, 88 y 92), Ley del IVA (Art. 8) y Código Tributario (Art. 62).'
    },
    'entes-exentos/decreto': {
        'nombre': 'Decreto',
        'que_es': 'Entidades beneficiarias de incentivos y exenciones tributarias específicas aprobadas mediante decretos legislativos ordinarios del Congreso: cooperativas, partidos políticos, donaciones oficiales y fomento sectorial.',
        'lead_text': 'Gestión de exenciones por ley ordinaria, despacho aduanero de donaciones y constancias oficiales.',
        'base_juridica': 'Ley General de Cooperativas (Decreto 82-78), Ley Electoral y de Partidos Políticos (Decreto 1-85) y decretos de fomento.'
    },
    'entes-exentos/entidades-del-estado': {
        'nombre': 'Entidades del Estado',
        'que_es': 'Ministerios, secretarías, organismos de Estado, dependencias públicas y entidades descentralizadas que operan como agentes de retención oficial del IVA e ISR y administran parque vehicular institucional.',
        'lead_text': 'Unidades ejecutoras en el RTU, constancias de retención en compras públicas y control vehicular oficial.',
        'base_juridica': 'Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA, Ley de Contrataciones del Estado (Decreto 57-92) y Código Tributario.'
    },
    'entes-exentos/municipalidades': {
        'nombre': 'Municipalidades',
        'que_es': 'Las 340 corporaciones municipales autónomas de Guatemala, mancomunidades y empresas municipales prestadoras de servicios públicos comunitarios.',
        'lead_text': 'Registro de autoridades y tesoreros en el RTU, solvencias municipales y exención del ISCV para flotillas ediles.',
        'base_juridica': 'Constitución Política (Art. 257), Código Municipal (Decreto 12-2002) y Ley del ISCV (Decreto 70-94).'
    },
    'entes-exentos/no-lucrativos': {
        'nombre': 'No Lucrativos',
        'que_es': 'Organizaciones No Gubernamentales (ONGs), fundaciones benéficas y asociaciones civiles sin fines de lucro con exención formal calificada ante la SAT para fines sociales y de desarrollo.',
        'lead_text': 'Solicitud formal de exención de ISR, actualización de directivas en el RTU y constancias tributarias.',
        'base_juridica': 'Ley de ONGs para el Desarrollo (Decreto 02-2003), Ley de Actualización Tributaria (Decreto 10-2012, Art. 11) y Ley del IVA.'
    },
    'entes-exentos/organizaciones-no-lucrativas-exentas': {
        'nombre': 'Organizaciones No Lucrativas (Exentas)',
        'que_es': 'Entidades de la sociedad civil, asociaciones sin fines de lucro, fundaciones, cooperativas, iglesias y colegios profesionales reconocidos con exención fiscal.',
        'lead_text': 'Acreditación de exenciones, registro de juntas directivas en el RTU Digital y constancias de no adeudo.',
        'base_juridica': 'Constitución Política (Arts. 37, 73, 88), Ley de ONGs y Ley del IVA (Art. 8).'
    },
    'entes-exentos/sector-publico-estado': {
        'nombre': 'Sector Público (Estado)',
        'que_es': 'Instituciones del Estado centralizadas y descentralizadas y gobiernos locales autónomos afectos al cumplimiento de deberes formales y retenciones oficiales.',
        'lead_text': 'Gestiones tributarias estatales, compras del sector público y constancias de retención del IVA.',
        'base_juridica': 'Ley Orgánica del Presupuesto y Código Tributario.'
    },

    # Operadores de Comercio Exterior
    'operadores-de-comercio-exterior/importadores': {
        'nombre': 'Importadores',
        'que_es': 'Personas individuales o jurídicas autorizadas en el padrón aduanero para ingresar legalmente mercancías extranjeras al territorio aduanero nacional para consumo, uso o transformación.',
        'lead_text': 'Padrón de importadores, liquidación de declaraciones DUCA-D, despacho aduanero, aranceles e importación vehicular.',
        'base_juridica': 'CAUCA IV (Arts. 21 y 77), RECAUCA IV (Arts. 317 al 330) y Ley Nacional de Aduanas.'
    },
    'operadores-de-comercio-exterior/exportadores': {
        'nombre': 'Exportadores',
        'que_es': 'Operadores inscritos en el Registro de Exportadores de la SAT y VUPE que despachan mercancías de origen nacional o nacionalizadas hacia mercados extranjeros.',
        'lead_text': 'Código VUPE, declaraciones aduaneras de embarque y gestión de devolución de crédito fiscal del IVA.',
        'base_juridica': 'Ley del IVA (Decreto 27-92, Arts. 23 al 25 bis), Decreto 29-89 (Ley de Maquilas) y CAUCA/RECAUCA IV.'
    },
    'operadores-de-comercio-exterior/operador-economico-autorizado-oea': {
        'nombre': 'Operador Económico Autorizado (OEA)',
        'que_es': 'Actores de la cadena logística internacional certificados por la SAT con estándares SAFE de la OMA para gozar de despacho preferencial y simplificación aduanera.',
        'lead_text': 'Certificación en seguridad logística, carriles exprés y reducción de selectivo rojo en aduanas.',
        'base_juridica': 'Marco Normativo SAFE de la OMA, CAUCA IV y Resoluciones de Directorio SAT del Programa OEA-Guatemala.'
    },
    'operadores-de-comercio-exterior/auxiliares-de-la-funcion-publica-aduanera-afpa': {
        'nombre': 'Auxiliares de la Función Pública Aduanera (AFPA)',
        'que_es': 'Personas naturales o jurídicas autorizadas por la Intendencia de Aduanas para actuar en nombre propio o de terceros en desaduanamiento, transporte, custodia o desconsolidación: agentes aduaneros, apoderados, depósitos temporales, courier y transportistas.',
        'lead_text': 'Carnés oficiales, pólizas de fianza operativa, marchamos electrónicos y habilitación de depósitos aduaneros.',
        'base_juridica': 'CAUCA IV (Arts. 18 al 28), RECAUCA IV (Arts. 74 al 136) y Ley Nacional de Aduanas.'
    },
    'operadores-de-comercio-exterior/regimenes-territoriales-y-zonas-especiales': {
        'nombre': 'Regímenes Territoriales y Zonas Especiales',
        'que_es': 'Empresas y parques industriales que operan bajo regímenes aduaneros liberatorios o de fomento con suspensión y exención arancelaria: Maquilas (Decreto 29-89) y Zonas de Desarrollo Económico Especial Público (ZDEEP).',
        'lead_text': 'Habilitación ZDEEP, importación con suspensión arancelaria y liquidación de cuentas corrientes bajo el Dto. 29-89.',
        'base_juridica': 'Decreto 29-89 (Ley de Maquilas), Decreto 22-73 (ZOLIC/ZDEEP) y normativa aduanera aplicable.'
    },
    'operadores-de-comercio-exterior/normativa-y-operaciones-aduaneras-generales': {
        'nombre': 'Normativa y Operaciones Aduaneras Generales',
        'que_es': 'Servicios transversales de consulta técnica arancelaria, resoluciones anticipadas de origen y clasificación, contingencias aduaneras, acuerdos comerciales y combate a la defraudación aduanera.',
        'lead_text': 'Consulta de aranceles en el SAC, resoluciones vinculantes anticipadas y facilitación aduanera.',
        'base_juridica': 'Convenio Arancelario Centroamericano, Acuerdos Comerciales de la OMC, CAUCA IV y Ley contra la Defraudación y Contrabando Aduanero.'
    },

    # Profesionales
    'profesionales/abogados-y-notarios': {
        'nombre': 'Abogados y Notarios',
        'que_es': 'Profesionales del derecho colegiados activos autorizados para la fe pública notarial, venta y razón de timbres fiscales, papel sellado de protocolos y traspasos vehiculares electrónicos (TEV).',
        'lead_text': 'Compra de papel de protocolo, razones de timbres, formalización de traspasos en línea TEV y avisos notariales.',
        'base_juridica': 'Código de Notariado (Decreto 314), Ley de Timbres Fiscales (Decreto 37-92) y Ley del ISCV (Decreto 70-94).'
    },
    'profesionales/peritos-contadores': {
        'nombre': 'Peritos Contadores',
        'que_es': 'Técnicos contables acreditados ante la SAT facultados para llevar registros de contabilidad, autorizar libros electrónicos (LET) y firmar declaraciones juradas tributarias.',
        'lead_text': 'Registro de contadores, habilitación del Libro Electrónico Tributario (LET) y administración de obligaciones contables.',
        'base_juridica': 'Decreto 2450 (Normas de la Profesión Contable), Código de Comercio (Arts. 368 al 381) y Código Tributario (Arts. 112 y 120).'
    },
    'profesionales/auditores': {
        'nombre': 'Auditores',
        'que_es': 'Contadores Públicos y Auditores (CPA) colegiados activos facultados para emitir dictámenes periciales de devolución de crédito fiscal a exportadores, auditorías tributarias y estados financieros.',
        'lead_text': 'Inscripción registral de firmas de CPA y emisión de dictámenes vinculantes para devolución de crédito fiscal.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria (Decreto 72-2001) y Ley del IVA (Decreto 27-92, Art. 25 bis).'
    },
    'profesionales/gestores-tributarios': {
        'nombre': 'Gestores Tributarios',
        'que_es': 'Personas autorizadas formalmente con gafete institucional para representar a terceros en la realización presencial de expedientes ante agencias tributarias y aduaneras.',
        'lead_text': 'Emisión y renovación de gafetes oficiales de gestor, reposición y consulta del padrón activo institucional.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Art. 22) y Normativa de Acreditación de Gestores de la SAT.'
    },
    'profesionales/servicios-profesionales': {
        'nombre': 'Servicios Profesionales',
        'que_es': 'Profesionales liberales e independientes que prestan servicios técnicos, científicos, jurídicos o de salud por honorarios, afectos a retenciones del IVA e ISR y actualización registral.',
        'lead_text': 'Facturación FEL por honorarios, formularios en Declaraguate, consultas vinculantes y retenciones tributarias.',
        'base_juridica': 'Ley de Actualización Tributaria (Decreto 10-2012, Libro I) y Código Tributario (Arts. 102 al 105).'
    }
}

# 3. Cargar libro maestro de 715 trámites para derivar descripciones de N3 y N4
wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
ws = wb['Matriz Maestra (715)']
headers = [c.value for c in ws[1]]

# Mapear trámites por cada ruta materializada
tramites_by_path = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    r = dict(zip(headers, row))
    n1 = str(r.get('Nivel 1') or '').strip()
    n2 = str(r.get('Nivel 2') or '').strip()
    n3 = str(r.get('Nivel 3') or '').strip()
    n4 = str(r.get('Nivel 4') or '').strip()
    
    parts = []
    for p in [n1, n2, n3, n4]:
        s = slugify(p)
        if s:
            parts.append(s)
            mat = '/'.join(parts)
            if mat not in tramites_by_path:
                tramites_by_path[mat] = []
            tramites_by_path[mat].append(r)

print(f"Cargadas {len(tramites_by_path)} rutas materializadas con trámites.")

# Cargar arbol_navegacion actual
with open(ARBOL_PATH, 'r', encoding='utf-8') as f:
    arbol = json.load(f)

print(f"Nodos actuales en arbol_navegacion: {len(arbol)}")

# Función para generar descripción de N3 / N4
def generate_node_description(node):
    path = node['materialized_path']
    level = node['nivel']
    nombre = node['nombre']
    
    # Si es Nivel 1:
    if level == 1:
        if path in N1_DEFS:
            return N1_DEFS[path]
        return {
            'nombre': nombre,
            'que_es': f"Portal y servicios institucionales correspondientes a {nombre}.",
            'lead_text': f"Gestiones y servicios tributarios de {nombre}.",
            'base_juridica': "Constitución Política de la República de Guatemala y Código Tributario."
        }
        
    # Si es Nivel 2:
    if level == 2:
        if path in N2_DEFS:
            return N2_DEFS[path]
        # Búsqueda por slug relativo
        slug_rel = path.split('/', 1)[-1]
        for k, v in N2_DEFS.items():
            if k.endswith(slug_rel):
                return v
        return {
            'nombre': nombre,
            'que_es': f"Área de especialidad y régimen de {nombre} dentro de la administración tributaria y aduanera.",
            'lead_text': f"Consultas, operaciones y trámites correspondientes a {nombre}.",
            'base_juridica': "Código Tributario (Decreto 6-91) y normativas reglamentarias aplicables."
        }
        
    # Si es Nivel 3:
    ts = tramites_by_path.get(path, [])
    cnt = len(ts)
    
    # Determinar base legal representativa de los trámites hijos
    bases = [str(t.get('Base Legal / Fundamento Jurídico (En base a qué: CAUCA, RECAUCA, Leyes)') or '').strip() for t in ts if t.get('Base Legal / Fundamento Jurídico (En base a qué: CAUCA, RECAUCA, Leyes)')]
    bases_clean = [b for b in bases if b and b != '—']
    base_juridica = bases_clean[0] if bases_clean else "Código Tributario (Decreto 6-91) y normativas reglamentarias de la SAT."
    if len(base_juridica) > 160:
        base_juridica = base_juridica[:157] + "..."
        
    lead_text = f"Gestión oficial, requisitos y pasos para {nombre.lower()} ({cnt} gestiones disponibles)."
    que_es = f"Trámites y servicios institucionales para {nombre}. Permite a los usuarios consultar requisitos, realizar gestiones en línea o presenciales y cumplir sus obligaciones conforme a los estándares de la SAT."
    
    # Casos especiales de N3 con alta relevancia
    if 'fel' in path or 'factur' in path:
        que_es = "Servicios y herramientas de Facturación Electrónica en Línea (FEL): habilitación de emisores, emisión de DTEs, autorización de certificadores y consultas de validez tributaria."
        lead_text = "Habilítate como emisor FEL, emite documentos tributarios y consulta comprobantes electrónicos."
    elif 'rtu' in path or 'inscrip' in path:
        que_es = "Gestiones de inscripción y actualización en el Registro Tributario Unificado (RTU Digital): modificación de datos, establecimientos mercantiles, vehículos y representantes legales."
        lead_text = "Actualiza tus datos en el RTU Digital, modifica domicilios y administra tus obligaciones tributarias."
    elif 'vehiculo' in path or 'placa' in path:
        que_es = "Trámites del Registro Fiscal de Vehículos (RFV): pago del Impuesto sobre Circulación (ISCV), primeras placas, traspasos con notario, reposición de distintivos y solvencias."
        lead_text = "Paga la calcomanía ISCV, gestiona primeras placas, formaliza traspasos y tramita distintivos."
    elif 'declarac' in path or 'pago' in path:
        que_es = "Liquidación y pago de obligaciones tributarias periódicas en Declaraguate y BancaSAT: IVA, ISR, ISO, retenciones y boletas de pago SAT-2000."
        lead_text = "Llena tus formularios oficiales en Declaraguate y realiza tus pagos desde la banca en línea."
    elif 'agente' in path or 'aduaner' in path:
        que_es = "Habilitación, control de pólizas de garantía y gestión de carnés oficiales para Agentes Aduaneros y auxiliares autorizados ante el Servicio Aduanero nacional."
        lead_text = "Renueva credenciales de agente aduanero, acredita cauciones y gestiona trámites de despacho."
        
    return {
        'nombre': nombre,
        'que_es': que_es,
        'lead_text': lead_text,
        'base_juridica': base_juridica
    }

# Actualizar todos los nodos de arbol_navegacion
actualizados = 0
for node in arbol:
    desc = generate_node_description(node)
    node['contenido_segmento'] = {
        'que_es': desc['que_es'],
        'lead_text': desc['lead_text'],
        'base_juridica': desc['base_juridica']
    }
    actualizados += 1

print(f"Total nodos actualizados con contenido enriquecido: {actualizados}")

# Guardar arbol_navegacion.json
with open(ARBOL_PATH, 'w', encoding='utf-8') as f:
    json.dump(arbol, f, ensure_ascii=False, indent=2)

print(f"Archivo {ARBOL_PATH} sobrescrito con éxito.")

# 4. Generar src/data/taxonomyDescriptions.ts para React
ts_content = """/**
 * DICCIONARIO CANÓNICO DE DESCRIPCIONES TAXONÓMICAS
 * Portal SAT Guatemala
 * Provee fichas informativas oficiales (¿Qué es?, Texto orientador y Base jurídica)
 * para Nivel 1, Nivel 2 y Nivel 3.
 */

export interface TaxonDescription {
  nombre: string;
  que_es: string;
  lead_text: string;
  base_juridica: string;
  alcance?: string;
  nivel: number;
}

export const SEGMENT_DESCRIPTIONS: Record<string, TaxonDescription> = {
"""

for slug, data in N1_DEFS.items():
    ts_content += f"""  '{slug}': {{
    nombre: {json.dumps(data['nombre'], ensure_ascii=False)},
    que_es: {json.dumps(data['que_es'], ensure_ascii=False)},
    lead_text: {json.dumps(data['lead_text'], ensure_ascii=False)},
    base_juridica: {json.dumps(data['base_juridica'], ensure_ascii=False)},
    nivel: 1
  }},
"""

ts_content += """};

export const AREA_DESCRIPTIONS: Record<string, TaxonDescription> = {
"""

for path, data in N2_DEFS.items():
    ts_content += f"""  '{path}': {{
    nombre: {json.dumps(data['nombre'], ensure_ascii=False)},
    que_es: {json.dumps(data['que_es'], ensure_ascii=False)},
    lead_text: {json.dumps(data['lead_text'], ensure_ascii=False)},
    base_juridica: {json.dumps(data['base_juridica'], ensure_ascii=False)},
    nivel: 2
  }},
"""

ts_content += """};

// Diccionario indexado por materialized_path o slug
export const TAXONOMY_NODE_DESCRIPTIONS: Record<string, TaxonDescription> = {
"""

for node in arbol:
    mat = node['materialized_path']
    cs = node['contenido_segmento']
    ts_content += f"""  '{mat}': {{
    nombre: {json.dumps(node['nombre'], ensure_ascii=False)},
    que_es: {json.dumps(cs['que_es'], ensure_ascii=False)},
    lead_text: {json.dumps(cs['lead_text'], ensure_ascii=False)},
    base_juridica: {json.dumps(cs['base_juridica'], ensure_ascii=False)},
    nivel: {node['nivel']}
  }},
"""

ts_content += """};

export function getTaxonDescription(pathOrSlug: string): TaxonDescription | undefined {
  if (TAXONOMY_NODE_DESCRIPTIONS[pathOrSlug]) {
    return TAXONOMY_NODE_DESCRIPTIONS[pathOrSlug];
  }
  // Búsqueda por slug parcial
  for (const key of Object.keys(TAXONOMY_NODE_DESCRIPTIONS)) {
    if (key.endsWith(pathOrSlug) || key.split('/').includes(pathOrSlug)) {
      return TAXONOMY_NODE_DESCRIPTIONS[key];
    }
  }
  return undefined;
}
"""

with open(OUTPUT_TS_PATH, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Contrato TypeScript generado en: {OUTPUT_TS_PATH}")
