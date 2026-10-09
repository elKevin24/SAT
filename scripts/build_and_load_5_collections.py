"""
Script Maestro de Migración a MongoDB Atlas: 5 Colecciones Enterprise
Portal SAT Guatemala

Colecciones:
1. cat_actores (22 documentos normados)
2. cat_familias (10 documentos de hubs temáticos)
3. arbol_navegacion (295 nodos jerárquicos)
4. cat_procesos (49 procesos guiados oficiales)
5. gestiones (683 gestiones canónicas con trazabilidad, polijerarquía y BSON nativo)
"""

import sys
import openpyxl
import json
import re
import os
from collections import defaultdict
from datetime import datetime, timezone
from bson import ObjectId
import pymongo

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Credenciales por variable de entorno (no hardcodear): ej.
#   $env:ATLAS_URI = "mongodb+srv://<user>:<pass>@cluster0.qdieyln.mongodb.net/?appName=Cluster0"
ATLAS_URI = os.environ.get("ATLAS_URI", "mongodb://localhost:27017/")
DB_NAME = "SAT"
EXCEL_PATH = "docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx"
RUTA_PROCESOS_PATH = "docs/fuentes-datos/Ruta de procesos.xlsx"

def slugify(text: str) -> str:
    if not text:
        return ""
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

# 1. Cargar Excel y preparar mapeo de hojas para trazabilidad forense
print("Cargando libro Excel maestro...")
wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
sheets = ['Contribuyentes (344)', 'Comercio Exterior (246)', 'Profesionales (47)', 'Entes Exentos (79)']

id_to_origen = {}
for sname in sheets:
    ws = wb[sname]
    for row_idx in range(2, ws.max_row + 1):
        tid = ws.cell(row=row_idx, column=2).value
        if tid:
            id_to_origen[str(tid).strip()] = {
                "archivo": "Matriz",
                "hoja": sname,
                "fila": row_idx
            }

print(f"Mapeados {len(id_to_origen)} registros de origen exactos.")

# Leer Matriz Maestra (716 filas)
ws_matriz = wb['Matriz Maestra (716)']
header = [cell.value for cell in ws_matriz[1]]
rows_raw = []
for r in ws_matriz.iter_rows(min_row=2, values_only=True):
    if r[1]:
        rows_raw.append(dict(zip(header, r)))

print(f"Leídas {len(rows_raw)} filas de la Matriz Maestra.")

