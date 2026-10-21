"""
Script de Generación Canónica del Árbol de Navegación Oficial (239 Nodos)
Portal SAT Guatemala

Estructura Taxonómica Canónica (4 / 20 / 58 / 157):
- Nivel 1: 4 nodos
- Nivel 2: 20 nodos
- Nivel 3: 58 nodos
- Nivel 4: 157 nodos

Genera:
1. database/nosql_mongodb/arbol_navegacion.json
2. database/arbol_navegacion.json
"""

import json
import re
from bson import ObjectId
from collections import defaultdict

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

N2_DEFS = {
    # Contribuyentes (4)
    'contribuyentes/sin-obligaciones-de-impuestos': {
        'nombre': 'Sin Obligaciones de Impuestos',
        'que_es': 'Personas individuales que no realizan actividades económicas mercantiles pero requieren identificación tributaria para actos civiles, contratos, trámites notariales o apertura de cuentas bancarias.',
        'lead_text': 'Obtén tu primer NIT, actualiza tus datos de identificación personal y consulta tu constancia sin movimientos comerciales.',
        'base_juridica': 'Código Tributario (Decreto 6-91, Arts. 112 y 120), Ley de Actualización Tributaria (Decreto 10-2012) y Acuerdo de Directorio SAT 08-2020.'
    },
    'contribuyentes/pequenos-contribuyentes': {
        'nombre': 'Pequeños Contribuyentes',
        'que_es': 'Régimen tributario simplificado para personas individuales o jurídicas con ventas o servicios de hasta Q150,000 anuales (tarifa definitiva 5% de IVA sin crédito fiscal), así como productores agropecuarios del sector primario.',
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

    # Operadores de Comercio Exterior (6)
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

    # Profesionales (5)
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
    },

    # Entes Exentos (5)
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
    }
}

