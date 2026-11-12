import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    at = json.load(f)

with open('src/data/catalogoContenidosUnicos.json', 'r', encoding='utf-8') as f:
    cu = json.load(f)

at_by_id = {}
for t in at:
    tid = t.get('id')
    if tid:
        at_by_id[tid] = t

fields_to_sync = [
    'nombreActual', 'descripcion', 'requisitos', 'documentos',
    'pasos', 'resultadoObtenido', 'tiempoEstimado', 'costo',
    'advertencia', 'normativa'
]

synced_count = 0
for u in cu:
    code = u.get('codigo') or u.get('id')
    if code in at_by_id:
        source = at_by_id[code]
        updated = False
        for fld in fields_to_sync:
            if fld in source and source[fld] != u.get(fld):
                u[fld] = source[fld]
                updated = True
        if updated:
            synced_count += 1

print(f"Synced {synced_count} unique items in catalogoContenidosUnicos.json.")

with open('src/data/catalogoContenidosUnicos.json', 'w', encoding='utf-8') as f:
    json.dump(cu, f, ensure_ascii=False, indent=2)