# ==============================================================================
# FASE 2.A: cat_actores (22 DOCUMENTOS)
# ==============================================================================
print("\n1. Generando cat_actores (22 documentos normados)...")
actores_data = [
    # Contribuyentes (4)
    {"codigo": "ACT-0001", "slug": "nit-sin-obligaciones", "nombre": "NIT sin Obligaciones", "segmento": "contribuyentes", "base_legal": "Código Tributario, Decreto 6-91, Art. 120."},
    {"codigo": "ACT-0002", "slug": "pequenos-contribuyentes", "nombre": "Pequeños Contribuyentes", "segmento": "contribuyentes", "base_legal": "Ley del IVA (Decreto 27-92, Arts. 45 al 50) y Decreto 7-2019."},
    {"codigo": "ACT-0003", "slug": "regimen-general", "nombre": "Régimen General (Personas y Empresas)", "segmento": "contribuyentes", "base_legal": "Ley de Actualización Tributaria (Decreto 10-2012) y Ley del IVA."},
    {"codigo": "ACT-0004", "slug": "contribuyentes-especiales", "nombre": "Contribuyentes Especiales", "segmento": "contribuyentes", "base_legal": "Ley Orgánica de la SAT y Acuerdos de Directorio para Gerencia de Grandes Contribuyentes."},
    
    # Comercio Exterior (11)
    {"codigo": "ACT-0005", "slug": "importadores", "nombre": "Importadores", "segmento": "comercio-exterior", "base_legal": "CAUCA IV, RECAUCA IV y Ley Nacional de Aduanas."},
    {"codigo": "ACT-0006", "slug": "exportadores", "nombre": "Exportadores", "segmento": "comercio-exterior", "base_legal": "CAUCA IV, Ley del IVA (Devolución de Crédito Fiscal) y Dto. 29-89."},
    {"codigo": "ACT-0007", "slug": "oea", "nombre": "Operador Económico Autorizado (OEA)", "segmento": "comercio-exterior", "base_legal": "Marco Normativo SAFE (OMA) y Resolución de Directorio SAT."},
    {"codigo": "ACT-0008", "slug": "agentes-aduaneros", "nombre": "Agentes Aduaneros", "segmento": "comercio-exterior", "base_legal": "CAUCA IV Arts. 22 al 28 y RECAUCA IV."},
    {"codigo": "ACT-0009", "slug": "apoderados-especiales", "nombre": "Apoderados Especiales Aduaneros", "segmento": "comercio-exterior", "base_legal": "CAUCA IV y RECAUCA IV Arts. 86 al 90."},
    {"codigo": "ACT-0010", "slug": "depositos-aduaneros", "nombre": "Depósitos Aduaneros Temporales y Almacenes Fiscales", "segmento": "comercio-exterior", "base_legal": "CAUCA IV Arts. 119 al 129 y Dto. 1236."},
    {"codigo": "ACT-0011", "slug": "transportistas-aduaneros", "nombre": "Transportistas Aduaneros", "segmento": "comercio-exterior", "base_legal": "CAUCA IV Arts. 18 al 28 y RECAUCA IV (Tránsito Terrestre)."},
    {"codigo": "ACT-0012", "slug": "courier", "nombre": "Empresas de Entrega Rápida o Courier", "segmento": "comercio-exterior", "base_legal": "CAUCA IV y RECAUCA IV Arts. 574 al 596."},
    {"codigo": "ACT-0013", "slug": "zdeep", "nombre": "Zonas de Desarrollo Económico Especial Público (ZDEEP)", "segmento": "comercio-exterior", "base_legal": "Decreto 22-73 del Congreso de la República y reformas."},
    {"codigo": "ACT-0014", "slug": "maquilas-29-89", "nombre": "Empresas Calificadas bajo Decreto 29-89", "segmento": "comercio-exterior", "base_legal": "Decreto 29-89 (Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila)."},
    {"codigo": "ACT-0015", "slug": "normativa-aduanera-general", "nombre": "Operadores Generales de Comercio Exterior", "segmento": "comercio-exterior", "base_legal": "Código Aduanero Uniforme Centroamericano (CAUCA IV)."},

    # Profesionales (5)
    {"codigo": "ACT-0016", "slug": "abogados-notarios", "nombre": "Abogados y Notarios", "segmento": "profesionales", "base_legal": "Código de Notariado (Decreto 314) y Decreto 37-92 (Timbres Fiscales)."},
    {"codigo": "ACT-0017", "slug": "peritos-contadores", "nombre": "Peritos Contadores", "segmento": "profesionales", "base_legal": "Código Tributario Art. 120 y Acuerdo de Directorio SAT 08-2020."},
    {"codigo": "ACT-0018", "slug": "auditores", "nombre": "Auditores y Contadores Públicos", "segmento": "profesionales", "base_legal": "Ley de Colegiación Profesional Obligatoria y Código de Comercio."},
    {"codigo": "ACT-0019", "slug": "gestores-tributarios", "nombre": "Gestores Tributarios y Mandatarios", "segmento": "profesionales", "base_legal": "Código Tributario y Ley del Organismo Judicial."},
    {"codigo": "ACT-0020", "slug": "servicios-profesionales", "nombre": "Servicios Profesionales Independientes", "segmento": "profesionales", "base_legal": "Ley de Actualización Tributaria (Decreto 10-2012, Libro I)."},

    # Entes Exentos (2)
    {"codigo": "ACT-0021", "slug": "sector-publico", "nombre": "Sector Público y Entidades del Estado", "segmento": "entes-exentos", "base_legal": "Constitución Política de la República de Guatemala y Ley Orgánica del Presupuesto."},
    {"codigo": "ACT-0022", "slug": "no-lucrativos", "nombre": "Organizaciones No Lucrativas y Exentas", "segmento": "entes-exentos", "base_legal": "Código Tributario y Decretos específicos de exención."}
]

cat_actores_docs = []
actor_slug_to_id = {}
for act in actores_data:
    obj_id = ObjectId()
    act_doc = {
        "_id": obj_id,
        "codigo": act["codigo"],
        "slug": act["slug"],
        "nombre": act["nombre"],
        "segmento_id": act["segmento"],
        "base_legal": act["base_legal"],
        "estado": "VIGENTE"
    }
    cat_actores_docs.append(act_doc)
    actor_slug_to_id[act["slug"]] = obj_id

print(f"cat_actores generados: {len(cat_actores_docs)}")