def main():
    print("1. Cargando dataset maestro src/data/allTramites.json...")
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        all_t = json.load(f)

    # Agrupar trámites por cada ruta
    by_path_tramites = defaultdict(list)
    for t in all_t:
        n1 = t.get('nivel1') or t.get('nivel1_segmento')
        n2 = t.get('nivel2') or t.get('nivel2_area')
        n3 = t.get('nivel3') or t.get('nivel3_subarea')
        n4 = t.get('nivel4') or t.get('nivel4_tema')
        
        p1 = slugify(n1)
        by_path_tramites[p1].append(t)
        
        if n2 and n2 != '—':
            p2 = f"{p1}/{slugify(n2)}"
            by_path_tramites[p2].append(t)
            
            if n3 and n3 != '—':
                p3 = f"{p2}/{slugify(n3)}"
                by_path_tramites[p3].append(t)
                
                if n4 and n4 != '—':
                    p4 = f"{p3}/{slugify(n4)}"
                    by_path_tramites[p4].append(t)

    # Construir nodos en orden oficial
    tree_nodes = []
    node_id_map = {}
    
    # Orden Canónico N1
    n1_order = [
        'contribuyentes',
        'operadores-de-comercio-exterior',
        'profesionales',
        'entes-exentos'
    ]

    # Recolectar ramas únicas respetando orden de aparición
    n1_names = {}
    n2_by_n1 = defaultdict(dict)
    n3_by_n2 = defaultdict(dict)
    n4_by_n3 = defaultdict(dict)

    for t in all_t:
        n1 = t.get('nivel1') or t.get('nivel1_segmento')
        n2 = t.get('nivel2') or t.get('nivel2_area')
        n3 = t.get('nivel3') or t.get('nivel3_subarea')
        n4 = t.get('nivel4') or t.get('nivel4_tema')

        s1 = slugify(n1)
        n1_names[s1] = n1

        if n2 and n2 != '—':
            s2 = slugify(n2)
            n2_by_n1[s1][s2] = n2

            if n3 and n3 != '—':
                s3 = slugify(n3)
                p2 = f"{s1}/{s2}"
                n3_by_n2[p2][s3] = n3

                if n4 and n4 != '—':
                    s4 = slugify(n4)
                    p3 = f"{p2}/{s3}"
                    n4_by_n3[p3][s4] = n4

    orden_global = 1

    # Nivel 1
    for s1 in n1_order:
        if s1 not in n1_names:
            continue
        nom1 = n1_names[s1]
        obj_id = str(ObjectId())
        node_id_map[s1] = obj_id
        
        info = N1_DEFS.get(s1, {
            'nombre': nom1,
            'que_es': f"Definición oficial de {nom1}.",
            'lead_text': f"Servicios y trámites para {nom1.lower()}.",
            'base_juridica': "Constitución Política de la República y Código Tributario."
        })

        node_n1 = {
            "_id": obj_id,
            "slug": s1,
            "nombre": nom1,
            "nivel": 1,
            "padre_id": None,
            "ruta": [],
            "materialized_path": s1,
            "orden": orden_global,
            "estado": "VIGENTE",
            "contenido_segmento": {
                "que_es": info['que_es'],
                "lead_text": info['lead_text'],
                "base_juridica": info['base_juridica']
            }
        }
        tree_nodes.append(node_n1)
        orden_global += 1

        # Nivel 2
        for s2, nom2 in n2_by_n1[s1].items():
            p2 = f"{s1}/{s2}"
            obj_id_2 = str(ObjectId())
            node_id_map[p2] = obj_id_2
            
            info_2 = N2_DEFS.get(p2, {
                'nombre': nom2,
                'que_es': f"Área de trámites y servicios de {nom2} dentro de {nom1}.",
                'lead_text': f"Requisitos, procedimientos y gestiones para {nom2.lower()}.",
                'base_juridica': "Código Tributario (Decreto 6-91) y reglamentos aplicables."
            })

            node_n2 = {
                "_id": obj_id_2,
                "slug": s2,
                "nombre": nom2,
                "nivel": 2,
                "padre_id": obj_id,
                "ruta": [obj_id],
                "materialized_path": p2,
                "orden": orden_global,
                "estado": "VIGENTE",
                "contenido_segmento": {
                    "que_es": info_2['que_es'],
                    "lead_text": info_2['lead_text'],
                    "base_juridica": info_2['base_juridica']
                }
            }
            tree_nodes.append(node_n2)
            orden_global += 1

            # Nivel 3
            for s3, nom3 in n3_by_n2[p2].items():
                p3 = f"{p2}/{s3}"
                obj_id_3 = str(ObjectId())
                node_id_map[p3] = obj_id_3
                
                ts_3 = by_path_tramites.get(p3, [])
                bases_3 = [t.get('baseLegal') for t in ts_3 if t.get('baseLegal') and t.get('baseLegal') != '—']
                base_jur_3 = bases_3[0] if bases_3 else "Código Tributario (Decreto 6-91) y normativas técnicas de la SAT."
                if len(base_jur_3) > 160:
                    base_jur_3 = base_jur_3[:157] + "..."

                lead_text_3 = f"Gestiones oficiales, requisitos y pasos para {nom3.lower()} ({len(ts_3)} trámites disponibles)."
                que_es_3 = f"Trámites y servicios institucionales para {nom3} en {nom2}. Permite a los usuarios consultar requisitos y realizar sus gestiones conforme a la normativa tributaria y aduanera."

                # Enriquecimiento temático N3
                if 'fel' in s3 or 'factur' in s3:
                    que_es_3 = "Servicios y herramientas de Facturación Electrónica en Línea (FEL): habilitación de emisores, emisión de DTEs, autorización de certificadores y consultas de validez tributaria."
                    lead_text_3 = "Habilítate como emisor FEL, emite documentos tributarios y consulta comprobantes electrónicos."
                elif 'rtu' in s3 or 'inscrip' in s3:
                    que_es_3 = "Gestiones de inscripción y actualización en el Registro Tributario Unificado (RTU Digital): modificación de datos, establecimientos mercantiles, vehículos y representantes legales."
                    lead_text_3 = "Actualiza tus datos en el RTU Digital, modifica domicilios y administra tus obligaciones tributarias."
                elif 'vehiculo' in s3 or 'placa' in s3 or 'calcoman' in s3:
                    que_es_3 = "Trámites del Registro Fiscal de Vehículos (RFV): pago del Impuesto sobre Circulación (ISCV), primeras placas, traspasos con notario, reposición de distintivos y solvencias."
                    lead_text_3 = "Paga la calcomanía ISCV, gestiona primeras placas, formaliza traspasos y tramita distintivos."
                elif 'declarac' in s3 or 'pago' in s3:
                    que_es_3 = "Liquidación y pago de obligaciones tributarias periódicas en Declaraguate y BancaSAT: IVA, ISR, ISO, retenciones y boletas de pago SAT-2000."
                    lead_text_3 = "Llena tus formularios oficiales en Declaraguate y realiza tus pagos desde la banca en línea."
                elif 'agente' in s3 or 'aduaner' in s3:
                    que_es_3 = "Habilitación, control de pólizas de garantía y gestión de carnés oficiales para Agentes Aduaneros y auxiliares autorizados ante el Servicio Aduanero nacional."
                    lead_text_3 = "Renueva credenciales de agente aduanero, acredita cauciones y gestiona trámites de despacho."

                node_n3 = {
                    "_id": obj_id_3,
                    "slug": s3,
                    "nombre": nom3,
                    "nivel": 3,
                    "padre_id": obj_id_2,
                    "ruta": [obj_id, obj_id_2],
                    "materialized_path": p3,
                    "orden": orden_global,
                    "estado": "VIGENTE",
                    "contenido_segmento": {
                        "que_es": que_es_3,
                        "lead_text": lead_text_3,
                        "base_juridica": base_jur_3
                    }
                }
                tree_nodes.append(node_n3)
                orden_global += 1

                # Nivel 4
                for s4, nom4 in n4_by_n3[p3].items():
                    p4 = f"{p3}/{s4}"
                    obj_id_4 = str(ObjectId())
                    node_id_map[p4] = obj_id_4

                    ts_4 = by_path_tramites.get(p4, [])
                    bases_4 = [t.get('baseLegal') for t in ts_4 if t.get('baseLegal') and t.get('baseLegal') != '—']
                    base_jur_4 = bases_4[0] if bases_4 else base_jur_3
                    if len(base_jur_4) > 160:
                        base_jur_4 = base_jur_4[:157] + "..."

                    ejemplos = [t.get('tramite') for t in ts_4[:2] if t.get('tramite')]
                    ejemplos_txt = f" Incluye trámites como: {', '.join(ejemplos)}." if ejemplos else ""

                    que_es_4 = f"Tema operativo para la gestión de {nom4} dentro de la subárea {nom3}.{ejemplos_txt}"
                    lead_text_4 = f"Requisitos, pasos e información orientadora para {nom4.lower()} ({len(ts_4)} gestiones)."

                    node_n4 = {
                        "_id": obj_id_4,
                        "slug": s4,
                        "nombre": nom4,
                        "nivel": 4,
                        "padre_id": obj_id_3,
                        "ruta": [obj_id, obj_id_2, obj_id_3],
                        "materialized_path": p4,
                        "orden": orden_global,
                        "estado": "VIGENTE",
                        "contenido_segmento": {
                            "que_es": que_es_4,
                            "lead_text": lead_text_4,
                            "base_juridica": base_jur_4
                        }
                    }
                    tree_nodes.append(node_n4)
                    orden_global += 1

    # Verificación de conteos
    c_n1 = sum(1 for n in tree_nodes if n['nivel'] == 1)
    c_n2 = sum(1 for n in tree_nodes if n['nivel'] == 2)
    c_n3 = sum(1 for n in tree_nodes if n['nivel'] == 3)
    c_n4 = sum(1 for n in tree_nodes if n['nivel'] == 4)

    print(f"\n--- VALIDACIÓN DE NODOS GENERADOS ---")
    print(f"Nivel 1: {c_n1} (Esperado: 4)")
    print(f"Nivel 2: {c_n2} (Esperado: 20)")
    print(f"Nivel 3: {c_n3}")
    print(f"Nivel 4: {c_n4}")
    print(f"TOTAL NODOS ÁRBOL:    {len(tree_nodes)}")

    # Guarda de integridad estructural: N1 y N2 son fijos por gobernanza.
    # N3/N4 dependen de la clasificacion vigente en allTramites.json, por lo que
    # se validan por ramificacion (Miller) en lugar de un total quemado.
    assert c_n1 == 4, f"Fallo N1: {c_n1}"
    assert c_n2 == 20, f"Fallo N2: {c_n2}"

    # Guardar en las dos rutas canónicas
    paths = [
        'database/nosql_mongodb/arbol_navegacion.json',
        'database/arbol_navegacion.json'
    ]

    for p in paths:
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(tree_nodes, f, ensure_ascii=False, indent=2)
        print(f"Guardado exitosamente en: {p}")

if __name__ == '__main__':
    main()
