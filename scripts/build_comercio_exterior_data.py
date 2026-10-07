import zipfile, xml.etree.ElementTree as ET, json, re, os

EXCEL_PATH = 'docs/Arbol_de_Navegacion_Portal_v5.xlsx'
OUTPUT_JSON = 'src/data/comercioExteriorData.json'

with zipfile.ZipFile(EXCEL_PATH, 'r') as z:
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    sheet_id = [s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id') 
                for s in wb.findall('.//ns:sheet', ns) if 'comercio exterior' in s.attrib.get('name', '').lower()][0]
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    target = [r.attrib.get('Target') for r in rels if r.attrib.get('Id') == sheet_id][0]
    sheet_path = 'xl/' + target if not target.startswith('/') else target[1:]
    
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('.//ns:si', ns):
            ss.append(''.join([t.text or '' for t in si.findall('.//ns:t', ns)]))
    
    sheet_tree = ET.fromstring(z.read(sheet_path))
    rows = []
    for r in sheet_tree.findall('.//ns:row', ns):
        row_vals = []
        for c in r.findall('ns:c', ns):
            v = c.find('ns:v', ns)
            t = c.attrib.get('t')
            val = ''
            if v is not None and v.text is not None:
                if t == 's':
                    idx = int(v.text)
                    val = ss[idx] if idx < len(ss) else ''
                else:
                    val = v.text
            row_vals.append(val.strip())
        rows.append(row_vals)

SUBTEMA_MAP = {
    'registro y acreditación': ('registro_acreditacion', 'Registro y acreditación'),
    'registro y acreditacion': ('registro_acreditacion', 'Registro y acreditación'),
    'operaciones y trámites': ('operaciones_tramites', 'Operaciones y trámites'),
    'operaciones y tramites': ('operaciones_tramites', 'Operaciones y trámites'),
    'consultas y seguimiento': ('consultas_seguimiento', 'Consultas y seguimiento'),
    'normativa y recursos': ('normativa_recursos', 'Normativa y recursos'),
}