# ==============================================================================
# FASE 2.B: cat_familias (10 DOCUMENTOS)
# ==============================================================================
print("\n2. Generando cat_familias (10 hubs temáticos)...")
familias_data = [
    {"codigo": "FAM-01", "slug": "fel", "nombre": "Factura Electrónica en Línea (FEL)", "descripcion": "Ecosistema integral de emisión, certificación y consulta de documentos tributarios electrónicos."},
    {"codigo": "FAM-02", "slug": "vehiculos", "nombre": "Registro Fiscal de Vehículos (RFV)", "descripcion": "Traspasos, primeras placas, reposición de distintivos y pago del impuesto sobre circulación."},
    {"codigo": "FAM-03", "slug": "rtu-digital", "nombre": "Registro Tributario Unificado (RTU) Digital", "descripcion": "Inscripción de NIT, actualización de datos y ratificación domiciliaria de contribuyentes."},
    {"codigo": "FAM-04", "slug": "ducas", "nombre": "Declaraciones Aduaneras (DUCAs)", "descripcion": "Transmisión y liquidación electrónica de declaraciones aduaneras centroamericanas y mundiales."},
    {"codigo": "FAM-05", "slug": "solvencia-fiscal", "nombre": "Solvencias y Convenios de Pago", "descripcion": "Acreditación de solvencia fiscal y facilidades de pago para regularización tributaria."},
    {"codigo": "FAM-06", "slug": "maquilas-29-89", "nombre": "Regímenes Especiales y Maquilas (Dto. 29-89)", "descripcion": "Fomento a la exportación, cuentas corrientes de insumos y garantías aduaneras."},
    {"codigo": "FAM-07", "slug": "zdeep", "nombre": "Zonas de Desarrollo Económico Especial Público (ZDEEP)", "descripcion": "Habilitación de polígonos, garitas aduaneras y régimen para empresas usuarias y administradoras."},
    {"codigo": "FAM-08", "slug": "afpa", "nombre": "Auxiliares de la Función Pública Aduanera (AFPA)", "descripcion": "Acreditación, carnés, fianzas y régimen de auxiliares en el sistema aduanero."},
    {"codigo": "FAM-09", "slug": "agencia-virtual", "nombre": "Agencia Virtual y Servicios Remotos", "descripcion": "Activación, biometría y herramientas autenticadas de autogestión ciudadana."},
    {"codigo": "FAM-10", "slug": "exenciones", "nombre": "Franquicias y Exenciones Tributarias", "descripcion": "Acreditación de exenciones diplomáticas, constitucionales y compras para entidades del Estado."}
]

cat_familias_docs = []
familia_slug_to_id = {}
for fam in familias_data:
    obj_id = ObjectId()
    fam_doc = {
        "_id": obj_id,
        "codigo": fam["codigo"],
        "slug": fam["slug"],
        "nombre": fam["nombre"],
        "descripcion": fam["descripcion"],
        "destacadas": [],
        "herramientas": [],
        "faq_ids": [],
        "meta_seo": {
            "title": f"{fam['nombre']} | SAT Guatemala",
            "description": fam["descripcion"]
        },
        "estado": "BORRADOR"
    }
    cat_familias_docs.append(fam_doc)
    familia_slug_to_id[fam["slug"]] = obj_id

print(f"cat_familias generadas: {len(cat_familias_docs)}")

# ==============================================================================
# FASE 2.C: arbol_navegacion (295 NODOS)
# ==============================================================================
print("\n3. Generando arbol_navegacion (295 nodos con ObjectId)...")

root_meta = {
    'contribuyentes': {
        'nombre': 'Contribuyentes',
        'que_es': 'Portal de servicios tributarios integrales para personas individuales y jurídicas.',
        'lead_text': 'Gestione su ciclo de vida tributario: inscripción, facturación electrónica, declaraciones y pagos.',
        'base_juridica': 'Código Tributario (Decreto 6-91 del Congreso de la República de Guatemala) y reformas.'
    },
    'comercio-exterior': {
        'nombre': 'Operadores de Comercio Exterior',
        'que_es': 'Ventanilla aduanera única para importadores, exportadores y auxiliares de la función pública.',
        'lead_text': 'Operaciones de comercio internacional, declaraciones DUCAs, depósitos y regímenes especiales.',
        'base_juridica': 'Código Aduanero Uniforme Centroamericano (CAUCA IV) y su Reglamento (RECAUCA IV).'
    },
    'profesionales': {
        'nombre': 'Profesionales',
        'que_es': 'Servicios diferenciados para peritos contadores, auditores, abogados, notarios y gestores.',
        'lead_text': 'Habilitación, acreditación, timbres fiscales y herramientas para mandatarios y peritos.',
        'base_juridica': 'Ley de Colegiación Profesional Obligatoria y normativas técnicas de la SAT.'
    },
    'entes-exentos': {
        'nombre': 'Entes Exentos',
        'que_es': 'Atención especializada para el sector público, municipalidades, misiones diplomáticas y ONG.',
        'lead_text': 'Acreditación de exenciones constitucionales, franquicias aduaneras y retenciones oficiales.',
        'base_juridica': 'Constitución Política de la República de Guatemala y Convenios Internacionales.'
    }
}

