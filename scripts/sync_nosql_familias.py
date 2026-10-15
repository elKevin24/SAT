import json
import os

FAMS_PATH = 'database/nosql_mongodb/cat_familias.json'
GESTIONES_PATH = 'database/nosql_mongodb/gestiones.json'
GESTIONES_ROOT = 'database/gestiones.json'

with open(FAMS_PATH, 'r', encoding='utf-8') as f:
    fams = json.load(f)

slug_to_oid = {f['slug']: f['_id'] for f in fams}

def classify(nombre, desc):
    text = f"{nombre} {desc}".lower()
    res = []
    if any(k in text for k in ['fel', 'factur', 'dte']): res.append('fel')
    if any(k in text for k in ['vehiculo', 'vehículo', 'placa', 'iscv', 'traspaso', 'iprima', 'calcoman']): res.append('vehiculos')
    if any(k in text for k in ['rtu', 'nit', 'inscripcion', 'inscripción', 'tributario unificado']): res.append('rtu-digital')
    if any(k in text for k in ['duca', 'dua', 'aduanera', 'despacho', 'arancel', 'embarque']): res.append('ducas')
    if any(k in text for k in ['solvencia', 'convenio']): res.append('solvencia-fiscal')
    if any(k in text for k in ['29-89', 'maquila', 'perfeccionamiento']): res.append('maquilas-29-89')
    if 'zdeep' in text: res.append('zdeep')
    if any(k in text for k in ['afpa', 'auxiliar', 'agente aduanero', 'apoderado', 'carné', 'carne', 'courier', 'transportista aduanero', 'depósito aduanero']): res.append('afpa')
    if 'agencia virtual' in text: res.append('agencia-virtual')
    if any(k in text for k in ['exent', 'franquicia', 'diplomatic', 'civa']): res.append('exenciones')
    return res

for target_file in [GESTIONES_PATH, GESTIONES_ROOT]:
    if not os.path.exists(target_file):
        continue
    with open(target_file, 'r', encoding='utf-8') as f:
        gestiones = json.load(f)

    updated = 0
    for g in gestiones:
        nombre = g.get('nombre', '')
        desc = g.get('descripcion', '')
        slugs = classify(nombre, desc)
        oids = [slug_to_oid[s] for s in slugs if s in slug_to_oid]
        g['familias_ids'] = oids
        if oids:
            updated += 1

    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(gestiones, f, ensure_ascii=False, indent=2)

    print(f"{target_file}: {updated} de {len(gestiones)} gestiones vinculadas a familias temáticas.")
