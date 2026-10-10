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
    audiencias = []
    for it in items:
        seg_id = it.get('pillar', '')
        seg_nom = it.get('segmento') or it.get('pillarName', '')
        cat = it.get('categoria', '')
        subcat = it.get('subcategoria', '')
        miga = it.get('migaBreadcrumb', '')
        
        audiencias.append({
            'tramiteId': it.get('id'),
            'segmentoId': seg_id,
            'segmentoNombre': seg_nom,
            'orden_n1': it.get('orden_n1', 1),
            'orden_n2': it.get('orden_n2', 1),
            'orden_n3': it.get('orden_n3', 1),
            'orden_n4': it.get('orden_n4', 1),
            'orden_n5': it.get('orden_n5', 1),
            'categoria': cat,
            'subcategoria': subcat,
            'tema': it.get('tema') or '',
            'subtema': it.get('subtema') or '',
            'actorEspecifico': it.get('actorEspecifico') or '—',
            'migaBreadcrumb': miga
        })

    # Segmentos y categorías aplicables
    segmentos_set = sorted(list(set(a['segmentoId'] for a in audiencias)))
    categorias_set = sorted(list(set(a['categoria'] for a in audiencias)))

    # Rutas de proceso combinadas
    rutas_combinadas = []
    seen_rutas = set()
    for it in items:
        for rp in it.get('rutasProceso', []):
            rk = (rp.get('procesoNo'), rp.get('pasoNo'))
            if rk not in seen_rutas:
                seen_rutas.add(rk)
                rutas_combinadas.append(rp)

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
        'esTransversal': len(audiencias) > 1,
        'totalAudiencias': len(audiencias),
        'audiencias': audiencias,
        'segmentosAplicables': segmentos_set,
        'categoriasAplicables': categorias_set,
        'perfilDestinatario': rep.get('perfilDestinatario', '')
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