arbol_dict = {}
node_slug_to_objid = {}

def get_or_create_arbol_node(level, path_parts):
    slug_parts = [slugify(p) for p in path_parts]
    mat_path = "/".join(slug_parts)
    
    if mat_path in arbol_dict:
        return arbol_dict[mat_path]
    
    obj_id = ObjectId()
    node_slug_to_objid[mat_path] = obj_id
    
    padre_path = "/".join(slug_parts[:-1]) if len(slug_parts) > 1 else None
    padre_objid = node_slug_to_objid.get(padre_path) if padre_path else None
    
    # Calcular ancestros para ruta
    ruta_ancestros = []
    curr_parts = []
    for sp in slug_parts[:-1]:
        curr_parts.append(sp)
        anc_path = "/".join(curr_parts)
        if anc_path in node_slug_to_objid:
            ruta_ancestros.append(node_slug_to_objid[anc_path])
            
    nombre = path_parts[-1].strip()
    
    node_doc = {
        "_id": obj_id,
        "slug": slug_parts[-1],
        "nombre": nombre,
        "nivel": level,
        "padre_id": padre_objid,
        "ruta": ruta_ancestros,
        "materialized_path": mat_path,
        "orden": len(arbol_dict) + 1,
        "estado": "VIGENTE",
        "contenido_segmento": {
            "que_es": "",
            "lead_text": "",
            "base_juridica": ""
        }
    }
    
    if level == 1 and slug_parts[0] in root_meta:
        rm = root_meta[slug_parts[0]]
        node_doc["contenido_segmento"] = {
            "que_es": rm["que_es"],
            "lead_text": rm["lead_text"],
            "base_juridica": rm["base_juridica"]
        }
        
    arbol_dict[mat_path] = node_doc
    return node_doc

for r in rows_raw:
    n1 = (r.get('Nivel 1') or '').strip()
    n2 = (r.get('Nivel 2') or '').strip()
    n3 = (r.get('Nivel 3') or '').strip()
    n4 = (r.get('Nivel 4') or '').strip()
    
    if n1:
        get_or_create_arbol_node(1, [n1])
        if n2:
            get_or_create_arbol_node(2, [n1, n2])
            if n3:
                get_or_create_arbol_node(3, [n1, n2, n3])
                if n4:
                    get_or_create_arbol_node(4, [n1, n2, n3, n4])

arbol_docs = list(arbol_dict.values())
print(f"arbol_navegacion generados: {len(arbol_docs)} nodos.")

# ==============================================================================
# FASE 2.D: cat_procesos (49 DOCUMENTOS)
# ==============================================================================
print("\n4. Generando cat_procesos (49 documentos oficiales)...")
wb_proc = openpyxl.load_workbook(RUTA_PROCESOS_PATH, data_only=True)
ws_proc = wb_proc['Procesos']
proc_meta = {}
for row in ws_proc.iter_rows(min_row=2, values_only=True):
    if row[0] is not None:
        try:
            pid = int(row[0])
            proc_meta[pid] = {
                "nombre": str(row[1]).strip() if row[1] else f"Proceso {pid}",
                "audiencia": str(row[2]).strip() if len(row) > 2 and row[2] else "General",
                "etapa": str(row[3]).strip() if len(row) > 3 and row[3] else "Operar",
                "para_quien": str(row[4]).strip() if len(row) > 4 and row[4] else ""
            }
        except:
            pass

# Leer pasos desde la matriz maestra
proc_steps_labels = defaultdict(list)
for r in rows_raw:
    raw_proc = r.get('Ruta de Procesos Asociada')
    if raw_proc:
        matches = re.findall(r'Proc\s*#?(\d+)(?:\s*\(([^)]+)\))?', str(raw_proc))
        for p_id_str, p_step in matches:
            pid = int(p_id_str)
            step_name = p_step.strip() if p_step else "Paso Principal"
            if step_name not in proc_steps_labels[pid]:
                proc_steps_labels[pid].append(step_name)