def clean_text(t):
    if not t: return ''
    t = t.replace('\xa0', ' ').replace('\r', ' ').replace('\n', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def make_actor_id(actor, tema):
    a_low = actor.lower()
    t_low = tema.lower()
    if '1.1' in a_low or 'compartido' in a_low:
        return 'importadores_exportadores_compartido'
    if '1.2' in a_low or 'exportadores' in a_low:
        return 'exportadores'
    if '2.1' in a_low or 'agentes' in a_low:
        return 'agentes_aduaneros'
    if '2.2' in a_low or 'apoderados' in a_low:
        return 'apoderados_especiales'
    if '2.3' in a_low or 'courier' in a_low or 'entrega rápida' in a_low:
        return 'courier_entrega_rapida'
    if 'depósito' in a_low or 'deposito' in a_low or 'almacen' in a_low:
        if 'fiscal' in t_low:
            return 'almacenes_fiscales'
        elif 'general' in t_low:
            return 'almacenes_generales'
        elif 'temporal' in t_low or 'dat' in t_low:
            return 'depositos_temporales_dat'
        return 'almacenes_fiscales'
    if 'administradora' in a_low or 'entidades' in a_low:
        return 'entidades_administradoras_zdeep'
    if 'usuario' in a_low or 'zdeep' in a_low:
        return 'usuarios_zdeep'
    if 'transport' in a_low:
        return 'transportistas_aduaneros'
    return 'general'

def make_actor_name(actor_id):
    names = {
        'importadores_exportadores_compartido': 'Importadores y Exportadores (General)',
        'exportadores': 'Exportadores',
        'agentes_aduaneros': 'Agentes Aduaneros',
        'apoderados_especiales': 'Apoderados Especiales Aduaneros',
        'courier_entrega_rapida': 'Empresas Courier y Entrega Rápida',
        'almacenes_fiscales': 'Almacenes Fiscales',
        'almacenes_generales': 'Almacenes Generales de Depósito',
        'depositos_temporales_dat': 'Depósitos Aduaneros Temporales (DAT)',
        'entidades_administradoras_zdeep': 'Entidades Administradoras (ZDEEP)',
        'usuarios_zdeep': 'Usuarios de ZDEEP',
        'transportistas_aduaneros': 'Transportistas Aduaneros de Carga'
    }
    return names.get(actor_id, 'Auxiliar Aduanero')

def make_actor_desc(actor_id):
    descs = {
        'importadores_exportadores_compartido': 'Personas y empresas dedicadas al ingreso o envío internacional de mercancías a través de las aduanas del país.',
        'exportadores': 'Productores y comercializadores que despachan bienes o servicios al mercado internacional y gestionan devolución de IVA.',
        'agentes_aduaneros': 'Profesionales autorizados por SAT para representar a importadores y tramitar el despacho aduanero de mercancías.',
        'apoderados_especiales': 'Representantes aduaneros exclusivos de una empresa autorizados para despachar directamente sus mercancías ante la SAT.',
        'courier_entrega_rapida': 'Operadores logísticos autorizados para el despacho ágil de encomiendas, paquetes urgentes y compras por internet.',
        'almacenes_fiscales': 'Recintos aduaneros autorizados para almacenar mercancías extranjeras con suspensión temporal de impuestos arancelarios.',
        'almacenes_generales': 'Auxiliares de crédito facultados para custodiar mercancías, emitir títulos de crédito y operar bodegas fiscales afianzadas.',
        'depositos_temporales_dat': 'Instalaciones portuarias o aeroportuarias autorizadas para la custodia transitoria de mercancías antes de su despacho.',
        'entidades_administradoras_zdeep': 'Organizaciones autorizadas para delimitar, administrar garitas y supervisar polígonos de zonas económicas especiales.',
        'usuarios_zdeep': 'Empresas industriales, comerciales o de servicios instaladas dentro de ZDEEP que gozan de incentivos fiscales y aduaneros.',
        'transportistas_aduaneros': 'Empresas y conductores autorizados para el traslado de carga bajo control aduanero en tránsitos nacionales e internacionales.'
    }
    return descs.get(actor_id, 'Auxiliar aduanero debidamente autorizado ante la Intendencia de Aduanas.')

def classify_interaction(tramite, url):
    t = tramite.lower()
    u = url.lower()
    
    if any(k in t for k in ['activex', 'software', 'descarga de aplicaciones', 'instalador']):
        return 'descarga_recurso', 'Descarga / Software'
    
    if any(k in t for k in ['consulta', 'consultar', 'rampa', 'retención', 'retencion', 'liberación', 'liberacion', 'monitoreo', 'arancel integrado', 'manifiesto', 'sistema de cobro por permanencia']):
        return 'consulta_datos', 'Consulta a Base de Datos'
        
    if any(k in t for k in ['declaración', 'declaracion', 'duca', 'solvencia fiscal', 'seguro de caución', 'fianza', 'inscripción', 'inscripcion', 'renovación', 'renovacion', 'franquicias electrónicas', 'transmisión', 'transmision', 'registro de', 'habilitación', 'habilitacion', 'rectificación', 'rectificacion', 'anulación', 'anulacion']):
        return 'servicio_transaccional', 'Trámite / Aplicativo en Línea'
        
    if any(k in t for k in ['legislación', 'legislacion', 'preguntas frecuentes', 'capacitación', 'capacitacion', 'manual', 'instructivo', 'guía', 'guia', 'procedimientos', 'requisitos', 'cultura']):
        return 'guia_informativa', 'Guía Informativa / Texto'
        
    return 'guia_informativa', 'Guía Informativa / Texto'

items = []
count = 0

for idx, r in enumerate(rows):
    if len(r) >= 5 and (r[0].startswith('1.') or r[0].startswith('2.') or r[0].startswith('3.')):
        grupo_raw = clean_text(r[0])
        actor_raw = clean_text(r[1])
        tema_raw = clean_text(r[2]) if len(r) > 2 else ''
        subtema_raw = clean_text(r[3]) if len(r) > 3 else ''
        nombre_raw = clean_text(r[4]) if len(r) > 4 else ''
        url_raw = clean_text(r[5]) if len(r) > 5 else ''
        
        if not nombre_raw:
            continue
            
        count += 1
        subtema_key = subtema_raw.lower()
        sub_info = SUBTEMA_MAP.get(subtema_key, ('operaciones_tramites', 'Operaciones y trámites'))
        
        actor_id = make_actor_id(actor_raw, tema_raw)
        actor_nombre = make_actor_name(actor_id)
        
        es_brecha = '[propuesta brecha]' in nombre_raw.lower()
        nombre_limpio = re.sub(r'\[Propuesta brecha\]', '', nombre_raw, flags=re.IGNORECASE).strip()
        
        # Grupo numerico oficial
        if grupo_raw.startswith('1.'):
            grupo_no = 5
            grupo_nombre = 'Importadores y Exportadores'
        elif grupo_raw.startswith('2.'):
            grupo_no = 8
            grupo_nombre = 'Auxiliares de la Función Pública Aduanera (AFPA)'
        else:
            grupo_no = 8 # extension aduanera territorial
            grupo_nombre = 'Regímenes Territoriales y Zonas Especiales'
            
        # Generar ID
        item_id = f'ce-{grupo_no}-{actor_id}-{count:03d}'
        
        # Descripcion UX Writing concisa
        desc = f'Gestión oficial de {nombre_limpio.lower()} para {actor_nombre.lower()}.'
        if es_brecha:
            desc = f'Propuesta normativa identificada para incorporar este requisito en la Intendencia de Aduanas.'
        tipo_int, tipo_lbl = classify_interaction(nombre_limpio, url_raw)
        
        items.append({
            'id': item_id,
            'macrogrupo': 'comercio_exterior',
            'grupoNo': grupo_no,
            'grupoCodigo': grupo_raw,
            'grupoNombre': grupo_nombre,
            'actorId': actor_id,
            'actorNombre': actor_nombre,
            'temaEspecializado': tema_raw if tema_raw and tema_raw != '—' else None,
            'subtemaId': sub_info[0],
            'subtemaLabel': sub_info[1],
            'tipoInteraccion': tipo_int,
            'tipoInteraccionLabel': tipo_lbl,
            'tramite': nombre_limpio,
            'tramiteOriginal': nombre_raw,
            'descripcion': desc,
            'url': url_raw or 'https://portal.sat.gob.gt/portal/aduanas/',
            'esBrecha': es_brecha
        })

# Agregar los 5 items de brechas auditadas de Almacenes Fiscales
brechas_almacenes = [
    {
        'subtemaId': 'operaciones_tramites',
        'subtemaLabel': 'Operaciones y trámites',
        'tramite': 'Declaración y reporte de mercancías en abandono legal (Art. 124 RECAUCA)',
        'descripcion': 'Notificación obligatoria ante la aduana de mercancías con más de 1 año en depósito fiscal para subasta pública.',
        'url': 'https://portal.sat.gob.gt/portal/aduanas/'
    },
    {
        'subtemaId': 'operaciones_tramites',
        'subtemaLabel': 'Operaciones y trámites',
        'tramite': 'Procedimiento para destrucción de mercancías bajo custodia fiscal',
        'descripcion': 'Trámite con presencia de delegados SAT para destruir mercancías dañadas o vencidas sin pago forzoso de impuestos.',
        'url': 'https://portal.sat.gob.gt/portal/procedimientos-aduanas/'
    },
    {
        'subtemaId': 'registro_acreditacion',
        'subtemaLabel': 'Registro y acreditación',
        'tramite': 'Inspección técnica para ampliación o modificación de bodegas del recinto fiscal',
        'descripcion': 'Autorización y verificación de infraestructura, cámaras de seguridad CCTV y garitas para ampliar el área afianzada.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-de-aduanas/'
    },
    {
        'subtemaId': 'registro_acreditacion',
        'subtemaLabel': 'Registro y acreditación',
        'tramite': 'Endoso y sustitución de pólizas de caución operativa',
        'descripcion': 'Actualización bancaria de la póliza de fianza aduanera ante cambios en el promedio mensual de tributos custodiados.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/recepcion-de-seguro-de-caucion-importacion-y-admision-temporal/'
    },
    {
        'subtemaId': 'consultas_seguimiento',
        'subtemaLabel': 'Consultas y seguimiento',
        'tramite': 'Certificación y calibración periódica de básculas aduaneras de pesaje',
        'descripcion': 'Presentación de constancias de calibración técnica de sistemas de pesaje en garitas bajo programa MIAD.',
        'url': 'https://portal.sat.gob.gt/portal/programa-miad/'
    }
]

for b in brechas_almacenes:
    count += 1
    b_tipo, b_lbl = classify_interaction(b['tramite'], b['url'])
    items.append({
        'id': f'ce-8-almacenes_fiscales-{count:03d}',
        'macrogrupo': 'comercio_exterior',
        'grupoNo': 8,
        'grupoCodigo': '2. Auxiliares de la Función Pública Aduanera (AFPA)',
        'grupoNombre': 'Auxiliares de la Función Pública Aduanera (AFPA)',
        'actorId': 'almacenes_fiscales',
        'actorNombre': 'Almacenes Fiscales',
        'temaEspecializado': 'Almacenes Fiscales',
        'subtemaId': b['subtemaId'],
        'subtemaLabel': b['subtemaLabel'],
        'tipoInteraccion': b_tipo,
        'tipoInteraccionLabel': b_lbl,
        'tramite': b['tramite'],
        'tramiteOriginal': f"[Propuesta brecha] {b['tramite']}",
        'descripcion': b['descripcion'],
        'url': b['url'],
        'esBrecha': True
    })

# Guardar JSON limpio
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f'EXITO: Exportados {len(items)} items a {OUTPUT_JSON}')
