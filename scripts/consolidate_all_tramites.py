import json, re

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

# Helper para normalizar texto
def clean(t):
    if not t: return ''
    t = t.replace('\xa0', ' ').replace('\r', ' ').replace('\n', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# 1. Mapeo a los 9 Grupos Oficiales oficiales
def get_grupo_oficial(item):
    cat = clean(item.get('categoria', ''))
    pillar = clean(item.get('pillar', ''))

    if cat == 'NIT sin Obligaciones':
        return 1, 'NIT sin Obligaciones'
    if cat == 'Pequeños Contribuyentes':
        return 2, 'Pequeños Contribuyentes'
    if cat == 'Contribuyente General':
        return 3, 'Contribuyente General'
    if cat == 'Contribuyentes Especiales':
        return 4, 'Contribuyentes Especiales'
    if cat in ['Importadores', 'Exportadores']:
        return 5, 'Importadores y Exportadores'
    if cat in ['Constitucionales', 'Decreto', 'No Lucrativos', 'Municipalidades']:
        return 6, 'Exentos'
    if cat in ['Abogados y Notarios', 'Peritos Contadores', 'Auditores', 'Gestores Tributarios', 'Servicios Profesionales']:
        return 7, 'Profesionales'
    if cat in ['Transportistas', 'Agentes Aduaneros', 'Almacenes Fiscales', 'Courier', 'OEA', 'Normativa y Aranceles']:
        return 8, 'Auxiliares de la Función Pública Aduanera (AFPA)'
    if cat == 'Entidades del Estado':
        return 9, 'Entidades del Estado'

    # Fallbacks por pilar
    if pillar == 'contribuyentes':
        return 3, 'Contribuyente General'
    if pillar == 'comercio_exterior':
        return 8, 'Auxiliares de la Función Pública Aduanera (AFPA)'
    if pillar == 'profesionales':
        return 7, 'Profesionales'
    if pillar == 'entes_exentos':
        return 6, 'Exentos'

    return 3, 'Contribuyente General'

# 2. Clasificación Etapa Ciclo de Vida ATO
def classify_ato(item):
    text = f"{item.get('tramite', '')} {item.get('subcategoria', '')} {item.get('tema', '')} {item.get('subtema', '')}".lower()
    
    if any(k in text for k in ['cese', 'cerrar', 'cierre', 'suspensión', 'suspension', 'cancelación', 'cancelacion', 'fallecimiento', 'inactivación', 'inactivacion', 'baja', 'actualización', 'actualizacion', 'cambio de régimen', 'cambio de regimen', 'modificación', 'modificacion']):
        return 'modificar_cerrar', '4. Modificaciones y cierre'
        
    if any(k in text for k in ['inscripción', 'inscripcion', 'primer nit', 'primera vez', 'solicitar nit', 'habilitación', 'habilitacion', 'acreditación', 'acreditacion', 'autorización inicial', 'afiliación', 'afiliacion', 'registro de títulos', 'registro inicial']):
        return 'empezar', '1. Empezar y registrarse'
        
    if any(k in text for k in ['consulta', 'consultar', 'verificador', 'verificación', 'verificacion', 'solvencia fiscal', 'estado de cuenta', 'rampa', 'retención', 'retencion', 'liberación', 'liberacion', 'monitoreo', 'arancel integrado', 'manifiesto', 'sistema de cobro']):
        return 'consultar', '3. Consultas y herramientas'
        
    if any(k in text for k in ['legislación', 'legislacion', 'preguntas frecuentes', 'capacitación', 'capacitacion', 'devolución de crédito', 'devolucion', 'devolución de dai', 'impugnación', 'recursos administrativos', 'criterios institucionales', 'normas']):
        return 'normativa', '5. Normativa y asistencia'
        
    return 'operar', '2. Operación y declaraciones'

# 3. Clasificación Tipo de Interacción
def classify_interaction(item):
    t = clean(item.get('tramite', '')).lower()
    u = clean(item.get('url', '')).lower()
    
    if any(k in t for k in ['activex', 'software', 'descarga', 'instalador', 'componente']):
        return 'descarga_recurso', 'Descarga / Software'
        
    if any(k in t for k in ['consulta', 'consultar', 'rampa', 'retención', 'retencion', 'liberación', 'liberacion', 'monitoreo', 'arancel integrado', 'manifiesto', 'verificador', 'estado de cuenta']):
        return 'consulta_datos', 'Consulta a Base de Datos'
        
    if any(k in t for k in ['declaración', 'declaracion', 'duca', 'solvencia fiscal', 'seguro de caución', 'fianza', 'inscripción', 'inscripcion', 'renovación', 'renovacion', 'franquicias electrónicas', 'transmisión', 'transmision', 'formulario declaraguate', 'sat-', 'solicitud electrónica', 'agencia virtual', 'factura electrónica', 'fel', 'traspaso']):
        return 'servicio_transaccional', 'Trámite / Aplicativo en Línea'
        
    return 'guia_informativa', 'Guía Informativa / Texto'

# 4. Enriquecer allTramites.json
consolidated = []
for item in tramites:
    gno, gnom = get_grupo_oficial(item)
    e_id, e_lbl = classify_ato(item)
    t_id, t_lbl = classify_interaction(item)
    es_brecha = '[propuesta brecha]' in item.get('tramite', '').lower() or '[propuesta brecha]' in item.get('descripcion', '').lower()

    enriched = dict(item)
    enriched['grupoNo'] = gno
    enriched['grupoNombre'] = gnom
    enriched['etapaAto'] = e_id
    enriched['etapaAtoLabel'] = e_lbl
    enriched['tipoInteraccion'] = t_id
    enriched['tipoInteraccionLabel'] = t_lbl
    enriched['esBrecha'] = es_brecha
    consolidated.append(enriched)

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(consolidated, f, ensure_ascii=False, indent=2)

print(f"allTramites.json consolidado con éxito: {len(consolidated)} trámites enriquecidos directamente.")