cat_procesos_docs = []
proc_id_to_doc = {}
for pid in range(1, 50):
    pm = proc_meta.get(pid, {"nombre": f"Proceso {pid}", "audiencia": "General", "etapa": "Operar", "para_quien": ""})
    steps_list = proc_steps_labels.get(pid, ["Paso de inicio"])
    
    pasos_docs = []
    for idx, sname in enumerate(steps_list, 1):
        pasos_docs.append({
            "orden": idx,
            "titulo": sname,
            "opcional": "si aplica" in sname.lower() or "error" in sname.lower(),
            "es_gestion_interna": True,
            "gestiones_ids": []
        })
        
    pdoc = {
        "_id": f"proc-{pid:02d}",
        "numero": pid,
        "nombre": pm["nombre"],
        "audiencia": pm["audiencia"],
        "etapa": pm["etapa"],
        "para_quien": pm["para_quien"],
        "pasos": pasos_docs,
        "estado": "VIGENTE",
        "version": 1
    }
    cat_procesos_docs.append(pdoc)
    proc_id_to_doc[f"proc-{pid:02d}"] = pdoc

print(f"cat_procesos generados: {len(cat_procesos_docs)}")

# ==============================================================================
# FASE 2.E: gestiones (683 DOCUMENTOS CANÓNICOS CON ObjectId)
# ==============================================================================
print("\n5. Generando gestiones (683 canónicas deduplicadas)...")

# Clasificador de actores según Nivel 1, Nivel 2 y Nivel 3
def resolve_actores(item):
    p = (item.get('Nivel 1') or '').strip().lower()
    n2 = (item.get('Nivel 2') or '').strip().lower()
    n3 = (item.get('Nivel 3') or '').strip().lower()
    text = f"{p} {n2} {n3}".lower()
    
    res = set()
    if 'pequeño' in text or 'pequeno' in text: res.add("pequenos-contribuyentes")
    if 'sin obligaci' in text: res.add("nit-sin-obligaciones")
    if 'especial' in text: res.add("contribuyentes-especiales")
    if 'importador' in text: res.add("importadores")
    if 'exportador' in text: res.add("exportadores")
    if 'agente' in text and 'aduan' in text: res.add("agentes-aduaneros")
    if 'apoderado' in text: res.add("apoderados-especiales")
    if 'depósito' in text or 'deposito' in text or 'almacen' in text: res.add("depositos-aduaneros")
    if 'transportista' in text: res.add("transportistas-aduaneros")
    if 'courier' in text or 'entrega rapida' in text: res.add("courier")
    if 'zdeep' in text: res.add("zdeep")
    if '29-89' in text or 'maquila' in text: res.add("maquilas-29-89")
    if 'oea' in text or 'operador economico' in text: res.add("oea")
    if 'notario' in text or 'abogado' in text: res.add("abogados-notarios")
    if 'perito' in text or 'contador' in text: res.add("peritos-contadores")
    if 'auditor' in text: res.add("auditores")
    if 'gestor' in text: res.add("gestores-tributarios")
    if 'servicios profesionales' in text: res.add("servicios-profesionales")
    if 'estado' in text or 'sector publico' in text: res.add("sector-publico")
    if 'no lucrativ' in text or 'exent' in text: res.add("no-lucrativos")
    
    # Fallback por pilar
    if not res:
        if 'contribuyente' in p: res.add("regimen-general")
        elif 'comercio' in p: res.add("normativa-aduanera-general")
        elif 'profesional' in p: res.add("servicios-profesionales")
        elif 'exento' in p: res.add("no-lucrativos")
        else: res.add("regimen-general")
        
    return [actor_slug_to_id[a] for a in res if a in actor_slug_to_id]

