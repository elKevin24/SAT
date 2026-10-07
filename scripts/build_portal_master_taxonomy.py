import json, re

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
COMERCIO_EXTERIOR_PATH = 'src/data/comercioExteriorData.json'
OUTPUT_MASTER_JSON = 'src/data/portalMasterTaxonomy.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    all_raw = json.load(f)

with open(COMERCIO_EXTERIOR_PATH, 'r', encoding='utf-8') as f:
    ce_data = json.load(f)

# Helper para normalizar texto
def clean(t):
    if not t: return ''
    t = t.replace('\xa0', ' ').replace('\r', ' ').replace('\n', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# Clasificación de etapa inspirada en ATO (Australian Taxation Office)
def classify_ato_stage(tramite, subcategoria, tema, subtema):
    text = f"{tramite} {subcategoria} {tema} {subtema}".lower()
    
    # 4. Modificar o Cerrar (Changing or Closing)
    if any(k in text for k in ['cese', 'cerrar', 'cierre', 'suspensión', 'suspension', 'cancelación', 'cancelacion', 'fallecimiento', 'inactivación', 'inactivacion', 'baja', 'actualización', 'actualizacion', 'cambio de régimen', 'cambio de regimen', 'modificación', 'modificacion']):
        return 'modificar_cerrar', 'Modificaciones y cierre'
        
    # 1. Empezar y registrarse (Starting out / Inscription)
    if any(k in text for k in ['inscripción', 'inscripcion', 'primer nit', 'primera vez', 'solicitar nit', 'habilitación', 'habilitacion', 'acreditación', 'acreditacion', 'autorización inicial', 'afiliación', 'afiliacion', 'registro de títulos', 'registro inicial']):
        return 'empezar', 'Empezar y registrarse'
        
    # 3. Consultas y herramientas (Calculators, Lookups & Verification)
    if any(k in text for k in ['consulta', 'consultar', 'verificador', 'verificación', 'verificacion', 'solvencia fiscal', 'estado de cuenta', 'rampa', 'retención', 'retencion', 'liberación', 'liberacion', 'monitoreo', 'arancel integrado', 'manifiesto', 'sistema de cobro']):
        return 'consultar', 'Consultas y herramientas'
        
    # 5. Normativa y asistencia (Legal & Guidance)
    if any(k in text for k in ['legislación', 'legislacion', 'preguntas frecuentes', 'capacitación', 'capacitacion', 'devolución de crédito', 'devolucion', 'devolución de dai', 'impugnación', 'recursos administrativos', 'criterios institucionales', 'normas']):
        return 'normativa', 'Normativa y asistencia'
        
    # 2. Operación y declaraciones (Operating & Lodging) por defecto
    return 'operar', 'Operación y declaraciones'

# Clasificación de tipo de interacción (ATO / GOV.UK Content Types)
def classify_interaction_type(tramite, url):
    t = tramite.lower()
    u = url.lower()
    
    if any(k in t for k in ['activex', 'software', 'descarga', 'instalador', 'componente']):
        return 'descarga_recurso', 'Descarga / Software'
        
    if any(k in t for k in ['consulta', 'consultar', 'rampa', 'retención', 'retencion', 'liberación', 'liberacion', 'monitoreo', 'arancel integrado', 'manifiesto', 'verificador', 'estado de cuenta']):
        return 'consulta_datos', 'Consulta a Base de Datos'
        
    if any(k in t for k in ['declaración', 'declaracion', 'duca', 'solvencia fiscal', 'seguro de caución', 'fianza', 'inscripción', 'inscripcion', 'renovación', 'renovacion', 'franquicias electrónicas', 'transmisión', 'transmision', 'formulario declaraguate', 'sat-', 'solicitud electrónica', 'agencia virtual', 'factura electrónica', 'fel', 'traspaso']):
        return 'servicio_transaccional', 'Trámite / Aplicativo en Línea'
        
    return 'guia_informativa', 'Guía Informativa / Texto'

master_items = []

# 1. Incorporar los 161 de Comercio Exterior ya refinados
for ce in ce_data:
    stage_id, stage_lbl = classify_ato_stage(ce['tramite'], ce['actorNombre'], ce['subtemaLabel'], ce['temaEspecializado'] or '')
    master_items.append({
        'id': ce['id'],
        'macrogrupo': 'comercio_exterior',
        'macrogrupoNombre': 'Operadores de Comercio Exterior',
        'grupoNo': ce['grupoNo'],
        'grupoCodigo': ce['grupoCodigo'],
        'grupoNombre': ce['grupoNombre'],
        'actorNombre': ce['actorNombre'],
        'subtemaLabel': ce['subtemaLabel'],
        'etapaAto': stage_id,
        'etapaAtoLabel': stage_lbl,
        'tipoInteraccion': ce['tipoInteraccion'],
        'tipoInteraccionLabel': ce['tipoInteraccionLabel'],
        'tramite': ce['tramite'],
        'tramiteOriginal': ce['tramiteOriginal'],
        'descripcion': ce['descripcion'],
        'url': ce['url'],
        'esBrecha': ce['esBrecha']
    })

# 2. Incorporar Contribuyentes, Profesionales y Entes Exentos de allTramites.json
non_ce = [t for t in all_raw if t.get('pillar') != 'comercio_exterior']

for idx, t in enumerate(non_ce):
    pillar = t.get('pillar', 'contribuyentes')
    cat = clean(t.get('categoria', ''))
    subcat = clean(t.get('subcategoria', ''))
    tema = clean(t.get('tema', ''))
    subtema = clean(t.get('subtema', ''))
    nombre = clean(t.get('tramite', ''))
    desc = clean(t.get('descripcion', ''))
    url = clean(t.get('url', ''))
    
    # Asignación de Grupo Oficial (1 al 9)
    if pillar == 'contribuyentes':
        macro_nombre = 'Contribuyentes'
        if 'nit sin' in cat.lower():
            g_no = 1
            g_nombre = 'NIT sin Obligaciones'
        elif 'pequeño' in cat.lower():
            g_no = 2
            g_nombre = 'Pequeños Contribuyentes'
        elif 'especial' in cat.lower():
            g_no = 4
            g_nombre = 'Contribuyentes Especiales'
        else:
            g_no = 3
            g_nombre = 'Contribuyente General'
        actor = subcat or cat
    elif pillar == 'profesionales':
        macro_nombre = 'Profesionales'
        g_no = 7
        g_nombre = 'Profesionales'
        actor = cat or 'Servicios Profesionales'
    else: # entes_exentos
        macro_nombre = 'Entes Exentos'
        if 'estado' in cat.lower():
            g_no = 9
            g_nombre = 'Entidades del Estado'
        else:
            g_no = 6
            g_nombre = 'Exentos'
        actor = cat
        
    stage_id, stage_lbl = classify_ato_stage(nombre, subcat, tema, subtema)
    int_id, int_lbl = classify_interaction_type(nombre, url)
    
    # Mejora de UX Writing en títulos
    titulo_limpio = nombre
    if 'cese definitivo de actividades' in nombre.lower():
        titulo_limpio = 'Cancelar o suspender mi negocio (Cese definitivo en RTU)'
    elif 'inscripción y actualización de peritos contadores' in nombre.lower():
        titulo_limpio = 'Inscribirse o actualizar datos como Perito Contador'
    elif 'traspaso electrónico de vehículos por notario' in nombre.lower():
        titulo_limpio = 'Traspaso electrónico de vehículos (Gestión por Notario)'
        
    # Enriquecer descripción si es circular
    if not desc or desc.lower() == nombre.lower() or 'información sobre:' in desc.lower():
        desc = f'Guía y requisitos oficiales para {nombre.lower()} ante la SAT Guatemala.'
        
    item_id = f'{pillar}-{g_no}-{idx+1:04d}'
    
    master_items.append({
        'id': item_id,
        'macrogrupo': pillar,
        'macrogrupoNombre': macro_nombre,
        'grupoNo': g_no,
        'grupoCodigo': f'Grupo {g_no}',
        'grupoNombre': g_nombre,
        'actorNombre': actor,
        'subtemaLabel': subcat or tema or 'General',
        'etapaAto': stage_id,
        'etapaAtoLabel': stage_lbl,
        'tipoInteraccion': int_id,
        'tipoInteraccionLabel': int_lbl,
        'tramite': titulo_limpio,
        'tramiteOriginal': nombre,
        'descripcion': desc,
        'url': url or 'https://portal.sat.gob.gt/portal/',
        'esBrecha': False
    })

with open(OUTPUT_MASTER_JSON, 'w', encoding='utf-8') as f:
    json.dump(master_items, f, ensure_ascii=False, indent=2)

print(f'EXITO: Exportados {len(master_items)} ítems en {OUTPUT_MASTER_JSON}')

# Stats
from collections import Counter
print('\nDistribución por Macrogrupo:')
for k, v in Counter(x['macrogrupoNombre'] for x in master_items).items():
    print(f'  {k}: {v}')

print('\nDistribución por Grupo Oficial (1 al 9):')
for k, v in sorted(Counter(x['grupoNo'] for x in master_items).items()):
    sample = [x['grupoNombre'] for x in master_items if x['grupoNo'] == k][0]
    print(f'  Grupo {k} ({sample}): {v}')

print('\nDistribución por Etapa ATO:')
for k, v in Counter(x['etapaAtoLabel'] for x in master_items).items():
    print(f'  {k}: {v}')

print('\nDistribución por Tipo de Interacción:')
for k, v in Counter(x['tipoInteraccionLabel'] for x in master_items).items():
    print(f'  {k}: {v}')
