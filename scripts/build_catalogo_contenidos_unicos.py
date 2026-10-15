import json
import re

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
OUTPUT_CATALOGO_PATH = 'src/data/catalogoContenidosUnicos.json'
OUTPUT_NOSQL_PATH = 'database/sat_portal_nosql.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

def clean_title(t):
    return re.sub(r'\s+', ' ', (t or '').strip().lower())

def clean_url(u):
    return (u or '').strip().rstrip('/')

# Agrupar por contenido conceptual único:
# La clave canónica combina el título limpio y la URL base (o URL exacta si es única).
# En los casos donde el título es idéntico y comparten servicio, se fusionan las audiencias.
grupos_contenido = {}

for item in master_data:
    t_clean = clean_title(item.get('tramite'))
    u_clean = clean_url(item.get('url'))
    
    # Clave de unicidad:
    # Si dos registros tienen el mismo título de trámite, representan el mismo contenido/servicio
    # presentado a diferentes audiencias.
    key = t_clean
    grupos_contenido.setdefault(key, []).append(item)

catalogo_unicos = []
codigo_idx = 1

for title_key, items in grupos_contenido.items():
    # Seleccionar el ítem representativo (priorizando el que tenga más campos ricos o URL más específica)
    rep = items[0]
    for it in items:
        if len(it.get('descripcion', '')) > len(rep.get('descripcion', '')):
            rep = it
        if it.get('rutasProceso') and not rep.get('rutasProceso'):
            rep = it

    # Generar ID canónico único y código oficial de gestión
    canonical_id = f"cnt-{rep.get('id')}"
    codigo_str = f"SAT-GES-{codigo_idx:04d}"
    codigo_idx += 1

    # Construir lista consolidada de audiencias (cada nodo de árbol donde se publica el contenido)
    tramite_ids = [it.get('id') for it in items]
    ubicaciones = [{'tramiteId': it.get('id'), 'segmentoId': it.get('pillar', '')} for it in items]
    segmentos_set = sorted(list(set(it.get('pillar', '') for it in items if it.get('pillar'))))
    categorias_set = sorted(list(set(it.get('categoria', '') for it in items if it.get('categoria'))))

    # Rutas de proceso combinadas
    rutas_combinadas = []
    seen_rutas = set()
    for it in items:
        for rp in it.get('rutasProceso', []):
            rk = (rp.get('procesoNo'), rp.get('pasoNo'))
            if rk not in seen_rutas:
                seen_rutas.add(rk)
                rutas_combinadas.append(rp)

    # Familias temáticas canónicas (cat_familias)
    text_content = f"{rep.get('tramite', '')} {rep.get('descripcion', '')} {rep.get('categoria', '')} {rep.get('subcategoria', '')} {rep.get('tema', '')}".lower()
    fam_ids = []
    fam_labels = []
    if any(k in text_content for k in ['fel', 'factur', 'dte']):
        fam_ids.append('fel')
        fam_labels.append('FAM-01 Factura Electrónica en Línea (FEL)')
    if any(k in text_content for k in ['vehiculo', 'vehículo', 'placa', 'iscv', 'traspaso', 'iprima', 'calcoman']):
        fam_ids.append('vehiculos')
        fam_labels.append('FAM-02 Registro Fiscal de Vehículos (RFV)')
    if any(k in text_content for k in ['rtu', 'nit', 'inscripcion', 'inscripción', 'tributario unificado']):
        fam_ids.append('rtu-digital')
        fam_labels.append('FAM-03 Registro Tributario Unificado (RTU) Digital')
    if any(k in text_content for k in ['duca', 'dua', 'aduanera', 'despacho', 'arancel', 'embarque']):
        fam_ids.append('ducas')
        fam_labels.append('FAM-04 Declaraciones Aduaneras (DUCAs)')
    if any(k in text_content for k in ['solvencia', 'convenio']):
        fam_ids.append('solvencia-fiscal')
        fam_labels.append('FAM-05 Solvencias y Convenios de Pago')
    if any(k in text_content for k in ['29-89', 'maquila', 'perfeccionamiento']):
        fam_ids.append('maquilas-29-89')
        fam_labels.append('FAM-06 Regímenes Especiales y Maquilas (Dto. 29-89)')
    if 'zdeep' in text_content:
        fam_ids.append('zdeep')
        fam_labels.append('FAM-07 Zonas de Desarrollo Económico Especial Público (ZDEEP)')
    if any(k in text_content for k in ['afpa', 'auxiliar', 'agente aduanero', 'apoderado', 'carné', 'carne', 'courier', 'transportista aduanero', 'depósito aduanero']):
        fam_ids.append('afpa')
        fam_labels.append('FAM-08 Auxiliares de la Función Pública Aduanera (AFPA)')
    if 'agencia virtual' in text_content:
        fam_ids.append('agencia-virtual')
        fam_labels.append('FAM-09 Agencia Virtual y Servicios Remotos')
    if any(k in text_content for k in ['exent', 'franquicia', 'diplomatic', 'civa']):
        fam_ids.append('exenciones')
        fam_labels.append('FAM-10 Franquicias y Exenciones Tributarias')

    doc = {
        'id': canonical_id,
        'codigo': codigo_str,
        'idOriginal': rep.get('id'),
        'titulo': rep.get('tramite'),
        'nombreActual': rep.get('nombreActual') or rep.get('tramite'),
        'descripcion': rep.get('descripcion', ''),
        'url': rep.get('url', ''),
        'tipoInteraccion': rep.get('tipoInteraccion', 'guia_informativa'),
        'tipoInteraccionLabel': rep.get('tipoInteraccionLabel', 'Guía Informativa / Texto'),
        'tipologiaContenido': rep.get('tipologiaContenido', 'guia_requisitos'),
        'tipologiaContenidoLabel': rep.get('tipologiaContenidoLabel', 'Guía Informativa / Texto'),
        'plataformaSistema': rep.get('plataformaSistema', 'portal_web'),
        'plataformaSistemaLabel': rep.get('plataformaSistemaLabel', 'Portal Web SAT'),
        'canalAtencion': rep.get('canalAtencion', 'Digital / Web'),
        'etapaAto': rep.get('etapaAto', 'operar'),
        'etapaAtoLabel': rep.get('etapaAtoLabel', 'Operación y declaraciones'),
        'baseLegal': rep.get('baseLegal', 'Código Tributario y Leyes Aplicables'),
        'esBrecha': bool(rep.get('esBrecha', False)),
        'esTransversal': len(items) > 1,
        'totalAudiencias': len(items),
        'tramiteIds': tramite_ids,
        'ubicaciones': ubicaciones,
        'segmentosAplicables': segmentos_set,
        'categoriasAplicables': categorias_set,
        'perfilDestinatario': rep.get('perfilDestinatario', ''),
        'familias_ids': fam_ids,
        'familiaTematica': "; ".join(fam_labels) if fam_labels else "Normativa y Gestiones Generales"
    }

    if rutas_combinadas:
        doc['rutasProceso'] = rutas_combinadas

    catalogo_unicos.append(doc)

# Guardar en src/data/catalogoContenidosUnicos.json
with open(OUTPUT_CATALOGO_PATH, 'w', encoding='utf-8') as f:
    json.dump(catalogo_unicos, f, ensure_ascii=False, indent=2)

print(f"Catálogo de contenidos únicos creado: {len(catalogo_unicos)} registros en {OUTPUT_CATALOGO_PATH}")

# Guardar versión NoSQL en database/sat_portal_nosql.json
with open(OUTPUT_NOSQL_PATH, 'w', encoding='utf-8') as f:
    json.dump(catalogo_unicos, f, ensure_ascii=False, indent=2)

print(f"Base NoSQL sincronizada: {len(catalogo_unicos)} documentos en {OUTPUT_NOSQL_PATH}")

transversales = [c for c in catalogo_unicos if c['esTransversal']]
print(f"Contenidos transversales (multi-audiencia): {len(transversales)}")
for c in transversales[:5]:
    print(f"  * {c['codigo']} - {c['titulo']} -> {c['totalAudiencias']} audiencias: {c['categoriasAplicables']}")