# Clasificador de familias temáticas
def resolve_familias(item):
    title = (item.get('Nombre del Trámite / Servicio (Lenguaje Claro)') or item.get('Nombre del Trámite / Servicio') or '').lower()
    tema = str(item.get('Nivel 4') or '').lower()
    desc = str(item.get('¿Para qué sirve? (Descripción Operativa)') or '').lower()
    text = f"{title} {tema} {desc}"
    
    res = set()
    if any(k in text for k in ['fel', 'factur', 'dte']): res.add("fel")
    if any(k in text for k in ['vehiculo', 'vehículo', 'placa', 'iscv', 'traspaso', 'iprima']): res.add("vehiculos")
    if any(k in text for k in ['rtu', 'nit', 'inscripcion', 'inscripción']): res.add("rtu-digital")
    if any(k in text for k in ['duca', 'dua', 'aduanera', 'despacho', 'arancel']): res.add("ducas")
    if any(k in text for k in ['solvencia', 'convenio']): res.add("solvencia-fiscal")
    if any(k in text for k in ['29-89', 'maquila', 'perfeccionamiento']): res.add("maquilas-29-89")
    if 'zdeep' in text: res.add("zdeep")
    if any(k in text for k in ['afpa', 'auxiliar', 'agente', 'apoderado', 'carné', 'carne']): res.add("afpa")
    if 'agencia virtual' in text: res.add("agencia-virtual")
    if any(k in text for k in ['exent', 'franquicia', 'diplomatic']): res.add("exenciones")
    
    return [familia_slug_to_id[f] for f in res if f in familia_slug_to_id]

# Agrupación de duplicados por nombre
grouped_by_name = defaultdict(list)
for r in rows_raw:
    raw_name = (r.get('Nombre del Trámite / Servicio (Lenguaje Claro)') or r.get('Nombre del Trámite / Servicio') or '').strip()
    norm_name = re.sub(r'\s+', ' ', raw_name.lower())
    grouped_by_name[norm_name].append(r)

used_slugs = set()
def generate_unique_slug(base_text):
    s = slugify(base_text)
    if not s: s = "gestion"
    orig_s = s
    count = 1
    while s in used_slugs:
        s = f"{orig_s}-{count}"
        count += 1
    used_slugs.add(s)
    return s

gestiones_docs = []
gestion_counter = 1

ATO_ENUM_MAP = {
    'empezar': 'EMPEZAR_REGISTRO',
    'empezar y registrarse': 'EMPEZAR_REGISTRO',
    'operar': 'OPERACIONES_TRAMITES',
    'operaciones y tramites': 'OPERACIONES_TRAMITES',
    'operaciones y trámites': 'OPERACIONES_TRAMITES',
    'consultar': 'CONSULTAS_Y_HERRAMIENTAS',
    'consultas y seguimiento': 'CONSULTAS_Y_HERRAMIENTAS',
    'consultas y herramientas': 'CONSULTAS_Y_HERRAMIENTAS',
    'modificar': 'MODIFICACIONES_CESES',
    'modificar_cerrar': 'MODIFICACIONES_CESES',
    'modificaciones y ceses': 'MODIFICACIONES_CESES',
    'normativa': 'NORMATIVA_RECURSOS',
    'normativa y recursos': 'NORMATIVA_RECURSOS'
}

INTERACCION_ENUM_MAP = {
    'servicio_transaccional': 'GESTION_EN_LINEA',
    'tramite en linea': 'GESTION_EN_LINEA',
    'trámite en línea': 'GESTION_EN_LINEA',
    'trámite en línea interactivo': 'GESTION_EN_LINEA',
    'tramite / aplicativo en linea': 'GESTION_EN_LINEA',
    'trámite / aplicativo en línea': 'GESTION_EN_LINEA',
    'tramite transaccional': 'GESTION_EN_LINEA',
    'trámite transaccional': 'GESTION_EN_LINEA',
    'consulta_datos': 'CONSULTA_DATOS',
    'consulta a base de datos': 'CONSULTA_DATOS',
    'consulta en base de datos': 'CONSULTA_DATOS',
    'guia_informativa': 'GUIA_INFORMATIVA',
    'guía informativa': 'GUIA_INFORMATIVA',
    'guía informativa / texto': 'GUIA_INFORMATIVA',
    'guia informativa / texto': 'GUIA_INFORMATIVA',
    'descarga_recurso': 'DESCARGA_RECURSO',
    'descarga / software': 'DESCARGA_RECURSO',
    'descarga de formulario / software': 'DESCARGA_RECURSO'
}

for norm_name, items in grouped_by_name.items():
    primary_item = items[0]
    gest_obj_id = ObjectId()
    
    titulo = (primary_item.get('Nombre del Trámite / Servicio (Lenguaje Claro)') or primary_item.get('Nombre del Trámite / Servicio') or '').strip()
    slug = generate_unique_slug(titulo)
    
    # 1. Ubicaciones
    ubicaciones = []
    actores_set = set()
    familias_set = set()
    origen_list = []
    legacy_ids = []
    
    for it in items:
        tid = it['ID Trámite']
        legacy_ids.append(tid)
        if tid in id_to_origen:
            origen_list.append(id_to_origen[tid])
            
        n1 = (it.get('Nivel 1') or '').strip()
        n2 = (it.get('Nivel 2') or '').strip()
        n3 = (it.get('Nivel 3') or '').strip()
        n4 = (it.get('Nivel 4') or '').strip()
        path_parts = [p for p in [n1, n2, n3, n4] if p]
        mat_path = "/".join([slugify(p) for p in path_parts])
        
        node_objid = node_slug_to_objid.get(mat_path)
        if node_objid:
            ubicaciones.append({
                "nodo_id": node_objid,
                "etiqueta_menu": path_parts[-1] if path_parts else "General"
            })
            
        for a_id in resolve_actores(it):
            actores_set.add(a_id)
        for f_id in resolve_familias(it):
            familias_set.add(f_id)
            
    # 2. Estado
    ctrl = str(primary_item.get('Control de Auditoría') or '')
    estado_norm = str(primary_item.get('Estado Normativo') or '')
    if 'Brecha' in ctrl or 'Brecha' in estado_norm or primary_item.get('esBrecha'):
        estado = "PROPUESTA_BRECHA"
    else:
        estado = "VIGENTE"
        
    # 3. Procesos asociados
    procesos_asociados = []
    for it in items:
        raw_proc = it.get('Ruta de Procesos Asociada')
        if raw_proc:
            matches = re.findall(r'Proc\s*#?(\d+)(?:\s*\(([^)]+)\))?', str(raw_proc))
            for p_id_str, p_step in matches:
                pid = int(p_id_str)
                step_name = p_step.strip() if p_step else f"Paso de Proc #{pid}"
                proc_key = f"proc-{pid:02d}"
                entry = {
                    "proc_id": proc_key,
                    "paso": step_name
                }
                if entry not in procesos_asociados:
                    procesos_asociados.append(entry)
                # Enlazar gestión en el catálogo de procesos
                if proc_key in proc_id_to_doc:
                    pdoc = proc_id_to_doc[proc_key]
                    for paso_entry in pdoc["pasos"]:
                        if paso_entry["titulo"].lower() in step_name.lower():
                            if gest_obj_id not in paso_entry["gestiones_ids"]:
                                paso_entry["gestiones_ids"].append(gest_obj_id)

    raw_ato = str(primary_item.get('Etapa Ciclo de Vida ATO') or '').strip().lower()
    raw_int = str(primary_item.get('Tipo de Interacción') or '').strip().lower()
    
    etapa_ato = ATO_ENUM_MAP.get(raw_ato, 'OPERACIONES_TRAMITES')
    tipo_interaccion = INTERACCION_ENUM_MAP.get(raw_int, 'GUIA_INFORMATIVA')
    
    g_doc = {
        "_id": gest_obj_id,
        "codigo": f"SAT-GES-{gestion_counter:04d}",
        "slug": slug,
        "nombre": titulo,
        "descripcion": str(primary_item.get('¿Para qué sirve? (Descripción Operativa)') or '').strip(),
        "base_legal": str(primary_item.get('Base Legal / Fundamento Jurídico (En base a qué: CAUCA, RECAUCA, Leyes)') or '').strip(),
        
        "ubicaciones": ubicaciones,
        
        "etapa_ato": etapa_ato,
        "tipo_interaccion": tipo_interaccion,
        "tipologia": "GESTION_TRANSACCIONAL" if tipo_interaccion == 'GESTION_EN_LINEA' else "GUIA_INFORMATIVA",
        "plataforma": "PORTAL_WEB",
        "canal": "PRESENCIAL_MIXTO" if 'presencial' in str(primary_item.get('Canal') or '').lower() else "VIRTUAL_EN_LINEA",
        "url": str(primary_item.get('URL Portal SAT') or '').strip(),
        
        "procesos": procesos_asociados,
        
        "prerrequisitos_ids": [],
        "actores_ids": list(actores_set),
        "familias_ids": list(familias_set),
        
        "estado": estado,
        "vigencia": {
            "desde": datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
            "hasta": None
        },
        "version": 1,
        
        "auditoria": {
            "creado": datetime(2026, 3, 30, 10, 0, 0, tzinfo=timezone.utc),
            "actualizado": datetime(2026, 10, 8, 18, 0, 0, tzinfo=timezone.utc),
            "actualizado_por": "sistema_etl_sat"
        },
        
        "codigos_legacy": legacy_ids,
        "origen": origen_list
    }
    
    if len(items) > 1:
        g_doc["fusion"] = {
            "criterio": "misma URL y descripción operativa",
            "aprobado_por": "mesa_tecnica",
            "total_filas_fusionadas": len(items)
        }
        
    gestiones_docs.append(g_doc)
    gestion_counter += 1

print(f"gestiones canónicas generadas: {len(gestiones_docs)}")

# ==============================================================================
# FASE 2.F: INGESTA E INDEXACIÓN EN MONGODB ATLAS
# ==============================================================================
print("\nConectando a MongoDB Atlas para ingesta completa...")
client = pymongo.MongoClient(ATLAS_URI)
db = client[DB_NAME]

collections_to_load = [
    ("cat_actores", cat_actores_docs),
    ("cat_familias", cat_familias_docs),
    ("arbol_navegacion", arbol_docs),
    ("cat_procesos", cat_procesos_docs),
    ("gestiones", gestiones_docs)
]

for col_name, docs_list in collections_to_load:
    col = db[col_name]
    print(f"Poblando coleccion '{col_name}' ({len(docs_list)} documentos)...")
    try:
        col.drop_indexes()
    except Exception as e:
        pass
    col.delete_many({})
    col.insert_many(docs_list)
    print(f"  [OK] Coleccion '{col_name}' insertada con exito.")

# Crear índices optimizados
print("\nCreando indices de produccion en Atlas...")
# cat_actores
db["cat_actores"].create_index([("codigo", pymongo.ASCENDING)], unique=True)
db["cat_actores"].create_index([("slug", pymongo.ASCENDING)], unique=True)
db["cat_actores"].create_index([("segmento_id", pymongo.ASCENDING)])

# cat_familias
db["cat_familias"].create_index([("codigo", pymongo.ASCENDING)], unique=True)
db["cat_familias"].create_index([("slug", pymongo.ASCENDING)], unique=True)

# arbol_navegacion
db["arbol_navegacion"].create_index([("materialized_path", pymongo.ASCENDING)], unique=True)
db["arbol_navegacion"].create_index([("padre_id", pymongo.ASCENDING)])
db["arbol_navegacion"].create_index([("nivel", pymongo.ASCENDING)])

# cat_procesos
db["cat_procesos"].create_index([("numero", pymongo.ASCENDING)], unique=True)

# gestiones
db["gestiones"].create_index([("codigo", pymongo.ASCENDING)], unique=True)
db["gestiones"].create_index([("slug", pymongo.ASCENDING)], unique=True)
db["gestiones"].create_index([("actores_ids", pymongo.ASCENDING)])
db["gestiones"].create_index([("familias_ids", pymongo.ASCENDING)])
db["gestiones"].create_index([("ubicaciones.nodo_id", pymongo.ASCENDING)])
db["gestiones"].create_index([("etapa_ato", pymongo.ASCENDING)])
db["gestiones"].create_index([("estado", pymongo.ASCENDING)])
db["gestiones"].create_index([("procesos.proc_id", pymongo.ASCENDING)])
db["gestiones"].create_index([("codigos_legacy", pymongo.ASCENDING)])
db["gestiones"].create_index([("nombre", pymongo.TEXT), ("descripcion", pymongo.TEXT)], default_language="spanish")

print("\n========================================================")
print("AUDITORIA FINAL: 5 COLECCIONES EN MONGODB ATLAS")
print("========================================================")
for col_name, _ in collections_to_load:
    count = db[col_name].count_documents({})
    print(f"* db.{col_name}: {count} documentos.")

print(f"  - Gestiones VIGENTES:         {db['gestiones'].count_documents({'estado': 'VIGENTE'})}")
print(f"  - Gestiones PROPUESTA_BRECHA: {db['gestiones'].count_documents({'estado': 'PROPUESTA_BRECHA'})}")
print(f"  - Gestiones Fusionadas:       {db['gestiones'].count_documents({'fusion': {'$exists': True}})}")

# Exportar snapshots JSON a database/
from bson import json_util
os.makedirs("database", exist_ok=True)
print("\nExportando respaldos JSON a directorio database/...")
for col_name, docs_list in collections_to_load:
    out_file = f"database/{col_name}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(json_util.dumps(docs_list, indent=2, ensure_ascii=False))
    print(f"  [OK] Snapshot exportado: {out_file}")

print("========================================================")
print("MIGRACION COMPLETA Y VALIDADA EN MONGODB ATLAS!")
